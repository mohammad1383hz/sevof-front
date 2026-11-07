import React from "react";
import type { ProductArticle } from "../../services/api";
import { CheckIcon, Spinner } from "../article-generate/UiBits";
import { t } from "../../i18n";

const STEPS = [
  { key: "brief", get label() { return t("product.steps.brief"); }, get hint() { return t("product.steps.briefHint"); } },
  { key: "assignments", get label() { return t("product.steps.plan"); }, get hint() { return t("product.steps.planHint"); } },
  { key: "sections", get label() { return t("product.steps.sections"); }, get hint() { return t("product.steps.sectionsHint"); } },
  { key: "meta", get label() { return t("article.steps.meta"); }, get hint() { return t("article.steps.metaHint"); } },
  { key: "done", get label() { return t("article.steps.done"); }, get hint() { return t("article.steps.doneHint"); } },
] as const;

const STATUS_TO_STEP: Record<string, number> = {
  pending: 0,
  creating_brief: 0,
  creating_assignments: 1,
  generating_sections: 2,
  generating_meta: 3,
  completed: 4,
};

/** برای failed / paused_credit مرحله از روی داده‌های موجود حدس زده می‌شود. */
const activeStepIndex = (article: ProductArticle): number => {
  const mapped = STATUS_TO_STEP[article.status];
  if (mapped !== undefined) return mapped;

  if (article.meta_generated_at) return 3;
  if (article.sections?.length) return 2;
  if ((article as any).brief) return 1;
  return 0;
};

export const ProductStepTimeline: React.FC<{ article: ProductArticle }> = ({ article }) => {
  const active = activeStepIndex(article);
  const failed = article.status === "failed";
  const paused = article.status === "paused_credit";
  const completed = article.status === "completed";
  const stopped = failed || paused;

  const doneSections = article.sections?.filter((s) => s.status === "generated").length ?? 0;
  const totalSections = article.sections?.length ?? 0;

  return (
    <div className="rounded-2xl border border-[#DAD5C7] bg-white p-5">
      <div className="flex items-start justify-between gap-1">
        {STEPS.map((step, i) => {
          const isDone = completed || i < active;
          const isActive = !completed && !stopped && i === active;
          const isStoppedHere = stopped && i === active;

          return (
            <React.Fragment key={step.key}>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-black transition-colors ${
                    isStoppedHere
                      ? failed
                        ? "border-rose-500 bg-rose-50 text-rose-600"
                        : "border-amber-500 bg-amber-50 text-amber-600"
                      : isDone
                        ? "border-[#1B6F63] bg-[#1B6F63] text-white"
                        : isActive
                          ? "border-[#1B6F63] bg-[#DCEFEA] text-[#1B6F63]"
                          : "border-[#DAD5C7] bg-white text-[#000000]/60"
                  }`}
                >
                  {isStoppedHere ? "!" : isDone ? <CheckIcon /> : isActive ? <Spinner /> : i + 1}
                </div>
                <div className="text-center">
                  <div
                    className={`text-xs font-bold ${
                      isStoppedHere
                        ? failed
                          ? "text-rose-600"
                          : "text-amber-600"
                        : isDone || isActive
                          ? "text-[#1E2A28]"
                          : "text-[#000000]/60"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="mt-0.5 hidden text-[10px] text-[#000000]/60 sm:block">{step.hint}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mt-4 h-0.5 flex-1 rounded-full ${
                    completed || i < active ? "bg-[#1B6F63]" : "bg-[#DAD5C7]"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {totalSections > 0 && (
        <p className="mt-4 text-center text-[11px] text-[#000000]/60">
          {t("product.steps.written", { done: doneSections, total: totalSections })}
        </p>
      )}
    </div>
  );
};