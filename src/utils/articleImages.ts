// src/utils/articleImages.ts
// فهرست تصاویر مقاله (شاخص + گالری بخش‌ها) با نام فایل WebP و alt، برای پنل «خروجی تصاویر»
import type { Article } from "../types";
import { t } from "../i18n";
import type { SectionGalleryImage } from "../components/article-generate/GalleryImageCard";

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL ?? "";

const resolveUrl = (url: string) => (url.startsWith("http") ? url : `${UPLOADS_URL}/${url.replace(/^\/+/, "")}`);

export interface ArticleImageItem {
  key: string;
  label: string;
  url: string;
  alt: string;
  fileName: string; // با پسوند .webp
}

/** نام فایل همان نام سئوی ذخیره‌شده در بک‌اند است؛ نام‌های قدیمی بی‌معنا (img_...) با slug مقاله جایگزین می‌شوند */
function fileNameFor(url: string, fallback: string): string {
  const base = decodeURIComponent(url.split(/[?#]/)[0].split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");
  return `${base && !base.startsWith("img_") ? base : fallback}.webp`;
}

export function collectArticleImages(article: Article): ArticleImageItem[] {
  const slug = (article.slug ?? "").trim() || `article-${article.id}`;
  const items: ArticleImageItem[] = [];

  if (article.image_status === "generated" && article.image_url) {
    items.push({
      key: "featured",
      label: t("growth.images.featured"),
      url: resolveUrl(article.image_url),
      alt: (article.image_alt ?? article.title ?? "").trim(),
      fileName: fileNameFor(article.image_url, slug),
    });
  }

  const sections = [...(article.sections ?? [])].sort((a, b) => a.position - b.position) as Array<
    Article["sections"][number] & { images_after?: SectionGalleryImage[] }
  >;
  for (const s of sections) {
    for (const img of s.images_after ?? []) {
      if (!img.url || img.status === "failed" || img.status === "generating") continue;
      items.push({
        key: `g-${img.gallery_index}`,
        label: t("growth.images.after", { heading: s.heading }),
        url: resolveUrl(img.url),
        alt: (img.alt ?? "").trim(),
        fileName: fileNameFor(img.url, `${slug}-${items.length + 1}`),
      });
    }
  }

  return items;
}

