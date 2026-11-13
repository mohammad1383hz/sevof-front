import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";
import {
  pastArticlesService,
  searchConsoleInsightsService,
  type ArticleRefreshDetail,
  type PastArticle,
  type PastArticleContent,
} from "../../services/api";
import RefreshProgress from "./RefreshProgress";
import { InternalLinksBadge, NewLinksList, SeoIssueList } from "./SeoAuditView";
import { BUSY_STATUSES, REASON_HINT, REASON_LABEL, fa, faPos } from "./refreshLabels";
import { t } from "../../i18n";

interface PastArticleWorkspaceProps {
  siteId: string;
  article: PastArticle;
  onClose: () => void;
  /** وضعیت مقاله عوض شد؛ فهرست بیرون دوباره بارگذاری شود */
  onChanged: () => void;
}

type Phase = "idle" | "working" | "ready" | "publishing" | "applied" | "failed";

const BLOCK_TAG = /^<(p|h[1-6]|ul|ol|li|figure|blockquote|table|div|pre|img|iframe|hr|section|!--)/i;

/** متن ویرایشگر کلاسیک وردپرس پاراگراف را با خط خالی جدا می‌کند (wpautop)؛ برای نمایش به <p> تبدیل می‌شود. */
const autop = (html: string) =>
  html
    .split(/\n\s*\n/)
    .map((block) => {
      const trimmed = block.trim();
      return trimmed === "" || BLOCK_TAG.test(trimmed) ? block : `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n\n");

/** نمایش امن: شورت‌کدها (مثل [gallery]) در پیش‌نمایش معنایی ندارند و پنهان می‌شوند. */
const renderHtml = (html: string) =>
  DOMPurify.sanitize(autop(html.replace(/\[\/?[A-Za-z][\w-]*(?:\s[^\]]*)?\]/g, "")), { FORBID_TAGS: ["style", "form", "script"], ADD_ATTR: ["target"] });

/** CSS string literal (labels shown in ::before). */
const css = (text: string) => JSON.stringify(text);

const READER_STYLE = () => `
.yx-reader{color:#0D0F23;font-size:15px;line-height:2.05}
.yx-reader h2{font-size:1.25rem;font-weight:900;margin:2rem 0 .75rem;line-height:1.7}
.yx-reader h3{font-size:1.05rem;font-weight:800;margin:1.5rem 0 .5rem}
.yx-reader p{margin:0 0 1rem}
.yx-reader ul,.yx-reader ol{margin:0 0 1rem;padding-inline-start:1.4rem}
.yx-reader ul{list-style:disc}.yx-reader ol{list-style:decimal}
.yx-reader li{margin:.25rem 0}
.yx-reader a{color:#5B47FB;text-decoration:underline;text-underline-offset:3px}
.yx-reader img{max-width:100%;height:auto;border-radius:14px;margin:1rem auto}
.yx-reader figure{margin:1rem 0}
.yx-reader blockquote{border-inline-start:3px solid #E4E5F0;padding-inline-start:1rem;color:#3B3F5C}
.yx-reader table{width:100%;font-size:13px;border-collapse:collapse;margin:1rem 0;display:block;overflow-x:auto}
.yx-reader td,.yx-reader th{border:1px solid #E4E5F0;padding:.4rem .6rem}
.yx-reader iframe{max-width:100%}
.yx-reader [data-yx-edit]{position:relative;background:rgba(239, 237, 255,.6);border-inline-start:3px solid #5B47FB;border-radius:12px;padding:1.6rem 1rem .4rem;margin:1.25rem 0;scroll-margin-top:120px;transition:box-shadow .3s}
.yx-reader [data-yx-edit]::before{position:absolute;top:.4rem;inset-inline-start:.9rem;font-size:11px;font-weight:800;color:#4935E0}
.yx-reader [data-yx-edit="replace"]::before{content:${css(t("growth.workspace.changeN"))} attr(data-yx-n) ${css(t("growth.workspace.rewritten"))}}
.yx-reader [data-yx-edit="insert_after"]{background:rgba(255,244,214,.7);border-inline-start-color:#C99A2E}
.yx-reader [data-yx-edit="insert_after"]::before{content:${css(t("growth.workspace.changeN"))} attr(data-yx-n) ${css(t("growth.workspace.newParagraph"))};color:#8A6100}
.yx-reader [data-yx-edit].yx-flash{box-shadow:0 0 0 3px rgba(91, 71, 251,.35)}
.yx-reader a[data-yx-link]{background:rgba(91, 71, 251,.12);border-radius:6px;padding:0 .2rem;font-weight:700}
@keyframes yx-scan{0%{top:-15%}100%{top:105%}}
.yx-scan{position:absolute;inset-inline:0;height:120px;background:linear-gradient(to bottom,transparent,rgba(91, 71, 251,.14),transparent);animation:yx-scan 2.8s ease-in-out infinite;pointer-events:none}
@media (prefers-reduced-motion:reduce){.yx-scan{animation:none;display:none}}
`;

const Snippet: React.FC<{ title: string; description: string; url: string; muted?: boolean }> = ({ title, description, url, muted }) => (
  <div className={`rounded-xl border border-[#E4E5F0] bg-white p-3 ${muted ? "opacity-60" : ""}`}>
    <p className="truncate text-[11px] text-[#1E7A3C]" dir="ltr">
      {url}
    </p>
    <p className="mt-0.5 text-[15px] leading-6 text-[#1A0DAB]">{title || "—"}</p>
    <p className="mt-0.5 text-xs leading-5 text-[#4D5156]">{description || t("growth.workspace.noDescription")}</p>
  </div>
);

/**
 * فضای کار «آپدیت مقاله»: کل مقاله‌ی فعلی زیبا نمایش داده می‌شود، بعد بازنویسی جلوی چشم کاربر انجام می‌شود
 * و در پایان همان مقاله با پاراگراف‌های تغییرکرده‌ی برجسته، دلیل هر تغییر و پیش‌نمایش گوگل نشان داده می‌شود.
 */
const PastArticleWorkspace: React.FC<PastArticleWorkspaceProps> = ({ siteId, article, onClose, onChanged }) => {
  const [content, setContent] = useState<PastArticleContent | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const openRefresh = article.refresh && !["discarded", "reverted"].includes(article.refresh.status) ? article.refresh.id : null;
  const [refreshId, setRefreshId] = useState<string | null>(openRefresh);
  const [detail, setDetail] = useState<ArticleRefreshDetail | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [view, setView] = useState<"new" | "old">("new");
  const [busy, setBusy] = useState<"start" | "apply" | "discard" | "revert" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pastArticlesService.show(siteId, article.id).then((res) => {
      if (res.success && res.data?.data) setContent(res.data.data);
      else setContentError(res.message || t("growth.workspace.readFailed"));
    });
  }, [siteId, article.id]);

  const loadDetail = useCallback(async () => {
    if (!refreshId) return;
    const res = await searchConsoleInsightsService.getRefresh(siteId, refreshId);
    if (res.success && res.data?.data) setDetail(res.data.data);
  }, [siteId, refreshId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const phase: Phase = useMemo(() => {
    if (startedAt && !detail) return "working";
    if (!refreshId || !detail) return "idle";
    if (detail.status === "applying") return "publishing";
    if (BUSY_STATUSES.includes(detail.status)) return "working";
    if (detail.status === "ready") return "ready";
    if (detail.status === "applied") return "applied";
    if (detail.status === "failed") return "failed";
    return "idle";
  }, [refreshId, detail, startedAt]);

  // تا وقتی کار در جریان است وضعیت هر چند ثانیه تازه می‌شود
  useEffect(() => {
    if (phase !== "working" && phase !== "publishing") return;
    const timer = setInterval(loadDetail, 2500);
    return () => clearInterval(timer);
  }, [phase, loadDetail]);

  // وقتی کار به نتیجه رسید، فهرست بیرون هم تازه شود
  const lastStatus = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (detail && lastStatus.current && lastStatus.current !== detail.status) onChanged();
    lastStatus.current = detail?.status;
  }, [detail, onChanged]);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, busy]);

  const start = async () => {
    setBusy("start");
    setError(null);
    setDetail(null);
    setStartedAt(new Date().toISOString());
    const res = await pastArticlesService.startRefresh(siteId, article.id);
    setBusy(null);
    if (!res.success || !res.data?.data) {
      setStartedAt(null);
      setError(res.message || t("growth.workspace.startFailed"));
      return;
    }
    setRefreshId(res.data.data.id);
    onChanged();
  };

  const act = async (action: "apply" | "discard" | "revert") => {
    if (!refreshId) return;
    if (action === "revert" && !window.confirm(t("growth.gsc.confirmRevert"))) return;
    setBusy(action);
    setError(null);
    const call =
      action === "apply"
        ? searchConsoleInsightsService.applyRefresh
        : action === "revert"
          ? searchConsoleInsightsService.revertRefresh
          : searchConsoleInsightsService.discardRefresh;
    const res = await call(siteId, refreshId);
    setBusy(null);
    if (!res.success) {
      setError(res.message || t("growth.gsc.actionFailed"));
      return;
    }
    if (action === "discard") {
      setRefreshId(null);
      setDetail(null);
      setStartedAt(null);
    } else {
      await loadDetail();
    }
    onChanged();
  };

  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToEdit = (n: number) => {
    setView("new");
    requestAnimationFrame(() => {
      const el = readerRef.current?.querySelector<HTMLElement>(`[data-yx-n="${n}"]`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // کلیک پشت سر هم: برجسته شدن از اول شروع شود، نه اینکه تایمر قبلی زود خاموشش کند
      if (flashTimer.current) clearTimeout(flashTimer.current);
      readerRef.current?.querySelectorAll(".yx-flash").forEach((node) => node.classList.remove("yx-flash"));
      el.classList.add("yx-flash");
      flashTimer.current = setTimeout(() => el.classList.remove("yx-flash"), 1600);
    });
  };

  const showResult = (phase === "ready" || phase === "applied" || phase === "publishing") && !!detail?.document;
  const bodyHtml = useMemo(() => {
    if (showResult && detail?.document) {
      return renderHtml(detail.document.map((s) => (view === "new" ? s.html : s.before_html)).join(""));
    }
    return content ? renderHtml(content.content) : "";
  }, [showResult, detail, view, content]);

  const edits = detail?.edits ?? [];
  const metaBefore = detail?.meta.before ?? { meta_title: content?.seo.meta_title, meta_description: content?.seo.meta_description };
  const metaAfter = detail?.meta.after ?? {};
  const metaChanged = !!(metaAfter.meta_title || metaAfter.meta_description);
  const snippetUrl = (content?.url ?? article.url).replace(/^https?:\/\//, "");
  const title = content?.title ?? article.title;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F6F6FB]" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="yx-workspace-title">
      <style>{READER_STYLE()}</style>

      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E4E5F0] bg-white px-3 py-2.5 sm:px-5">
        <div className="min-w-0">
          <p className="text-[11px] text-[#9A9DB8]">{t("growth.workspace.kicker")}</p>
          <h2 id="yx-workspace-title" className="truncate text-sm font-black text-[#0D0F23] sm:text-base">
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={content?.url ?? article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg border border-[#E4E5F0] px-3 py-1.5 text-[11px] font-bold text-[#3B3F5C] hover:bg-[#F3F2FB] sm:inline-block"
          >
            {t("growth.workspace.viewOnSite")}
          </a>
          <button type="button" onClick={onClose} disabled={!!busy} aria-label={t("growth.preview.close")} className="rounded-lg p-1.5 text-[#6C7193] hover:bg-[#F3F2FB] disabled:opacity-50">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl gap-4 p-3 sm:p-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ── ستون کنار: وضعیت، کارها و نتیجه ── */}
          <aside className="space-y-3 lg:sticky lg:top-0 lg:order-2 lg:self-start">
            {error && (
              <div role="alert" className="rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] p-3 text-xs leading-6 text-[#B3453A]">
                {error}
              </div>
            )}

            {phase === "idle" && (
              <>
                <div className="rounded-2xl border border-[#E4E5F0] bg-white p-4">
                  <h3 className="text-sm font-black text-[#0D0F23]">{t("growth.workspace.onGoogle")}</h3>
                  {article.gsc ? (
                    <>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        {[
                          [t("growth.workspace.clicks"), fa(article.gsc.clicks)],
                          [t("growth.workspace.impressions"), fa(article.gsc.impressions)],
                          [t("growth.workspace.position"), faPos(article.gsc.position)],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-xl bg-[#F3F2FB]/70 py-2">
                            <p className="text-base font-black text-[#0D0F23]">{value}</p>
                            <p className="text-[10px] text-[#6C7193]">{label}</p>
                          </div>
                        ))}
                      </div>
                      {article.gsc.top_query && <p className="mt-2 text-[11px] text-[#6C7193]">{t("growth.gsc.topQuery", { query: article.gsc.top_query })}</p>}
                      {article.reason && (
                        <p className="mt-2 text-[11px] leading-5 text-[#3B3F5C]">
                          <span className="me-1 rounded-full bg-[#FFF4D6] px-2 py-0.5 font-bold text-[#8A6100]">{REASON_LABEL[article.reason]}</span> {REASON_HINT[article.reason]}
                          {article.potential_clicks ? ` ${t("growth.gsc.potential", { clicks: article.potential_clicks })}` : ""}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-2 text-xs leading-6 text-[#6C7193]">{t("growth.workspace.noGsc")}</p>
                  )}
                </div>

                {/* بعد از خواندن متن از سایت، نتیجه‌ی بررسی تازه است؛ تا آن موقع نتیجه‌ی فهرست */}
                <div className="rounded-2xl border border-[#E4E5F0] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-[#0D0F23]">{t("growth.workspace.seoCheck")}</h3>
                    <span className="text-[11px]">
                      <InternalLinksBadge audit={content ?? article} />
                    </span>
                  </div>
                  <SeoIssueList audit={content ?? article} />
                </div>

                {content?.seo.plugin && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-bold text-[#6C7193]">{t("growth.workspace.currentSnippet")}</p>
                    <Snippet title={content.seo.meta_title || title} description={content.seo.meta_description || ""} url={snippetUrl} />
                  </div>
                )}

                <div className="rounded-2xl border border-[#E4E5F0]/70 bg-[#F3F2FB]/60 p-4 text-[11px] leading-6 text-[#3B3F5C]">
                  <p className="mb-1 font-bold text-[#0D0F23]">{t("growth.workspace.whatHappens")}</p>
                  <p>• {t("growth.workspace.how1")}</p>
                  <p>• {t("growth.workspace.how2")}</p>
                  <p>• {t("growth.workspace.how3")}</p>
                  <p>• {t("growth.workspace.how4")}</p>
                  <p>• {t("growth.workspace.how5")}</p>
                </div>

                {content && !content.editable ? (
                  <p className="rounded-xl border border-[#E4E5F0] bg-white p-3 text-xs leading-6 text-[#6C7193]">{content.not_editable_message}</p>
                ) : (
                  <button
                    type="button"
                    onClick={start}
                    disabled={!content || busy === "start"}
                    className="w-full rounded-xl bg-[#5B47FB] px-4 py-3 text-sm font-black text-white shadow-sm shadow-[#5B47FB]/25 hover:bg-[#4935E0] disabled:opacity-60"
                  >
                    {busy === "start" ? t("growth.gsc.starting") : t("growth.workspace.start")}
                    {article.estimate && (
                      <span className="mt-0.5 block text-[11px] font-normal opacity-85">
                        {t("growth.gsc.creditEstimate", { credits: article.estimate.min === article.estimate.max ? fa(article.estimate.max) : `${fa(article.estimate.min)}–${fa(article.estimate.max)}` })}
                      </span>
                    )}
                  </button>
                )}
              </>
            )}

            {(phase === "working" || phase === "publishing") && (
              <div className="rounded-2xl border border-[#E4E5F0] bg-white p-4">
                <h3 className="text-sm font-black text-[#0D0F23]">{phase === "publishing" ? t("growth.workspace.publishingTitle") : t("growth.workspace.rewritingTitle")}</h3>
                <p className="mt-1 text-[11px] leading-5 text-[#6C7193]">
                  {phase === "publishing" ? t("growth.workspace.publishingBody") : t("growth.workspace.rewritingBody")}
                </p>
                <RefreshProgress
                  status={detail?.status ?? "queued"}
                  stage={detail?.stage ?? null}
                  since={detail?.stage_started_at ?? detail?.created_at ?? startedAt}
                  vertical
                />
              </div>
            )}

            {(phase === "ready" || phase === "applied") && detail && (
              <>
                <div className={`rounded-2xl border p-4 ${phase === "applied" ? "border-[#5B47FB]/30 bg-[#EFEDFF]/60" : "border-[#E4E5F0] bg-white"}`}>
                  <h3 className="text-sm font-black text-[#0D0F23]">{phase === "applied" ? t("growth.status.applied") : t("growth.workspace.readyTitle")}</h3>
                  {detail.summary && <p className="mt-1.5 text-xs leading-6 text-[#3B3F5C]">{detail.summary}</p>}
                  <p className="mt-2 text-[11px] text-[#6C7193]">
                    {[
                      edits.length ? t("growth.workspace.edits", { count: edits.length }) : null,
                      detail.links?.length ? t("growth.workspace.newLinks", { count: detail.links.length }) : null,
                      metaChanged ? t("growth.workspace.metaChanged") : null,
                      detail.credit_used ? t("growth.workspace.cost", { credits: fa(detail.credit_used) }) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <div role="tablist" aria-label={t("growth.workspace.version")} className="mt-3 flex gap-1 rounded-xl bg-[#F3F2FB] p-1">
                    {(["new", "old"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        role="tab"
                        aria-selected={view === v}
                        onClick={() => setView(v)}
                        className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-bold ${view === v ? "bg-white text-[#0D0F23] shadow-sm" : "text-[#6C7193]"}`}
                      >
                        {v === "new" ? t("growth.preview.new") : t("growth.workspace.previous")}
                      </button>
                    ))}
                  </div>

                  {phase === "ready" ? (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => act("apply")}
                        disabled={!!busy}
                        className="flex-1 rounded-xl bg-[#5B47FB] px-3 py-2.5 text-xs font-black text-white hover:bg-[#4935E0] disabled:opacity-60"
                      >
                        {busy === "apply" ? t("growth.preview.sending") : t("growth.preview.publish")}
                      </button>
                      <button
                        type="button"
                        onClick={() => act("discard")}
                        disabled={!!busy}
                        className="rounded-xl border border-[#E4E5F0] bg-white px-3 py-2.5 text-xs font-bold text-[#3B3F5C] hover:bg-[#F3F2FB] disabled:opacity-60"
                      >
                        {t("growth.preview.discard")}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <a
                        href={content?.url ?? article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl bg-[#5B47FB] px-3 py-2.5 text-center text-xs font-black text-white hover:bg-[#4935E0]"
                      >
                        {t("growth.workspace.viewOnSite")}
                      </a>
                      <button
                        type="button"
                        onClick={() => act("revert")}
                        disabled={!!busy}
                        className="rounded-xl border border-[#E4E5F0] bg-white px-3 py-2.5 text-xs font-bold text-[#3B3F5C] hover:bg-[#F3F2FB] disabled:opacity-60"
                      >
                        {busy === "revert" ? "…" : t("growth.gsc.revert")}
                      </button>
                    </div>
                  )}
                </div>

                {edits.length > 0 && (
                  <div className="rounded-2xl border border-[#E4E5F0] bg-white p-4">
                    <h3 className="mb-2 text-xs font-black text-[#0D0F23]">{t("growth.workspace.changes")}</h3>
                    <ol className="space-y-2">
                      {edits.map((e) => (
                        <li key={e.n} className="rounded-xl border border-[#E4E5F0]/70 p-2.5">
                          <button type="button" onClick={() => scrollToEdit(e.n)} className="w-full text-right">
                            <span className="flex items-center gap-1.5 text-[11px]">
                              <span className={`rounded-full px-2 py-0.5 font-bold ${e.action === "replace" ? "bg-[#EFEDFF] text-[#4935E0]" : "bg-[#FFF4D6] text-[#8A6100]"}`}>
                                {fa(e.n)} · {e.action === "replace" ? t("growth.workspace.rewrite") : t("growth.workspace.new")}
                              </span>
                              <span className="truncate text-[#9A9DB8]">{e.section}</span>
                            </span>
                            <span className="mt-1 block text-xs leading-6 text-[#3B3F5C]">{e.why}</span>
                          </button>
                          {e.before && (
                            <details className="mt-1">
                              <summary className="cursor-pointer text-[11px] text-[#6C7193]">{t("growth.workspace.previousText")}</summary>
                              <div
                                className="yx-reader mt-1 rounded-lg bg-[#F3F2FB]/60 p-2 text-[12px] leading-6 text-[#6C7193]"
                                dangerouslySetInnerHTML={{ __html: renderHtml(e.before) }}
                              />
                            </details>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <NewLinksList links={detail.links ?? []} onShow={scrollToEdit} />

                {metaChanged && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-[#6C7193]">{t("growth.workspace.snippet")}</p>
                    <Snippet title={metaAfter.meta_title || metaBefore.meta_title || title} description={metaAfter.meta_description || metaBefore.meta_description || ""} url={snippetUrl} />
                    <p className="text-[10px] text-[#9A9DB8]">{t("growth.workspace.before")}</p>
                    <Snippet title={metaBefore.meta_title || title} description={metaBefore.meta_description || ""} url={snippetUrl} muted />
                  </div>
                )}
              </>
            )}

            {phase === "failed" && detail && (
              <div className="rounded-2xl border border-[#E3C4BC] bg-[#F7EEEA] p-4">
                <h3 className="text-sm font-black text-[#7A2F27]">{t("growth.workspace.failedTitle")}</h3>
                <p className="mt-1 text-xs leading-6 text-[#7A2F27]">{detail.error}</p>
                {content?.editable !== false && (
                  <button type="button" onClick={start} disabled={!!busy} className="mt-3 w-full rounded-xl bg-[#5B47FB] px-4 py-2.5 text-xs font-black text-white hover:bg-[#4935E0] disabled:opacity-60">
                    {t("growth.gsc.retry")}
                  </button>
                )}
              </div>
            )}
          </aside>

          {/* ── خود مقاله ── */}
          <article className="relative min-w-0 overflow-hidden rounded-2xl border border-[#E4E5F0] bg-white p-4 sm:p-8 lg:order-1">
            {!content && !contentError && !showResult && (
              <div className="space-y-3" aria-busy="true" aria-label={t("growth.workspace.reading")}>
                <div className="h-7 w-3/4 animate-pulse rounded-lg bg-[#F3F2FB] motion-reduce:animate-none" />
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-[#F3F2FB] motion-reduce:animate-none" style={{ width: `${95 - (i % 3) * 12}%` }} />
                ))}
              </div>
            )}
            {contentError && !showResult && <p className="text-sm text-[#B3453A]">{contentError}</p>}

            {(content || showResult) && (
              <>
                <h1 className="mb-4 text-xl font-black leading-9 text-[#0D0F23] sm:text-2xl">{title}</h1>
                {showResult && view === "old" && <p className="mb-4 rounded-lg bg-[#F3F2FB] px-3 py-1.5 text-[11px] text-[#6C7193]">{t("growth.workspace.showingPrevious")}</p>}
                <div
                  ref={readerRef}
                  className={`yx-reader transition-opacity duration-500 ${phase === "working" ? "opacity-60" : ""}`}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </>
            )}

            {phase === "working" && <div className="yx-scan" aria-hidden="true" />}
          </article>
        </div>
      </div>
    </div>
  );
};

export default PastArticleWorkspace;
