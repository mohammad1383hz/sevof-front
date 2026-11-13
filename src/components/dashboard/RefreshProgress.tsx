import React, { useEffect, useState } from "react";
import type { RefreshStage, RefreshStatus } from "../../services/api";
import { fa } from "./refreshLabels";
import { t } from "../../i18n";

interface RefreshProgressProps {
  status: RefreshStatus;
  stage: RefreshStage;
  /** زمان شروع مرحله‌ی فعلی (یا ساخت درخواست) برای شمارش ثانیه‌ها */
  since: string | null;
  /** در ستون باریک (کنار مقاله) مرحله‌ها زیر هم می‌آیند */
  vertical?: boolean;
}

type Step = { key: Exclude<RefreshStage, null> | "queued"; label: string; hint: string };

const GENERATE_STEPS: Step[] = [
  { key: "queued", get label() { return t("growth.progress.queued"); }, get hint() { return t("growth.progress.queuedHint"); } },
  { key: "reading", get label() { return t("growth.progress.reading"); }, get hint() { return t("growth.progress.readingHint"); } },
  { key: "writing", get label() { return t("growth.progress.writing"); }, get hint() { return t("growth.progress.writingHint"); } },
  { key: "checking", get label() { return t("growth.progress.checking"); }, get hint() { return t("growth.progress.checkingHint"); } },
];

/** درصد تقریبی شروع و پایان هر مرحله؛ داخل «نوشتن» نوار آرام جلو می‌رود */
const RANGE: Record<string, [number, number]> = {
  queued: [3, 8],
  reading: [8, 20],
  writing: [20, 85],
  checking: [85, 97],
  publishing: [10, 95],
};

/** زمان معمول هر مرحله (ثانیه)، برای اینکه نوار هیچ‌وقت ثابت نماند */
const EXPECTED_SECONDS: Record<string, number> = { queued: 10, reading: 8, writing: 60, checking: 12, publishing: 25 };

/**
 * نمایش زنده‌ی کار در جریان: مرحله‌ها، ثانیه‌شمار و نوار پیشرفت. اطلاعات از سرور هر چند ثانیه تازه می‌شود؛
 * بین دو بار تازه‌سازی، نوار با زمان سپری‌شده آرام جلو می‌رود تا کاربر ببیند کار متوقف نشده.
 */
const RefreshProgress: React.FC<RefreshProgressProps> = ({ status, stage, since, vertical = false }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const publishing = status === "applying";
  const current = publishing ? "publishing" : stage ?? "queued";
  const elapsed = since ? Math.max(0, Math.round((now - new Date(since).getTime()) / 1000)) : 0;
  const [from, to] = RANGE[current] ?? [5, 90];
  // نزدیک شدن آرام به انتهای بازه، بدون رسیدن کامل به آن
  const ratio = 1 - Math.exp(-elapsed / (EXPECTED_SECONDS[current] ?? 30));
  const percent = Math.round(from + (to - from) * ratio);
  const activeIndex = GENERATE_STEPS.findIndex((s) => s.key === current);

  return (
    <div className="mt-3 rounded-xl border border-[#5B47FB]/20 bg-[#EFEDFF]/30 p-3" role="status" aria-live="polite">
      <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs">
        <span className="font-bold text-[#4935E0]">
          {publishing ? t("growth.progress.publishing") : `${GENERATE_STEPS[Math.max(0, activeIndex)].label}…`}
        </span>
        <span className="text-[#6C7193]">{elapsed > 0 ? t("growth.progress.seconds", { seconds: fa(elapsed) }) : ""}</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white" aria-hidden="true">
        <div className="h-full rounded-full bg-[#5B47FB] transition-[width] duration-1000 ease-linear" style={{ width: `${percent}%` }} />
      </div>

      {!publishing && (
        <ol className={`mt-3 grid gap-1.5 ${vertical ? "" : "sm:grid-cols-4"}`}>
          {GENERATE_STEPS.map((step, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            return (
              <li key={step.key} className="flex items-start gap-1.5 text-[11px] leading-5">
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${
                    done ? "bg-[#5B47FB] text-white" : active ? "border-2 border-[#5B47FB] bg-white" : "border border-[#E4E5F0] bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {done ? "✓" : active ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5B47FB] motion-reduce:animate-none" /> : null}
                </span>
                <span className={done || active ? "text-[#0D0F23]" : "text-[#9A9DB8]"}>
                  <span className={active ? "font-bold" : ""}>{step.label}</span>
                  {active && <span className="block text-[10px] text-[#6C7193]">{step.hint}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-2 text-[10px] leading-5 text-[#6C7193]">
        {publishing
          ? t("growth.progress.sending")
          : t("growth.progress.background")}
      </p>
    </div>
  );
};

export default RefreshProgress;
