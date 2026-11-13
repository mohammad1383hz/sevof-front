// src/components/article-generate/ArticleImagesPanel.tsx
// خروجی تصاویر مقاله کنار «کپی Markdown»: هر تصویر با نام فایل، alt، دانلود WebP و کپی alt
import React, { useState } from "react";
import { imageService } from "../../services/api";
import { copyText } from "../../utils/copyArticle";
import type { ArticleImageItem } from "../../utils/articleImages";
import { Spinner } from "./UiBits";
import { t } from "../../i18n";

function saveBlob(blob: Blob, fileName: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

const ImageRow: React.FC<{ item: ArticleImageItem }> = ({ item }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async () => {
    setDownloading(true);
    setError(null);
    try {
      saveBlob(await imageService.webp(item.url), item.fileName);
    } catch {
      setError(t("growth.images.downloadFailed"));
    } finally {
      setDownloading(false);
    }
  };

  const copyAlt = async () => {
    try {
      await copyText(item.alt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("growth.images.copyFailed"));
    }
  };

  return (
    <li className="flex flex-col gap-2.5 rounded-xl border border-[#E4E5F0] bg-white p-2.5 sm:flex-row sm:items-center">
      <img src={item.url} alt={item.alt} loading="lazy" className="h-16 w-full rounded-lg bg-[#F6F6FB] object-cover sm:h-14 sm:w-20 sm:shrink-0" />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-[10px] font-bold text-[#9A9DB8] sm:text-[11px]">{item.label}</p>
        <p dir="ltr" className="truncate text-right font-mono text-[11px] font-bold text-[#0D0F23]" title={item.fileName}>
          {item.fileName}
        </p>
        <p className="text-[11px] leading-5 text-[#3B3F5C]">
          <span className="font-bold text-[#5B47FB]">alt: </span>
          {item.alt || <span className="text-[#9A9DB8]">{t("growth.images.noAlt")}</span>}
        </p>
        {error && <p className="text-[10px] font-bold text-rose-500">{error}</p>}
      </div>
      <div className="flex gap-1.5 sm:flex-col">
        <button
          type="button"
          onClick={download}
          disabled={downloading}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#5B47FB] px-3 py-1.5 text-[10px] font-bold text-white hover:bg-[#4935E0] disabled:opacity-60 sm:text-[11px]"
        >
          {downloading ? <Spinner className="h-3.5 w-3.5" /> : `⬇ ${t("growth.images.download")}`}
        </button>
        <button
          type="button"
          onClick={copyAlt}
          disabled={!item.alt}
          className="flex-1 rounded-lg border border-[#E4E5F0] px-3 py-1.5 text-[10px] font-bold text-[#0D0F23] hover:border-[#5B47FB]/50 hover:text-[#5B47FB] disabled:opacity-40 sm:text-[11px]"
        >
          {copied ? `✓ ${t("growth.images.copied")}` : t("growth.images.copyAlt")}
        </button>
      </div>
    </li>
  );
};

export const ArticleImagesPanel: React.FC<{ items: ArticleImageItem[] }> = ({ items }) => (
  <div className="mb-3 rounded-xl border border-[#5B47FB]/20 bg-[#F6F6FB] p-2.5 sm:mb-4 sm:p-3">
    <p className="mb-2 text-[10px] leading-5 text-[#3B3F5C] sm:text-[11px]">
      {t("growth.images.hint")}
    </p>
    <ul className="space-y-2">
      {items.map((item) => (
        <ImageRow key={item.key} item={item} />
      ))}
    </ul>
  </div>
);
