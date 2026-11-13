import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ExternalLink, AlertCircle } from "lucide-react";
import Layout from "../components/Layout";
import StatListPage from "../components/stats/StatListPage";
import type { StatColumn } from "../components/stats/StatListPage";
import { articleService } from "../services/api";
import type { ArticleListItem } from "../types";
import { t, formatDate, getLocale } from "../i18n";

interface PublishedArticleRow {
  id: string;
  title: string;
  url: string | null;
  target_keyword: string;
  published_at: string;
  publish_status: "draft" | "published" | "failed" | null;
  publish_error: string | null;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  published: { label: "dashboard.publishStatus.published", className: "text-emerald-700 bg-emerald-50" },
  draft: { label: "dashboard.publishStatus.draft", className: "text-amber-700 bg-amber-50" },
  failed: { label: "dashboard.publishStatus.failed", className: "text-rose-700 bg-rose-50" },
};

const toPublishedRow = (article: ArticleListItem): PublishedArticleRow => ({
  id: article.id,
  title: article.title,
  url: article.wp_permalink || null,
  target_keyword: article.idea?.entity_name || "—",
  published_at:
    article.published_at || article.completed_at || article.created_at,
  publish_status: article.publish_status ?? null,
  publish_error: article.publish_error ?? null,
});

const StatusBadge: React.FC<{ status: string | null }> = ({ status }) => {
  const info = status ? STATUS_LABELS[status] : null;
  if (!info) return <span className="text-xs text-gray-400">—</span>;
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${info.className}`}
    >
      {t(info.label)}
    </span>
  );
};

// Popover واقعی با کلیک (نه native title که در هاور غیرقابل‌اعتماد است و در موبایل کار نمی‌کند).
// فقط یک popover در کل صفحه هم‌زمان باز می‌ماند (openErrorId در کامپوننت والد نگه‌داری می‌شود).
const ErrorIndicator: React.FC<{
  rowId: string;
  message: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
}> = ({ rowId, message, isOpen, onToggle }) => (
  <span className="relative inline-flex">
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle(rowId);
      }}
      className="inline-flex items-center justify-center"
      aria-label={t("dashboard.published.errorDetails")}
    >
      <AlertCircle size={15} className="text-rose-500 cursor-pointer" />
    </button>

    {isOpen && (
      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute z-20 top-full mt-1.5 start-0 w-64 rounded-lg border border-rose-200 bg-white p-2.5 text-[11px] leading-5 text-rose-700 shadow-lg text-start"
      >
        {message}
      </div>
    )}
  </span>
);

// کارت موبایل: عنوان با line-clamp کوتاه می‌شود (بدون اسکرول افقی).
// اینجا نیازی به popover نیست؛ چون جا هست، پیام خطا مستقیم و کامل نمایش داده می‌شود.
const MobileArticleCard: React.FC<{ row: PublishedArticleRow }> = ({ row }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 flex flex-col gap-2">
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-sm font-bold text-gray-800 leading-5 line-clamp-2 flex-1">
        {row.title}
      </h3>
      <StatusBadge status={row.publish_status} />
    </div>

    <p className="text-xs text-gray-500 truncate">{row.target_keyword}</p>

    {row.publish_status === "failed" && row.publish_error && (
      <div className="flex items-start gap-1.5 rounded-lg bg-rose-50 border border-rose-100 px-2 py-1.5">
        <AlertCircle size={13} className="text-rose-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-rose-700 leading-4">{row.publish_error}</p>
      </div>
    )}

    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
      <span className="text-[11px] text-gray-400">
        {new Date(row.published_at).toLocaleDateString(getLocale())}
      </span>
      {row.url ? (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5B47FB]"
          onClick={(event) => event.stopPropagation()}
        >
          {t("dashboard.view")} <ExternalLink size={12} />
        </a>
      ) : (
        <span className="text-[11px] text-gray-300">—</span>
      )}
    </div>
  </div>
);

const ArticlesPublishedPage: React.FC = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState<PublishedArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openErrorId, setOpenErrorId] = useState<string | null>(null);

  // کلیک بیرون از popover آن را می‌بندد. چون دکمه و باکس خودشان stopPropagation
  // می‌زنند، این listener فقط برای کلیک‌های بیرون از آن‌ها فعال می‌شود.
  useEffect(() => {
    const closeOnOutsideClick = () => setOpenErrorId(null);
    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!siteId) {
        setRows([]);
        setLoading(false);
        setError(t("dashboard.errors.invalidSite"));
        return;
      }

const response = await articleService.list(siteId, { source: "agent" });
      if (cancelled) return;

      if (!response.success) {
        setRows([]);
        setLoading(false);
        setError(response.message || t("dashboard.errors.publishedLoad"));
        return;
      }

 const articles = response.data?.data ?? [];
setRows(
  articles
    .filter(
      (article) =>
        article.status === "completed" &&
        article.publish_status !== null &&
        article.publish_status !== undefined,
    )
    .map(toPublishedRow)
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    ),
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

  const columns: StatColumn<PublishedArticleRow>[] = [
    {
      key: "title",
      label: t("dashboard.columns.title"),
      align: "right",
      render: (value) => (
        <span className="block max-w-[320px] truncate" title={value as string}>
          {value as string}
        </span>
      ),
    },
    { key: "target_keyword", label: t("dashboard.columns.keyword"), align: "right" },
    {
      key: "publish_status",
      label: t("dashboard.columns.publishStatus"),
      align: "center",
      render: (value, row) => (
        <span className="inline-flex items-center gap-1.5">
          <StatusBadge status={value as string | null} />
          {value === "failed" && row.publish_error && (
            <ErrorIndicator
              rowId={row.id}
              message={row.publish_error}
              isOpen={openErrorId === row.id}
              onToggle={(id) => setOpenErrorId((current) => (current === id ? null : id))}
            />
          )}
        </span>
      ),
    },
    {
      key: "published_at",
      label: t("dashboard.columns.date"),
      align: "center",
      render: (value) => formatDate(value as string),
    },
    {
      key: "url",
      label: t("dashboard.columns.url"),
      align: "center",
      render: (value) =>
        value ? (
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#5B47FB] hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            {t("dashboard.view")} <ExternalLink size={13} />
          </a>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <Layout activeView="articles" onChangeView={() => {}} siteId={siteId}>
      {error && (
        <div className="max-w-6xl mx-auto px-4 pt-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* موبایل: کارت‌های عمودی بدون اسکرول افقی، عنوان با line-clamp کوتاه می‌شود */}
      <div className="sm:hidden max-w-6xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <Send size={16} className="text-[#5B47FB]" />
              {t("dashboard.published.title")}
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {t("dashboard.published.subtitleShort")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/sites/${siteId}/dashboard`)}
            className="text-[11px] font-black text-[#5B47FB] border border-[#5B47FB]/30 bg-[#EFEDFF] rounded-lg px-2.5 py-1.5"
          >
            {t("common.actions.back")}
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-10">
            {t("dashboard.published.empty")}
          </p>
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <MobileArticleCard key={row.id} row={row} />
            ))}
          </div>
        )}
      </div>

      {/* دسکتاپ/تبلت: همان جدول قبلی + popover کلیکی برای دلیل خطا */}
      <div className="hidden sm:block">
        <StatListPage
          icon={Send}
          title={t("dashboard.published.title")}
          description={t("dashboard.published.subtitle")}
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          loading={loading}
          emptyMessage={t("dashboard.published.empty")}
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
      </div>
    </Layout>
  );
};

export default ArticlesPublishedPage;