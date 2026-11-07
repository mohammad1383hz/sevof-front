// src/components/article-generate/SeoReviewCard.tsx
import type { Article, ArticleSeoReview } from "../../types";
import { BREAKDOWN_LABELS } from "./constants";
import { scoreBarColor, scoreColor } from "./helpers";
import { Spinner } from "./UiBits";
import { t, getLocale } from "../../i18n";

export const SeoReviewCard: React.FC<{ article: Article }> = ({ article }) => {
  const review = article.seo_review as ArticleSeoReview | null;
  const loading = article.status === "reviewing";

  if (!review && !loading && article.status !== "completed") return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900">📊 {t("article.seo.title")}</h3>
        {loading && <Spinner />}
      </div>

      {!review ? (
        <p className="text-xs text-slate-400">
          {loading
            ? t("article.seo.evaluating")
            : t("article.seo.failed")}
        </p>
      ) : (
        <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
          <div className="flex flex-col items-center gap-2 mx-auto">
            <div className="relative h-28 w-28">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={review.seo_score >= 80 ? "#10b981" : review.seo_score >= 60 ? "#f59e0b" : "#f43f5e"}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(review.seo_score / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-black ${scoreColor(review.seo_score)}`}>
                  {review.seo_score.toLocaleString(getLocale())}
                </span>
                <span className="text-[10px] text-slate-400">{t("article.seo.outOf100")}</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-500">{t("article.seo.overall")}</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              {Object.entries(review.breakdown).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="w-36 text-[11px] font-bold text-slate-500 shrink-0">
                    {BREAKDOWN_LABELS[k] ?? k}
                  </span>
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(v)}`}
                      style={{ width: `${v}%` }}
                    />
                  </div>
                  <span className={`w-8 text-start text-[11px] font-black ${scoreColor(v)}`}>
                    {v.toLocaleString(getLocale())}
                  </span>
                </div>
              ))}
            </div>

            {review.suggestions.length > 0 && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                <div className="text-[11px] font-black text-indigo-700 mb-2">{t("article.seo.suggestions")}</div>
                <ul className="space-y-1.5">
                  {review.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-6">
                      <span className="text-indigo-400 shrink-0">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
