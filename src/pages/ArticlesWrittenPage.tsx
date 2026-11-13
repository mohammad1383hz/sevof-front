import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import Layout from "../components/Layout";
import StatListPage from "../components/stats/StatListPage";
import type { StatColumn } from "../components/stats/StatListPage";
import { articleService } from "../services/api";
import type { ArticleListItem } from "../types";
import { t, formatNumber } from "../i18n";

interface ArticleRow {
  id: number | string;
  title: string;
  target_keyword: string;
  word_count: number;
  status: "draft" | "published";
  written_at: string;
}

const toArticleRow = (article: ArticleListItem): ArticleRow => ({
  id: article.id,
  title: article.title,
  target_keyword: article.idea?.entity_name || "—",
  word_count: article.word_count ?? 0,
  status:
    article.publish_status === "published" || Boolean(article.published_at)
      ? "published"
      : "draft",
  written_at: article.completed_at || article.created_at,
});

const statusStyles: Record<
  ArticleRow["status"],
  { label: string; cls: string }
> = {
  published: { label: "dashboard.publishStatus.published", cls: "bg-[#EFEDFF] text-[#5B47FB]" },
  draft: { label: "dashboard.publishStatus.draft", cls: "bg-[#EDE3CF] text-[#B08D57]" },
};

const ArticlesWrittenPage: React.FC = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!siteId) {
        setRows([]);
        setLoading(false);
        setError(t("dashboard.errors.invalidSite"));
        return;
      }

      const response = await articleService.list(siteId);
      if (cancelled) return;

      if (!response.success) {
        setRows([]);
        setLoading(false);
        setError(response.message || t("dashboard.errors.writtenLoad"));
        return;
      }

      const articles = response.data?.data ?? [];
      setRows(
        articles
          .filter((article) => article.status === "completed")
          .map(toArticleRow),
      );
      setError(null);
      setLoading(false);
    };

    setLoading(true);
    load();

    return () => {
      cancelled = true;
    };
  }, [siteId]);

  const columns: StatColumn<ArticleRow>[] = [
    { key: "title", label: t("dashboard.columns.title"), align: "right" },
    { key: "target_keyword", label: t("dashboard.columns.keyword"), align: "right" },
    {
      key: "word_count",
      label: t("dashboard.columns.words"),
      align: "center",
      render: (value) => formatNumber(value as number),
    },
    {
      key: "status",
      label: t("dashboard.columns.status"),
      align: "center",
      render: (value) => {
        const status = statusStyles[value as ArticleRow["status"]];
        return (
          <span
            className={`text-[11px] font-black rounded-full px-2.5 py-1 ${status.cls}`}
          >
            {t(status.label)}
          </span>
        );
      },
    },
  ];

  return (
    <Layout activeView="articles" onChangeView={() => {}} siteId={siteId}>
      {error && (
        <div className="max-w-6xl mx-auto px-4 pt-4 text-sm text-rose-600">
          {error}
        </div>
      )}
      <StatListPage
        icon={FileText}
        title={t("dashboard.written.title")}
        description={t("dashboard.written.subtitle")}
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        loading={loading}
        emptyMessage={t("dashboard.written.empty")}
        headerActions={
          <button
            type="button"
            onClick={() => navigate(`/sites/${siteId}/dashboard`)}
            className="text-xs font-black text-[#5B47FB] border border-[#5B47FB]/30 bg-[#EFEDFF] rounded-lg px-3 py-2 hover:bg-[#DDD8FF] transition-colors"
          >
            {t("billing.payment.backToDashboard")}
          </button>
        }
      />
    </Layout>
  );
};

export default ArticlesWrittenPage;
