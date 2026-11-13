import React, { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, Link2, Loader2, RefreshCw, ShoppingBag, Unlink, XCircle } from "lucide-react";
import { shopifyService, type ShopifyConnection } from "../../services/api";
import { t } from "../../i18n";

// ==========================================================
// Shopify connection: the merchant enters the store address and approves the
// Sevof app on Shopify (OAuth). No tokens are typed or shown in our UI.
// ==========================================================

interface ShopifyConnectionCardProps {
  siteId: number | string;
  /** Pre-filled store address (e.g. coming from the Shopify App Store install link). */
  initialShop?: string;
  onChange?: (connection: ShopifyConnection | null) => void;
}

const inputClass =
  "w-full rounded-lg border border-[#E4E5F0] bg-white px-3 py-2 text-sm text-[#0D0F23] placeholder:text-[#9A9DB8] focus:outline-none focus:ring-2 focus:ring-[#5B47FB]/30 focus:border-[#5B47FB] disabled:opacity-60";

/** "my-store", "my-store.myshopify.com" or an admin URL → "my-store.myshopify.com" (server validates again). */
const normalizeShop = (value: string) => {
  let shop = value.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  if (shop && !shop.includes(".")) shop = `${shop}.myshopify.com`;
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop) ? shop : null;
};

const ShopifyConnectionCard: React.FC<ShopifyConnectionCardProps> = ({ siteId, initialShop, onChange }) => {
  const [connection, setConnection] = useState<ShopifyConnection | null>(null);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [shop, setShop] = useState(initialShop ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const bannerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((type: "success" | "error", text: string) => {
    setBanner({ type, text });
    if (bannerTimeout.current) clearTimeout(bannerTimeout.current);
    bannerTimeout.current = setTimeout(() => setBanner(null), 5000);
  }, []);

  useEffect(() => () => {
    if (bannerTimeout.current) clearTimeout(bannerTimeout.current);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await shopifyService.show(siteId);
    if (res.success && res.data) {
      setConnection(res.data.data);
      setConfigured(res.data.configured !== false);
      setLoadError(null);
    } else {
      setLoadError(res.message || t("dashboard.shopify.loadFailed"));
    }
    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  // Coming back from Shopify: /sites/{id}/dashboard?shopify=connected
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("shopify") === "connected") showBanner("success", t("dashboard.shopify.connectedBanner"));
  }, [showBanner]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeShop(shop);
    if (!normalized) {
      setFormError(t("dashboard.shopify.invalidShop"));
      return;
    }
    setFormError(null);
    setRedirecting(true);
    const res = await shopifyService.install(siteId, normalized);
    if (res.success && res.data?.authorize_url) {
      window.location.assign(res.data.authorize_url);
      return;
    }
    setRedirecting(false);
    setFormError(res.message || t("dashboard.shopify.installFailed"));
  };

  const handleTest = async () => {
    setTesting(true);
    const res = await shopifyService.test(siteId);
    setTesting(false);
    if (res.success && res.data?.data?.ok) showBanner("success", t("dashboard.shopify.testOk"));
    else showBanner("error", res.data?.data?.message || res.message || t("dashboard.shopify.testBad"));
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    const res = await shopifyService.disconnect(siteId);
    setDisconnecting(false);
    setConfirmDisconnect(false);
    if (res.success) {
      setConnection(null);
      onChange?.(null);
      showBanner("success", t("dashboard.shopify.disconnected"));
    } else {
      showBanner("error", res.message || t("dashboard.shopify.disconnectFailed"));
    }
  };

  return (
    <section className="rounded-2xl border border-[#E4E5F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3 border-b border-[#E4E5F0]/60">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5E8E3E] text-white">
            <ShoppingBag className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#0D0F23]">{t("dashboard.shopify.title")}</h2>
            <p className="text-xs text-[#9A9DB8] mt-0.5">{t("dashboard.shopify.subtitle")}</p>
          </div>
        </div>
        {connection && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#5B47FB]/30 bg-[#EFEDFF] px-2.5 py-1 text-xs font-medium text-[#5B47FB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5B47FB]" />
            {t("dashboard.shopify.connected")}
          </span>
        )}
      </div>

      <div className="px-5 sm:px-6 py-4">
        {banner && (
          <div
            role="status"
            className={`mb-3 flex items-start gap-2 rounded-xl p-3 text-sm border ${
              banner.type === "success" ? "bg-[#EFEDFF] border-[#5B47FB]/30 text-[#4935E0]" : "bg-rose-50 border-rose-200 text-rose-600"
            }`}
          >
            {banner.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
            <span>{banner.text}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-[#9A9DB8] py-3">
            <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
            {t("dashboard.connection.checking")}
          </div>
        ) : loadError ? (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 p-3 text-sm">
            <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{loadError}</span>
          </div>
        ) : connection ? (
          <div className="space-y-3">
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[#9A9DB8]">{t("dashboard.shopify.store")}</dt>
                <dd className="font-medium text-[#0D0F23] break-all">{connection.shop_name || connection.shop_domain}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#9A9DB8]">{t("dashboard.shopify.storefront")}</dt>
                <dd dir="ltr" className="text-start">
                  <a href={connection.shop_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#5B47FB] hover:underline break-all">
                    {connection.shop_url.replace(/^https?:\/\//, "")}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </dd>
              </div>
            </dl>
            {connection.last_error && <p className="text-xs text-rose-600">{connection.last_error}</p>}
            <p className="text-xs leading-relaxed text-[#5A5F80]">{t("dashboard.shopify.connectedHelp")}</p>

            {confirmDisconnect ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                <p className="text-sm font-bold text-rose-700">{t("dashboard.shopify.confirmTitle")}</p>
                <p className="mt-1 text-xs text-rose-700/80">{t("dashboard.shopify.confirmBody")}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={handleDisconnect} disabled={disconnecting} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60">
                    {disconnecting ? t("dashboard.shopify.disconnecting") : t("dashboard.shopify.disconnect")}
                  </button>
                  <button type="button" onClick={() => setConfirmDisconnect(false)} className="rounded-lg border border-[#E4E5F0] bg-white px-3 py-1.5 text-xs font-bold text-[#3B3F5C]">
                    {t("dashboard.shopify.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleTest} disabled={testing} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E5F0] px-3 py-1.5 text-xs font-bold text-[#3B3F5C] hover:bg-[#F6F6FB] disabled:opacity-60">
                  {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  {t("dashboard.shopify.test")}
                </button>
                <button type="button" onClick={() => setConfirmDisconnect(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">
                  <Unlink className="h-3.5 w-3.5" />
                  {t("dashboard.shopify.disconnect")}
                </button>
              </div>
            )}
          </div>
        ) : !configured ? (
          <p className="text-sm text-[#5A5F80]">{t("dashboard.shopify.notConfigured")}</p>
        ) : (
          <form onSubmit={handleConnect} className="space-y-3" noValidate>
            <p className="text-xs leading-relaxed text-[#0D0F23]">{t("dashboard.shopify.intro")}</p>
            <div>
              <label htmlFor={`shopify-shop-${siteId}`} className="mb-1.5 block text-xs font-medium text-[#0D0F23]">
                {t("dashboard.shopify.shopLabel")}
              </label>
              <input
                id={`shopify-shop-${siteId}`}
                dir="ltr"
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                placeholder="your-store.myshopify.com"
                aria-invalid={!!formError}
                aria-describedby={formError ? `shopify-shop-error-${siteId}` : `shopify-shop-hint-${siteId}`}
                className={`${inputClass} text-left`}
                disabled={redirecting}
              />
              {formError ? (
                <p id={`shopify-shop-error-${siteId}`} className="mt-1 text-xs text-rose-600">{formError}</p>
              ) : (
                <p id={`shopify-shop-hint-${siteId}`} className="mt-1 text-xs text-[#9A9DB8]">{t("dashboard.shopify.shopHint")}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={redirecting || !shop.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5B47FB] px-4 py-2 text-sm font-bold text-white hover:bg-[#4935E0] disabled:opacity-60"
            >
              {redirecting ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <Link2 className="h-4 w-4" />}
              {redirecting ? t("dashboard.shopify.redirecting") : t("dashboard.shopify.connect")}
            </button>
            <p className="text-[11px] leading-relaxed text-[#9A9DB8]">{t("dashboard.shopify.permissions")}</p>
          </form>
        )}
      </div>
    </section>
  );
};

export default ShopifyConnectionCard;
