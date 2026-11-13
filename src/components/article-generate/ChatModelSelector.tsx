// src/components/article-generate/ChatModelSelector.tsx
import React, { useEffect, useRef, useState } from "react";
import { CHAT_MODELS } from "./chatModels";
import type { ChatModelOption } from "./chatModels";
import { t } from "../../i18n";
interface ChatModelSelectorProps {
  /** شناسه‌ی مدل انتخاب‌شده‌ی فعلی */
  selectedModelId: string;
  /** وقتی کاربر یک مدل مجاز را انتخاب می‌کند */
  onSelect: (modelId: string) => void;
  /**
   * آیا پلن کاربر رایگان است — اگر true باشد، فقط مدلی که proOnly ندارد
   * قابل انتخاب است؛ بقیه‌ی مدل‌ها قفل نمایش داده می‌شوند.
   */
  isFreePlan: boolean;
  /** کلیک روی یک مدلِ قفل‌شده — معمولاً هدایت به صفحه‌ی اشتراک */
  onRequireUpgrade: () => void;
}

/**
 * دکمه‌ی انتخاب مدل چت — آیکنِ گرادیانی + نام مدل + فلش، با کلیک یک
 * دراپ‌داون از بقیه‌ی مدل‌ها باز می‌شود. برای کاربر پلن رایگان، مدل‌های
 * proOnly با بج «Pro» و آیکن قفل نمایش داده می‌شوند و کلیک روی آن‌ها
 * کاربر را به صفحه‌ی اشتراک هدایت می‌کند (به‌جای انتخاب مدل).
 */
export const ChatModelSelector: React.FC<ChatModelSelectorProps> = ({
  selectedModelId,
  onSelect,
  isFreePlan,
  onRequireUpgrade,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedModel = CHAT_MODELS.find((m) => m.id === selectedModelId) ?? CHAT_MODELS[0];

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handlePick = (model: ChatModelOption) => {
    const locked = isFreePlan && model.proOnly;
    if (locked) {
      setOpen(false);
      onRequireUpgrade();
      return;
    }
    onSelect(model.id);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-[#E4E5F0] bg-[#F3F2FB] px-2.5 py-1 text-[10px] font-bold text-[#5A5F80] transition-colors hover:bg-[#F6F6FB]"
      >
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br rtl:bg-gradient-to-bl from-[#5B47FB] to-[#9B5CFF] text-white">
          <svg className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a1 1 0 01.894.553l1.382 2.764 3.05.443a1 1 0 01.554 1.706l-2.207 2.152.521 3.038a1 1 0 01-1.451 1.054L10 12.347l-2.723 1.363a1 1 0 01-1.451-1.054l.521-3.038-2.207-2.152a1 1 0 01.554-1.706l3.05-.443L9.106 2.553A1 1 0 0110 2z" />
          </svg>
        </span>
        {selectedModel.label}
        <svg
          className={`h-3 w-3 text-[#9A9DB8] transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full end-0 z-20 mb-1.5 w-56 overflow-hidden rounded-2xl border border-[#E4E5F0] bg-white shadow-lg shadow-[#0D0F23]/10">
          <div className="border-b border-[#E4E5F0]/60 px-3 py-2">
            <p className="text-[10px] font-black text-[#9A9DB8]">{t("article.models.choose")}</p>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {CHAT_MODELS.map((model) => {
              const locked = isFreePlan && model.proOnly;
              const isActive = model.id === selectedModelId;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => handlePick(model)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-start transition-colors ${
                    locked
                      ? "cursor-pointer opacity-60 hover:bg-[#F6F6FB]"
                      : isActive
                      ? "bg-[#EFEDFF]"
                      : "hover:bg-[#F6F6FB]"
                  }`}
                >
                  <span className="min-w-0">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-bold ${
                        isActive ? "text-[#4935E0]" : "text-[#5A5F80]"
                      }`}
                    >
                 {model.label}
{model.proOnly && (
  <span
    className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-black text-white ${
      isFreePlan
        ? "bg-gradient-to-r rtl:bg-gradient-to-l from-amber-500 to-orange-500"
        : "bg-gradient-to-r rtl:bg-gradient-to-l from-emerald-500 to-green-600"
    }`}
  >
    {t("layout.plan.pro")}
  </span>
)}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] font-medium text-[#9A9DB8]">
                      {model.description}
                    </span>
                  </span>

                  {locked ? (
                    <svg className="h-3.5 w-3.5 shrink-0 text-[#9A9DB8]" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v7a2 2 0 002 2h8a2 2 0 002-2V9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    isActive && (
                      <svg className="h-3.5 w-3.5 shrink-0 text-[#5B47FB]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
                      </svg>
                    )
                  )}
                </button>
              );
            })}
          </div>

       {isFreePlan && (
  <button
    type="button"
    onClick={onRequireUpgrade}
    className="w-full border-t border-[#E4E5F0]/60 bg-[#F3F2FB] px-3 py-2 text-start"
  >
    <span className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline">
      {t("article.models.upgrade")}
    </span>
  </button>
)}
        </div>
      )}
    </div>
  );
};