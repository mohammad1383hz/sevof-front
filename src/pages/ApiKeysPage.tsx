import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import { apiKeyService, siteService } from "../services/api";
import type { ApiKey } from "../services/api";
import { t, getLocale } from "../i18n";
import type { Site } from "../types";

const formatDate = (value: string | null): string => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(getLocale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ApiKeysPage: React.FC = () => {
  const [activeView, setActiveView] = useState<SidebarView>("api-keys" as SidebarView);
  const navigate = useNavigate();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // سایت‌های کاربر برای انتخاب موقع ساخت کلید
  const [sites, setSites] = useState<Site[]>([]);
  const [sitesLoading, setSitesLoading] = useState<boolean>(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const [newKeyName, setNewKeyName] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [revealedKey, setRevealedKey] = useState<{ name: string; value: string; domain: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await apiKeyService.list();
      if (res.success && res.data?.data) {
        setKeys(res.data.data);
        setError(null);
      } else {
        setError(res.message || t("developer.keys.errors.load"));
      }
    } catch {
      setError(t("developer.keys.errors.loadNetwork"));
    }
  }, []);

  const fetchSites = useCallback(async () => {
    try {
      const res = await siteService.list(1);
      if (res.success && res.data) {
        // پاسخ صفحه‌بندی‌شده (data.data) یا آرایه‌ی ساده، هر دو پشتیبانی می‌شن
        const payload = res.data as unknown as { data?: Site[] } | Site[];
        const items = Array.isArray(payload) ? payload : payload.data ?? [];
        setSites(items);
        if (items.length > 0) {
          setSelectedSiteId((prev) => prev || String(items[0].id));
        }
      }
    } catch {
      setCreateError(t("developer.keys.sitesFailed"));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchKeys().finally(() => setLoading(false));

    setSitesLoading(true);
    fetchSites().finally(() => setSitesLoading(false));
  }, [fetchKeys, fetchSites]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newKeyName.trim();
    if (!name || !selectedSiteId || creating) return;

    setCreating(true);
    setCreateError(null);
    try {
      const res = await apiKeyService.create({ name, site_id: selectedSiteId });
      if (res.success && res.data) {
        setRevealedKey({
          name: res.data.name,
          value: res.data.api_key,
          domain: res.data.site?.domain ?? "",
        });
        setNewKeyName("");
        await fetchKeys();
      } else {
        setCreateError(res.message || t("developer.keys.errors.create"));
      }
    } catch {
      setCreateError(t("developer.keys.errors.createNetwork"));
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!revealedKey) return;
    try {
      await navigator.clipboard.writeText(revealedKey.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // اگر clipboard در دسترس نبود، کاربر می‌تونه دستی کپی کنه
    }
  };

  const handleRevoke = async (key: ApiKey) => {
    if (revokingId) return;
    const confirmed = window.confirm(
      t("developer.keys.revokeConfirm", { name: key.name })
    );
    if (!confirmed) return;

    setRevokingId(key.id);
    try {
      const res = await apiKeyService.revoke(key.id);
      if (res.success) {
        await fetchKeys();
      } else {
        setError(res.message || t("developer.keys.errors.revoke"));
      }
    } catch {
      setError(t("developer.keys.errors.revokeNetwork"));
    } finally {
      setRevokingId(null);
    }
  };

  const noSites = !sitesLoading && sites.length === 0;

  return (
    <Layout activeView={activeView} onChangeView={setActiveView}>
      <div className="p-3 sm:p-4 lg:p-5 max-w-4xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0D0F23]">{t("developer.keys.title")}</h1>
            <p className="text-xs text-[#9A9DB8] mt-0.5">
              {t("developer.keys.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/developer/api-docs")}
            className="group relative shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#0D0F23] text-white text-sm font-medium px-4 py-2 overflow-hidden"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping motion-reduce:hidden" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <svg
              className="relative h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3M14 4h6v6M20 4l-8 8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative">{t("developer.keys.docsLink")}</span>
          </button>
        </div>

        {/* فرم ساخت کلید جدید */}
        <form
          onSubmit={handleCreate}
          className="bg-white border border-[#E4E5F0] rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end"
        >
          <div className="flex-1">
            <label htmlFor="key-name" className="block text-xs text-[#9A9DB8] mb-1">
              {t("developer.keys.name")}
            </label>
            <input
              id="key-name"
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder={t("developer.keys.namePlaceholder")}
              className="w-full rounded-lg border border-[#E4E5F0] px-3 py-2 text-sm text-[#0D0F23] focus:outline-none focus:ring-2 focus:ring-[#5B47FB]"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="key-site" className="block text-xs text-[#9A9DB8] mb-1">
              {t("developer.keys.cols.site")}
            </label>
            <select
              id="key-site"
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              disabled={sitesLoading || noSites}
              className="w-full rounded-lg border border-[#E4E5F0] bg-white px-3 py-2 text-sm text-[#0D0F23] focus:outline-none focus:ring-2 focus:ring-[#5B47FB] disabled:opacity-60"
              dir="ltr"
            >
              {sitesLoading && <option value="">{t("developer.keys.sitesLoading")}</option>}
              {noSites && <option value="">{t("developer.keys.noSites")}</option>}
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.domain}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={creating || !newKeyName.trim() || !selectedSiteId}
            className="shrink-0 bg-[#5B47FB] text-white text-sm font-medium rounded-lg px-4 py-2 disabled:opacity-50"
          >
            {creating ? t("developer.keys.creating") : t("developer.keys.create")}
          </button>
        </form>

        {noSites && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm">
            {t("developer.keys.addSiteFirst")}
          </div>
        )}

        {createError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg text-sm">
            {createError}
          </div>
        )}

        {/* نمایش یک‌باره‌ی کلید تازه‌ساخته‌شده */}
        {revealedKey && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium text-amber-800">
              {t("developer.keys.created", { name: revealedKey.name })}
            </p>
            <div className="flex items-center gap-2">
              <code
                className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs text-[#0D0F23] overflow-x-auto whitespace-nowrap"
                dir="ltr"
              >
                {revealedKey.value}
              </code>
              <button
                onClick={handleCopy}
                type="button"
                className="shrink-0 bg-amber-600 text-white text-xs font-medium rounded-lg px-3 py-2"
              >
                {copied ? t("developer.keys.copied") : t("developer.keys.copy")}
              </button>
            </div>
            <button
              onClick={() => setRevealedKey(null)}
              type="button"
              className="text-xs text-amber-700 underline"
            >
              {t("developer.keys.gotIt")}
            </button>
          </div>
        )}

        {/* لیست کلیدها */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="h-8 w-8 border-2 border-[#E4E5F0] border-t-[#5B47FB] rounded-full animate-spin motion-reduce:animate-none" />
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm">{error}</div>
        )}

        {!loading && !error && keys.length === 0 && (
          <div className="bg-white border border-dashed border-[#E4E5F0] rounded-xl p-8 text-center text-sm text-[#9A9DB8]">
            {t("developer.keys.empty")}
          </div>
        )}

        {!loading && keys.length > 0 && (
          <div className="bg-white border border-[#E4E5F0] rounded-xl overflow-x-auto">
            <table className="w-full text-sm text-start">
              <thead>
                <tr className="border-b border-[#E4E5F0] text-[#9A9DB8]">
                  <th className="px-4 py-2 font-normal">{t("developer.keys.cols.name")}</th>
                  <th className="px-4 py-2 font-normal">{t("developer.keys.cols.site")}</th>
                  <th className="px-4 py-2 font-normal">{t("developer.keys.cols.key")}</th>
                  <th className="px-4 py-2 font-normal">{t("developer.keys.cols.created")}</th>
                  <th className="px-4 py-2 font-normal">{t("developer.keys.cols.lastUsed")}</th>
                  <th className="px-4 py-2 font-normal">{t("dashboard.columns.status")}</th>
                  <th className="px-4 py-2 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => {
                  const isRevoked = key.revoked_at !== null;
                  return (
                    <tr key={key.id} className="border-b last:border-0 border-[#F0EEE7]">
                      <td className="px-4 py-3 text-[#0D0F23]">{key.name}</td>
                      <td className="px-4 py-3 text-[#0D0F23]" dir="ltr">
                        {key.site?.domain ?? (
                          <span className="text-xs text-[#9A9DB8]" dir="auto">
                            {t("developer.keys.legacySite")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#9A9DB8]" dir="ltr">
                        ••••{key.key_last_four}
                      </td>
                      <td className="px-4 py-3 text-[#9A9DB8]">{formatDate(key.created_at)}</td>
                      <td className="px-4 py-3 text-[#9A9DB8]">{formatDate(key.last_used_at)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            isRevoked
                              ? "inline-block text-xs rounded-full px-2 py-0.5 bg-rose-50 text-rose-600"
                              : "inline-block text-xs rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700"
                          }
                        >
                          {isRevoked ? t("developer.keys.revoked") : t("developer.keys.active")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-start">
                        {!isRevoked && (
                          <button
                            onClick={() => handleRevoke(key)}
                            disabled={revokingId === key.id}
                            className="text-xs text-rose-600 hover:underline disabled:opacity-50"
                          >
                            {revokingId === key.id ? "..." : t("developer.keys.revoke")}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApiKeysPage;