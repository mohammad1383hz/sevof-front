import { useNavigate } from "react-router-dom";
import { t } from "../../../i18n";

export function GenerateIdeasBar({
  onGenerate,
  generating,
  disabled,
  limitMessage = t("analyze.ideasBar.limit"),
}: {
  onGenerate: () => void;
  generating: boolean;
  disabled: boolean;
  remaining: number;
  onNewAnalysis: () => void;
  limitMessage?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="border-t border-[#E4E5F0]/60 bg-[#FAFAFE]/80 backdrop-blur-md">
      <div className="max-w-5xl md:max-w-6xl xl:max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3">
        {!disabled ? (
          <button
            type="button"
            onClick={onGenerate}
            disabled={generating}
            className="rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#9B5CFF] text-white text-sm font-bold px-6 py-2.5 hover:from-[#6C5BFF] hover:to-[#5B47FB] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5B47FB]/25 flex items-center gap-2"
          >
            {generating ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("analyze.ideasBar.generating")}
              </>
            ) : (
              <>{t("analyze.ideasBar.cta")}</>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/subscription")}
            className="flex items-center gap-2 rounded-2xl bg-[#F3F2FB] text-[#9A9DB8] text-sm font-bold px-6 py-2.5 cursor-pointer border border-[#E4E5F0] hover:bg-[#EFEDFF] hover:text-[#5B47FB] hover:border-[#5B47FB]/30 transition-all duration-300"
            title={limitMessage}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            {limitMessage}
          </button>
        )}
      </div>
    </div>
  );
}
