import React, { useState } from "react";
import type { DashboardAgent, DashboardStatistics } from "../../types";

import ToggleSwitch from "./ToggleSwitch";
import AgentSettingsPanel from "./AgentSettingsPanel";
import { Search, Lightbulb, FileText, Send, Lock, Sparkles } from "lucide-react";
import { t, tMaybe, formatNumber } from "../../i18n";

export type PerformanceStatKey = "keywords" | "opportunities" | "articles_written" | "articles_published";

interface AgentStatusCardProps {
  agent: DashboardAgent;
  statistics: DashboardStatistics;

  /** null = وضعیت اشتراک هنوز در حال دریافت، true = کاربر Pro (فعال و غیررایگان)، false = بدون اشتراک Pro */
  hasProSubscription: boolean | null;
  onToggleAutoPilot: (enabled: boolean) => void;
  onUpdateSettings: (payload: {
    default_publish_status: "draft" | "publish";
    daily_article_limit: number;
    daily_idea_count: number;
    daily_start_hour: number;
  }) => Promise<void> | void;
  onStatClick?: (statKey: PerformanceStatKey) => void;
  /** کلیک روی دکمه‌ی ارتقا به Pro برای کاربرهایی که اشتراک فعال ندارند */
  onUpgradeClick?: () => void;
  /** true وقتی درخواست فعال/غیرفعال‌سازی Auto Pilot در حال ارسال است */
  isTogglingAutoPilot?: boolean;
}

const statusMap: Record<string, { text: string; dot: string }> = {
  idle: { text: "dashboard.agent.status.idle", dot: "bg-[#9BA69F]" },
  working: { text: "dashboard.agent.status.working", dot: "bg-[#1B6F63]" },
  generating_ideas: { text: "dashboard.agent.status.generatingIdeas", dot: "bg-[#1B6F63]" },
  generating_article: { text: "dashboard.agent.status.writing", dot: "bg-[#1B6F63]" },
  waiting_for_scored_ideas: { text: "dashboard.agent.status.waitingIdeas", dot: "bg-amber-500" },
  articles_daily_limit_reached: { text: "dashboard.agent.status.dailyLimit", dot: "bg-amber-500" },
  error_no_entity_analysis: { text: "dashboard.agent.status.needsAnalysis", dot: "bg-rose-500" },
};

const getFeatures = () => [
  t("dashboard.agent.features.research"),
  t("dashboard.agent.features.daily"),
  t("dashboard.agent.features.autoPublish"),
  t("dashboard.agent.features.scheduling"),
  t("dashboard.agent.features.wordpress"),
];

/**
 * چهار مرحله‌ی خط تولید محتوا — دقیقاً هم‌راستا با چهار آمار عملکرد پایین کارت
 * (keywords → opportunities → articles_written → articles_published)
 * تا کاربر بفهمد هر عدد از کجا آمده و اتوپایلوت دقیقاً چه کاری برایش انجام می‌دهد.
 */
const pipelineSteps: { key: PerformanceStatKey; icon: typeof Search; title: string; desc: string }[] = [
  { key: "keywords", icon: Search, title: "dashboard.agent.pipeline.keywordsTitle", desc: "dashboard.agent.pipeline.keywordsDesc" },
  { key: "opportunities", icon: Lightbulb, title: "dashboard.agent.pipeline.ideasTitle", desc: "dashboard.agent.pipeline.ideasDesc" },
  { key: "articles_written", icon: FileText, title: "dashboard.agent.pipeline.writeTitle", desc: "dashboard.agent.pipeline.writeDesc" },
  { key: "articles_published", icon: Send, title: "dashboard.agent.pipeline.publishTitle", desc: "dashboard.agent.pipeline.publishDesc" },
];

const getPerformanceStats = (statistics: DashboardStatistics): { key: PerformanceStatKey; label: string; value: number; icon: typeof Search }[] => [
  { key: "keywords", label: t("dashboard.agent.stats.keywords"), value: statistics.keywords_found ?? 0, icon: Search },
  { key: "opportunities", label: t("dashboard.agent.stats.opportunities"), value: statistics.opportunities_discovered ?? 0, icon: Lightbulb },
  { key: "articles_written", label: t("dashboard.agent.stats.written"), value: statistics.articles_written ?? 0, icon: FileText },
  { key: "articles_published", label: t("dashboard.agent.stats.published"), value: statistics.articles_published ?? 0, icon: Send },
];

