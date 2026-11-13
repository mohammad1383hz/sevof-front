import React, { useEffect, useRef, useState } from "react";
import { t, formatNumber } from "../../../i18n";

export type ContentChatMode =
  | "trend_opportunities"
  | "keyword_clusters"
  | "content_gap";

export type ContentChatEntityOption = {
  name: string;
  scope: "primary" | "core";
  type: string | null;
  description: string;
  links?: Array<{ url: string; title: string; priority?: number }>;
};

export type ContentChatRequest = {
  message: string;
  mode: ContentChatMode;
  label: string;
  entity_name?: string;
  entity_scope?: "primary" | "core";
};

type QuickAction = {
  mode: ContentChatMode;
  label: string;
  prompt: string;
  icon: React.ReactNode;
};

export type InlineSearchConsoleProperty = {
  id: number;
  property_url: string;
  permission_level: string | null;
  sync_status: "idle" | "queued" | "syncing" | "done" | "failed";
  last_synced_at: string | null;
  last_sync_error: string | null;
};

export type InlineSearchConsoleQuery = {
  query: string;
  impressions: number;
  clicks: number;
  trend_percentage: number | null;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    mode: "trend_opportunities",
    get label() { return t("analyze.chatBar.trends.label"); },
    get prompt() { return t("analyze.chatBar.trends.prompt"); },
    icon: <ArrowTrendIcon />,
  },

  {
    mode: "content_gap",
    get label() { return t("analyze.chatBar.gap.label"); },
    get prompt() { return t("analyze.chatBar.gap.prompt"); },
    icon: <GapIcon />,
  },
];

export function ContentChatBar({
  onSend,
  sending,
  disabled,
  creditLimitReached = false,
  error,
  limitMessage = t("analyze.chatBar.limit"), 
  limitBanner,
  gscConnectionStatus,
  gscConnectionError,
  gscProperty,
  gscProperties,
  gscQueries,
  gscLoading,
  onGscConnect,
  onGscLoadProperties,
  onGscSelectProperty,
  onGscSync,
  onGscDisconnect,
  selectedEntity,
  preparedPrompt,
}: {
  onSend: (request: ContentChatRequest) => Promise<boolean>;
  sending: boolean;
  /** یعنی هنوز سشن آماده/انتخاب نشده (لودینگ یا نبود سشن فعال) — ربطی به اعتبار/اشتراک ندارد */
  disabled: boolean;
  /** یعنی کاربر به سقف رایگان یا کمبود اعتبار برخورده — باید کاربر به خرید اشتراک هدایت شود */
  creditLimitReached?: boolean;
  error?: string | null;
  limitMessage?: string;
  /** محتوای غنی (شامل لینک واقعی به صفحه‌ی اشتراک) که در بنر بالای نوار ورودی نمایش داده می‌شود */
  limitBanner?: React.ReactNode;  gscConnectionStatus: "connected" | "expired" | "failed" | null;
  gscConnectionError: string | null;
  gscProperty: InlineSearchConsoleProperty | null;
  gscProperties: Array<{ property_url: string; permission_level: string | null }>;
  gscQueries: InlineSearchConsoleQuery[];
  gscLoading: boolean;
  onGscConnect: () => void;
  onGscLoadProperties: () => void;
  onGscSelectProperty: (propertyUrl: string) => void;
  onGscSync: () => void;
  onGscDisconnect: () => void;
  selectedEntity: ContentChatEntityOption | null;
  preparedPrompt?: string | null;
}) {
  const [message, setMessage] = useState("");
  // هیچ گزینه‌ای به‌صورت پیش‌فرض انتخاب/فعال نیست تا وقتی کاربر خودش یکی را انتخاب کند
  const [selectedMode, setSelectedMode] = useState<ContentChatMode | null>(null);
  const [connectorOpen, setConnectorOpen] = useState(false);
  const [selectedPropertyUrl, setSelectedPropertyUrl] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  // بعد از اولین ارسال موفق پیام، پنل اتصال به یک نوار خیلی کوچک تبدیل/جمع می‌شود
  const [hasSentMessage, setHasSentMessage] = useState(false);
  // قفل محلیِ ارسال: prop مربوط به `sending` از parent می‌آید و فقط بعد از
  // برگشتن کامل درخواست شبکه (و برای حالت‌های keyword_clusters/content_gap حتی
  // دیرتر از آن) true می‌شود. در فاصله‌ی بین کلیک/Enter کاربر و رسیدن آن آپدیت،
  // اگر کاربر دوباره کلیک کند یا Enter بزند، submit() دوباره اجرا و onSend دوباره
  // صدا زده می‌شود؛ همین باعث می‌شد بعضی وقت‌ها یک درخواست، دو یا سه بار در چت
  // ثبت و نمایش داده شود. این state بلافاصله (همان تیک) قفل می‌شود تا چنین
  // فراخوانی هم‌زمانی دیگر ممکن نباشد.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (gscProperty?.property_url) setSelectedPropertyUrl(gscProperty.property_url);
  }, [gscProperty?.property_url]);

  useEffect(() => {
    if (preparedPrompt !== undefined) setMessage(preparedPrompt || "");
  }, [preparedPrompt]);

  useEffect(() => {
    if (!actionMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionMenuOpen]);

  // فقط وقتی کاربر خودش یک گزینه را انتخاب کرده باشد، action‌ی به‌عنوان انتخاب‌شده در نظر گرفته می‌شود
  const selectedAction = selectedMode
    ? QUICK_ACTIONS.find((action) => action.mode === selectedMode) ?? null
    : null;

  // برای منطق ارسال (mode/label ارسالی) وقتی کاربر چیزی انتخاب نکرده، از گزینه‌ی اول به‌عنوان fallback استفاده می‌شود
  // بدون اینکه این fallback در UI به‌صورت active نمایش داده شود
  const effectiveAction = selectedAction ?? QUICK_ACTIONS[0];

  // باگ قبلی: این پرچم فقط برای مود «فرصت‌های محتوایی بر اساس ترند» چک
  // می‌شد (`effectiveAction.mode === "trend_opportunities"`) و برای دو مود
  // دیگر (کلمات کلیدی ترند و شکاف محتوایی رقبا) حتی وقتی اعتبار/اشتراک کافی
  // نبود، دکمه‌ی ارسال فعال می‌ماند و درخواست به سمت بک‌اند می‌رفت. حالا
  // کمبود اعتبار (`creditLimitReached`) و نبودن سشن فعال (`disabled`) هر دو
  // و برای هر سه مود، ارسال را غیرفعال می‌کنند.
  const limitReached = disabled || creditLimitReached;
  const isConnected = gscConnectionStatus === "connected";
  const isSyncing = gscProperty?.sync_status === "queued" || gscProperty?.sync_status === "syncing";
  const isSynced = gscProperty?.sync_status === "done";

  const chooseAction = (action: QuickAction, unavailable: boolean) => {
    if (unavailable) return;
    setSelectedMode(action.mode);
    setMessage(action.prompt);
    setActionMenuOpen(false);
  };

  const submit = async () => {
    const text = message.trim() || selectedAction?.prompt;
    if (!text || sending || isSubmitting || limitReached) return;

    setIsSubmitting(true);
    try {
      const accepted = await onSend({
        message: text,
        mode: effectiveAction.mode,
        label: effectiveAction.label,
        entity_name: selectedEntity?.name,
        entity_scope: selectedEntity?.scope,
      });
      if (accepted !== false) {
        setMessage("");
        setConnectorOpen(false);
        setHasSentMessage(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#E4E5F0] bg-white shadow-sm transition-all focus-within:border-[#5B47FB]/60 focus-within:ring-4 focus-within:ring-[#5B47FB]/10">
      <div className="px-3 pb-1 pt-3">
        {/* دسکتاپ و تبلت */}
        <div className="hidden flex-wrap gap-2 sm:flex">
          {QUICK_ACTIONS.map((action) => {
            const active = action.mode === selectedMode;
            const unavailable = limitReached;
            return (
              <button
                key={action.mode}
                type="button"
                onClick={() => chooseAction(action, unavailable)}
                disabled={unavailable}
                aria-pressed={active}
                title={unavailable ? (creditLimitReached ? limitMessage : undefined) : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${unavailable ? "cursor-not-allowed border-[#E4E5F0] bg-[#F3F2FB] text-[#9A9DB8] opacity-70" : active ? "border-[#5B47FB] bg-[#EFEDFF] text-[#4935E0] shadow-sm" : "border-[#E4E5F0] bg-white text-[#6C7193] hover:border-[#5B47FB]/50 hover:text-[#5B47FB]"}`}
              >
                {action.icon}
                {action.label}
              </button>
            );
          })}
        </div>

        {/* موبایل */}
        <div className="relative sm:hidden" ref={actionMenuRef}>
          <button
            type="button"
            onClick={() => setActionMenuOpen((open) => !open)}
            aria-expanded={actionMenuOpen}
            aria-haspopup="listbox"
            className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${
              selectedAction
                ? "border-[#5B47FB] bg-[#EFEDFF] text-[#4935E0]"
                : "border-[#E4E5F0] bg-white text-[#6C7193]"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {selectedAction ? selectedAction.icon : <ArrowTrendIcon />}
              {selectedAction ? selectedAction.label : t("analyze.chatBar.choosePath")}
            </span>
            <svg
              className={`h-4 w-4 shrink-0 transition-transform ${actionMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {actionMenuOpen && (
            <div role="listbox" className="absolute bottom-full z-20 mb-1.5 w-full overflow-hidden rounded-xl border border-[#E4E5F0] bg-white shadow-lg">
              {QUICK_ACTIONS.map((action) => {
                const active = action.mode === selectedMode;
                const unavailable = limitReached;
                return (
                  <button
                    key={action.mode}
                    type="button"
                    role="option"
                    aria-selected={active}
                    disabled={unavailable}
                    title={unavailable ? (creditLimitReached ? limitMessage : undefined) : undefined}
                    onClick={() => chooseAction(action, unavailable)}
                    className={`flex w-full items-center gap-2 border-b border-[#F3F2FB] px-3 py-2.5 text-start text-xs font-bold transition-colors last:border-b-0 ${unavailable ? "cursor-not-allowed text-[#9A9DB8] opacity-70" : active ? "bg-[#EFEDFF] text-[#4935E0]" : "text-[#6C7193] hover:bg-[#F3F1E9]"}`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

   {creditLimitReached && (
  <div className="mx-3 mt-2 rounded-xl border border-[#E9D9B8] bg-[#FFF8E9] px-3 py-2 text-xs leading-5 text-[#75603B]">
    {limitBanner ?? limitMessage}
  </div>
)}
      {error && <p role="alert" className="mx-3 mt-2 rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] px-3 py-2 text-xs leading-5 text-[#B3453A]">{error}</p>}

      {/* پنل کامل اتصال Search Console — همیشه با باز کردن دکمه در دسترس است.
          فقط زمانی جای خودش را به نوار خلاصه‌ی زیر (بعد از ارسال اولین پیام)
          می‌دهد که واقعاً به یک property متصل شده باشیم؛ در غیر این صورت (هنوز
          متصل نشده یا هنوز property انتخاب نشده) باید همیشه قابل بازشدن بماند،
          وگرنه کاربری که هنوز متصل نشده بعد از اولین پیام هیچ‌وقت نمی‌تواند
          دوباره دکمه‌ی اتصال Google Search Console را ببیند/باز کند. */}
      {connectorOpen && !(hasSentMessage && isConnected && gscProperty) && (
        <div className="mx-3 mt-2 rounded-xl border border-[#CFE3DD] bg-[#F5F4FF] px-2.5 py-1.5">
          {!isConnected && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#4935E0]">{t("analyze.chatBar.gscConnect")}</span>
              <button
                type="button"
                onClick={onGscConnect}
                disabled={gscLoading}
                className="shrink-0 rounded-lg bg-[#5B47FB] px-2.5 py-1 text-[10px] font-bold text-white disabled:opacity-50"
              >
                {gscLoading ? t("analyze.ideas.preparing") : t("analyze.chatBar.connectGoogle")}
              </button>
            </div>
          )}

          {isConnected && !gscProperty && (
            <div className="flex flex-wrap items-center gap-1.5">
              {gscProperties.length === 0 ? (
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#4935E0]">{t("analyze.chatBar.gscConnect")}</span>
                  <button
                    type="button"
                    onClick={onGscLoadProperties}
                    disabled={gscLoading}
                    className="shrink-0 rounded-lg border border-[#C8C0FF] bg-white px-2.5 py-1 text-[10px] font-bold text-[#4935E0] disabled:opacity-50"
                  >
                    {gscLoading ? t("analyze.chatBar.loadingSites") : t("analyze.chatBar.showSites")}
                  </button>
                </div>
              ) : (
                <>
                  <select
                    value={selectedPropertyUrl}
                    onChange={(event) => setSelectedPropertyUrl(event.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-[#C8C0FF] bg-white px-2 py-1 text-[10px] text-[#3B3F5C]"
                  >
                    <option value="">{t("analyze.gsc.selectProperty")}</option>
                    {gscProperties.map((property) => (
                      <option key={property.property_url} value={property.property_url}>{property.property_url}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => selectedPropertyUrl && onGscSelectProperty(selectedPropertyUrl)}
                    disabled={!selectedPropertyUrl || gscLoading}
                    className="shrink-0 rounded-lg bg-[#5B47FB] px-2.5 py-1 text-[10px] font-bold text-white disabled:opacity-50"
                  >
                    {t("analyze.chatBar.select")}
                  </button>
                </>
              )}
            </div>
          )}

          {isConnected && gscProperty && (
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-[10px] font-bold text-[#4935E0]">
                {isSynced
                  ? `✓ ${t("analyze.chatBar.queriesReceived", { count: formatNumber(gscQueries.length) })}`
                  : isSyncing
                  ? t("analyze.chatBar.loadingData")
                  : t("analyze.chatBar.readyToFetch")}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={onGscSync}
                  disabled={gscLoading || isSyncing}
                  className="rounded-lg bg-[#5B47FB] px-2 py-1 text-[10px] font-bold text-white disabled:opacity-50"
                >
                  {isSyncing ? t("analyze.gsc.syncing") : t("analyze.chatBar.fetch")}
                </button>
                <button
                  type="button"
                  onClick={onGscDisconnect}
                  disabled={gscLoading}
                  className="rounded-lg border border-[#E4E5F0] px-2 py-1 text-[10px] font-bold text-[#6C7193] disabled:opacity-50"
                >
                  {t("dashboard.wp.disconnect")}
                </button>
              </div>
            </div>
          )}

          {gscConnectionError && (
            <p className="mt-1 text-[10px] leading-4 text-[#B3453A]">{gscConnectionError}</p>
          )}
        </div>
      )}

      {/* بعد از ارسال اولین پیام، پنل به یک نوار خیلی کوچک و مینیمال کاهش می‌یابد (فقط در حالت اتصال/دریافت موفق) */}
      {hasSentMessage && isConnected && gscProperty && (
        <div className="mx-3 mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-[#5B47FB]">
          <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="truncate">
            {isSynced
              ? t("analyze.chatBar.connectedQueries", { count: formatNumber(gscQueries.length) })
              : isSyncing
              ? t("analyze.chatBar.fetchingGsc")
              : t("analyze.chatBar.gscConnected")}
          </span>
        </div>
      )}

      <div className="flex items-end gap-2 p-3">
     <textarea
  value={message}
  onChange={(event) => setMessage(event.target.value)}
  onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }}
  rows={1}
  maxLength={800}
  disabled={sending || isSubmitting || limitReached}
  placeholder={t("analyze.chatBar.placeholder")}
  className="h-11 min-h-11 max-h-11 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2.5 text-sm leading-6 text-[#0A0B1E] outline-none placeholder:text-[#9A9DB8] disabled:cursor-not-allowed"
  aria-label={t("analyze.request.title")}
/>
        <button type="button" onClick={() => setConnectorOpen((open) => !open)} aria-expanded={connectorOpen} aria-label={t("analyze.gsc.connect")} title={t("analyze.gsc.connect")} className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all ${connectorOpen || isConnected ? "border-[#5B47FB] bg-[#EFEDFF] text-[#4935E0]" : "border-[#E4E5F0] bg-white text-[#6C7193] hover:border-[#5B47FB]/50 hover:text-[#5B47FB]"}`}>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm0 0v4.5m-7.5-4.5H3a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 013 3.75h18a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-1.5" /></svg>
        </button>
        <button type="button" onClick={submit} disabled={sending || isSubmitting || limitReached} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#4935E0] text-white shadow-lg shadow-[#5B47FB]/20 transition-all hover:from-[#6C5BFF] hover:to-[#5B47FB] disabled:cursor-not-allowed disabled:opacity-50" aria-label={t("analyze.chatBar.send")}>
          {sending || isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg className="h-5 w-5 -scale-x-100" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function ArrowTrendIcon() { return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17l5-5 4 4 8-9M14 7h6v6" /></svg>; }
// function ClusterIcon() { return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7.5 6.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-6.75 10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM7.146 8.558l3.458 6.384m2.792 0l3.458-6.384" /></svg>; }
function GapIcon() { return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4.5 19.5V9.75m5.25 9.75V4.5M15 19.5v-6.75m5.25 6.75V7.5" /></svg>; }