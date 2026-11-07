// src/pages/ShopifyConnectPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ShoppingBag } from "lucide-react";
import { shopifyService, siteService } from "../services/api";
import type { Site } from "../types";
import { t } from "../i18n";

const PENDING_KEY = "shopify.pendingShop";

/** Remembered while the merchant signs in, so the install continues afterwards. */
export const rememberPendingShop = (shop: string | null) => {
  try {
    if (shop) sessionStorage.setItem(PENDING_KEY, shop);
    else sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // storage unavailable (private mode): the merchant can start again from Shopify
  }
};

export const pendingShopifyPath = (): string | null => {
  try {
    const shop = sessionStorage.getItem(PENDING_KEY);
    return shop ? `/shopify/connect?shop=${encodeURIComponent(shop)}` : null;
  } catch {
    return null;
  }
};

/**
 * Landing page for installs that start in Shopify (App Store / admin):
 * the backend sends the merchant here with ?shop=…; they pick which Sevof site the store belongs to.
 */
const ShopifyConnectPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const shop = params.get("shop") ?? "";
  const [sites, setSites] = useState<Site[] | null>(null);
  // Set by the backend when the Shopify OAuth callback fails, so the merchant can retry here.
  const [error, setError] = useState<string | null>(params.get("error"));
  const [busyId, setBusyId] = useState<string | number | null>(null);

  useEffect(() => {
    rememberPendingShop(null);
    siteService.list().then((res) => {
      if (res.success && res.data) setSites(res.data.data ?? []);
      else setError(res.message || t("dashboard.shopify.loadFailed"));
    });
  }, []);

  const connect = async (site: Site) => {
    setBusyId(site.id);
    setError(null);
    const res = await shopifyService.install(site.id, shop);
    if (res.success && res.data?.authorize_url) {
      window.location.assign(res.data.authorize_url);
      return;
    }
    setBusyId(null);
    setError(res.message || t("dashboard.shopify.installFailed"));
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#DAD5C7] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5E8E3E] text-white">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-[#1E2A28]">{t("dashboard.shopify.pickTitle")}</h1>
            <p dir="ltr" className="truncate text-start text-xs text-[#9BA69F]">{shop}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#5B6560]">{t("dashboard.shopify.pickBody")}</p>

        {error && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-600">{error}</p>}

        {sites === null ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#9BA69F]">
            <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
            {t("dashboard.connection.checking")}
          </div>
        ) : sites.length === 0 ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-[#384B43]">{t("dashboard.shopify.noSites")}</p>
            <button type="button" onClick={() => navigate("/dashboard")} className="rounded-lg bg-[#1B6F63] px-4 py-2 text-sm font-bold text-white">
              {t("dashboard.shopify.addSite")}
            </button>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {sites.map((site) => (
              <li key={site.id}>
                <button
                  type="button"
                  disabled={busyId !== null || !shop}
                  onClick={() => connect(site)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#DAD5C7] px-4 py-3 text-start hover:border-[#1B6F63] hover:bg-[#DCEFEA]/40 disabled:opacity-60"
                >
                  <span dir="ltr" className="truncate text-sm font-medium text-[#1E2A28]">{site.domain}</span>
                  {busyId === site.id ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#1B6F63] motion-reduce:animate-none" />
                  ) : (
                    <span className="shrink-0 text-xs font-bold text-[#1B6F63]">{t("dashboard.shopify.connect")}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShopifyConnectPage;
