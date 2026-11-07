import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { ArticleIdea } from "../../types";
import { articleIdeaService } from "../../services/api";
import ToggleSwitch from "./ToggleSwitch";
import { t, formatNumber } from "../../i18n";

interface UnusedOpportunitiesPanelProps {
  siteId: string;
}

type Filter = "all" | "active" | "excluded";

const PAGE_SIZE = 6;

/** ایده‌ای که هنوز به مقاله تبدیل نشده */
const isUnused = (idea: ArticleIdea) => !idea.has_article && idea.article_id == null && idea.status !== "used";

/** وضعیت rejected قدیمی هم برای Auto Pilot کنار گذاشته حساب می‌شود (بک‌اند هم همین را رعایت می‌کند) */
const isExcluded = (idea: ArticleIdea) => Boolean(idea.autopilot_excluded) || idea.status === "rejected";

const UnusedOpportunitiesPanel: React.FC<UnusedOpportunitiesPanelProps> = ({ siteId }) => {
  const [ideas, setIdeas] = useState<ArticleIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await articleIdeaService.list(siteId);
      if (res.success && res.data?.data) {
        setIdeas(res.data.data.filter(isUnused));
      } else {
        setLoadError(res.message || t("growth.unused.loadFailed"));
      }
    } catch {
      setLoadError(t("growth.unused.network"));
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const excluded = ideas.filter(isExcluded).length;
    return { all: ideas.length, active: ideas.length - excluded, excluded };
  }, [ideas]);

  const visible = useMemo(() => {
    const filtered = ideas.filter((idea) =>
      filter === "all" ? true : filter === "excluded" ? isExcluded(idea) : !isExcluded(idea),
    );
    return showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  }, [ideas, filter, showAll]);

  const filteredTotal = filter === "all" ? counts.all : filter === "active" ? counts.active : counts.excluded;

  const handleToggle = async (idea: ArticleIdea, includeInAutopilot: boolean) => {
    if (pendingIds.has(idea.id)) return;
    setSaveError(null);

    const previous = idea;
    const optimistic: ArticleIdea = {
      ...idea,
      autopilot_excluded: !includeInAutopilot,
      status: includeInAutopilot && idea.status === "rejected" ? "suggested" : idea.status,
    };

    setIdeas((list) => list.map((i) => (i.id === idea.id ? optimistic : i)));
    setPendingIds((s) => new Set(s).add(idea.id));

    try {
      const res = await articleIdeaService.update(siteId, idea.id, {
        autopilot_excluded: !includeInAutopilot,
        // ایده‌ای که قبلاً «ردشده» بوده با روشن شدن دوباره به چرخه برمی‌گردد
        ...(includeInAutopilot && idea.status === "rejected" ? { status: "suggested" as const } : {}),
      });

      if (res.success && res.data?.data) {
        const saved = res.data.data;
        setIdeas((list) => list.map((i) => (i.id === idea.id ? saved : i)));
      } else {
        throw new Error(res.message);
      }
    } catch {
      setIdeas((list) => list.map((i) => (i.id === idea.id ? previous : i)));
      setSaveError(t("growth.unused.saveFailed"));
    } finally {
      setPendingIds((s) => {
        const next = new Set(s);
        next.delete(idea.id);
        return next;
      });
    }
  };

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: t("growth.unused.all"), count: counts.all },
    { key: "active", label: t("growth.unused.active"), count: counts.active },
    { key: "excluded", label: t("growth.unused.excluded"), count: counts.excluded },
  ];

  return (
    <section
      aria-labelledby="unused-opportunities-title"
      className="bg-white border border-[#DAD5C7] rounded-2xl p-3.5 sm:p-5 lg:p-6 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 id="unused-opportunities-title" className="font-bold text-sm sm:text-base text-[#1E2A28]">
          {t("growth.unused.title")}
        </h2>
        {!loading && !loadError && (
          <span className="text-[11px] sm:text-xs font-bold text-[#1B6F63] bg-[#DCEFEA] rounded-full px-2.5 py-0.5 shrink-0">
            {t("growth.gsc.opportunitiesCount", { count: counts.all })}
          </span>
        )}
      </div>

      {/* توضیح رفتار سیستم: کاربر باید بداند خاموش کردن دقیقاً چه می‌کند */}
      <div className="flex gap-2.5 rounded-xl bg-[#EFEDE6]/70 border border-[#DAD5C7]/70 p-3 mb-3">
        <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#1B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-[11px] sm:text-xs leading-6 text-[#384B43]">
          {t("growth.unused.body")}
        </p>
      </div>

      {saveError && (
        <div role="alert" className="mb-3 p-2.5 rounded-xl bg-[#F7EEEA] border border-[#E3C4BC] text-[11px] sm:text-xs text-[#B3453A]">
          {saveError}
        </div>
      )}

      {loading && (
        <div className="space-y-2" aria-busy="true" aria-label={t("growth.unused.loading")}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-[#EFEDE6] animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      )}

      {!loading && loadError && (
        <div className="text-center py-6 border border-dashed border-[#E3C4BC] rounded-xl">
          <p className="text-xs sm:text-sm text-[#B3453A]">{loadError}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 text-[11px] sm:text-xs font-bold text-[#14564C] bg-[#DCEFEA] rounded-lg px-3 py-1.5 hover:bg-[#c9e6de] transition-colors"
          >
            {t("growth.gsc.retry")}
          </button>
        </div>
      )}

      {!loading && !loadError && counts.all === 0 && (
        <div className="text-center py-8 sm:py-10 text-[#9BA69F] text-xs sm:text-sm border border-dashed border-[#DAD5C7] rounded-xl px-4 leading-6">
          {t("growth.unused.allUsed")}
        </div>
      )}

      {!loading && !loadError && counts.all > 0 && (
        <>
          <div role="tablist" aria-label={t("growth.unused.filter")} className="flex gap-1 p-1 mb-3 rounded-xl bg-[#EFEDE6] overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => {
                  setFilter(f.key);
                  setShowAll(false);
                }}
                className={`flex-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs font-bold transition-all ${
                  filter === f.key ? "bg-white text-[#1E2A28] shadow-sm" : "text-[#6B7A73] hover:text-[#1E2A28]"
                }`}
              >
                {f.label}
                <span className="mr-1 text-[#9BA69F]">({f.count.toLocaleString("fa-IR")})</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="text-center py-6 text-[#9BA69F] text-xs sm:text-sm border border-dashed border-[#DAD5C7] rounded-xl">
              {filter === "excluded" ? t("growth.unused.noneExcluded") : t("growth.unused.allExcluded")}
            </div>
          ) : (
            <ul className="space-y-2">
              {visible.map((idea) => {
                const excluded = isExcluded(idea);
                const pending = pendingIds.has(idea.id);

                return (
                  <li
                    key={idea.id}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 sm:p-3 min-w-0 transition-colors ${
                      excluded ? "border-[#DAD5C7]/60 bg-[#EFEDE6]/50" : "border-[#DAD5C7] bg-white"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs sm:text-sm font-bold leading-6 line-clamp-2 ${
                          excluded ? "text-[#9BA69F]" : "text-[#1E2A28]"
                        }`}
                        title={idea.title}
                      >
                        {idea.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {idea.entity?.name && (
                          <span className="text-[11px] text-[#9BA69F] truncate max-w-[12rem]">{idea.entity.name}</span>
                        )}
                        {idea.seo_score !== null && (
                          <span className="text-[11px] font-bold text-[#1B6F63] bg-[#DCEFEA] rounded-full px-2 py-0.5">
                            {t("growth.unused.score", { score: idea.seo_score })}
                          </span>
                        )}
                        <span
                          className={`text-[11px] font-bold rounded-full px-2 py-0.5 ${
                            excluded ? "bg-[#F7EEEA] text-[#B3453A]" : "bg-[#EFEDE6] text-[#384B43]"
                          }`}
                        >
                          {excluded ? t("growth.unused.notUsed") : t("growth.unused.active")}
                        </span>
                      </div>
                    </div>

                    <ToggleSwitch
                      checked={!excluded}
                      disabled={pending}
                      onChange={(checked) => handleToggle(idea, checked)}
                      label={excluded ? t("growth.unused.include", { title: idea.title }) : t("growth.unused.exclude", { title: idea.title })}
                    />
                  </li>
                );
              })}
            </ul>
          )}

          {filteredTotal > PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 w-full rounded-xl border border-[#DAD5C7] py-2 text-[11px] sm:text-xs font-bold text-[#14564C] hover:bg-[#DCEFEA]/50 transition-colors"
            >
              {showAll ? t("growth.gsc.showLess") : t("growth.gsc.showAll", { count: formatNumber(filteredTotal) })}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default UnusedOpportunitiesPanel;
