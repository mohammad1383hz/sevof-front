// src/pages/PaymentResultPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { t } from "../i18n";
import { subscriptionService } from "../services/api";

type PaymentStatus = "success" | "failed" | "unknown" | "checking";

/** Stripe may confirm a few seconds after the redirect; poll the backend this many times. */
const MAX_CONFIRM_TRIES = 6;

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Stripe returns ?session_id=… (success URL) or ?status=cancelled (cancel URL).
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<PaymentStatus>(() =>
    sessionId ? "checking" : searchParams.get("status") === "cancelled" ? "failed" : ((searchParams.get("status") as PaymentStatus) || "unknown"),
  );
  const [refId, setRefId] = useState<string | null>(searchParams.get("ref_id"));
  const [message, setMessage] = useState<string | null>(
    searchParams.get("status") === "cancelled" ? t("billing.payment.cancelled") : searchParams.get("message"),
  );

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    const confirm = async (attempt: number) => {
      const res = await subscriptionService.confirmStripe(sessionId);
      if (cancelled) return;
      const result = res.data?.status;

      if (result === "success") {
        setStatus("success");
        setRefId(res.data?.ref_id ?? null);
      } else if (result === "pending" || (!res.success && res.status !== 404)) {
        if (attempt < MAX_CONFIRM_TRIES) setTimeout(() => confirm(attempt + 1), 2500);
        else setStatus("unknown");
      } else {
        setStatus("failed");
        setMessage(res.data?.message ?? res.message ?? null);
      }
    };

    confirm(1);
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const isSuccess = status === "success";
  const isFailed = status === "failed";

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6 sm:py-12"
    >
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-6 sm:mb-8 flex items-center justify-center gap-2">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
            S
          </div>
          <span className="text-slate-800 font-semibold text-base sm:text-lg">
            Sevof
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
          {/* Status icon */}
          <div className="flex justify-center mb-4">
            {isSuccess && (
              <div className="h-14 w-14 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-teal-600"
                >
                  <path
                    d="M4 12.5L9.5 18L20 6"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            {isFailed && (
              <div className="h-14 w-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-rose-600"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
            {status === "checking" && (
              <div className="h-14 w-14 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin motion-reduce:animate-none" role="status" aria-label={t("billing.payment.checking")} />
            )}
            {status === "unknown" && (
              <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-semibold">
                ?
              </div>
            )}
          </div>

          {/* Heading + subtext */}
          {isSuccess && (
            <>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 text-center">
                {t("billing.payment.successTitle")}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 text-center">
                {t("billing.payment.successBody")}
              </p>
            </>
          )}

          {isFailed && (
            <>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 text-center">
                {t("billing.payment.failedTitle")}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 text-center">
                {t("billing.payment.failedBody")}
              </p>
            </>
          )}

          {status === "checking" && (
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6 text-center">
              {t("billing.payment.checking")}
            </h1>
          )}

          {status === "unknown" && (
            <>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 text-center">
                {t("billing.payment.unknownTitle")}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 text-center">
                {t("billing.payment.unknownBody")}
              </p>
            </>
          )}

          {/* Details */}
          {isSuccess && refId && (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 sm:px-3.5 py-2.5 mb-4">
              <span className="text-sm text-slate-500">{t("billing.payment.reference")}</span>
              <span dir="ltr" className="text-sm font-medium text-slate-800">
                {refId}
              </span>
            </div>
          )}

          {isFailed && message && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-4">
              {message}
            </p>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {isSuccess && (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-lg bg-teal-600 text-white text-sm font-medium py-2.5 min-h-[44px] hover:bg-teal-700 transition-colors"
              >
                {t("billing.payment.toDashboard")}
              </button>
            )}

            {isFailed && (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/subscription")}
                  className="w-full rounded-lg bg-teal-600 text-white text-sm font-medium py-2.5 min-h-[44px] hover:bg-teal-700 transition-colors"
                >
                  {t("billing.payment.tryAgain")}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full rounded-lg border border-slate-300 text-slate-600 text-sm font-medium py-2.5 min-h-[44px] hover:bg-slate-50 transition-colors"
                >
                  {t("billing.payment.backToDashboard")}
                </button>
              </>
            )}

            {status === "unknown" && (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-lg border border-slate-300 text-slate-600 text-sm font-medium py-2.5 min-h-[44px] hover:bg-slate-50 transition-colors"
              >
                {t("billing.payment.backToDashboard")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;