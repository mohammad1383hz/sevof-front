import { env } from "../../env";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Link2,
  Unlink,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Loader2,
  Globe,
  Clock,
  KeyRound,
  X,
  Radio,
  Download,
  Package,
  PlayCircle,
} from "lucide-react";
import { wordpressService } from "../../services/api";
import type {
  SiteConnection,
  ConnectCredentials,
  WordPressConnectionStatus,
  WordPressHealthStatus,
} from "../../types";
import { t, formatRelative } from "../../i18n";

// ==========================================================
// کمک‌تابع‌ها
// ==========================================================

/** نمایش نسبی زمان («۵ دقیقه پیش»، «۲ روز پیش») بدون نیاز به کتابخانه‌ی جدا */
const relativeTime = (iso: string | null): string => {
  return formatRelative(iso);
};

const STATUS_CONFIG: Record<
  WordPressConnectionStatus,
  { label: string; dot: string; badge: string }
> = {
  connected: {
    label: "dashboard.wp.status.connected",
    dot: "bg-[#5B47FB]",
    badge: "bg-[#EFEDFF] text-[#5B47FB] border-[#5B47FB]/30",
  },
  pending: {
    label: "dashboard.wp.status.pending",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
  },
  disconnected: {
    label: "dashboard.wp.status.disconnected",
    dot: "bg-[#9A9DB8]",
    badge: "bg-[#F3F2FB] text-[#0D0F23] border-[#E4E5F0]",
  },
};

const HEALTH_CONFIG: Record<WordPressHealthStatus, { label: string; className: string }> = {
  healthy: { label: "dashboard.wp.health.healthy", className: "text-[#5B47FB]" },
  unhealthy: { label: "dashboard.wp.health.unhealthy", className: "text-rose-600" },
  unreachable: { label: "dashboard.wp.health.unreachable", className: "text-[#0D0F23]" },
};

/** آدرس پیش‌فرض دانلود افزونه‌ی وردپرس (در صورت نبود prop سفارشی) */
const DEFAULT_PLUGIN_DOWNLOAD_URL = "/downloads/wordpress-plugin.zip";

/** WordPress.org plugin page; set VITE_WP_PLUGIN_PAGE_URL once the Sevof plugin is published there. */
const WORDPRESS_PLUGIN_PAGE_URL =
  env("VITE_WP_PLUGIN_PAGE_URL") || DEFAULT_PLUGIN_DOWNLOAD_URL;

/** مسیر صفحه‌ی ویدیوی آموزشی (در App.tsx ثبت شده) */
const EDU_VIDEO_PATH = "/edu-wordpress";

// ==========================================================
// نشان اعتماد: لینک به صفحه‌ی رسمی افزونه در WordPress.org
// ==========================================================

const WordPressVerifiedBadge: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <a
    href={WORDPRESS_PLUGIN_PAGE_URL}
    target="_blank"
    rel="noreferrer"
    className={`group inline-flex items-center gap-1.5 rounded-full border border-[#21759B]/40 bg-white hover:bg-[#F3FAFD] hover:border-[#21759B]/70 shadow-sm hover:shadow transition-all ${
      compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
    } font-medium text-[#21759B]`}
  >
    <img
      src="/wp.webp"
      alt="WordPress"
      className={`shrink-0 object-contain ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`}
    />
    <span className="underline underline-offset-2 decoration-[#21759B]/40 group-hover:decoration-[#21759B]">
      {t("dashboard.wp.verified")}
    </span>
    <CheckCircle2
      strokeWidth={2.75}
      className={compact ? "h-3.5 w-3.5 text-[#0F9D58]" : "h-4 w-4 text-[#0F9D58]"}
    />
  </a>
);

// ==========================================================
// لینک «ویدیو آموزش» — کاربر را به صفحه‌ی آموزشی می‌برد.
// siteId در آدرس می‌رود تا سایدبار همان سایت را نشان بدهد.
// ==========================================================

