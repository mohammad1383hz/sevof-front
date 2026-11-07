// src/components/article-generate/chatTarget.ts
import type {
  Article,
  ArticleFaqItem,
  ArticleSection,
  ArticleTargetRef,
  ArticleTargetType,
  ArticleTargetValue,
} from "../../types";
import { t } from "../../i18n";

export interface ChatTargetSelection {
  type: ArticleTargetType;
  /** section: توکن بخش، faq: ایندکس سؤال */
  id: string | number | null;
  label: string;
  value: ArticleTargetValue;
}

export const CHAT_DRAG_MIME = "application/x-article-target";

export function targetFromSection(section: ArticleSection): ChatTargetSelection {
  return {
    type: "section",
    id: section.id,
    label: section.heading,
    value: section.content ?? "",
  };
}

export function targetFromFaq(index: number, item: ArticleFaqItem): ChatTargetSelection {
  return {
    type: "faq",
    id: index,
    label: item.question || t("article.target.question", { index: index + 1 }),
    value: item,
  };
}

const META_FIELD_LABELS: Record<string, string> = {
  get title() { return t("article.target.title"); },
  get meta_title() { return t("article.target.metaTitleLong"); },
  get meta_description() { return t("article.target.metaDescriptionLong"); },
  get excerpt() { return t("article.target.excerpt"); },
  get general() { return t("article.target.general"); },
};

export function targetFromField(
  type: "title" | "meta_title" | "meta_description" | "excerpt" | "general",
  article: Article
): ChatTargetSelection {
  const valueMap: Record<string, string> = {
    title: article.title ?? "",
    meta_title: article.meta_title ?? "",
    meta_description: article.meta_description ?? "",
    excerpt: article.excerpt ?? "",
    general: article.content ?? "",
  };
  return { type, id: null, label: META_FIELD_LABELS[type], value: valueMap[type] };
}

export function serializeDrag(target: ChatTargetSelection): string {
  return JSON.stringify(target);
}

export function parseDrag(raw: string): ChatTargetSelection | null {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.type === "string" ? (parsed as ChatTargetSelection) : null;
  } catch {
    return null;
  }
}

/** نتیجه‌ی apply شده از سرور (چت یا ویرایش دستی) را روی state محلی مقاله اعمال می‌کند */
export function applyTargetRef(article: Article, target: ArticleTargetRef): Article {
  switch (target.type) {
    case "title":
      return { ...article, title: target.value as string };
    case "meta_title":
      return { ...article, meta_title: target.value as string };
    case "meta_description":
      return { ...article, meta_description: target.value as string };
    case "excerpt":
      return { ...article, excerpt: target.value as string };
    case "general":
      return { ...article, content: target.value as string };
    case "section":
      return {
        ...article,
        sections: article.sections.map((s: ArticleSection) =>
          s.id === target.id ? { ...s, content: target.value as string } : s
        ),
      };
    case "faq":
      return {
        ...article,
        faq: (article.faq ?? []).map((f: ArticleFaqItem, idx: number) =>
          idx === target.id ? (target.value as ArticleFaqItem) : f
        ),
      };
    default:
      return article;
  }
}