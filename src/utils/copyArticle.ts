// src/utils/copyArticle.ts
// npm i marked dompurify
// (dompurify نسخه‌ی ۳.۲ به بالا تایپ خودش را دارد؛ اگر نسخه‌ی قدیمی‌تر است: npm i -D @types/dompurify)

import { marked } from "marked";
import DOMPurify from "dompurify";
import { t } from "../i18n";

/* ───────── انواع (ساختاری؛ نیازی به import از types نیست) ───────── */

interface ImageLike {
  url?: string | null;
  image_url?: string | null;
  src?: string | null;
  alt?: string | null;
  order?: number | null;
}

interface SectionLike {
  heading?: string | null;
  content?: string | null;
  position?: number | null;
  images_after?: ImageLike[] | null;
}

interface ArticleLike {
  title?: string | null;
  content?: string | null;
  sections?: SectionLike[] | null;
}

export interface CopyOptions {
  /** آدرس سایت وردپرس؛ برای تبدیل لینک/تصویر نسبی (/page) به آدرس کامل */
  siteUrl?: string;
  /** عنوان مقاله به‌صورت H1 اول خروجی بیاید (پیش‌فرض true) */
  includeTitle?: boolean;
  /** تصاویر گالری بخش‌ها بیایند (پیش‌فرض true) */
  includeImages?: boolean;
  /** Apply left-to-right direction and left alignment to exported HTML (enabled by default). */
  rtl?: boolean;
  /** منبع محتوا: sections (پیش‌فرض، مثل انتشار) یا content (متن کل مقاله) */
  source?: "sections" | "content";
}

/* ───────── لینک‌ها ───────── */

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
// پسوند فایل‌هایی که اشتباهاً شبیه دامنه دیده می‌شوند (page.html، photo.png، ...)
const FILE_EXT =
  /\.(html?|php|aspx?|pdf|png|jpe?g|gif|webp|avif|svg|ico|docx?|xlsx?|pptx?|txt|xml|css|js|json|rar|mp[34])$/i;

