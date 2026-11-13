import { t } from "../../../i18n";
export function InputBar({
  domain,
  onChange,
  onSubmit,
  submitting,
  error,
  disabled,
}: {
  domain: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  disabled: boolean;
}) {
  return (
    <div className="w-full bg-transparent">
      <div className="max-w-5xl md:max-w-6xl xl:max-w-7xl mx-auto px-6 py-2">
        {error && (
          <div className="mb-2 p-2.5 rounded-xl bg-[#F7EEEA] border border-[#E3C4BC] flex items-center gap-2 text-xs text-[#B3453A]">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="flex gap-3 items-center">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 start-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#0D0F23]/60 group-focus-within:text-[#5B47FB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <input
              type="text"
              dir="ltr"
              placeholder={t("analyze.input.placeholder")}
              value={domain}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\x00-\x7F]/g, "");
                onChange(cleaned);
              }}
              disabled={disabled}
              className="w-full rounded-2xl bg-[#F3F2FB] border border-[#E4E5F0] ps-11 pe-4 py-2.5 text-sm text-[#0D0F23] placeholder:text-[#0D0F23]/50 focus:outline-none focus:ring-2 focus:ring-[#5B47FB]/30 focus:border-[#5B47FB] transition-all duration-300 hover:bg-[#FAFAFE] hover:border-[#C9C2AF] disabled:opacity-50"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={submitting || disabled}
            className="rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#4935E0] text-white text-sm font-bold px-6 py-2.5 hover:from-[#6C5BFF] hover:to-[#5B47FB] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-[#5B47FB]/25 hover:shadow-[#5B47FB]/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("common.status.submitting")}
              </>
            ) : (
              <>
                {t("analyze.input.submit")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}