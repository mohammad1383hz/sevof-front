import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { searchConsoleInsightsService, type ArticleRefreshDetail } from "../../services/api";
import { MarkdownView } from "../article-generate/MarkdownView";
import { NewLinksList } from "./SeoAuditView";
import { t, formatNumber } from "../../i18n";

/** متن بخش: Markdown برای مقاله‌ی یوتیکس، HTML پاک‌سازی‌شده برای پست قدیمی وردپرس */
const SectionBody: React.FC<{ text: string; format: ArticleRefreshDetail["format"] }> = ({ text, format }) =>
  format === "html" ? (
    <div
      className="[&_a]:text-[#5B47FB] [&_a]:underline [&_h2]:mb-2 [&_h2]:text-sm [&_h2]:font-black [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:font-bold [&_img]:my-2 [&_img]:max-h-40 [&_img]:rounded-lg [&_li]:mr-4 [&_ol]:list-decimal [&_p]:mb-2 [&_table]:text-[11px] [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text, { FORBID_TAGS: ["style", "form", "iframe"] }) }}
    />
  ) : (
    <MarkdownView text={text} />
  );

interface RefreshPreviewModalProps {
  siteId: string;
  refreshId: string;
  onClose: () => void;
  /** بعد از انتشار/کنار گذاشتن، فهرست بیرون دوباره بارگذاری شود */
  onChanged: () => void;
}

const fa = (n: number) => formatNumber(n);

