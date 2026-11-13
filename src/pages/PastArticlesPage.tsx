import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import PastArticleWorkspace from "../components/dashboard/PastArticleWorkspace";
import RefreshProgress from "../components/dashboard/RefreshProgress";
import { InternalLinksBadge, SeoIssueList } from "../components/dashboard/SeoAuditView";
import { BUSY_STATUSES, REASON_HINT, REASON_LABEL, STATUS_LABEL, fa, faPos } from "../components/dashboard/refreshLabels";
import {
  pastArticlesService,
  type PastArticle,
  type PastArticleFilter,
  type PastArticlesResponse,
} from "../services/api";
import { formatRelative } from "../utils/dashboardFormat";
import { t, formatDate as fmtDate } from "../i18n";
import { tx } from "../i18n/rich";

const FILTERS: { key: PastArticleFilter; label: string }[] = (["all", "needs_update", "opportunity", "updated", "not_editable"] as const).map(
  (key) => ({ key, get label() { return t(`growth.past.filter.${key}`); } }),
);

const PLUGIN_URL = "/downloads/wordpress-plugin.zip";

const formatDate = (value: string | null) => fmtDate(value);

const Card: React.FC<{ children: React.ReactNode; tone?: "info" | "warn" }> = ({ children, tone = "info" }) => (
  <div
    className={`rounded-2xl border p-4 text-xs leading-6 sm:text-sm ${
      tone === "warn" ? "border-[#E3C4BC] bg-[#F7EEEA] text-[#7A2F27]" : "border-[#E4E5F0] bg-white text-[#3B3F5C]"
    }`}
  >
    {children}
  </div>
);

/**
 * «آپدیت مقاله‌های گذشته»: مقاله‌هایی که قبلاً روی سایت بوده‌اند (نه ساخته‌ی یوتیکس) با نتیجه‌شان در گوگل؛
 * هر مقاله با یک کلیک به‌روز می‌شود، قبل از انتشار پیش‌نمایش دارد و قابل برگرداندن است.
 */
const PastArticlesPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<SidebarView>("past-articles");
  const [data, setData] = useState<PastArticlesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<PastArticleFilter>("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  // مقاله‌ای که در فضای کار (نمایش کامل + بازنویسی) باز است
  const [openId, setOpenId] = useState<string | null>(null);

  // جستجو بعد از مکث تایپ اعمال می‌شود
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    if (!siteId) return;
    const res = await pastArticlesService.list(siteId, { filter, search: query || undefined, page });
    if (res.success && res.data) {
      setData(res.data);
      setError(null);
    } else {
      setError(res.message || t("growth.past.loadFailed"));
    }
    setLoading(false);
  }, [siteId, filter, query, page]);

  useEffect(() => {
    load();
  }, [load]);

  const syncing = data?.sync?.status === "queued" || data?.sync?.status === "syncing";
  const isBusy = (a: PastArticle) => !!a.refresh && BUSY_STATUSES.includes(a.refresh.status);
  const working = syncing || !!data?.items.some(isBusy);

  useEffect(() => {
    if (!working) return;
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [working, load]);

  const run = async (key: string, action: () => Promise<{ success: boolean; message?: string; status?: number }>) => {
    setBusyKey(key);
    setActionError(null);
    try {
      const res = await action();
      if (!res.success) {
        setActionError(res.message || t("growth.gsc.actionFailed"));
        if (res.status === 409) load();
        return;
      }
      await load();
    } finally {
      setBusyKey(null);
    }
  };

  const connectionType = data?.connection.type;

  const renderAction = (a: PastArticle) => {
    const r = a.refresh;

    if (!a.editable) {
      return <p className="max-w-[16rem] text-[11px] leading-5 text-[#9A9DB8]">{a.not_editable_message}</p>;
    }

    if (isBusy(a)) {
      return (
        <button
          type="button"
          onClick={() => setOpenId(a.id)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#EFEDFF] px-3 py-2 text-[11px] font-bold text-[#4935E0] hover:bg-[#DDD8FF] sm:text-xs"
        >
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#5B47FB]/30 border-t-[#5B47FB] motion-reduce:animate-none" />
          {r?.status === "applying" ? t("growth.past.publishing") : t("growth.past.updating")}
        </button>
      );
    }

    const label = r?.status === "ready" ? t("growth.gsc.previewPublish") : r?.status === "applied" ? t("growth.past.viewChanges") : r?.status === "failed" ? t("growth.gsc.retry") : t("growth.gsc.updateArticle");
    const primary = r?.status !== "applied";

    return (
      <button
        type="button"
        onClick={() => setOpenId(a.id)}
        className={
          primary
            ? "rounded-xl bg-[#5B47FB] px-3.5 py-2 text-[11px] font-black text-white hover:bg-[#4935E0] sm:text-xs"
            : "rounded-xl border border-[#E4E5F0] px-3.5 py-2 text-[11px] font-bold text-[#3B3F5C] hover:bg-[#F3F2FB] sm:text-xs"
        }
      >
        {label}
        {!r || r.status === "failed" || r.status === "discarded" || r.status === "reverted" ? (
          a.estimate && (
            <span className="block text-[10px] font-normal opacity-80">
              {t("growth.gsc.creditEstimate", { credits: a.estimate.min === a.estimate.max ? fa(a.estimate.max) : `${fa(a.estimate.min)}–${fa(a.estimate.max)}` })}
            </span>
          )
        ) : null}
      </button>
    );
  };

  const openArticle = data?.items.find((a) => a.id === openId) ?? null;

  return (
    <Layout activeView={activeView} onChangeView={setActiveView} siteId={siteId}>
      <div className="mx-auto max-w-6xl space-y-3 p-3 sm:space-y-4 sm:p-4 lg:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#0D0F23] sm:text-xl">{t("growth.past.title")}</h1>
            <p className="mt-0.5 text-xs leading-6 text-[#9A9DB8]">
              {t("growth.past.subtitle")}
            </p>
          </div>
          {connectionType === "wordpress" && data?.sync?.status !== "outdated" && (
            <button
              type="button"
              disabled={syncing || busyKey === "sync"}
              onClick={() => run("sync", () => pastArticlesService.sync(siteId!))}
              className="shrink-0 rounded-lg bg-[#EFEDFF] px-3 py-1.5 text-[11px] font-bold text-[#4935E0] hover:bg-[#DDD8FF] disabled:opacity-60 sm:text-xs"
            >
              {syncing ? t("growth.past.syncing") : t("growth.past.sync")}
              {data?.sync?.synced_at && !syncing && <span className="block text-[10px] font-normal opacity-80">{t("growth.past.lastSync", { when: formatRelative(data.sync.synced_at) })}</span>}
            </button>
          )}
        </div>

        {actionError && (
          <div role="alert" className="flex items-start justify-between gap-2 rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] p-2.5 text-[11px] text-[#B3453A] sm:text-xs">
            <span>{actionError}</span>
            <button type="button" onClick={() => setActionError(null)} className="shrink-0 font-bold" aria-label={t("growth.gsc.closeMessage")}>
              ×
            </button>
          </div>
        )}

        {loading && (
          <div className="space-y-2" aria-busy="true" aria-label={t("growth.past.loading")}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#F3F2FB] motion-reduce:animate-none" />
            ))}
          </div>
        )}

        {!loading && error && (
          <Card tone="warn">
            {error}{" "}
            <button type="button" onClick={load} className="font-bold underline">
              {t("growth.gsc.retry")}
            </button>
          </Card>
        )}

        {!loading && data && connectionType === null && (
          <Card>
            <p className="font-bold text-[#0D0F23]">{t("growth.past.connectTitle")}</p>
            <p className="mt-1">{t("growth.past.connectBody")}</p>
            <button
              type="button"
              onClick={() => navigate(`/sites/${siteId}/dashboard`)}
              className="mt-3 rounded-xl bg-[#5B47FB] px-4 py-2 text-xs font-black text-white hover:bg-[#4935E0]"
            >
              {t("growth.past.goConnect")}
            </button>
          </Card>
        )}

        {!loading && data && connectionType === "shopify" && (
          <Card>{t("growth.past.shopifySoon")}</Card>
        )}

        {!loading && data?.sync?.status === "outdated" && (
          <Card tone="warn">
            <p className="font-bold">{t("growth.past.outdatedTitle")}</p>
            <p className="mt-1">
              {t("growth.past.outdatedBody", { min: data.connection.min_plugin_version, current: data.connection.plugin_version ?? "—" })}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={PLUGIN_URL} download className="rounded-xl bg-[#5B47FB] px-4 py-2 text-xs font-black text-white hover:bg-[#4935E0]">
                {t("growth.past.downloadPlugin")}
              </a>
              <button
                type="button"
                onClick={() => run("sync", () => pastArticlesService.sync(siteId!))}
                className="rounded-xl border border-[#E4E5F0] bg-white px-4 py-2 text-xs font-bold text-[#3B3F5C]"
              >
                {t("growth.past.installedRetry")}
              </button>
            </div>
          </Card>
        )}

        {!loading && data?.sync?.status === "failed" && (
          <Card tone="warn">
            {t("growth.past.syncIncomplete")}
            {data.sync.total ? ` (${t("growth.past.readCount", { fetched: data.sync.fetched ?? 0, total: data.sync.total })})` : ""}: {data.sync.error}{" "}
            <button type="button" onClick={() => run("sync", () => pastArticlesService.sync(siteId!))} className="font-bold underline">
              {t("growth.past.readAgain")}
            </button>
          </Card>
        )}

        {!loading && syncing && (
          <div className="rounded-2xl border border-[#5B47FB]/20 bg-[#EFEDFF]/30 p-3" role="status" aria-live="polite">
            <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-[#4935E0] sm:text-xs">
              <span>{t("growth.past.readingSite")}</span>
              {data?.sync?.total ? (
                <span>
                  {t("growth.past.progress", { fetched: data.sync.fetched ?? 0, total: data.sync.total })}
                </span>
              ) : null}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white" aria-hidden="true">
              {data?.sync?.total ? (
                <div
                  className="h-full rounded-full bg-[#5B47FB] transition-[width] duration-700"
                  style={{ width: `${Math.min(100, Math.round(((data.sync.fetched ?? 0) / data.sync.total) * 100))}%` }}
                />
              ) : (
                <div className="h-full w-1/3 animate-pulse rounded-full bg-[#5B47FB]/60 motion-reduce:animate-none" />
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-[#6C7193]">{t("growth.past.appearHere")}</p>
          </div>
        )}

        {!loading && connectionType === "wordpress" && data && data.sync?.status !== "outdated" && (
          <>
            <div className="rounded-2xl border border-[#E4E5F0]/70 bg-[#F3F2FB]/60 p-3 text-[11px] leading-6 text-[#3B3F5C] sm:text-xs">
              <p>• {t("growth.past.info1")}</p>
              <p>• {t("growth.past.info2")}</p>
              <p>• {t("growth.past.info3")}</p>
              <p>• {t("growth.past.info4")}</p>
              <p>• {t("growth.past.info5")}</p>
              {!data.search_console_connected && (
                <p className="mt-1 font-bold text-[#4935E0]">
                  • {tx("growth.past.gscHint", {
                    link: (
                      <button type="button" onClick={() => navigate(`/sites/${siteId}/dashboard`)} className="underline">
                        {t("growth.gsc.automation")}
                      </button>
                    ),
                  })}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div role="tablist" aria-label={t("growth.past.filterLabel")} className="flex gap-1 overflow-x-auto rounded-xl bg-[#F3F2FB] p-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.key}
                    onClick={() => {
                      setFilter(f.key);
                      setPage(1);
                    }}
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all sm:text-xs ${
                      filter === f.key ? "bg-white text-[#0D0F23] shadow-sm" : "text-[#6C7193] hover:text-[#0D0F23]"
                    }`}
                  >
                    {f.label}
                    <span className="mr-1 text-[#9A9DB8]">({fa(data.counts[f.key])})</span>
                  </button>
                ))}
              </div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("growth.past.searchPlaceholder")}
                aria-label={t("growth.past.searchPlaceholder")}
                className="w-full rounded-xl border border-[#E4E5F0] bg-white px-3 py-2 text-xs outline-none focus:border-[#5B47FB] sm:w-64"
              />
            </div>

            {data.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E4E5F0] px-4 py-10 text-center text-xs leading-6 text-[#6C7193]">
                {syncing ? (
                  t("growth.past.emptySyncing")
                ) : query || filter !== "all" ? (
                  t("growth.past.emptyFiltered")
                ) : (
                  t("growth.past.empty")
                )}
              </div>
            ) : (
              <ul className="space-y-2">
                {data.items.map((a) => (
                  <li key={a.id} className={`rounded-2xl border p-3 sm:p-4 ${a.editable ? "border-[#E4E5F0] bg-white" : "border-[#E4E5F0]/60 bg-[#F3F2FB]/40"}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-1.5">
                          {/* کلیک روی عنوان: نمایش کامل مقاله و آپدیت آن */}
                          <button
                            type="button"
                            onClick={() => setOpenId(a.id)}
                            className="line-clamp-2 text-right text-xs font-bold leading-6 text-[#0D0F23] hover:text-[#5B47FB] sm:text-sm"
                          >
                            {a.title}
                          </button>
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t("growth.past.viewTitle", { title: a.title })}
                            className="mt-1 shrink-0 text-[#9A9DB8] hover:text-[#5B47FB]"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#6C7193]">
                          <span>{t("growth.past.published", { date: formatDate(a.published_at) })}</span>
                          {a.word_count ? <span>· {t("growth.past.words", { count: a.word_count })}</span> : null}
                          {a.audited && !!a.internal_links && (
                            <span>
                              · <InternalLinksBadge audit={a} />
                            </span>
                          )}
                          {a.gsc && (
                            <>
                              <span>· {t("growth.gsc.clicksCount", { count: a.gsc.clicks })}</span>
                              <span>· {t("growth.gsc.impressionsCount", { count: a.gsc.impressions })}</span>
                              <span>· {t("growth.gsc.position", { position: faPos(a.gsc.position) })}</span>
                            </>
                          )}
                          {a.refresh && !BUSY_STATUSES.includes(a.refresh.status) && a.refresh.status !== "ready" && (
                            <span className={`rounded-full px-2 py-0.5 font-bold ${STATUS_LABEL[a.refresh.status].cls}`}>{STATUS_LABEL[a.refresh.status].text}</span>
                          )}
                        </div>
                        {a.gsc?.top_query && <p className="mt-0.5 truncate text-[11px] text-[#9A9DB8]">{t("growth.gsc.topQuery", { query: a.gsc.top_query })}</p>}
                        {a.editable && <SeoIssueList audit={a} compact />}
                        {a.reason && (
                          <p className="mt-1 text-[11px] leading-5 text-[#6C7193]">
                            <span className="ml-1 rounded-full bg-[#FFF4D6] px-2 py-0.5 font-bold text-[#8A6100]">{REASON_LABEL[a.reason]}</span>{" "}
                            {REASON_HINT[a.reason]}
                            {a.potential_clicks ? ` ${t("growth.gsc.potential", { clicks: a.potential_clicks })}` : ""}
                          </p>
                        )}
                        {a.refresh?.error && <p className="mt-1 text-[11px] leading-5 text-[#B3453A]">{a.refresh.error}</p>}
                      </div>
                      <div className="shrink-0">{renderAction(a)}</div>
                    </div>
                    {a.refresh && isBusy(a) && (
                      <RefreshProgress status={a.refresh.status} stage={a.refresh.stage} since={a.refresh.stage_started_at ?? a.refresh.created_at} />
                    )}
                  </li>
                ))}
              </ul>
            )}

            {data.pages > 1 && (
              <nav aria-label={t("growth.past.pagination")} className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-[#E4E5F0] bg-white px-3 py-1.5 text-xs font-bold text-[#3B3F5C] disabled:opacity-40"
                >
                  {t("growth.past.prev")}
                </button>
                <span className="text-xs text-[#6C7193]">
                  {t("growth.past.page", { page: data.page, pages: data.pages })}
                </span>
                <button
                  type="button"
                  disabled={page >= data.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-[#E4E5F0] bg-white px-3 py-1.5 text-xs font-bold text-[#3B3F5C] disabled:opacity-40"
                >
                  {t("growth.past.next")}
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {openArticle && siteId && <PastArticleWorkspace siteId={siteId} article={openArticle} onClose={() => setOpenId(null)} onChanged={load} />}
    </Layout>
  );
};

export default PastArticlesPage;
