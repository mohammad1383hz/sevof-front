// src/components/article-generate/BriefCard.tsx
import type { Article } from "../../types";
import { INTENT_LABELS } from "./constants";
import { Spinner } from "./UiBits";
import { t } from "../../i18n";

export const BriefCard: React.FC<{ article: Article }> = ({ article }) => {
  const brief = article.brief;
  const loading = article.status === "creating_brief" || (article.status === "pending" && !brief);

  return (
    <div className="rounded-2xl border border-[#E4E5F0] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-[#0D0F23]">🗺️ {t("article.brief.title")}</h3>
        {loading && <Spinner />}
      </div>

      {!brief ? (
        <p className="text-xs text-[#0D0F23]/70">
          {loading ? t("article.brief.analyzing") : t("article.brief.notYet")}
        </p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: t("article.brief.audience"), value: brief.audience },
              { label: t("analyze.idea.score.intent"), value: INTENT_LABELS[brief.search_intent] ?? brief.search_intent },
              { label: t("article.brief.tone"), value: brief.tone },
              { label: t("article.brief.length"), value: t("article.words", { count: brief.target_word_count }) },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-[#F6F6FB] p-3">
                <div className="text-[10px] font-bold text-[#0D0F23]/70 mb-1">{item.label}</div>
                <div className="text-xs font-bold text-[#3B3F5C] leading-5">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[#F6F6FB] p-3">
            <div className="text-[10px] font-bold text-[#0D0F23]/70 mb-1">{t("article.brief.goal")}</div>
            <p className="text-xs text-[#0D0F23] leading-6">{brief.goal}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#5B47FB]/20 bg-[#EFEDFF]/50 p-3">
              <div className="text-[11px] font-black text-[#5B47FB] mb-2">{t("article.brief.mustCover")}</div>
              <ul className="space-y-1">
                {brief.important_topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#0D0F23] leading-5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-[#5B47FB] shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#B08D57]/25 bg-[#EDE3CF]/50 p-3">
              <div className="text-[11px] font-black text-[#8A6A2F] mb-2">{t("article.brief.gaps")}</div>
              <ul className="space-y-1">
                {brief.competitor_gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#0D0F23] leading-5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-[#B08D57] shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {brief.internal_link_plan?.url && (
            <div className="flex items-center gap-2 rounded-xl border border-[#E4E5F0] p-3 text-xs">
              <span className="font-bold text-[#0D0F23] shrink-0">🔗 {t("analyze.idea.linksLabel")}</span>
              <span className="text-[#0D0F23] truncate">
                {t("article.brief.linkPlan", { anchor: brief.internal_link_plan.anchor_suggestion, section: brief.internal_link_plan.best_section })}
              </span>
              <span className="text-[#0D0F23]/60 font-mono text-[10px] truncate ms-auto" dir="ltr">
                {brief.internal_link_plan.url}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};