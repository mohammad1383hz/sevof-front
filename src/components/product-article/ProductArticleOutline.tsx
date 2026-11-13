import React, { useEffect, useState } from "react";
import { Spinner } from "../article-generate/UiBits";
import { getLocale, t } from "../../i18n";

/**
 * نقشه‌ی مقاله (Outline)
 * از article.sections (و در نبودِ آن article.assignments) ساخته می‌شود.
 * هر کدام: position, type, heading, subheadings, key_points, target_words, status
 */

interface OutlineItem {
  id?: number | string;
  position?: number;
  type?: string | null;
  heading?: string | null;
  subheadings?: unknown;
  key_points?: unknown;
  target_words?: number | null;
  status?: string | null;
}

interface ProductArticleOutlineProps {
  article: {
    status?: string | null;
    sections?: OutlineItem[] | null;
    assignments?: OutlineItem[] | null;
  };
}

const TYPE_LABELS: Record<string, string> = {
  get intro() { return t("article.sectionType.introduction"); },
  get introduction() { return t("article.sectionType.introduction"); },
  get conclusion() { return t("article.sectionType.conclusion"); },
  get faq() { return t("article.sectionType.faq"); },
  get product() { return t("product.outline.types.product"); },
  get products() { return t("product.outline.types.products"); },
  get comparison() { return t("product.outline.types.comparison"); },
  get buying_guide() { return t("product.outline.types.buyingGuide"); },
  get guide() { return t("product.outline.types.guide"); },
};

/** subheadings / key_points ممکن است آرایه، رشته‌ی JSON یا آرایه‌ی آبجکت باشند */
function toList(value: unknown): string[] {
  let v: unknown = value;

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return [];
    try {
      v = JSON.parse(s);
    } catch {
      return [s];
    }
  }

  if (!Array.isArray(v)) return [];

  return v
    .map((x) => {
      if (typeof x === "string") return x.trim();
      if (x && typeof x === "object") {
        const o = x as Record<string, unknown>;
        const t = o.title ?? o.heading ?? o.text ?? o.point ?? o.name;
        return typeof t === "string" ? t.trim() : "";
      }
      return "";
    })
    .filter(Boolean);
}

const fa = (n: number) => n.toLocaleString(getLocale());

const StatusDot: React.FC<{ status?: string | null }> = ({ status }) => {
  if (status === "generated") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">
        ✓
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
        !
      </span>
    );
  }
  if (status === "generating") {
    return <Spinner className="h-5 w-5 shrink-0" />;
  }
  return <span className="h-5 w-5 shrink-0 rounded-full border-2 border-[#E4E5F0] bg-white" />;
};

export const ProductArticleOutline: React.FC<ProductArticleOutlineProps> = ({ article }) => {
  const items: OutlineItem[] = (
    article.sections && article.sections.length > 0 ? article.sections : article.assignments ?? []
  )
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const status = article.status ?? "";
  const done = status === "completed";

  // تا وقتی مقاله در حال تولید است باز می‌ماند؛ بعد از اتمام جمع می‌شود
  const [open, setOpen] = useState(!done);
  useEffect(() => {
    setOpen(!done);
  }, [done]);

  const waiting =
    items.length === 0 && (status === "pending" || status.startsWith("creating"));

  if (items.length === 0 && !waiting) return null;

  if (waiting) {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl border border-[#E4E5F0] bg-white p-5"
      >
        <Spinner className="h-5 w-5" />
        <p className="text-xs font-bold text-[#0D0F23]">{t("product.outline.building")}</p>
      </div>
    );
  }

  const totalWords = items.reduce((sum, it) => sum + (it.target_words ?? 0), 0);
  const generatedCount = items.filter((it) => it.status === "generated").length;

  return (
    <div className="rounded-2xl border border-[#E4E5F0] bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-start"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h2 className="text-sm font-black text-[#0D0F23]">{t("product.outline.title")}</h2>
          <p className="mt-0.5 text-[11px] text-[#0D0F23]/60">
            {fa(items.length)} sections
            {totalWords > 0 ? ` • ${t("product.outline.approxWords", { count: totalWords })}` : ""}
            {!done ? ` • ${t("product.outline.written", { done: generatedCount, total: items.length })}` : ""}
          </p>
        </div>
        <span
          className={`text-xs text-[#0D0F23]/60 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <ol className="space-y-3 border-t border-[#E4E5F0] p-4">
          {items.map((it, idx) => {
            const subs = toList(it.subheadings);
            const points = toList(it.key_points);
            const typeLabel = it.type ? TYPE_LABELS[it.type] ?? it.type : null;

            return (
              <li
                key={it.id ?? idx}
                className="rounded-xl border border-[#E4E5F0] bg-[#EFEDFF]/25 p-4"
              >
                <div className="flex items-start gap-3">
                  <StatusDot status={it.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[13px] font-black leading-6 text-[#0D0F23] break-words">
                        {fa(it.position ?? idx + 1)}. {it.heading || t("product.outline.untitled")}
                      </h3>
                      {typeLabel && (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#0D0F23]/70 border border-[#E4E5F0]">
                          {typeLabel}
                        </span>
                      )}
                      {it.target_words ? (
                        <span className="text-[10px] text-[#0D0F23]/50">
                          {t("product.outline.target", { count: it.target_words })}
                        </span>
                      ) : null}
                    </div>

                    {subs.length > 0 && (
                      <ul className="mt-2 space-y-1 ps-4 text-[12px] leading-6 text-[#0D0F23] list-disc marker:text-[#0D0F23]/40">
                        {subs.map((s, i) => (
                          <li key={i} className="break-words">
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}

                    {points.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] font-bold text-[#0D0F23]/70">{t("product.outline.keyPoints")}</p>
                        <ul className="mt-1 space-y-1 ps-4 text-[11px] leading-6 text-[#0D0F23]/70 list-disc marker:text-[#0D0F23]/30">
                          {points.map((p, i) => (
                            <li key={i} className="break-words">
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default ProductArticleOutline;