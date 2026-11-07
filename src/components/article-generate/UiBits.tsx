// src/components/article-generate/UiBits.tsx
import type { ArticleSection } from "../../types";
import { t } from "../../i18n";

export const Spinner: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg className={`animate-spin text-blue-500 ${className}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export const CheckIcon: React.FC = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" clipRule="evenodd" />
  </svg>
);

export const WordPressIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM3.5 12a8.5 8.5 0 014.6-7.55L12.3 16.9 8.7 17 3.5 12zm14.9 3.9L16.2 6.3c.6-.03 1.15-.1 1.15-.1.55-.07.48-.87-.06-.84 0 0-1.63.13-2.68.13-1 0-2.66-.13-2.66-.13-.55-.03-.61.8-.06.84 0 0 .52.06 1.06.1l1.58 4.32-2.22 6.66-3.7-11c.63-.03 1.2-.1 1.2-.1.55-.07.49-.88-.06-.84 0 0-1.67.13-2.74.13-.19 0-.42 0-.66-.01A8.49 8.49 0 0112 3.5c2.2 0 4.2.85 5.69 2.24-.04 0-.07-.01-.11-.01-1 0-1.72.88-1.72 1.83 0 .85.49 1.57 1 2.42.4.68.86 1.56.86 2.83 0 .88-.34 1.9-.78 3.32l-1.02 3.4-.02-.03zM12 20.5a8.46 8.46 0 01-2.4-.35l2.55-7.4 2.61 7.15c.02.04.04.07.06.1A8.46 8.46 0 0112 20.5zm7.24-11.2c.06.44.1.9.1 1.4a8.47 8.47 0 01-.68 3.34l-2.8 8.1a8.5 8.5 0 003.38-12.84z" />
  </svg>
);

export const SectionStatusBadge: React.FC<{ status: ArticleSection["status"] }> = ({ status }) => {
  if (status === "generated")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2.5 py-0.5">
        <CheckIcon /> {t("article.status.generated")}
      </span>
    );
  if (status === "failed")
    return (
      <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold px-2.5 py-0.5">
        {t("dashboard.articleStatus.failed")}
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-0.5">
      {t("article.status.pending")}
    </span>
  );
};
