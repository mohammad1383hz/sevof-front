import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lightbulb, Search } from "lucide-react";
import Layout from "../components/Layout";
import StatListPage from "../components/stats/StatListPage";
import type { StatColumn } from "../components/stats/StatListPage";
import { articleIdeaService } from "../services/api";
import type { ArticleIdea } from "../types/index";
import { t, tMaybe, getLocale } from "../i18n";

interface OpportunityRow {
  id: number | string;
  topic: string;
  entity: string;
  competitor_gap: "uncovered" | "covered" | "reviewing";
  found_at: string;
}

const toOpportunityRow = (idea: ArticleIdea): OpportunityRow => ({
  id: idea.id,
  topic: idea.title,
  entity: idea.entity?.name ?? "—",
  // The API doesn't expose competitor-coverage data yet, so this
  // column always shows "reviewing" for now.
  competitor_gap: "reviewing",
  found_at: idea.created_at
    ? new Date(idea.created_at).toLocaleDateString(getLocale())
    : "—",
});

const gapStyles: Record<OpportunityRow["competitor_gap"], string> = {
  uncovered: "bg-[#DCEFEA] text-[#1B6F63]",
  covered: "bg-[#EDE3CF] text-[#B08D57]",
  reviewing: "bg-gray-100 text-gray-500",
};

const OpportunitiesPage: React.FC = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState<OpportunityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!siteId) {
        setRows([]);
        setLoading(false);
        setError(t("dashboard.errors.invalidSite"));
        return;
      }

      setLoading(true);
      const response = await articleIdeaService.list(siteId);
      if (cancelled) return;

      if (!response.success) {
        setRows([]);
        setError(response.message || t("dashboard.errors.ideasLoad"));
        setLoading(false);
        return;
      }

      const ideas = response.data?.data ?? [];
      setRows(ideas.map(toOpportunityRow));
      setError(null);
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [siteId]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) =>
        row.topic.toLowerCase().includes(query) ||
        row.entity.toLowerCase().includes(query)
    );
  }, [rows, search]);

  const columns: StatColumn<OpportunityRow>[] = [
    { key: "topic", label: t("dashboard.opportunitiesPage.topic"), align: "right" },
    { key: "entity", label: t("dashboard.opportunitiesPage.entity"), align: "right" },
    {
      key: "competitor_gap",
      label: t("dashboard.opportunitiesPage.competitor"),
      align: "center",
      render: (value) => (
        <span
          className={`text-[11px] font-black rounded-full px-2.5 py-1 ${gapStyles[value as OpportunityRow["competitor_gap"]]}`}
        >
          {tMaybe(`dashboard.gap.${value as string}`, value as string)}
        </span>
      ),
    },
  ];

  return (
    <Layout activeView="info" onChangeView={() => {}} siteId={siteId}>
      {error && (
        <div className="max-w-6xl mx-auto px-4 pt-4 text-sm text-rose-600">
          {error}
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard.opportunitiesPage.search")}
            className="w-full text-sm rounded-lg border border-gray-200 bg-white ps-9 pe-3 py-2 text-start focus:outline-none focus:ring-2 focus:ring-[#1B6F63]/30 focus:border-[#1B6F63]/40"
          />
        </div>
      </div>
      <StatListPage
        icon={Lightbulb}
        title={t("dashboard.opportunitiesPage.title")}
        description={t("dashboard.opportunitiesPage.subtitle")}
        columns={columns}
        rows={filteredRows}
        rowKey={(row) => row.id}
        loading={loading}
        emptyMessage={
          search
            ? t("dashboard.noResults")
            : t("dashboard.opportunitiesPage.empty")
        }
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

export default OpportunitiesPage;