function isBareDomain(href: string): boolean {
  const host = href.split(/[/?#]/)[0];
  if (!/^[^\s@]+\.[a-z]{2,24}(:\d+)?$/i.test(host)) return false;
  if (/^www\./i.test(host)) return true;
  return !FILE_EXT.test(host);
}

function normalizeUrl(raw: string, siteUrl?: string): string {
  const url = raw.trim();
  if (!url || url.startsWith("#") || HAS_SCHEME.test(url)) return url;

  if (url.startsWith("//")) return `https:${url}`;
  if (!url.startsWith("/") && isBareDomain(url)) return `https://${url}`;

  // لینک نسبی → با آدرس سایت کامل می‌شود
  if (siteUrl) {
    try {
      const resolved = new URL(url, siteUrl);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        return resolved.toString();
      }
    } catch {
      /* siteUrl نامعتبر: لینک همان‌طور می‌ماند */
    }
  }
  return url;
}

/* ───────── Markdown → HTML ───────── */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const parseBlock = (md: string) => marked.parse(md ?? "", { gfm: true, async: false }) as string;
const parseInline = (md: string) => marked.parseInline(md ?? "", { gfm: true, async: false }) as string;

const imgUrl = (img: ImageLike): string | null => {
  const u = (img.url ?? img.image_url ?? img.src ?? "").trim();
  return u || null;
};

function getSections(article: ArticleLike): SectionLike[] {
  return (article.sections ?? [])
    .filter((s) => (s.content ?? "").trim() !== "")
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function sortedImages(images?: ImageLike[] | null): ImageLike[] {
  return (images ?? [])
    .filter((i) => imgUrl(i))
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** اگر content با همان H1 عنوان شروع شده، حذفش می‌کنیم تا عنوان دوبار نیاید */
const stripLeadingH1 = (md: string) => (md ?? "").replace(/^\s*#\s+.+\n+/, "");

function buildRawHtml(article: ArticleLike, opts: CopyOptions): string {
  const { includeTitle = true, includeImages = true, source = "sections" } = opts;
  const parts: string[] = [];

  if (includeTitle && article.title?.trim()) {
    parts.push(`<h1>${esc(article.title.trim())}</h1>`);
  }

  const sections = source === "sections" ? getSections(article) : [];

  if (sections.length === 0) {
    parts.push(parseBlock(stripLeadingH1(article.content ?? "")));
  } else {
    for (const s of sections) {
      const heading = (s.heading ?? "").trim();
      if (heading) parts.push(`<h2>${parseInline(heading)}</h2>`);
      parts.push(parseBlock(s.content ?? ""));

      if (includeImages) {
        for (const img of sortedImages(s.images_after)) {
          parts.push(
            `<figure><img src="${esc(imgUrl(img)!)}" alt="${esc(img.alt ?? "")}"></figure>`,
          );
        }
      }
    }
  }

  return parts.filter(Boolean).join("\n\n");
}

/** HTML نهایی آماده‌ی وردپرس */
export function buildWordPressHtml(article: ArticleLike, opts: CopyOptions = {}): string {
  const { siteUrl, rtl = false } = opts;

  // اول سانیتایز (XSS/اسکریپت/javascript:)، بعد اصلاح لینک‌ها
  const clean = DOMPurify.sanitize(buildRawHtml(article, opts));
  const doc = new DOMParser().parseFromString(clean, "text/html");

  doc.querySelectorAll("a[href]").forEach((a) => {
    a.setAttribute("href", normalizeUrl(a.getAttribute("href") ?? "", siteUrl));
  });

  doc.querySelectorAll("img[src]").forEach((img) => {
    img.setAttribute("src", normalizeUrl(img.getAttribute("src") ?? "", siteUrl));
  });

  if (rtl) {
    doc.body
      .querySelectorAll("p,h1,h2,h3,h4,h5,h6,ul,ol,blockquote,table")
      .forEach((el) => {
        el.setAttribute("dir", "rtl");
        if (!el.getAttribute("style")) el.setAttribute("style", "text-align: left;");
      });
  }

  return doc.body.innerHTML.trim();
}

/* ───────── Markdown کامل ───────── */

export function buildMarkdown(article: ArticleLike, opts: CopyOptions = {}): string {
  const { includeTitle = true, includeImages = true, siteUrl, source = "sections" } = opts;
  const parts: string[] = [];

  if (includeTitle && article.title?.trim()) parts.push(`# ${article.title.trim()}`);

  const sections = source === "sections" ? getSections(article) : [];

  if (sections.length === 0) {
    parts.push(stripLeadingH1(article.content ?? "").trim());
  } else {
    for (const s of sections) {
      const heading = (s.heading ?? "").trim();
      if (heading) parts.push(`## ${heading}`);
      parts.push((s.content ?? "").trim());

      if (includeImages) {
        for (const img of sortedImages(s.images_after)) {
          const alt = (img.alt ?? "").replace(/[\[\]]/g, "");
          parts.push(`![${alt}](${normalizeUrl(imgUrl(img)!, siteUrl)})`);
        }
      }
    }
  }

  return parts.filter(Boolean).join("\n\n") + "\n";
}

/* ───────── کلیپ‌بورد ───────── */

async function writeClipboard(html: string | null, text: string): Promise<void> {
  if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
    try {
      const data: Record<string, Blob> = {
        "text/plain": new Blob([text], { type: "text/plain" }),
      };
      if (html) data["text/html"] = new Blob([html], { type: "text/html" });
      await navigator.clipboard.write([new ClipboardItem(data)]);
      return;
    } catch {
      /* ادامه با روش قدیمی */
    }
  }

  // روش قدیمی: با رویداد copy هر دو فرمت را مستقیم در کلیپ‌بورد می‌گذاریم
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  document.body.appendChild(ta);
  ta.select();

  const onCopy = (e: ClipboardEvent) => {
    e.preventDefault();
    e.clipboardData?.setData("text/plain", text);
    if (html) e.clipboardData?.setData("text/html", html);
  };
  document.addEventListener("copy", onCopy);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } finally {
    document.removeEventListener("copy", onCopy);
    document.body.removeChild(ta);
  }
  if (!ok) throw new Error(t("article.copy.failed"));
}

/**
 * کپی کد وردپرس:
 * - text/html  → پیست در Visual/Gutenberg فرمت‌شده می‌آید
 * - text/plain → سورس HTML؛ پیست در Code Editor یا بلوک Custom HTML کد می‌آید
 */
export async function copyArticleForWp(article: ArticleLike, opts?: CopyOptions): Promise<void> {
  const html = buildWordPressHtml(article, opts);
  await writeClipboard(html, html);
}

/** کپی متن ساده (مثلاً alt تصویر) */
export const copyText = (text: string): Promise<void> => writeClipboard(null, text);

/** کپی Markdown خام (عنوان + همه‌ی بخش‌ها) */
export async function copyArticleMarkdown(article: ArticleLike, opts?: CopyOptions): Promise<void> {
  await writeClipboard(null, buildMarkdown(article, opts));
}
