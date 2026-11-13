// src/components/Sidebar.tsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { t, tMaybe } from "../i18n";

export type SidebarView = "info" | "articles" | "plans" | "support" | "product-seo" | "page-product-seo" | "past-articles";

/** وضعیت تشخیص فروشگاهی بودن سایت: در حال بررسی / فروشگاهی / غیرفروشگاهی */
export type ShopStatus = "checking" | "shop" | "not_shop";

export interface SidebarArticleItem {
  id: number | string;
  title: string;
  status?: string;
}

export interface SidebarConversationItem {
  id: number | string;
  kind: "analysis" | "chat" | "product";
  title: string;
  last_message_at?: string | null;
}

/** آیتم یک دامنه در سوییچرِ سایدبار */
export interface SidebarSiteItem {
  id: number | string;
  domain: string;
  status?: string;
}

interface SidebarProps {
  siteDomain?: string | null;
  activeView: SidebarView;
  /** @deprecated دیگر استفاده نمی‌شود — برای سازگاری با صفحاتی که هنوز پاس می‌دهند اختیاری نگه داشته شده. */
  onSelectInfo?: () => void;
  /** کلیک روی «سئوی محتوایی» → برگشت به چت/داشبورد پیش‌فرض (مقالات عادی).
   *  برای همه‌ی سایت‌ها (به‌همراه «سئوی محصولات») نشان داده می‌شود. */
  onSelectContentSeo?: () => void;
  /** کلیک روی «اتصال به وردپرس» → صفحه‌ی داشبورد مقالات */
  onConnectWordpress: () => void;
  /** کلیک روی «پلن‌ها» → ناوبری به صفحه‌ی پلن‌ها / اشتراک */
  onSelectPlans: () => void;
  onSelectSupport: () => void;
  /** کلیک روی «سئوی محصولات» → صفحه‌ی ایده‌های سئوی محصولات و گفتگوهای مربوط به آن */
  onSelectProductSeo?: () => void;
  /** کلیک روی «سئوی صفحه محصول» (اختیاری). اگر پاس داده نشود، Sidebar خودش به
   *  /sites/:siteId/page-product-seo می‌رود. رفتارش مثل «سئوی محصولات» به shopStatus وابسته است. */
  onSelectPageProductSeo?: () => void;
  /** وضعیت تشخیص فروشگاهی بودن سایت: در حال بررسی / فروشگاهی / غیرفروشگاهی */
  shopStatus?: ShopStatus;
  /** سایت وردپرسی است؟ فقط برای سایت‌های وردپرسی «سئوی صفحه محصول» نمایش داده می‌شود.
   *  برای سایت غیر وردپرسی فقط «سئوی محصولات» دیده می‌شود. */
  isWordpress?: boolean;
  articles: SidebarArticleItem[];
  articlesLoading?: boolean;
  onSelectArticle?: (article: SidebarArticleItem) => void;

  // ── مقالات محصول (فقط سایت‌های ووکامرسی) ──
  isWoocommerce?: boolean;
  productArticles?: SidebarArticleItem[];
  productArticlesLoading?: boolean;
  onSelectProductArticle?: (article: SidebarArticleItem) => void;

  conversations?: SidebarConversationItem[];
  conversationsLoading?: boolean;
  activeConversationId?: string | number;
  onSelectConversation?: (conversation: SidebarConversationItem) => void;
  onNewConversation?: () => void;
  /** شناسه‌ی مقاله‌ای که هم‌اکنون در حال نمایش است (برای هایلایت آیتم فعال) */
  activeArticleId?: string | number;
  /** پنل گفتگوی AI مقاله (اختیاری) — فقط در دسکتاپ نمایش داده می‌شود. */
  chatPanel?: React.ReactNode;
  chatOpen?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  desktopOpen?: boolean;
  onDesktopClose?: () => void;

