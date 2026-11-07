// src/pages/KeywordAnalysisPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService, siteService, siteKeywordService } from "../services/api";
import type { Site, SiteKeywordTrend, KeywordAnalysisStatus } from "../types";
import { t } from "../i18n";

const POLL_STATUSES = new Set<KeywordAnalysisStatus>(["pending", "processing"]);
const POLL_INTERVAL_MS = 4000;

const STEPS = [
  { key: "pending", label: "dashboard.kwAnalysis.steps.pending" },
  { key: "processing", label: "dashboard.kwAnalysis.steps.processing" },
  { key: "selecting", label: "dashboard.kwAnalysis.steps.selecting" },
  { key: "done", label: "dashboard.kwAnalysis.steps.done" },
] as const;

function stepIndexFor(status: KeywordAnalysisStatus, trendsLoaded: number, totalKeywords: number): number {
  if (status === "pending") return 0;
  if (status === "processing") {
    return trendsLoaded >= totalKeywords && totalKeywords > 0 ? 2 : 1;
  }
  if (status === "done") return 3;
  return 0;
}

function changeBadgeClass(change: string): string {
  if (change === "Breakout") return "bg-rose-100 text-rose-700 border-rose-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

interface KeywordAnalysisPageProps {
  onLogout: () => void;
}

const KeywordAnalysisPage: React.FC<KeywordAnalysisPageProps> = ({ onLogout }) => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();

  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [trends, setTrends] = useState<SiteKeywordTrend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingSite, setLoadingSite] = useState(true);
  const [starting, setStarting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const fetchTrends = async () => {
    if (!siteId) return;
    const res = await siteKeywordService.trends(siteId);
    if (!res.success || !res.data) {
      setError(res.message || t("dashboard.kwAnalysis.errors.status"));
      stopPolling();
      return;
    }

    setCurrentSite(res.data.site);
    setTrends(res.data.trends);

    if (!POLL_STATUSES.has(res.data.site.keyword_analysis_status)) {
      stopPolling();
    }
  };

  const startAnalysis = async () => {
    if (!siteId) return;
    setStarting(true);
    setError(null);

    const res = await siteKeywordService.analyze(siteId);
    setStarting(false);

    if (!res.success || !res.data) {
      setError(res.message || t("dashboard.kwAnalysis.errors.start"));
      return;
    }

    setCurrentSite(res.data.site);

    if (POLL_STATUSES.has(res.data.site.keyword_analysis_status)) {
      stopPolling();
      pollRef.current = setInterval(fetchTrends, POLL_INTERVAL_MS);
    }
  };

  useEffect(() => {
    if (startedRef.current || !siteId) return;
    startedRef.current = true;

    const init = async () => {
      setLoadingSite(true);
      const res = await siteService.show(siteId);
      setLoadingSite(false);

      if (!res.success || !res.data) {
        setError(res.message || t("dashboard.kwAnalysis.errors.site"));
        return;
      }

      const site = res.data.site;
      setCurrentSite(site);
      const status = site.keyword_analysis_status;

      if (status === "not_started" || status === "failed") {
        startAnalysis();
      } else if (POLL_STATUSES.has(status)) {
        fetchTrends();
        pollRef.current = setInterval(fetchTrends, POLL_INTERVAL_MS);
      } else {
        fetchTrends();
      }
    };

    init();

    return stopPolling;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  const handleLogout = async () => {
    stopPolling();
    await authService.logout();
    onLogout();
  };

  const handleRetry = () => {
    setError(null);
    setCurrentSite((s) => (s ? { ...s, keyword_analysis_status: "not_started" } : s));
    startAnalysis();
  };

  if (loadingSite || !currentSite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : (
          <div className="h-8 w-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
        )}
      </div>
    );
  }

  const status = currentSite.keyword_analysis_status;
  const totalKeywords = (currentSite.keywords || []).length;
  const trendsLoaded = trends.filter((t) => t.status === "fetched" || t.status === "failed").length;
  const currentStepIndex = stepIndexFor(status, trendsLoaded, totalKeywords);
  const inProgress = POLL_STATUSES.has(status) || starting;

  return (
    <div className="min-h-screen bg-gradient-to-br rtl:bg-gradient-to-bl from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              title={t("common.actions.back")}
            >
              <svg className="w-5 h-5 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div>
              <span className="text-slate-800 font-bold text-base tracking-tight block leading-tight">
                {t("dashboard.kwAnalysis.title")}
              </span>
              <span dir="ltr" className="text-slate-400 text-[11px] font-medium">
                {currentSite.domain}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-rose-500 transition-all duration-200 px-3 py-1.5 rounded-xl hover:bg-rose-50"
          >
            {t("layout.logout.action")}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        {/* خطا */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* در حال انجام */}
        {inProgress && (
          <div>
            <div className="bg-white rounded-3xl border border-slate-200/60 p-7 shadow-xl shadow-slate-200/40 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br rtl:bg-gradient-to-bl from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <svg className="w-7 h-7 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -start-1">
                    <span className="flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white" />
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-indigo-600 font-semibold">
                    {totalKeywords > 0
                      ? t("dashboard.kwAnalysis.progress", { done: trendsLoaded, total: totalKeywords })
                      : t("dashboard.kwAnalysis.starting")}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {t("dashboard.kwAnalysis.note")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 p-7 shadow-xl shadow-slate-200/40">
              <div className="space-y-2">
                {STEPS.slice(0, 3).map((step, i) => {
                  const isDone = i < currentStepIndex;
                  const isActive = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                      <div className="relative flex shrink-0 items-center justify-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base transition-all duration-500 ${
                            isDone
                              ? "bg-gradient-to-br rtl:bg-gradient-to-bl from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25"
                              : isActive
                              ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-400/40 shadow-md shadow-indigo-500/10"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isDone ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : isActive ? (
                            <div className="h-5 w-5 border-2 border-indigo-400/50 border-t-indigo-500 rounded-full animate-spin" />
                          ) : (
                            <span className="text-sm font-bold">{i + 1}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-semibold block ${isDone ? "text-slate-800" : isActive ? "text-slate-900" : "text-slate-400"}`}>
                          {t(step.label)}
                        </span>
                        {isActive && <span className="text-xs text-indigo-500 mt-0.5 block">{t("dashboard.kwAnalysis.processing")}</span>}
                        {isDone && <span className="text-xs text-emerald-500 mt-0.5 block">{t("dashboard.kwAnalysis.completed")}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* شکست */}
        {status === "failed" && !inProgress && (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 shadow-xl shadow-rose-100/40 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 border border-rose-100">
              <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">{t("dashboard.kwAnalysis.failed")}</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-7">
              {currentSite.keyword_analysis_error || t("common.errors.generic")}
            </p>
            <button
              onClick={handleRetry}
              className="rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-indigo-600 to-blue-600 text-white text-sm font-bold px-10 py-4 hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {t("billing.payment.tryAgain")}
            </button>
          </div>
        )}

        {/* نتیجه نهایی */}
        {status === "done" && (
          <div className="space-y-6">
            {/* کارت نتیجه نهایی */}
            <div className="bg-gradient-to-br rtl:bg-gradient-to-bl from-indigo-50 to-blue-50 rounded-3xl border border-indigo-200/60 p-7 shadow-xl shadow-indigo-100/30">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br rtl:bg-gradient-to-bl from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700 mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    {t("dashboard.kwAnalysis.finalBadge")}
                  </span>
                  <p className="text-2xl font-black text-slate-900 leading-tight">
                    {currentSite.final_keyword || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* عنوان پیشنهادی */}
            {currentSite.final_title && (
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-lg shadow-slate-200/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">{t("dashboard.kwAnalysis.suggestedTitle")}</p>
                </div>
                <p className="text-base font-bold text-slate-800 leading-8">{currentSite.final_title}</p>
              </div>
            )}

            {/* جدول کلمات کلیدی بررسی‌شده */}
            <div className="bg-white rounded-3xl border border-slate-200/60 p-7 shadow-xl shadow-slate-200/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-600">
                  {t("dashboard.kwAnalysis.checked", { count: trends.length })}
                </p>
              </div>

              <div className="space-y-4">
                {trends.map((trend) => (
                  <div
                    key={trend.id}
                    className={`rounded-2xl border p-5 ${
                      trend.keyword === currentSite.final_keyword
                        ? "border-indigo-300 bg-indigo-50/40"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{trend.keyword}</span>
                        {trend.keyword === currentSite.final_keyword && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 text-white px-2.5 py-0.5 text-[11px] font-bold">
                            {t("dashboard.kwAnalysis.finalSelection")}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                          trend.status === "fetched"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {trend.status === "fetched" ? t("dashboard.kwAnalysis.fetched") : t("dashboard.kwAnalysis.fetchError")}
                      </span>
                    </div>

                    {trend.status === "failed" && (
                      <p className="text-xs text-rose-500">{trend.error_message}</p>
                    )}

                    {trend.status === "fetched" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-2">{t("dashboard.kwAnalysis.topQueries")}</p>
                          {trend.top_queries && trend.top_queries.length > 0 ? (
                            <ul className="space-y-1.5">
                              {trend.top_queries.slice(0, 5).map((q, i) => (
                                <li key={i} className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">
                                  <span>{q.query}</span>
                                  {q.value != null && <span className="text-slate-400 font-mono">{q.value}</span>}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-400">{t("dashboard.kwAnalysis.noData")}</p>
                          )}
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-2">{t("dashboard.kwAnalysis.risingQueries")}</p>
                          {trend.rising_queries && trend.rising_queries.length > 0 ? (
                            <ul className="space-y-1.5">
                              {trend.rising_queries.slice(0, 5).map((q, i) => (
                                <li key={i} className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">
                                  <span>{q.query}</span>
                                  <span className={`font-bold px-2 py-0.5 rounded-md border text-[11px] ${changeBadgeClass(q.change)}`}>
                                    {q.change === "Breakout" ? t("dashboard.kwAnalysis.breakout") : q.change}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-400">{t("dashboard.kwAnalysis.noData")}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full rounded-2xl border-2 border-slate-200 text-slate-600 text-sm font-bold py-4 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              {t("dashboard.kwAnalysis.backToAnalysis")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default KeywordAnalysisPage;