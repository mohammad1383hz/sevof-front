import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Loader2 } from "lucide-react";
import { shopifyService, siteService, wordpressService } from "../../services/api";
import WordPressConnectionCard from "./WordPressConnectionCard";
import ShopifyConnectionCard from "./ShopifyConnectionCard";
import { t } from "../../i18n";

type Platform = "wordpress" | "shopify";

interface SiteConnectionPanelProps {
  siteId: number | string;
}

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "wordpress", label: "WordPress" },
  { key: "shopify", label: "Shopify" },
];

/** Shown so users know they're on the roadmap; not clickable yet. */
const COMING_SOON = ["Wix", "Webflow", "Notion"];

const API_DOCS_PATH = "/developer/api-docs";

const ApiDocsLinkCard: React.FC = () => (
  <Link
    to={API_DOCS_PATH}
    className="group relative flex items-center gap-3 sm:gap-4 rounded-2xl border border-[#DAD5C7] bg-white px-4 sm:px-5 py-3.5 shadow-sm transition-all hover:border-[#1B6F63]/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6F63]/40"
  >
    <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E2A28] text-white transition-colors group-hover:bg-[#1B6F63]">
      <BookOpen className="h-5 w-5" />
      <span className="absolute -top-1 -end-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping motion-reduce:hidden" />
        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </span>
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-[#1E2A28]">{t("dashboard.connection.apiTitle")}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-[#9BA69F]">{t("dashboard.connection.apiBody")}</p>
    </div>

    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#DCEFEA] px-3 py-2 text-xs font-medium text-[#1B6F63] transition-colors group-hover:bg-[#1B6F63] group-hover:text-white">
      <span className="hidden sm:inline">{t("developer.docs.title")}</span>
      <span className="sm:hidden">{t("dashboard.connection.docs")}</span>
      <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
    </span>
  </Link>
);

/**
 * Which connection card is shown first:
 *  1) a connected Shopify store (the backend publishes there first)
 *  2) an active/pending WordPress connection
 *  3) otherwise WordPress for WordPress sites, Shopify for everything else
 * The user can always switch with the tabs.
 */
const SiteConnectionPanel: React.FC<SiteConnectionPanelProps> = ({ siteId }) => {
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<Platform>("wordpress");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const [siteRes, wpRes, shopifyRes] = await Promise.allSettled([
        siteService.show(siteId),
        wordpressService.show(siteId),
        shopifyService.show(siteId),
      ]);
      if (cancelled) return;

      const site =
        siteRes.status === "fulfilled"
          ? (siteRes.value.data as unknown as { site?: { is_wordpress?: boolean } } | undefined)?.site
          : undefined;
      const wp =
        wpRes.status === "fulfilled"
          ? (wpRes.value.data as unknown as { data?: { status?: string } | null } | undefined)
          : undefined;
      const shopifyConnected = shopifyRes.status === "fulfilled" && !!shopifyRes.value.data?.data;

      if (shopifyConnected) setPlatform("shopify");
      else if (wp?.data?.status && wp.data.status !== "disconnected") setPlatform("wordpress");
      else setPlatform(site?.is_wordpress === false ? "shopify" : "wordpress");

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-[#DAD5C7] bg-white px-5 py-4 text-sm text-[#9BA69F]">
        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
        {t("dashboard.connection.checking")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div role="tablist" aria-label={t("dashboard.connection.platform")} className="flex flex-wrap items-center gap-1.5">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={platform === p.key}
            onClick={() => setPlatform(p.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              platform === p.key ? "bg-[#1B6F63] text-white" : "border border-[#DAD5C7] bg-white text-[#384B43] hover:border-[#1B6F63]/50"
            }`}
          >
            {p.label}
          </button>
        ))}
        {COMING_SOON.map((name) => (
          <span key={name} className="rounded-full border border-dashed border-[#DAD5C7] px-3 py-1.5 text-xs text-[#9BA69F]" title={t("dashboard.connection.comingSoon")}>
            {name} · {t("dashboard.connection.soon")}
          </span>
        ))}
      </div>

      {platform === "wordpress" ? <WordPressConnectionCard siteId={siteId} /> : <ShopifyConnectionCard siteId={siteId} />}

      <ApiDocsLinkCard />
    </div>
  );
};

export default SiteConnectionPanel;
