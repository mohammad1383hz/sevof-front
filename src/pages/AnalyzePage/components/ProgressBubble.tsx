import type { Phase } from "../types";
import { PHASE_LABELS } from "../constants";
import { AiBubble } from "./AiBubble";
import { SpinnerIcon } from "./SpinnerIcon";
import { t } from "../../../i18n";

/** نمایش پیشرفت تحلیل */
export function ProgressBubble({ phase }: { phase: Phase }) {
  const steps = ["queued", "crawling", "analyzing"] as const;
  const currentIdx = steps.indexOf(phase as typeof steps[number]);

  return (
    <AiBubble icon={<SpinnerIcon />} title={t("analyze.progress.title")}>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const isDone = i < currentIdx;
          const isActive = i === currentIdx;
          return (
            <div key={step} className="flex items-center gap-3">
              <div className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                isDone ? "bg-[#EFEDFF] text-[#4935E0]" :
                isActive ? "bg-[#EFEDFF] text-[#5B47FB]" :
                "bg-[#F3F2FB] text-[#E4E5F0]"
              }`}>
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : isActive ? (
                  <div className="h-3.5 w-3.5 border-2 border-[#5B47FB]/30 border-t-[#5B47FB] rounded-full animate-spin" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-[#E4E5F0]" />
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold ${
                  isDone ? "text-[#0D0F23]" : isActive ? "text-[#0D0F23]" : "text-[#9A9DB8]"
                }`}>
                  {t(PHASE_LABELS[step])}
                </p>
                {isActive && <p className="text-xs text-[#5B47FB] mt-0.5">{t("analyze.progress.inProgress")}</p>}
                {isDone && <p className="text-xs text-[#4935E0] mt-0.5">{t("analyze.progress.done")}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-[#0D0F23]/70 mt-4 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t("analyze.progress.hint")}
      </p>
    </AiBubble>
  );
}
