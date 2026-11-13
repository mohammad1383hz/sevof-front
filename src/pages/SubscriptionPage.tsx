import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { subscriptionService, discountService } from "../services/api";
import type {
  Plan,
  PlanPeriod,
  BillingPeriodMonths,
  SubscriptionUsageStats,
  SubscriptionUsageStatsActive,
  ExitSurveyReason,
  ExitSurveyTrigger,
  DiscountInfo,
} from "../services/api";
import { usePageVisitLogger } from "../hooks/usePageVisitLogger";
import ExitSurveyModal from "../components/ExitSurveyModal";
import DiscountBanner from "../components/DiscountBanner";
import { t, formatNumber as fmtNumber, formatDate } from "../i18n";
import { tx } from "../i18n/rich";
import TrustBadge from "../components/TrustBadge";
import ChartShowcase from "../components/ChartShowcase";

/** فرمت ساده‌ی عدد به هزارگان فارسی */
const formatNumber = (n: number) => fmtNumber(Math.round(n));
const formatPercent = (n: number) => fmtNumber(Math.round(n) / 100, { style: "percent" });

/** قیمت دیتابیس ریال هست؛ تبدیل به تومان (تقسیم بر ۱۰) */
/** Plans are sold in one currency (Stripe); keep in sync with STRIPE_CURRENCY on the backend. */
const PRICE_CURRENCY = "USD";

/** API prices are integer cents. */
const fromCents = (cents: number) => cents / 100;
/** "$29" / "29,00 $" in the UI locale. */
const money = (amount: number) =>
  fmtNumber(amount, { style: "currency", currency: PRICE_CURRENCY, minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2 });
/** Big price number without the currency sign (the sign is shown next to it). */
const priceNumber = (amount: number) => fmtNumber(amount, { minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2 });

/**
 * برخی endpoint ها (مثل ثبت exit-survey) فقط expires_at رو برمی‌گردونن و
 * seconds_left رو حساب نمی‌کنن (برخلاف /discounts/me که خودش حسابش می‌کنه).
 * برای اینکه تایمر همیشه درست کار کنه، اگه seconds_left نبود، خودمون از
 * روی expires_at حسابش می‌کنیم.
 */
const withSecondsLeft = (discount: DiscountInfo): DiscountInfo => {
  if (discount.seconds_left != null) return discount;
  if (!discount.expires_at) return discount;

  const secondsLeft = Math.max(
    0,
    Math.round((new Date(discount.expires_at).getTime() - Date.now()) / 1000)
  );

  return { ...discount, seconds_left: secondsLeft };
};

/* ------------------------------------------------------------------ */
/* آیکون‌ها                                                            */
/* ------------------------------------------------------------------ */

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="10" cy="10" r="10" className="fill-[#EFEDFF]" />
    <path
      d="M6 10.2l2.4 2.4L14 7.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon: React.FC = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 rtl:-scale-x-100">
    <path
      d="M12.5 15L7.5 10L12.5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M10 6v4.2l2.8 1.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M11 2.5L4 11.5h4.5L9 17.5L16 8H11.5L11 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="currentColor"
      fillOpacity="0.15"
    />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M5 5l10 10M15 5L5 15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* بنرهای وضعیت اشتراک: کردیت رو به اتمام / پلن بعدی رزرو شده           */
/* ------------------------------------------------------------------ */

/**
 * وقتی کاربر یک اشتراک active داره و کردیتش داره تموم می‌شه (پیش‌فرض:
 * ≥۸۰٪ مصرف‌شده، یعنی ≤۲۰٪ باقی‌مونده)، این بنر نشونش می‌ده و کاربر رو
 * به سمت کارت‌های پلن هدایت می‌کنه تا از همین الان پلن بعدی رو بخره.
 * خرید در این حالت به‌خاطر منطق بک‌اند فوری فعال نمی‌شه؛ فقط رزرو (queued)
 * می‌شه و بعد از اتمام پلن فعلی خودکار فعال می‌شه.
 */
const LowCreditBanner: React.FC<{ percentage: number; onCta: () => void }> = ({
  percentage,
  onCta,
}) => {
  const remaining = Math.max(0, 100 - percentage);
  return (
    <div className="mb-4 flex flex-col items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5 sm:items-center">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <BoltIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[12.5px] font-bold text-amber-800 sm:text-[13px]">
            {t("billing.lowCredit.title")}
          </p>
          <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-amber-700 sm:text-[11.5px]">
            {t("billing.lowCredit.body", { percent: formatPercent(remaining) })}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onCta}
        className="h-10 w-full shrink-0 rounded-xl bg-amber-600 px-4 text-[12px] font-bold text-white transition-colors hover:bg-amber-700 sm:w-auto"
      >
        {t("billing.lowCredit.cta")}
      </button>
    </div>
  );
};

/**
 * وقتی کاربر از قبل یک پلن بعدی خریده (status=queued در بک‌اند)، این بنر
 * بهش اطمینان می‌ده که کارش تمومه و نیازی به اقدام دیگه‌ای نیست.
 * مقدار کردیتِ همون پلنِ خریداری‌شده رو هم نشون می‌ده — چون قبل از این،
 * کاربر بعد از خرید هیچ‌جا نمی‌دید کردیتی که پول‌شو داده کجا رفته؛ اینجا
 * صراحتاً می‌گیم کردیت خریداری شده و منتظر فعال‌سازیه، هنوز به کردیت
 * فعلی‌ش اضافه نشده. این بنر فقط تا وقتی پلن واقعاً queued هست نشون داده
 * می‌شه (hasQueuedSubscription)؛ به محض فعال‌سازی خودکار، این بنر خودش
 * محو می‌شه و کردیت توی باکس «وضعیت فعلی اشتراک» پایین صفحه دیده می‌شه.
 */
const QueuedPlanBanner: React.FC<{ planName: string; planCredit: number | null }> = ({
  planName,
  planCredit,
}) => (
  <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-[#5B47FB]/25 bg-[#EFEDFF] px-4 py-3.5">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#5B47FB]">
      <ClockIcon className="h-4 w-4" />
    </span>
    <p className="text-[11.5px] font-semibold leading-relaxed text-[#4935E0] sm:text-[12.5px]">
      {planCredit != null
        ? tx("billing.queued.withCredits", {
            plan: <span className="font-extrabold">{planName}</span>,
            credits: <span className="font-extrabold">{formatNumber(planCredit)}</span>,
          })
        : tx("billing.queued.noCredits", { plan: <span className="font-extrabold">{planName}</span> })}
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* مدت اشتراک: ماهانه / ۳ ماهه / ۶ ماهه                                */
/* ------------------------------------------------------------------ */

const BILLING_PERIODS: BillingPeriodMonths[] = [1, 3, 6];
const DEFAULT_BILLING_PERIOD: BillingPeriodMonths = 3;

const periodLabel = (months: number) => (months === 1 ? t("billing.period.monthly") : t("billing.period.months", { months }));

/** قیمت پلن برای مدت انتخابی؛ اگر پلن آن مدت را ندارد (مثلاً رایگان) همان ماهانه */
const planPeriodFor = (plan: Plan, months: BillingPeriodMonths): PlanPeriod =>
  plan.periods?.find((p) => p.months === months) ??
  plan.periods?.[0] ?? {
    months: 1,
    discount_percentage: plan.discount_percentage,
    original_price: plan.price,
    final_price: plan.final_price,
    monthly_price: plan.final_price,
    credit: Number(plan.credit),
  };

/** «۷» → ۷ (برای ضرب تعداد مقاله در تعداد ماه) */
const faDigitsToNumber = (value: string) =>
  Number(value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))));

const PeriodSwitcher: React.FC<{
  value: BillingPeriodMonths;
  onChange: (months: BillingPeriodMonths) => void;
  bestDiscount: Record<number, number>;
}> = ({ value, onChange, bestDiscount }) => (
  <div className="mb-5 flex justify-center">
    <div
      role="radiogroup"
      aria-label={t("billing.period.label")}
      className="grid w-full grid-cols-3 gap-1 rounded-2xl border border-[#E6E5F1] bg-white p-1 shadow-sm sm:w-auto sm:min-w-[440px]"
    >
      {BILLING_PERIODS.map((months) => {
        const active = value === months;
        const discount = bestDiscount[months] ?? 0;
        return (
          <button
            key={months}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(months)}
            className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 transition-all duration-200 sm:py-2.5 ${
              active
                ? "bg-[#0D0F23] text-white shadow-md"
                : "text-[#5A5F80] hover:bg-[#F6F6FB]"
            }`}
          >
            <span className="text-[12.5px] font-bold sm:text-[13.5px]">{periodLabel(months)}</span>
            <span
              className={`text-[10px] font-semibold sm:text-[10.5px] ${
                discount <= 0
                  ? "text-[#9A9DB8]"
                  : active
                  ? "text-[#DDBB86]"
                  : "text-emerald-600"
              }`}
            >
              {discount > 0 ? t("billing.period.upTo", { percent: formatPercent(discount) }) : t("billing.period.noCommitment")}
            </span>
            {months === DEFAULT_BILLING_PERIOD && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-l from-[#B08D57] to-[#DDBB86] px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                {t("billing.period.popular")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* پیکربندی ثابت هر پلن — دقیقاً مطابق نسخه‌ی PHP / وردپرسی            */
/* ترتیب: [رایگان, Pro, Pro Plus] — بر اساس ترتیب صعودی قیمت           */
/* ------------------------------------------------------------------ */

/** included=false یعنی این قابلیت در این پلن نیست؛ کم‌رنگ نشان داده می‌شود تا مقایسه‌ی پلن‌ها راحت باشد */
interface PlanFeature {
  text: string;
  badge?: string;
  note?: string;
  included?: boolean;
}

interface PlanFeatureGroup {
  kind: "content" | "product";
  title: string;
  items: PlanFeature[];
}

interface StaticPlanConfig {
  badge: string | null;
  highlight: boolean;
  period: string;
  tagline: string;
  articles: { count: string; label: string }[];
  groups: PlanFeatureGroup[];
  ctaText: string;
}

// متن‌ها هنگام رندر ساخته می‌شوند تا با زبان انتخاب‌شده‌ی کاربر هماهنگ باشند.
const buildStaticPlanConfig = (): StaticPlanConfig[] => [
  {
    badge: null,
    highlight: false,
    period: t("billing.plans.alwaysFree"),
    tagline: t("billing.plans.free.tagline"),
    articles: [{ count: formatNumber(1), label: t("billing.plans.free.articles") }],
    groups: [
      {
        kind: "content",
        title: t("billing.groups.content"),
        items: [
          { text: t("billing.plans.features.oneArticle") },
          { text: t("billing.plans.features.initialAnalysis") },
          { text: t("billing.plans.features.editor") },
          { text: t("billing.plans.features.wpPublish"), included: false },
        ],
      },
      {
        kind: "product",
        title: t("billing.groups.product"),
        items: [
          { text: t("billing.plans.features.productFixes"), note: t("billing.plans.notes.tryFew") },
          { text: t("billing.plans.features.productArticles"), included: false },
        ],
      },
    ],
    ctaText: t("billing.plans.free.cta"),
  },
  {
    badge: null,
    highlight: false,
    period: t("billing.plans.perMonth"),
    tagline: t("billing.plans.pro.tagline"),
    articles: [{ count: formatNumber(7), label: t("billing.plans.paidArticles") }],
    groups: [
      {
        kind: "content",
        title: t("billing.groups.content"),
        items: [
          { text: t("billing.plans.features.automation") },
          { text: t("billing.plans.features.wpPublish") },
          { text: t("billing.plans.features.multiImage") },
          { text: t("billing.plans.features.imageModels") },
          { text: t("billing.plans.features.duplicates") },
          { text: t("billing.plans.features.internalLinks") },
          { text: t("billing.plans.features.customHtml") },
          { text: t("billing.plans.features.api") },
        ],
      },
      {
        kind: "product",
        title: t("billing.groups.product"),
        items: [
          { text: t("billing.plans.features.productFixes"), note: t("billing.plans.notes.upTo100") },
          { text: t("billing.plans.features.productArticles"), badge: t("billing.plans.newBadge") },
        ],
      },
    ],
    ctaText: t("billing.plans.pro.cta"),
  },
  {
    badge: t("billing.plans.popular"),
    highlight: true,
    period: t("billing.plans.perMonth"),
    tagline: t("billing.plans.proPlus.tagline"),
    articles: [{ count: formatNumber(20), label: t("billing.plans.paidArticles") }],
    groups: [
      {
        kind: "content",
        title: t("billing.groups.content"),
        items: [
          { text: t("billing.plans.features.allPro") },
          { text: t("billing.plans.features.multiImage"), badge: t("billing.plans.newBadge") },
          { text: t("billing.plans.features.advancedLinks") },
          { text: t("billing.plans.features.priority") },
        ],
      },
      {
        kind: "product",
        title: t("billing.groups.product"),
        items: [
          { text: t("billing.plans.features.productFixes"), note: t("billing.plans.notes.upTo100") },
          { text: t("billing.plans.features.productArticles"), badge: t("billing.plans.newBadge") },
        ],
      },
    ],
    ctaText: t("billing.plans.proPlus.cta"),
  },
];

const buildFallbackConfig = (): StaticPlanConfig => ({
  badge: null,
  highlight: false,
  period: t("billing.plans.perMonth"),
  tagline: "",
  articles: [],
  groups: [],
  ctaText: t("billing.plans.choose"),
});

const getStaticConfig = (index: number): StaticPlanConfig =>
  buildStaticPlanConfig()[index] ?? buildFallbackConfig();

/* ------------------------------------------------------------------ */
/* آیکون‌های گروه‌بندی و اعتماد                                        */
/* ------------------------------------------------------------------ */

const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="10" cy="10" r="9.2" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
    <path d="M6.5 10h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const DocIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M5.5 2.5h6l3 3v11a1 1 0 01-1 1h-8a1 1 0 01-1-1v-13a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M7.5 9.5h5M7.5 12.5h5M7.5 6.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M4 6.5h12l-1 10.2a1 1 0 01-1 .8H6a1 1 0 01-1-.8L4 6.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M7.5 8.5V5.5a2.5 2.5 0 015 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);





/* ------------------------------------------------------------------ */
/* بلوک یک گروه از قابلیت‌ها داخل کارت پلن                             */
/* «سئوی محصولات» رنگ جدا دارد تا در نگاه اول دیده شود                 */
/* ------------------------------------------------------------------ */

const PlanFeatureGroupBlock: React.FC<{ group: PlanFeatureGroup; dark: boolean }> = ({
  group,
  dark,
}) => {
  const isProduct = group.kind === "product";
  const GroupIcon = isProduct ? BagIcon : DocIcon;

  const boxCls = isProduct
    ? dark
      ? "rounded-2xl border border-[#D9D4FF]/25 bg-[#D9D4FF]/[0.07] p-3"
      : "rounded-2xl border border-[#5B47FB]/15 bg-[#F3F1FF] p-3"
    : "";
  const titleCls = isProduct
    ? dark
      ? "text-[#D9D4FF]"
      : "text-[#5B47FB]"
    : dark
    ? "text-[#9A9DB8]"
    : "text-[#7D819F]";
  const checkCls = isProduct
    ? dark
      ? "text-[#D9D4FF]"
      : "text-[#5B47FB]"
    : dark
    ? "text-[#DDBB86]"
    : "text-[#5B47FB]";

  return (
    <div className={boxCls}>
      <p className={`mb-2 flex items-center gap-1.5 text-[11px] font-bold ${titleCls}`}>
        <GroupIcon className="h-3.5 w-3.5 shrink-0" />
        {group.title}
      </p>
      <ul className="flex flex-col gap-2">
        {group.items.map((item, i) => {
          const included = item.included !== false;
          return (
            <li key={i} className="flex items-start gap-2">
              {included ? (
                <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${checkCls}`} />
              ) : (
                <MinusIcon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-[#6C7193]" : "text-[#B6B8CE]"}`}
                />
              )}
              <span className="flex flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`text-[12.5px] font-medium leading-snug ${
                      !included
                        ? dark
                          ? "text-[#6C7193] line-through decoration-1"
                          : "text-[#A5ACA7] line-through decoration-1"
                        : dark
                        ? "text-[#EDE9DE]"
                        : "text-[#31392F]"
                    }`}
                  >
                    {item.text}
                  </span>
                  {item.badge && included && (
                    <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
                {item.note && included && (
                  <span className={`text-[10.5px] font-medium ${dark ? "text-[#9A9DB8]" : "text-[#7D819F]"}`}>
                    {item.note}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* نوار اعتماد زیر عنوان صفحه                                          */
/* ------------------------------------------------------------------ */



const TrustStrip: React.FC = () => (
  <div className="mt-5">
    <TrustBadge className="mb-3" />
    
  </div>
);

/* ------------------------------------------------------------------ */
/* بخش «سئوی محصولات چطور کار می‌کند»                                  */
/* یک نمونه‌ی قبل/بعد از صفحه‌ی محصول + فهرست مواردی که رفع می‌شود      */
/* فیلدها باید با FIELD_LABELS در PageProductSeoPage هماهنگ بمانند      */
/* ------------------------------------------------------------------ */

const productFixFields = () =>
  (["short_description", "description", "attributes", "tags", "faq", "image_alts", "seo_title", "meta_description", "focus_keyword"] as const).map(
    (field) => t(`pps.fields.${field}`),
  );

const sampleFixes = () =>
  (["short", "alt", "meta", "faq"] as const).map((k) => ({
    before: t(`billing.productSeo.sample.${k}Before`),
    after: t(`billing.productSeo.sample.${k}After`),
  }));

const productSteps = () =>
  ([1, 2, 3] as const).map((n) => ({
    title: t(`billing.productSeo.step${n}Title`),
    text: t(`billing.productSeo.step${n}Text`),
  }));

const SampleProductRow: React.FC<{ fixed: boolean }> = ({ fixed }) => (
  <div className="mb-2.5 flex items-center justify-between gap-2">
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-[#E6E5F1] ${
          fixed ? "text-[#5B47FB]" : "text-[#5B47FB]"
        }`}
      >
        <BagIcon className="h-[18px] w-[18px]" />
      </span>
      <span className="truncate text-[12.5px] font-bold text-[#0D0F23]">
        {t("billing.productSeo.sampleProduct")}
      </span>
    </div>
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
        fixed ? "bg-[#5B47FB] text-white" : "bg-rose-100 text-rose-600"
      }`}
    >
      {fixed ? t("billing.productSeo.published") : t("billing.productSeo.issues", { count: sampleFixes().length })}
    </span>
  </div>
);

const ProductSeoShowcase: React.FC = () => (
  <section className="mt-10 sm:mt-14" aria-labelledby="product-seo-title">
    <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F1FF] px-3 py-1 text-[11px] font-bold text-[#5B47FB]">
        <BagIcon className="h-3.5 w-3.5" />
        {t("billing.groups.product")}
      </span>
      <h2 id="product-seo-title" className="mt-3 text-lg font-bold text-[#0D0F23] sm:text-2xl">
        {t("billing.productSeo.title")}
      </h2>
      <p className="mt-1.5 text-[12px] leading-relaxed text-[#7D819F] sm:text-sm">
        {t("billing.productSeo.body")}
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      {/* نمونه‌ی قبل و بعد */}
      <figure className="rounded-3xl border border-[#E6E5F1] bg-white p-4 shadow-sm sm:p-5">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3.5">
          <SampleProductRow fixed={false} />
          <div className="flex flex-wrap gap-1.5">
            {sampleFixes().map(({ before }) => (
              <span
                key={before}
                className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-medium text-rose-600 ring-1 ring-rose-100"
              >
                {before}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center py-2 text-[#B6B8CE]" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
            <path
              d="M10 4v12M5.5 11.5L10 16l4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="rounded-2xl border border-[#5B47FB]/20 bg-[#EFEDFF]/60 p-3.5">
          <SampleProductRow fixed />
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {sampleFixes().map(({ after }) => (
              <li key={after} className="flex items-center gap-1.5 text-[11px] font-medium text-[#4935E0]">
                <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#5B47FB]" />
                {after}
              </li>
            ))}
          </ul>
        </div>

        <figcaption className="mt-3 text-center text-[10.5px] font-medium text-[#9A9DB8]">
          {t("billing.productSeo.caption")}
        </figcaption>
      </figure>

      {/* مراحل + فیلدها */}
      <div className="flex flex-col gap-4">
        <ol className="flex flex-col gap-2.5">
          {productSteps().map((step, i) => (
            <li
              key={step.title}
              className="flex items-start gap-3 rounded-2xl border border-[#E6E5F1] bg-white px-4 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F1FF] text-[12px] font-extrabold text-[#5B47FB]">
                {formatNumber(i + 1)}
              </span>
              <div>
                <p className="text-[13px] font-bold text-[#0D0F23]">{step.title}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#6C7193]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-[#E6E5F1] bg-white px-4 py-3.5">
          <p className="mb-2 text-[12px] font-bold text-[#0D0F23]">{t("billing.productSeo.whatFixed")}</p>
          <div className="flex flex-wrap gap-1.5">
            {productFixFields().map((field) => (
              <span
                key={field}
                className="rounded-full bg-[#F7F7FC] px-2.5 py-1 text-[11px] font-medium text-[#3B3F5C]"
              >
                {field}
              </span>
            ))}
          </div>
          <p className="mt-2.5 text-[10.5px] leading-relaxed text-[#9A9DB8]">
            {t("billing.productSeo.approval")}
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* داده‌ی سوالات متداول                                                */
/* ------------------------------------------------------------------ */

interface FaqItem {
  question: string;
  answer: string;
}

const getFaqItems = (): FaqItem[] => [
  { question: t("billing.faq.qProducts"), answer: t("billing.faq.aProducts") },
  { question: t("billing.faq.q1"), answer: t("billing.faq.a1") },
  { question: t("billing.faq.qPlatforms"), answer: t("billing.faq.aPlatforms") },
  { question: t("billing.faq.q2"), answer: t("billing.faq.a2") },
  { question: t("billing.faq.q3"), answer: t("billing.faq.a3") },
];

/* ------------------------------------------------------------------ */
/* بخش سوالات متداول                                                   */
/* ------------------------------------------------------------------ */

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mx-auto max-w-3xl px-0 py-10 sm:py-14">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="text-lg font-bold text-[#0D0F23] sm:text-2xl">
          {t("billing.faq.title")}
        </h2>
        <p className="mt-1.5 text-[12px] font-normal text-[#8A948E] sm:text-sm">
          {t("billing.faq.subtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {getFaqItems().map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                isOpen ? "border-[#5B47FB]/40" : "border-[#E6E5F1]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-start sm:px-5"
              >
                <span
                  className={`text-[13px] font-semibold leading-snug sm:text-[15px] ${
                    isOpen ? "text-[#5B47FB]" : "text-[#0D0F23]"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    isOpen ? "bg-[#EFEDFF] text-[#5B47FB]" : "bg-[#F3F3FA] text-[#7D819F]"
                  }`}
                >
                  <ChevronIcon open={isOpen} />
                </span>
              </button>

              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-[12.5px] font-normal leading-relaxed text-[#6C7193] sm:px-5 sm:pb-5 sm:text-[13.5px]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* مدال «وارد کردن کد تخفیف» — فقط وقتی نشون داده می‌شه که یک تخفیف     */
/* فعال (activeDiscount) معتبر برای کاربر وجود داشته باشه.              */
/* ------------------------------------------------------------------ */

interface DiscountCodeModalProps {
  open: boolean;
  planName: string;
  priceAmount: number;
  discountPercentage: number;
  codeInput: string;
  onChangeCode: (value: string) => void;
  error: string | null;
  applied: boolean;
  onApply: () => void;
  onCancel: () => void;
  onConfirmPayment: () => void;
  submitting: boolean;
}

const DiscountCodeModal: React.FC<DiscountCodeModalProps> = ({
  open,
  planName,
  priceAmount,
  discountPercentage,
  codeInput,
  onChangeCode,
  error,
  applied,
  onApply,
  onCancel,
  onConfirmPayment,
  submitting,
}) => {
  if (!open) return null;

  const discountedPriceAmount = applied
    ? Math.max(0, Math.round(priceAmount * (100 - discountPercentage)) / 100)
    : priceAmount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 pb-0 sm:items-center sm:px-4 sm:pb-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#0D0F23] sm:text-base">
            {t("billing.discountModal.title")}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label={t("common.actions.close")}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F3FA] text-[#7D819F] transition-colors hover:bg-[#E6E5F1]"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="mb-4 text-[12px] font-medium leading-relaxed text-[#6C7193]">
          {tx("billing.discountModal.body", { plan: <span className="font-bold text-[#0D0F23]">{planName}</span> })}
        </p>

        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => onChangeCode(e.target.value)}
            placeholder={t("billing.discountModal.placeholder")}
            dir="ltr"
            autoFocus
            className="h-11 flex-1 rounded-xl border border-[#E4E5F0] bg-[#F7F7FC] px-3 text-start text-[13px] font-semibold tracking-wide text-[#0D0F23] outline-none focus:border-[#5B47FB]"
          />
          <button
            type="button"
            onClick={onApply}
            disabled={submitting}
            className="h-11 shrink-0 rounded-xl bg-[#0D0F23] px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-[#14201E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("billing.discountModal.apply")}
          </button>
        </div>

        {error && (
          <p className="mb-2 text-[11.5px] font-medium text-rose-600">{error}</p>
        )}
        {applied && !error && (
          <p className="mb-2 flex items-center gap-1 text-[11.5px] font-semibold text-[#5B47FB]">
            <CheckIcon className="h-3.5 w-3.5 text-[#5B47FB]" />
            {t("billing.discountModal.applied")}
          </p>
        )}

        <div className="mb-2 mt-3 flex items-center justify-between rounded-2xl bg-[#F7F7FC] px-4 py-3">
          <span className="text-[11.5px] font-medium text-[#6C7193]">
            {t("billing.discountModal.planPrice", { plan: planName })}
          </span>
          <div className="flex flex-col items-end gap-0.5">
            {applied && (
              <span className="text-[11px] font-medium text-[#9A9DB8] line-through">
                {money(priceAmount)}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="text-[16px] font-extrabold text-[#0D0F23]">
                {priceNumber(discountedPriceAmount)}
              </span>
              <span className="text-[11px] font-medium text-[#6C7193]">{PRICE_CURRENCY}</span>
            </div>
          </div>
        </div>
        <p className="mb-5 text-[10.5px] font-normal leading-relaxed text-[#9A9DB8]">
          {t("billing.discountModal.finalNote")}
        </p>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl border border-[#E4E5F0] bg-white text-[12.5px] font-bold text-[#3B3F5C] transition-colors hover:bg-[#F3F3FA]"
          >
            {t("common.actions.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirmPayment}
            disabled={submitting}
            className="h-11 flex-[2] rounded-xl bg-[#5B47FB] text-[13px] font-bold text-white transition-colors hover:bg-[#4935E0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? t("billing.discountModal.redirecting") : t("billing.discountModal.toPayment")}
          </button>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-[#9A9DB8]">
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const FALLBACK_BACK_PATH = "/dashboard";

/** ورود به «کسب درآمد با معرفی»: فقط از صفحه‌ی پلن‌ها (در منوی اصلی نیست). */
const ReferralCard: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
  <section aria-labelledby="referral-card-title" className="mt-10 sm:mt-14">
    <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-l from-[#5B47FB] to-[#4935E0] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0">
        <h2 id="referral-card-title" className="text-base font-extrabold sm:text-lg">
          {t("billing.referral.title")}
        </h2>
        <p className="mt-1.5 text-[12px] leading-6 text-white/85 sm:text-[13px]">
          {t("billing.referral.body")}
        </p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-[13px] font-extrabold text-[#4935E0] shadow-sm transition-colors hover:bg-[#F3F3FA]"
      >
        {t("billing.referral.cta")}
      </button>
    </div>
  </section>
);

/** آستانه‌ی مصرف کردیت (درصد) که از اون به بعد بنر «الان پلن بعدی رو بخر»
 * نشون داده می‌شه. مقدار فعلی یعنی وقتی ≤۲۰٪ کردیت باقی مونده. */
const LOW_CREDIT_THRESHOLD = 80;

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectReason = (location.state as { reason?: string } | null)?.reason ?? null;

  usePageVisitLogger("subscription");

  const [usage, setUsage] = useState<SubscriptionUsageStats | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriodMonths>(DEFAULT_BILLING_PERIOD);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exitTrigger, setExitTrigger] = useState<ExitSurveyTrigger>("back_button");
  const [submittingSurvey, setSubmittingSurvey] = useState(false);

  const [activeDiscount, setActiveDiscount] = useState<DiscountInfo | null>(null);
  const [grantedDiscount, setGrantedDiscount] = useState<DiscountInfo | null>(null);

  const [discountModalPlan, setDiscountModalPlan] = useState<Plan | null>(null);
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [discountCodeError, setDiscountCodeError] = useState<string | null>(null);
  const [discountCodeApplied, setDiscountCodeApplied] = useState(false);

  const eligibleRef = useRef(false);
  const surveyResolvedRef = useRef(false);
  const pendingBackNavigationRef = useRef(false);
  const guardPushedRef = useRef(false);
  const plansGridRef = useRef<HTMLDivElement>(null); // برای اسکرول از بنر «کردیت رو به اتمام» به سمت کارت‌های پلن

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [meRes, plansRes] = await Promise.all([
        subscriptionService.me(),
        subscriptionService.plans(),
      ]);

      if (meRes.success && meRes.data) {
        setUsage(meRes.data.subscription);
      }
      if (plansRes.success && plansRes.data) {
        setPlans(plansRes.data.data ?? []);
      }
    } catch (err: any) {
      setError(err?.message || t("billing.errors.load"));
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveDiscount = async () => {
    try {
      const res = await discountService.me();
      if (res.success && res.data) {
        setActiveDiscount(res.data.discount ? withSecondsLeft(res.data.discount) : null);
      }
    } catch {
      // نبود تخفیف فعال، مشکلی نیست؛ چیزی نشون داده نمی‌شه
    }
  };

  useEffect(() => {
    fetchAll();
    fetchActiveDiscount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = usage?.has_active_subscription
    ? (usage as SubscriptionUsageStatsActive)
    : null;

  const hasActivePaidPlan = !!active && !active.is_free;

  const hasUsedFreePlan = !!(usage as unknown as { has_used_free_plan?: boolean } | null)?.has_used_free_plan;

  // --- جدید: وضعیت پلن بعدی (صف) ---
  // این فیلدها باید از بک‌اند (SubscriptionService::getUsageStats) بیان:
  // has_queued_subscription, queued_plan_name, queued_plan_slug
  const hasQueuedSubscription = !!(
    usage as unknown as { has_queued_subscription?: boolean } | null
  )?.has_queued_subscription;
  const queuedPlanName =
    (usage as unknown as { queued_plan_name?: string } | null)?.queued_plan_name ?? null;
  const queuedPlanSlug =
    (usage as unknown as { queued_plan_slug?: string } | null)?.queued_plan_slug ?? null;
  // نکته‌ی مهم: بک‌اند این فیلد رو (و همچنین credit_limit/credit_used) به‌خاطر
  // decimal cast در مدل، به‌صورت رشته برمی‌گردونه (مثلاً "530.0000" نه 530).
  // اگه همون رشته رو مستقیم توی جمع عددی (+) استفاده کنیم، جای جمع عددی،
  // الحاق رشته‌ای انجام می‌شه و نتیجه‌ی محاسبات بعدی NaN می‌شه؛ پس همینجا
  // صریحاً به Number تبدیلش می‌کنیم تا این مشکل جای دیگه‌ای سر بلند نکنه.
  const queuedPlanCreditRaw = (
    usage as unknown as { queued_plan_credit?: number | string | null } | null
  )?.queued_plan_credit;
  const queuedPlanCredit =
    queuedPlanCreditRaw != null && queuedPlanCreditRaw !== ""
      ? Number(queuedPlanCreditRaw)
      : null;

  // کردیت پلن فعلی داره تموم می‌شه و هنوز پلن بعدی نخریده → بنر پیشنهادِ خرید زودهنگام
  const isLowCredit =
    !!active && active.credit_usage_percentage >= LOW_CREDIT_THRESHOLD && !hasQueuedSubscription;

  // درصد مصرفی که توی باکس «وضعیت فعلی اشتراک» نشون داده می‌شه.
  // حالت عادی (بدون پلن در صف): همون credit_usage_percentage خودِ پلن فعلی، بدون تغییر.
  // وقتی پلن در صف داره: کردیت پلن بعدی هم به مخرج کسر اضافه می‌شه، چون از
  // دید کاربر، این کردیت هم قراره به‌زودی مال خودش بشه؛ یعنی
  // مصرف‌شده / (سقف پلن فعلی + سقف پلن در صف) به‌جای مصرف‌شده / سقف پلن فعلی.
  //
  // عمداً به‌جای credit_limit/credit_used (که ممکنه هنوز از بک‌اند نیومده
  // باشن)، سقف و مصرفِ پلن فعلی رو از روی remaining_credit و
  // credit_usage_percentage (که همیشه موجودن) معکوس‌محاسبه می‌کنیم:
  //   remaining_credit = limit - used  و  percentage = used/limit*100
  //   → limit = remaining_credit / (1 - percentage/100)
  const displayedCreditUsagePercentage = (() => {
    if (!active) return 0;

    // چون بک‌اند بعضی فیلدهای عددی رو به‌خاطر decimal cast به‌صورت رشته
    // برمی‌گردونه (مثلاً "85.6400")، همه‌جا صریحاً Number() می‌کنیم تا
    // عملگرهای ریاضی زیر به الحاق رشته‌ای تبدیل نشن و NaN ندن.
    const pct = Number(active.credit_usage_percentage);
    const remaining = Number(active.remaining_credit);

    if (!hasQueuedSubscription || queuedPlanCredit == null || queuedPlanCredit <= 0) {
      return pct;
    }

    // وقتی پلن فعلی دقیقاً ۱۰۰٪ مصرف شده، remaining_credit صفره و نمی‌شه
    // سقفش رو از فرمول زیر درآورد (تقسیم بر صفر). چون کردیتِ صف هنوز
    // فعال نشده، همچنان باید ۱۰۰٪ (قرمز، هشدار) نشون بدیم.
    if (pct >= 100) return 100;

    const currentLimit = remaining / (1 - pct / 100);
    const currentUsed = currentLimit - remaining;
    const combinedLimit = currentLimit + queuedPlanCredit;

    if (!Number.isFinite(combinedLimit) || combinedLimit <= 0) return 0;

    return Math.round((currentUsed / combinedLimit) * 100);
  })();

  const eligibleForSurvey = !loading && !hasActivePaidPlan;

  const hasValidActiveDiscount = !!activeDiscount && (activeDiscount.seconds_left ?? 0) > 0;

  useEffect(() => {
    eligibleRef.current = eligibleForSurvey;
  }, [eligibleForSurvey]);

  useEffect(() => {
    if (eligibleForSurvey && !guardPushedRef.current && !surveyResolvedRef.current) {
      guardPushedRef.current = true;
      window.history.pushState({ __exitGuard: true }, "", window.location.href);
    }
  }, [eligibleForSurvey]);

  useEffect(() => {
    const handlePopState = () => {
      if (eligibleRef.current && !surveyResolvedRef.current) {
        window.history.pushState({ __exitGuard: true }, "", window.location.href);
        guardPushedRef.current = true;
        pendingBackNavigationRef.current = true;
        setExitTrigger("back_button");
        setExitModalOpen(true);
        return;
      }

      if (guardPushedRef.current) {
        guardPushedRef.current = false;
        window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proceedBack = () => {
    if (guardPushedRef.current) {
      guardPushedRef.current = false;
      if (window.history.length > 3) {
        window.history.go(-2);
      } else {
        navigate(FALLBACK_BACK_PATH, { replace: true });
      }
      return;
    }

    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(FALLBACK_BACK_PATH, { replace: true });
    }
  };

  const handleBack = () => {
    if (eligibleRef.current && !surveyResolvedRef.current) {
      pendingBackNavigationRef.current = true;
      setExitTrigger("back_button");
      setExitModalOpen(true);
      return;
    }
    proceedBack();
  };

  const resolveAndMaybeExit = () => {
    surveyResolvedRef.current = true;
    setExitModalOpen(false);
    setGrantedDiscount(null);
    if (pendingBackNavigationRef.current) {
      pendingBackNavigationRef.current = false;
      proceedBack();
    }
  };

  const handleSurveySubmit = async (reason: ExitSurveyReason) => {
    setSubmittingSurvey(true);
    try {
      const res = await subscriptionService.submitExitSurvey({
        trigger_type: exitTrigger,
        reason_key: reason,
      });

      const rawDiscount = res.success && res.data ? res.data.discount : null;
      const discount = rawDiscount ? withSecondsLeft(rawDiscount) : null;

      if (discount) {
        setActiveDiscount(discount);
        setGrantedDiscount(discount);
        surveyResolvedRef.current = true;
        setSubmittingSurvey(false);
        return;
      }

      setSubmittingSurvey(false);
      resolveAndMaybeExit();
    } catch {
      setSubmittingSurvey(false);
      resolveAndMaybeExit();
    }
  };

  const handleContinueWithDiscount = () => {
    pendingBackNavigationRef.current = false;
    setExitModalOpen(false);
    setGrantedDiscount(null);
  };

  const handleSurveyDismiss = () => {
    resolveAndMaybeExit();
  };

  const handleSubscribe = async (planId: string, periodMonths: BillingPeriodMonths): Promise<boolean> => {
    setSubscribingId(planId);
    setError(null);
    setSuccessMsg(null);
    let redirecting = false;
    try {
      const discountCode =
        activeDiscount && (activeDiscount.seconds_left ?? 0) > 0 ? activeDiscount.code : undefined;

      const res = await subscriptionService.subscribe(planId, discountCode, periodMonths);
      if (res.success && res.data) {
        if ("payment_url" in res.data) {
          redirecting = true;
          surveyResolvedRef.current = true;
          window.location.href = res.data.payment_url;
          return true;
        }
        surveyResolvedRef.current = true;
        setSuccessMsg(res.data.message || t("billing.success.activated"));
        await fetchAll();
        await fetchActiveDiscount();
      } else {
        setError(res.message || t("billing.errors.purchase"));
      }
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      const msg = err?.data?.message ?? err?.response?.data?.message ?? err?.message;
      if (status === 422) {
        setError(msg || t("billing.errors.alreadyOnPlan"));
      } else {
        setError(msg || t("billing.errors.purchaseRetry"));
      }
    } finally {
      if (!redirecting) {
        setSubscribingId(null);
      }
    }
    return redirecting;
  };

  const handleStartClick = (plan: Plan) => {
    if (hasValidActiveDiscount && !plan.is_free && planPeriodFor(plan, effectivePeriod).final_price > 0) {
      setDiscountModalPlan(plan);
      setDiscountCodeInput("");
      setDiscountCodeError(null);
      setDiscountCodeApplied(false);
      return;
    }
    handleSubscribe(plan.id, planPeriodFor(plan, effectivePeriod).months);
  };

  const handleApplyDiscountCode = () => {
    if (!activeDiscount) return;
    const entered = discountCodeInput.trim();

    if (!entered) {
      setDiscountCodeError(t("billing.discountModal.required"));
      setDiscountCodeApplied(false);
      return;
    }

    if (entered.toUpperCase() !== activeDiscount.code.toUpperCase()) {
      setDiscountCodeError(t("billing.discountModal.invalid"));
      setDiscountCodeApplied(false);
      return;
    }

    setDiscountCodeError(null);
    setDiscountCodeApplied(true);
  };

  const handleCancelDiscountModal = () => {
    setDiscountModalPlan(null);
    setDiscountCodeInput("");
    setDiscountCodeError(null);
    setDiscountCodeApplied(false);
  };

  const handleConfirmPaymentWithDiscount = async () => {
    if (!discountModalPlan) return;
    const planId = discountModalPlan.id;
    const redirecting = await handleSubscribe(planId, planPeriodFor(discountModalPlan, effectivePeriod).months);
    if (!redirecting) {
      setDiscountModalPlan(null);
      setDiscountCodeInput("");
      setDiscountCodeError(null);
      setDiscountCodeApplied(false);
    }
  };

  useEffect(() => {
    if (!hasValidActiveDiscount && discountModalPlan) {
      handleCancelDiscountModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidActiveDiscount]);

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => a.final_price - b.final_price),
    [plans]
  );

  // بک‌اند قدیمی (بدون periods) → فقط ماهانه و بدون سوییچر
  const supportsPeriods = plans.some((p) => (p.periods?.length ?? 0) > 1);
  const effectivePeriod: BillingPeriodMonths = supportsPeriods ? billingPeriod : 1;

  // بیشترین تخفیف هر مدت بین پلن‌های پولی، برای برچسب «تا X٪ تخفیف»
  const bestDiscount = useMemo(() => {
    const result: Record<number, number> = {};
    plans.forEach((p) =>
      p.periods?.forEach((pp) => {
        if (!p.is_free) result[pp.months] = Math.max(result[pp.months] ?? 0, pp.discount_percentage);
      })
    );
    return result;
  }, [plans]);

  const activePeriodMonths = active?.period_months ?? 1;
  const queuedPeriodMonths = (usage as { queued_period_months?: number | null } | null)?.queued_period_months;

  return (
    <div className="min-h-screen bg-[#F6F6FB] pb-6">
      {/* هدر بازگشت */}
      <div className="sticky top-0 z-20 border-b border-[#E6E5F1] bg-[#F6F6FB]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 rounded-lg border border-[#E4E5F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#3B3F5C] shadow-sm transition-colors hover:bg-[#F3F3FA] sm:px-3.5 sm:py-2 sm:text-[13px]"
          >
            <ArrowRightIcon />
            {t("common.actions.back")}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-5xl px-4 pb-4 pt-6 text-center sm:pt-9">
        <h1 className="text-lg font-extrabold text-[#0D0F23] sm:text-2xl">
          {t("billing.hero.title")}
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-[12px] font-normal leading-relaxed text-[#7D819F] sm:text-[14px]">
          {t("billing.hero.subtitle")}
        </p>

        <TrustStrip />

        {redirectReason && (
          <div className="mx-auto mt-3 max-w-lg rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-[11px] font-medium text-amber-700 sm:text-[12px]">
            {redirectReason}
          </div>
        )}
        {error && (
          <div className="mx-auto mt-3 max-w-lg rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-[11px] font-medium text-rose-600 sm:text-[12px]">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mx-auto mt-3 max-w-lg rounded-xl border border-[#5B47FB]/30 bg-[#EFEDFF] px-3.5 py-2 text-[11px] font-medium text-[#4935E0] sm:text-[12px]">
            {successMsg}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {!loading && activeDiscount && (
          <DiscountBanner discount={activeDiscount} onExpire={() => setActiveDiscount(null)} />
        )}

        {/* پلن بعدی از قبل خریداری شده → بنر اطمینان */}
        {!loading && hasQueuedSubscription && queuedPlanName && (
          <QueuedPlanBanner
            planName={queuedPeriodMonths ? `${queuedPlanName} (${periodLabel(queuedPeriodMonths)})` : queuedPlanName}
            planCredit={queuedPlanCredit}
          />
        )}

        {/* کردیت رو به اتمامه و پلن بعدی هنوز خریده نشده → بنر پیشنهاد خرید زودهنگام */}
        {!loading && isLowCredit && active && (
          <LowCreditBanner
            percentage={active.credit_usage_percentage}
            onCta={() =>
              plansGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        )}

        {!loading && supportsPeriods && (
          <PeriodSwitcher value={billingPeriod} onChange={setBillingPeriod} bestDiscount={bestDiscount} />
        )}

        {loading ? (
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/70 sm:h-[420px]" />
            ))}
          </div>
        ) : (
          <div
            ref={plansGridRef}
            className="flex scroll-mt-20 flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-5"
          >
            {sortedPlans.map((plan, index) => {
              const cfg = getStaticConfig(index);
              const isCurrent = active?.plan_slug === plan.slug;
              const isBlockedFreeDowngrade = plan.is_free && hasActivePaidPlan && !isCurrent;
              // پلن رایگان در کل عمر حساب فقط یک‌بار مجازه — حتی اگه همین
              // الان روی همون پلن رایگان باشی، نباید بتونی «تمدیدش» کنی.
              const isBlockedFreeReissue = plan.is_free && hasUsedFreePlan;

              // --- جدید: تشخیص پلنِ در صف، و بلاک‌کردن بقیه‌ی پلن‌ها وقتی
              // یک پلن دیگه از قبل در صفه (دقیقاً هماهنگ با محدودیت بک‌اند:
              // هر کاربر فقط یک اسلات صف در هر لحظه داره) ---
              const isQueuedPlan =
                hasQueuedSubscription &&
                (queuedPlanSlug ? queuedPlanSlug === plan.slug : queuedPlanName === plan.name);
              const isBlockedByOtherQueue = hasQueuedSubscription && !isCurrent && !isQueuedPlan;

              // توجه: isCurrent دیگه به‌تنهایی دکمه رو غیرفعال نمی‌کنه — کاربر
              // باید بتونه همیشه پلن فعلی‌ش رو دوباره بخره تا برای تمدید
              // (renewal) در صف بشینه؛ بک‌اند خودش تصمیم می‌گیره فوری فعال
              // بشه یا queue بشه.
              const isDisabled =
                subscribingId === plan.id ||
                isBlockedFreeDowngrade ||
                isBlockedFreeReissue ||
                isQueuedPlan ||
                isBlockedByOtherQueue;

              const period = planPeriodFor(plan, effectivePeriod);
              const isMultiMonth = period.months > 1;
              const finalPriceAmount = fromCents(period.monthly_price);
              const originalPriceAmount = fromCents(plan.price);
              const totalPriceAmount = fromCents(period.final_price);
              const savingAmount = fromCents(period.original_price - period.final_price);
              const hasDiscount =
                !plan.is_free &&
                period.discount_percentage > 0 &&
                period.final_price < period.original_price;
              const isFreeDisplay = plan.is_free || period.final_price === 0;

              let buttonLabel = cfg.ctaText;
              if (subscribingId === plan.id) buttonLabel = t("billing.cta.activating");
              else if (isQueuedPlan) buttonLabel = t("billing.cta.queued");
              else if (isBlockedByOtherQueue) buttonLabel = t("billing.cta.otherQueued");
              else if (isBlockedFreeReissue) buttonLabel = t("billing.cta.alreadyUsed");
              else if (isBlockedFreeDowngrade) buttonLabel = t("billing.cta.unavailable");
              else if (isCurrent) buttonLabel = t("billing.cta.renew");
              else if (!plan.is_free && period.final_price === 0) buttonLabel = t("billing.cta.getFree");
              else if (!plan.is_free && isMultiMonth) buttonLabel = t("billing.cta.buyPeriod", { period: periodLabel(period.months) });

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col overflow-hidden rounded-3xl transition-shadow duration-200 ${
                    cfg.highlight
                      ? "border-2 border-[#B08D57] bg-[#0D0F23] shadow-xl sm:shadow-2xl"
                      : "border border-[#E6E5F1] bg-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {cfg.highlight && (
                    <div className="flex items-center justify-center gap-1.5 bg-gradient-to-r rtl:bg-gradient-to-l from-[#B08D57] to-[#DDBB86] px-4 py-1.5 text-[11px] font-bold text-white sm:text-[12px]">
                      ⭐ {cfg.badge}
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    {/* نام پلن + وضعیت (فعلی / در صف / تخفیف) در یک ردیف تمیز */}
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3
                        className={`text-[15px] font-bold sm:text-base ${
                          cfg.highlight ? "text-[#F6F6FB]" : "text-[#0D0F23]"
                        }`}
                      >
                        {plan.name}
                      </h3>
                      {(isCurrent || isQueuedPlan || hasDiscount) && (
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold text-white ${
                            isCurrent
                              ? "bg-[#5B47FB]"
                              : isQueuedPlan
                              ? "bg-[#B08D57]"
                              : "bg-rose-500"
                          }`}
                        >
                          {isCurrent
                            ? t("billing.badges.current")
                            : isQueuedPlan
                            ? t("billing.badges.next")
                            : t("billing.badges.percentOff", { percent: formatPercent(period.discount_percentage) })}
                        </span>
                      )}
                    </div>

                    {cfg.tagline && (
                      <p
                        className={`-mt-1.5 mb-3 text-[11.5px] font-medium leading-relaxed ${
                          cfg.highlight ? "text-[#9A9DB8]" : "text-[#7D819F]"
                        }`}
                      >
                        {cfg.tagline}
                      </p>
                    )}

                    <div className="mb-4 flex flex-col items-center text-center">
                      {hasDiscount && (
                        <span
                          className={`text-[11px] font-medium line-through ${
                            cfg.highlight ? "text-[#8B958F]" : "text-[#9A9DB8]"
                          }`}
                        >
                          {money(originalPriceAmount)}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-[28px] font-extrabold leading-none sm:text-[30px] ${
                            cfg.highlight ? "text-[#F6F6FB]" : "text-[#0D0F23]"
                          }`}
                        >
                          {isFreeDisplay ? t("billing.price.free") : priceNumber(finalPriceAmount)}
                        </span>
                        {!isFreeDisplay && (
                          <span
                            className={`text-[12px] font-medium ${
                              cfg.highlight ? "text-[#C9CBDD]" : "text-[#6C7193]"
                            }`}
                          >
                            {PRICE_CURRENCY}
                          </span>
                        )}
                      </div>
                      <span
                        className={`mt-1 text-[11px] font-medium ${
                          cfg.highlight ? "text-[#9A9DB8]" : "text-[#9A9DB8]"
                        }`}
                      >
                        {cfg.period}
                      </span>
                      {!isFreeDisplay && isMultiMonth && (
                        <div
                          className={`mt-2.5 w-full rounded-xl px-3 py-2 text-[11px] font-medium leading-relaxed ${
                            cfg.highlight ? "bg-white/[0.06] text-[#C9CBDD]" : "bg-[#F7F7FC] text-[#5A5F80]"
                          }`}
                        >
                          {tx("billing.period.payOnce", {
                            amount: (
                              <span className={`font-extrabold ${cfg.highlight ? "text-[#F6F6FB]" : "text-[#0D0F23]"}`}>
                                {money(totalPriceAmount)}
                              </span>
                            ),
                          }, { months: period.months })}
                          {savingAmount > 0 && (
                            <span className={`block font-bold ${cfg.highlight ? "text-[#DDBB86]" : "text-emerald-600"}`}>
                              {t("billing.period.saving", { amount: money(savingAmount) })}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      className={`mb-4 flex flex-col items-center gap-2 rounded-2xl px-4 py-3.5 text-center ${
                        cfg.highlight ? "bg-white/[0.06]" : "bg-[#F7F7FC]"
                      }`}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-xl font-extrabold ${
                            cfg.highlight ? "text-[#DDBB86]" : "text-[#5B47FB]"
                          }`}
                        >
                          {formatNumber(period.credit)}
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            cfg.highlight ? "text-[#C9CBDD]" : "text-[#5A5F80]"
                          }`}
                        >
                          {isMultiMonth ? t("billing.plans.creditsForMonths", { months: period.months }) : t("billing.plans.credits")}
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-0.5">
                        {cfg.articles.map((item, i) => (
                          <span
                            key={i}
                            className={`text-[11.5px] font-medium leading-snug ${
                              cfg.highlight ? "text-[#DDBB86]" : "text-[#5B47FB]"
                            }`}
                          >
                            ≈ {isMultiMonth ? formatNumber(faDigitsToNumber(item.count) * period.months) : item.count}{" "}
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 flex flex-1 flex-col gap-3 text-start">
                      {/* product SEO first so it lines up across cards and is seen at a glance */}
                      {[...cfg.groups]
                        .sort((a, b) => Number(b.kind === "product") - Number(a.kind === "product"))
                        .map((group) => (
                        <PlanFeatureGroupBlock
                          key={group.kind}
                          group={group}
                          dark={cfg.highlight}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={isDisabled}
                      title={
                        isQueuedPlan
                          ? t("billing.hints.queued")
                          : isBlockedByOtherQueue
                          ? t("billing.hints.otherQueued")
                          : isBlockedFreeReissue
                          ? t("billing.hints.freeUsed")
                          : isBlockedFreeDowngrade
                          ? t("billing.hints.freeDowngrade")
                          : isCurrent
                          ? t("billing.hints.renew")
                          : undefined
                      }
                      onClick={() => handleStartClick(plan)}
                      className={`flex h-11 w-full items-center justify-center rounded-xl text-[13px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        cfg.highlight
                          ? "bg-gradient-to-r rtl:bg-gradient-to-l from-[#B08D57] to-[#DDBB86] text-white hover:opacity-90"
                          : "bg-[#5B47FB] text-white hover:bg-[#4935E0]"
                      }`}
                    >
                      {buttonLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* وضعیت فعلی اشتراک */}
        {!loading && active && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#E6E5F1] bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#5A5F80] sm:text-[12px]">
              <span className="font-bold text-[#0D0F23]">
                {active.plan_name}
                {!active.is_free && (
                  <span className="mx-1.5 rounded-full bg-[#EFEDFF] px-2 py-0.5 text-[10px] font-bold text-[#4935E0]">
                    {periodLabel(activePeriodMonths)}
                  </span>
                )}
              </span>
              <span>
                · {formatNumber(active.remaining_credit)}
                {hasQueuedSubscription && queuedPlanCredit != null && (
                  <span className="text-[#5B47FB]"> (+{formatNumber(queuedPlanCredit)})</span>
                )}{" "}
                {t("billing.usage.remaining", { percent: formatPercent(displayedCreditUsagePercentage) })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#F3F3FA]">
                <div
                  className={`h-full rounded-full ${
                    displayedCreditUsagePercentage >= 90 ? "bg-rose-500" : "bg-[#5B47FB]"
                  }`}
                  style={{ width: `${Math.min(displayedCreditUsagePercentage, 100)}%` }}
                />
              </div>
              {active.ends_at && (
                <span className="text-[10px] font-medium text-[#9A9DB8]">
                  {t("billing.usage.until", { date: formatDate(active.ends_at) })}
                </span>
              )}
            </div>
          </div>
        )}

        {!loading && <ProductSeoShowcase />}
      </div>

      {/* نتایج واقعی کاربران — همان بخش صفحه‌ی ورود */}
      {!loading && <ChartShowcase />}

      <div className="mx-auto max-w-5xl px-4">
        {!loading && <ReferralCard onOpen={() => navigate("/referral")} />}
        {!loading && <FaqSection />}
      </div>

      <ExitSurveyModal
        open={exitModalOpen}
        triggerType={exitTrigger}
        submitting={submittingSurvey}
        grantedDiscount={grantedDiscount}
        onSubmit={handleSurveySubmit}
        onContinueWithDiscount={handleContinueWithDiscount}
        onDismiss={handleSurveyDismiss}
      />

      {discountModalPlan && (
        <DiscountCodeModal
          open={!!discountModalPlan}
          planName={`${discountModalPlan.name} · ${periodLabel(planPeriodFor(discountModalPlan, effectivePeriod).months)}`}
          priceAmount={fromCents(planPeriodFor(discountModalPlan, effectivePeriod).final_price)}
          discountPercentage={activeDiscount?.percentage ?? 0}
          codeInput={discountCodeInput}
          onChangeCode={(value) => {
            setDiscountCodeInput(value);
            if (discountCodeError) setDiscountCodeError(null);
            if (discountCodeApplied) setDiscountCodeApplied(false);
          }}
          error={discountCodeError}
          applied={discountCodeApplied}
          onApply={handleApplyDiscountCode}
          onCancel={handleCancelDiscountModal}
          onConfirmPayment={handleConfirmPaymentWithDiscount}
          submitting={subscribingId === discountModalPlan.id}
        />
      )}
    </div>
  );
};

export default SubscriptionPage;