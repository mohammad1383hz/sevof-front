// src/components/ChartShowcase.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { t, formatNumber, formatDate, getDir } from "../i18n";

/* ────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────── */

/** 865K · 1.2M · 86.5 Tsd. · 6.8 ألف — compact number in the active language */
const compact = (n: number) =>
  formatNumber(n, { notation: "compact", maximumFractionDigits: n >= 1_000_000 ? 2 : 1 });

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Advance to the next chart every few seconds */
const AUTOPLAY_MS = 5000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Axis label: 0 · 956 · 1.4K · 64K · 1.4M */
const axisLabel = (v: number) =>
  v <= 0 ? formatNumber(0) : formatNumber(v, { notation: "compact", maximumFractionDigits: 1 });

/** Short axis date (Mar 30 · 30. März · 30 مارس) */
const dateShort = (d: Date) => formatDate(d, { month: "short", day: "numeric" });
/** Full tooltip date (March 30, 2026) */
const dateLong = (d: Date) => formatDate(d, { dateStyle: "long" });

/** Previous / next chevron; mirrored in RTL so it always points the reading direction */
const Chevron: React.FC<{ dir: "prev" | "next" }> = ({ dir }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 rtl:-scale-x-100"
    aria-hidden="true"
  >
    <path d={dir === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
  </svg>
);

/* ────────────────────────────────────────────────────────────────────────────
 * Showcase data — a Google Search Console–style chart
 * ⚠️ The numbers are made up and for illustration only.
 * ──────────────────────────────────────────────────────────────────────────── */

interface Example {
  id: string;
  readonly label: string; // read at render time so it follows the active language
  seed: number;
  startDate: string; // YYYY-MM-DD
  days: number;
  startDay: number; // day the site started using Sevof
  clicks: number; // total clicks
  impressions: number; // total impressions
  position: number; // average position
}
const EXAMPLES: Example[] = [
  { id: "clothing", get label() { return t("landing.results.examples.clothing"); }, seed: 11, startDate: "2026-03-30", days: 90, startDay: 36, clicks: 6_800, impressions: 89_500, position: 8.4 },
  { id: "beauty", get label() { return t("landing.results.examples.beauty"); }, seed: 27, startDate: "2026-04-25", days: 90, startDay: 46, clicks: 5_900, impressions: 71_200, position: 7.6 },
  { id: "language", get label() { return t("landing.results.examples.language"); }, seed: 5, startDate: "2026-06-02", days: 90, startDay: 31, clicks: 5_200, impressions: 76_800, position: 9.1 },
  { id: "sports", get label() { return t("landing.results.examples.sports"); }, seed: 42, startDate: "2026-07-11", days: 90, startDay: 41, clicks: 9_100, impressions: 96_400, position: 9.8 },
];
interface Point {
  date: Date;
  clicks: number;
  imp: number;
}

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Builds a daily series whose totals land exactly on the target numbers */
const buildSeries = (ex: Example): Point[] => {
  const rnd = mulberry32(ex.seed);
  const start = new Date(`${ex.startDate}T12:00:00`);

  const raw = Array.from({ length: ex.days }, (_, i) => {
    const t = Math.max(0, (i - ex.startDay) / (ex.days - 1 - ex.startDay));
    const base =
      i < ex.startDay
        ? 0.03 + (i / ex.startDay) * 0.06
        : 0.09 + Math.pow(t, 2.4) * 0.91;
    const spike = t > 0.55 && rnd() < 0.14 ? 1.22 : 1;
    const imp = base * (0.8 + rnd() * 0.4) * spike;
    const clicks = imp * (0.85 + rnd() * 0.3);
    return { imp, clicks };
  });

  const impK = ex.impressions / raw.reduce((s, p) => s + p.imp, 0);
  const clickK = ex.clicks / raw.reduce((s, p) => s + p.clicks, 0);

  return raw.map((p, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return { date, imp: p.imp * impK, clicks: p.clicks * clickK };
  });
};

const CLICK_COLOR = "#4285f4";
const IMP_COLOR = "#5e35b1";

/* ────────────────────────────────────────────────────────────────────────────
 * PerformanceChart
 * ──────────────────────────────────────────────────────────────────────────── */

const Y_TICKS = [1, 2 / 3, 1 / 3, 0];

/** 10 date labels on the X axis: first & last on mobile, 4 on tablet, all on desktop */
const tickClass = (k: number) => {
  if (k === 0) return "block translate-x-0 sm:-translate-x-1/2";
  if (k === 9) return "block -translate-x-full sm:-translate-x-1/2";
  if (k === 3 || k === 6) return "hidden -translate-x-1/2 sm:block";
  return "hidden -translate-x-1/2 lg:block";
};

const PerformanceChart: React.FC<{
  series: Point[];
  startDay: number;
  active: boolean;
}> = ({ series, startDay, active }) => {
  const [hover, setHover] = useState<number | null>(null);
  const n = series.length;

  const { clickMax, impMax, clickPath, impPath } = useMemo(() => {
    const cMax = Math.max(...series.map((p) => p.clicks));
    const iMax = Math.max(...series.map((p) => p.imp));
    const toPath = (key: "clicks" | "imp", max: number) =>
      series
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"} ${((i / (n - 1)) * 1000).toFixed(1)},${((1 - p[key] / max) * 100).toFixed(2)}`
        )
        .join(" ");
    return {
      clickMax: cMax,
      impMax: iMax,
      clickPath: toPath("clicks", cMax),
      impPath: toPath("imp", iMax),
    };
  }, [series, n]);

  const xPct = (i: number) => (i / (n - 1)) * 100;
  const yPct = (v: number, max: number) => (1 - v / max) * 100;
  const xTicks = Array.from({ length: 10 }, (_, k) => Math.round((k * (n - 1)) / 9));

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHover(Math.round(clamp((e.clientX - rect.left) / rect.width) * (n - 1)));
  };

  const hp = hover !== null ? series[hover] : null;
  const tipShift =
    hover === null ? "-50%" : xPct(hover) < 22 ? "0%" : xPct(hover) > 78 ? "-100%" : "-50%";

  const startX = xPct(startDay);
  const startY = yPct(series[startDay].clicks, clickMax);

  return (
    <div dir="ltr" className="relative h-[300px] select-none">
      {/* The plot is always drawn left-to-right (time flows left → right), like Search Console */}
      <span dir={getDir()} className="absolute left-4 top-4 text-xs text-[#616161]">
        {t("landing.results.clicks")}
      </span>
      <span dir={getDir()} className="absolute right-4 top-4 text-xs text-[#616161]">
        {t("landing.results.impressions")}
      </span>

      <div className="absolute inset-x-4 bottom-9 top-12">
        {/* Y axes: left = clicks, right = impressions */}
        {Y_TICKS.map((f) => (
          <React.Fragment key={f}>
            <span
              dir={getDir()}
              className="absolute left-0 w-11 -translate-y-1/2 whitespace-nowrap text-right text-[10px] text-[#757575] sm:w-14 sm:text-xs"
              style={{ top: `${(1 - f) * 100}%` }}
            >
              {axisLabel(clickMax * f)}
            </span>
            <span
              dir={getDir()}
              className="absolute right-0 w-11 -translate-y-1/2 whitespace-nowrap text-left text-[10px] text-[#757575] sm:w-14 sm:text-xs"
              style={{ top: `${(1 - f) * 100}%` }}
            >
              {axisLabel(impMax * f)}
            </span>
          </React.Fragment>
        ))}

        {/* Plot area */}
        <div
          className="absolute inset-y-0 left-11 right-11 touch-pan-y sm:left-14 sm:right-14"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {/* Grid lines */}
          {Y_TICKS.map((f) => (
            <div
              key={f}
              className="pointer-events-none absolute inset-x-0 h-px bg-[#E0E0E0]"
              style={{ top: `${(1 - f) * 100}%` }}
            />
          ))}

          {/* Data lines */}
          <svg
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${active ? "ut-draw" : ""}`}
            role="img"
            aria-label={t("landing.results.chartAria", { days: n })}
          >
            <path
              d={clickPath}
              fill="none"
              stroke={CLICK_COLOR}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={impPath}
              fill="none"
              stroke={IMP_COLOR}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* X axis labels */}
          {xTicks.map((i, k) => (
            <span
              key={k}
              dir="ltr"
              className={`absolute top-full mt-2 whitespace-nowrap text-[11px] text-[#757575] sm:text-xs ${tickClass(k)}`}
              style={{ left: `${xPct(i)}%` }}
            >
              {dateShort(series[i].date)}
            </span>
          ))}

          {/* "Started using Sevof" marker */}
          <div
            className="pointer-events-none absolute z-10"
            style={{ left: `${startX}%`, top: `${startY}%` }}
          >
            <div className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5E35B1]/20" />
            <div className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5E35B1]" />

            <div className="absolute bottom-12 left-0 -translate-x-1/2">
              <div className={active ? "ut-pop" : ""}>
                <div className="relative h-12 w-12 rounded-full border-2 border-[#5E35B1] bg-white p-1 shadow-[0_4px_20px_rgba(147,51,234,0.25),0_2px_8px_rgba(0,0,0,0.1)]">
                  <img src="/logo.png" alt="" className="h-full w-full scale-[0.7] object-contain" />
                  <div className="absolute left-1/2 top-full h-9 w-0.5 -translate-x-1/2 bg-[#5E35B1]/30" />
                </div>
              </div>
            </div>

            <div
              dir={getDir()}
              className={`absolute bottom-[100px] left-0 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-[11px] text-white shadow-md transition-opacity ${hover !== null ? "opacity-0" : "opacity-100"}`}
            >
              {t("landing.results.startedUsing")}
              <div
                className="absolute left-1/2 top-full -mt-px -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid #111827",
                }}
              />
            </div>
          </div>

          {/* Hover */}
          {hp && hover !== null && (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-black/20"
                style={{ left: `${xPct(hover)}%` }}
              />
              <span
                className="pointer-events-none absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                style={{ left: `${xPct(hover)}%`, top: `${yPct(hp.clicks, clickMax)}%`, background: CLICK_COLOR }}
              />
              <span
                className="pointer-events-none absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                style={{ left: `${xPct(hover)}%`, top: `${yPct(hp.imp, impMax)}%`, background: IMP_COLOR }}
              />
              <div
                dir={getDir()}
                className="pointer-events-none absolute top-2 z-20 min-w-[148px] rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#3C4043] shadow-lg"
                style={{ left: `${xPct(hover)}%`, transform: `translateX(${tipShift})` }}
              >
                <p className="mb-1.5 whitespace-nowrap font-semibold text-[#202124]">{dateLong(hp.date)}</p>
                <p className="flex items-center justify-between gap-4 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ background: CLICK_COLOR }} />
                    {t("landing.results.clicks")}
                  </span>
                  <span className="font-medium">{formatNumber(Math.round(hp.clicks))}</span>
                </p>
                <p className="mt-0.5 flex items-center justify-between gap-4 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ background: IMP_COLOR }} />
                    {t("landing.results.impressions")}
                  </span>
                  <span className="font-medium">{formatNumber(Math.round(hp.imp))}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
 * Metrics + Slide
 * ──────────────────────────────────────────────────────────────────────────── */

const CheckIcon: React.FC<{ checked: boolean }> = ({ checked }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
    <rect x="0.5" y="0.5" width="12.51" height="12.5" rx="1.5" stroke="currentColor" />
    {checked && (
      <path
        d="M5.37928 8.15898L10.2392 3.2991L10.8843 3.94422L5.37928 9.44922L2.82031 6.89025L3.46543 6.24514L5.37928 8.15898Z"
        fill="currentColor"
      />
    )}
  </svg>
);

const HelpIcon: React.FC<{ faded?: boolean }> = ({ faded }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    aria-hidden="true"
    className={`absolute bottom-3 end-2 h-[18px] w-[18px] ${faded ? "opacity-50" : ""}`}
  >
    <path
      d="M6.89361 5.44219C6.89361 5.44219 7.04018 5.29562 7.33331 5.00249C7.62644 4.70936 8.18339 4.56279 9.00416 4.56279C9.82493 4.56279 10.5284 4.85592 11.1147 5.44219C11.701 6.02845 11.9941 6.73197 11.9941 7.55273C11.9941 8.1859 11.6189 8.83665 10.8685 9.50499C10.1181 10.1733 9.74285 10.7772 9.74285 11.3165H8.26547C8.26547 10.7772 8.38272 10.314 8.61723 9.9271C8.85173 9.54017 9.10969 9.25876 9.39109 9.08288C9.6725 8.907 9.93046 8.69008 10.165 8.43213C10.3995 8.17417 10.5167 7.88104 10.5167 7.55273C10.5167 7.15407 10.3643 6.80818 10.0594 6.51505C9.75458 6.22192 9.40282 6.07535 9.00416 6.07535C8.6055 6.07535 8.25374 6.22192 7.94889 6.51505C7.64403 6.80818 7.4916 7.15407 7.4916 7.55273H6.01422C6.01422 6.73197 6.30735 6.02845 6.89361 5.44219ZM4.76548 13.304C4.76548 13.304 5.06154 13.6 5.65367 14.1922C6.24579 14.7843 7.36262 15.0804 9.00416 15.0804C10.6457 15.0804 12.0586 14.4882 13.2428 13.304C14.4271 12.1197 15.0192 10.7068 15.0192 9.06529C15.0192 7.42376 14.4271 6.01086 13.2428 4.82661C12.0586 3.64236 10.6457 3.05023 9.00416 3.05023C7.36262 3.05023 5.94973 3.64236 4.76548 4.82661C3.58123 6.01086 2.9891 7.42376 2.9891 9.06529C2.9891 10.7068 3.58123 12.1197 4.76548 13.304ZM3.71021 3.77134C3.71021 3.77134 4.07662 3.40492 4.80945 2.67209C5.54228 1.93926 6.94051 1.57285 9.00416 1.57285C11.0678 1.57285 12.8325 2.30568 14.2981 3.77134C15.7638 5.23699 16.4966 7.00165 16.4966 9.06529C16.4966 11.1289 15.7638 12.8936 14.2981 14.3592C12.8325 15.8249 11.0678 16.5577 9.00416 16.5577C6.94051 16.5577 5.17586 15.8249 3.71021 14.3592C2.24455 12.8936 1.51172 11.1289 1.51172 9.06529C1.51172 7.00165 2.24455 5.23699 3.71021 3.77134ZM8.26547 13.5678V12.0552H9.74285V13.5678H8.26547Z"
      fill="currentColor"
    />
  </svg>
);

const Tile: React.FC<{
  tone: "clicks" | "imp" | "plain";
  label: string;
  value: string;
}> = ({ tone, label, value }) => {
  const tones = {
    clicks: "bg-[#4285f4] text-white",
    imp: "bg-[#5e35b1] text-white",
    plain: "border-b border-e border-black/[0.12] bg-white text-black/[0.54]",
  } as const;
  const colored = tone !== "plain";

  return (
    <div className={`relative h-[110px] md:w-[170px] lg:w-[190px] ${tones[tone]}`}>
      <div className="absolute start-6 top-6 flex items-center gap-1.5">
        <CheckIcon checked={colored} />
        <span className="whitespace-nowrap text-[13px] leading-4">
          {label}
        </span>
      </div>
      <div className="absolute start-6 top-12 leading-none">
        <span className="whitespace-nowrap text-[28px] md:text-[32px]">{value}</span>
      </div>
      <HelpIcon faded={colored} />
    </div>
  );
};

const DailyButton: React.FC = () => (
  <div
    aria-hidden="true"
    className="absolute end-4 top-4 z-10 hidden h-8 items-center gap-2 rounded-lg border border-[#747775] bg-white px-3 lg:flex"
  >
    <span className="text-sm font-medium leading-none text-[#444746]">{t("landing.results.daily")}</span>
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M7 9L11 13L15 9" stroke="#444746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const ExampleSlide: React.FC<{
  example: Example;
  series: Point[];
  active: boolean;
}> = ({ example, series, active }) => {
  const stats = useMemo(() => {
    const clicks = series.reduce((s, p) => s + p.clicks, 0);
    const imp = series.reduce((s, p) => s + p.imp, 0);
    return {
      clicks: compact(clicks),
      imp: compact(imp),
      ctr: formatNumber(clicks / imp, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      pos: formatNumber(example.position, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    };
  }, [series, example.position]);

  return (
    <div className="mx-auto w-full max-w-[1040px] rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
      <div className="relative grid grid-cols-2 overflow-hidden rounded-t-xl md:flex">
        <DailyButton />
        <Tile tone="clicks" label={t("landing.results.totalClicks")} value={stats.clicks} />
        <Tile tone="imp" label={t("landing.results.totalImpressions")} value={stats.imp} />
        <Tile tone="plain" label={t("landing.results.avgCtr")} value={stats.ctr} />
        <Tile tone="plain" label={t("landing.results.avgPosition")} value={stats.pos} />
      </div>
      <PerformanceChart series={series} startDay={example.startDay} active={active} />
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
 * ChartShowcase
 * ──────────────────────────────────────────────────────────────────────────── */

const ChartShowcase: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false); // pointer is over the chart
  const sectionRef = useRef<HTMLElement>(null);
  const slides = useMemo(() => EXAMPLES.map(buildSeries), []);
  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + EXAMPLES.length) % EXAMPLES.length);

  // Start the line-drawing animation once the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance to the next chart. Depends on index, so a manual click restarts the timer
  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % EXAMPLES.length),
      AUTOPLAY_MS
    );
    return () => window.clearTimeout(id);
  }, [index, inView, paused]);

  return (
    <section
      ref={sectionRef}
      id="results"
      className="relative z-10 px-4 py-16 sm:py-24"
      aria-labelledby="results-title"
    >
      <style>{`
        @keyframes ut-draw { from { clip-path: inset(-4px 100% -4px 0); } to { clip-path: inset(-4px -4px -4px -4px); } }
        @keyframes ut-pop { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .ut-draw { animation: ut-draw 1.2s ease-out both; }
        .ut-pop { animation: ut-pop 0.6s ease-out 0.5s both; }
        @media (prefers-reduced-motion: reduce) { .ut-draw, .ut-pop { animation: none; } }
      `}</style>

      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 id="results-title" className="text-2xl font-bold leading-[2.4rem] text-[#1E2A28] sm:text-4xl sm:leading-[3.2rem]">
          {t("landing.results.title")}
        </h2>
        <p className="text-sm leading-7 text-[#5B645E] sm:text-base">{t("landing.results.subtitle")}</p>
      </div>

      <div
        className="mx-auto mt-4 max-w-[1080px]"
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Each slide is its own card; py-8 leaves room for the shadow. In RTL the slides run right-to-left, so the track moves the other way */}
        <div className="overflow-hidden py-8">
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(${getDir() === "rtl" ? "" : "-"}${index * 100}%)` }}
          >
            {slides.map((series, i) => (
              <div key={EXAMPLES[i].id} className="min-w-full px-3 sm:px-4" aria-hidden={i !== index}>
                <ExampleSlide example={EXAMPLES[i]} series={series} active={inView && i === index} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-3">
          <p className="rounded-full bg-[#E3DFD1] px-3 py-1 text-xs font-bold text-[#3D453F] sm:text-sm" aria-live="polite">
            {EXAMPLES[index].label}
          </p>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              {EXAMPLES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-[#1B6F63]" : "w-1.5 bg-[#DAD5C7]"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t("landing.results.prev")}
                className="rounded-full border border-[#DAD5C7] bg-[#FBFAF6] p-2.5 text-[#3D453F] transition-colors hover:bg-[#E3DFD1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B6F63]"
              >
                <Chevron dir="prev" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t("landing.results.next")}
                className="rounded-full border border-[#DAD5C7] bg-[#FBFAF6] p-2.5 text-[#3D453F] transition-colors hover:bg-[#E3DFD1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B6F63]"
              >
                <Chevron dir="next" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartShowcase;