import { IDEA_STEPS } from "../constants";
import { AiBubble } from "./AiBubble";
import { SpinnerIcon } from "./SpinnerIcon";
import { t } from "../../../i18n";

export function IdeaGenerationProgressBubble({
  status,
  error,
  onRetry,
  retrying,
}: {
  status: string | null;
  error: string | null;
  onRetry: () => void;
  retrying: boolean;
}) {
  const currentIdx = IDEA_STEPS.findIndex((s) => s.key === status);
  const failedIdx = error ? currentIdx : -1;

  return (
    <AiBubble icon={<SpinnerIcon />} title={t("analyze.ideas.generatingTitle")}>
      <div className="space-y-3">
        {IDEA_STEPS.map((step, i) => {
          const isDone = failedIdx === -1 && i < currentIdx;
          const isFailed = i === failedIdx;
          const isActive = !isFailed && i === currentIdx;

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                isFailed ? "bg-[#F7EEEA] text-[#B3453A]" :
                isDone ? "bg-[#EFEDFF] text-[#4935E0]" :
                isActive ? "bg-[#EFEDFF] text-[#5B47FB]" :
                "bg-[#F3F2FB] text-[#E4E5F0]"
              }`}>
                {isFailed ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : isDone ? (
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
                  isFailed ? "text-[#B3453A]" :
                  isDone ? "text-[#0D0F23]" :
                  isActive ? "text-[#0D0F23]" : "text-[#9A9DB8]"
                }`}>
                  {t(step.label)}
                </p>
                {isActive && <p className="text-xs text-[#5B47FB] mt-0.5">{t("analyze.progress.inProgress")}</p>}
                {isDone && <p className="text-xs text-[#4935E0] mt-0.5">{t("analyze.progress.done")}</p>}
                {isFailed && <p className="text-xs text-[#B3453A] mt-0.5">{error}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {failedIdx !== -1 && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#B3453A] text-white text-xs font-bold px-4 py-2 hover:bg-[#9C3B31] transition-all disabled:opacity-50"
        >
          {retrying ? (
            <>
              <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("analyze.ideas.retrying")}
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              {t("analyze.ideas.retry")}
            </>
          )}
        </button>
      )}
    </AiBubble>
  );
}
