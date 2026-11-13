import { t } from "../../../i18n";

/** بابل سمت راست — پیام کاربر */
export function UserBubble({ domain }: { domain: string }) {
  return (
    <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-xs">
        <div className="bg-gradient-to-br rtl:bg-gradient-to-bl from-[#5B47FB] to-[#9B5CFF] text-white rounded-3xl rounded-se-lg px-5 py-3 shadow-lg shadow-[#5B47FB]/20">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#EFEDFF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span dir="ltr" className="font-bold text-sm">{domain}</span>
          </div>
          <p className="text-xs text-[#EFEDFF] mt-1">{t("analyze.user.start")}</p>
        </div>
      </div>
    </div>
  );
}
