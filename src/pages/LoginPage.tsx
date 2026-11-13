import { env } from "../env";
// src/pages/LoginPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { authService } from "../services/api";
import ChartShowcase from "../components/ChartShowcase";
import ValueProposition from "../components/ValueProposition";
import OtpInput from "../components/OtpInput";
import TrustBadge from "../components/TrustBadge";
import { isAllowedEmailProvider } from "../utils/emailProviders";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { t, getLang, formatNumber } from "../i18n";
import { tx } from "../i18n/rich";

/* ────────────────────────────────────────────────────────────────────────────
 * Types & constants
 * ──────────────────────────────────────────────────────────────────────────── */

type Step = "email" | "emailPassword" | "emailVerify";

const RESEND_SECONDS = 60;
const GOOGLE_CLIENT_ID = env("VITE_GOOGLE_CLIENT_ID") || "";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>
          ) => void;
        };
      };
    };
  }
}

interface LoginPageProps {
  onLogin: (token: string) => void;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────── */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrollToLogin = () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  window.setTimeout(
    () => document.getElementById("email")?.focus({ preventScroll: true }),
    450
  );
};

/* ────────────────────────────────────────────────────────────────────────────
 * Small shared UI pieces
 * ──────────────────────────────────────────────────────────────────────────── */

const ErrorMessage: React.FC<{ text: string | null }> = ({ text }) =>
  text ? (
    <p
      role="alert"
      className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded px-3 py-2"
    >
      {text}
    </p>
  ) : null;

