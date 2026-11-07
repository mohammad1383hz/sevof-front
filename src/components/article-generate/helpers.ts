// src/components/article-generate/helpers.ts
import type { Article } from "../../types";
import { STATUS_TO_STEP } from "./constants";

/** برای مقاله failed، از روی داده‌های موجود تشخیص می‌دهیم کدام مرحله شکست خورده */
export function failedStepIndex(article: Article): number {
  if (!article.brief) return 0;
  if (!article.outline) return 1;

  const allGenerated =
    article.sections.length > 0 &&
    article.sections.every((s) => s.status === "generated");
  if (!allGenerated) return 2;

  // مرحله متا/سئو معمولاً کل مقاله را fail نمی‌کند (خطای آن جدا گرفته و رد می‌شود)،
  // اما اگر هنوز اجرا نشده یا در حال اجراست، تایم‌لاین را همان‌جا نگه می‌داریم.
  if (!article.meta_title) return 3;

  return 4;
}

export function activeStepIndex(article: Article): number {
  if (article.status === "failed") return failedStepIndex(article);
  return STATUS_TO_STEP[article.status];
}

export const scoreColor = (score: number): string =>
  score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600";

export const scoreBarColor = (score: number): string =>
  score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500";