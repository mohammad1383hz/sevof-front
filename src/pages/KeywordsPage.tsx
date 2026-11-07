import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Layout from "../components/Layout";
import StatListPage, {
  type StatColumn,
} from "../components/stats/StatListPage";
import { contentResearchService } from "../services/api";
import type { KeywordClusterResult } from "../services/api";
import { t, getLocale } from "../i18n";

interface KeywordRow {
  id: number | string;
  keyword: string;
  search_volume: number;
  difficulty: "Low" | "Medium" | "High" | "Unknown";
  position: number | null;
  trend: "up" | "down" | "flat";
  found_at: string;
  is_primary: boolean;
}

const toDifficultyLabel = (difficulty: string): KeywordRow["difficulty"] => {
  if (difficulty === "low") return "Low";
  if (difficulty === "medium") return "Medium";
  if (difficulty === "high") return "High";

  if (difficulty.startsWith("estimated:")) {
    const score = Number(difficulty.slice("estimated:".length));
    if (score < 34) return "Low";
    if (score < 67) return "Medium";
    return "High";
  }

  return "Unknown";
};

const toTrend = (direction: string): KeywordRow["trend"] => {
  if (direction === "up") return "up";
  if (direction === "down") return "down";
  return "flat";
};

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(getLocale());
};

/**
 * از هر کلاستر، به‌ازای کلمه‌ی اصلی (primary_keyword) و همه‌ی
 * کلمات مرتبط (related_keywords) یک ردیف جدا می‌سازد تا همه‌ی
 * کلمات کلیدی در جدول نمایش داده شوند، نه فقط کلمه‌ی اصلی.
 */
const toKeywordRows = (
  cluster: KeywordClusterResult,
  foundAt: string | null | undefined,
): KeywordRow[] => {
  const metrics = Array.isArray(cluster.evidence?.query_metrics)
    ? (cluster.evidence.query_metrics as Array<{
        query?: string;
        position?: number | null;
      }>)
    : [];

  const findPosition = (keyword: string): number | null => {
    const metric = metrics.find((m) => m.query === keyword);
    return metric?.position ?? null;
  };

  const relatedKeywords = Array.isArray(cluster.related_keywords)
    ? cluster.related_keywords
    : [];

  const allKeywords = [cluster.primary_keyword, ...relatedKeywords];

  // حذف موارد تکراری (اگر primary_keyword داخل related_keywords هم تکرار شده باشد)
  const seen = new Set<string>();
  const uniqueKeywords = allKeywords.filter((keyword) => {
    if (seen.has(keyword)) return false;
    seen.add(keyword);
    return true;
  });

  return uniqueKeywords.map((keyword, index) => ({
    id: `${cluster.id}-${index}`,
    keyword,
    search_volume: cluster.estimated_search_volume,
    difficulty: toDifficultyLabel(cluster.difficulty),
    position: findPosition(keyword),
    trend: toTrend(cluster.trend_direction),
    found_at: formatDate(foundAt),
    is_primary: keyword === cluster.primary_keyword,
  }));
};

// const TrendIcon: React.FC<{ trend: KeywordRow["trend"] }> = ({ trend }) => {
//   if (trend === "up")
//     return <TrendingUp size={14} className="text-[#1B6F63] inline" />;
//   if (trend === "down")
//     return <TrendingDown size={14} className="text-rose-500 inline" />;
//   return <Minus size={14} className="text-[#9BA69F] inline" />;
// };

const difficultyStyles: Record<KeywordRow["difficulty"], string> = {
  Low: "bg-[#DCEFEA] text-[#1B6F63]",
  Medium: "bg-[#EDE3CF] text-[#B08D57]",
  High: "bg-rose-50 text-rose-500",
  Unknown: "bg-slate-100 text-slate-500",
};

