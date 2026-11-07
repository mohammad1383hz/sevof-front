// src/components/article-generate/ErrorBanner.tsx
import type { Article } from "../../types";
import { Spinner } from "./UiBits";
import { t } from "../../i18n";

interface ErrorBannerProps {
  article: Article;
  onRetry: () => void;
  retrying: boolean;
  embedded?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ article, onRetry, retrying, embedded = false }) => {
  const isPausedCredit = article.status === "paused_credit";
  const isFailed = article.status === "failed";

  if (!isPausedCredit && !isFailed) return null;

  const palette = isPausedCredit
    ? {
        wrap: "border-amber-200 bg-amber-50",
        title: "text-amber-700",
        text: "text-amber-600",
        subtext: "text-amber-400",
        btn: "bg-amber-600 hover:bg-amber-700",
      }
    : {
        wrap: "border-rose-200 bg-rose-50",
        title: "text-rose-700",
        text: "text-rose-600",
        subtext: "text-rose-400",
        btn: "bg-rose-600 hover:bg-rose-700",
      };

  return (
    // در embedded، این banner داخل timeline همان session است و نباید sticky دوم بسازد.
    <div className={embedded ? "relative z-0" : "sticky top-2 z-30"}>
      <div className={`rounded-2xl border p-5 shadow-lg ${palette.wrap}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h3 className={`text-sm font-black mb-1 ${palette.title}`}>
              {isPausedCredit ? t("article.error.pausedCredit") : t("article.error.paused")}
            </h3>
            <p className={`text-xs leading-6 break-words ${palette.text}`}>
              {article.error_message ?? t("common.errors.generic")}
            </p>
            <p className={`text-[11px] mt-1 ${palette.subtext}`}>
              {isPausedCredit ? t("article.error.savedCredit") : t("article.error.savedRetry")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {isPausedCredit && (
              <a
                href="/subscription" // ← مسیر واقعی صفحه‌ی خرید/تمدید کریدیت رو این‌جا بگذار
                className="inline-flex items-center rounded-xl border border-amber-600 px-5 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors"
              >
                 {t("article.error.buyCredits")}
              </a>
            )}

            <button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-60 ${palette.btn}`}
            >
              {retrying && <Spinner className="h-3.5 w-3.5 text-white" />}
              {isPausedCredit ? t("article.error.resume") : t("analyze.ideas.retry")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};