// src/components/Layout.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import type {
  SidebarArticleItem,
  SidebarConversationItem,
  SidebarSiteItem,
  SidebarView,
  ShopStatus,
} from "./Sidebar";
import { SidebarLayoutProvider } from "../context/SidebarLayoutContext";
import { ArticleChatDock } from "./article-generate/ArticleChatDock";
import type { ChatTargetSelection } from "./article-generate/chatTarget";
import type { Article, ArticleTargetRef } from "../types";
import AnnouncementBanner from "./AnnouncementBanner";
import LanguageSwitcher from "./LanguageSwitcher";
// productArticleService برای لیست مقالات محصول (ProductArticleController@index)
import {
  articleService,
  productArticleService,
  contentChatSessionService,
  siteService,
  subscriptionService,
  authService,
} from "../services/api";
import { t } from "../i18n";

/** پراپ‌های لازم برای نمایش پنل گفتگوی AI مقاله داخل سایدبار.
 *  فقط صفحه‌ی مقاله (ArticleGeneratePage) این‌ها رو پاس می‌ده؛
 *  بقیه‌ی صفحات که Layout رو استفاده می‌کنن نیازی به این پراپ ندارن. */
export interface ArticleChatSidebarProps {
  article: Article;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (target: ChatTargetSelection | null) => void;
  onTargetApplied: (target: ArticleTargetRef) => void;
  onArticleChange: (article: Article) => void;
}

interface LayoutProps {
  children: React.ReactNode;
  activeView: SidebarView;
  onChangeView: (view: SidebarView) => void;
  siteDomain?: string | null;
  siteId?: number | string;
  articleChat?: ArticleChatSidebarProps;
  /** وقتی true باشد، نوار ثابتِ بالای دسکتاپِ Layout (بج پلن) رندر نمی‌شود —
   *  چون صفحه‌ی مقصد خودش بج پلن را داخل نوار اختصاصی‌اش (PublishToWordPressBar)
   *  نمایش می‌دهد و نمی‌خواهیم دو بار تکرار شود. */
  hideDesktopPlanBadge?: boolean;
  /** شناسه‌ی مقاله‌ای که صفحه‌ی صداکننده می‌خواهد به‌عنوان «فعال» در سایدبار
   *  هایلایت شود. بعضی صفحات (مثل ArticleGeneratePage) لزوماً articleId را
   *  در URL ندارند (مثلاً وقتی از روی یک idea تازه در حال ساختِ مقاله‌اند)،
   *  پس این مقدار جایگزینِ چیزی می‌شود که از useParams به‌دست می‌آید.
   *  اگر پاس داده نشود، Layout مثل قبل از پارامترِ مسیر استفاده می‌کند. */
  activeArticleId?: string | number;
  /** هر بار مقدار این پراپ عوض شود، لیست مقالاتِ سایدبار (هم مقالات عادی و
   *  هم مقالات محصول) دوباره از سرور fetch می‌شود — بدون نیاز به رفرش دستیِ
   *  کل صفحه. مثلاً وقتی یک مقاله‌ی جدید ساخته می‌شود یا وضعیتِ تولیدش از
   *  «در حال انجام» به «تمام‌شده» می‌رسد، صفحه‌ی صداکننده این مقدار را
   *  (مثلاً یک شمارنده) افزایش می‌دهد. */
  refreshArticlesKey?: string | number;
  refreshConversationsKey?: string | number;
  activeConversationId?: string | number;
  onSelectConversation?: (conversation: SidebarConversationItem) => void;
  onNewConversation?: () => void;
  /** kind گفتگوهایی که در سایدبار نشان داده می‌شوند. اگر ندهی، گفتگوهای product نمایش داده نمی‌شوند. */
  conversationKind?: string;
  /** وقتی فعال باشد، صفحه‌ی صداکننده تنها scroll container است. */
  disableContentScroll?: boolean;
  /** محتوایی که کنار بج پلن، داخل هدرِ h-14 موبایل نمایش داده می‌شود.
   *  مثلاً دکمه‌ی کوچکِ کنترل وردپرس (WordPressHeaderControl از
   *  PublishToWordPressBar.tsx) که با تپ، منوی اتصال/انتشار/بروزرسانی/حذف
   *  را باز می‌کند. هدفِ این پراپ جلوگیری از ساختنِ یک هدرِ دومِ کاملِ
   *  دیگر (مثل چیزی که قبلاً با embedded روی موبایل رندر می‌شد و باعث
   *  می‌شد دو نوار روی هم بیفتد و فضای زیادی از بالای صفحه گرفته شود).
   *  اگر ندهید، هدر موبایل دقیقاً مثل قبل فقط بج پلن را نشان می‌دهد. */
  mobileHeaderExtra?: React.ReactNode;
}

export const PlanStatusBadge: React.FC<{
  isFreePlan: boolean;
  onUpgrade: () => void;
  size?: "sm" | "md" | "lg";
}> = ({ isFreePlan, onUpgrade, size = "sm" }) => {
  const textSize = size === "lg" ? "text-sm" : size === "md" ? "text-xs" : "text-[11px]";
  const iconSize = size === "lg" ? "w-4 h-4" : size === "md" ? "w-3.5 h-3.5" : "w-3 h-3";
  const padding = size === "lg" ? "pe-4 ps-3 py-1.5" : "pe-2.5 ps-2 py-1";
  const paddingPro = size === "lg" ? "px-4 py-1.5" : "px-2.5 py-1";

  return isFreePlan ? (
    <button
      type="button"
      onClick={onUpgrade}
      className={`flex items-center gap-1.5 ${textSize} font-black text-white bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#9B5CFF] hover:from-[#4935E0] hover:to-[#8A4BF0] active:brightness-95 rounded-full ${padding} shadow-md shadow-[#5B47FB]/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0`}
    >
      <svg className={`${iconSize} shrink-0`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.445a1 1 0 00-1.176 0l-3.367 2.445c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
      </svg>
      {t("layout.plan.upgrade")}
    </button>
  ) : (
    <span className={`flex items-center gap-1.5 ${textSize} font-black text-white bg-[#5B47FB] rounded-full ${paddingPro} shadow-sm shadow-[#5B47FB]/30`}>
      <svg className={`${iconSize} shrink-0`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.445a1 1 0 00-1.176 0l-3.367 2.445c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
      </svg>
      {t("layout.plan.pro")}
    </span>
  );
};

/** دکمه‌ی خروج — همیشه ثابت در گوشه‌ی چپِ بالای صفحه (فارغ از RTL بودن
 *  کل اپ)، هم در موبایل هم در دسکتاپ. با کلیک، یک مودال تاییدِ کوچک باز
 *  می‌شود تا خروج تصادفی رخ ندهد؛ فقط با تایید کاربر واقعاً خارج می‌شود. */
const LogoutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={t("layout.logout.action")}
    title={t("layout.logout.action")}
    className="fixed top-3 end-3 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E5F0] bg-[#FAFAFE]/90 text-[#9A9DB8] shadow-sm backdrop-blur-md transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 active:bg-rose-100 sm:h-10 sm:w-10"
  >
    <svg
      className="h-4 w-4 sm:h-5 sm:w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 17l5-5-5-5M21 12H9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19H6a2 2 0 01-2-2V7a2 2 0 012-2h6"
      />
    </svg>
  </button>
);

/** مودال تایید خروج — روی همه‌چیز (z-[60]) نمایش داده می‌شود تا حتی روی
 *  Drawerِ موبایلِ سایدبار (z-50) هم بیفتد. */
const LogoutConfirmModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({
  onConfirm,
  onCancel,
}) => (
  <div
    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
    onClick={onCancel}
  >
    <div
      className="w-full max-w-xs rounded-2xl bg-[#FAFAFE] p-5 text-center shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </div>
      <h3 className="mt-3 text-sm font-black text-[#0D0F23]">{t("layout.logout.title")}</h3>
      <p className="mt-1 text-xs font-bold text-[#9A9DB8]">
        {t("layout.logout.confirm")}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 flex-1 rounded-xl bg-[#F3F2FB] text-xs font-black text-[#3B3F5C] transition-colors hover:bg-[#E4E5F0]"
        >
          {t("common.actions.cancel")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="h-9 flex-1 rounded-xl bg-rose-500 text-xs font-black text-white transition-colors hover:bg-rose-600"
        >
          {t("layout.logout.action")}
        </button>
      </div>
    </div>
  </div>
);

/** دکمه‌ی toggleِ سایدبار در دسکتاپ — دقیقاً به سبک آیکونِ پنل/سایدبارِ
 *  خودِ Claude: یه دکمه‌ی تخت و ساده (بدون پس‌زمینه‌ی توپر)، فقط با هاور
 *  کمی روشن می‌شود. کنار لبه‌ی سایدبار می‌نشیند و با باز/بسته‌شدنِ آن
 *  جابه‌جا می‌شود. */
const DesktopSidebarToggle: React.FC<{ open: boolean; onToggle: () => void }> = ({
  open,
  onToggle,
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={open ? t("layout.sidebar.close") : t("layout.sidebar.open")}
    title={open ? t("layout.sidebar.close") : t("layout.sidebar.open")}
    className={`hidden lg:flex fixed top-4 z-50 h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F2FB] hover:text-[#0D0F23] transition-all duration-300 ${
      open ? "start-[21rem]" : "start-4"
    }`}
  >
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </svg>
  </button>
);

const Layout: React.FC<LayoutProps> = ({
  children,
  activeView,
  onChangeView,
  siteDomain,
  siteId,
  articleChat,
  hideDesktopPlanBadge = false,
  activeArticleId,
  refreshArticlesKey,
  refreshConversationsKey,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  conversationKind,
  disableContentScroll = false,
  mobileHeaderExtra,
}) => {
  const navigate = useNavigate();
  // اگر مسیر جاری /sites/:siteId/articles/:articleId باشد (یعنی داخل صفحه‌ی
  // یک مقاله‌ی خاص هستیم)، این مقدار پر می‌شود و برای هایلایت‌کردن آیتم فعال
  // در لیست مقالات سایدبار استفاده می‌شود.
  const { articleId: articleIdFromUrl } = useParams();

  // اگر صفحه‌ی صداکننده صریحاً activeArticleId داده باشد (مثل صفحه‌ی تولید
  // مقاله که ممکن است articleId را در URL نداشته باشد، مثلاً هنوز از روی
  // idea در حال ساختِ مقاله است)، همان اولویت دارد؛ وگرنه از پارامتر URL
  // استفاده می‌شود — دقیقاً رفتار قبلی برای بقیه‌ی صفحات حفظ می‌شود.
  const effectiveArticleId = activeArticleId ?? articleIdFromUrl;

  const [articles, setArticles] = useState<SidebarArticleItem[]>([]);
  const [loading, setLoading] = useState(false);

  // مقالات محصول (فقط برای سایت‌های فروشگاهی)
  const [productArticles, setProductArticles] = useState<SidebarArticleItem[]>([]);
  const [productArticlesLoading, setProductArticlesLoading] = useState(false);

  // وضعیت تشخیص فروشگاهی بودن سایت (بر اساس is_shop):
  //  checking → هنوز در حال بررسی (گزینه‌ی سئوی محصولات: غیرفعال + لودینگ)
  //  shop     → فروشگاهی تشخیص داده شد (گزینه فعال)
  //  not_shop → فروشگاهی نیست (گزینه غیرفعال + متن توضیح)
  const [shopStatus, setShopStatus] = useState<ShopStatus>("checking");
  // بقیه‌ی کد (لیست مقالات محصول، تب مقالات محصول و ...) همچنان از همین نام استفاده می‌کنند
  const isWoocommerce = shopStatus === "shop";

  // وردپرسی بودن سایت (بر اساس is_wordpress که از SiteResource می‌آید).
  // فقط برای سایت‌های وردپرسی گزینه‌ی «سئوی صفحه محصول» در سایدبار نمایش
  // داده می‌شود؛ برای بقیه‌ی سایت‌ها فقط «سئوی محصولات» دیده می‌شود.
  const [isWordpress, setIsWordpress] = useState(false);

  const [currentDomain, setCurrentDomain] = useState<string | null>(siteDomain ?? null);
  // باز/بسته بودن پنل چت — این‌جا نگه داشته می‌شود (نه داخل ArticleChatDock)
  // تا Sidebar بتواند بر اساسش اندازه‌ی لیست مقالات را تنظیم کند.
  const [chatOpen, setChatOpen] = useState(true);

  // باز/بسته بودن Sidebar به‌صورت Drawer در موبایل — فقط زیر برک‌پوینت lg اثر دارد،
  // در دسکتاپ Sidebar همیشه دیده می‌شود و این استیت نادیده گرفته می‌شود.
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // باز/بسته بودن Sidebar در دسکتاپ — کاربر می‌تواند با دکمه‌ی toggle آن را
  // جمع کند تا فضای بیشتری برای محتوا آزاد شود. فقط از lg به بالا اثر دارد.
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  // نمایش/عدم‌نمایش مودال تایید خروج — با کلیک روی دکمه‌ی خروج باز می‌شود
  // و فقط با تایید کاربر واقعاً عملیات خروج انجام می‌شود.
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // وضعیت پلن کاربر — برای نمایش دکمه‌ی «ارتقا پلن» (اگر رایگان است)
  // یا بج «Pro» (اگر پلن پولی/فعال دارد)، هم در نوار بالای موبایل
  // و هم در گوشه‌ی بالای صفحه در دسکتاپ.
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [planLoading, setPlanLoading] = useState(true);

  // ── سوییچر دامنه ──
  // لیست همه دامنه‌های کاربر — برای سوییچر داخل سایدبار
  const [sites, setSites] = useState<SidebarSiteItem[]>([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [conversations, setConversations] = useState<SidebarConversationItem[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);

  // ── تشخیص فروشگاهی/وردپرسی بودن سایت (polling روی is_shop) ──
  // منطق:
  //  - is_shop = true                         → "shop" و polling تمام
  //  - آنالیز هنوز در جریان (pending/crawling/analyzing) → "checking" و ادامه‌ی polling
  //  - آنالیز تمام شده (completed/failed/...) و is_shop صریحاً false → فوراً "not_shop"
  //  - آنالیز تمام شده ولی is_shop هنوز null/undefined (بک‌اند هنوز تعیین نکرده)
  //    → چند بار دیگر (کوتاه) صبر می‌کنیم، بعد "not_shop"
  //  - خطای پشت‌سرهم یا پاسخ نامعتبر → بعد از چند بار "not_shop"
  // همزمان با هر پاسخ، is_wordpress هم از همان آبجکت سایت خوانده و در
  // isWordpress ذخیره می‌شود (برای نمایش/عدم‌نمایش «سئوی صفحه محصول»).
  useEffect(() => {
    if (!siteId) {
      setShopStatus("not_shop");
      setIsWordpress(false);
      return;
    }

    setShopStatus("checking");
    setIsWordpress(false);

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let undeterminedAttempts = 0; // بعد از اتمام آنالیز، وقتی is_shop هنوز null است
    let failedRequests = 0; // خطا یا پاسخ بدون سایت

    const POLL_MS = 5000;
    const MAX_UNDETERMINED_ATTEMPTS = 3; // حدود ۱۵ ثانیه مهلت بعد از اتمام آنالیز
    const MAX_FAILED_REQUESTS = 5;
    const IN_PROGRESS = ["pending", "crawling", "analyzing"];

    const toBool = (v: unknown) => v === true || v === 1 || v === "1" || v === "true";
    const isUndetermined = (v: unknown) => v === null || v === undefined;

    const check = async () => {
      try {
        const res = await siteService.show(siteId);
        if (cancelled) return;

        const s = (res.data as any)?.site || (res.data as any)?.data;

        if (!s) {
          failedRequests += 1;
        } else {
          // وردپرسی بودن — قبل از هر return خوانده می‌شود تا در همه‌ی مسیرها
          // (shop / not_shop / در حال بررسی) مقدارش به‌روز باشد.
          setIsWordpress(toBool(s.is_wordpress));

          // ۱) فروشگاهی است → تمام
          if (toBool(s.is_shop)) {
            setShopStatus("shop");
            return;
          }

          // ۲) هنوز آنالیز در جریان است → همچنان «در حال بررسی»
          if (IN_PROGRESS.includes(s.status)) {
            // فقط صبر می‌کنیم
          } else {
            // ۳) آنالیز تمام شده (یا failed) و is_shop صریحاً false → فروشگاهی نیست
            if (s.status === "failed" || !isUndetermined(s.is_shop)) {
              setShopStatus("not_shop");
              return;
            }

            // ۴) آنالیز تمام شده ولی is_shop هنوز تعیین نشده → مهلتِ کوتاه
            undeterminedAttempts += 1;
            if (undeterminedAttempts >= MAX_UNDETERMINED_ATTEMPTS) {
              setShopStatus("not_shop");
              return;
            }
          }
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching site:", err);
        failedRequests += 1;
      }

      if (failedRequests >= MAX_FAILED_REQUESTS) {
        setShopStatus("not_shop");
        return;
      }

      timer = setTimeout(check, POLL_MS);
    };

    check();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [siteId]);

  const fetchSites = async (): Promise<SidebarSiteItem[]> => {
    setSitesLoading(true);
    try {
      const res = await siteService.list(1);
      if (res.success && res.data) {
        const items: SidebarSiteItem[] = (res.data.data ?? []).map((s: any) => ({
          id: s.id,
          domain: s.domain,
          status: s.status,
        }));
        setSites(items);
        return items;
      }
    } catch (err) {
      console.error("Error fetching sites list:", err);
    } finally {
      setSitesLoading(false);
    }
    return [];
  };

  useEffect(() => {
    fetchSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]); // هر بار siteId عوض شد (یعنی رفتیم روی سایت دیگه)، لیست دامنه‌ها هم دوباره fetch می‌شه

  // انتخاب یک دامنه از سوییچر — به داشبورد یا صفحه‌ی تحلیل همان سایت می‌رود
  const handleSelectSite = (site: SidebarSiteItem) => {
    navigate(`/dashboard?site=${site.id}`);
  };

  // حذف دامنه از سوییچر؛ متد destroy در service با DELETE /api/v1/sites/{id}
  // به API متصل می‌شود و بعد از موفقیت، لیست همان لحظه تازه‌سازی می‌گردد.
  const handleDeleteSite = async (site: SidebarSiteItem) => {
    const destroySite = (siteService as typeof siteService & {
      destroy?: (siteId: number | string) => Promise<{ success?: boolean; message?: string }>;
    }).destroy;
    if (!destroySite) {
      throw new Error(t("layout.sites.deleteUnavailable"));
    }
    const response = await destroySite(site.id);
    if (response && response.success === false) {
      throw new Error(response.message || t("layout.sites.deleteFailed"));
    }
    const remainingSites = await fetchSites();
    if (siteId !== undefined && String(siteId) === String(site.id)) {
      const nextSite = remainingSites[0];
      if (nextSite) {
        // با تغییر سایت، state صفحه و تاریخچه گفتگوی سایت قبلی هم با
        // siteId جدید دوباره bootstrap می‌شود و گفتگوی حذف‌شده باقی نمی‌ماند.
        navigate(`/dashboard?site=${nextSite.id}`, { replace: true });
      } else {
        navigate("/dashboard?new=1", { replace: true });
      }
    }
  };

  const handleSelectConversation = onSelectConversation || ((conversation: SidebarConversationItem) => {
    if (siteId) navigate(`/dashboard?site=${siteId}&chat=${conversation.id}`, { state: { openConversation: true } });
  });

  const handleNewConversation = onNewConversation || (() => {
    if (siteId) {
      navigate(`/dashboard?site=${siteId}&new_chat=1`);
    } else {
      // کاربر هنوز هیچ دامنه‌ای ثبت نکرده؛ باید به فلوی افزودن دامنه هدایت شود
      // (همان مسیری که «افزودن دامنه جدید» در SiteSwitcher استفاده می‌کند).
      navigate("/dashboard?new=1", { replace: true });
    }
  });

  const fetchConversations = async () => {
    if (!siteId) {
      setConversations([]);
      return;
    }

    setConversationsLoading(true);
    try {
      const res = await contentChatSessionService.list(siteId);
      if (res.success && res.data) {
        setConversations(
          (res.data.sessions ?? [])
            // اگر conversationKind داده شده فقط همان kind؛ وگرنه همه به‌جز product
            .filter((s) => (conversationKind ? s.kind === conversationKind : s.kind !== "product"))
            .map((session) => ({
              id: session.id,
              kind: session.kind,
              title: session.title,
              last_message_at: session.last_message_at,
            }))
        );
      }
    } catch (err) {
      console.error("[Layout] fetchConversations error:", err);
    } finally {
      setConversationsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, refreshConversationsKey, conversationKind]);

  useEffect(() => {
    (async () => {
      try {
        const res = await subscriptionService.me();
        if (res.success && res.data) {
          setIsFreePlan(res.data.subscription.is_free);
        }
      } catch (err) {
        console.error("Error fetching subscription status:", err);
      } finally {
        setPlanLoading(false);
      }
    })();
  }, []);

  // هر وقت کاربر یک بخش جدید را برای گفتگو انتخاب کند (از هر جای صفحه —
  // درگ‌ودراپ یا دکمه‌ی انتخاب داخل کارت‌های مقاله)، پنل چت خودکار باز شود
  // تا نشانگر بخشِ انتخاب‌شده بالای Input دیده شود، نه در حالت جمع‌شده.
  useEffect(() => {
    if (articleChat?.selectedTarget) {
      setChatOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleChat?.selectedTarget]);

  // دریافت دامنه سایت (اگر siteDomain پاس داده نشده باشد از روی siteId)
  useEffect(() => {
    if (siteDomain) {
      setCurrentDomain(siteDomain);
    } else if (siteId) {
      const fetchDomain = async () => {
        try {
          const res = await siteService.show(siteId);
          if (res.success && res.data) {
            // بک‌اند در show ممکن است سایت را در res.data.site یا res.data.data برگرداند
            const siteData = (res.data as any).site || (res.data as any).data;
            if (siteData?.domain) {
              setCurrentDomain(siteData.domain);
            }
          }
        } catch (err) {
          console.error("Error fetching site domain:", err);
        }
      };
      fetchDomain();
    }
  }, [siteDomain, siteId]);

  const fetchArticles = async () => {
    if (!siteId) return;
    setLoading(true);
    try {
      const res = await articleService.list(siteId);
      const items: SidebarArticleItem[] = (res.data?.data ?? []).map((a: any) => ({
        id: a.id,
        title: a.title,
        status: a.status,
      }));
      setArticles(items);
    } catch (err) {
      console.error("[Layout] fetchArticles error:", err);
    } finally {
      setLoading(false);
    }
  };

  // لیست مقالات دیگر وابسته به activeView نیست: دکمه‌ی «مقالات» در هر صفحه‌ای
  // که باشیم باید بتواند لیست را نشان بدهد، پس همیشه با وجود siteId فچ می‌کنیم.
  // همچنین به refreshArticlesKey گوش می‌دهیم: هر بار صفحه‌ی صداکننده این
  // مقدار را عوض کند (مثلاً وقتی مقاله‌ی جدیدی ساخته می‌شود یا تولیدش تمام
  // می‌شود)، لیست بدون نیاز به رفرش دستیِ کل صفحه دوباره fetch می‌شود.
  useEffect(() => {
    if (siteId) {
      fetchArticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, refreshArticlesKey]);

  // فچ مقالات محصول — فقط وقتی سایت فروشگاهی است (isWoocommerce از shopStatus
  // مشتق می‌شود). برای سایت غیرفروشگاهی هیچ درخواستی ارسال نمی‌شود.
  const fetchProductArticles = async () => {
    if (!siteId || !isWoocommerce) {
      setProductArticles([]);
      return;
    }
    setProductArticlesLoading(true);
    try {
      const res = await productArticleService.list(siteId);
      const items: SidebarArticleItem[] = (res.data?.data ?? []).map((a: any) => ({
        id: a.id,
        title: a.title,
        status: a.status,
      }));
      setProductArticles(items);
    } catch (err) {
      console.error("[Layout] fetchProductArticles error:", err);
    } finally {
      setProductArticlesLoading(false);
    }
  };

  useEffect(() => {
    fetchProductArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, isWoocommerce, refreshArticlesKey]);

  const handleSelectArticle = async (article: SidebarArticleItem) => {
    if (!siteId) return;

    const currentConversationId = activeConversationId ? String(activeConversationId) : null;
    const candidateConversations = conversations.filter((conversation) => String(conversation.id) !== currentConversationId);
    const sessionsToCheck = currentConversationId
      ? [{ id: currentConversationId }, ...candidateConversations]
      : candidateConversations;

    const sessionResponses = await Promise.all(sessionsToCheck.map(async (conversation) => ({
      id: String(conversation.id),
      response: await contentChatSessionService.show(siteId, conversation.id),
    })));
    const owningSession = sessionResponses.find(({ response }) => (
      response.success
      && response.data?.session?.messages?.some((message) => String(message.article_id) === String(article.id))
    ));

    const owningConversationId = owningSession?.id || null;
    if (!owningConversationId) {
      navigate(`/dashboard?site=${siteId}&article=${article.id}`, { state: { openArticle: true } });
      return;
    }

    const params = new URLSearchParams({ site: String(siteId), article: String(article.id) });
    params.set("chat", owningConversationId);
    navigate(`/dashboard?${params.toString()}`, { state: { openArticle: true } });
  };

  // انتخاب یک مقاله‌ی محصول از تبِ «مقالات محصول».
  // id مقاله‌ی محصول از جدول product_articles می‌آید، پس نباید از مسیرِ
  // مقالات عادی (که دنبال گفتگوی صاحب مقاله می‌گردد) رد شود؛ مستقیم به
  // صفحه‌ی سئوی محصولات می‌رود. اگر مسیر صفحه‌ی مقاله‌ی محصول در روتر شما
  // فرق دارد، فقط همین یک خط navigate را عوض کنید.
  const handleSelectProductArticle = (article: SidebarArticleItem) => {
    if (!siteId) return;
    onChangeView("product-seo");
    navigate(`/product-seo?site=${siteId}&article=${article.id}`, { state: { openArticle: true } });
  };

  // ناوبری به داشبورد مقالات همان سایت.
  const handleConnectWordpress = () => {
    onChangeView("articles");
    navigate(siteId ? `/sites/${siteId}/dashboard` : "/sites/dashboard");
  };

  const handleSelectInfo = () => {
    onChangeView("info");
    // هدایت به داشبورد با ارسال شناسه سایت در Query String
    if (siteId) {
      navigate(`/dashboard?site=${siteId}`);
    } else {
      navigate("/dashboard");
    }
  };

  // «پلن‌ها» — همیشه به صفحه‌ی ثابت پلن‌ها/اشتراک هدایت می‌کند،
  // مستقل از siteId (مسیر: /subscription).
  const handleSelectPlans = () => {
    onChangeView("plans");
    navigate("/subscription");
  };

  const handleSelectSupport = () => {
    navigate(siteId ? `/support?site=${siteId}` : "/support");
  };

  const handleSelectProductSeo = () => {
    // فقط وقتی سایت فروشگاهی تشخیص داده شده اجازه‌ی رفتن داریم
    if (shopStatus !== "shop") return;
    onChangeView("product-seo");
    navigate(siteId ? `/product-seo?site=${siteId}` : "/product-seo");
  };

  // خروج واقعی — بعد از تایید در مودال اجرا می‌شود: توکن/اطلاعات نشست
  // پاک می‌شود و کاربر به صفحه‌ی ورود هدایت می‌شود.
  const handleLogout = async () => {
    setLogoutConfirmOpen(false);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      // navigate کافی نیست چون استیت isAuth در App.tsx آپدیت نمی‌شه؛
      // ری‌لود کامل باعث می‌شه authService.isAuthenticated() دوباره
      // از صفر چک بشه و مستقیم بره صفحه‌ی لاگین بدون برگشت به داشبورد.
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-start h-screen overflow-hidden bg-[#F6F6FB] bg-sv-light">
      {/* دکمه‌ی خروج — ثابتِ گوشه‌ی چپِ بالا، مستقل از RTL بودن صفحه،
          هم در موبایل هم در دسکتاپ همیشه دیده می‌شود. */}
      <LogoutButton onClick={() => setLogoutConfirmOpen(true)} />
      {logoutConfirmOpen && (
        <LogoutConfirmModal
          onConfirm={handleLogout}
          onCancel={() => setLogoutConfirmOpen(false)}
        />
      )}

      {/* دکمه‌ی toggle سایدبار — فقط دسکتاپ. کنار لبه‌ی سایدبار می‌چسبد و
          با باز/بسته‌شدنِ آن جابه‌جا می‌شود؛ تنها راهِ بازکردنِ دوباره‌ی
          سایدبار وقتی جمع شده است. */}
      <DesktopSidebarToggle
        open={desktopSidebarOpen}
        onToggle={() => setDesktopSidebarOpen((v) => !v)}
      />

      {/* نوار بالای موبایل — فقط زیر lg دیده می‌شود، شامل دکمه‌ی همبرگری
          برای باز کردن Sidebar به‌صورت Drawer، بج پلن، و هر محتوای اضافه‌ی
          صفحه (mobileHeaderExtra) کنار بج پلن. این تنها هدرِ موبایل است —
          صفحات نباید هدرِ دومِ خودشان را روی موبایل رندر کنند (مثلاً با
          embedded روی PublishToWordPressBar)، وگرنه دو نوار روی هم می‌افتد. */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-[#FAFAFE]/90 backdrop-blur-md border-b border-[#E4E5F0]/70 grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 px-2">
        {/* دکمه‌ی همبرگری — ستون اول Grid، هیچ چیزی روی آن سوار نمی‌شود */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="relative z-10 h-9 w-9 rounded-lg flex items-center justify-center text-[#0D0F23] hover:bg-[#F6F6FB] active:bg-[#E4E5F0] transition-colors"
          aria-label={t("layout.sidebar.openMenu")}
        >
          <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* لوگو + وضعیت پلن + محتوای اضافه‌ی صفحه (مثلاً کنترل وردپرس) —
            ستون وسط، کاملاً مستقل از ستون دکمه. */}
        <div className="flex items-center justify-center gap-2 min-w-0">
          {mobileHeaderExtra}
          {/* نقطه‌ی اتصالِ هدرِ موبایل — هر صفحه‌ای (حتی وقتی embedded است و
              Layout مال والد است) می‌تواند با createPortal دکمه‌ی خودش را
              اینجا، دقیقاً کنار بج پلن، رندر کند؛ بدون نیاز به wiring در والد.
              display:contents یعنی وقتی خالی است هیچ فاصله‌ای نمی‌سازد. */}
          <div id="layout-mobile-header-slot" className="contents" />
          {!planLoading && (
            <PlanStatusBadge
              isFreePlan={isFreePlan}
              onUpgrade={() => navigate("/subscription")}
              size="sm"
            />
          )}
        </div>

        {/* ستون سوم فقط برای تعادل بصری (هم‌عرض دکمه‌ی همبرگری) — خالی.
            دکمه‌ی خروج به‌صورت fixed مستقل رندر می‌شود، پس این ستون همچنان
            خالی می‌ماند تا چیدمانِ وسط‌چینِ لوگو/بج بهم نریزد. */}
        <div />
      </header>

      {/* وضعیت پلن در دسکتاپ — نوارِ ثابتِ سفید هم‌عرض با ستون محتوا. */}
      {!planLoading && !hideDesktopPlanBadge && (
        <div
          className={`hidden lg:flex fixed inset-x-0 top-0 z-40 h-14 items-center justify-center bg-[#FAFAFE]/90 backdrop-blur-md border-b border-[#E4E5F0]/70 transition-all duration-300 ${
            desktopSidebarOpen ? "lg:start-80" : "lg:start-0"
          }`}
        >
          <PlanStatusBadge
            isFreePlan={isFreePlan}
            onUpgrade={() => navigate("/subscription")}
            size="lg"
          />
        </div>
      )}
      {/* Language picker in the top bar, just before the logout button. */}
      <div className="fixed top-3 end-14 z-50 sm:end-16">
        <LanguageSwitcher compact />
      </div>
      <AnnouncementBanner desktopSidebarOpen={desktopSidebarOpen} siteId={siteId} />

      <Sidebar
        siteDomain={currentDomain}
        activeView={activeView}
        onSelectInfo={handleSelectInfo}
        onSelectContentSeo={handleSelectInfo} // برگشت به سئوی محتوایی (چت پیش‌فرض داشبورد)
        onConnectWordpress={handleConnectWordpress}
        onSelectPlans={handleSelectPlans}
        onSelectSupport={handleSelectSupport}
        articles={articles}
        // «سئوی محصولات» برای همه‌ی سایت‌ها در سایدبار هست؛ فعال/غیرفعال بودنش
        // با shopStatus کنترل می‌شود.
        onSelectProductSeo={siteId ? handleSelectProductSeo : undefined}
        shopStatus={shopStatus}
        // «سئوی صفحه محصول» فقط برای سایت‌های وردپرسی نمایش داده می‌شود.
        isWordpress={isWordpress}
        articlesLoading={loading}
        onSelectArticle={handleSelectArticle}
        isWoocommerce={isWoocommerce}
        productArticles={productArticles}
        productArticlesLoading={productArticlesLoading}
        onSelectProductArticle={handleSelectProductArticle}
        conversations={conversations}
        conversationsLoading={conversationsLoading}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        activeArticleId={effectiveArticleId}
        chatOpen={chatOpen}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        desktopOpen={desktopSidebarOpen}
        onDesktopClose={() => setDesktopSidebarOpen(false)}
        sites={sites}
        sitesLoading={sitesLoading}
        activeSiteId={siteId}
        onSelectSite={handleSelectSite}
        onDeleteSite={handleDeleteSite}
        chatPanel={
          articleChat && siteId ? (
            <ArticleChatDock
              siteId={siteId}
              article={articleChat.article}
              selectedTarget={articleChat.selectedTarget}
              onSelectTarget={articleChat.onSelectTarget}
              onTargetApplied={articleChat.onTargetApplied}
              onArticleChange={articleChat.onArticleChange}
              open={chatOpen}
              onToggleOpen={() => setChatOpen((v) => !v)}
              isFreePlan={isFreePlan}
            />
          ) : undefined
        }
      />

      {/* محتوای صفحه — چه در موبایل (هدر h-14) چه در دسکتاپ (نوار وضعیت پلن
          h-14) به‌اندازه‌ی همان نوار ثابتِ بالا فاصله می‌گیرد (pt-14). */}
      <div
        className={`flex-1 min-w-0 min-h-0 h-full ${disableContentScroll ? "overflow-hidden" : "overflow-y-auto"} overflow-x-hidden pt-14 ${hideDesktopPlanBadge ? "lg:pt-0" : ""}`}
        style={{ "--layout-content-right": desktopSidebarOpen ? "20rem" : "0px" } as React.CSSProperties}
      >
        <SidebarLayoutProvider open={desktopSidebarOpen}>{children}</SidebarLayoutProvider>
      </div>
    </div>
  );
};

export default Layout;