/** خط تولید محتوا: نسخه‌ی دسکتاپ افقی با خط رابط متحرک، نسخه‌ی موبایل عمودی */
const ContentPipeline: React.FC<{ onStepClick?: (key: PerformanceStatKey) => void }> = ({ onStepClick }) => {
  return (
    <div className="relative">
      <style>{`
        @keyframes pipeline-flow {
          to { stroke-dashoffset: -24; }
        }
        .pipeline-line {
          stroke-dasharray: 5 7;
          animation: pipeline-flow 1.1s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .pipeline-line { animation: none; }
        }
      `}</style>

      {/* نسخه‌ی دسکتاپ — جهت جریان همان جهت صفحه است (مرحله‌ی اول در «شروع»؛ در RTL سمت راست) */}
      <div className="hidden sm:block relative">
        <svg
          className="absolute top-6 start-0 w-full h-6 pointer-events-none rtl:-scale-x-100"
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
        >
          <line x1="12.5" y1="2" x2="87.5" y2="2" stroke="#DAD5C7" strokeWidth="1.5" />
          <line className="pipeline-line" x1="12.5" y1="2" x2="87.5" y2="2" stroke="#1B6F63" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div className="relative grid grid-cols-4 gap-3">
          {pipelineSteps.map(({ key, icon: Icon, title, desc }) => (
            <button
              type="button"
              key={key}
              onClick={() => onStepClick?.(key)}
              className="group flex flex-col items-center text-center gap-2.5 rounded-xl px-2 py-2 hover:bg-[#F7F5EF] transition-colors"
            >
              <span className="h-12 w-12 rounded-full bg-white border-2 border-[#1B6F63] flex items-center justify-center text-[#1B6F63] shadow-sm group-hover:bg-[#1B6F63] group-hover:text-white transition-colors">
                <Icon size={19} strokeWidth={2.5} />
              </span>
              <span className="text-sm font-extrabold text-[#1E2A28]">{t(title)}</span>
              <span className="text-xs text-[#6B756F] leading-6 max-w-[11rem]">{t(desc)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* نسخه‌ی موبایل — از بالا به پایین، مرحله به مرحله */}
      <div className="sm:hidden space-y-1">
        {pipelineSteps.map(({ key, icon: Icon, title, desc }, i) => (
          <div key={key} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <span className="h-10 w-10 shrink-0 rounded-full bg-white border-2 border-[#1B6F63] flex items-center justify-center text-[#1B6F63] shadow-sm">
                <Icon size={16} strokeWidth={2.5} />
              </span>
              {i < pipelineSteps.length - 1 && <span className="w-0.5 flex-1 my-1 bg-[#DAD5C7]" />}
            </div>
            <button
              type="button"
              onClick={() => onStepClick?.(key)}
              className="pb-4 text-start"
            >
              <div className="text-sm font-extrabold text-[#1E2A28] pt-2">{t(title)}</div>
              <div className="text-xs text-[#6B756F] leading-6 mt-0.5">{t(desc)}</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  agent,
  statistics,
  hasProSubscription,

  onToggleAutoPilot,
  onUpdateSettings,
  onStatClick,
  onUpgradeClick,
  isTogglingAutoPilot = false,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  // Auto Pilot is on only when agent.enabled is true (same as AgentSetting::isActive() on the backend).
  const isEnabled = agent.enabled === true;

  const status = statusMap[agent.status ?? "idle"] ?? { text: agent.status ?? t("dashboard.agent.status.unknown"), dot: "bg-[#9BA69F]" };
  const performanceStats = getPerformanceStats(statistics);

  if (!isEnabled) {
    /* ── وضعیت اشتراک هنوز لود نشده: یک اسکلتون ساده به‌جای کارت اصلی ── */
    if (hasProSubscription === null) {
      return (
        <div className="rounded-2xl p-6 bg-[#F0EEE6] border border-[#DAD5C7] animate-pulse">
          <div className="h-5 w-48 bg-[#DAD5C7] rounded mb-3" />
          <div className="h-3 w-full max-w-sm bg-[#DAD5C7]/70 rounded mb-2" />
          <div className="h-3 w-2/3 max-w-xs bg-[#DAD5C7]/70 rounded" />
        </div>
      );
    }

    /* ── کاربر اشتراک Pro فعال ندارد: به‌جای دکمه‌ی فعال‌سازی، پیشنهاد خرید اشتراک ── */
    if (!hasProSubscription) {
      return (
        <div className="relative overflow-hidden bg-gradient-to-r rtl:bg-gradient-to-l from-[#4A3A22] to-[#2E2313] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div
            aria-hidden
            className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-amber-300/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -start-6 bottom-0 h-32 w-32 rounded-full bg-amber-300/5"
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 bg-amber-300/20 text-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
                <Lock size={12} strokeWidth={2.5} />
                {t("dashboard.agent.locked.badge")}
              </span>
            </div>
            <h2 className="font-bold text-lg mb-1">{t("dashboard.agent.locked.title")}</h2>
           <p className="text-sm font-bold text-white max-w-md whitespace-nowrap">
  {t("dashboard.agent.locked.body")}
</p>
            <ul className="text-sm text-amber-100/70 space-y-1 mt-3">
              {getFeatures().map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-200/70" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={onUpgradeClick}
            className="relative shrink-0 inline-flex items-center gap-1.5 bg-amber-300 text-[#3A2E1F] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-amber-200 hover:shadow-lg hover:shadow-amber-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Sparkles size={16} strokeWidth={2.5} />
            {t("dashboard.agent.locked.cta")}
          </button>
        </div>
      );
    }

    /* ── کاربر Pro فعال دارد: امکان فعال‌سازی مستقیم ── */
    return (
      <div className="bg-gradient-to-r rtl:bg-gradient-to-l from-[#1B6F63] to-[#14564C] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg mb-1">{t("dashboard.agent.enableTitle")}</h2>
          <ul className="text-sm text-[#DCEFEA] space-y-1 mt-2">
            {getFeatures().map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => onToggleAutoPilot(true)}
          disabled={isTogglingAutoPilot}
          className="bg-white text-[#1B6F63] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#DCEFEA] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
        >
          {isTogglingAutoPilot && (
            <span className="h-3.5 w-3.5 border-2 border-[#1B6F63]/30 border-t-[#1B6F63] rounded-full animate-spin" />
          )}
          {isTogglingAutoPilot ? t("dashboard.agent.enabling") : t("dashboard.agent.enable")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#DAD5C7] rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full ${status.dot} opacity-75 animate-ping`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.dot}`} />
          </span>
          <h2 className="font-bold text-[#1E2A28]">{t("dashboard.agent.onTitle")}</h2>
          <span className="text-xs text-[#9BA69F]">— {tMaybe(status.text, status.text)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings((v) => !v)}
            className={`text-xs font-bold border rounded-lg px-3 py-1.5 transition-colors ${
              showSettings
                ? "text-[#1B6F63] border-[#1B6F63]/40 bg-[#DCEFEA]"
                : "text-[#000000] border-[#DAD5C7] hover:text-[#1B6F63]"
            }`}
          >
            ⚙️ {t("dashboard.agent.settings")}
          </button>
          {isTogglingAutoPilot ? (
            <span className="h-4 w-4 border-2 border-[#DAD5C7] border-t-[#1B6F63] rounded-full animate-spin" />
          ) : (
            <ToggleSwitch checked={isEnabled} onChange={onToggleAutoPilot} label={t("dashboard.agent.enableTitle")} />
          )}
        </div>
      </div>

      {showSettings && (
        <div className="mt-4">
          <AgentSettingsPanel agent={agent} onSave={onUpdateSettings} />
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {performanceStats.map(({ key, label, value, icon: Icon }) => (
          <button
            type="button"
            key={key}
            onClick={() => onStatClick?.(key)}
            className="group rounded-xl border border-[#DAD5C7] bg-[#F7F5EF] p-4 flex flex-col items-start gap-2.5 text-start hover:border-[#1B6F63]/40 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="h-9 w-9 rounded-lg bg-[#1B6F63] flex items-center justify-center text-white shadow-sm">
                <Icon size={17} strokeWidth={2.5} />
              </div>
              <svg
                className="w-3.5 h-3.5 text-[#9BA69F] opacity-0 group-hover:opacity-100 -translate-x-1 rtl:translate-x-1 rtl:-scale-x-100 group-hover:translate-x-0 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-black text-[#1E2A28] leading-none tracking-tight">
                {formatNumber(value)}
              </div>
              <div className="text-xs font-extrabold text-[#1E2A28] mt-1.5">{label}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-dashed border-[#DAD5C7]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-black tracking-wide text-[#1B6F63] bg-[#DCEFEA] px-2 py-0.5 rounded-md">
            {t("dashboard.agent.pipeline.badge")}
          </span>
        </div>
        <p className="text-xs text-[#6B756F] mb-4 leading-6">
          {t("dashboard.agent.pipeline.intro")}
        </p>
        <ContentPipeline onStepClick={onStatClick} />
      </div>
    </div>
  );
};

export default AgentStatusCard;