const EduVideoLink: React.FC<{
  siteId?: number | string;
  onNavigate?: () => void;
  /** حالت دکمه‌ای (برای هدر کارت که در همه‌ی حالت‌ها دیده می‌شود) */
  pill?: boolean;
}> = ({ siteId, onNavigate, pill }) => (
  <Link
    to={siteId ? `${EDU_VIDEO_PATH}?site=${siteId}` : EDU_VIDEO_PATH}
    onClick={onNavigate}
    className={
      pill
        ? "inline-flex items-center gap-1.5 rounded-full border border-[#5B47FB]/30 bg-[#5B47FB]/5 px-2.5 py-1 text-xs font-medium text-[#5B47FB] hover:bg-[#5B47FB]/10 hover:border-[#5B47FB]/50 transition-colors"
        : "inline-flex items-center gap-1.5 text-xs font-medium text-[#5B47FB] hover:text-[#9B5CFF] hover:underline underline-offset-2"
    }
  >
    <PlayCircle className="h-4 w-4" />
    {t("growth.edu.tutorial")}
  </Link>
);

// ==========================================================
// فیلد کوچک برای نمایش + کپی مقادیر (client_id / client_secret / api_key)
// ==========================================================

const CopyField: React.FC<{ label: string; value: string; secret?: boolean }> = ({
  label,
  value,
  secret,
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // اگر کلیپ‌بورد در دسترس نبود، بی‌صدا رد می‌شویم؛ کاربر می‌تواند دستی انتخاب کند
    }
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-[#0D0F23]">{label}</span>
        {secret && (
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
            <AlertTriangle className="h-3 w-3" />
            {t("dashboard.wp.shownOnce")}
          </span>
        )}
      </div>
      <div className="flex items-stretch gap-2">
        <code
          dir="ltr"
          className="flex-1 px-3 py-2 rounded-lg bg-[#F3F2FB] border border-[#E4E5F0] text-[#0D0F23] text-xs font-mono overflow-x-auto whitespace-nowrap"
        >
          {value}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={t("dashboard.wp.copy", { label })}
          className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg border border-[#E4E5F0] text-[#0D0F23] hover:text-[#5B47FB] hover:border-[#5B47FB]/40 hover:bg-[#EFEDFF] transition-colors"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[#5B47FB]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// ==========================================================
// کارت دانلود افزونه‌ی وردپرس — واکنش‌گرا برای موبایل و دسکتاپ
// ==========================================================

const PluginDownloadCard: React.FC<{
  downloadUrl: string;
  compact?: boolean;
  siteId?: number | string;
  /** نمایش لینک ویدیو داخل کارت (لینک اصلی در هدر کارت است؛ این فقط برای مودال) */
  showVideoLink?: boolean;
  /** وقتی لینک ویدیو داخل مودال است، با کلیک مودال بسته می‌شود */
  onNavigate?: () => void;
}> = ({ downloadUrl, compact, siteId, showVideoLink, onNavigate }) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <a
          href={downloadUrl}
          download
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B47FB] hover:text-[#4935E0] hover:underline underline-offset-2"
        >
          <Download className="h-3.5 w-3.5" />
          {t("dashboard.wp.downloadLatest")}
        </a>
        {showVideoLink && <EduVideoLink siteId={siteId} onNavigate={onNavigate} />}
        <WordPressVerifiedBadge compact />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl border border-[#5B47FB]/25 bg-[#EFEDFF]/60 p-4">
      <span className="hidden sm:inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#5B47FB] text-white">
        <Package className="h-5 w-5" />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#0D0F23] flex items-center gap-1.5 sm:hidden">
          <Package className="h-4 w-4 text-[#5B47FB]" />
          {t("dashboard.wp.plugin")}
        </p>
        <p className="hidden sm:block text-sm font-bold text-[#0D0F23]">{t("dashboard.wp.plugin")}</p>
        <p className="text-xs text-[#4935E0]/80 mt-0.5 leading-relaxed">
          {t("dashboard.wp.pluginBody")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <WordPressVerifiedBadge />
          {showVideoLink && <EduVideoLink siteId={siteId} onNavigate={onNavigate} />}
        </div>
      </div>

      <a
        href={downloadUrl}
        download
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#5B47FB] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#4935E0] active:scale-[0.98] transition-all"
      >
        <Download className="h-4 w-4" />
        {t("dashboard.wp.download")}
      </a>
    </div>
  );
};

// ==========================================================
// مودال نمایش اطلاعات اتصال تازه‌ساخته‌شده (پس از connect/reconnect)
// ==========================================================

const CredentialsModal: React.FC<{
  credentials: ConnectCredentials;
  wpUrl: string | null;
  pluginDownloadUrl: string;
  siteId?: number | string;
  onClose: () => void;
}> = ({ credentials, onClose, pluginDownloadUrl, siteId }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0F23]/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wp-credentials-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-[#E4E5F0] overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#E4E5F0]/60">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EFEDFF] text-[#5B47FB]">
              <KeyRound className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 id="wp-credentials-title" className="text-base font-bold text-[#0D0F23]">
                {t("dashboard.wp.credentials.title")}
              </h2>
              <p className="text-xs text-bold text-black mt-0.5">
                {t("dashboard.wp.credentials.body")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.actions.close")}
            className="text-[#9A9DB8] hover:text-[#0D0F23] rounded-lg p-1"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <PluginDownloadCard
            downloadUrl={pluginDownloadUrl}
            siteId={siteId}
            showVideoLink
            onNavigate={onClose}
          />

          <CopyField label="Client ID" value={credentials.client_id} />
          <CopyField label="Client Secret" value={credentials.client_secret} secret />
          <CopyField label="API Key" value={credentials.api_key} />

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              {t("dashboard.wp.credentials.warning")}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 bg-[#F3F2FB] border-t border-[#E4E5F0]/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#5B47FB] text-white text-sm font-medium hover:bg-[#4935E0] transition-colors"
          >
            {t("dashboard.wp.credentials.done")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// دیالوگ تأیید برای عملیات حساس (اتصال مجدد / قطع اتصال)
// ==========================================================

const ConfirmDialog: React.FC<{
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, description, confirmLabel, danger, busy, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0F23]/40 backdrop-blur-sm p-4"
    role="dialog"
    aria-modal="true"
  >
    <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl border border-[#E4E5F0] p-6">
      <h3 className="text-sm font-bold text-[#0D0F23]">{title}</h3>
      <p className="text-sm text-[#0D0F23] mt-2 leading-relaxed">{description}</p>
      <div className="flex justify-end gap-2 mt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="px-4 py-2 rounded-lg text-sm font-medium text-[#0D0F23] hover:bg-[#F6F6FB] transition-colors disabled:opacity-50"
        >
          {t("common.actions.cancel")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-60 inline-flex items-center gap-2 ${
            danger ? "bg-rose-600 hover:bg-rose-700" : "bg-[#5B47FB] hover:bg-[#4935E0]"
          }`}
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />}
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ==========================================================
// کارت اصلی
// ==========================================================

interface WordPressConnectionCardProps {
  siteId: number | string;
  /** آدرس دانلود فایل zip افزونه‌ی وردپرس؛ در صورت ندادن، مقدار پیش‌فرض استفاده می‌شود */
  pluginDownloadUrl?: string;
}

type ConfirmKind = "reconnect" | "disconnect" | null;

const WordPressConnectionCard: React.FC<WordPressConnectionCardProps> = ({
  siteId,
  pluginDownloadUrl = DEFAULT_PLUGIN_DOWNLOAD_URL,
}) => {
  const [connection, setConnection] = useState<SiteConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [connecting, setConnecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const [credentials, setCredentials] = useState<ConnectCredentials | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const bannerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((type: "success" | "error", text: string) => {
    setBanner({ type, text });
    if (bannerTimeout.current) clearTimeout(bannerTimeout.current);
    bannerTimeout.current = setTimeout(() => setBanner(null), 5000);
  }, []);

  useEffect(() => () => {
    if (bannerTimeout.current) clearTimeout(bannerTimeout.current);
  }, []);

  const fetchConnection = useCallback(async () => {
    try {
      const res = await wordpressService.show(siteId);
      if (res.success) {
        setConnection(res.data?.data ?? null);
        setLoadError(null);
      } else {
        setLoadError(res.message || t("dashboard.wp.errors.load"));
      }
    } catch {
      setLoadError(t("dashboard.wp.errors.loadNetwork"));
    }
  }, [siteId]);

  useEffect(() => {
    setLoading(true);
    fetchConnection().finally(() => setLoading(false));
  }, [fetchConnection]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await wordpressService.connect(siteId);
      if (res.success && res.data?.data) {
        setCredentials(res.data.data);
        await fetchConnection();
      } else {
        showBanner("error", res.message || t("dashboard.wp.errors.connect"));
      }
    } catch {
      showBanner("error", t("common.errors.network"));
    } finally {
      setConnecting(false);
    }
  };

  const handleReconnect = async () => {
    setConfirmBusy(true);
    try {
      const res = await wordpressService.reconnect(siteId);
      if (res.success && res.data?.data) {
        setCredentials(res.data.data);
        await fetchConnection();
        setConfirmKind(null);
      } else {
        showBanner("error", res.message || t("dashboard.wp.errors.reconnect"));
      }
    } catch {
      showBanner("error", t("common.errors.network"));
    } finally {
      setConfirmBusy(false);
    }
  };

  const handleDisconnect = async () => {
    setConfirmBusy(true);
    try {
      const res = await wordpressService.disconnect(siteId);
      if (res.success) {
        setConnection(res.data?.data ?? null);
        setConfirmKind(null);
        showBanner("success", t("dashboard.wp.disconnected"));
      } else {
        showBanner("error", res.message || t("dashboard.wp.errors.disconnect"));
      }
    } catch {
      showBanner("error", t("common.errors.network"));
    } finally {
      setConfirmBusy(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await wordpressService.test(siteId);
      const result = res.data?.data;
      if (result?.ok) {
        showBanner("success", t("dashboard.wp.testOk"));
      } else {
        showBanner("error", result?.message || res.message || t("dashboard.wp.testBad"));
      }
    } catch {
      showBanner("error", t("dashboard.wp.errors.testNetwork"));
    } finally {
      setTesting(false);
      fetchConnection();
    }
  };

  // ------------------------------------------------------
  // رندر
  // ------------------------------------------------------

  return (
    <>
      <section className="rounded-2xl border border-[#E4E5F0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3 border-b border-[#E4E5F0]/60">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D0F23] text-white">
              <Globe className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-[#0D0F23]">{t("dashboard.wp.title")}</h2>
              <p className="text-xs text-[#9A9DB8] mt-0.5">
                {t("dashboard.wp.subtitle")}
              </p>
            </div>
          </div>

          {/* لینک ویدیو آموزش — همیشه و در همه‌ی حالت‌ها دیده می‌شود */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <EduVideoLink siteId={siteId} pill />
            {!loading && connection && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_CONFIG[connection.status].badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[connection.status].dot} ${
                    connection.status === "pending" ? "animate-pulse motion-reduce:animate-none" : ""
                  }`}
                />
                {t(STATUS_CONFIG[connection.status].label)}
              </span>
            )}
          </div>
        </div>

        <div className="px-5 sm:px-6 py-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-[#9A9DB8] py-3">
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
              {t("dashboard.wp.checking")}
            </div>
          )}

          {!loading && loadError && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 p-3 text-sm">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {loadError}
            </div>
          )}

          {!loading && !loadError && banner && (
            <div
              className={`mb-3 flex items-start gap-2 rounded-xl p-3 text-sm border ${
                banner.type === "success"
                  ? "bg-[#EFEDFF] border-[#5B47FB]/30 text-[#4935E0]"
                  : "bg-rose-50 border-rose-200 text-rose-600"
              }`}
            >
              {banner.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              {banner.text}
            </div>
          )}

          {!loading && !loadError && (!connection || connection.status === "disconnected") && (
            <div className="space-y-4 py-1">
              <PluginDownloadCard downloadUrl={pluginDownloadUrl} siteId={siteId} />

              <div className="flex flex-col items-center text-center gap-3 py-2">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F2FB] border border-[#E4E5F0] text-[#9A9DB8]">
                  <Link2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-[#0D0F23]">
                    {t("dashboard.wp.empty")}
                  </p>
                  <p className="text-xs text-[#9A9DB8] mt-1 max-w-sm">
                    {t("dashboard.wp.emptyBody")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={connecting}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#5B47FB] px-4 py-2 text-sm font-medium text-white hover:bg-[#4935E0] transition-colors disabled:opacity-60"
                >
                  {connecting ? (
                    <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  {t("dashboard.wp.connect")}
                </button>
              </div>
            </div>
          )}

          {!loading && !loadError && connection && connection.status === "pending" && (
            <div className="space-y-3">
              <PluginDownloadCard downloadUrl={pluginDownloadUrl} siteId={siteId} />

              <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-3">
                <Radio className="h-4 w-4 text-amber-500 shrink-0 mt-0.5 animate-pulse motion-reduce:animate-none" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">{t("dashboard.wp.waiting")}</p>
                  <p className="text-xs mt-1 text-amber-600/90">
                    {t("dashboard.wp.waitingBody")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testing}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E4E5F0] px-3.5 py-2 text-sm font-medium text-[#0D0F23] hover:bg-[#F6F6FB] transition-colors disabled:opacity-60"
                >
                  {testing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {t("dashboard.wp.check")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmKind("reconnect")}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E4E5F0] px-3.5 py-2 text-sm font-medium text-[#0D0F23] hover:bg-[#F6F6FB] transition-colors"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {t("dashboard.wp.newCredentials")}
                </button>
              </div>
            </div>
          )}

          {!loading && !loadError && connection && connection.status === "connected" && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#E4E5F0] p-2.5">
                  <p className="text-[11px] text-[#9A9DB8] mb-1">{t("dashboard.wp.siteUrl")}</p>
                  {connection.wp_url ? (
                    <a
                      href={connection.wp_url}
                      target="_blank"
                      rel="noreferrer"
                      dir="ltr"
                      className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] hover:underline break-all"
                    >
                      {connection.wp_url}
                    </a>
                  ) : (
                    <p className="text-sm text-[#9A9DB8]">—</p>
                  )}
                </div>
                <div className="rounded-xl border border-[#E4E5F0] p-2.5">
                  <p className="text-[11px] text-[#9A9DB8] mb-1">{t("dashboard.wp.versions")}</p>
                  <p className="text-sm font-medium text-[#0D0F23]">
                    {connection.wp_version ?? "—"}
                    {connection.plugin_version ? ` · ${t("dashboard.wp.pluginVersion", { version: connection.plugin_version })}` : ""}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E4E5F0] p-2.5">
                  <p className="text-[11px] text-[#9A9DB8] mb-1">{t("dashboard.wp.healthTitle")}</p>
                  <p
                    className={`text-sm font-medium flex items-center gap-1.5 ${
                      connection.last_health_status
                        ? HEALTH_CONFIG[connection.last_health_status].className
                        : "text-[#9A9DB8]"
                    }`}
                  >
                    {connection.last_health_status
                      ? t(HEALTH_CONFIG[connection.last_health_status].label)
                      : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E4E5F0] p-2.5">
                  <p className="text-[11px] text-[#9A9DB8] mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t("dashboard.wp.lastCheck")}
                  </p>
                  <p className="text-sm font-medium text-[#0D0F23]">
                    {relativeTime(connection.last_health_check_at)}
                  </p>
                </div>
              </div>

              {connection.last_error && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 p-3 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  {connection.last_error}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testing}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E4E5F0] px-3.5 py-2 text-sm font-medium text-[#0D0F23] hover:bg-[#F6F6FB] transition-colors disabled:opacity-60"
                >
                  {testing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {t("dashboard.wp.test")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmKind("reconnect")}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E4E5F0] px-3.5 py-2 text-sm font-medium text-[#0D0F23] hover:bg-[#F6F6FB] transition-colors"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {t("dashboard.wp.reconnect")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmKind("disconnect")}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors ms-auto"
                >
                  <Unlink className="h-3.5 w-3.5" />
                  {t("dashboard.wp.disconnect")}
                </button>
              </div>

              <div className="flex justify-center sm:justify-start pt-1">
                <PluginDownloadCard downloadUrl={pluginDownloadUrl} siteId={siteId} compact />
              </div>
            </div>
          )}
        </div>
      </section>

      {credentials && (
        <CredentialsModal
          credentials={credentials}
          wpUrl={connection?.wp_url ?? null}
          pluginDownloadUrl={pluginDownloadUrl}
          siteId={siteId}
          onClose={() => setCredentials(null)}
        />
      )}

      {confirmKind === "reconnect" && (
        <ConfirmDialog
          title={t("dashboard.wp.confirmReconnectTitle")}
description={t("dashboard.wp.confirmReconnectBody")}
          confirmLabel={t("dashboard.wp.reconnect")}
          busy={confirmBusy}
          onConfirm={handleReconnect}
          onCancel={() => setConfirmKind(null)}
        />
      )}

      {confirmKind === "disconnect" && (
        <ConfirmDialog
          title={t("dashboard.wp.confirmDisconnectTitle")}
          description={t("dashboard.wp.confirmDisconnectBody")}
          confirmLabel={t("dashboard.wp.disconnect")}
          danger
          busy={confirmBusy}
          onConfirm={handleDisconnect}
          onCancel={() => setConfirmKind(null)}
        />
      )}
    </>
  );
};

export default WordPressConnectionCard;