const SubmitButton: React.FC<{
  loading: boolean;
  idle: string;
  busy: string;
}> = ({ loading, idle, busy }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full rounded bg-[#1B6F63] text-white text-sm font-bold py-2.5 min-h-[44px] hover:bg-[#14564C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6F63]"
  >
    {loading ? busy : idle}
  </button>
);

const StepHeading: React.FC<{
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}> = ({ eyebrow, title, children }) => (
  <>
    <p className="text-[#1B6F63] text-center font-semibold mb-2 text-xs font-mono">
      {eyebrow}
    </p>
    <h1 className="text-base text-center sm:text-lg font-bold text-[#1E2A28] mb-1">
      {title}
    </h1>
    <p className="text-xs text-center sm:text-sm text-[#3D453F] mb-4 sm:mb-6">
      {children}
    </p>
  </>
);

const inputBase =
  "w-full rounded border border-[#DAD5C7] bg-[#FBFAF6] px-3 sm:px-3.5 text-[#1E2A28] focus:outline-none focus:ring-2 focus:ring-[#1B6F63]/40 focus:border-[#1B6F63] read-only:opacity-70 read-only:cursor-not-allowed";
// ورودی‌ها dir="ltr" هستند؛ text-start باعث می‌شود متن راهنما در صفحه‌ی راست‌به‌چپ، راست‌چین بماند
const textInput = `${inputBase} py-2.5 text-sm text-start placeholder:text-[#9BA69F]`;
const labelCls = "block text-sm font-medium text-[#3D453F] mb-1.5";

/* ────────────────────────────────────────────────────────────────────────────
 * بخش ۳: سه قدم تا شروع
 * (متن‌ها هنگام رندر ساخته می‌شوند تا با زبان انتخاب‌شده هماهنگ باشند)
 * ──────────────────────────────────────────────────────────────────────────── */
const getSteps = () => [
  { n: 1, img: "/step-1.svg", title: t("landing.steps.s1Title"), text: t("landing.steps.s1Text") },
  { n: 2, img: "/step-2.svg", title: t("landing.steps.s2Title"), text: t("landing.steps.s2Text") },
  { n: 3, img: "/step-3.svg", title: t("landing.steps.s3Title"), text: t("landing.steps.s3Text") },
];

const StepsSection: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <section id="how" className="relative z-10 mx-auto max-w-[1100px] px-6 pb-4 pt-6 sm:px-8 sm:pt-8" aria-labelledby="steps-title">
    <h2 id="steps-title" className="mb-6 text-center text-xl font-bold text-[#1E2A28] sm:text-2xl md:mb-8">
      {t("landing.steps.title")}
    </h2>

    <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
      {getSteps().map((s) => (
        <li key={s.n} className="flex flex-col items-center space-y-3 text-center">
          <div className="relative aspect-[360/252] w-full max-w-[260px]">
            <img
              src={s.img}
              alt={`${formatNumber(s.n)}. ${s.title}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#1E2A28] sm:text-lg">
              {formatNumber(s.n)}. {s.title}
            </h3>
            <p className="text-sm leading-7 text-[#5B645E]">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>

    <div className="mt-6 flex justify-center md:mt-8">
      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-[#1B6F63] px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#14564C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B6F63]"
      >
        {t("landing.steps.cta")}
      </button>
    </div>
  </section>
);

// این بخش‌ها props ثابت دارند؛ با memo با هر تایپ یا تیک تایمر دوباره رندر نمی‌شوند
// (با تغییر زبان کل برنامه دوباره mount می‌شود، پس متن‌ها همیشه به‌روزند)
const TrustBadgeMemo = React.memo(TrustBadge);
const StepsSectionMemo = React.memo(StepsSection);
const ChartShowcaseMemo = React.memo(ChartShowcase);

/* ────────────────────────────────────────────────────────────────────────────
 * LoginPage
 * ──────────────────────────────────────────────────────────────────────────── */

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const handleGoogleResponse = async (response: { credential: string }) => {
      setError(null);
      setGoogleLoading(true);
      const res = await authService.loginWithGoogle({
        id_token: response.credential,
      });
      setGoogleLoading(false);

      if (!res.success || !res.data?.token) {
        setError(res.message || t("auth.errors.googleFailed"));
        return;
      }
      onLogin(res.data.token);
    };

    const renderButton = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: googleBtnRef.current.clientWidth || 320,
        locale: getLang(),
      });
    };

    if (window.google) {
      renderButton();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://accounts.google.com/gsi/client?hl=${getLang()}`;
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1 && timerRef.current) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const goBack = (to: Step, reset: () => void) => () => {
    setStep(to);
    reset();
    setError(null);
  };

  // مرحله اول: ایمیل (فقط سرویس‌های معتبر مثل Gmail و Yahoo)
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    const value = email.trim().toLowerCase();
    setEmail(value);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(t("auth.errors.invalidEmail"));
      return;
    }
    if (!isAllowedEmailProvider(value)) {
      setError(t("auth.errors.emailProvider"));
      return;
    }
    // هنوز درخواستی نمی‌فرستیم؛ فقط می‌ریم مرحله پسورد
    setStep("emailPassword");
  };

  // مرحله دوم (ایمیل): ورود یا شروع ثبت‌نام با پسورد
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (password.length < 6) {
      setError(t("auth.errors.passwordShort"));
      return;
    }

    setLoading(true);
    const res = await authService.sendEmailLogin({ email, password });
    setLoading(false);

    if (!res.success) {
      setError(res.message || t("common.errors.generic"));
      return;
    }

    if (res.data?.status === "login" && res.data.token) {
      onLogin(res.data.token);
      return;
    }

    // status === "verification_required"
    setStep("emailVerify");
    startCooldown();
  };

  // مرحله سوم (ایمیل): تأیید کد ارسال‌شده به ایمیل
  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (code.trim().length !== 6) {
      setError(t("auth.errors.emailCodeIncomplete"));
      return;
    }

    setLoading(true);
    const res = await authService.verifyEmail({ email, code });
    setLoading(false);

    if (!res.success || !res.data?.token) {
      setError(res.message || t("auth.errors.codeWrong"));
      return;
    }

    onLogin(res.data.token);
  };

  const handleResendEmailCode = async () => {
    if (cooldown > 0) return;
    setError(null);
    setLoading(true);
    const res = await authService.sendEmailLogin({ email, password });
    setLoading(false);

    if (!res.success) {
      setError(res.message || t("auth.errors.resendFailed"));
      return;
    }
    startCooldown();
  };

  const resendLabel = cooldown > 0 ? t("auth.otp.resendIn", { seconds: cooldown }) : t("auth.otp.resend");
  const linkBtn = "text-[#3D453F] hover:text-[#1B6F63] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const resendBtn =
    "text-[#1B6F63] hover:text-[#14564C] disabled:text-[#9BA69F] disabled:cursor-not-allowed transition-colors";
  const ltrValue = (value: string) => (
    <span dir="ltr" className="font-medium text-[#1E2A28]">{value}</span>
  );

  return (
    <div className="relative min-h-screen bg-[#EFEDE6] text-[#1E2A28] selection:bg-[#CBE0DA] selection:text-[#1E2A28]">
      <div className="fixed inset-0 opacity-50 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E3DFD1] via-[#EFEDE6] to-[#F9F8F3]" />

      {/* انتخاب زبان — در موبایل در یک ردیف جدا بالای لوگو، تا روی آن نیفتد */}
      <div className="relative z-20 flex justify-end px-4 pt-4 sm:absolute sm:end-4 sm:top-4 sm:p-0">
        <LanguageSwitcher />
      </div>

      {/* ───────── بخش اول: فرم ورود ───────── */}
      <header className="relative z-10 flex flex-col items-center px-4 pb-2 pt-3 sm:pt-12">
          <div className="w-full max-w-sm">
            <div className="mb-4 flex items-center justify-center gap-2">
              <img src="/logo.png" alt="Sevof" className="h-8 w-8 sm:h-9 sm:w-9 object-contain" />
              <span className="text-2xl font-bold text-[#1B6F63] tracking-tighter">Sevof</span>
            </div>

            <div className="bg-[#FBFAF6] rounded-2xl shadow-md ring-1 ring-black/[0.03] border border-[#DAD5C7] p-5 sm:p-7">
              {step === "email" && (
                <>
                  {GOOGLE_CLIENT_ID && (
                    <>
                      <div className="mb-5">
                        <div className="flex justify-center">
                          <div ref={googleBtnRef} />
                        </div>
                        {googleLoading && (
                          <p className="text-center text-xs text-[#5B645E] mt-2">{t("auth.login.googleSigningIn")}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-5" aria-hidden="true">
                        <div className="h-px flex-1 bg-[#DAD5C7]" />
                        <span className="text-xs text-[#5B645E]">{t("landing.or")}</span>
                        <div className="h-px flex-1 bg-[#DAD5C7]" />
                      </div>
                    </>
                  )}

                  <StepHeading eyebrow={t("auth.login.eyebrow")} title={t("auth.login.title")}>
                    {t("auth.login.subtitle")}
                  </StepHeading>

                  <form onSubmit={handleEmailSubmit} noValidate className="space-y-4">
                    <div>
                      <label htmlFor="email" className={labelCls}>
                        {t("auth.login.emailLabel")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        dir="ltr"
                        inputMode="email"
                        autoComplete="email"
                        placeholder={t("auth.login.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={loading}
                        className={textInput}
                        autoFocus
                      />
                    </div>
                    <ErrorMessage text={error} />
                    <SubmitButton loading={loading} idle={t("common.actions.continue")} busy={t("auth.login.checking")} />
                  </form>
                </>
              )}

              {step === "emailPassword" && (
                <>
                  <StepHeading eyebrow={t("auth.email.eyebrow")} title={t("auth.email.title")}>
                    {tx("auth.email.forAccount", { email: ltrValue(email) })}
                  </StepHeading>

                  <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="password" className={labelCls}>{t("auth.email.passwordLabel")}</label>
                      <input
                        id="password"
                        type="password"
                        dir="ltr"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        readOnly={loading}
                        className={textInput}
                        autoFocus
                      />
                    </div>
                    <ErrorMessage text={error} />
                    <SubmitButton loading={loading} idle={t("common.actions.continue")} busy={t("auth.login.checking")} />

                    <div className="pt-1 text-xs sm:text-sm text-center">
                      <button type="button" onClick={goBack("email", () => setPassword(""))} disabled={loading} className={linkBtn}>
                        {t("auth.email.editEmail")}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {step === "emailVerify" && (
                <>
                  <StepHeading eyebrow={t("auth.emailVerify.eyebrow")} title={t("auth.otp.title")}>
                    {tx("auth.emailVerify.sentTo", { email: ltrValue(email) })}
                  </StepHeading>

                  <form onSubmit={handleVerifyEmailCode} className="space-y-4">
                    <div>
                      <p id="emailCode-label" className={`${labelCls} text-center`}>{t("auth.otp.codeLabel")}</p>
                      <OtpInput
                        value={code}
                        onChange={setCode}
                        readOnly={loading}
                        hasError={!!error}
                        labelledBy="emailCode-label"
                        autoFocus
                      />
                    </div>
                    <ErrorMessage text={error} />
                    <SubmitButton loading={loading} idle={t("auth.emailVerify.submit")} busy={t("auth.login.checking")} />

                    <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                      <button type="button" onClick={goBack("emailPassword", () => setCode(""))} disabled={loading} className={linkBtn}>
                        {t("common.actions.back")}
                      </button>
                      <button type="button" onClick={handleResendEmailCode} disabled={cooldown > 0} className={resendBtn}>
                        {resendLabel}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
      </header>

      {/* ───────── بعد از فرم ───────── */}
      <main>
        {/* سه قدم (دسکتاپ: سه ستون کنار هم، زیر فرم) */}
        <StepsSectionMemo onStart={scrollToLogin} />

        {/* مورد اعتماد بیش از ۱۰۰۰ مشتری */}
        <div className="relative z-10 px-4 pb-2 pt-2">
          <TrustBadgeMemo />
        </div>

        <ChartShowcaseMemo />
        <ValueProposition />
      </main>

      <footer className="relative z-10 border-t border-[#DAD5C7] px-4 py-6 text-center text-xs text-[#5B645E]">
        {t("landing.footer", { year: String(new Date().getFullYear()) })}
      </footer>
    </div>
  );
};

export default LoginPage;
