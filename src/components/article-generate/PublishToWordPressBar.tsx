// src/components/article-generate/PublishToWordPressBar.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Article } from "../../types";
import { wordpressService } from "../../services/api";
import { Spinner, CheckIcon, WordPressIcon } from "./UiBits";
import { PlanStatusBadge } from "../Layout";
import { t } from "../../i18n";

export type WpBusyAction = "publish" | "update" | "delete" | null;

/** مقصد انتشار سایت */
export type PublishProvider = "wordpress" | "shopify";

export interface PublishToWordPressBarProps {
  siteId: number | string;
  article: Article;
  busy: WpBusyAction;
  error: string | null;
  justSucceeded: boolean;
  onPublish: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onDismissError: () => void;
  /** مقصد انتشار سایت. اگر داده نشود، از روی مقاله حدس زده می‌شود
   *  (اگر shopify_article_id داشته باشد → mixin، وگرنه wordpress).
   *  برای مقاله‌ی هنوز منتشرنشده حتماً از والد پاس بده. */
  provider?: PublishProvider;
  /** وقتی مقدار داشته باشد، بج وضعیت پلن (Pro / ارتقا پلن) کنارِ عنوانِ مقاله
   *  در سمتِ راستِ نوار نمایش داده می‌شود — فقط در دسکتاپ (lg به بالا). */
  isFreePlan?: boolean;
  /** در این حالت نوار بخشی از header واحد Chat Session است و header مستقل نمی‌سازد.
   *  توجه: این نوار فقط در دسکتاپ (lg+) رندر می‌شود. در موبایل به‌جای این نوار
   *  باید از کامپوننت WordPressHeaderControl (پایین همین فایل) داخل هدرِ موبایلِ
   *  Layout استفاده شود تا دو هدر روی هم قرار نگیرند. */
  embedded?: boolean;
}

// ---------- متن‌ها بر اساس مقصد ----------

const providerCopy = (provider: "wordpress" | "shopify") => {
  const name = provider === "wordpress" ? "WordPress" : "Shopify";
  return {
    name,
    connect: t("article.publish.connect", { platform: name }),
    notConnected: t("article.publish.notConnected", { platform: name }),
    publish: t("article.publish.publishTo", { platform: name }),
    update: t("article.publish.updateOn", { platform: name }),
    remove: t("article.publish.removeFrom", { platform: name }),
    draft: t("article.publish.draftOn", { platform: name }),
    view: `${t("article.publish.viewOn", { platform: name })} ↗`,
  };
};

/** آیکن مقصد: وردپرس آیکن خودش را دارد، Shopify یک آیکن عمومی (ارسال). */
const ProviderIcon: React.FC<{ provider: PublishProvider }> = ({ provider }) =>
  provider === "wordpress" ? (
    <WordPressIcon />
  ) : (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
  );

type ArticleMeta = {
  wp_post_id?: number | string | null;
  wp_sync_status?: "not_synced" | "syncing" | "synced" | "failed" | null;
  wp_permalink?: string | null;
  shopify_article_id?: string | null;
  shopify_url?: string | null;
  publish_status?: "draft" | "published" | null;
};

function getMeta(article: Article): ArticleMeta {
  return article as unknown as ArticleMeta;
}

function resolveProvider(article: Article, provider?: PublishProvider): PublishProvider {
  if (provider) return provider;
  return getMeta(article).shopify_article_id ? "shopify" : "wordpress";
}

/** شناسه و لینک مقاله در مقصد (برای Shopify: shopify_article_id / shopify_url) */
function getRemoteInfo(article: Article, provider: PublishProvider) {
  const m = getMeta(article);
  const remoteId = provider === "shopify" ? m.shopify_article_id : m.wp_post_id;
  const remoteUrl = provider === "shopify" ? m.shopify_url : m.wp_permalink;

  // wp_sync_status و publish_status در بک‌اند برای هر دو مقصد مشترک است.
  const alreadySynced = Boolean(remoteId) && m.wp_sync_status === "synced";
  const isDraft = alreadySynced && m.publish_status === "draft";

  return { alreadySynced, isDraft, remoteUrl: remoteUrl ?? null };
}

