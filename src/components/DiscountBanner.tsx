import React, { useState } from "react";
import { formatCountdown, useCountdown } from "../hooks/useCountdown";
import type { DiscountInfo } from "../services/api";
import { t, formatNumber as fmt } from "../i18n";

const formatPercent = (n: number) => fmt(Math.round(n) / 100, { style: "percent" });

const FIFTEEN_MIN = 15 * 60;

interface DiscountBannerProps {
  discount: DiscountInfo;
  /** وقتی تایمر تموم شد صدا زده می‌شه تا والد state رو پاک کنه */
  onExpire: () => void;
}

const CopyIcon: React.FC = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0">
    <rect x="7" y="7" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4.5 12.5v-7A1.5 1.5 0 0 1 6 4h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const DiscountBanner: React.FC<DiscountBannerProps> = ({ discount, onExpire }) => {
  const secondsLeft = useCountdown(discount.seconds_left, onExpire);
  const [copied, setCopied] = useState(false);

  if (secondsLeft <= 0) return null;

  const urgent = secondsLeft <= 60;
  // متن "فقط ۱۵ دقیقه" فقط وقتی نشون داده میشه که مهلت واقعی حدود ۱۵ دقیقه باشه
  // (بر اساس مقدار اولیه از سرور، نه secondsLeft در حال شمارش که هر تایمری آخرش به زیر ۱۵ دقیقه می‌رسه)
const isFifteenMinuteOffer =
  discount.seconds_left != null && discount.seconds_left > 0 && discount.seconds_left <= FIFTEEN_MIN;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(discount.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // اگه کپی خودکار پشتیبانی نشد، حداقل کد رو انتخاب‌پذیر نگه می‌داریم
    }
  };

  return (
    <div
      className={`mb-5 flex flex-col items-center gap-3 rounded-2xl border px-4 py-3.5 text-center transition-colors sm:flex-row sm:justify-between sm:text-start ${
        urgent
          ? "border-rose-300 bg-rose-50"
          : "border-[#B08D57]/40 bg-gradient-to-r rtl:bg-gradient-to-l from-[#FBF3E6] to-[#F5EBD8]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-xl">🎁</span>
        <div>
          <p className="text-[12.5px] font-bold text-[#1E2A28]">
            {t("billing.discount.offJustForYou", { percent: formatPercent(discount.percentage) })}
          </p>
          {isFifteenMinuteOffer && (
            <p className="mt-0.5 text-[11px] font-bold text-[#1E2A28]">
              {t("billing.discount.fifteenMinutes")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 sm:items-end">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-[#B08D57] bg-white px-3 py-1.5 font-mono text-[13px] font-bold tracking-widest text-[#1E2A28] transition-colors hover:bg-[#FBF3E6]"
          >
            {discount.code}
            <CopyIcon />
          </button>
          <span
            className={`rounded-lg px-2.5 py-1.5 text-[12px] font-bold tabular-nums text-white ${
              urgent ? "bg-rose-500" : "bg-[#1B6F63]"
            }`}
          >
            {formatCountdown(secondsLeft)}
          </span>
        </div>
        {copied && (
          <span className="text-[10.5px] font-medium text-[#1B6F63]">{t("billing.discount.copied")}</span>
        )}
      </div>
    </div>
  );
};

export default DiscountBanner;