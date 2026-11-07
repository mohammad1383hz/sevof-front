// src/pages/EduWordpressPage.tsx
import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import { t } from "../i18n";

/** ویدیو باید داخل پوشه‌ی public پروژه باشد: public/edu_wordpress.mp4
 *  (در Vite و CRA این فایل از آدرس /edu_wordpress.mp4 در دسترس است). */
const VIDEO_SRC = "/edu_wordpress.mp4";

const EduWordpressPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get("site") ?? undefined;

  const [activeView, setActiveView] = useState<SidebarView>("info" as SidebarView);
  const [started, setStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    video.play().catch(() => {
      // مرورگر پخش خودکار را رد کرد؛ کنترل‌های خودِ ویدیو در دسترس‌اند.
    });
  };

  return (
    <Layout
      activeView={activeView}
      onChangeView={setActiveView}
      siteId={siteId}
    >
      <div dir="rtl" className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* عنوان */}
        <div className="mb-5 sm:mb-7">
          <h1 className="text-xl font-black text-[#1E2A28] sm:text-2xl">
            {t("growth.edu.title")}
          </h1>
          <p className="mt-2 max-w-xl text-sm font-bold leading-7 text-[#9BA69F]">
            {t("growth.edu.subtitle")}
          </p>
        </div>

        {/* قاب ویدیو */}
        <div className="overflow-hidden rounded-3xl border border-[#DAD5C7] bg-[#FBFAF6] p-2 shadow-xl shadow-[#1E2A28]/5 sm:p-3">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#1E2A28]">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              controls={started}
              playsInline
              preload="metadata"
              onPlay={() => setStarted(true)}
              onError={() => setHasError(true)}
              className="h-full w-full object-contain"
            />

            {/* پوششِ شروع — با اولین پخش محو می‌شود */}
            {!started && !hasError && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label={t("growth.edu.play")}
                className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#1E2A28]/70 via-[#1E2A28]/20 to-[#1E2A28]/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1B6F63]/50"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-l from-[#8B3F63] to-[#6E2E4E] text-white shadow-xl shadow-[#8B3F63]/40 transition-transform duration-200 group-hover:scale-105 group-active:scale-95 sm:h-24 sm:w-24">
                  <svg className="h-8 w-8 translate-x-[-2px] sm:h-10 sm:w-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.14z" />
                  </svg>
                </span>
              </button>
            )}

            {/* خطای بارگذاری */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1E2A28] px-6 text-center">
                <p className="text-sm font-black text-white">{t("growth.edu.videoFailed")}</p>
                <p className="text-xs font-bold text-[#9BA69F]">
                  {t("growth.edu.videoMissing")}
                </p>
              </div>
            )}
          </div>

          {/* نوار پایین قاب */}
          <div className="flex items-center gap-3 px-3 pb-2 pt-3 sm:px-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B6F63]/10 text-[#1B6F63]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-2.36a.75.75 0 011.03.67v6.38a.75.75 0 01-1.03.67l-4.72-2.36M4.5 18.75h9A2.25 2.25 0 0015.75 16.5v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#1E2A28]">{t("growth.edu.cardTitle")}</p>
              <p className="text-xs font-bold text-[#9BA69F]">{t("growth.edu.cardSubtitle")}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EduWordpressPage;