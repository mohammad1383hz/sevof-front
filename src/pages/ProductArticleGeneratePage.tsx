import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { productArticleService, wordpressService, subscriptionService } from "../services/api";
import type { ProductArticle, ProductArticleSection } from "../services/api";
import { isProductArticleBusy } from "../services/api";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import { POLL_INTERVAL_MS } from "../components/article-generate/constants";
import { Spinner } from "../components/article-generate/UiBits";
import { ErrorBanner } from "../components/article-generate/ErrorBanner";
import {
  ProductPublishToWordPressBar,
  ProductWordPressHeaderControl,
  type ProductWpBusyAction,
} from "../components/product-article/ProductPublishToWordPressBar";
import ProductModelSelectModal from "../components/product-article/ProductModelSelectModal";
import { ProductArticleBody } from "../components/product-article/ProductArticleBody";
import { ProductStepTimeline } from "../components/product-article/ProductStepTimeline";
import { ProductArticleOutline } from "../components/product-article/ProductArticleOutline";
import { t } from "../i18n";

interface ProductArticleGeneratePageProps {
  siteId: number | string;
  /** شروع تولید جدید از روی یک ایده‌ی محصول */
  ideaId?: number | string;
  onStatusChange?: (articleId: string | number, status: string) => void;

  /** باز کردن مقاله‌ای که قبلاً ساخته شده (ULID یا عدد) */
  articleId?: number | string;
  embedded?: boolean;
  onArticleStarted?: (articleId: string | number, ideaId: string | number) => void;
  onArticleBack?: () => void;
  /**
   * در حالت embedded، دکمه‌ی وردپرسِ موبایل از این طریق به هدرِ Layoutِ والد
   * فرستاده می‌شود (والد باید آن را به mobileHeaderExtra در Layout وصل کند).
   * در حالت غیر embedded این پراپ لازم نیست؛ صفحه خودش به Layout پاس می‌دهد.
   */
  onMobileHeaderExtraChange?: (node: React.ReactNode | null) => void;
}

type LayoutOwnProps = Omit<React.ComponentProps<typeof Layout>, "children">;

/** بک‌اند در مراحل اولِ تولید (قبل از ساخت outline) ممکن است `sections` را
 *  برنگرداند. کامپوننت‌های فرزند (Timeline/Outline/Body) مستقیم
 *  `article.sections.some(...)` صدا می‌زنند و با undefined کرش می‌کنند؛
 *  پس همین‌جا، در تنها نقطه‌ی ورودِ دیتا، آرایه‌ی خالی تضمین می‌شود. */
const normalizeArticle = (data: any): ProductArticle =>
  ({
    ...data,
    sections: Array.isArray(data?.sections) ? data.sections : [],
  }) as ProductArticle;

const PageShell: React.FC<{
  embedded: boolean;
  layoutProps: LayoutOwnProps;
  children: React.ReactNode;
}> = ({ embedded, layoutProps, children }) =>
  embedded ? <>{children}</> : <Layout {...layoutProps}>{children}</Layout>;

