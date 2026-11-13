import type { ArticleIdea } from "../../../types";
import type { ArticleIdeaUpdateRequest } from "../../../services/api";
import { AiBubble } from "./AiBubble";
import { ArticleIdeaCard } from "./ArticleIdeaCard";
import { t } from "../../../i18n";

export function IdeasBubble({
  ideas,
  loading,
  sortedIdeas,
  onWriteArticle,
  onEditIdea,
  onViewArticle,
  generatedIdeaIds,
}: {
  ideas: ArticleIdea[];
  loading: boolean;
  sortedIdeas: ArticleIdea[];
  onWriteArticle: (idea: ArticleIdea) => void;
  onEditIdea: (ideaId: string, payload: ArticleIdeaUpdateRequest) => Promise<boolean>;
  /** برای ایده‌ای که از قبل مقاله‌اش ساخته شده صدا زده می‌شود تا همان مقاله باز شود. */
  onViewArticle: (idea: ArticleIdea) => void;
  /** شناسه‌ی ایده‌هایی که تولید مقاله‌شان همین الان (در همین سشن) شروع شده ولی
   *  هنوز تمام نشده — فقط برای غیرفعال‌کردن آنیِ دکمه تا قبل از این‌که وضعیتِ
   *  نهاییِ بک‌اند (idea.has_article / idea.status) برسد. */
  generatedIdeaIds?: Set<string>;
}) {
  return (
    <AiBubble
      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 5.969 5.969 0 002.328-.256c.19-.06.4-.036.586.045A9.06 9.06 0 0012 20.25z" /></svg>}
      title={t("analyze.empty.tagIdeas")}
    >
      <p className="text-xs text-[#0D0F23] mb-4">
        {ideas.length > 0 ? t("analyze.ideas.ready", { count: ideas.length }) : t("analyze.ideas.preparing")}
      </p>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 border-2 border-[#E4E5F0] border-t-[#B08D57] rounded-full animate-spin" />
        </div>
      )}

      {ideas.length > 0 && (
        <div className="space-y-3">
          {sortedIdeas.map((idea) => {
            // منبع قطعی و پایدار (حتی بعد از رفرش صفحه): فیلدی که بک‌اند روی
            // خودِ idea برمی‌گرداند. اگر has_article هنوز به تایپ اضافه نشده
            // بود، به status هم به‌عنوان جایگزین اعتماد می‌کنیم.
            const articleDone = Boolean(
              (idea as { has_article?: boolean }).has_article ?? idea.status === "used",
            );
            const isGenerating = !articleDone && Boolean(generatedIdeaIds?.has(idea.id));
            return (
              <ArticleIdeaCard
                key={idea.id}
                idea={idea}
                onWrite={() => onWriteArticle(idea)}
                onEdit={onEditIdea}
                onViewArticle={() => onViewArticle(idea)}
                hasArticle={articleDone}
                isGenerating={isGenerating}
              />
            );
          })}
        </div>
      )}
    </AiBubble>
  );
}