/** پیش‌نمایش «قبل/بعد» یک به‌روزرسانی؛ تا کاربر تأیید نکند چیزی روی سایت عوض نمی‌شود. */
const RefreshPreviewModal: React.FC<RefreshPreviewModalProps> = ({ siteId, refreshId, onClose, onChanged }) => {
  const [detail, setDetail] = useState<ArticleRefreshDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"apply" | "discard" | null>(null);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let alive = true;
    searchConsoleInsightsService.getRefresh(siteId, refreshId).then((res) => {
      if (!alive) return;
      if (res.success && res.data?.data) {
        setDetail(res.data.data);
        setOpenSection(res.data.data.sections[0]?.id ?? null);
      } else {
        setError(res.message || t("growth.preview.loadFailed"));
      }
    });
    return () => {
      alive = false;
    };
  }, [siteId, refreshId]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, busy]);

  const act = async (action: "apply" | "discard") => {
    setBusy(action);
    setError(null);
    const res =
      action === "apply"
        ? await searchConsoleInsightsService.applyRefresh(siteId, refreshId)
        : await searchConsoleInsightsService.discardRefresh(siteId, refreshId);
    setBusy(null);
    if (!res.success) {
      setError(res.message || t("growth.gsc.actionFailed"));
      return;
    }
    onChanged();
    onClose();
  };

  const metaRows = detail
    ? (["meta_title", "meta_description"] as const)
        .filter((key) => detail.meta.after[key])
        .map((key) => ({
          key,
          label: key === "meta_title" ? t("growth.preview.googleTitle") : t("growth.preview.googleDescription"),
          before: detail.meta.before[key] || "—",
          after: detail.meta.after[key] as string,
        }))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0D0F23]/40 p-0 sm:p-4" onClick={() => !busy && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="refresh-preview-title"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#E4E5F0] p-4 sm:p-5">
          <div className="min-w-0">
            <h2 id="refresh-preview-title" className="text-sm sm:text-base font-black text-[#0D0F23]">
              {t("growth.preview.title")}
            </h2>
            <p className="mt-1 truncate text-xs text-[#6C7193]">{detail?.article_title ?? "…"}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={!!busy}
            aria-label={t("growth.preview.close")}
            className="shrink-0 rounded-lg p-1.5 text-[#6C7193] hover:bg-[#F3F2FB] disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {!detail && !error && (
            <div className="space-y-2" aria-busy="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-[#F3F2FB] motion-reduce:animate-none" />
              ))}
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] p-3 text-xs text-[#B3453A]">
              {error}
            </div>
          )}

          {detail && (
            <>
              {detail.summary && (
                <div className="rounded-xl border border-[#E4E5F0]/70 bg-[#F3F2FB]/70 p-3 text-xs leading-6 text-[#3B3F5C] sm:text-sm">
                  {detail.summary}
                </div>
              )}

              {detail.queries.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold text-[#0D0F23]">{t("growth.preview.queries")}</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {detail.queries.slice(0, 10).map((q) => (
                      <li key={q.query} className="rounded-full bg-[#EFEDFF] px-2.5 py-1 text-[11px] text-[#4935E0]">
                        {q.query}
                        <span className="mr-1 text-[#6C7193]">
                          ({t("growth.gsc.impressionsCount", { count: q.impressions })}{q.position ? `, ${t("growth.gsc.position", { position: fa(Math.round(q.position)) })}` : ""})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <NewLinksList links={detail.links ?? []} />

              {metaRows.map((row) => (
                <div key={row.key} className="rounded-xl border border-[#E4E5F0] p-3">
                  <h3 className="mb-2 text-xs font-bold text-[#0D0F23]">{row.label}</h3>
                  <p className="text-xs leading-6 text-[#9A9DB8] line-through decoration-[#E3C4BC]">{row.before}</p>
                  <p className="mt-1 text-xs font-bold leading-6 text-[#4935E0] sm:text-sm">{row.after}</p>
                </div>
              ))}

              {detail.sections.map((s) => {
                const open = openSection === s.id;
                return (
                  <div key={s.id} className="overflow-hidden rounded-xl border border-[#E4E5F0]">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenSection(open ? null : s.id)}
                      className="flex w-full items-center justify-between gap-2 p-3 text-right hover:bg-[#F3F2FB]/50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold text-[#0D0F23] sm:text-sm">{s.heading}</span>
                        {s.instruction && <span className="mt-0.5 block text-[11px] leading-5 text-[#6C7193]">{s.instruction}</span>}
                      </span>
                      <svg className={`h-4 w-4 shrink-0 text-[#6C7193] transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {open && (
                      <div className="grid gap-3 border-t border-[#E4E5F0] p-3 lg:grid-cols-2">
                        <div className="min-w-0 rounded-lg bg-[#F3F2FB]/50 p-3">
                          <p className="mb-2 text-[11px] font-bold text-[#9A9DB8]">{t("growth.preview.current")}</p>
                          <div className="text-xs leading-7 text-[#6C7193]">
                            <SectionBody text={s.before} format={detail.format} />
                          </div>
                        </div>
                        <div className="min-w-0 rounded-lg border border-[#5B47FB]/20 bg-[#EFEDFF]/30 p-3">
                          <p className="mb-2 text-[11px] font-bold text-[#5B47FB]">{t("growth.preview.new")}</p>
                          <div className="text-xs leading-7 text-[#0D0F23]">
                            <SectionBody text={s.after} format={detail.format} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {detail && (
          <footer className="flex flex-col-reverse gap-2 border-t border-[#E4E5F0] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-[11px] text-[#6C7193]">
              {t("growth.preview.cost", { credits: fa(detail.credit_used) })}
            </p>
            {detail.status === "ready" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => act("discard")}
                  disabled={!!busy}
                  className="flex-1 rounded-xl border border-[#E4E5F0] px-4 py-2 text-xs font-bold text-[#3B3F5C] hover:bg-[#F3F2FB] disabled:opacity-50 sm:flex-none"
                >
                  {busy === "discard" ? "…" : t("growth.preview.discard")}
                </button>
                <button
                  type="button"
                  onClick={() => act("apply")}
                  disabled={!!busy}
                  className="flex-1 rounded-xl bg-[#5B47FB] px-4 py-2 text-xs font-black text-white shadow-sm shadow-[#5B47FB]/25 hover:bg-[#4935E0] disabled:opacity-60 sm:flex-none"
                >
                  {busy === "apply" ? t("growth.preview.sending") : t("growth.preview.publish")}
                </button>
              </div>
            )}
          </footer>
        )}
      </div>
    </div>
  );
};

export default RefreshPreviewModal;
