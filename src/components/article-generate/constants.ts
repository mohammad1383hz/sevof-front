// src/components/article-generate/constants.ts
import type { ArticleStatus } from "../../types";
import { t } from "../../i18n";

export const POLL_INTERVAL_MS = 4000;

export const IN_PROGRESS_STATUSES: ArticleStatus[] = [
  "pending",
  "creating_brief",
  "generating_outline",
  "generating_sections",
  "generating_meta",
  "reviewing",
];
// توجه: paused_credit عمداً این‌جا نیست — یعنی وقتی مقاله paused_credit شد،
// isInProgress باید false برگردونه تا پولینگ خودکار متوقف شه (که همین الان هم درسته چون داخل لیست نبود)
export const isInProgress = (s: ArticleStatus) => IN_PROGRESS_STATUSES.includes(s);

export const STEPS = [
  { key: "brief",    get label() { return t("article.steps.brief"); },    get hint() { return t("article.steps.briefHint"); } },
  { key: "outline",  get label() { return t("article.steps.outline"); },  get hint() { return t("article.steps.outlineHint"); } },
  { key: "sections", get label() { return t("article.steps.sections"); }, get hint() { return t("article.steps.sectionsHint"); } },
  { key: "meta",     get label() { return t("article.steps.meta"); },     get hint() { return t("article.steps.metaHint"); } },
  { key: "review",   get label() { return t("article.steps.review"); },   get hint() { return t("article.steps.reviewHint"); } },
  { key: "done",     get label() { return t("article.steps.done"); },     get hint() { return t("article.steps.doneHint"); } },
] as const;

export const STATUS_TO_STEP: Record<ArticleStatus, number> = {
  pending: 0,
  creating_brief: 0,
  generating_outline: 1,
  generating_sections: 2,
  generating_meta: 3,
  reviewing: 4,
  completed: 5,
  failed: -1,          // از روی داده‌های موجود محاسبه می‌شود
  paused_credit: -1,   // ← اضافه شد؛ همون منطق failed رو برای محاسبه‌ی step از StepTimeline بگیره
};

export const SECTION_TYPE_LABELS: Record<string, string> = {
  get introduction() { return t("article.sectionType.introduction"); },
  get section() { return t("article.sectionType.section"); },
  get faq() { return t("article.sectionType.faq"); },
  get conclusion() { return t("article.sectionType.conclusion"); },
};

export const INTENT_LABELS: Record<string, string> = {
  get informational() { return t("analyze.research.intent.informational"); },
  get commercial() { return t("analyze.research.intent.commercial"); },
  get transactional() { return t("analyze.research.intent.transactional"); },
  get navigational() { return t("analyze.research.intent.navigational"); },
};

export const BREAKDOWN_LABELS: Record<string, string> = {
  get intent_match() { return t("article.breakdown.intent_match"); },
  get keyword_usage() { return t("article.breakdown.keyword_usage"); },
  get entity_coverage() { return t("article.breakdown.entity_coverage"); },
  get completeness() { return t("article.breakdown.completeness"); },
  get readability() { return t("article.breakdown.readability"); },
  get structure() { return t("article.breakdown.structure"); },
};

export const TARGET_TYPE_LABELS: Record<string, string> = {
  get title() { return t("article.target.title"); },
  get meta_title() { return t("article.target.meta_title"); },
  get meta_description() { return t("article.target.meta_description"); },
  get excerpt() { return t("article.target.excerpt"); },
  get general() { return t("article.target.general"); },
  get section() { return t("article.target.section"); },
  get faq() { return t("article.target.faq"); },
  get article() { return t("article.target.article"); },
};