/** وضعیت اتصال سایت به مقصد انتشار — مشترک بین نوار دسکتاپ و دکمه‌ی موبایل،
 *  تا هر دو یک منطق و یک درخواست شبکه داشته باشند. */
function usePublishTarget(
  siteId: number | string,
  article: Article,
  providerProp?: PublishProvider
) {
  const [state, setState] = useState<{
    connected: boolean | null;
    backendProvider: PublishProvider | null;
  }>({ connected: null, backendProvider: null });

  const check = useCallback(async () => {
    if (!siteId) return;
    try {
      // بک‌اند مقصد سایت را مشخص می‌کند: اگر سایت shopifyConnection داشته باشد
      // provider = "shopify" است، وگرنه "wordpress".
      const res = await wordpressService.show(siteId);
      const backendProvider: PublishProvider =
        res?.data?.provider === "shopify" ? "shopify" : "wordpress";
      const status = res?.data?.data?.status;

      setState({
        backendProvider,
        // سایتِ Shopify اتصال وردپرس ندارد؛ وجودِ shopifyConnection یعنی «متصل».
        connected: backendProvider === "shopify" ? true : status === "connected",
      });
    } catch {
      setState((s) => ({ ...s, connected: false }));
    }
  }, [siteId]);

  useEffect(() => {
    check();
  }, [check]);

  const provider = state.backendProvider ?? resolveProvider(article, providerProp);

  return { provider, connected: state.connected };
}

