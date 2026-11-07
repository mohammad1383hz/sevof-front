// src/components/LanguageSwitcher.tsx
import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LANGUAGES, getLanguageInfo, setLanguage, t, useLang, type Lang } from "../i18n";

interface LanguageSwitcherProps {
  /** Open the menu above the button (e.g. when placed at the bottom of the sidebar). */
  openUp?: boolean;
  /** Stretch the button to the full width of its container. */
  fullWidth?: boolean;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ openUp = false, fullWidth = false, className = "" }) => {
  const lang = useLang();
  const current = getLanguageInfo(lang);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (code: Lang) => {
    setOpen(false);
    if (code !== lang) void setLanguage(code);
  };

  return (
    <div ref={rootRef} className={`relative ${fullWidth ? "w-full" : "inline-block"} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("common.language.label")}
        title={t("common.language.label")}
        className={`flex items-center gap-2 rounded-xl border border-[#DAD5C7] bg-[#FBFAF6] px-3 py-2 text-xs font-bold text-[#1E2A28] transition hover:bg-[#EFEDE6] ${
          fullWidth ? "w-full" : ""
        }`}
      >
        <Globe className="h-4 w-4 shrink-0 text-[#1B6F63]" />
        <span className={fullWidth ? "flex-1 text-start" : ""}>{current.nativeName}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-[#9BA69F] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("common.language.label")}
          className={`absolute z-[80] min-w-[11rem] overflow-hidden rounded-xl border border-[#DAD5C7] bg-white py-1 shadow-lg ${
            openUp ? "bottom-full mb-2" : "top-full mt-2"
          } ${fullWidth ? "inset-x-0" : "end-0"}`}
        >
          {LANGUAGES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                type="button"
                lang={l.locale}
                dir={l.dir}
                onClick={() => choose(l.code)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-[#EFEDE6] ${
                  l.code === lang ? "font-bold text-[#1B6F63]" : "text-[#1E2A28]"
                }`}
              >
                <span aria-hidden="true">{l.flag}</span>
                <span className="flex-1 text-start">{l.nativeName}</span>
                {l.code === lang && <Check className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
