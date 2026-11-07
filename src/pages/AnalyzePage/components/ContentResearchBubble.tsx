import { AiBubble } from "./AiBubble";
import { t, getLocale } from "../../../i18n";

type ResearchType = "keyword_clusters" | "competitor_gaps";

export type Recommendation = {
  title?: string;
  description?: string;
  priority?: "high" | "medium" | "low" | number;
  action?: string;
};
type KeywordCluster = {
  id: number;
  name: string;
  primary_keyword: string;
  related_keywords: string[];
  search_intent: string;
  estimated_search_volume: number;
  volume_label: string;
  trend_direction: "up" | "stable" | "down" | "unavailable" | "estimated";
  trend_percentage: number | null;
  difficulty: string;
  opportunity_score: number;
  competitor_count: number;
  data_source: string;
  evidence: {
    why_now?: string;
    source?: string;
    trend_note?: string;
    query_metrics?: unknown[];
    serp_sample?: unknown[];
  };
};

// فقط همان دو جمله‌ای که سرویس بک‌اند واقعاً تولید و ذخیره می‌کند:
// summary (چرا رقیب حساب می‌شود و چه چیزی را پوشش می‌دهد) و gap (چه
// چیزی نسبت به این رقیب کم داریم). بقیه‌ی فیلدها (keywords/evidence_urls/
// ranking_positions/appearances) داده‌ی قطعی PHP هستند، نه نوشته‌ی AI.
type CompetitorEvidence = {
  source?: string;
  summary?: string;
  gap?: string;
  keywords?: string[];
  evidence_urls?: string[];
  ranking_positions?: number[];
  appearances?: number;
};

type Competitor = {
  id: number;
  domain: string | null;
  display_name: string;
  best_position: number | null;
  visibility_score: number;
  threat_level: "low" | "medium" | "high";
  threat_score: number;
  data_source: string;
  evidence: CompetitorEvidence;
};

type GapIntent = "informational" | "commercial" | "transactional" | "navigational";
type SiteCoverage = "missing" | "weak" | "ranking_low";

// site_gap و content_outline عمداً از اینجا حذف شدند: بک‌اند دیگر آن‌ها را
// از AI نمی‌خواهد، چون در هیچ‌کجای این کامپوننت رندر نمی‌شدند.
type GapEvidence = {
  source?: string;
  keyword?: string;
  intent?: GapIntent;
  site_coverage?: SiteCoverage;
  current_site_position?: number | null;
  competitor_domain?: string | null;
  competitor_url?: string | null;
  competitor_title?: string | null;
  competitor_position?: number | null;
  recommended_format?: string;
  evidence_urls?: string[];
};

type ContentGap = {
  id: number;
  query: string;
  title: string;
  gap_type: string;
  description: string;
  recommended_angle: string;
  opportunity_score: number;
  threat_level: "low" | "medium" | "high";
  competitor: string | null;
  data_source: string;
  evidence: GapEvidence;
};

const intentMeta: Record<GapIntent, { label: string; bg: string; text: string }> = {
  informational: { label: "analyze.research.intent.informational", bg: "#EFEDE6", text: "#000000" },
  commercial: { label: "analyze.research.intent.commercial", bg: "#FFF8E9", text: "#8A6A2F" },
  transactional: { label: "analyze.research.intent.transactional", bg: "#DCEFEA", text: "#14564C" },
  navigational: { label: "analyze.research.intent.navigational", bg: "#F3EFEA", text: "#7D8882" },
};

const coverageMeta: Record<SiteCoverage, { label: string; bg: string; text: string }> = {
  missing: { label: "analyze.research.coverage.missing", bg: "#F7EEEA", text: "#B3453A" },
  weak: { label: "analyze.research.coverage.weak", bg: "#FFF8E9", text: "#8A6A2F" },
  ranking_low: { label: "analyze.research.coverage.low", bg: "#FFF8E9", text: "#8A6A2F" },
};

