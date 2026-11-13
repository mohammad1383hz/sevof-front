import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { referralService, type ReferralInfo, type ReferralRequestItem } from "../services/api";
import { t, tMaybe, formatDate as fmtDate } from "../i18n";

const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 2000;

const steps = () =>
  ([1, 2, 3] as const).map((n) => ({ title: t(`growth.referral.step${n}Title`), text: t(`growth.referral.step${n}Text`) }));

const toLatinDigits = (value: string) => value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

/** Same rule as the server: international number with country code (E.164), 00 prefix allowed. */
const isValidPhone = (value: string) => /^\+[1-9]\d{6,14}$/.test(toLatinDigits(value).replace(/[\s\-().]/g, "").replace(/^00/, "+"));

const formatDate = (value: string | null) => (value ? fmtDate(value) : "");

/**
 * «کسب درآمد با معرفی»: فعلاً فقط فرم درخواست همکاری؛ بعد از بررسی تیم با کاربر تماس می‌گیرد (کد معرف داده نمی‌شود).
 */
const ReferralPage: React.FC = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [audience, setAudience] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<ReferralRequestItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    referralService.get().then((res) => {
      if (res.success && res.data) {
        setInfo(res.data);
        setPhone(res.data.default_phone ?? "");
      } else {
        setLoadError(res.message || t("growth.referral.loadFailed"));
      }
      setLoading(false);
    });
  }, []);

  const current = submitted ?? info?.request ?? null;
  const canSubmitNew = !current || current.status === "rejected";

  const toggleChannel = (key: string) => setChannels((list) => (list.includes(key) ? list.filter((c) => c !== key) : [...list, key]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!isValidPhone(phone)) next.phone = t("growth.referral.phoneInvalid");
    if (channels.length === 0) next.channels = t("growth.referral.channelsRequired");
    if (description.trim().length < DESCRIPTION_MIN) next.description = t("growth.referral.descriptionShort", { min: DESCRIPTION_MIN });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const res = await referralService.submit({ phone, channels, audience_size: audience || null, description: description.trim() });
    setSubmitting(false);

    if (res.success && res.data?.request) {
      setSubmitted(res.data.request);
      setShowForm(false);
      return;
    }

    const serverRequest = (res.data as { request?: ReferralRequestItem } | undefined)?.request;
    if (serverRequest) {
      setSubmitted(serverRequest);
      return;
    }

    const fieldErrors = (res.errors ?? {}) as Record<string, string[]>;
    setErrors({
      phone: fieldErrors.phone?.[0] ?? "",
      channels: fieldErrors.channels?.[0] ?? fieldErrors["channels.0"]?.[0] ?? "",
      description: fieldErrors.description?.[0] ?? "",
      form: Object.keys(fieldErrors).length === 0 ? res.message || t("growth.referral.submitFailed") : "",
    });
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#5B47FB] ${errors[field] ? "border-[#E3C4BC]" : "border-[#E4E5F0]"}`;

  return (
    // صفحه‌ی مستقل مثل صفحه‌ی پلن‌ها (بدون سایدبار): به سایت انتخاب‌شده وابسته نیست و آن را عوض نمی‌کند
    <div dir="rtl" className="min-h-screen bg-[#F6F6FB] pb-6">
      <div className="sticky top-0 z-20 border-b border-[#E6E5F1] bg-[#F6F6FB]/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-2">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/subscription", { replace: true }))}
            className="flex items-center gap-1.5 rounded-lg border border-[#E4E5F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#3B3F5C] shadow-sm transition-colors hover:bg-[#F3F3FA] sm:px-3.5 sm:py-2 sm:text-[13px]"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 10 10)" />
            </svg>
            {t("growth.referral.back")}
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-4 p-3 sm:p-4 lg:p-5">
        <div className="rounded-2xl bg-gradient-to-l from-[#5B47FB] to-[#9B5CFF] p-5 text-white sm:p-6">
          <h1 className="text-lg font-black sm:text-xl">{t("billing.referral.title")}</h1>
          <p className="mt-2 text-xs leading-7 text-white/85 sm:text-sm">
            {t("growth.referral.intro")}
          </p>
        </div>

        <ol className="grid gap-2 sm:grid-cols-3">
          {steps().map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-[#E4E5F0] bg-white p-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFEDFF] text-xs font-black text-[#4935E0]">{(i + 1).toLocaleString("fa-IR")}</span>
              <p className="mt-2 text-xs font-bold text-[#0D0F23] sm:text-sm">{step.title}</p>
              <p className="mt-1 text-[11px] leading-5 text-[#6C7193]">{step.text}</p>
            </li>
          ))}
        </ol>

        {loading && <div className="h-64 animate-pulse rounded-2xl bg-[#F3F2FB] motion-reduce:animate-none" aria-busy="true" />}

        {!loading && loadError && (
          <div role="alert" className="rounded-2xl border border-[#E3C4BC] bg-[#F7EEEA] p-4 text-xs text-[#B3453A] sm:text-sm">
            {loadError}
          </div>
        )}

        {!loading && info && current && !showForm && (
          <div
            className={`rounded-2xl border p-4 sm:p-5 ${
              current.status === "approved" ? "border-[#5B47FB]/30 bg-[#EFEDFF]/50" : current.status === "rejected" ? "border-[#E4E5F0] bg-white" : "border-[#F0DDAA] bg-[#FFF8E6]"
            }`}
            role="status"
          >
            <p className="text-sm font-black text-[#0D0F23]">
              {current.status === "approved" && t("growth.referral.approvedTitle")}
              {current.status === "pending" && t("growth.referral.pendingTitle")}
              {current.status === "rejected" && t("growth.referral.rejectedTitle")}
            </p>
            <p className="mt-1.5 text-xs leading-6 text-[#3B3F5C]">
              {current.status === "approved" && t("growth.referral.approvedBody")}
              {current.status === "pending" && t("growth.referral.pendingBody", { phone: current.phone })}
              {current.status === "rejected" && t("growth.referral.rejectedBody")}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {current.channels.map((c) => (
                <span key={c} className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] text-[#3B3F5C]">
                  {info.channels[c] ?? c}
                </span>
              ))}
            </div>
            {current.created_at && <p className="mt-2 text-[11px] text-[#9A9DB8]">{t("growth.referral.submittedOn", { date: formatDate(current.created_at) })}</p>}
            {current.status === "rejected" && (
              <button type="button" onClick={() => setShowForm(true)} className="mt-3 rounded-xl bg-[#5B47FB] px-4 py-2 text-xs font-black text-white hover:bg-[#4935E0]">
                {t("growth.referral.newRequest")}
              </button>
            )}
          </div>
        )}

        {!loading && info && canSubmitNew && (!current || showForm) && (
          <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-[#E4E5F0] bg-white p-4 sm:p-5">
            <h2 className="text-sm font-black text-[#0D0F23] sm:text-base">{t("growth.referral.formTitle")}</h2>

            <div>
              <label htmlFor="referral-phone" className="mb-1.5 block text-xs font-bold text-[#0D0F23]">
                {t("growth.referral.phone")}
              </label>
              <input
                id="referral-phone"
                type="tel"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 415 555 0123"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "referral-phone-error" : undefined}
                className={`${inputClass("phone")} text-left`}
              />
              {errors.phone && (
                <p id="referral-phone-error" className="mt-1 text-[11px] text-[#B3453A]">
                  {errors.phone}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="mb-1.5 text-xs font-bold text-[#0D0F23]">{t("growth.referral.where")}</legend>
              <div className="flex flex-wrap gap-2">
                {Object.entries(info.channels).map(([key, label]) => {
                  const checked = channels.includes(key);
                  return (
                    <label
                      key={key}
                      className={`cursor-pointer rounded-xl border px-3 py-2 text-xs transition-colors ${
                        checked ? "border-[#5B47FB] bg-[#EFEDFF] font-bold text-[#4935E0]" : "border-[#E4E5F0] bg-white text-[#3B3F5C] hover:border-[#5B47FB]/50"
                      }`}
                    >
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleChannel(key)} />
                      {tMaybe(`growth.referral.channel.${key}`, label)}
                    </label>
                  );
                })}
              </div>
              {errors.channels && <p className="mt-1 text-[11px] text-[#B3453A]">{errors.channels}</p>}
            </fieldset>

            <div>
              <label htmlFor="referral-audience" className="mb-1.5 block text-xs font-bold text-[#0D0F23]">
                {t("growth.referral.audience")} <span className="font-normal text-[#9A9DB8]">({t("growth.referral.optional")})</span>
              </label>
              <select id="referral-audience" value={audience} onChange={(e) => setAudience(e.target.value)} className={inputClass("audience")}>
                <option value="">{t("growth.referral.choose")}</option>
                {Object.entries(info.audience_sizes).map(([key, label]) => (
                  <option key={key} value={key}>
                    {tMaybe(`growth.referral.audienceSize.${key}`, label)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="referral-description" className="mb-1.5 block text-xs font-bold text-[#0D0F23]">
                {t("growth.referral.description")}
              </label>
              <textarea
                id="referral-description"
                rows={5}
                maxLength={DESCRIPTION_MAX}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("growth.referral.descriptionPlaceholder")}
                aria-invalid={!!errors.description}
                aria-describedby="referral-description-hint"
                className={`${inputClass("description")} leading-7`}
              />
              <div id="referral-description-hint" className="mt-1 flex justify-between gap-2 text-[11px]">
                <span className="text-[#B3453A]">{errors.description}</span>
                <span className="shrink-0 text-[#9A9DB8]">
                  {description.trim().length.toLocaleString("fa-IR")} / {DESCRIPTION_MAX.toLocaleString("fa-IR")}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-[#6C7193]">{t("growth.referral.descriptionHint")}</p>
            </div>

            {errors.form && (
              <p role="alert" className="rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] p-2.5 text-xs text-[#B3453A]">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#5B47FB] px-4 py-3 text-sm font-black text-white shadow-sm shadow-[#5B47FB]/25 hover:bg-[#4935E0] disabled:opacity-60 sm:w-auto"
            >
              {submitting ? t("growth.referral.submitting") : t("growth.referral.submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;
