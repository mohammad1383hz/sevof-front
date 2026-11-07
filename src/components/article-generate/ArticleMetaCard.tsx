// src/components/article-generate/ArticleMetaCard.tsx
import React, { useState } from "react";
import type { Article } from "../../types";
import type { ChatTargetSelection } from "./chatTarget";
import { t } from "../../i18n";

type MetaFieldType =
  | "title"
  | "meta_title"
  | "meta_description"
  | "excerpt"
  | "focus_keyword"
  | "slug"
  | "og_title"
  | "og_description";

const PRIMARY_FIELDS: { type: MetaFieldType; label: string }[] = [
  { type: "title", get label() { return t("article.target.title"); } },
  { type: "meta_title", get label() { return t("article.target.metaTitleLong"); } },
  { type: "meta_description", get label() { return t("article.target.metaDescriptionLong"); } },
  { type: "excerpt", get label() { return t("article.target.excerptLong"); } },
];

const ADVANCED_FIELDS: { type: MetaFieldType; label: string; hint?: string }[] = [
  { type: "focus_keyword", get label() { return t("article.meta.focusKeyword"); } },
  { type: "slug", get label() { return t("article.meta.slug"); }, get hint() { return t("article.meta.slugHint"); } },
  { type: "og_title", get label() { return t("article.meta.ogTitle"); } },
  { type: "og_description", get label() { return t("article.meta.ogDescription"); } },
];

const ALL_FIELDS = [...PRIMARY_FIELDS, ...ADVANCED_FIELDS];

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// selectedTarget/onSelectTarget/onArticleChange دیگه استفاده نمی‌شن (چت/ادیت حذف شده)
// ولی برای سازگاری با ArticleGeneratePage.tsx در امضا نگه داشته شدن
interface ArticleMetaCardProps {
  siteId: number | string;
  article: Article;
  selectedTarget?: ChatTargetSelection | null;
  onSelectTarget?: (t: ChatTargetSelection) => void;
  onArticleChange?: (article: Article) => void;
}

export const ArticleMetaCard: React.FC<ArticleMetaCardProps> = ({ article }) => {
  const [cardOpen, setCardOpen] = useState(false);

  const renderField = (field: { type: MetaFieldType; label: string; hint?: string }) => {
    const { type, label, hint } = field;
    const value = (article as any)[type] ?? "";

    return (
      <div key={type} className="rounded-xl border border-slate-200 p-3.5">
        <div className="mb-1.5">
          <span className="text-[11px] font-bold text-slate-500">{label}</span>
        </div>
        <p className="select-text whitespace-pre-line text-xs leading-6 text-slate-700">
          {value || <span className="text-slate-300">— {t("article.meta.empty")} —</span>}
        </p>
        {hint && !value && <p className="mt-1 text-[10px] text-slate-400">{hint}</p>}
      </div>
    );
  };

  const filledCount = ALL_FIELDS.filter((f) => Boolean((article as any)[f.type])).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setCardOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 p-5 text-start"
      >
        <span className="flex items-center gap-2">
          <h3 className="text-sm font-black text-slate-900">{t("article.meta.title")}</h3>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
            {filledCount}/{ALL_FIELDS.length}
          </span>
        </span>
        <ChevronIcon open={cardOpen} />
      </button>

      {cardOpen && (
        <div className="space-y-3 border-t border-slate-100 p-5">{ALL_FIELDS.map(renderField)}</div>
      )}
    </div>
  );
};