const threatLabel: Record<"low" | "medium" | "high", string> = {
  low: "analyze.research.level.low",
  medium: "analyze.research.level.medium",
  high: "analyze.research.level.high",
};

export function ContentResearchBubble({
  type,
  clusters = [],
  competitors = [],
  gaps = [],
  summary,
  siteAnalysis,
  recommendations = [],
  manusTaskUrl,
  onGapAction,
}: {
  type: ResearchType;
  clusters?: KeywordCluster[];
  competitors?: Competitor[];
  gaps?: ContentGap[];
  summary?: string | null;
  siteAnalysis?: {
    strengths?: string[];
    weaknesses?: string[];
    search_visibility?: string;
    content_depth?: string;
  };
  recommendations?: Recommendation[];
  manusTaskUrl?: string | null;
  onGapAction?: (gap: ContentGap) => void;
}) {
  const isClusters = type === "keyword_clusters";

  const avgOpportunity = gaps.length
    ? Math.round(gaps.reduce((sum, gap) => sum + gap.opportunity_score, 0) / gaps.length)
    : 0;
  const highThreatCount = competitors.filter((c) => c.threat_level === "high").length;

  return (
    <AiBubble
      icon={
        isClusters ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7.5 6.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-6.75 10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM7.146 8.558l3.458 6.384m2.792 0l3.458-6.384" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4.5 19.5V9.75m5.25 9.75V4.5M15 19.5v-6.75m5.25 6.75V7.5" />
          </svg>
        )
      }
      title={isClusters ? t("analyze.research.clusters") : t("analyze.research.gapsResult")}
    >
      {isClusters ? (
        <>
          <RecommendationsSection recommendations={recommendations} manusTaskUrl={manusTaskUrl} />
          <div className="space-y-3">
            {clusters.map((cluster) => (
              <article key={cluster.id} className="rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6] p-4">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-[#1E2A28]">{cluster.name}</h3>
                    <p className="mt-1 text-xs font-bold text-[#1B6F63]">{cluster.primary_keyword}</p>
                  </div>
                  <ScorePill score={cluster.opportunity_score} />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Metric label={cluster.volume_label === "assistant_estimate" ? t("analyze.research.volumeEstimate") : t("analyze.research.volumeObserved")} value={cluster.estimated_search_volume.toLocaleString(getLocale())} />
                  <Metric label={t("analyze.idea.score.intent")} value={intentMeta[cluster.search_intent as GapIntent] ? t(intentMeta[cluster.search_intent as GapIntent].label) : cluster.search_intent} />
                  <Metric label={t("dashboard.keywords.difficulty")} value={difficultyLabel(cluster.difficulty)} />
                  <div className="rounded-xl bg-[#EFEDE6] px-2.5 py-2">
                    <p className="text-[10px] font-bold text-[#7D8882]">{t("analyze.research.trend")}</p>
                    <p className="mt-0.5 text-xs font-black text-[#384B43]">{cluster.trend_direction === "unavailable" ? t("analyze.research.trendNeedsTwo") : cluster.trend_direction === "estimated" ? t("analyze.research.trendUnavailable") : `${cluster.trend_direction} ${cluster.trend_percentage ?? 0}%`}</p>
                  </div>
                </div>

                <TagList items={cluster.related_keywords} className="mt-3" />

                {cluster.evidence?.why_now && <p className="mt-3 border-t border-[#DAD5C7] pt-3 text-xs font-bold leading-5 text-[#65716B]">{cluster.evidence.why_now}</p>}
                {cluster.evidence?.trend_note && <p className="mt-2 text-[11px] font-bold leading-5 text-[#7D8882]">{cluster.evidence.trend_note}</p>}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-5">
          {/* ۱. تعداد و خلاصه — اول از همه */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile label={t("analyze.research.stats.competitors")} value={competitors.length.toLocaleString(getLocale())} />
            <StatTile label={t("analyze.research.stats.opportunities")} value={gaps.length.toLocaleString(getLocale())} />
            <StatTile label={t("analyze.research.stats.avgScore")} value={`${avgOpportunity.toLocaleString(getLocale())}/100`} />
            <StatTile label={t("analyze.research.stats.highThreat")} value={highThreatCount.toLocaleString(getLocale())} accent={highThreatCount > 0} />
          </div>

          {(summary || siteAnalysis) && (
            <section className="rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6] p-4">
              {summary && <p className="text-sm font-bold leading-6 text-[#384B43]">{summary}</p>}

              {siteAnalysis && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {siteAnalysis.strengths?.length ? (
                    <div>
                      <p className="text-[10px] font-black text-[#1B6F63]">{t("analyze.research.strengths")}</p>
                      <ul className="mt-1 space-y-1">
                        {siteAnalysis.strengths.map((item, index) => (
                          <li key={`strength-${index}`} className="flex items-start gap-1.5 text-[11px] font-bold leading-5 text-[#000000]">
                            <CheckIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#1B6F63]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {siteAnalysis.weaknesses?.length ? (
                    <div>
                      <p className="text-[10px] font-black text-[#B3453A]">{t("analyze.research.weaknesses")}</p>
                      <ul className="mt-1 space-y-1">
                        {siteAnalysis.weaknesses.map((item, index) => (
                          <li key={`weakness-${index}`} className="flex items-start gap-1.5 text-[11px] font-bold leading-5 text-[#000000]">
                            <AlertIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#B3453A]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}

              {(siteAnalysis?.search_visibility || siteAnalysis?.content_depth) && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {siteAnalysis?.search_visibility && <Metric label={t("analyze.research.visibility")} value={siteAnalysis.search_visibility} />}
                  {siteAnalysis?.content_depth && <Metric label={t("analyze.research.depth")} value={siteAnalysis.content_depth} />}
                </div>
              )}
            </section>
          )}

          {/* ۲. پیشنهادهای کلی */}
          <RecommendationsSection recommendations={recommendations} manusTaskUrl={manusTaskUrl} />

          {/* ۳. فرصت‌های محتوایی — فقط چیزی که برای تصمیم لازم است؛ بدون جزئیات/منبع اضافه */}
          <section>
            <p className="mb-2 text-xs font-black text-[#384B43]">{t("analyze.research.opportunitiesTitle")}</p>
            <div className="space-y-3">
              {gaps.map((gap) => {
                const intent = gap.evidence.intent ? intentMeta[gap.evidence.intent] : null;
                const coverage = gap.evidence.site_coverage ? coverageMeta[gap.evidence.site_coverage] : null;

                return (
                  <article key={gap.id} className="rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6] p-4">
                                      <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-black leading-6 text-[#1E2A28]">{gap.title}</h3>
                        <p className="mt-1 text-[11px] font-bold text-[#1B6F63]">{gap.query}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onGapAction?.(gap)}
                        className="flex-shrink-0 rounded-full bg-[#1B6F63] px-3 py-1.5 text-[11px] font-black text-white transition-colors hover:bg-[#14564C]"
                      >
                        {t("analyze.research.takeAction")}
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {intent && <Badge bg={intent.bg} text={intent.text}>{t(intent.label)}</Badge>}
                      {coverage && <Badge bg={coverage.bg} text={coverage.text}>{t(coverage.label)}</Badge>}
                    </div>

                    <p className="mt-3 text-xs font-bold leading-6 text-[#000000]">{gap.description}</p>

                    <div className="mt-3 rounded-xl bg-[#DCEFEA]/60 px-3 py-2">
                      <p className="text-[10px] font-black text-[#14564C]">{t("analyze.research.recommendedAction")}{gap.evidence.recommended_format ? ` · ${gap.evidence.recommended_format}` : ""}</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-[#31594F]">{gap.recommended_angle}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ۴. سایت‌های رقیب — پشت یک دراپ‌دان بسته (پیش‌فرض جمع‌شده) */}
          <details className="rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6] p-4">
            <summary className="cursor-pointer text-xs font-black text-[#384B43]">
              {t("analyze.research.competitorSites", { count: competitors.length })}
            </summary>
            <ul className="mt-3 space-y-2">
              {competitors.map((competitor, index) => {
                const hasDetails = Boolean(
                  competitor.evidence.gap || competitor.evidence.keywords?.length || competitor.evidence.evidence_urls?.length
                );
                return (
                  <li key={competitor.id} className="rounded-xl border border-[#DAD5C7] bg-white px-3.5 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#EFEDE6] text-[10px] font-black text-[#000000]">{(index + 1).toLocaleString(getLocale())}</span>
                        <p className="truncate text-xs font-black text-[#1E2A28]">{competitor.display_name || competitor.domain}</p>
                      </div>
                      <ThreatPill level={competitor.threat_level} />
                    </div>

                    <p className="mt-1.5 text-[11px] font-bold text-[#7D8882]">
                      {competitor.best_position != null ? t("analyze.research.rank", { rank: competitor.best_position }) : t("analyze.research.rankUnavailable")}
                      {" · "}
                      {t("analyze.research.sharedKeywords", { count: competitor.evidence.appearances ?? competitor.evidence.keywords?.length ?? 0 })}
                    </p>

                    {competitor.evidence.summary && (
                      <p className="mt-2 text-[11px] font-bold leading-5 text-[#000000]">{competitor.evidence.summary}</p>
                    )}

                    {hasDetails && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-[11px] font-bold text-[#1B6F63]">{t("analyze.research.moreDetails")}</summary>
                        <div className="mt-2.5 space-y-2.5">
                          {competitor.evidence.gap && (
                            <div className="rounded-xl bg-[#F7EEEA] px-3 py-2">
                              <p className="text-[10px] font-black text-[#B3453A]">{t("analyze.research.missing")}</p>
                              <p className="mt-1 text-[11px] font-bold leading-5 text-[#8A3F35]">{competitor.evidence.gap}</p>
                            </div>
                          )}
                          {competitor.evidence.keywords?.length ? <TagList items={competitor.evidence.keywords} /> : null}
                          {competitor.evidence.evidence_urls?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {competitor.evidence.evidence_urls.slice(0, 2).map((url) => (
                                <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B6F63] underline">
                                  <LinkIcon className="h-3 w-3" />
                                  {hostFromUrl(url)}
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </details>
                    )}
                  </li>
                );
              })}
            </ul>
          </details>
        </div>
      )}
    </AiBubble>
  );
}
function getPriorityWeight(priority: unknown): number {
  if (typeof priority === "number") return priority;
  if (typeof priority === "string") {
    const map: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const normalized = priority.trim().toLowerCase();
    if (normalized in map) return map[normalized];
    const parsed = Number(normalized);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function RecommendationsSection({
  recommendations,
  manusTaskUrl,
}: {
  recommendations: Recommendation[];
  manusTaskUrl?: string | null;
}) {
  if (!recommendations.length && !manusTaskUrl) return null;
  return (
    <section className="mb-4 rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6] p-4">
      {recommendations.length > 0 && (
        <>
          <p className="mb-2 text-xs font-black text-[#384B43]">{t("analyze.research.recommendations")}</p>
          <div className="space-y-2">
            {[...recommendations]
              .sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority))
              .map((rec, index) => (
              <div key={`rec-${index}`} className="rounded-xl border border-[#DAD5C7] bg-white px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  {rec.title && <p className="text-xs font-black text-[#1E2A28]">{rec.title}</p>}
                  {rec.priority != null && <PriorityPill priority={rec.priority} />}
                </div>
                {rec.description && (
                  <p className="mt-1 text-[11px] font-bold leading-5 text-[#000000]">{rec.description}</p>
                )}
                {rec.action && (
                  <p className="mt-2 text-[11px] font-bold leading-5 text-[#1B6F63]">{t("analyze.research.action", { action: rec.action })}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {manusTaskUrl && (
        <a
          href={manusTaskUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1 text-[11px] font-bold text-[#1B6F63] underline ${recommendations.length > 0 ? "mt-3" : ""}`}
        >
          <LinkIcon className="h-3 w-3" />
          {t("analyze.research.fullReport")}
        </a>
      )}
    </section>
  );
}
function StatTile({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${accent ? "bg-[#F7EEEA]" : "bg-[#EFEDE6]"}`}>
      <p className="text-[10px] font-bold text-[#7D8882]">{label}</p>
      <p className={`mt-0.5 text-sm font-black ${accent ? "text-[#B3453A]" : "text-[#384B43]"}`}>{value}</p>
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const bg = score >= 70 ? "#1B6F63" : score >= 40 ? "#B08D57" : "#7D8882";
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-black text-white" style={{ backgroundColor: bg }}>{t("analyze.research.opportunityScore", { score })}</span>;
}

function ThreatPill({ level }: { level: "low" | "medium" | "high" }) {
  const styles = level === "high" ? "bg-[#F7EEEA] text-[#B3453A]" : level === "medium" ? "bg-[#FFF8E9] text-[#8A6A2F]" : "bg-[#DCEFEA] text-[#1B6F63]";
  return <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${styles}`}>{t("analyze.research.threat", { level: t(threatLabel[level]) })}</span>;
}

function PriorityPill({ priority }: { priority: "high" | "medium" | "low" | number }) {
  const normalized: "high" | "medium" | "low" = typeof priority === "number"
    ? (priority >= 3 ? "high" : priority === 2 ? "medium" : "low")
    : priority;
  const label = t(`analyze.research.priority.${normalized}`);
  const styles = normalized === "high"
    ? "bg-[#F7EEEA] text-[#B3453A]"
    : normalized === "medium"
      ? "bg-[#FFF8E9] text-[#8A6A2F]"
      : "bg-[#DCEFEA] text-[#1B6F63]";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${styles}`}>{label}</span>;
}

function Badge({ children, bg, text, border = false }: { children: React.ReactNode; bg: string; text: string; border?: boolean }) {
  return (
    <span
      className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${border ? "border border-[#DAD5C7]" : ""}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
    </span>
  );
}

// نمایش فشرده تگ‌ها: حداکثر `max` مورد، بقیه به صورت «+N» خلاصه می‌شود تا کارت‌ها
// با فهرست‌های بلند کلمات کلیدی طولانی نشوند.
function TagList({ items, max = 6, className = "" }: { items: string[]; max?: number; className?: string }) {
  if (!items.length) return null;
  const visible = items.slice(0, max);
  const remaining = items.length - visible.length;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visible.map((item) => (
        <span key={item} className="rounded-lg border border-[#DAD5C7] bg-white px-2 py-1 text-[11px] font-bold text-[#000000]">{item}</span>
      ))}
      {remaining > 0 && (
        <span className="rounded-lg bg-[#EFEDE6] px-2 py-1 text-[11px] font-bold text-[#7D8882]">+{remaining.toLocaleString(getLocale())}</span>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function difficultyLabel(value: string): string {
  if (value === "unavailable") return t("analyze.research.difficulty.unavailable");
  if (value === "high") return t("dashboard.difficulty.High");
  if (value === "medium") return t("dashboard.difficulty.Medium");
  if (value === "low") return t("dashboard.difficulty.Low");
  if (value.startsWith("estimated:")) return t("analyze.research.difficulty.estimated", { score: value.slice("estimated:".length) });
  return value;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[#EFEDE6] px-2.5 py-2"><p className="text-[10px] font-bold text-[#7D8882]">{label}</p><p className="mt-0.5 text-xs font-black text-[#384B43]">{value}</p></div>;
}