export const PublishToWordPressBar: React.FC<PublishToWordPressBarProps> = ({
  siteId,
  article,
  busy,
  error,
  justSucceeded,
  onPublish,
  onUpdate,
  onDelete,
  onDismissError,
  provider: providerProp,
  isFreePlan,
  embedded = false,
}) => {
  const navigate = useNavigate();
  const { provider, connected } = usePublishTarget(siteId, article, providerProp);
  const copy = providerCopy(provider);
  const { alreadySynced, isDraft, remoteUrl } = getRemoteInfo(article, provider);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isBusy = busy !== null;
  const canPublish = article.status === "completed" && !isBusy && connected === true;
  const checkingConnection = connected === null;

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setConfirmDelete(false);
    onDelete();
  };

  const goConnect = () => {
    navigate(`/sites/${siteId}/dashboard`);
  };

  // نکته‌ی مهم: این نوار دیگر در موبایل رندر نمی‌شود («hidden lg:block»)،
  // چون باعث می‌شد دو هدر روی هم بیفتد و فضای زیادی از بالای صفحه گرفته شود.
  // در موبایل باید WordPressHeaderControl را داخل هدر Layout قرار دهید.
  const headerClassName = embedded
    ? "hidden lg:block fixed inset-x-0 top-0 z-40 border-b border-[#E4E5F0] bg-[#FAFAFE]/95 px-4 py-2.5 shadow-sm backdrop-blur lg:start-[var(--layout-content-right)] sm:px-6"
    : "sticky top-0 z-20 mb-4 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur sm:px-6";

  return (
    <div className={headerClassName}>
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 sm:gap-3 relative">
        <div className="flex min-w-0 items-center gap-3 relative z-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {alreadySynced && (
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isDraft ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {isDraft ? copy.draft : t("dashboard.publishStatus.published")}
                </span>
              )}
            </div>

            {!checkingConnection && connected === false && !alreadySynced && (
              <div className="text-[11px] font-bold text-amber-600">{copy.notConnected}</div>
            )}

            {connected !== false && !canPublish && !alreadySynced && !isBusy && !checkingConnection && (
              <div className="text-[11px] text-slate-400">
                {article.status === "failed"
                  ? t("article.publish.finishFirst")
                  : t("article.publish.whenReady")}
              </div>
            )}

            {alreadySynced && remoteUrl && (
              <a
                href={remoteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-slate-500 underline decoration-slate-200 underline-offset-2 hover:text-emerald-600"
              >
                {copy.view}
              </a>
            )}
          </div>
        </div>

        {isFreePlan !== undefined && (
          <div className="hidden lg:flex absolute inset-0 pointer-events-none items-center justify-center z-10">
            <div className="pointer-events-auto">
              <PlanStatusBadge
                isFreePlan={isFreePlan}
                onUpgrade={() => navigate("/subscription")}
                size="lg"
              />
            </div>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2 relative z-10">
          {checkingConnection ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-400"
            >
              <Spinner className="h-3.5 w-3.5" />
              {t("article.publish.checking")}
            </button>
          ) : !connected ? (
            <button
              type="button"
              onClick={goConnect}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-700"
            >
              <ProviderIcon provider={provider} />
              {copy.connect}
            </button>
          ) : !alreadySynced ? (
            <button
              type="button"
              onClick={onPublish}
              disabled={!canPublish}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "publish" ? <Spinner className="h-3.5 w-3.5 text-white" /> : <ProviderIcon provider={provider} />}
              {busy === "publish" ? t("article.publish.publishing") : copy.publish}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onUpdate}
                disabled={isBusy}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  justSucceeded && !isBusy ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-900 hover:bg-slate-700"
                }`}
              >
                {busy === "update" ? (
                  <Spinner className="h-3.5 w-3.5 text-white" />
                ) : justSucceeded ? (
                  <CheckIcon />
                ) : (
                  <ProviderIcon provider={provider} />
                )}
                {busy === "update" ? t("article.publish.updating") : justSucceeded ? t("article.publish.updated") : copy.update}
              </button>

              <button
                type="button"
                onClick={handleDeleteClick}
                onBlur={() => setConfirmDelete(false)}
                disabled={isBusy}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  confirmDelete ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
              >
                {busy === "delete" ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 2a1 1 0 00-1 1v1H4a1 1 0 000 2h12a1 1 0 100-2h-3V3a1 1 0 00-1-1H8zM5 7a1 1 0 011 1v8a2 2 0 002 2h4a2 2 0 002-2V8a1 1 0 112 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
                {busy === "delete" ? t("article.publish.deleting") : confirmDelete ? t("article.publish.confirmDelete") : copy.remove}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-auto mt-2 flex max-w-4xl items-center justify-between gap-3 rounded-xl bg-rose-50 px-3 py-2">
          <p className="text-[11px] font-bold text-rose-600">{error}</p>
          <button onClick={onDismissError} className="shrink-0 text-[11px] text-rose-400">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * دکمه‌ی جمع‌وجورِ انتشار برای هدرِ موبایل (وردپرس یا Shopify).
 * دقیقاً همان state و منطقِ PublishToWordPressBar را دارد، ولی به‌جای یک
 * نوارِ کامل، فقط یک دکمه‌ی کوچک با منوی کشویی نشان می‌دهد — تا کنار بج
 * پلن در هدرِ h-14 موبایل جا بگیرد و هدرِ دوم/اضافه ساخته نشود.
 *
 * استفاده (مثلاً در ArticleGeneratePage):
 *   Layout را با hideDesktopPlanBadge و mobileHeaderExtra={<WordPressHeaderControl .../>}
 *   صدا بزن، و PublishToWordPressBar را با embedded به‌عنوان children بگذار
 *   (آن فقط در دسکتاپ رندر می‌شود).
 */
export const WordPressHeaderControl: React.FC<
  Omit<PublishToWordPressBarProps, "isFreePlan" | "embedded">
> = ({
  siteId,
  article,
  busy,
  error,
  justSucceeded,
  onPublish,
  onUpdate,
  onDelete,
  onDismissError,
  provider: providerProp,
}) => {
  const navigate = useNavigate();
  const { provider, connected } = usePublishTarget(siteId, article, providerProp);
  const copy = providerCopy(provider);
  const { alreadySynced, isDraft, remoteUrl } = getRemoteInfo(article, provider);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // بستنِ منو با کلیک/تاچ روی هر جای بیرونِ دکمه یا خودِ منو — مستقل از
  // z-index و موقعیتِ فیکسِ منو (که دیگه لزوماً زیرِ دکمه نیست)، چون
  // مستقیم روی document گوش می‌دهیم، نه یک overlay که ممکن است پشتِ
  // عنصرهای دیگر (مثل هدر یا سایدبار) گیر کند.
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [menuOpen]);

  const isBusy = busy !== null;
  const canPublish = article.status === "completed" && !isBusy && connected === true;
  const checkingConnection = connected === null;

  const goConnect = () => {
    setMenuOpen(false);
    navigate(`/sites/${siteId}/dashboard`);
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setConfirmDelete(false);
    setMenuOpen(false);
    onDelete();
  };

  let label: string = copy.name;
  if (checkingConnection) {
    label = t("layout.nav.checking");
  } else if (!connected) {
    label = copy.publish;
  } else if (!alreadySynced) {
    label = busy === "publish" ? t("article.publish.publishing") : t("article.publish.publish");
  } else {
    label = busy === "update" ? t("article.publish.updating") : justSucceeded ? t("article.publish.updated") : t("article.publish.update");
  }

  return (
    <div ref={containerRef} className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="relative inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-black text-white shadow-sm transition-colors hover:bg-slate-700"
      >
        <span className="whitespace-nowrap">{label}</span>
        {alreadySynced && (
          <span
            className={`absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full border border-white ${
              isDraft ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
        )}
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed end-4 start-4 top-16 z-50 mx-auto max-w-xs rounded-xl border border-[#E4E5F0] bg-[#FAFAFE] p-2 shadow-lg"
          >
            {checkingConnection && (
              <div className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-slate-400">
                <Spinner className="h-3.5 w-3.5" />
                {t("article.publish.checking")}
              </div>
            )}

            {!checkingConnection && !connected && (
              <button
                type="button"
                onClick={goConnect}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <ProviderIcon provider={provider} />
                {copy.connect}
              </button>
            )}

            {!checkingConnection && connected && !alreadySynced && (
              <button
                type="button"
                onClick={() => {
                  onPublish();
                  setMenuOpen(false);
                }}
                disabled={!canPublish}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy === "publish" ? <Spinner className="h-3.5 w-3.5" /> : <ProviderIcon provider={provider} />}
                {busy === "publish" ? t("article.publish.publishing") : copy.publish}
              </button>
            )}

            {!checkingConnection && connected && alreadySynced && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onUpdate();
                    setMenuOpen(false);
                  }}
                  disabled={isBusy}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy === "update" ? (
                    <Spinner className="h-3.5 w-3.5" />
                  ) : justSucceeded ? (
                    <CheckIcon />
                  ) : (
                    <ProviderIcon provider={provider} />
                  )}
                  {busy === "update" ? t("article.publish.updating") : justSucceeded ? t("article.publish.updated") : copy.update}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={isBusy}
                  className={`mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
                    confirmDelete ? "bg-rose-600 text-white" : "text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  {busy === "delete" ? (
                    <Spinner className="h-3.5 w-3.5" />
                  ) : (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 2a1 1 0 00-1 1v1H4a1 1 0 000 2h12a1 1 0 100-2h-3V3a1 1 0 00-1-1H8zM5 7a1 1 0 011 1v8a2 2 0 002 2h4a2 2 0 002-2V8a1 1 0 112 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {busy === "delete" ? t("article.publish.deleting") : confirmDelete ? t("article.publish.confirmDelete") : copy.remove}
                </button>

                {remoteUrl && (
                  <a
                    href={remoteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-bold text-slate-500 hover:bg-slate-100"
                  >
                    {copy.view}
                  </a>
                )}
              </>
            )}

            {error && (
              <div className="mt-1 flex items-center justify-between gap-2 rounded-lg bg-rose-50 px-2 py-1.5">
                <p className="text-[10px] font-bold text-rose-600">{error}</p>
                <button onClick={onDismissError} className="shrink-0 text-[10px] text-rose-400">
                  ✕
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};