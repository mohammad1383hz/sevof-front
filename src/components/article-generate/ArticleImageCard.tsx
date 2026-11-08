import { env } from "../../env";
// src/components/article-generate/ArticleImageCard.tsx
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { articleService } from "../../services/api";
import { Spinner } from "./UiBits";
import { ImageEditPanel } from "./ImageEditPanel";
import { t } from "../../i18n";

const UPLOADS_URL = env("VITE_UPLOADS_URL") ?? "";

/** حداقل فیلدهایی که کارت لازم دارد؛ هم Article و هم ProductArticle با آن سازگارند. */
export interface ImageCardArticle {
  id: number | string; // ← قبلاً number بود
  title: string;
  image_status?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  image_error?: string | null;
  image_prompt?: string | null;
}

interface ArticleImageCardProps<T extends ImageCardArticle> {
  siteId: number | string;
  article: T;
  isFreePlan: boolean;
  /** مقاله‌ی عادی: پاسخ سرور (مقاله‌ی آپدیت‌شده) را می‌گیرد. */
  onArticleChange?: (updated: T) => void;
  /** اگر داده شود به‌جای articleService صدا زده می‌شود (مثلاً برای مقاله‌ی محصول). */
  onRegenerate?: (prompt: string, model: string) => Promise<any>;
}

export function ArticleImageCard<T extends ImageCardArticle>({
  siteId,
  article,
  onArticleChange,
  onRegenerate,
  isFreePlan,
}: ArticleImageCardProps<T>) {
  const navigate = useNavigate();
  const isProUser = !isFreePlan;
  const status = article.image_status ?? "pending";

  const [isOpen, setIsOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);

  if (!article.image_status) return null;

  const imageUrl = article.image_url
    ? article.image_url.startsWith("http")
      ? article.image_url
      : `${UPLOADS_URL}/${article.image_url.replace(/^\/+/, "")}`
    : undefined;

  const handleToggle = () => {
    setRegenerateError(null);
    setIsOpen((v) => !v);
  };

  const handleSubmit = async (prompt: string, model: string) => {
    setIsRegenerating(true);
    setRegenerateError(null);
    try {
      const res = onRegenerate
        ? await onRegenerate(prompt, model)
        : await articleService.regenerateImage(siteId, article.id, { prompt, model });

      if ((res as any)?.success === false) {
        throw new Error((res as any).message || t("article.errors.request"));
      }
      const data = (res as any)?.data?.article ?? (res as any)?.data ?? (res as any)?.article;
      if (data && onArticleChange) onArticleChange(data);
      setIsOpen(false);
    } catch (err: any) {
      setRegenerateError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.prompt?.[0] ||
          err?.message ||
          t("common.errors.generic")
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const toggleButtonLabel = isRegenerating
    ? t("article.image.generatingShort")
    : isOpen
    ? t("article.image.closeEditor")
    : status === "failed"
    ? t("article.image.retryPrompt")
    : `✏️ ${t("article.image.editPrompt")}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900">🖼️ {t("article.image.featured")}</h3>
        {(status === "pending" || status === "generating") && <Spinner />}
      </div>

      {status === "generated" && imageUrl ? (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt={article.image_alt ?? article.title}
              className="w-auto h-auto max-w-full max-h-[420px] object-contain"
              loading="lazy"
            />
          </div>
          {article.image_alt && (
            <div className="px-4 py-2.5 bg-slate-50 text-[11px] text-slate-500 leading-5">
              {article.image_alt}
            </div>
          )}
        </div>
      ) : status === "failed" ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-bold text-rose-600 mb-1">{t("article.image.failed")}</p>
          <p className="text-[11px] text-rose-500 leading-6">
            {article.image_error ?? t("common.errors.generic")}
          </p>
          <p className="text-[11px] text-rose-400 mt-1">
            {t("article.image.noBlock")}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
          <Spinner />
          <p className="text-xs text-slate-400">{t("article.image.creating")}</p>
        </div>
      )}

      <p className="mt-3 flex items-center gap-1 text-[11px] font-bold text-rose-600">
        <span>⭐</span>
        {t("article.image.tip")}
      </p>

      {(status === "generated" || status === "failed") && (
        <div className="mt-3">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isRegenerating}
            className={`w-full rounded-xl border py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 ${
              status === "failed"
                ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {isRegenerating && <Spinner />}
            {toggleButtonLabel}
            {!isRegenerating && (
              <span className={`transition-transform text-[10px] ${isOpen ? "rotate-180" : ""}`}>▾</span>
            )}
          </button>

          {isOpen && (
            <ImageEditPanel
              initialPrompt={article.image_prompt ?? ""}
              isProUser={isProUser}
              isSubmitting={isRegenerating}
              error={regenerateError}
              onCancel={() => setIsOpen(false)}
              onSubmit={handleSubmit}
              onNavigateToSubscription={() => navigate("/subscription")}
            />
          )}
        </div>
      )}
    </div>
  );
}