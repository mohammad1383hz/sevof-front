// src/components/AnnouncementBanner.tsx
import React, { useEffect, useState } from "react";
import { announcementService, searchConsoleService } from "../services/api";
import type { Announcement } from "../services/api";
import { t } from "../i18n";

/** اطلاعیه‌ی سرور، یا اطلاعیه‌ی داخلی اپ که دکمه دارد (مثل «سرچ کنسول را وصل کنید») */
type Item = Omit<Announcement, "id"> & { id: number | string; action?: { label: string; run: () => void } };

// وضعیت اتصال سرچ کنسول هر سایت (item: null = وصل است و اطلاعیه لازم نیست).
// کوتاه‌مدت است تا بعد از انتخاب property در همان صفحه (بدون رفرش) اطلاعیه برود.
const GSC_TTL = 60 * 1000;
const gscCache = new Map<string, { at: number; item: Item | null }>();
const gscCached = (site: string) => {
  const hit = gscCache.get(site);
  return hit && Date.now() - hit.at < GSC_TTL ? hit : undefined;
};


const gscItem = (siteId: string, connected: boolean): Item => ({
  id: `gsc-${siteId}`,
  title: connected ? t("growth.banner.pickTitle") : t("growth.banner.connectTitle"),
  body: connected ? t("growth.banner.pickBody") : t("growth.banner.connectBody"),
  updated_at: "v1",
  action: connected
    ? { label: t("growth.banner.pick"), run: () => window.location.assign(`/sites/${siteId}/dashboard`) }
    : {
        label: t("growth.gsc.connect"),
        run: async () => {
          const res = await searchConsoleService.connect(siteId);
          if (res.success && res.data?.authorization_url) window.location.assign(res.data.authorization_url);
        },
      },
});

const STORAGE_KEY = "dismissed_announcements";
const CACHE_TTL = 5 * 60 * 1000;

// Layout در هر صفحه دوباره mount می‌شود؛ این کش جلوی fetch تکراری در هر ناوبری را می‌گیرد.
let cache: { at: number; items: Announcement[] } | null = null;

// اگه متن اطلاعیه ویرایش بشه (updated_at عوض بشه) دوباره نمایش داده می‌شود.
const keyOf = (a: Item) => `${a.id}:${a.updated_at}`;

const readDismissed = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const navBtn =
  "flex h-7 w-7 items-center justify-center rounded-lg text-black/50 transition-colors hover:bg-emerald-50 hover:text-emerald-600";

const AnnouncementBanner: React.FC<{ desktopSidebarOpen: boolean; siteId?: number | string }> = ({ desktopSidebarOpen, siteId }) => {
  const [items, setItems] = useState<Announcement[]>(cache?.items ?? []);
  const site = siteId ? String(siteId) : null;
  // تا وضعیت واقعی نیامده چیزی نشان داده نمی‌شود
  const [gsc, setGsc] = useState<Item | null>(site ? gscCached(site)?.item ?? null : null);

  useEffect(() => {
    if (!site) return setGsc(null);
    const hit = gscCached(site);
    if (hit) return setGsc(hit.item);
    setGsc(null);
    let cancelled = false;

    searchConsoleService
      .status(site)
      .then((res) => {
        if (cancelled || !res.success || !res.data) return;
        const connected = res.data.connection?.status === "connected";
        const item = connected && res.data.property ? null : gscItem(site, connected);
        gscCache.set(site, { at: Date.now(), item });
        setGsc(item);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [site]);
  const [dismissed, setDismissed] = useState<string[]>(readDismissed);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (cache && Date.now() - cache.at < CACHE_TTL) return;
    let cancelled = false;

    announcementService
      .list()
      .then((res) => {
        if (cancelled) return;
        const list = res.success && res.data ? res.data.announcements : [];
        cache = { at: Date.now(), items: list };
        setItems(list);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const visible = [...(gsc ? [gsc] : []), ...(items as Item[])].filter((a) => !dismissed.includes(keyOf(a)));
  if (visible.length === 0) return null;

  const safeIndex = Math.min(index, visible.length - 1);
  const current = visible[safeIndex];

  const dismiss = () => {
    const next = [...dismissed, keyOf(current)];
    setDismissed(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const go = (step: number) => setIndex((safeIndex + step + visible.length) % visible.length);

  return (
    // هم‌عرض ستون محتوا (مثل نوار پلن): در دسکتاپ کنار سایدبار، در موبایل تمام‌عرض
    <div
      className={`pointer-events-none fixed inset-x-0 top-16 z-30 px-3 transition-all duration-300 ${
        desktopSidebarOpen ? "lg:start-80" : "lg:start-0"
      }`}
    >
      <div
        role="status"
        className="pointer-events-auto relative mx-auto flex max-w-xl items-start gap-3 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r rtl:bg-gradient-to-l from-white via-white to-emerald-50 p-3.5 ps-4 shadow-lg shadow-emerald-500/10 backdrop-blur-md"
      >
        {/* نوار سبز کناری (سمت شروع در RTL) */}
        <span className="absolute inset-y-0 start-0 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-700" />

        {/* آیکون سبز با حلقه‌ی پالس */}
        <div className="relative mt-0.5 h-10 w-10 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br rtl:bg-gradient-to-bl from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/40 ring-4 ring-emerald-100">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-black">{current.title}</h3>
          <p className="mt-1 max-h-28 overflow-y-auto whitespace-pre-line break-words text-[13px] font-bold leading-6 text-black">
            {current.body}
          </p>
          {current.action && (
            <button
              type="button"
              onClick={current.action.run}
              className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-700"
            >
              {current.action.label}
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {visible.length > 1 && (
            <>
              {/* قبلی — فلش رو به «شروع» (چپ در LTR، راست در RTL) */}
              <button type="button" onClick={() => go(-1)} aria-label={t("layout.announcement.previous")} className={navBtn}>
                <svg className="h-4 w-4 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <span className="min-w-[2.25rem] text-center text-[11px] font-black text-black/60" dir="ltr">
                {safeIndex + 1} / {visible.length}
              </span>
              {/* بعدی — فلش رو به «پایان» */}
              <button type="button" onClick={() => go(1)} aria-label={t("layout.announcement.next")} className={navBtn}>
                <svg className="h-4 w-4 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </>
          )}
          <button type="button" onClick={dismiss} aria-label={t("layout.announcement.close")} className={navBtn}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;