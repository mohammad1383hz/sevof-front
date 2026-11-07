import type { DashboardStatistics } from "../../types";
import { t, formatNumber } from "../../i18n";

interface StatisticsGridProps {
  statistics: DashboardStatistics;
}

const StatisticsGrid: React.FC<StatisticsGridProps> = ({ statistics }) => {
  const items = [
    { label: t("dashboard.stats.totalArticles"), value: statistics.total_articles },
    { label: t("dashboard.stats.published"), value: statistics.published, cls: "text-[#1B6F63]" },
    { label: t("dashboard.stats.generating"), value: statistics.generating, cls: "text-[#B08D57]" },
    { label: t("dashboard.stats.failed"), value: statistics.failed, cls: "text-rose-600" },
    {
      label: t("dashboard.stats.avgSeo"),
      value: statistics.average_seo_score !== null ? statistics.average_seo_score : "—",
    },
    { label: t("dashboard.stats.totalWords"), value: formatNumber(statistics.total_words) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white border border-[#DAD5C7] rounded-xl p-2 sm:p-2.5 text-center"
        >
          <p className={`text-base sm:text-lg font-bold ${item.cls ?? "text-[#1E2A28]"} truncate`}>
            {item.value}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#9BA69F] mt-0.5 leading-4">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatisticsGrid;