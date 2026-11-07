// src/components/article-generate/ImageEditPanel.tsx
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "./UiBits";
import { t, getLocale } from "../../i18n";

export interface ImageModelOption {
  id: string;
  label: string;
  isPro: boolean;
  badge?: string;
  icon: string;
}

export const IMAGE_MODELS: ImageModelOption[] = [
  { id: "flux", label: "Flux", isPro: true, badge: "Pro", icon: "/logo/flux_dark.webp" },
  { id: "nano-banana-2", label: "Nano Banana 2", isPro: true, badge: "Pro", icon: "/logo/nan-banana.png" },
  { id: "gpt-image-2", label: "GPT Image 2", isPro: true, badge: "Pro", icon: "/logo/gpt.png" },
  // { id: "midjourney", label: "Midjourney", isPro: true, badge: "Pro", icon: "/logo/midjurney.webp" },
];

/**
 * هزینه‌ی هر تصویر به کردیت، برای هر مدل.
 * ⚠️ باید با IMAGE_CREDIT_COST توی ModelSelectModal.tsx همگام نگه داشته بشه؛
 * چون فعلاً دو تا منبع جدا از هم‌ان (duplicate)، هر تغییر قیمتی رو باید توی هر دو فایل اعمال کنی.
 */
const IMAGE_CREDIT_COST: Record<string, number> = {
  "gpt-image-2": 10,
  "nano-banana-2": 10,
  flux: 10,
};

const formatFa = (n: number) => n.toLocaleString(getLocale());

interface ImageEditPanelProps {
  initialPrompt: string;
  isProUser: boolean;
  isSubmitting: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (prompt: string, model: string) => void;
  onNavigateToSubscription: () => void;
  placeholder?: string;
  introText?: string;
}