const KeywordsPage: React.FC = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState<KeywordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** وضعیت سشن تحلیل: برای تشخیص «هنوز شروع/در حال انجام» از «واقعاً چیزی پیدا نشده» */
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      if (!siteId) {
        setRows([]);
        setLoading(false);
        setError(t("dashboard.errors.invalidSite"));
        return;
      }

      const response = await contentResearchService.latest(
        siteId,
        "keyword_clusters",
      );
      if (cancelled) return;

      if (!response.success) {
        setRows([]);
        setLoading(false);
        setError(response.message || t("dashboard.errors.keywordsLoad"));
        return;
      }

      const session = response.data?.session;
      const result = response.data?.result;
      const clusters = result?.clusters ?? [];
      setRows(
        clusters.flatMap((cluster) =>
          toKeywordRows(cluster, session?.completed_at ?? session?.created_at),
        ),
      );
      setError(session?.status === "failed" ? session.error : null);
      setSessionStatus(session?.status ?? null);

      // اگر سشنی هنوز وجود ندارد یعنی تحلیل هنوز شروع نشده؛ آن را هم در حال پردازش در نظر می‌گیریم
      const isProcessing =
        !session ||
        session.status === "queued" ||
        session.status === "processing";
      setLoading(isProcessing);
      if (isProcessing && !cancelled) {
        retryTimer = setTimeout(load, 4000);
      }
    };

    setLoading(true);
    load();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [siteId]);

  const columns: StatColumn<KeywordRow>[] = [
    {
      key: "keyword",
      label: t("dashboard.keywords.keyword"),
      align: "right",
      render: (value, row) => (
        <span className="inline-flex items-center gap-2">
          {(row as KeywordRow).is_primary && (
            <span className="text-[10px] font-black rounded-full px-2 py-0.5 bg-[#1B6F63]/10 text-[#1B6F63]">
              {t("dashboard.keywords.primary")}
            </span>
          )}
          <span
            className={
              (row as KeywordRow).is_primary ? "font-black" : "font-medium"
            }
          >
            {value as string}
          </span>
        </span>
      ),
    },
   
    {
      key: "difficulty",
      label: t("dashboard.keywords.difficulty"),
      align: "center",
      render: (value) => (
        <span
          className={`text-[11px] font-black rounded-full px-2.5 py-1 ${difficultyStyles[value as KeywordRow["difficulty"]]}`}
        >
          {t(`dashboard.difficulty.${value as string}`)}
        </span>
      ),
    },
    // {
    //   key: "position",
    //   label: "جایگاه در گوگل",
    //   align: "center",
    //   render: (value) =>
    //     value ? `#${(value as number).toLocaleString("en-US")}` : "—",
    // },
    // {
    //   key: "trend",
    //   label: "روند",
    //   align: "center",
    //   render: (value) => <TrendIcon trend={value as KeywordRow["trend"]} />,
    // },
  ];

  // پیام حالت خالی: اگر تحلیل هنوز در جریان است یا اصلاً شروع نشده، این را از «واقعاً چیزی پیدا نشده» جدا نشان بده
  const isAnalyzing =
    sessionStatus === null ||
    sessionStatus === "queued" ||
    sessionStatus === "processing";
  const emptyMessage = isAnalyzing
    ? t("dashboard.keywords.analyzing")
    : t("dashboard.keywords.empty");

  return (
    <Layout
      activeView="info"
      onChangeView={() => {}}
      siteId={siteId}
      hideDesktopPlanBadge={false}
    >
      {error && (
        <div className="max-w-6xl mx-auto px-4 pt-4 text-sm text-rose-600">
          {error}
        </div>
      )}
      <StatListPage
        icon={Search}
        title={t("dashboard.keywords.title")}
        description={t("dashboard.keywords.subtitle")}
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        loading={loading}
        emptyMessage={emptyMessage}
        headerActions={
          <button
            type="button"
            onClick={() => navigate(`/sites/${siteId}/dashboard`)}
            className="text-xs font-black text-[#1B6F63] border border-[#1B6F63]/30 bg-[#DCEFEA] rounded-lg px-3 py-2 hover:bg-[#c9e6df] transition-colors"
          >
            {t("billing.payment.backToDashboard")}
          </button>
        }
      />
    </Layout>
  );
};

export default KeywordsPage;