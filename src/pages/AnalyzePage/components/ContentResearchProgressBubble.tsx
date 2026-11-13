import { AiBubble } from "./AiBubble";
import { t } from "../../../i18n";

export function ContentResearchProgressBubble({
  type,
  error,
}: {
  type: "keyword_clusters" | "competitor_gaps";
  error?: string | null;
}) {
  const isClusters = type === "keyword_clusters";

  if (error) {
    return (
      <AiBubble
        icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 9v3.75m0 3h.008M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>}
        title={t("analyze.research.failed")}
      >
        <p className="text-xs leading-6 text-[#B3453A]">{error}</p>
      </AiBubble>
    );
  }
  const steps = isClusters
    ? [t("analyze.research.clusterSteps.read"), t("analyze.research.clusterSteps.build"), t("analyze.research.clusterSteps.estimate")]
    : [t("analyze.research.gapSteps.context"), t("analyze.research.gapSteps.competitors"), t("analyze.research.gapSteps.gaps")];

  return (
    <AiBubble
      icon={<span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
      title={isClusters ? t("analyze.research.clustersTitle") : t("analyze.research.gapsTitle")}
    >
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3 text-xs text-[#0D0F23]">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${index === steps.length - 1 ? "bg-[#EFEDFF] text-[#5B47FB]" : "bg-[#F3F2FB] text-[#7D819F]"}`}>
              {index === steps.length - 1 ? <span className="h-2.5 w-2.5 rounded-full border-2 border-[#5B47FB]/30 border-t-[#5B47FB] animate-spin" /> : index + 1}
            </span>
            {step}
          </div>
        ))}
      </div>
    </AiBubble>
  );
}
