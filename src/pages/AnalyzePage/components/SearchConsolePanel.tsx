import React, { useEffect, useMemo, useState } from "react";
import { t, formatNumber, formatDateTime } from "../../../i18n";

type SearchConsoleProperty = {
  id: number;
  property_url: string;
  permission_level: string | null;
  sync_status: "idle" | "queued" | "syncing" | "done" | "failed";
  last_synced_at: string | null;
  last_sync_error: string | null;
};

type SearchConsoleQuery = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number | null;
};

type SearchConsolePanelProps = {
  connectionStatus: "connected" | "expired" | "failed" | null;
  connectionError: string | null;
  property: SearchConsoleProperty | null;
  availableProperties: Array<{ property_url: string; permission_level: string | null }>;
  queries: SearchConsoleQuery[];
  loading: boolean;
  onConnect: () => void;
  onLoadProperties: () => void;
  onSelectProperty: (propertyUrl: string) => void;
  onSync: () => void;
  onDisconnect: () => void;
};

const numberFormat = { format: (value: number) => formatNumber(value) };

const SearchConsolePanel: React.FC<SearchConsolePanelProps> = ({
  connectionStatus,
  connectionError,
  property,
  availableProperties,
  queries,
  loading,
  onConnect,
  onLoadProperties,
  onSelectProperty,
  onSync,
  onDisconnect,
}) => {
  const [selectedProperty, setSelectedProperty] = useState("");

  useEffect(() => {
    if (availableProperties.length === 1) setSelectedProperty(availableProperties[0].property_url);
  }, [availableProperties]);

  const totals = useMemo(() => ({
    clicks: queries.reduce((sum, item) => sum + item.clicks, 0),
    impressions: queries.reduce((sum, item) => sum + item.impressions, 0),
  }), [queries]);

  const isSyncing = property?.sync_status === "queued" || property?.sync_status === "syncing";

  return (
    <section className="mb-5 rounded-3xl border border-[#E4E5F0] bg-[#FAFAFE] p-5 shadow-sm" aria-label={t("analyze.gsc.connect")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F1EFFF] text-[#5B47FB]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 3v18h18M7 15l3-4 3 2 4-6" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#2A1F7A]">{t("analyze.gsc.title")}</h3>
            <p className="mt-1 text-xs leading-5 text-[#5A5F80]">
              {t("analyze.gsc.body")}
            </p>
          </div>
        </div>

        {connectionStatus !== "connected" ? (
          <button type="button" onClick={onConnect} disabled={loading} className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#5B47FB] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#4935E0] disabled:opacity-50">
            {connectionStatus ? t("analyze.gsc.reconnect") : t("analyze.gsc.connect")}
          </button>
        ) : (
          <span className="inline-flex shrink-0 items-center rounded-full bg-[#F1EFFF] px-3 py-1 text-xs font-bold text-[#5B47FB]">
            {t("analyze.gsc.connected")}
          </span>
        )}
      </div>

      {connectionError && <p className="mt-3 rounded-xl bg-[#F7EEEA] px-3 py-2 text-xs text-[#B3453A]">{connectionError}</p>}

      {connectionStatus === "connected" && !property && (
        <div className="mt-4 rounded-2xl border border-[#E8E8F2] bg-white p-4">
          {availableProperties.length === 0 ? (
            <button type="button" onClick={onLoadProperties} disabled={loading} className="rounded-xl border border-[#5B47FB] px-3 py-2 text-xs font-bold text-[#5B47FB] hover:bg-[#F1EFFF] disabled:opacity-50">
              {t("analyze.gsc.showProperties")}
            </button>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <select value={selectedProperty} onChange={(event) => setSelectedProperty(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-[#E4E5F0] bg-white px-3 py-2 text-xs text-[#2A1F7A] outline-none focus:border-[#5B47FB]">
                <option value="">{t("analyze.gsc.selectProperty")}</option>
                {availableProperties.map((item) => <option key={item.property_url} value={item.property_url}>{item.property_url}</option>)}
              </select>
              <button type="button" onClick={() => selectedProperty && onSelectProperty(selectedProperty)} disabled={!selectedProperty || loading} className="rounded-xl bg-[#5B47FB] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
                {t("analyze.gsc.connectProperty")}
              </button>
            </div>
          )}
        </div>
      )}

      {property && (
        <div className="mt-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-[#E8E8F2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#2A1F7A] break-all">{property.property_url}</p>
              <p className="mt-1 text-[11px] text-[#717594]">
                {property.last_synced_at ? t("analyze.gsc.lastSynced", { date: formatDateTime(property.last_synced_at) }) : t("analyze.gsc.noData")}
              </p>
              {property.last_sync_error && <p className="mt-1 text-[11px] text-[#B3453A]">{property.last_sync_error}</p>}
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={onSync} disabled={loading || isSyncing} className="rounded-xl bg-[#5B47FB] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
                {isSyncing ? t("analyze.gsc.syncing") : t("analyze.gsc.sync")}
              </button>
              <button type="button" onClick={onDisconnect} disabled={loading} className="rounded-xl border border-[#E4E5F0] px-3 py-2 text-xs font-bold text-[#6F5850] disabled:opacity-50">
                {t("dashboard.wp.disconnect")}
              </button>
            </div>
          </div>

          {queries.length > 0 && (
            <div className="mt-3 grid gap-3 md:grid-cols-[180px_180px_1fr]">
              <div className="rounded-2xl bg-[#F1EFFF] p-3">
                <p className="text-[11px] text-[#494D6B]">{t("analyze.gsc.impressions")}</p>
                <p className="mt-1 text-lg font-extrabold text-[#5B47FB]">{numberFormat.format(totals.impressions)}</p>
              </div>
              <div className="rounded-2xl bg-[#F4F1E8] p-3">
                <p className="text-[11px] text-[#6D654D]">{t("analyze.gsc.clicks")}</p>
                <p className="mt-1 text-lg font-extrabold text-[#5A5138]">{numberFormat.format(totals.clicks)}</p>
              </div>
              <div className="rounded-2xl border border-[#E8E8F2] bg-white p-3">
                <p className="mb-2 text-[11px] font-bold text-[#5A5F80]">{t("analyze.gsc.topQueries")}</p>
                <div className="space-y-1.5">
                  {queries.slice(0, 5).map((item) => (
<div key={item.query} className="flex items-center justify-between gap-3 text-xs">
                        <span className="truncate text-[#2A1F7A]">{item.query}</span>
                      <span className="shrink-0 text-[#717594]">{t("analyze.gsc.queryStats", { impressions: numberFormat.format(item.impressions), position: item.position != null ? formatNumber(item.position, { maximumFractionDigits: 1 }) : "—" })}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SearchConsolePanel;
