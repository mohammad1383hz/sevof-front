// src/components/article-generate/BannerCard.tsx
import React, { useEffect, useRef, useState } from "react";
import type { Article } from "../../types";
import { articleService } from "../../services/api";
import { Spinner } from "./UiBits";
import { t } from "../../i18n";

interface BannerCardProps {
  siteId: number | string;
  article: Article;
  onArticleChange: (article: Article) => void;
}

// بنرِ خام را داخل یک سند کامل با اسکریپتِ اندازه‌گیری/مقیاس‌دهی می‌پیچیم
// تا اگر عرضِ واقعیِ بنر از عرضِ پنل بیشتر بود، بدونِ اسکرولِ افقی،
// خودکار کوچک (scale) شود؛ خودِ HTML اصلیِ بنر دست‌نخورده می‌ماند.
//
// نکته‌ی مهم (رفعِ باگِ عرضِ کوچک): #banner-scale-wrapper قبلاً
// display:inline-block بود؛ چون این نوع الِمان shrink-to-fit است (فقط
// به‌اندازه‌ی محتوایِ داخلش عرض می‌گیرد، نه به‌اندازه‌ی فضایِ موجود)،
// width:100% خودِ بنر عملاً رویِ عرضِ طبیعیِ محتوا (نه عرضِ واقعیِ
// iframe) resolve می‌شد — یعنی بنر هیچ‌وقت واقعاً فضایِ موجود را پر
// نمی‌کرد، صرف‌نظر از اینکه max-width بنر در HTML چه عددی باشد. حالا
// wrapper خودش block و width:100% است تا width:100%ِ بنر معنایِ
// درستی داشته باشد؛ محدودشدن و وسط‌چین‌شدنِ نهایی همچنان با
// max-width/margin:0 auto خودِ HTMLِ بنر انجام می‌شود.
function buildSrcDoc(html: string): string {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8" />
<style>
  html, body {
    margin:0;
    padding:0;
    overflow:hidden;
    width:100%;
    height:100%;
    direction: ltr;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  body {
    display:flex;
    justify-content:center;
    align-items:flex-start;
  }
  #banner-scale-wrapper {
    display:block;
    width:100%;
    transform-origin: center top;
  }
  #banner-measure {
    position:absolute;
    visibility:hidden;
    top:0;
    left:0;
    display:inline-block;
    white-space:nowrap;
    pointer-events:none;
  }
</style>
</head>
<body>
<div id="banner-scale-wrapper">${html}</div>
<div id="banner-measure">${html}</div>
<script>
  function fit() {
    var wrapper = document.getElementById('banner-scale-wrapper');
    var measure = document.getElementById('banner-measure');
    if (!wrapper || !measure) return;

    // contentWidth عرضِ طبیعیِ محتوا (بدونِ شکستن) را می‌دهد — فقط برایِ
    // تشخیصِ اینکه آیا حتی در حالتِ کاملاً فشرده هم بنر از فضایِ موجود
    // بزرگ‌تر می‌شود یا نه. چون بنر خودش fluid/clamp-based است، این حالت
    // معمولاً پیش نمی‌آید و wrapper با width:100% به‌درستی کلِ فضا را پر
    // می‌کند.
    var contentWidth = measure.scrollWidth;
    var availableWidth = document.documentElement.clientWidth;
    var scale = contentWidth > availableWidth ? (availableWidth / contentWidth) : 1;

    wrapper.style.transform = scale < 1 ? ('scale(' + scale + ')') : 'none';

    var rect = wrapper.getBoundingClientRect();
    parent.postMessage({ type: 'banner-resize', height: rect.height }, '*');
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit);
  }
  window.addEventListener('load', fit);
  window.addEventListener('resize', fit);
  setTimeout(fit, 50);
  setTimeout(fit, 300);
  setTimeout(fit, 800);
</script>
</body>
</html>`;
}

export const BannerCard: React.FC<BannerCardProps> = ({ siteId, article, onArticleChange }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(160);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const banner = article.banner;
  const bannerStatus = article.banner_status;

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e?.data?.type === "banner-resize" && typeof e.data.height === "number") {
        setHeight(Math.ceil(e.data.height) + 4);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const res = await articleService.regenerateBanner(siteId, article.id);
      if ((res as any)?.success === false) {
        throw new Error((res as any).message || t("article.banner.failed"));
      }
      onArticleChange({ ...article, banner_status: "generating" });
    } catch (err: any) {
      setError(err?.message || t("article.banner.failedRetry"));
    } finally {
      setRegenerating(false);
    }
  };

  if (!bannerStatus || bannerStatus === "pending" || bannerStatus === "generating") {
    return (
      <div className="rounded-2xl border border-[#E4E5F0] bg-white p-3.5 sm:p-5">
        <h3 className="text-xs sm:text-sm font-black text-[#0D0F23] mb-2.5 sm:mb-3">🖼️ {t("article.banner.title")}</h3>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#9A9DB8] py-2">
          <Spinner />
          {t("article.banner.designing")}
        </div>
      </div>
    );
  }

  if (bannerStatus === "failed") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-3.5 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-xs sm:text-sm font-black text-[#0D0F23]">🖼️ {t("article.banner.title")}</h3>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="rounded-lg border border-[#E4E5F0] px-2.5 py-1.5 text-[10px] font-bold text-[#0D0F23] hover:border-[#5B47FB]/50 hover:text-[#5B47FB] disabled:opacity-50"
          >
            {regenerating ? <Spinner className="h-3 w-3" /> : t("billing.payment.tryAgain")}
          </button>
        </div>
        <p className="text-[10px] sm:text-[11px] font-bold text-rose-500">
          {banner?.error_message || t("article.banner.generationFailed")}
        </p>
        {error && <p className="mt-1 text-[10px] font-bold text-rose-500">{error}</p>}
      </div>
    );
  }

  if (bannerStatus !== "generated" || !banner?.html) return null;

  return (
    <div className="rounded-2xl border border-[#E4E5F0] bg-white p-3.5 sm:p-5">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <h3 className="text-xs sm:text-sm font-black text-[#0D0F23]">🖼️ {t("article.banner.title")}</h3>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={regenerating}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E5F0] px-2.5 py-1.5 text-[10px] font-bold text-[#0D0F23] hover:border-[#5B47FB]/50 hover:text-[#5B47FB] disabled:opacity-50"
        >
          {regenerating ? <Spinner className="h-3 w-3" /> : ` ${t("article.banner.regenerate")}`}
        </button>
      </div>
      {error && <p className="mb-2 text-[10px] font-bold text-rose-500">{error}</p>}

      <div className="w-full overflow-hidden rounded-xl flex justify-center">
        <iframe
          ref={iframeRef}
          title={t("article.banner.title")}
          srcDoc={buildSrcDoc(banner.html)}
          sandbox="allow-scripts allow-same-origin"
          scrolling="no"
          style={{ width: "100%", height, border: "none", display: "block" }}
        />
      </div>
    </div>
  );
};
