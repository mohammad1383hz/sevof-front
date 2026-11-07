// src/components/article-generate/BriefCard.tsx
import type { Article } from "../../types";
import { INTENT_LABELS } from "./constants";
import { Spinner } from "./UiBits";
import { t } from "../../i18n";

export const BriefCard: React.FC<{ article: Article }> = ({ article }) => {
  const brief = article.brief;
  const loading = article.status === "creating_brief" || (article.status === "pending" && !brief);

  return (
    <div className="rounded-2xl border border-[#DAD5C7] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-[#1E2A28]">🗺️ {t("article.brief.title")}</h3>
        {loading && <Spinner />}
      </div>

      {!brief ? (
        <p className="text-xs text-[#000000]/70">
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
              <div key={item.label} className="rounded-xl bg-[#F4F2EC] p-3">
                <div className="text-[10px] font-bold text-[#000000]/70 mb-1">{item.label}</div>
                <div className="text-xs font-bold text-[#3D453F] leading-5">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[#F4F2EC] p-3">
            <div className="text-[10px] font-bold text-[#000000]/70 mb-1">{t("article.brief.goal")}</div>
            <p className="text-xs text-[#000000] leading-6">{brief.goal}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#1B6F63]/20 bg-[#DCEFEA]/50 p-3">
              <div className="text-[11px] font-black text-[#1B6F63] mb-2">{t("article.brief.mustCover")}</div>
              <ul className="space-y-1">
                {brief.important_topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#000000] leading-5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-[#1B6F63] shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#B08D57]/25 bg-[#EDE3CF]/50 p-3">
              <div className="text-[11px] font-black text-[#8A6A2F] mb-2">{t("article.brief.gaps")}</div>
              <ul className="space-y-1">
                {brief.competitor_gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#000000] leading-5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-[#B08D57] shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {brief.internal_link_plan?.url && (
            <div className="flex items-center gap-2 rounded-xl border border-[#DAD5C7] p-3 text-xs">
              <span className="font-bold text-[#000000] shrink-0">🔗 {t("analyze.idea.linksLabel")}</span>
              <span className="text-[#000000] truncate">
                {t("article.brief.linkPlan", { anchor: brief.internal_link_plan.anchor_suggestion, section: brief.internal_link_plan.best_section })}
              </span>
              <span className="text-[#000000]/60 font-mono text-[10px] truncate ms-auto" dir="ltr">
                {brief.internal_link_plan.url}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};