export const ImageEditPanel: React.FC<ImageEditPanelProps> = ({
  initialPrompt,
  isProUser,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
  onNavigateToSubscription,
  placeholder = t("article.image.promptPlaceholder"),
  introText,
}) => {
  const [promptDraft, setPromptDraft] = useState(initialPrompt);
  const [selectedModel, setSelectedModel] = useState<string>("flux");
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [lockedModelMessage, setLockedModelMessage] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const modelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isProUser) {
      const current = IMAGE_MODELS.find((m) => m.id === selectedModel);
      if (current?.isPro) setSelectedModel("flux");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProUser]);

  useEffect(() => {
    if (!isModelMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModelMenuOpen]);

  const isModelEnabled = (model: ImageModelOption) => !model.isPro || isProUser;

  const handleSelectModel = (model: ImageModelOption) => {
    if (!isModelEnabled(model)) {
      setLockedModelMessage(t("article.image.modelLocked", { model: model.label }));
      setIsModelMenuOpen(false);
      setTimeout(onNavigateToSubscription, 900);
      return;
    }
    setSelectedModel(model.id);
    setLockedModelMessage(null);
    setIsModelMenuOpen(false);
  };

  const handleSubmit = () => {
    if (!isProUser) {
      setLockedModelMessage(t("article.image.editLocked"));
      setTimeout(onNavigateToSubscription, 900);
      return;
    }

    const trimmed = promptDraft.trim();
    if (trimmed.length < 3) {
      setLocalError(t("article.image.promptShort"));
      return;
    }

    setLocalError(null);
    onSubmit(trimmed, selectedModel);
  };

  const selectedModelOption = IMAGE_MODELS.find((m) => m.id === selectedModel);
  const selectedModelLabel = selectedModelOption?.label ?? "Flux";
  const selectedModelCost = selectedModelOption ? IMAGE_CREDIT_COST[selectedModelOption.id] : undefined;

  const renderModelIcon = (model: ImageModelOption, opts?: { dim?: boolean }) => {
    if (imgFailed[model.id]) {
      return (
        <span className="h-4 w-4 rounded-sm bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
          {model.label[0]}
        </span>
      );
    }
    return (
      <img
        src={model.icon}
        alt=""
        className={`h-4 w-4 rounded-sm object-contain ${opts?.dim ? "grayscale opacity-60" : ""}`}
        onError={() => setImgFailed((prev) => ({ ...prev, [model.id]: true }))}
      />
    );
  };

  /** بج کوچیک نمایش کردیت هر مدل، هم توی دکمه‌ی بسته و هم توی لیست استفاده می‌شه */
  const renderCreditBadge = (cost: number | undefined, opts?: { dim?: boolean }) => {
    if (cost === undefined) return null;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
          opts?.dim ? "text-slate-400 bg-slate-100" : "text-slate-500 bg-slate-100"
        }`}
      >
        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 010 3.5h-2.5a1.75 1.75 0 000 3.5H14.5"
          />
        </svg>
        {formatFa(cost)} credits
      </span>
    );
  };

  return (
    <div className="mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
        <span className="text-sm">🤖</span>
        <p className="text-[11px] font-bold text-slate-600">
          {t("article.image.assistant")}
        </p>
      </div>

      <div className="p-4 space-y-3 max-h-[340px] overflow-y-auto">
        {!isProUser && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 flex items-start gap-2">
            <span className="text-xs">🔒</span>
            <p className="text-[11px] text-amber-700 leading-6">
              {t("article.image.proOnly")}
            </p>
          </div>
        )}

        <div className="relative" ref={modelMenuRef}>
          <p className="text-[10px] font-bold text-slate-400 mb-1.5">{t("dashboard.settings.imageModel")}</p>
          <button
            type="button"
            onClick={() => setIsModelMenuOpen((v) => !v)}
            disabled={isSubmitting}
            className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <span className="flex items-center gap-2">
              {selectedModelOption && renderModelIcon(selectedModelOption)}
              {selectedModelLabel}
              {renderCreditBadge(selectedModelCost)}
            </span>
            <span className={`text-[10px] transition-transform ${isModelMenuOpen ? "rotate-180" : ""}`}>▾</span>
          </button>

          {isModelMenuOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              {IMAGE_MODELS.map((model) => {
                const enabled = isModelEnabled(model);
                const cost = IMAGE_CREDIT_COST[model.id];
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleSelectModel(model)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-start transition ${
                      enabled ? "text-slate-700 hover:bg-slate-50" : "text-slate-400 hover:bg-slate-50"
                    } ${selectedModel === model.id ? "bg-slate-50 font-bold" : ""}`}
                  >
                    <span className="flex items-center gap-1.5">
                      {!enabled && <span className="text-[10px]">🔒</span>}
                      {renderModelIcon(model, { dim: !enabled })}
                      {model.label}
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      {renderCreditBadge(cost, { dim: !enabled })}
                      {model.isPro && enabled && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          {model.badge}
                        </span>
                      )}
                      {model.isPro && !enabled && (
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          {model.badge}
                        </span>
                      )}
                      {enabled && selectedModel === model.id && (
                        <span className="text-[10px] text-emerald-500">✓</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {lockedModelMessage && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 flex items-start gap-2">
            <span className="text-xs">🔒</span>
            <p className="text-[11px] text-amber-700 leading-6">{lockedModelMessage}</p>
          </div>
        )}

        <div className="flex gap-2 items-start">
          <div className="shrink-0 h-6 w-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center">
            AI
          </div>
          <div className="rounded-2xl rounded-se-sm bg-slate-100 px-3 py-2 text-[11px] text-slate-600 leading-6">
            {introText ??
              (initialPrompt
                ? t("article.image.introExisting")
                : t("article.image.introNew"))}
          </div>
        </div>

        <textarea
          value={promptDraft}
          onChange={(e) => setPromptDraft(e.target.value)}
          rows={4}
          disabled={isSubmitting}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 leading-6 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
        />

        {(localError || error) && <p className="text-[11px] text-rose-500">{localError || error}</p>}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-slate-200 py-2 text-[11px] font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50"
        >
          {t("common.actions.cancel")}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-[2] rounded-xl bg-slate-900 py-2 text-[11px] font-bold text-white hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting && <Spinner />}
          {isSubmitting ? t("article.image.generatingShort") : isProUser ? `${t("article.image.submit")} ✨` : `🔒 ${t("article.image.proOnlyShort")}`}
        </button>
      </div>
    </div>
  );
};