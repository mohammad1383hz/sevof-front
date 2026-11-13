// src/components/product-article/ProductModelSelectModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHAT_MODELS, DEFAULT_MODEL_ID, PRO_MODEL_ID } from "../article-generate/chatModels";
import { IMAGE_MODELS, DEFAULT_IMAGE_MODEL_ID } from "../article-generate/imageModels";
import { getLocale, t } from "../../i18n";

/** دیفالت‌های اختصاصی برای کاربر Pro (غیررایگان) */
const PRO_DEFAULT_IMAGE_MODEL_ID = "gpt-image-2";

/** سبک‌های قابل انتخاب برای تصویر شاخص محصول */
const IMAGE_STYLES = [
  { id: "minimal", get label() { return t("article.styles.minimal"); } },
  { id: "infographic", get label() { return t("article.styles.infographic"); } },
  { id: "conceptual", get label() { return t("article.styles.conceptual"); } },
  { id: "realistic", get label() { return t("article.styles.realistic"); } },
  { id: "product", get label() { return t("article.styles.product"); } },
] as const;

const DEFAULT_IMAGE_STYLE_ID: string = IMAGE_STYLES[0].id;
/** سقف طول prompt اختیاریِ تصویر شاخص (باید با بک‌اند یکی باشد) */
const IMAGE_USER_PROMPT_MAX = 500;
/** سقف طول prompt اختیاریِ متن مقاله (باید با بک‌اند یکی باشد — max:2000) */
const ARTICLE_USER_PROMPT_MAX = 2000;

/**
 * سبک «اینفوگرافی» فقط وقتی مجازه که یکی از این مدل‌های تصویر انتخاب شده باشه.
 * ⚠️ آیدی‌ها را با imageModels.ts چک کن.
 */
const INFOGRAPHIC_ALLOWED_MODELS = ["gpt-image-2", "nano-banana", "nano-banana-2"];

/**
 * هزینه‌ی تصویر شاخص به کردیت.
 * ⚠️ آیدی‌ها باید دقیقاً با imageModels.ts یکی باشند، وگرنه بَج نمایش داده نمی‌شود.
 */
const IMAGE_CREDIT_COST: Record<string, number> = {
  "gpt-image-2": 10,
  "nano-banana-2": 10,
  flux: 10,
};

const formatFa = (n: number) => n.toLocaleString(getLocale());

// ============================================================================
// کامپوننت‌های کوچک کمکی (فقط برای این فایل)
// ============================================================================

const SectionHeading: React.FC<{ step: string; title: string }> = ({ step, title }) => (
  <div className="flex items-start gap-3 mb-3.5">
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5B47FB] text-[11px] font-black text-white">
      {step}
    </span>
    <div>
      <h3 className="text-sm font-black text-[#0D0F23] leading-6">{title}</h3>
    </div>
  </div>
);