const ProductArticleGeneratePage: React.FC<ProductArticleGeneratePageProps> = ({
  siteId,
  ideaId,
  articleId,
  embedded = false,
  onStatusChange,
  onArticleStarted,
  onArticleBack,
}) => {
  const navigate = useNavigate();

  const [id, setId] = useState<number | string | null>(articleId ?? null);
  const [article, setArticle] = useState<ProductArticle | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<number | string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pollNonce, setPollNonce] = useState(0);

  // ── وردپرس ──
  const [wpBusy, setWpBusy] = useState<ProductWpBusyAction>(null);
  const [wpError, setWpError] = useState<string | null>(null);
  const [wpJustSucceeded, setWpJustSucceeded] = useState(false);

  // ── انتخاب‌های مودال ──
  const [showModelModal, setShowModelModal] = useState<boolean>(!!ideaId && !articleId);
  const [modelChosen, setModelChosen] = useState<string | null>(null);
  const [imageModelChosen, setImageModelChosen] = useState<string | null>(null);
  const [imageStyleChosen, setImageStyleChosen] = useState("");
  const [imageUserPromptChosen, setImageUserPromptChosen] = useState("");
  const [articleUserPromptChosen, setArticleUserPromptChosen] = useState("");
  const [minSectionsChosen, setMinSectionsChosen] = useState<number | null>(null);
  const [maxSectionsChosen, setMaxSectionsChosen] = useState<number | null>(null);

  const [isFreePlan, setIsFreePlan] = useState(true);
  const [planLoaded, setPlanLoaded] = useState(false);

  const articleRef = useRef<ProductArticle | null>(null);
  articleRef.current = article;
  const idRef = useRef<number | string | null>(null);
  idRef.current = id;
  const generateStartedRef = useRef(false);

  /* ── جای دکمه‌ی وردپرسِ موبایل: داخل هدرِ Layout، کنار بج پلن ──
     Layout یک نقطه‌ی اتصال (#layout-mobile-header-slot) در هدر موبایل دارد.
     دکمه با portal همان‌جا رندر می‌شود، چه این صفحه خودش Layout بسازد و چه
     embedded باشد و Layout مال والد باشد — بدون نیاز به wiring در والد.
     بعد از هر رندر چک می‌شود تا اگر Layout دوباره ساخته شد، المنت تازه گرفته شود. */
  const [headerSlot, setHeaderSlot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.getElementById("layout-mobile-header-slot");
    if (el !== headerSlot) setHeaderSlot(el);
  });

  /* ── همگام‌سازی با تغییر آدرس ── */
  const routeKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const routeKey = `${ideaId ?? ""}|${articleId ?? ""}`;
    if (routeKeyRef.current === routeKey) return;
    routeKeyRef.current = routeKey;

    // همین مقاله‌ای که تازه خودمان ساختیم؛ ریست نکن
    if (articleId != null && String(articleId) === String(idRef.current)) {
      setShowModelModal(false);
      return;
    }

    setId(articleId ?? null);
    setArticle(null);
    setFatalError(null);
    setActionError(null);
    setWpError(null);
    setWpBusy(null);
    setWpJustSucceeded(false);
    setRegeneratingId(null);
    setPollNonce((n) => n + 1);
    generateStartedRef.current = false;
    setShowModelModal(!!ideaId && !articleId);
    setModelChosen(null);
    setImageModelChosen(null);
    setImageStyleChosen("");
    setImageUserPromptChosen("");
    setArticleUserPromptChosen("");
    setMinSectionsChosen(null);
    setMaxSectionsChosen(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, ideaId]);

  /* ── ۰) وضعیت پلن ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await subscriptionService.me();
        if (res.success && res.data) setIsFreePlan(res.data.subscription.is_free);
      } catch (err) {
        console.error("Error fetching subscription status:", err);
      } finally {
        setPlanLoaded(true);
      }
    })();
  }, []);

  /* ── ۱) شروع تولید از روی ایده ── */
  useEffect(() => {
    if (id || !ideaId) {
      if (!id && !ideaId) setFatalError(t("article.page.missingId"));
      return;
    }
    // بعد از خطا تا وقتی کاربر «تلاش مجدد» نزده، دوباره شروع نکن
    if (fatalError) return;
    if (!modelChosen || !imageModelChosen) return;
    if (generateStartedRef.current) return;
    generateStartedRef.current = true;

    (async () => {
      try {
        const res = await productArticleService.generate(siteId, ideaId, {
          model: modelChosen,
          image_model: imageModelChosen,
          image_style: imageStyleChosen,
          ...(imageUserPromptChosen ? { image_user_prompt: imageUserPromptChosen } : {}),
          ...(articleUserPromptChosen ? { article_user_prompt: articleUserPromptChosen } : {}),
          ...(minSectionsChosen != null ? { min_sections: minSectionsChosen } : {}),
          ...(maxSectionsChosen != null ? { max_sections: maxSectionsChosen } : {}),
        } as any);

        if (res && (res as any).success === false) {
          throw new Error((res as any).message || t("article.page.startFailed"));
        }

        const payload: any = (res as any)?.data ?? res;
        const newId =
          payload?.article_id ??
          payload?.data?.article_id ??
          (res as any)?.article_id ??
          (res as any)?.data?.data?.article_id;

        if (newId) {
          setId(newId);
          onArticleStarted?.(String(newId), String(ideaId));
        } else {
          throw new Error((res as any)?.message || t("article.page.noId"));
        }
      } catch (err: any) {
        generateStartedRef.current = false;
        setFatalError(err?.message || t("article.page.startError"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    ideaId,
    siteId,
    fatalError,
    modelChosen,
    imageModelChosen,
    imageStyleChosen,
    imageUserPromptChosen,
    articleUserPromptChosen,
    minSectionsChosen,
    maxSectionsChosen,
  ]);

  /* ── ۲) polling ── */
  const fetchArticle = useCallback(async () => {
    if (!id) return;
    try {
      const res = await productArticleService.show(siteId, id);
      const data = (res as any)?.data?.data ?? (res as any)?.data;
      if (!data) return;

      setArticle(normalizeArticle(data));

      setRegeneratingId((current) => {
        if (current === null) return current;
        const sec = data.sections?.find((s: ProductArticleSection) => s.id === current);
        return sec && sec.status !== "pending" ? null : current;
      });
    } catch {
      // خطای موقت شبکه — polling بعدی جبران می‌کند
    }
  }, [siteId, id]);

  useEffect(() => {
    if (!id) return;
    fetchArticle();

    const interval = setInterval(() => {
      const current = articleRef.current;
      if (current && isProductArticleBusy(current.status)) fetchArticle();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pollNonce]);

  useEffect(() => {
    if (article?.id != null && article.status) onStatusChange?.(article.id, article.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id, article?.status]);

  /* ── ۳) اکشن‌ها ── */
  const handleRetry = async () => {
    if (!id) return;
    setRetrying(true);
    setActionError(null);
    try {
      const res = await productArticleService.retry(siteId, id);
      if ((res as any)?.success === false) {
        throw new Error((res as any).message || t("analyze.errors.retry"));
      }
      setArticle((a) => (a ? { ...a, status: "pending", error_message: null } : a));
      setPollNonce((n) => n + 1);
    } catch (err: any) {
      setActionError(err?.message || t("article.page.retryFailed"));
    } finally {
      setRetrying(false);
    }
  };

  const handleRegenerateSection = async (section: ProductArticleSection) => {
    if (!id) return;
    setRegeneratingId(section.id);
    setActionError(null);
    try {
      const res = await productArticleService.regenerateSection(siteId, id, section.id);
      if ((res as any)?.success === false) {
        throw new Error((res as any).message || t("article.page.regenFailed"));
      }
      setArticle((a) =>
        a
          ? {
              ...a,
              status: "generating_sections",
              sections: (a.sections ?? []).map((s) =>
                s.id === section.id ? { ...s, status: "pending" as const } : s,
              ),
            }
          : a,
      );
      setPollNonce((n) => n + 1);
    } catch (err: any) {
      setRegeneratingId(null);
      setActionError(err?.message || t("article.page.regenFailedRetry"));
    }
  };

  /* ── وردپرس: انتشار / بروزرسانی / حذف ── */

  // همون endpoint create/update است؛ بک‌اند خودش بر اساس wp_post_id تشخیص می‌دهد.
  const runWpSync = async (kind: "publish" | "update") => {
    if (!id) return;
    setWpBusy(kind);
    setWpError(null);
    setWpJustSucceeded(false);
    try {
      const res = await wordpressService.syncProductArticle(siteId, id);
      if ((res as any)?.success === false) {
        throw new Error(
          (res as any)?.message ||
            (kind === "publish" ? t("article.page.wpPublishFailed") : t("article.page.wpUpdateFailed")),
        );
      }
      setWpJustSucceeded(true);
      await fetchArticle(); // بک‌اند فقط {message} برمی‌گرداند؛ فیلدهای wp_* را باید دوباره بگیریم
      setTimeout(() => setWpJustSucceeded(false), 4000);
    } catch (err: any) {
      setWpError(
        err?.message ||
          (kind === "publish"
            ? t("article.page.wpPublishFailedRetry")
            : t("article.page.wpUpdateFailedRetry")),
      );
    } finally {
      setWpBusy(null);
    }
  };

  const handlePublishToWordPress = () => runWpSync("publish");
  const handleUpdateOnWordPress = () => runWpSync("update");

  const handleDeleteFromWordPress = async () => {
    if (!id) return;
    setWpBusy("delete");
    setWpError(null);
    setWpJustSucceeded(false);
    try {
      const res = await wordpressService.destroyProductArticle(siteId, id);
      if ((res as any)?.success === false) {
        throw new Error((res as any)?.message || t("article.page.wpDeleteFailed"));
      }
      // بعد از حذف موفق، فیلدهای wp_* سمت سرور پاک شده‌اند؛ فرانت را هم optimistically ریست کن
      setArticle((a) =>
        a
          ? ({
              ...a,
              wp_post_id: null,
              wp_permalink: null,
              wp_sync_status: "not_synced",
              publish_status: null,
            } as ProductArticle)
          : a,
      );
      await fetchArticle();
    } catch (err: any) {
      setWpError(err?.message || t("article.page.wpDeleteFailedRetry"));
    } finally {
      setWpBusy(null);
    }
  };

  /* ── ۴) مودال ── */
  const handleConfirmModel = (
    modelId: string,
    imageModelId: string,
    _imageCount: number, // در مقاله‌ی محصول همیشه ۱ است (فقط تصویر شاخص)
    imageStyle: string,
    imageUserPrompt: string,
    articleUserPrompt: string,
    minSections?: number,
    maxSections?: number,
  ) => {
    setArticleUserPromptChosen(articleUserPrompt);
    setImageStyleChosen(imageStyle);
    setImageUserPromptChosen(imageUserPrompt);
    setMinSectionsChosen(minSections ?? null);
    setMaxSectionsChosen(maxSections ?? null);
    setImageModelChosen(imageModelId);
    setModelChosen(modelId);
    setShowModelModal(false);
  };

  const handleCancelModelModal = () => {
    setShowModelModal(false);
    if (embedded) {
      onArticleBack?.();
      return;
    }
    navigate(-1);
  };

  /* mobileHeaderExtra: دکمه‌ی انتشار وردپرس بالای صفحه در هدر موبایل،
     کنار بج پلن (همان‌جا که در دسکتاپ نوار انتشار بالای صفحه است). */
  const layoutProps: LayoutOwnProps = {
    siteId,
    activeView: "articles" as const,
    hideDesktopPlanBadge: true,
    onChangeView: (v: SidebarView) => {
      if (v === "info") navigate(`/sites/${siteId}`);
    },
  } as LayoutOwnProps;

  /* ── ۵) رندر ── */
  if (fatalError) {
    return (
      <PageShell embedded={embedded} layoutProps={layoutProps}>
        <div className="mx-auto max-w-3xl p-6">
          <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
            <p className="text-sm font-bold text-rose-600">{fatalError}</p>
            <button
              type="button"
              onClick={() => {
                // پاک کردن خطا باعث اجرای دوباره‌ی effect شروع تولید می‌شود
                generateStartedRef.current = false;
                setFatalError(null);
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
            >
              {t("billing.payment.tryAgain")}
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (showModelModal) {
    if (!planLoaded) {
      return (
        <PageShell embedded={embedded} layoutProps={layoutProps}>
          <div className="mx-auto max-w-3xl p-6">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#DAD5C7] bg-white p-10">
              <Spinner className="h-6 w-6" />
              <p className="text-xs font-bold text-[#000000]">{t("article.page.checkingPlan")}</p>
            </div>
          </div>
        </PageShell>
      );
    }

    return (
      <PageShell embedded={embedded} layoutProps={layoutProps}>
        <div className="mx-auto max-w-3xl p-6" />
        <ProductModelSelectModal
          open={showModelModal}
          isFreePlan={isFreePlan}
          onClose={handleCancelModelModal}
          onConfirm={handleConfirmModel}
        />
      </PageShell>
    );
  }

  if (!article) {
    return (
      <PageShell embedded={embedded} layoutProps={layoutProps}>
        <div className="mx-auto max-w-3xl p-6">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#DAD5C7] bg-white p-10">
            <Spinner className="h-6 w-6" />
            <p className="text-xs font-bold text-[#000000]">{t("product.page.preparing")}</p>
          </div>
        </div>
      </PageShell>
    );
  }

  const busy = isProductArticleBusy(article.status);

  return (
    <PageShell embedded={embedded} layoutProps={layoutProps}>
      {/* نوار وردپرس + بج پلن — فقط دسکتاپ (موبایل: دکمه در هدر Layout است) */}
      <div className="hidden lg:block">
        <ProductPublishToWordPressBar
          siteId={siteId}
          article={article}
          busy={wpBusy}
          error={wpError}
          justSucceeded={wpJustSucceeded}
          onPublish={handlePublishToWordPress}
          onUpdate={handleUpdateOnWordPress}
          onDelete={handleDeleteFromWordPress}
          onDismissError={() => setWpError(null)}
          isFreePlan={isFreePlan}
          embedded={embedded}
        />
      </div>

      {/* دکمه‌ی انتشار وردپرس — فقط موبایل. با portal داخل هدر h-14 خودِ Layout،
          دقیقاً کنار بج پلن رندر می‌شود (همان جایگاهِ نوار بالای دسکتاپ). */}
      {headerSlot &&
        createPortal(
          <ProductWordPressHeaderControl
            siteId={siteId}
            article={article}
            busy={wpBusy}
            error={wpError}
            justSucceeded={wpJustSucceeded}
            onPublish={handlePublishToWordPress}
            onUpdate={handleUpdateOnWordPress}
            onDelete={handleDeleteFromWordPress}
            onDismissError={() => setWpError(null)}
          />,
          headerSlot,
        )}

      <div
        className={`mx-auto w-full max-w-4xl p-4 pb-6 sm:p-6 sm:pb-6 ${embedded ? "pt-4 sm:pt-4 lg:pt-16" : ""}`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#DAD5C7] bg-gradient-to-r rtl:bg-gradient-to-l from-white to-[#DCEFEA]/50 p-5">
            <h1 className="text-lg font-black leading-8 text-[#1E2A28]">{article.title}</h1>
            {busy && (
              <p className="mt-1 text-[11px] text-[#000000]/70">
                {t("article.page.autoRefresh")}
              </p>
            )}
          </div>

          <ProductStepTimeline article={article} />
          <ProductArticleOutline article={article} />

          {actionError && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="min-w-0 break-words text-xs font-bold text-rose-600">{actionError}</p>
              <button onClick={() => setActionError(null)} className="shrink-0 text-xs text-rose-400">
                ✕
              </button>
            </div>
          )}

          <ErrorBanner
            article={article as any}
            onRetry={handleRetry}
            retrying={retrying}
            embedded={embedded}
          />

          <ProductArticleBody
            siteId={siteId}
            article={article}
            isFreePlan={isFreePlan}
            regeneratingSectionId={regeneratingId as any}
            onRegenerateSection={handleRegenerateSection}
            onRefresh={fetchArticle}
          />
        </div>
      </div>
    </PageShell>
  );
};

export default ProductArticleGeneratePage;