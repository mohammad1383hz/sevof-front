// src/components/OtpInput.tsx
import React, { useEffect, useRef } from "react";
import { t } from "../i18n";

/* ورودی کد تأیید به‌شکل چند خانهٔ مجزا
 * - تایپ: بعد از هر رقم خودکار به خانهٔ بعد می‌رود
 * - Backspace: رقم را پاک می‌کند و به خانهٔ قبل برمی‌گردد
 * - Paste و پر‌کردن خودکار پیامک (iOS / Android) پشتیبانی می‌شود
 * - ارقام فارسی و عربی به انگلیسی تبدیل می‌شوند
 */

const EN_DIGITS = "0123456789";
const onlyEnglishDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => EN_DIGITS["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
    .replace(/[٠-٩]/g, (d) => EN_DIGITS["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
    .replace(/\D/g, "");

const placeCaretAtEnd = (el: HTMLInputElement | null | undefined) => {
  if (!el) return;
  const end = el.value.length;
  requestAnimationFrame(() => el.setSelectionRange(end, end));
};

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  readOnly?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
  labelledBy?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  readOnly = false,
  hasError = false,
  autoFocus = false,
  labelledBy,
}) => {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  // آخرین مقدار؛ هم‌زمان با onChange به‌روز می‌شود تا بین دو رویداد پشت‌سرهم مقدار قدیمی نخوانیم
  const valueRef = useRef(value);
  valueRef.current = value;

  const commit = (next: string) => {
    valueRef.current = next;
    onChange(next);
  };

  const focusBox = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    // مکان‌نما آخر خانه می‌ماند؛ عدد هایلایت (انتخاب) نمی‌شود
    placeCaretAtEnd(el);
  };

  useEffect(() => {
    if (autoFocus) focusBox(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // رقم‌ها همیشه پشت‌سرهم هستند (خانهٔ خالی بین دو رقم وجود ندارد)
  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const value = valueRef.current;
    let digits = onlyEnglishDigits(e.target.value);
    if (!digits) return;

    // خانه از قبل رقم داشت و کاربر یک رقم جدید تایپ کرد (مقدار شد دو رقم)
    // فقط رقم تازه‌تایپ‌شده را نگه می‌داریم، بدون نیاز به انتخاب رقم قبلی
    if (value[i] && digits.length === 2) {
      const caret = e.target.selectionStart ?? 2;
      digits = caret <= 1 ? digits[0] : digits[1];
    }

    // یک رقم: جایگزین همان خانه می‌شود و بقیهٔ ارقام دست‌نخورده می‌مانند
    const next =
      digits.length === 1
        ? value.slice(0, i) + digits + value.slice(i + 1)
        : (value.slice(0, i) + digits).slice(0, length);
    commit(next);
    focusBox(Math.min(i + digits.length, length - 1));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const value = valueRef.current;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) {
        commit(value.slice(0, i) + value.slice(i + 1));
      } else if (i > 0) {
        commit(value.slice(0, i - 1) + value.slice(i));
        focusBox(i - 1);
      }
      return;
    }
    if (e.key === "Delete") {
      e.preventDefault();
      commit(value.slice(0, i) + value.slice(i + 1));
      return;
    }
    // چیدمان خانه‌ها چپ‌به‌راست است
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const digits = onlyEnglishDigits(e.clipboardData.getData("text")).slice(0, length);
    if (!digits) return;
    e.preventDefault();
    commit(digits);
    focusBox(Math.min(digits.length, length - 1));
  };

  // کاربر نمی‌تواند به خانه‌ای بعد از اولین خانهٔ خالی برود
  const handleFocus = (i: number, e: React.FocusEvent<HTMLInputElement>) => {
    const value = valueRef.current;
    const firstEmpty = Math.min(value.length, length - 1);
    if (i > firstEmpty) {
      focusBox(firstEmpty);
      return;
    }
    placeCaretAtEnd(e.target);
  };

  return (
    <div
      dir="ltr"
      role="group"
      aria-labelledby={labelledBy}
      className="flex items-center justify-center gap-2 sm:gap-2.5"
    >
      {Array.from({ length }).map((_, i) => {
        const digit = value[i] ?? "";
        const filled = digit !== "";

        const tone = hasError
          ? "border-rose-400 bg-rose-50 text-rose-700 focus:border-rose-500 focus:ring-rose-200"
          : filled
          ? "border-[#5B47FB]/60 bg-[#D9D4FF]/60 text-[#4935E0] focus:border-[#5B47FB] focus:ring-[#5B47FB]/20"
          : "border-[#E4E5F0] bg-[#FAFAFE] text-[#0D0F23] focus:border-[#5B47FB] focus:ring-[#5B47FB]/20";

        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={t("auth.otp.digitAria", { index: i + 1, total: length })}
            value={digit}
            readOnly={readOnly}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => handleFocus(i, e)}
            onClick={(e) => placeCaretAtEnd(e.currentTarget)}
            className={`h-12 min-w-0 max-w-[52px] flex-1 rounded-xl border-2 text-center text-xl font-bold shadow-sm outline-none transition-[transform,box-shadow,border-color,background-color] duration-150 focus:ring-4 focus:-translate-y-0.5 motion-reduce:transition-none motion-reduce:focus:translate-y-0 sm:h-14 sm:text-2xl caret-[#5B47FB] selection:bg-transparent read-only:cursor-not-allowed read-only:opacity-70 ${tone}`}
          />
        );
      })}
    </div>
  );
};

export default OtpInput;