  // ── سوییچر دامنه ──
  sites?: SidebarSiteItem[];
  sitesLoading?: boolean;
  activeSiteId?: number | string;
  onSelectSite?: (site: SidebarSiteItem) => void;
  onDeleteSite?: (site: SidebarSiteItem) => Promise<void> | void;
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-[#EFEDFF] text-[#5B47FB]",
  draft: "bg-[#EDE3CF] text-[#B08D57]",
  pending: "bg-[#E4E5F0] text-[#9A9DB8]",
};

function StatusDot({ status }: { status?: string }) {
  const cls = STATUS_STYLES[status ?? ""] ?? "bg-[#E4E5F0] text-[#9A9DB8]";
  return <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cls.split(" ")[0]}`} />;
}

// ── استایل مشترک دکمه‌های منو ───────────────────────────────────────────────

const navBtnBase =
  "w-full flex items-center gap-2.5 text-start rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200";
// Active item: soft violet pill with the sevof gradient bar on the leading edge.
const navBtnActive =
  "relative bg-[#EFEDFF] text-[#5B47FB] border border-[#5B47FB]/15 shadow-sv before:absolute before:start-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-full before:bg-sv-gradient";
const navBtnIdle = "text-[#3B3F5C] hover:bg-[#F6F6FB] hover:text-[#0D0F23] border border-transparent";

// ── دکمه‌ی منوی وابسته به فروشگاهی بودن سایت ─────────────────────────────────
// سه حالت: در حال بررسی (غیرفعال + لودینگ) / فروشگاهی (فعال) / غیرفروشگاهی (غیرفعال).

/** بج «جدید» برای قابلیت‌های تازه */
const NewBadge: React.FC = () => (
  <span className="relative shrink-0">
    <span className="absolute -top-0.5 -end-0.5 flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F97316] opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EA580C]" />
    </span>
    <span className="inline-flex items-center rounded-full bg-gradient-to-r rtl:bg-gradient-to-l from-[#F97316] to-[#F59E0B] px-2 py-0.5 text-[10px] font-black leading-none text-white shadow-sm shadow-[#F97316]/40 animate-pulse">
      {t("layout.nav.newBadge")}
    </span>
  </span>
);

const ShopGatedNavButton: React.FC<{
  label: string;
  iconPath: string;
  active: boolean;
  shopStatus: ShopStatus;
  onClick: () => void;
  isNew?: boolean;
}> = ({ label, iconPath, active, shopStatus, onClick, isNew }) => (
  <button
    type="button"
    disabled={shopStatus !== "shop"}
    aria-busy={shopStatus === "checking"}
    onClick={shopStatus === "shop" ? onClick : undefined}
    aria-current={active ? "page" : undefined}
    className={`${navBtnBase} ${
      shopStatus !== "shop"
        ? "text-[#9A9DB8] border border-transparent opacity-70 cursor-not-allowed"
        : active
          ? navBtnActive
          : navBtnIdle
    }`}
  >
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
    </svg>
    <span className="flex-1 min-w-0 truncate">{label}</span>

    {/* در حال بررسی: لودینگ */}
    {shopStatus === "checking" && (
      <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-bold text-[#9A9DB8]">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#E4E5F0] border-t-[#5B47FB]" />
        {t("layout.nav.checking")}
      </span>
    )}

    {isNew && shopStatus === "shop" && <NewBadge />}
  </button>
);

const PRODUCT_SEO_ICON =
  "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z";

const PAGE_PRODUCT_SEO_ICON =
  "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z";

// ── سوییچر دامنه ──────────────────────────────────────────────────────────

const SITE_STATUS_DOT: Record<string, string> = {
  pending: "bg-[#E4E5F0]",
  crawling: "bg-[#B08D57] animate-pulse",
  analyzing: "bg-[#B08D57] animate-pulse",
  completed: "bg-[#5B47FB]",
  failed: "bg-[#B3453A]",
};

const SiteSwitcher: React.FC<{
  currentDomain?: string | null;
  sites: SidebarSiteItem[];
  sitesLoading?: boolean;
  activeSiteId?: number | string;
  onSelectSite?: (site: SidebarSiteItem) => void;
  onDeleteSite?: (site: SidebarSiteItem) => Promise<void> | void;
}> = ({ currentDomain, sites, sitesLoading, activeSiteId, onSelectSite, onDeleteSite }) => {
  const [open, setOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<SidebarSiteItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={boxRef} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 min-w-0 text-start"
      >
        <div className="h-9 w-9 rounded-[11px] flex items-center justify-center shadow-sv-cta shrink-0 overflow-hidden">
          <img src="/logo.svg" alt="Sevof" className="h-full w-full object-contain" />
        </div>
        {currentDomain ? (
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-[#9A9DB8] font-extrabold">{t("layout.sites.active")}</p>
            <p dir="ltr" className="text-sm font-extrabold text-[#0D0F23] truncate">{currentDomain}</p>
          </div>
        ) : (
          <p className="text-xs font-bold text-[#9A9DB8] flex-1">{t("layout.sites.none")}</p>
        )}
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-[#9A9DB8] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute start-0 top-full mt-2 w-72 rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE] shadow-xl z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1.5">
            {sitesLoading && (
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="h-3 w-3 border-2 border-[#E4E5F0] border-t-[#5B47FB] rounded-full animate-spin" />
                <p className="text-xs text-[#9A9DB8]">{t("common.status.loading")}</p>
              </div>
            )}
            {!sitesLoading && sites.length === 0 && (
              <p className="text-xs text-[#9A9DB8] px-3 py-2.5">{t("layout.sites.empty")}</p>
            )}
            {!sitesLoading && sites.map((s) => {
              const isActive = activeSiteId !== undefined && String(s.id) === String(activeSiteId);
              return (
                <div
                  key={s.id}
                  className={`w-full flex items-center gap-2 text-start px-3 py-2.5 text-xs transition-colors duration-150 ${
                    isActive ? "bg-[#EFEDFF] text-[#5B47FB] font-bold" : "text-[#3B3F5C] hover:bg-[#F6F6FB]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => { onSelectSite?.(s); setOpen(false); }}
                    className="flex min-w-0 flex-1 items-center gap-2 text-start"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${SITE_STATUS_DOT[s.status ?? ""] ?? "bg-[#E4E5F0]"}`} />
                    <span dir="ltr" className="truncate flex-1">{s.domain}</span>
                  </button>
                  {s.status && (
                    <span className="text-[9px] text-[#9A9DB8] shrink-0">
                      {tMaybe(`layout.siteStatus.${s.status}`, s.status)}
                    </span>
                  )}
                  {onDeleteSite && (
                    <button
                      type="button"
                      aria-label={t("layout.sites.removeAria", { domain: s.domain })}
                      title={t("layout.sites.remove")}
                      disabled={deletingId !== null}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteError(null);
                        setDeleteCandidate(s);
                      }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#B3453A] transition-colors hover:bg-[#F7EEEA] hover:text-[#8E332A] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.4}
                          d="M6 7.5h12m-9 0V5.25A1.25 1.25 0 0110.25 4h3.5A1.25 1.25 0 0115 5.25V7.5m-7.5 0v11.25A1.25 1.25 0 008.75 20h6.5A1.25 1.25 0 0016.5 18.75V7.5m-6 3v6m3-6v6"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {deleteCandidate && onDeleteSite && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
              onClick={() => deletingId === null && setDeleteCandidate(null)}
            >
              <div
                className="w-full max-w-xs rounded-2xl bg-[#FAFAFE] p-5 text-center shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M6 7.5h12m-9 0V5.25A2.25 2.25 0 0111.25 3h1.5A2.25 2.25 0 0115 5.25V7.5m-7.5 0v11.25A2.25 2.25 0 009.75 21h4.5a2.25 2.25 0 002.25-2.25V7.5m-6 3v6m3-6v6"
                    />
                  </svg>
                </div>
                <h3 className="mt-3 text-sm font-black text-[#0D0F23]">{t("layout.sites.removeTitle")}</h3>
                <p className="mt-1 text-xs font-bold text-[#9A9DB8]">{t("layout.sites.removeConfirm")}</p>
                <p dir="ltr" className="mt-2 truncate text-xs font-black text-[#B3453A]">{deleteCandidate.domain}</p>
                {deleteError && <p className="mt-2 text-[10px] font-bold text-[#B3453A]">{deleteError}</p>}
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setDeleteCandidate(null)} disabled={deletingId !== null} className="h-9 flex-1 rounded-xl bg-[#F3F2FB] text-xs font-black text-[#3B3F5C] transition-colors hover:bg-[#E4E5F0] disabled:opacity-50">{t("common.actions.cancel")}</button>
                  <button
                    type="button"
                    disabled={deletingId !== null}
                    onClick={async () => {
                      setDeletingId(deleteCandidate.id);
                      try {
                        await onDeleteSite(deleteCandidate);
                        setDeleteCandidate(null);
                      } catch (error) {
                        setDeleteError(error instanceof Error ? error.message : t("layout.sites.deleteFailed"));
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                    className="flex h-9 flex-1 items-center justify-center gap-1 rounded-xl bg-rose-500 text-xs font-black text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
                  >
                    {deletingId !== null && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                    {t("layout.sites.removeConfirmButton")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-[#E4E5F0] p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/dashboard?new=1", { replace: true });
              }}
              className="group flex w-full items-center gap-2.5 rounded-xl border border-dashed border-[#5B47FB]/40 bg-[#F7F6FF] px-3 py-2.5 text-start transition-all duration-150 hover:border-[#5B47FB] hover:bg-[#EFEDFF]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5B47FB] text-white transition-transform duration-150 group-hover:scale-105">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-black text-[#5B47FB]">{t("layout.sites.add")}</span>
                <span className="block truncate text-[10px] font-medium text-[#6C7193]">{t("layout.sites.addHint")}</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sidebar اصلی ─────────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({
  siteDomain,
  activeView,
  onSelectContentSeo,
  onConnectWordpress,
  onSelectPlans,
  onSelectSupport,
  onSelectProductSeo,
  onSelectPageProductSeo,
  shopStatus = "shop",
  isWordpress = false,
  articles,
  articlesLoading,
  onSelectArticle,
  isWoocommerce = false,
  productArticles = [],
  productArticlesLoading = false,
  onSelectProductArticle,
  conversations = [],
  conversationsLoading = false,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  activeArticleId,
  chatPanel,
  chatOpen = true,
  mobileOpen = false,
  onMobileClose,
  desktopOpen = true,
  onDesktopClose,
  sites = [],
  sitesLoading = false,
  activeSiteId,
  onSelectSite,
  onDeleteSite,
}) => {
  const [conversationsOpen, setConversationsOpen] = useState(true);
  const [articlesModalOpen, setArticlesModalOpen] = useState(false);

  const navigate = useNavigate();
  const { siteId: routeSiteId } = useParams();
  const { pathname } = useLocation();

  const withMobileClose = (fn: () => void) => () => {
    fn();
    onMobileClose?.();
  };

  const totalArticlesCount = articles.length + (isWoocommerce ? productArticles.length : 0);

  // دو حالت «سئوی محتوایی» / «سئوی محصولات» برای همه‌ی سایت‌ها نمایش داده می‌شود
  // (دیگر به ووکامرسی بودن وابسته نیست). فعال/غیرفعال بودنِ «سئوی محصولات» و
  // «سئوی صفحه محصول» با shopStatus کنترل می‌شود.
  const showSeoModes = !!onSelectContentSeo && !!onSelectProductSeo;

  // «سئوی صفحه محصول» به Layout وابسته نیست:
  //  - اگر onSelectPageProductSeo پاس داده نشود، خودِ Sidebar با شناسه‌ی سایت (پراپ یا آدرس) ناوبری می‌کند.
  //  - فعال بودن آیتم از روی آدرس هم تشخیص داده می‌شود، نه فقط activeView.
  const pageProductSeoSiteId = activeSiteId ?? routeSiteId;
  const goPageProductSeo =
    onSelectPageProductSeo ??
    (pageProductSeoSiteId !== undefined
      ? () => navigate(`/sites/${pageProductSeoSiteId}/page-product-seo`)
      : undefined);
  const onPageProductSeoRoute = pathname.endsWith("/page-product-seo");

  // «سئوی صفحه محصول» فقط برای سایت‌های وردپرسی نمایش داده می‌شود.
  // (سایت غیر وردپرسی → فقط «سئوی محصولات» دیده می‌شود.)
  const showPageProductSeo = isWordpress && !!goPageProductSeo;

  // «آپدیت مقاله‌های گذشته»: صفحه‌ی مستقل هر سایت؛ فعال بودنش از روی آدرس هم تشخیص داده می‌شود
  const onPastArticlesRoute = pathname.endsWith("/past-articles");

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 start-0 z-50 h-dvh w-60
          lg:sticky lg:top-0 lg:z-auto lg:h-screen
          ${desktopOpen ? "lg:w-80" : "lg:w-0 lg:border-e-0 lg:overflow-hidden"}
          shrink-0 flex flex-col bg-white bg-sv-light border-e border-[#E4E5F0]
          transform transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "max-lg:-translate-x-full max-lg:rtl:translate-x-full"}
        `}
      >
        {/* Brand / domain header */}
        <div className="shrink-0 px-4 pt-5 pb-4 border-b border-[#E4E5F0] flex items-center justify-between gap-2">
          <SiteSwitcher
            currentDomain={siteDomain}
            sites={sites}
            sitesLoading={sitesLoading}
            activeSiteId={activeSiteId}
            onSelectSite={onSelectSite}
            onDeleteSite={onDeleteSite}
          />

          <button
            type="button"
            onClick={() => {
              onMobileClose?.();
              onDesktopClose?.();
            }}
            className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-[#9A9DB8] hover:bg-[#F6F6FB] hover:text-[#3B3F5C] transition-colors"
            aria-label={t("layout.sidebar.closeMenu")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* گفتگوی جدید */}
        {onNewConversation && (
          <div className="shrink-0 px-3 pt-3">
            <button
              type="button"
              onClick={withMobileClose(() => onNewConversation())}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B47FB] px-3 py-2.5 text-sm font-black text-white shadow-sv-cta transition-all hover:-translate-y-0.5 hover:bg-[#4935E0] active:translate-y-0 active:bg-[#2A1F7A]"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>{t("layout.nav.newChat")}</span>
            </button>
          </div>
        )}

        {/* Nav */}
        <nav
          className={`px-3 py-4 space-y-1 flex-1 overflow-y-auto ${
            chatPanel && chatOpen ? "lg:flex-none lg:shrink-0 lg:max-h-[42vh]" : ""
          }`}
        >
          {/* اتوماسیون / اتصال به وردپرس */}
          <button
            type="button"
            onClick={withMobileClose(onConnectWordpress)}
            className={`${navBtnBase} ${activeView === "articles" && !activeArticleId && !onPastArticlesRoute ? navBtnActive : navBtnIdle}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
            <span>{t("layout.nav.automation")}</span>
          </button>

          {/* آپدیت مقاله‌های گذشته — مقاله‌هایی که قبلاً روی سایت بوده‌اند */}
          {pageProductSeoSiteId !== undefined && (
            <button
              type="button"
              onClick={withMobileClose(() => navigate(`/sites/${pageProductSeoSiteId}/past-articles`))}
              aria-current={activeView === "past-articles" || onPastArticlesRoute ? "page" : undefined}
              className={`${navBtnBase} ${activeView === "past-articles" || onPastArticlesRoute ? navBtnActive : navBtnIdle}`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span className="flex-1 min-w-0 truncate">{t("growth.past.title")}</span>
              <NewBadge />
            </button>
          )}

          {/* ── حالت‌های سئو ──
              «سئوی محتوایی» (پیش‌فرض) همیشه فعال است. «سئوی محصولات» برای همه‌ی
              سایت‌ها نمایش داده می‌شود و «سئوی صفحه محصول» فقط برای سایت‌های
              وردپرسی. هر دو با shopStatus کنترل می‌شوند: در حال بررسی
              (غیرفعال + لودینگ) / فروشگاهی (فعال) /
              غیرفروشگاهی (غیرفعال + یک متن توضیحی زیر دکمه‌ها). */}
          {showSeoModes && (
            <>
              {/* سئوی محتوایی — برگشت به چت پیش‌فرض (مقالات عادی) */}
              <button
                type="button"
                onClick={withMobileClose(onSelectContentSeo!)}
                aria-current={activeView === "info" && !onPageProductSeoRoute ? "page" : undefined}
                className={`${navBtnBase} ${activeView === "info" && !onPageProductSeoRoute ? navBtnActive : navBtnIdle}`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                <span className="flex-1 min-w-0 truncate">{t("layout.nav.contentSeo")}</span>
              </button>

              {/* سئوی محصولات — برای همه‌ی سایت‌ها */}
              <ShopGatedNavButton
                label={t("layout.nav.productSeo")}
                iconPath={PRODUCT_SEO_ICON}
                active={activeView === "product-seo"}
                shopStatus={shopStatus}
                onClick={withMobileClose(onSelectProductSeo!)}
              />

              {/* سئوی صفحه محصول — فقط برای سایت‌های وردپرسی. رفتارش دقیقاً مثل
                  «سئوی محصولات» است (به shopStatus وابسته است). */}
              {showPageProductSeo && (
                <ShopGatedNavButton
                  label={t("layout.nav.productPageSeo")}
                  iconPath={PAGE_PRODUCT_SEO_ICON}
                  active={activeView === "page-product-seo" || onPageProductSeoRoute}
                  shopStatus={shopStatus}
                  onClick={withMobileClose(goPageProductSeo!)}
                  isNew
                />
              )}

              {/* غیرفروشگاهی: متن کوتاه زیر دکمه‌ها */}
              {shopStatus === "not_shop" && (
                <p className="mx-3 mb-1 text-[11px] font-bold leading-5 text-[#B3453A]">
                  {t("layout.nav.notShop")}
                </p>
              )}
            </>
          )}

          {/* پلن‌ها */}
          <button
            type="button"
            onClick={withMobileClose(onSelectPlans)}
            className={`${navBtnBase} ${activeView === "plans" ? navBtnActive : navBtnIdle}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75v10.5A2.25 2.25 0 005.25 19.5z"
              />
            </svg>
            <span>{t("layout.nav.plans")}</span>
          </button>

          {/* پشتیبانی */}
          <button
            type="button"
            onClick={withMobileClose(onSelectSupport)}
            className={`${navBtnBase} ${activeView === "support" ? navBtnActive : navBtnIdle}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            <span>{t("layout.nav.support")}</span>
          </button>


          {/* مقالات */}
          <button
            type="button"
            onClick={withMobileClose(() => setArticlesModalOpen(true))}
            className="w-full flex items-center justify-between text-start rounded-xl px-3 py-2.5 text-sm font-bold text-[#0D0F23] hover:bg-[#F6F6FB] border border-transparent transition-all duration-200"
            aria-haspopup="dialog"
            aria-expanded={articlesModalOpen}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-1.519-2.121L12 17.25m-1.519-2.121L9 12.75m9.75-7.5v13.125c0 .621-.504 1.125-1.125 1.125H6.375A1.125 1.125 0 015.25 18.375V5.625c0-.621.504-1.125 1.125-1.125h6.61c.298 0 .584.119.795.33l4.115 4.115c.211.211.33.497.33.795z" />
              </svg>
              <span className="truncate">{t("layout.nav.articles")}</span>
              {totalArticlesCount > 0 && (
                <span className="text-[10px] font-black text-[#5B47FB] bg-[#EFEDFF]/70 rounded-full px-1.5 py-0.5 leading-none">
                  {totalArticlesCount}
                </span>
              )}
            </span>
            <svg className="w-3.5 h-3.5 shrink-0 text-[#9A9DB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75l2.25 2.25L15 11.25M4.5 6.75h15M4.5 17.25h15M6.75 3.75h10.5A2.25 2.25 0 0119.5 6v12a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V6a2.25 2.25 0 012.25-2.25z" />
            </svg>
          </button>

          {/* گفتگوها */}
          <div className="mt-2 border-t border-[#E4E5F0] pt-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setConversationsOpen((v) => !v)}
                className="flex min-w-0 flex-1 items-center justify-between rounded-xl px-3 py-2.5 text-start text-sm font-bold text-[#0D0F23] transition-all duration-200 hover:bg-[#F6F6FB]"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3.75h5.25m-8.25 5.25l-1.5 3 3.75-1.5h8.25A3.75 3.75 0 0018.75 15V6.75A3.75 3.75 0 0015 3H9A3.75 3.75 0 005.25 6.75v6.75c0 1.36.724 2.55 1.81 3.2z" />
                  </svg>
                  <span className="truncate">{t("layout.nav.conversations")}</span>
                  {conversations.length > 0 && (
                    <span className="text-[10px] font-black text-[#5B47FB] bg-[#EFEDFF]/70 rounded-full px-1.5 py-0.5 leading-none">
                      {conversations.length}
                    </span>
                  )}
                </span>
                <svg className={`h-3.5 w-3.5 shrink-0 text-[#9A9DB8] transition-transform duration-200 ${conversationsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {conversationsOpen && (
              <div className="ms-3 ps-3 border-s-2 border-[#E4E5F0] space-y-0.5 py-1 mt-1">
                {conversationsLoading && (
                  <div className="flex items-center gap-2 px-2 py-2.5">
                    <div className="h-3 w-3 border-2 border-[#E4E5F0] border-t-[#5B47FB] rounded-full animate-spin" />
                    <p className="text-xs text-[#9A9DB8]">{t("common.status.loading")}</p>
                  </div>
                )}
                {!conversationsLoading && conversations.length === 0 && (
                  <p className="text-xs text-[#9A9DB8] px-2 py-2.5">{t("layout.nav.noConversations")}</p>
                )}
                {!conversationsLoading && conversations.map((conversation) => {
                  const isActive = activeConversationId !== undefined && String(conversation.id) === String(activeConversationId);
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={withMobileClose(() => onSelectConversation?.(conversation))}
                      title={conversation.title}
                      className={`w-full truncate rounded-lg px-2 py-2 text-start text-xs transition-colors duration-150 ${isActive ? "bg-[#EFEDFF] text-[#5B47FB] font-bold" : "text-[#3B3F5C] hover:bg-[#F6F6FB] hover:text-[#0D0F23]"}`}
                    >
                      <span className="truncate">{conversation.title || t("layout.nav.untitledConversation")}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* پنل چت — فقط دسکتاپ */}
        {chatPanel && (
          <div
            className={`hidden lg:flex lg:flex-col border-t border-[#E4E5F0] ${
              chatOpen ? "lg:min-h-0 lg:flex-1" : "lg:shrink-0"
            }`}
          >
            {chatPanel}
          </div>
        )}
      </aside>

      {articlesModalOpen && (
        <ArticlesModal
          articles={articles}
          articlesLoading={articlesLoading}
          productArticles={productArticles}
          productArticlesLoading={productArticlesLoading}
          showProductTab={isWoocommerce}
          activeView={activeView}
          activeArticleId={activeArticleId}
          onSelectArticle={(article) => {
            setArticlesModalOpen(false);
            onSelectArticle?.(article);
          }}
          onSelectProductArticle={(article) => {
            setArticlesModalOpen(false);
            onSelectProductArticle?.(article);
          }}
          onClose={() => setArticlesModalOpen(false)}
        />
      )}
    </>
  );
};

type ArticlesTab = "articles" | "products";

function ArticlesModal({
  articles,
  articlesLoading = false,
  productArticles = [],
  productArticlesLoading = false,
  showProductTab = false,
  activeView,
  activeArticleId,
  onSelectArticle,
  onSelectProductArticle,
  onClose,
}: {
  articles: SidebarArticleItem[];
  articlesLoading?: boolean;
  productArticles?: SidebarArticleItem[];
  productArticlesLoading?: boolean;
  showProductTab?: boolean;
  activeView: SidebarView;
  activeArticleId?: string | number;
  onSelectArticle: (article: SidebarArticleItem) => void;
  onSelectProductArticle: (article: SidebarArticleItem) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<ArticlesTab>(
    showProductTab && activeView === "product-seo" ? "products" : "articles"
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const isProductTab = showProductTab && tab === "products";
  const items = isProductTab ? productArticles : articles;
  const loading = isProductTab ? productArticlesLoading : articlesLoading;
  const handleSelect = isProductTab ? onSelectProductArticle : onSelectArticle;

  const isActiveItem = (id: string | number) => {
    if (activeArticleId === undefined) return false;
    const onProductPage = activeView === "product-seo";
    if (isProductTab !== onProductPage) return false;
    return String(id) === String(activeArticleId);
  };

  const tabs: { key: ArticlesTab; label: string; count: number }[] = [
    { key: "articles", label: t("layout.articles.standardTab"), count: articles.length },
    { key: "products", label: t("layout.articles.productTab"), count: productArticles.length },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0D0F23]/45 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="articles-modal-title"
        className="flex max-h-[min(80vh,42rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#E4E5F0] bg-[#FAFAFE] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E4E5F0] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id="articles-modal-title" className="text-base font-black text-[#0D0F23]">{t("layout.articles.title")}</h2>
            <p className="mt-1 text-xs font-medium text-[#9A9DB8]">{t("layout.articles.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#9A9DB8] transition-colors hover:bg-[#F6F6FB] hover:text-[#0D0F23]"
            aria-label={t("layout.articles.close")}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {showProductTab && (
          <div role="tablist" className="flex gap-1 border-b border-[#E4E5F0] px-4 pt-3 sm:px-5">
            {tabs.map((t) => {
              const selected = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(t.key)}
                  className={`-mb-px flex items-center gap-2 rounded-t-xl border-b-2 px-4 py-2.5 text-xs font-black transition-colors ${
                    selected
                      ? "border-[#5B47FB] text-[#5B47FB]"
                      : "border-transparent text-[#9A9DB8] hover:text-[#0D0F23]"
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                      selected ? "bg-[#EFEDFF] text-[#5B47FB]" : "bg-[#F3F2FB] text-[#9A9DB8]"
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-12 text-xs font-bold text-[#9A9DB8]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E4E5F0] border-t-[#5B47FB]" />
              {t("layout.articles.loading")}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#E4E5F0] bg-white/60 px-4 py-12 text-center">
              <p className="text-sm font-bold text-[#6C7193]">
                {isProductTab ? t("layout.articles.emptyProducts") : t("layout.articles.empty")}
              </p>
              <p className="mt-1 text-xs text-[#9A9DB8]">{t("layout.articles.emptyHint")}</p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="space-y-2">
              {items.map((article) => {
                const isActive = isActiveItem(article.id);
                return (
                  <button
                    key={`${tab}-${article.id}`}
                    type="button"
                    onClick={() => handleSelect(article)}
                    title={article.title}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-colors ${
                      isActive
                        ? "border-[#5B47FB]/30 bg-[#EFEDFF] text-[#4935E0]"
                        : "border-[#E8E3D8] bg-white text-[#0D0F23] hover:border-[#C8C0FF] hover:bg-[#F7F6FF]"
                    }`}
                  >
                    <StatusDot status={article.status} />
                    <span className="min-w-0 flex-1 truncate text-sm font-bold">{article.title}</span>
                    {article.status && (
                      <span className="shrink-0 text-[10px] font-bold text-[#9A9DB8]">{article.status}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;