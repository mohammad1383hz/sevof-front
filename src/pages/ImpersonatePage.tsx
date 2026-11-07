import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { t } from "../i18n";

interface ImpersonatePageProps {
  onLogin: (token: string) => void;
}

const ImpersonatePage: React.FC<ImpersonatePageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    authService.exchangeImpersonate(code).then((res) => {
      if (res.success && res.data?.token) {
        onLogin(res.data.token);
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate, onLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-sm">{t("auth.admin.impersonating")}</p>
    </div>
  );
};

export default ImpersonatePage;