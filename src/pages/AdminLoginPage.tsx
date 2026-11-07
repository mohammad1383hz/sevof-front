// src/pages/AdminLoginPage.tsx
import React, { useState } from "react";
import { authService } from "../services/api";
import { t } from "../i18n";

type Step = "admin" | "impersonate";

interface AdminLoginPageProps {
  onLogin: (token: string) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<Step>("admin");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [targetPhone, setTargetPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await authService.adminLogin({ phone: adminPhone, password: adminPassword });
    setLoading(false);

    if (!res.success) {
      setError(res.message || t("auth.admin.loginFailed"));
      return;
    }
    setStep("impersonate");
  };

  const handleImpersonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await authService.impersonate({ phone: targetPhone });
    setLoading(false);

    if (!res.success || !res.data?.token) {
      setError(res.message || t("auth.admin.impersonateFailed"));
      return;
    }
    onLogin(res.data.token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFEDE6] px-4">
      <div className="w-full max-w-sm bg-[#FBFAF6] rounded-2xl shadow-md border border-[#DAD5C7] p-6">
        {step === "admin" ? (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <h1 className="text-lg font-bold text-center">{t("auth.admin.title")}</h1>
            <input
              type="tel"
              placeholder={t("auth.admin.phonePlaceholder")}
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              dir="ltr"
              className="w-full rounded border border-[#DAD5C7] px-3 py-2.5 text-sm"
              autoFocus
            />
            <input
              type="password"
              placeholder={t("auth.email.passwordLabel")}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              dir="ltr"
              className="w-full rounded border border-[#DAD5C7] px-3 py-2.5 text-sm"
            />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-[#1B6F63] text-white py-2.5 text-sm font-bold disabled:opacity-60"
            >
              {loading ? t("auth.admin.signingIn") : t("auth.otp.submit")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleImpersonate} className="space-y-4">
            <h1 className="text-lg font-bold text-center">{t("auth.admin.impersonateTitle")}</h1>
            <input
              type="tel"
              placeholder="09123456789"
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
              dir="ltr"
              className="w-full rounded border border-[#DAD5C7] px-3 py-2.5 text-sm"
              autoFocus
            />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-[#1B6F63] text-white py-2.5 text-sm font-bold disabled:opacity-60"
            >
              {loading ? t("auth.admin.signingIn") : t("auth.admin.goToDashboard")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;