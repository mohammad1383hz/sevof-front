import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  agentService,
  searchConsoleInsightsService,
  searchConsoleService,
  type ArticleRefreshSummary,
  type SearchConsoleInsights,
} from "../../services/api";
import { formatRelative } from "../../utils/dashboardFormat";
import ToggleSwitch from "./ToggleSwitch";
import RefreshPreviewModal from "./RefreshPreviewModal";
import RefreshProgress from "./RefreshProgress";
import { BUSY_STATUSES, REASON_HINT, REASON_LABEL, STATUS_LABEL, fa, faPos } from "./refreshLabels";
import { t, formatNumber } from "../../i18n";

interface SearchConsoleResultsPanelProps {
  siteId: string;
}

const faPct = (ratio: number) => formatNumber(ratio, { style: "percent", maximumFractionDigits: 1 });

/** Change vs the previous 28 days; for position, lower is better */
const change = (current: number | null, previous: number | null | undefined, lowerIsBetter = false) => {
  if (current == null || previous == null || previous === 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return { text: t("growth.gsc.noChange"), tone: "neutral" as const };
  const good = lowerIsBetter ? pct < 0 : pct > 0;
  return { text: `${pct > 0 ? "+" : "−"}${formatNumber(Math.abs(pct) / 100, { style: "percent" })}`, tone: good ? ("good" as const) : ("bad" as const) };
};


const KpiCard: React.FC<{ label: string; value: string; delta?: ReturnType<typeof change>; hint?: string }> = ({ label, value, delta, hint }) => (
  <div className="min-w-0 rounded-xl border border-[#E4E5F0] bg-white p-3">
    <p className="truncate text-[11px] text-[#6C7193]">{label}</p>
    <p className="mt-1 text-lg font-black text-[#0D0F23] sm:text-xl">{value}</p>
    {delta ? (
      <p className={`mt-0.5 text-[11px] font-bold ${delta.tone === "good" ? "text-[#5B47FB]" : delta.tone === "bad" ? "text-[#B3453A]" : "text-[#9A9DB8]"}`}>
        <bdi dir="ltr">{delta.text}</bdi> <span className="font-normal text-[#9A9DB8]">{t("growth.gsc.vsPrevious")}</span>
      </p>
    ) : (
      hint && <p className="mt-0.5 text-[11px] text-[#9A9DB8]">{hint}</p>
    )}
  </div>
);

/**
 * نتیجه‌ی واقعی مقاله‌ها در گوگل (سرچ کنسول) + پیشنهاد و اجرای به‌روزرسانی مقاله‌ها، داخل داشبورد اتوماسیون.
 */
const SearchConsoleResultsPanel: React.FC<SearchConsoleResultsPanelProps> = ({ siteId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<SearchConsoleInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [properties, setProperties] = useState<Array<{ property_url: string; permission_level: string | null }> | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [showAllArticles, setShowAllArticles] = useState(false);

  const load = useCallback(async () => {
    const res = await searchConsoleInsightsService.get(siteId);
    if (res.success && res.data) {
      setData(res.data);
      setLoadError(null);
    } else {
      setLoadError(res.message || t("growth.gsc.loadFailed"));
    }
    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  // تا وقتی داده در حال دریافت یا به‌روزرسانی در حال ساخت است، هر چند ثانیه وضعیت تازه می‌شود
  const isWorking =
    !!data &&
    (data.property?.sync_status === "queued" ||
      data.property?.sync_status === "syncing" ||
      data.refreshes.some((r) => BUSY_STATUSES.includes(r.status)));

  useEffect(() => {
    if (!isWorking) return;
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [isWorking, load]);

  const connected = data?.connection?.status === "connected";

  // بعد از اتصال حساب، فهرست property ها؛ اگر فقط یکی بود خودکار انتخاب می‌شود
  useEffect(() => {
    if (!connected || data?.property || properties !== null) return;
    searchConsoleService.properties(siteId).then(async (res) => {
      const list = res.success ? res.data?.properties ?? [] : [];
      setProperties(list);
      if (list.length === 1) {
        await searchConsoleService.selectProperty(siteId, list[0].property_url);
        load();
      }
    });
  }, [connected, data?.property, properties, siteId, load]);

  const run = async (key: string, action: () => Promise<{ success: boolean; message?: string; status?: number }>) => {
    setBusyKey(key);
    setActionError(null);
    try {
      const res = await action();
      if (!res.success) {
        setActionError(res.status === 402 ? `${res.message ?? t("growth.gsc.noCredit")}` : res.message || t("growth.gsc.actionFailed"));
        if (res.status === 409) load();
        return false;
      }
      await load();
      return true;
    } finally {
      setBusyKey(null);
    }
  };

  const connect = async () => {
    setBusyKey("connect");
    const res = await searchConsoleService.connect(siteId, "automation");
    if (res.success && res.data?.authorization_url) {
      window.location.href = res.data.authorization_url;
      return;
    }
    setBusyKey(null);
    setActionError(res.message || t("growth.gsc.connectFailed"));
  };

  const disconnectAccount = () => {
    if (!window.confirm(t("growth.gsc.confirmDisconnectAccount"))) return;
    run("disconnect-account", async () => {
      const res = await searchConsoleService.disconnectAccount(siteId);
      if (res.success) setProperties(null);
      return res;
    });
  };

  const toggleAutoRefresh = (enabled: boolean) =>
    run("auto-refresh", async () => {
      const res = await agentService.update(siteId, { refresh_enabled: enabled });
      if (res.status === 402) navigate("/subscription", { state: { reason: res.message } });
      return res;
    });

  const articles = data?.articles;
  const visibleArticles = useMemo(
    () => (showAllArticles ? articles?.items ?? [] : (articles?.items ?? []).slice(0, 5)),
    [articles, showAllArticles],
  );

  const current = data?.site_totals?.current;
  const previous = data?.site_totals?.previous;

  return (
    <section aria-labelledby="gsc-results-title" className="overflow-hidden rounded-2xl border border-[#E4E5F0] bg-white p-3.5 sm:p-5 lg:p-6">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 id="gsc-results-title" className="text-sm font-bold text-[#0D0F23] sm:text-base">
            {t("growth.gsc.title")}
          </h2>
          <p className="mt-0.5 text-[11px] text-[#9A9DB8] sm:text-xs">
            {t("growth.gsc.subtitle")}
            {data?.property?.last_synced_at && ` · ${t("growth.gsc.updated", { when: formatRelative(data.property.last_synced_at) })}`}
          </p>
          {data?.connection && (
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-[#6C7193]">
              <span>
                {t("growth.gsc.accountLabel")} <bdi dir="ltr" className="font-bold text-[#0D0F23]">{data.connection.email ?? t("growth.gsc.accountUnknown")}</bdi>
              </span>
              <button
                type="button"
                onClick={disconnectAccount}
                disabled={busyKey !== null}
                className="font-bold text-[#B3453A] underline-offset-2 hover:underline disabled:opacity-60"
              >
                {busyKey === "disconnect-account" ? t("growth.gsc.disconnecting") : t("growth.gsc.disconnectAccount")}
              </button>
            </p>
          )}
        </div>
        {data?.property && (
          <button
            type="button"
            onClick={() => run("sync", () => searchConsoleService.sync(siteId))}
            disabled={busyKey === "sync" || isWorking}
            className="shrink-0 rounded-lg bg-[#EFEDFF] px-3 py-1.5 text-[11px] font-bold text-[#4935E0] transition-colors hover:bg-[#DDD8FF] disabled:opacity-60 sm:text-xs"
          >
            {data.property.sync_status === "queued" || data.property.sync_status === "syncing" ? t("growth.gsc.syncing") : t("growth.gsc.sync")}
          </button>
        )}
      </div>

      {actionError && (
        <div role="alert" className="mb-3 flex items-start justify-between gap-2 rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] p-2.5 text-[11px] text-[#B3453A] sm:text-xs">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError(null)} className="shrink-0 font-bold" aria-label={t("growth.gsc.closeMessage")}>
            ×
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4" aria-busy="true" aria-label={t("growth.gsc.syncing")}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-[#F3F2FB] motion-reduce:animate-none" />
          ))}
        </div>
      )}

      {!loading && loadError && (
        <div className="rounded-xl border border-dashed border-[#E3C4BC] py-6 text-center">
          <p className="text-xs text-[#B3453A] sm:text-sm">{loadError}</p>
          <button type="button" onClick={load} className="mt-3 rounded-lg bg-[#EFEDFF] px-3 py-1.5 text-[11px] font-bold text-[#4935E0] sm:text-xs">
            {t("growth.gsc.retry")}
          </button>
        </div>
      )}

      {/* ── وصل نیست: توضیح ارزش و دکمه‌ی اتصال ── */}
      {!loading && data && !connected && (
        <div className="rounded-xl border border-[#E4E5F0]/70 bg-[#F3F2FB]/60 p-4">
          <p className="text-xs font-bold leading-6 text-[#0D0F23] sm:text-sm">
            {data.connection?.status ? t("growth.gsc.reconnect") : t("growth.gsc.connectPitch")}
          </p>
          <ul className="mt-2 space-y-1.5 text-[11px] leading-6 text-[#3B3F5C] sm:text-xs">
            <li>• {t("growth.gsc.benefit1")}</li>
            <li>• {t("growth.gsc.benefit2")}</li>
            <li>• {t("growth.gsc.benefit3")}</li>
          </ul>
          <button
            type="button"
            onClick={connect}
            disabled={busyKey === "connect"}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#5B47FB] px-4 py-2 text-xs font-black text-white shadow-sm shadow-[#5B47FB]/25 hover:bg-[#4935E0] disabled:opacity-60"
          >
            {busyKey === "connect" ? t("growth.gsc.redirecting") : t("growth.gsc.connect")}
          </button>
          <p className="mt-2 text-[11px] text-[#9A9DB8]">{t("growth.gsc.readOnly")}</p>
        </div>
      )}

      {/* ── وصل است ولی سایت انتخاب نشده ── */}
      {!loading && data && connected && !data.property && (
        <div className="rounded-xl border border-[#E4E5F0] p-4">
          <p className="text-xs font-bold text-[#0D0F23] sm:text-sm">{t("growth.gsc.pickProperty")}</p>
          {properties === null && <p className="mt-2 text-xs text-[#9A9DB8]">{t("growth.gsc.loadingList")}</p>}
          {properties?.length === 0 && (
            <p className="mt-2 text-xs leading-6 text-[#B3453A]">{t("growth.gsc.noProperties")}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {properties?.map((p) => (
              <button
                key={p.property_url}
                type="button"
                dir="ltr"
                disabled={busyKey !== null}
                onClick={() => run(`property:${p.property_url}`, () => searchConsoleService.selectProperty(siteId, p.property_url))}
                className="rounded-lg border border-[#E4E5F0] px-3 py-1.5 text-xs text-[#0D0F23] hover:border-[#5B47FB] hover:bg-[#EFEDFF]/40 disabled:opacity-60"
              >
                {p.property_url}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && data?.property?.sync_status === "failed" && (
        <div role="alert" className="mb-3 rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] p-2.5 text-[11px] leading-6 text-[#B3453A] sm:text-xs">
          {t("growth.gsc.syncFailed")}
        </div>
      )}

      {/* ── داده ── */}
      {!loading && data?.property && current && (
        <div className="space-y-4">
          {articles && articles.with_data > 0 && (
            <p className="rounded-xl bg-[#EFEDFF]/60 p-3 text-xs font-bold leading-6 text-[#4935E0] sm:text-sm">
              {t("growth.gsc.headline", { clicks: articles.clicks })}
              {articles.previous_clicks != null && articles.previous_clicks > 0 && articles.clicks > articles.previous_clicks
                ? ` ${t("growth.gsc.headlineMore", { clicks: articles.clicks - articles.previous_clicks })}`
                : ""}
            </p>
          )}

          <div className={`grid grid-cols-2 gap-2 ${articles?.clicks ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            <KpiCard label={t("growth.gsc.siteClicks")} value={fa(current.clicks)} delta={change(current.clicks, previous?.clicks)} />
            <KpiCard label={t("growth.gsc.impressions")} value={fa(current.impressions)} delta={change(current.impressions, previous?.impressions)} />
            <KpiCard label={t("growth.gsc.avgPosition")} value={faPos(current.position)} delta={change(current.position, previous?.position, true)} />
            {/* with no clicks a "0 of 0" card is only discouraging */}
            {articles?.clicks ? (
              <KpiCard
                label={t("growth.gsc.articleClicks")}
                value={fa(articles.clicks)}
                delta={change(articles.clicks, articles.previous_clicks)}
                hint={t("growth.gsc.seenInGoogle", { seen: articles.with_data, total: articles.count })}
              />
            ) : null}
          </div>

          {/* ── فرصت‌های به‌روزرسانی ── */}
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-[#0D0F23] sm:text-sm">{t("growth.gsc.opportunitiesTitle")}</h3>
              {data.opportunities.length > 0 && (
                <span className="rounded-full bg-[#EFEDFF] px-2.5 py-0.5 text-[11px] font-bold text-[#5B47FB]">{t("growth.gsc.opportunitiesCount", { count: data.opportunities.length })}</span>
              )}
            </div>

            {data.opportunities.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#E4E5F0] px-4 py-5 text-center text-[11px] leading-6 text-[#9A9DB8] sm:text-xs">
                {t("growth.gsc.noOpportunities")}
              </p>
            ) : (
              <ul className="space-y-2">
                {data.opportunities.map((o) => (
                  <li key={o.id} className="flex flex-col gap-2 rounded-xl border border-[#E4E5F0] p-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-bold leading-6 text-[#0D0F23] sm:text-sm" title={o.title}>
                        {o.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#6C7193]">
                        <span className="rounded-full bg-[#FFF4D6] px-2 py-0.5 font-bold text-[#8A6100]">{REASON_LABEL[o.reason]}</span>
                        <span>{t("growth.gsc.position", { position: faPos(o.position) })}</span>
                        <span>· {t("growth.gsc.impressionsCount", { count: o.impressions })}</span>
                        <span>· {t("growth.gsc.clicksCount", { count: o.clicks })}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-5 text-[#6C7193]">
                        {REASON_HINT[o.reason]} {t("growth.gsc.potential", { clicks: o.potential_clicks })}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={busyKey !== null}
                      onClick={() => run(`refresh:${o.id}`, () => searchConsoleInsightsService.startRefresh(siteId, o.id))}
                      className="shrink-0 rounded-xl bg-[#5B47FB] px-3.5 py-2 text-[11px] font-black text-white hover:bg-[#4935E0] disabled:opacity-60 sm:text-xs"
                    >
                      {busyKey === `refresh:${o.id}` ? t("growth.gsc.starting") : t("growth.gsc.updateArticle")}
                      <span className="block text-[10px] font-normal opacity-80">
                        {t("growth.gsc.creditEstimate", { credits: o.estimate.min === o.estimate.max ? fa(o.estimate.max) : `${fa(o.estimate.min)}–${fa(o.estimate.max)}` })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* ── اتوماسیون ── */}
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#E4E5F0]/70 bg-[#F3F2FB]/60 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0D0F23]">{t("growth.gsc.autoRefresh")}</p>
                <p className="mt-0.5 text-[11px] leading-6 text-[#6C7193]">
                  {!data.automation.has_paid_plan
                    ? t("growth.gsc.autoProOnly")
                    : !data.automation.agent_enabled
                      ? t("growth.gsc.autoNeedsAgent")
                      : data.automation.auto_publish
                        ? t("growth.gsc.autoPublishes")
                        : t("growth.gsc.autoForReview")}
                </p>
              </div>
              {data.automation.has_paid_plan ? (
                <ToggleSwitch
                  checked={data.automation.refresh_enabled}
                  disabled={busyKey === "auto-refresh" || !data.automation.agent_enabled}
                  onChange={toggleAutoRefresh}
                  label={t("growth.gsc.autoRefreshToggle")}
                />
              ) : (
                <button type="button" onClick={() => navigate("/subscription")} className="shrink-0 rounded-lg bg-[#5B47FB] px-3 py-1.5 text-[11px] font-bold text-white">
                  {t("growth.gsc.upgrade")}
                </button>
              )}
            </div>
          </div>

          {/* ── جستجوهای بی‌صفحه: موضوع مقاله‌ی تازه ── */}
          {!!data.query_opportunities?.length && (
            <div>
              <h3 className="text-xs font-bold text-[#0D0F23] sm:text-sm">{t("growth.gsc.queriesTitle")}</h3>
              <p className="mb-2 mt-0.5 text-[11px] leading-6 text-[#6C7193]">
                {t("growth.gsc.queriesBody")}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {data.query_opportunities.map((q) => (
                  <li key={q.query} className="rounded-full border border-[#E4E5F0] bg-white px-2.5 py-1 text-[11px] text-[#0D0F23]">
                    {q.question && <span className="me-1 rounded-full bg-[#FFF4D6] px-1.5 font-bold text-[#8A6100]">{t("growth.gsc.question")}</span>}
                    {q.query}
                    <span className="ms-1 text-[#6C7193]">
                      ({t("growth.gsc.queryStats", { impressions: fa(q.impressions), position: faPos(q.best_position) })})
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate(`/dashboard?site=${siteId}`)}
                className="mt-2 rounded-lg bg-[#EFEDFF] px-3 py-1.5 text-[11px] font-bold text-[#4935E0] hover:bg-[#DDD8FF] sm:text-xs"
              >
                {t("growth.gsc.makeIdeas")}
              </button>
            </div>
          )}

          {/* ── تاریخچه‌ی به‌روزرسانی‌ها ── */}
          {data.refreshes.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold text-[#0D0F23] sm:text-sm">{t("growth.gsc.refreshesTitle")}</h3>
              <ul className="space-y-2">
                {data.refreshes.map((r: ArticleRefreshSummary) => (
                  <li key={r.id} className="rounded-xl border border-[#E4E5F0] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[#0D0F23] sm:text-sm" title={r.article_title ?? ""}>
                          {r.article_title ?? t("growth.gsc.article")}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#6C7193]">
                          <span className={`rounded-full px-2 py-0.5 font-bold ${STATUS_LABEL[r.status].cls}`}>
                            {BUSY_STATUSES.includes(r.status) && (
                              <span className="me-1 inline-block h-2 w-2 animate-pulse rounded-full bg-current align-middle motion-reduce:animate-none" />
                            )}
                            {STATUS_LABEL[r.status].text}
                          </span>
                          {r.trigger === "agent" && <span>{t("growth.gsc.automation")}</span>}
                          {r.changed_sections > 0 && <span>· {t("growth.gsc.sections", { count: r.changed_sections })}</span>}
                          {r.meta_changed && <span>· {t("growth.gsc.googleTitle")}</span>}
                          {r.credit_used > 0 && <span>· {t("growth.gsc.credits", { credits: fa(r.credit_used) })}</span>}
                          {r.created_at && <span>· {formatRelative(r.created_at)}</span>}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {r.status === "ready" && (
                          <button
                            type="button"
                            onClick={() => setPreviewId(r.id)}
                            className="rounded-lg bg-[#5B47FB] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#4935E0] sm:text-xs"
                          >
                            {t("growth.gsc.previewPublish")}
                          </button>
                        )}
                        {r.status === "applied" && (
                          <>
                            <button type="button" onClick={() => setPreviewId(r.id)} className="rounded-lg border border-[#E4E5F0] px-3 py-1.5 text-[11px] font-bold text-[#3B3F5C] sm:text-xs">
                              {t("growth.gsc.changes")}
                            </button>
                            <button
                              type="button"
                              disabled={busyKey !== null}
                              onClick={() => {
                                if (window.confirm(t("growth.gsc.confirmRevert"))) {
                                  run(`revert:${r.id}`, () => searchConsoleInsightsService.revertRefresh(siteId, r.id));
                                }
                              }}
                              className="rounded-lg border border-[#E4E5F0] px-3 py-1.5 text-[11px] font-bold text-[#3B3F5C] hover:bg-[#F3F2FB] disabled:opacity-60 sm:text-xs"
                            >
                              {t("growth.gsc.revert")}
                            </button>
                          </>
                        )}
                        {r.status === "failed" && (
                          <button
                            type="button"
                            disabled={busyKey !== null}
                            onClick={() => run(`discard:${r.id}`, () => searchConsoleInsightsService.discardRefresh(siteId, r.id))}
                            className="rounded-lg border border-[#E4E5F0] px-3 py-1.5 text-[11px] font-bold text-[#3B3F5C] hover:bg-[#F3F2FB] disabled:opacity-60 sm:text-xs"
                          >
                            {t("growth.gsc.remove")}
                          </button>
                        )}
                      </div>
                    </div>
                    {BUSY_STATUSES.includes(r.status) && <RefreshProgress status={r.status} stage={r.stage} since={r.stage_started_at ?? r.created_at} />}
                    {r.error && <p className="mt-2 text-[11px] leading-5 text-[#B3453A]">{r.error}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── عملکرد مقاله‌ها ── */}
          {articles && articles.items.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold text-[#0D0F23] sm:text-sm">{t("growth.gsc.yourArticles")}</h3>
              <ul className="divide-y divide-[#E4E5F0]/70 rounded-xl border border-[#E4E5F0]">
                {visibleArticles.map((a) => {
                  const delta = change(a.clicks, a.previous_clicks);
                  return (
                    <li key={`${a.type}-${a.id}`} className="grid gap-1 p-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
                      <div className="min-w-0">
                        {a.url ? (
                          <a href={a.url} target="_blank" rel="noopener noreferrer" className="line-clamp-1 text-xs font-bold text-[#0D0F23] hover:text-[#5B47FB] sm:text-sm">
                            {a.title}
                          </a>
                        ) : (
                          <p className="line-clamp-1 text-xs font-bold text-[#0D0F23] sm:text-sm">{a.title}</p>
                        )}
                        {a.top_query && <p className="mt-0.5 truncate text-[11px] text-[#9A9DB8]">{t("growth.gsc.topQuery", { query: a.top_query })}</p>}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#6C7193]">
                        <span>
                          <b className="text-[#0D0F23]">{fa(a.clicks)}</b> {t("growth.gsc.clicksWord")}
                          {delta && (
                            <span className={`ms-1 font-bold ${delta.tone === "good" ? "text-[#5B47FB]" : delta.tone === "bad" ? "text-[#B3453A]" : ""}`}><bdi dir="ltr">{delta.text}</bdi></span>
                          )}
                        </span>
                        <span>{t("growth.gsc.impressionsCount", { count: a.impressions })}</span>
                        <span>{t("growth.gsc.position", { position: faPos(a.position) })}</span>
                        <span>{t("growth.gsc.ctr", { ctr: faPct(a.ctr) })}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {articles.items.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllArticles((v) => !v)}
                  className="mt-2 w-full rounded-xl border border-[#E4E5F0] py-2 text-[11px] font-bold text-[#4935E0] hover:bg-[#EFEDFF]/50 sm:text-xs"
                >
                  {showAllArticles ? t("growth.gsc.showLess") : t("growth.gsc.showAll", { count: articles.items.length })}
                </button>
              )}
            </div>
          )}

          {articles && articles.count > 0 && articles.with_data === 0 && (
            <p className="rounded-xl border border-dashed border-[#E4E5F0] px-4 py-5 text-center text-[11px] leading-6 text-[#9A9DB8] sm:text-xs">
              {t("growth.gsc.noDataYet")}
            </p>
          )}
        </div>
      )}

      {!loading && data?.property && !current && data.property.sync_status !== "failed" && (
        <div className="rounded-xl border border-dashed border-[#E4E5F0] px-4 py-8 text-center text-xs text-[#6C7193]">
          {isWorking ? (
            <>
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#E4E5F0] border-t-[#5B47FB] motion-reduce:animate-none" />
              {t("growth.gsc.fetching")}
            </>
          ) : (
            t("growth.gsc.firstSync")
          )}
        </div>
      )}

      {previewId !== null && (
        <RefreshPreviewModal siteId={siteId} refreshId={previewId} onClose={() => setPreviewId(null)} onChanged={load} />
      )}
    </section>
  );
};

export default SearchConsoleResultsPanel;