/** بَج قیمت داخل کارت مدل تصویر (نسخه‌ی دسکتاپ) */
const CreditBadge: React.FC<{ cost?: number; selected?: boolean }> = ({ cost, selected }) => {
  if (cost === undefined) return null;
  return (
    <div
      className={`mt-2 pt-2 border-t border-dashed flex items-center justify-between gap-1 ${
        selected ? "border-[#5B47FB]/30" : "border-[#E4E5F0]"
      }`}
    >
      <span className="text-[10px] text-[#0D0F23]">{t("article.image.featured")}</span>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
          selected ? "bg-[#5B47FB] text-white" : "bg-[#EDE3CF] text-[#0D0F23]"
        }`}
      >
        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 010 3.5h-2.5a1.75 1.75 0 000 3.5H14.5" />
        </svg>
        {formatFa(cost)}
      </span>
    </div>
  );
};

const SelectedCheck: React.FC = () => (
  <span className="absolute top-2 end-2 h-4 w-4 rounded-full bg-[#5B47FB] flex items-center justify-center">
    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  </span>
);

const LockBadge: React.FC<{ label?: string }> = ({ label = t("layout.plan.pro") }) => (
  <span className="absolute top-2 end-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#0D0F23] bg-[#EDE3CF] rounded-full px-2 py-0.5">
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
    {label}
  </span>
);



const MobileModelSelect: React.FC<{
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: { id: string; label: string; locked?: boolean }[];
  /** اگر داده شود، گزینه‌ی قفل غیرفعال نیست و انتخابش این را صدا می‌زند (مثلاً رفتن به صفحه‌ی اشتراک) */
  onLockedPick?: () => void;
}> = ({ label, value, onChange, options, onLockedPick }) => (
  <div>
    <label className="block text-[11px] font-bold text-[#0D0F23] mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => {
        const picked = options.find((o) => o.id === e.target.value);
        if (picked?.locked && onLockedPick) onLockedPick();
        else onChange(e.target.value);
      }}
      className="w-full rounded-xl border border-[#E4E5F0] bg-[#FAFAFE] px-2.5 py-2 text-xs font-bold text-[#0D0F23] focus:outline-none focus:border-[#5B47FB] focus:ring-2 focus:ring-[#5B47FB]/15 transition-all"
    >
      {options.map((o) => (
        <option key={o.id} value={o.id} disabled={o.locked && !onLockedPick}>
          {o.label}
          {o.locked ? " 🔒" : ""}
        </option>
      ))}
    </select>
  </div>
);

/** نوار کوچک زیر سلکت مدل تصویر (موبایل): لوگو + کردیت مدل انتخاب‌شده */
const ImageModelPreview: React.FC<{ icon?: string; label: string; cost?: number }> = ({ icon, label, cost }) => (
  <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-[#EDE3CF]/60 px-2 py-1">
    {icon ? (
      <img src={icon} alt="" className="h-4 w-4 shrink-0 rounded object-contain" />
    ) : (
      <span className="h-4 w-4 shrink-0 rounded-full bg-[#5B47FB]/15" />
    )}
    <span className="text-[10px] font-bold text-[#0D0F23] truncate">{label}</span>
    {cost !== undefined && (
      <span className="ms-auto shrink-0 inline-flex items-center gap-0.5 rounded-full bg-[#5B47FB] px-1.5 py-0.5 text-[9px] font-black text-white">
        {formatFa(cost)} credits
      </span>
    )}
  </div>
);

// ============================================================================
// کامپوننت اصلی
// ============================================================================

interface ProductModelSelectModalProps {
  open: boolean;
  isFreePlan: boolean;
  onClose: () => void;
  /**
   * ترتیب پارامترها با ModelSelectModal یکی است.
   * imageCount در مقاله‌ی محصول همیشه ۱ است (فقط تصویر شاخص).
   */
  onConfirm: (
    modelId: string,
    imageModelId: string,
    imageCount: number,
    imageStyle: string,
    imageUserPrompt: string,
    articleUserPrompt: string,
  ) => void;
}

const ProductModelSelectModal: React.FC<ProductModelSelectModalProps> = ({
  open,
  isFreePlan,
  onClose,
  onConfirm,
}) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(DEFAULT_MODEL_ID);
  const [selectedImageModel, setSelectedImageModel] = useState<string>(DEFAULT_IMAGE_MODEL_ID);
  const [imageStyle, setImageStyle] = useState<string>(DEFAULT_IMAGE_STYLE_ID);
  const [imageUserPrompt, setImageUserPrompt] = useState<string>("");

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [articleUserPrompt, setArticleUserPrompt] = useState<string>("");

  const isFreePlanRef = useRef(isFreePlan);
  useEffect(() => {
    isFreePlanRef.current = isFreePlan;
  }, [isFreePlan]);

  useEffect(() => {
    if (open) {
      const free = isFreePlanRef.current;
      setSelected(free ? DEFAULT_MODEL_ID : PRO_MODEL_ID);
      setSelectedImageModel(free ? DEFAULT_IMAGE_MODEL_ID : PRO_DEFAULT_IMAGE_MODEL_ID);
      setImageStyle(DEFAULT_IMAGE_STYLE_ID);
      setImageUserPrompt("");
      setArticleUserPrompt("");
      setAdvancedOpen(false);
    }
  }, [open]);

  // اگر مدل تصویر عوض شد و اینفوگرافی دیگر مجاز نبود، به سبک پیش‌فرض برگرد
  useEffect(() => {
    const infographicAllowed = INFOGRAPHIC_ALLOWED_MODELS.includes(selectedImageModel);
    if (imageStyle === "infographic" && !infographicAllowed) {
      setImageStyle(DEFAULT_IMAGE_STYLE_ID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageModel]);

  if (!open) return null;

  const chatModelOptions = CHAT_MODELS.map((m) => ({
    id: m.id,
    label: m.label,
    locked: !!m.proOnly && isFreePlan,
  }));
  const imageModelOptions = IMAGE_MODELS.map((m) => ({
    id: m.id,
    label: m.label,
    locked: !!m.isPro && isFreePlan && m.id !== "flux",
  }));
  const selectedImageModelData = IMAGE_MODELS.find((m) => m.id === selectedImageModel);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-[#FAFAFE] border border-[#E4E5F0] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= هدر ثابت ================= */}
        <div className="shrink-0 flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-[#E4E5F0]">
          <div>
            <h2 className="text-base font-black text-[#0D0F23]">{t("product.modal.title")}</h2>
            <p className="text-[11px] text-[#0D0F23] mt-1 leading-5">
              {t("article.modal.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[#0D0F23] hover:bg-black/5 transition-colors"
            aria-label={t("common.actions.close")}
          >
            ✕
          </button>
        </div>

        {/* ================= بدنه‌ی قابل اسکرول ================= */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-3">
          {/* موبایل: مدل مقاله + مدل تصویر در یک ردیف */}
          <div className="grid grid-cols-2 gap-2 sm:hidden pt-4">
            <MobileModelSelect
              label={t("article.modal.writingModel")}
              value={selected}
              onChange={setSelected}
              options={chatModelOptions}
              onLockedPick={() => navigate("/subscription")}
            />
            <div>
              <MobileModelSelect
                label={t("product.modal.imageModel")}
                value={selectedImageModel}
                onChange={setSelectedImageModel}
                options={imageModelOptions}
              />
              <ImageModelPreview
                icon={selectedImageModelData?.icon}
                label={selectedImageModelData?.label ?? ""}
                cost={IMAGE_CREDIT_COST[selectedImageModel]}
              />
            </div>
          </div>

          {/* ── ۱. مدل نگارش مقاله (دسکتاپ) ── */}
          <section className="hidden sm:block pt-4">
            <SectionHeading step="1" title={t("article.modal.writingModel")} />
            <div className="grid grid-cols-2 gap-2">
              {CHAT_MODELS.map((m) => {
                const locked = !!m.proOnly && isFreePlan;
                const isSelected = selected === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => (locked ? navigate("/subscription") : setSelected(m.id))}
                    title={m.description}
                    className={`relative text-start rounded-xl border px-3 py-2 transition-all duration-200 ${
                      locked
                        ? "border-[#E4E5F0] bg-[#F3F2FB]/60 hover:border-[#E9C46A]"
                        : isSelected
                        ? "border-[#5B47FB] bg-[#EFEDFF] shadow-sm shadow-[#5B47FB]/15"
                        : "border-[#E4E5F0] bg-[#FAFAFE] hover:border-[#5B47FB]/40 hover:bg-[#EFEDFF]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-black text-[#0D0F23] truncate">{m.label}</p>
                      {locked && <LockBadge label={t("layout.plan.pro")} />}
                      {!locked && isSelected && (
                        <span className="shrink-0 h-4 w-4 rounded-full bg-[#5B47FB] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                      )}
                    </div>
                    {m.description && (
                      <p className="text-[10px] text-[#0D0F23] leading-4 mt-0.5 truncate">{m.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-px bg-[#E4E5F0]" />

          {/* ── ۲. تصویر شاخص ── */}
          <section>
            <div className="hidden sm:block">
              <SectionHeading step="2" title={t("product.modal.featuredImage")} />
            </div>

            {/* دسکتاپ: کارت‌های کامل مدل تصویر */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-2 mb-3">
              {IMAGE_MODELS.map((m) => {
                const locked = !!m.isPro && isFreePlan && m.id !== "flux";
                const isSelected = selectedImageModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={locked}
                    onClick={() => setSelectedImageModel(m.id)}
                    className={`relative text-start rounded-2xl border p-2 transition-all duration-200 ${
                      locked
                        ? "border-[#E4E5F0] bg-[#F3F2FB]/60 opacity-60 cursor-not-allowed"
                        : isSelected
                        ? "border-[#5B47FB] bg-[#EFEDFF] shadow-md shadow-[#5B47FB]/15"
                        : "border-[#E4E5F0] bg-[#FAFAFE] hover:border-[#5B47FB]/40 hover:bg-[#EFEDFF]/40"
                    }`}
                  >
                    {locked && <LockBadge label={m.badge ?? t("layout.plan.pro")} />}
                    {!locked && isSelected && <SelectedCheck />}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {m.icon && <img src={m.icon} alt="" className="h-3.5 w-3.5 shrink-0 rounded object-contain" />}
                      <p className="text-xs font-black text-[#0D0F23]">{m.label}</p>
                    </div>
                    {m.description && (
                      <p className="text-[10px] text-[#0D0F23] leading-3.5 line-clamp-1">{m.description}</p>
                    )}
                    <CreditBadge cost={IMAGE_CREDIT_COST[m.id]} selected={!locked && isSelected} />
                  </button>
                );
              })}
            </div>

            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mb-4">
              <span>⭐</span> {t("article.modal.qualityTip")}
            </p>
          </section>

          {/* ── ۳. تنظیمات پیشرفته: سبک تصویر + پرامپت متن + پرامپت تصویر ── */}
          <section className="rounded-2xl border border-[#E4E5F0] bg-white/60 mb-4">
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3.5"
            >
              <div className="flex items-start gap-3 text-start">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5B47FB] text-[11px] font-black text-white">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#0D0F23]">{t("article.modal.advanced")}</h3>
                  <p className="text-[11px] text-[#0D0F23] mt-0.5">{t("article.modal.advancedHint")}</p>
                </div>
              </div>
              <svg
                className={`h-4 w-4 shrink-0 text-[#0D0F23] transition-transform duration-150 ${advancedOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {advancedOpen && (
              <div className="px-4 pb-4 space-y-4">
               
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <label className="text-xs font-bold text-[#0D0F23]">{t("dashboard.settings.articlePrompt")}</label>
                      <span className="text-[10px] text-[#0D0F23] shrink-0">
                        {formatFa(articleUserPrompt.length)}/{formatFa(ARTICLE_USER_PROMPT_MAX)}
                      </span>
                    </div>
                    <textarea
                      value={articleUserPrompt}
                      onChange={(e) => setArticleUserPrompt(e.target.value.slice(0, ARTICLE_USER_PROMPT_MAX))}
                      maxLength={ARTICLE_USER_PROMPT_MAX}
                      rows={4}
                      placeholder={t("product.modal.articlePromptPlaceholder")}
                      className="w-full resize-none rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE] px-3.5 py-2.5 text-xs leading-6 text-[#0D0F23] placeholder:text-[#0D0F23]/35 focus:outline-none focus:border-[#5B47FB] focus:ring-2 focus:ring-[#5B47FB]/15 transition-all"
                    />
                    <p className="text-[10px] text-[#0D0F23] mt-1.5">{t("dashboard.settings.articlePromptHint")}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <label className="text-xs font-bold text-[#0D0F23]">{t("dashboard.settings.imagePrompt")}</label>
                      <span className="text-[10px] text-[#0D0F23] shrink-0">
                        {formatFa(imageUserPrompt.length)}/{formatFa(IMAGE_USER_PROMPT_MAX)}
                      </span>
                    </div>
                    <textarea
                      value={imageUserPrompt}
                      onChange={(e) => setImageUserPrompt(e.target.value.slice(0, IMAGE_USER_PROMPT_MAX))}
                      maxLength={IMAGE_USER_PROMPT_MAX}
                      rows={4}
                      placeholder={t("product.modal.imagePromptPlaceholder")}
                      className="w-full resize-none rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE] px-3.5 py-2.5 text-xs leading-6 text-[#0D0F23] placeholder:text-[#0D0F23]/35 focus:outline-none focus:border-[#5B47FB] focus:ring-2 focus:ring-[#5B47FB]/15 transition-all"
                    />
                    <p className="text-[10px] text-[#0D0F23] mt-1.5">{t("article.modal.imagePromptHint")}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ================= فوتر ثابت ================= */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[#E4E5F0] bg-[#FAFAFE]">
          <button type="button" onClick={onClose} className="text-xs font-bold text-[#0D0F23] px-3 py-2.5 hover:opacity-70">
            {t("common.actions.cancel")}
          </button>
          <button
            type="button"
            onClick={() =>
              onConfirm(
                selected,
                selectedImageModel,
                1, // مقاله‌ی محصول: فقط یک تصویر شاخص
                imageStyle,
                imageUserPrompt.trim(),
                articleUserPrompt.trim(),
              )
            }
            className="rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#4935E0] text-white text-sm font-bold px-6 py-2.5 hover:from-[#6C5BFF] hover:to-[#5B47FB] transition-all shadow-lg shadow-[#5B47FB]/25"
          >
            {t("dashboard.opportunities.generate")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModelSelectModal;