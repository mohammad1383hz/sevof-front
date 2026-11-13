import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import { dashboardService, agentService, subscriptionService } from "../services/api";
import type { DashboardData } from "../types";
import AgentStatusCard from "../components/dashboard/AgentStatusCard";
import type { PerformanceStatKey } from "../components/dashboard/AgentStatusCard";
import StatisticsGrid from "../components/dashboard/StatisticsGrid";
import UnusedOpportunitiesPanel from "../components/dashboard/UnusedOpportunitiesPanel";
import RecentArticlesList from "../components/dashboard/RecentArticlesList";
import SiteConnectionPanel from "../components/dashboard/SiteConnectionPanel";
import { t } from "../i18n";
import SearchConsoleResultsPanel from "../components/dashboard/SearchConsoleResultsPanel";

const ArticlesDashboardPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState<SidebarView>("articles");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ── وضعیت اشتراک کاربر: null = هنوز لود نشده، true = Pro فعال، false = رایگان/بدون اشتراک ── */
  const [hasProSubscription, setHasProSubscription] = useState<boolean | null>(null);

  /* ── فعال/غیرفعال‌سازی Auto Pilot در حال انجام ── */
  const [togglingAutoPilot, setTogglingAutoPilot] = useState(false);

  const fetchDashboard = useCallback(async () => {
    if (!siteId) return;
    try {
      const res = await dashboardService.get(siteId);
      if (res.success && res.data?.data) {
        setDashboard(res.data.data);
        setError(null);
      } else {
        setError(res.message || t("dashboard.errors.load"));
      }
    } catch {
      setError(t("dashboard.errors.network"));
    }
  }, [siteId]);

  /* ── دریافت وضعیت اشتراک: آیا کاربر پلن Pro (غیررایگان و فعال) دارد؟ ── */
  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const res = await subscriptionService.me();
      if (res.success && res.data?.subscription) {
        const sub = res.data.subscription;
        setHasProSubscription(sub.has_active_subscription && !sub.is_free);
      } else {
        setHasProSubscription(false);
      }
    } catch {
      // در صورت خطا، محتاطانه فرض می‌کنیم کاربر Pro نیست تا فعال‌سازی اشتباهی رخ ندهد
      setHasProSubscription(false);
    }
  }, []);

  useEffect(() => {
    if (!siteId) {
      // به‌جای ارور، فقط لودینگ رو خاموش می‌کنیم تا خودِ همین صفحه
      // با حالت "بدون دامنه" رندر بشه — نه صفحه‌ی خطا، نه ریدایرکت.
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([fetchDashboard(), fetchSubscriptionStatus()]).finally(() => setLoading(false));
  }, [siteId, fetchDashboard, fetchSubscriptionStatus]);

  const handleArticleClick = (articleId: string) => {
    if (siteId) navigate(`/sites/${siteId}/articles/${articleId}`);
  };

  /*
   * روشن/خاموش کردن Auto Pilot — فقط agent_enabled.
   * ideas_enabled / articles_enabled دیگر در تصمیم فعال بودن نقشی ندارند (AgentSetting::isActive).
   */
  const handleToggleAutoPilot = async (enabled: boolean) => {
    if (!siteId || togglingAutoPilot) return;
    // فقط برای روشن کردن، اشتراک Pro لازم است؛ اگر وضعیت اشتراک هنوز معلوم نیست (null) بک‌اند تصمیم می‌گیرد
    if (enabled && hasProSubscription === false) {
      navigate("/subscription");
      return;
    }
    setTogglingAutoPilot(true);
    try {
      const res = await agentService.update(siteId, { agent_enabled: enabled });
      if (!res.success) {
        if (res.status === 402) {
          navigate("/subscription", { state: { reason: res.message } });
          return;
        }
        setError(res.message || t("dashboard.errors.autopilot"));
        return;
      }
      setError(null);
      await fetchDashboard();
    } catch {
      setError(t("dashboard.errors.autopilot"));
    } finally {
      setTogglingAutoPilot(false);
    }
  };

  const handleUpdateSettings = async (payload: {
    default_publish_status: "draft" | "publish";
    daily_article_limit: number;
    daily_idea_count: number;
    daily_start_hour: number;
  }) => {
    if (!siteId) return;
    await agentService.update(siteId, payload);
    fetchDashboard();
  };

  const handleStatClick = (statKey: PerformanceStatKey) => {
    if (!siteId) return;
    const routes: Record<PerformanceStatKey, string> = {
      keywords: `/sites/${siteId}/keywords-stats`,
      opportunities: `/sites/${siteId}/opportunities`,
      articles_written: `/sites/${siteId}/articles-written`,
      articles_published: `/sites/${siteId}/articles-published`,
    };
    navigate(routes[statKey]);
  };

  const handleUpgradeClick = () => navigate("/subscription");

  return (
    <Layout activeView={activeView} onChangeView={setActiveView} siteId={siteId}>
      <div className="p-3 sm:p-5 lg:p-7 max-w-6xl mx-auto space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0D0F23] truncate">{t("dashboard.page.title")}</h1>
            <p className="text-sm font-medium text-[#6C7193] mt-1">{t("dashboard.page.subtitle")}</p>
          </div>
        </div>

        {/* کارت اتصال: بر اساس وضعیت سایت، وردپرس یا Shopify نشان داده می‌شود */}
        {siteId && <SiteConnectionPanel siteId={siteId} />}

        {loading && (
          <div className="flex justify-center items-center py-10 sm:py-12">
            <div className="h-8 w-8 border-2 border-[#E4E5F0] border-t-[#5B47FB] rounded-full animate-spin motion-reduce:animate-none" />
          </div>
        )}

        {!siteId && !loading && (
          <div className="rounded-[20px] border border-[#E4E5F0] bg-white px-6 py-14 text-center shadow-sv">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-sv-gradient text-white shadow-sv-cta">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-black text-[#0D0F23]">{t("dashboard.page.noSiteTitle")}</h2>
            <p className="mt-2 text-sm text-[#9A9DB8] max-w-sm mx-auto">
              {t("dashboard.page.noSiteBody")}
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard?new=1", { replace: true })}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B47FB] px-5 py-3 text-sm font-black text-white shadow-sv-cta transition-all hover:-translate-y-0.5 hover:bg-[#4935E0]"
            >
              {t("layout.sites.add")}
            </button>
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm">{error}</div>
        )}

        {dashboard && !loading && siteId && (
          <>
            <AgentStatusCard
              agent={dashboard.agent}
              statistics={dashboard.statistics}
              hasProSubscription={hasProSubscription}
              onToggleAutoPilot={handleToggleAutoPilot}
              onUpdateSettings={handleUpdateSettings}
              onStatClick={handleStatClick}
              onUpgradeClick={handleUpgradeClick}
              isTogglingAutoPilot={togglingAutoPilot}
            />

            <SearchConsoleResultsPanel siteId={siteId} />

            <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
              <RecentArticlesList articles={dashboard.recent_articles} onArticleClick={handleArticleClick} />

              <UnusedOpportunitiesPanel siteId={siteId} />
            </div>

            <StatisticsGrid statistics={dashboard.statistics} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ArticlesDashboardPage;