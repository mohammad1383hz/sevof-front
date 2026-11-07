// src/components/article-generate/StepTimeline.tsx
import React from "react";
import type { Article } from "../../types";
import { STEPS } from "./constants";
import { activeStepIndex } from "./helpers";
import { CheckIcon, Spinner } from "./UiBits";

export const StepTimeline: React.FC<{ article: Article }> = ({ article }) => {
  const active = activeStepIndex(article);
  const failed = article.status === "failed";
  const completed = article.status === "completed";

  return (
    <div className="rounded-2xl border border-[#DAD5C7] bg-white p-5">
      <div className="flex items-start justify-between gap-1">
        {STEPS.map((step, i) => {
          const isDone = completed || i < active;
          const isActive = !completed && i === active;
          const isFailedHere = failed && i === active;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-black transition-colors ${
                    isFailedHere
                      ? "border-rose-500 bg-rose-50 text-rose-600"
                      : isDone
                      ? "border-[#1B6F63] bg-[#1B6F63] text-white"
                      : isActive
                      ? "border-[#1B6F63] bg-[#DCEFEA] text-[#1B6F63]"
                      : "border-[#DAD5C7] bg-white text-[#000000]/60"
                  }`}
                >
                  {isFailedHere ? "!" : isDone ? <CheckIcon /> : isActive ? <Spinner /> : i + 1}
                </div>
                <div className="text-center">
                  <div
                    className={`text-xs font-bold ${
                      isFailedHere ? "text-rose-600" : isDone || isActive ? "text-[#1E2A28]" : "text-[#000000]/60"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[10px] text-[#000000]/60 mt-0.5 hidden sm:block">{step.hint}</div>
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
    </div>
  );
};