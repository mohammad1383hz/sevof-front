import { useEffect } from "react";
import { t } from "../../../i18n";

interface UpgradePlanModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  /** پیام اصلی — اگر ندهید بر اساس isFreePlan یک پیام پیش‌فرض ساخته می‌شود */
  message?: string;
  isFreePlan?: boolean;
  /** برای سفارشی کردن عنوان بر اساس بخشی که کاربر در آن گیر کرده (ایده، کلمات کلیدی، شکاف رقبا، ادیت مقاله) */
  title?: string;
  /** لیست ویژگی‌هایی که با خرید اشتراک برای کاربر فعال می‌شود */
  features?: string[];
}

const getDefaultFeatures = () => [
  t("billing.upgrade.features.automation"),
  t("billing.upgrade.features.images"),
  t("billing.upgrade.features.wordpress"),
  t("billing.upgrade.features.duplicates"),
  t("billing.upgrade.features.links"),
  t("billing.upgrade.features.priority"),
];

/**
 * مودال مشترک «اعتبار/اشتراک کافی نیست» — باید در هر جایی که کاربر به یک
 * محدودیت اعتبار یا اشتراک رایگان برخورد می‌کند (تولید ایده، خوشه‌های
 * کلمات کلیدی، شکاف محتوایی رقبا، ادیت/تولید مقاله) استفاده شود تا تجربه
 * کاربر یکسان باشد و همیشه یک مسیر روشن به سمت خرید اشتراک/اعتبار نشان
 * داده شود.
 */
export function UpgradePlanModal({
  open,
  onClose,
  onUpgrade,
  message,
  isFreePlan = true,
  title,
  features = getDefaultFeatures(),
}: UpgradePlanModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

   const resolvedTitle = title || (isFreePlan ? t("billing.upgrade.freeTitle") : t("billing.upgrade.paidTitle"));
  const resolvedMessage = message || (
    isFreePlan
      ? t("billing.upgrade.freeBody")
      : t("billing.upgrade.paidBody")
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#B3453A]/10 text-[#B3453A]">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-center text-base font-black text-[#0D0F23] mb-2">{resolvedTitle}</h2>
        <p className="text-center text-sm text-[#3B3F5C] leading-7 mb-4">{resolvedMessage}</p>

        {features.length > 0 && (
          <div className="mb-6">
            <p className="text-center text-xs font-bold text-emerald-600 mb-3">
              {t("billing.upgrade.unlockTitle")}
            </p>
            <ul className="space-y-2 rounded-xl bg-[#FAFAFE] border border-[#E4E5F0] p-4">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#0D0F23]">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full rounded-xl bg-[#B3453A] text-white text-sm font-bold py-2.5 hover:bg-[#9C3B31] transition-all"
          >
            {isFreePlan ? t("billing.upgrade.subscribe") : t("billing.upgrade.addCredits")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-[#E4E5F0] text-[#3B3F5C] text-sm font-bold py-2.5 hover:bg-[#FAFAFE] transition-all"
          >
            {t("billing.upgrade.later")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpgradePlanModal;