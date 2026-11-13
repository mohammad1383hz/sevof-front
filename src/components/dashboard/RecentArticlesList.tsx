import type { DashboardRecentArticle } from "../../types";
import { getArticleStatusBadge } from "../../utils/dashboardFormat";
import { t, formatDate } from "../../i18n";

interface RecentArticlesListProps {
  articles: DashboardRecentArticle[];
  onArticleClick: (articleId: string) => void;
}

const RecentArticlesList: React.FC<RecentArticlesListProps> = ({ articles, onArticleClick }) => {
  return (
    <div className="bg-white border border-[#E4E5F0] rounded-2xl p-3.5 sm:p-5 lg:p-6 overflow-hidden">
      <h2 className="font-bold text-sm sm:text-base text-[#0D0F23] mb-3 sm:mb-4">{t("dashboard.recent.title")}</h2>
      {articles.length === 0 ? (
        <div className="text-center py-8 sm:py-10 text-[#9A9DB8] text-xs sm:text-sm border border-dashed border-[#E4E5F0] rounded-xl">
          {t("dashboard.recent.empty")}
        </div>
      ) : (
        <div className="space-y-2.5">
          {articles.map((article) => {
            const badge = getArticleStatusBadge(article.status);
            return (
              <div
                key={article.id}
                onClick={() => onArticleClick(article.id)}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border border-[#E4E5F0] bg-[#F3F2FB]/60 rounded-xl p-3 hover:border-[#5B47FB]/40 hover:bg-[#EFEDFF]/40 hover:shadow-sm active:bg-[#EFEDFF] active:scale-[0.99] cursor-pointer transition-all min-w-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-[#0D0F23] truncate">{article.title}</p>
                  <p className="text-[11px] sm:text-xs text-[#9A9DB8] mt-0.5 truncate">
                    {formatDate(article.created_at)}
                    {article.completed_at && ` · ${t("dashboard.recent.publishedOn", { date: formatDate(article.completed_at) })}`}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-1.5 text-[11px] sm:text-xs text-[#0D0F23]">
                    {article.seo_score !== null && <span className="shrink-0">SEO: {article.seo_score}</span>}
                    {article.word_count !== null && (
                      <span className="shrink-0">{t("article.words", { count: article.word_count })}</span>
                    )}
                    <span className={`font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 ${badge.cls}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArticleClick(article.id);
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#5B47FB] px-3.5 py-2 text-[11px] sm:text-xs font-bold text-white transition-colors group-hover:bg-[#4935E0] group-active:bg-[#4935E0]"
                >
                  {t("dashboard.view")}
                 
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentArticlesList;