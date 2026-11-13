import React, { useState } from "react";
import { formatCountdown, useCountdown } from "../hooks/useCountdown";
import type { DiscountInfo, ExitSurveyReason, ExitSurveyTrigger } from "../services/api";
import { t, formatNumber as fmt } from "../i18n";
import { tx } from "../i18n/rich";

const formatPercent = (n: number) => fmt(Math.round(n) / 100, { style: "percent" });

interface ReasonOption {
  key: ExitSurveyReason;
  labelKey: string;
  icon: string;
}

const REASON_OPTIONS: ReasonOption[] = [
  { key: "price", labelKey: "billing.exitSurvey.reasons.price", icon: "/icon/money.png" },
  { key: "quality", labelKey: "billing.exitSurvey.reasons.quality", icon: "/icon/quality.png" },
  { key: "no_website", labelKey: "billing.exitSurvey.reasons.noWebsite", icon: "/icon/no_web.png" },
  { key: "other", labelKey: "billing.exitSurvey.reasons.other", icon: "/icon/other.png" },
];

const CopyIcon: React.FC = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
    <rect x="7" y="7" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4.5 12.5v-7A1.5 1.5 0 0 1 6 4h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const XIcon: React.FC = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

interface ExitSurveyModalProps {
  open: boolean;
  triggerType: ExitSurveyTrigger;
  submitting: boolean;
  /** وقتی کاربر «قیمت زیاده» رو انتخاب کنه و بک‌اند تخفیف بده، والد این رو ست می‌کنه */
  grantedDiscount: DiscountInfo | null;
  onSubmit: (reason: ExitSurveyReason) => void;
  /** کاربر تصمیم گرفت با تخفیف بمونه و ادامه بده (خروج لغو می‌شه) */
  onContinueWithDiscount: () => void;
  /** بستن مودال بدون جواب، یا «نه ممنون می‌خوام برم» بعد از دیدن تخفیف */
  onDismiss: () => void;
}

const ExitSurveyModal: React.FC<ExitSurveyModalProps> = ({
  open,
  submitting,
  grantedDiscount,
  onSubmit,
  onContinueWithDiscount,
  onDismiss,
}) => {
  const [copied, setCopied] = useState(false);
  const secondsLeft = useCountdown(grantedDiscount?.seconds_left);

  if (!open) return null;

  const handleCopy = async () => {
    if (!grantedDiscount) return;
    try {
      await navigator.clipboard.writeText(grantedDiscount.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // نادیده گرفتن خطای کپی؛ کد همچنان روی صفحه قابل‌مشاهده‌ست
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 sm:items-center sm:px-4"
      onClick={onDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
      >
        {!grantedDiscount ? (
          /* ---------------- مرحله‌ی اول: پرسیدن دلیل ---------------- */
          <>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#0D0F23]">{t("billing.exitSurvey.title")}</h2>
              <button
                type="button"
                onClick={onDismiss}
                aria-label={t("common.actions.close")}
                className="rounded-full p-1.5 text-[#9A9DB8] transition-colors hover:bg-[#F3F3FA]"
              >
                <XIcon />
              </button>
            </div>
            <p className="mb-4 text-[12px] font-normal leading-relaxed text-[#6C7193]">
             {t("billing.exitSurvey.question")}
            </p>

            <div className="flex flex-col gap-2">
              {REASON_OPTIONS.map((opt) => (
               <button
  key={opt.key}
  type="button"
  disabled={submitting}
  onClick={() => onSubmit(opt.key)}
  className="flex items-center gap-2.5 rounded-xl border border-[#E6E5F1] bg-white px-3.5 py-3 text-start text-[13px] font-medium text-[#0D0F23] transition-colors hover:border-[#5B47FB] hover:bg-[#F7FBFA] disabled:cursor-not-allowed disabled:opacity-50"
>
  <img src={opt.icon} alt="" className="h-7 w-7 shrink-0 object-contain" />
  {t(opt.labelKey)}
</button>
              ))}
            </div>

            {submitting && (
              <p className="mt-3 text-center text-[11px] font-medium text-[#9A9DB8]">
                {t("common.status.submitting")}
              </p>
            )}
          </>
        ) : (
          /* ---------------- مرحله‌ی دوم: نمایش کد تخفیف ---------------- */
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEDFF] text-2xl">
              🎉
            </div>
            <h2 className="text-[15px] font-bold text-[#0D0F23]">
              {t("billing.exitSurvey.offerTitle")}
            </h2>
            <p className="mx-auto mt-1.5 max-w-xs text-[12px] font-normal leading-relaxed text-[#6C7193]">
              {tx("billing.exitSurvey.offerBody", {
                percent: <span className="font-bold text-[#0D0F23]">{formatPercent(grantedDiscount.percentage)}</span>,
              })}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="mx-auto mt-4 flex items-center gap-2 rounded-xl border-2 border-dashed border-[#B08D57] bg-[#FBF3E6] px-4 py-2.5 font-mono text-[17px] font-black tracking-[0.2em] text-[#0D0F23] transition-colors hover:bg-[#F5EBD8]"
            >
              {grantedDiscount.code}
              <CopyIcon />
            </button>
            <p className="mt-1.5 h-3.5 text-[10.5px] font-medium text-[#5B47FB]">
              {copied ? t("billing.discount.copied") : ""}
            </p>

            <div
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-white ${
                secondsLeft <= 60 ? "bg-rose-500" : "bg-[#0D0F23]"
              }`}
            >
              ⏳ {t("billing.discount.timeLeft", { time: formatCountdown(secondsLeft) })}
            </div>

            <button
              type="button"
              onClick={onContinueWithDiscount}
              className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-[#5B47FB] text-[13px] font-bold text-white transition-colors hover:bg-[#4935E0]"
            >
              {t("billing.exitSurvey.stay")}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="mt-1.5 flex h-9 w-full items-center justify-center rounded-xl text-[12px] font-medium text-[#9A9DB8] transition-colors hover:text-[#6C7193]"
            >
              {t("billing.exitSurvey.leave")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitSurveyModal;