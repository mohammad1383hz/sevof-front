// src/components/product-article/ModalShell.tsx
import React, { useEffect, useRef } from "react";
import { t } from "../../i18n";

/* ───────── آیکون‌ها ───────── */
export const ICONS = {
  search: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  x: "M6 18L18 6M6 6l12 12",
  check: "M4.5 12.75l6 6 9-13.5",
  pencil:
    "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
  bag: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  sparkles:
    "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
  link: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244",
  home: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  folder:
    "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z",
  plus: "M12 4.5v15m7.5-7.5h-15",
};

export const Icon: React.FC<{ d: string; className?: string; stroke?: number }> = ({
  d,
  className = "h-5 w-5",
  stroke = 1.7,
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={d} />
  </svg>
);

/* ───────── مدیریت پشته‌ی مودال‌ها (Esc فقط بالاترین را می‌بندد + قفل اسکرول) ───────── */
const stack: symbol[] = [];
let lockCount = 0;

interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  /** نوار ثابت زیر عنوان (مثلاً جستجو) که با محتوا اسکرول نمی‌شود */
  toolbar?: React.ReactNode;
  /** نوار ثابت پایین (دکمه‌ها) */
  footer?: React.ReactNode;
  /** ارتفاع ثابت و بلند (برای لیست‌های طولانی) */
  tall?: boolean;
}

/**
 * موبایل: Bottom Sheet تمام‌عرض؛ دسکتاپ: دیالوگ وسط صفحه.
 */
export const ModalShell: React.FC<ModalShellProps> = ({ title, subtitle, onClose, children, toolbar, footer, tall }) => {
  const idRef = useRef<symbol>(Symbol("modal"));
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = idRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    stack.push(id);
    if (lockCount++ === 0) document.body.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack[stack.length - 1] === id) {
        e.stopPropagation();
        closeRef.current();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      const i = stack.indexOf(id);
      if (i >= 0) stack.splice(i, 1);
      if (--lockCount === 0) document.body.style.overflow = "";
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0D0F23]/45 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`flex w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-[#E4E5F0] bg-[#FAFAFE] shadow-2xl outline-none sm:rounded-3xl ${
          tall ? "h-[92%] sm:h-[82%]" : "max-h-[92%] sm:max-h-[88%]"
        }`}
      >
        {/* دستگیره‌ی بالای Bottom Sheet (فقط موبایل) */}
        <div aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[#E4E5F0] sm:hidden" />

        <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-3 pt-3 sm:px-6 sm:pt-5">
          <div className="min-w-0">
            <h2 className="text-base font-black leading-7 text-[#0D0F23] sm:text-lg">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs leading-6 text-[#6C7193]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={() => closeRef.current()}
            aria-label={t("common.actions.close")}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#6C7193] transition hover:bg-[#F3F2FB] hover:text-[#0D0F23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B47FB]"
          >
            <Icon d={ICONS.x} />
          </button>
        </div>

        {toolbar && <div className="shrink-0 space-y-2.5 border-b border-[#E4E5F0] px-4 pb-3 sm:px-6">{toolbar}</div>}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-[#E4E5F0] bg-white/70 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalShell;