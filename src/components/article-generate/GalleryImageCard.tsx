import { env } from "../../env";
// src/components/article-generate/GalleryImageCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { articleService } from "../../services/api";
import type { Article } from "../../types";
import { Spinner } from "./UiBits";
import { ImageEditPanel } from "./ImageEditPanel";
import { t } from "../../i18n";

const UPLOADS_URL = env("VITE_UPLOADS_URL") ?? "";

export interface SectionGalleryImage {
  url: string;
  alt?: string | null;
  order?: number;
  after_section?: number;
  gallery_index: number;
  status?: "generated" | "generating" | "failed";
  error?: string | null;
  prompt?: string;
}

const resolveImageUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${UPLOADS_URL}/${url.replace(/^\/+/, "")}`;
};

interface GalleryImageCardProps {
  siteId: number | string;
  article: Article;
  image: SectionGalleryImage;
  onArticleChange: (updated: Article) => void;
  canEditOrRegenerate: boolean;
  isProUser: boolean;
}

export const GalleryImageCard: React.FC<GalleryImageCardProps> = ({
  siteId,
  article,
  image,
  onArticleChange,
  canEditOrRegenerate,
  isProUser,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);

  const src = resolveImageUrl(image.url);
  const isGenerating = image.status === "generating";
  const isFailed = image.status === "failed";

  const handleSubmit = async (prompt: string, model: string) => {
    setIsRegenerating(true);
    setRegenerateError(null);
    try {
      const res = await articleService.regenerateGalleryImage(siteId, article.id, {
        index: image.gallery_index,
        prompt,
        model,
      });
      if ((res as any)?.success === false) {
        throw new Error((res as any).message || t("article.errors.request"));
      }
      const data = (res as any)?.data?.article ?? (res as any)?.data ?? (res as any)?.article;
      if (data) onArticleChange(data);
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

  if (!src && !isFailed) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[#DAD5C7] bg-[#F4F2EC]">
      {isFailed ? (
        <div className="p-4">
          <p className="text-xs font-bold text-rose-600 mb-1">{t("article.image.failed")}</p>
          <p className="text-[11px] text-rose-500 leading-6">{image.error ?? t("common.errors.generic")}</p>
        </div>
      ) : (
        <div className="relative">
          {src && (
            <img
              src={src}
              alt={image.alt ?? ""}
              className={`w-full max-h-[380px] object-contain ${isGenerating ? "opacity-40" : ""}`}
              loading="lazy"
            />
          )}
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/40">
              <Spinner />
              <span className="text-[11px] font-bold text-[#1E2A28]">{t("article.image.generating")}</span>
            </div>
          )}
        </div>
      )}

      {image.alt && !isFailed && (
        <div className="px-3 py-2 bg-[#F4F2EC] text-[10px] sm:text-[11px] text-[#9BA69F] leading-5">
          {image.alt}
        </div>
      )}

      {canEditOrRegenerate && !isGenerating && (
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={() => {
              setRegenerateError(null);
              setIsOpen((v) => !v);
            }}
            disabled={isRegenerating}
            className={`w-full rounded-xl border py-2 text-[10px] sm:text-[11px] font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 ${
              isFailed
                ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                : "border-[#DAD5C7] bg-white text-[#000000] hover:border-[#1B6F63]/40 hover:text-[#1B6F63]"
            }`}
          >
            {isOpen ? t("article.image.closeEditor") : isFailed ? t("article.image.retryPrompt") : `✏️ ${t("article.image.editPrompt")}`}
            {!isRegenerating && (
              <span className={`transition-transform text-[10px] ${isOpen ? "rotate-180" : ""}`}>▾</span>
            )}
          </button>

          {isOpen && (
            <ImageEditPanel
              initialPrompt={image.prompt ?? ""}
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
};