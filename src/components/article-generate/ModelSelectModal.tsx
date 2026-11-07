// src/components/article-generate/ModelSelectModal.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHAT_MODELS, DEFAULT_MODEL_ID, PRO_MODEL_ID } from "./chatModels";
import { IMAGE_MODELS, DEFAULT_IMAGE_MODEL_ID, DEFAULT_IMAGE_COUNT, MAX_IMAGE_COUNT } from "./imageModels";
import { t, formatNumber } from "../../i18n";

/** دیفالت‌های اختصاصی برای کاربر Pro (غیررایگان) */
const PRO_DEFAULT_IMAGE_MODEL_ID = "gpt-image-2";

/** سبک‌های قابل انتخاب برای تولید تصویر */
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
 * ⚠️ آیدی دقیق «Nano Banana» رو با imageModels.ts چک کن — اگه فرق داره همین‌جا اصلاحش کن.
 */
const INFOGRAPHIC_ALLOWED_MODELS = ["gpt-image-2", "nano-banana"];

/**
 * هزینه‌ی هر تصویر به کردیت.
 * ⚠️ آیدی‌ها باید دقیقاً با imageModels.ts یکی باشند، وگرنه بَج نمایش داده نمی‌شود.
 */
const IMAGE_CREDIT_COST: Record<string, number> = {
  "gpt-image-2": 10,
  "nano-banana-2": 10,
  flux: 10,
};

// ---------- بخش‌بندی مقاله: سه گزینه‌ی ثابتِ بازه‌ای ----------
const SECTION_RANGES = [
  { id: "low", get label() { return t("dashboard.settings.sections.short"); }, min: 6, max: 8 },
  { id: "mid", get label() { return t("dashboard.settings.sections.medium"); }, min: 8, max: 10 },
  { id: "high", get label() { return t("dashboard.settings.sections.long"); }, min: 10, max: 12 },
] as const;
const DEFAULT_SECTION_RANGE_ID: string = SECTION_RANGES[0].id;

const formatFa = (n: number) => formatNumber(n);

// ============================================================================
// کامپوننت‌های کوچک کمکی (فقط برای این فایل)
// ============================================================================

/** عنوان یک بخش، با شماره‌ی مرحله برای جهت‌دهی بصری در یک فرم چندمرحله‌ای واقعی */
const SectionHeading: React.FC<{ step: string; title: string; desc?: string }> = ({ step, title }) => (
  <div className="flex items-start gap-3 mb-3.5">
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B6F63] text-[11px] font-black text-white">
      {step}
    </span>
    <div>
      <h3 className="text-sm font-black text-[#000000] leading-6">{title}</h3>
    </div>
  </div>
);

/** بَج قیمت داخل کارت مدل تصویر (نسخه‌ی دسکتاپ) */
const CreditBadge: React.FC<{ cost?: number; selected?: boolean }> = ({ cost, selected }) => {
  if (cost === undefined) return null;
  return (
    <div
      className={`mt-2 pt-2 border-t border-dashed flex items-center justify-between gap-1 ${
        selected ? "border-[#1B6F63]/30" : "border-[#DAD5C7]"
      }`}
    >
      <span className="text-[10px] text-[#000000]">{t("dashboard.settings.perImage")}</span>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
          selected ? "bg-[#1B6F63] text-white" : "bg-[#EDE3CF] text-[#000000]"
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

/** تیک کوچک برای گزینه‌ی انتخاب‌شده — یک بار تعریف، همه‌جا استفاده می‌شود */
const SelectedCheck: React.FC = () => (
  <span className="absolute top-2 end-2 h-4 w-4 rounded-full bg-[#1B6F63] flex items-center justify-center">
    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  </span>
);

const LockBadge: React.FC<{ label?: string }> = ({ label = t("layout.plan.pro") }) => (
  <span className="absolute top-2 end-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#000000] bg-[#EDE3CF] rounded-full px-2 py-0.5">
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
    {label}
  </span>
);

/** کنترل عددیِ +/- — فقط برای تعداد تصویر استفاده می‌شود */
const Stepper: React.FC<{
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (n: number) => void;
}> = ({ value, min, max, disabled, onChange }) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      disabled={disabled || value <= min}
      onClick={() => onChange(Math.max(min, value - 1))}
      className="h-8 w-8 shrink-0 rounded-lg border border-[#DAD5C7] bg-[#FBFAF6] text-[#000000] font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1B6F63]/40 hover:bg-[#DCEFEA]/40 transition-colors"
    >
      −
    </button>
    <span className="w-8 text-center text-sm font-black text-[#000000] tabular-nums">{formatFa(value)}</span>
    <button
      type="button"
      disabled={disabled || value >= max}
      onClick={() => onChange(Math.min(max, value + 1))}
      className="h-8 w-8 shrink-0 rounded-lg border border-[#DAD5C7] bg-[#FBFAF6] text-[#000000] font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1B6F63]/40 hover:bg-[#DCEFEA]/40 transition-colors"
    >
      +
    </button>
  </div>
);

/** چیپ ساده‌ی انتخابی — برای سبک تصویر و بازه‌ی بخش‌بندی استفاده می‌شود */
const Chip: React.FC<{
  active: boolean;
  locked?: boolean;
  title?: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({ active, locked, title, onClick, className = "", children }) => (
  <button
    type="button"
    disabled={locked}
    title={title}
    onClick={onClick}
    className={`rounded-xl border px-3 py-2 text-center text-xs font-bold text-[#000000] transition-all duration-150 ${
      locked
        ? "border-[#DAD5C7] bg-[#EFEDE6]/60 opacity-50 cursor-not-allowed"
        : active
        ? "border-[#1B6F63] bg-[#DCEFEA] shadow-sm"
        : "border-[#DAD5C7] bg-[#FBFAF6] hover:border-[#1B6F63]/40"
    } ${className}`}
  >
    {children}
  </button>
);

/** سلکت ساده‌ی موبایل — برای مدل نگارش مقاله (بدون لوگو) و مدل تصویر استفاده می‌شود */
const MobileModelSelect: React.FC<{
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: { id: string; label: string; locked?: boolean }[];
  /** اگر داده شود، گزینه‌ی قفل غیرفعال نیست و انتخابش این را صدا می‌زند (مثلاً رفتن به صفحه‌ی اشتراک) */
  onLockedPick?: () => void;
}> = ({ label, value, onChange, options, onLockedPick }) => (
  <div>
    <label className="block text-[11px] font-bold text-[#000000] mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => {
        const picked = options.find((o) => o.id === e.target.value);
        if (picked?.locked && onLockedPick) onLockedPick();
        else onChange(e.target.value);
      }}
      className="w-full rounded-xl border border-[#DAD5C7] bg-[#FBFAF6] px-2.5 py-2 text-xs font-bold text-[#000000] focus:outline-none focus:border-[#1B6F63] focus:ring-2 focus:ring-[#1B6F63]/15 transition-all"
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

/**
 * نوار کوچک زیر سلکت مدل تصویر، فقط در موبایل.
 * چون <select> نمی‌تونه لوگو رو داخل option نشون بده، لوگو + کردیتِ مدل انتخاب‌شده رو همین‌جا نشون می‌دیم.
 */
const ImageModelPreview: React.FC<{ icon?: string; label: string; cost?: number }> = ({ icon, label, cost }) => (
  <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-[#EDE3CF]/60 px-2 py-1">
    {icon ? (
      <img src={icon} alt="" className="h-4 w-4 shrink-0 rounded object-contain" />
    ) : (
      <span className="h-4 w-4 shrink-0 rounded-full bg-[#1B6F63]/15" />
    )}
    <span className="text-[10px] font-bold text-[#000000] truncate">{label}</span>
    {cost !== undefined && (
      <span className="ms-auto shrink-0 inline-flex items-center gap-0.5 rounded-full bg-[#1B6F63] px-1.5 py-0.5 text-[9px] font-black text-white">
        {formatFa(cost)} credits
      </span>
    )}
  </div>
);

interface ModelSelectModalProps {
  open: boolean;
  isFreePlan: boolean;
      hideImageOptions?: boolean;

  onClose: () => void;
  onConfirm: (
    modelId: string,
    imageModelId: string,

    imageCount: number,
    imageStyle: string,
    imageUserPrompt: string,
    articleUserPrompt: string,
    minSections: number,
    maxSections: number,
  ) => void;
}

const ModelSelectModal: React.FC<ModelSelectModalProps> = ({ open, isFreePlan, onClose, onConfirm }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(DEFAULT_MODEL_ID);
  const [selectedImageModel, setSelectedImageModel] = useState<string>(DEFAULT_IMAGE_MODEL_ID);
  const [imageCount, setImageCount] = useState<number>(DEFAULT_IMAGE_COUNT);
  const [imageStyle, setImageStyle] = useState<string>(DEFAULT_IMAGE_STYLE_ID);
  const [imageUserPrompt, setImageUserPrompt] = useState<string>("");

  // --- تنظیمات پیشرفته‌ی مقاله: سبک تصویر + prompt دلخواه متن + prompt دلخواه تصویر ---
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [articleUserPrompt, setArticleUserPrompt] = useState<string>("");
  const [sectionRangeId, setSectionRangeId] = useState<string>(DEFAULT_SECTION_RANGE_ID);

  const isFreePlanRef = React.useRef(isFreePlan);
  useEffect(() => {
    isFreePlanRef.current = isFreePlan;
  }, [isFreePlan]);

  useEffect(() => {
    if (open) {
      const free = isFreePlanRef.current;
      setSelected(free ? DEFAULT_MODEL_ID : PRO_MODEL_ID);
      setSelectedImageModel(free ? DEFAULT_IMAGE_MODEL_ID : PRO_DEFAULT_IMAGE_MODEL_ID);
      setImageCount(DEFAULT_IMAGE_COUNT);
      setImageStyle(DEFAULT_IMAGE_STYLE_ID);
      setImageUserPrompt("");
      setArticleUserPrompt("");
      setSectionRangeId(DEFAULT_SECTION_RANGE_ID);
      setAdvancedOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const infographicAllowed = INFOGRAPHIC_ALLOWED_MODELS.includes(selectedImageModel);
    if (imageStyle === "infographic" && !infographicAllowed) {
      setImageStyle(DEFAULT_IMAGE_STYLE_ID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageModel]);

  if (!open) return null;

  const clampCount = (n: number) => Math.max(1, Math.min(MAX_IMAGE_COUNT, n));
  const effectiveCount = isFreePlan ? 1 : clampCount(imageCount);
  const totalCredits = (IMAGE_CREDIT_COST[selectedImageModel] ?? 0) * effectiveCount;
  const selectedSectionRange = SECTION_RANGES.find((r) => r.id === sectionRangeId) ?? SECTION_RANGES[0];

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
        className="flex w-full max-w-3xl max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-[#FBFAF6] border border-[#DAD5C7] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= هدر ثابت ================= */}
        <div className="shrink-0 flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-[#DAD5C7]">
          <div>
            <h2 className="text-base font-black text-[#000000]">{t("article.modal.title")}</h2>
            <p className="text-[11px] text-[#000000] mt-1 leading-5">
              {t("article.modal.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[#000000] hover:bg-black/5 transition-colors"
            aria-label={t("common.actions.close")}
          >
            ✕
          </button>
        </div>

        {/* ================= بدنه‌ی قابل اسکرول ================= */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-3">
          {/* ── موبایل: انتخاب سریع، دو input در یک ردیف — مدل مقاله بدون لوگو، مدل تصویر با لوگو و کردیت ── */}
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
                label={t("dashboard.settings.imageModel")}
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

          {/* ── ۱. مدل نگارش مقاله (کارت‌ها فقط در دسکتاپ؛ موبایل از سلکت بالا استفاده می‌کند) ── */}
          <section className="hidden sm:block">
            <SectionHeading step="1" title={t("article.modal.writingModel")} desc={t("article.modal.writingModelDesc")} />

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
                        ? "border-[#DAD5C7] bg-[#EFEDE6]/60 hover:border-[#E9C46A]"
                        : isSelected
                        ? "border-[#1B6F63] bg-[#DCEFEA] shadow-sm shadow-[#1B6F63]/15"
                        : "border-[#DAD5C7] bg-[#FBFAF6] hover:border-[#1B6F63]/40 hover:bg-[#DCEFEA]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-black text-[#000000] truncate">{m.label}</p>
                      {locked && <LockBadge label={t("layout.plan.pro")} />}
                      {!locked && isSelected && (
                        <span className="shrink-0 h-4 w-4 rounded-full bg-[#1B6F63] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                      )}
                    </div>
                    {m.description && <p className="text-[10px] text-[#000000] leading-4 mt-0.5 truncate">{m.description}</p>}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-px bg-[#DAD5C7]" />

          {/* ── ۲. تصویر مقاله: مدل، تعداد و بخش‌بندی ── */}
{/* ── ۲. تصویر مقاله: مدل، تعداد و بخش‌بندی ── */}
          <section>
            {/* با استفاده از hidden sm:block این عنوان در موبایل مخفی و در دسکتاپ نمایش داده می‌شود */}
            <div className="hidden sm:block">
              <SectionHeading step="2" title={t("article.modal.images")} desc={t("article.modal.imagesDesc")} />
            </div>

            {/* دسکتاپ: کارت‌های کامل */}
            {/* دسکتاپ: کارت‌های کامل */}
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
                        ? "border-[#DAD5C7] bg-[#EFEDE6]/60 opacity-60 cursor-not-allowed"
                        : isSelected
                        ? "border-[#1B6F63] bg-[#DCEFEA] shadow-md shadow-[#1B6F63]/15"
                        : "border-[#DAD5C7] bg-[#FBFAF6] hover:border-[#1B6F63]/40 hover:bg-[#DCEFEA]/40"
                    }`}
                  >
                    {locked && <LockBadge label={m.badge ?? t("layout.plan.pro")} />}
                    {!locked && isSelected && <SelectedCheck />}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {m.icon && <img src={m.icon} alt="" className="h-3.5 w-3.5 shrink-0 rounded object-contain" />}
                      <p className="text-xs font-black text-[#000000]">{m.label}</p>
                    </div>
                    {m.description && (
                      <p className="text-[10px] text-[#000000] leading-3.5 line-clamp-1">{m.description}</p>
                    )}
                    <CreditBadge cost={IMAGE_CREDIT_COST[m.id]} selected={!locked && isSelected} />
                  </button>
                );
              })}
            </div>

            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mb-4">
              <span>⭐</span> {t("article.modal.qualityTip")}
            </p>

            {/* تعداد تصویر + بازه‌ی بخش‌های مقاله، کنار هم */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#DAD5C7] bg-white/60 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <p className="text-xs font-bold text-[#000000]">{t("article.modal.imageCount")}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#000000] bg-[#EDE3CF] rounded-full px-2 py-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 010 3.5h-2.5a1.75 1.75 0 000 3.5H14.5" />
                    </svg>
                    {t("dashboard.settings.credits", { count: formatFa(totalCredits) })}
                  </span>
                </div>
                <Stepper value={effectiveCount} min={1} max={MAX_IMAGE_COUNT} disabled={isFreePlan} onChange={setImageCount} />
                {isFreePlan ? (
                  <button
                    type="button"
                    onClick={() => navigate("/subscription")}
                    className="mt-2 w-full rounded-xl bg-[#EDE3CF] border border-[#DDD0AE] px-3 py-1.5 text-[11px] font-bold text-[#000000] hover:bg-[#E6DABD] transition-colors"
                  >
                    {t("article.modal.upToImages", { count: MAX_IMAGE_COUNT })} ↗
                  </button>
                ) : (
                  <p className="mt-1 text-[10px] text-[#000000]">{t("article.modal.firstImage")}</p>
                )}
              </div>

              <div className="rounded-2xl border border-[#DAD5C7] bg-white/60 px-3 py-2.5">
                <p className="text-xs font-bold text-[#000000] mb-1.5">{t("article.modal.sectionCount")}</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {SECTION_RANGES.map((r) => {
                    const locked = r.id !== "low" && isFreePlan;
                    return (
                      <Chip
                        key={r.id}
                        active={sectionRangeId === r.id}
                        locked={locked}
                        title={locked ? t("article.modal.rangePro") : undefined}
                        onClick={() => setSectionRangeId(r.id)}
                      >
                        <span className="flex items-center justify-center gap-1">
                          {r.label}
                          {locked && (
                            <span className="inline-flex items-center rounded-full bg-[#EDE3CF] px-1.5 py-0.5 text-[9px] font-black text-[#000000]">
                              {t("layout.plan.pro")}
                            </span>
                          )}
                        </span>
                      </Chip>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-[10px] text-[#000000]">
                  {t("article.modal.sectionRange", { min: selectedSectionRange.min, max: selectedSectionRange.max })}
                </p>
              </div>
            </div>
          </section>


          {/* ── ۳. تنظیمات پیشرفته: سبک تصویر + پرامپت متن + پرامپت تصویر ── */}
          <section className="rounded-2xl border border-[#DAD5C7] bg-white/60">
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3.5"
            >
              <div className="flex items-start gap-3 text-start">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B6F63] text-[11px] font-black text-white">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#000000]">{t("article.modal.advanced")}</h3>
                  <p className="text-[11px] text-[#000000] mt-0.5">{t("article.modal.advancedHint")}</p>
                </div>
              </div>
              <svg
                className={`h-4 w-4 shrink-0 text-[#000000] transition-transform duration-150 ${advancedOpen ? "rotate-180" : ""}`}
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
                {/* سبک تصویر */}
                <div>
                  <p className="text-xs font-bold text-[#000000] mb-1.5">{t("article.modal.imageStyle")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {IMAGE_STYLES.map((s) => {
                      const isInfographic = s.id === "infographic";
                      const locked = isInfographic && !INFOGRAPHIC_ALLOWED_MODELS.includes(selectedImageModel);
                      return (
                        <Chip
                          key={s.id}
                          active={imageStyle === s.id}
                          locked={locked}
                          title={locked ? t("article.modal.infographicHint") : undefined}
                          onClick={() => setImageStyle(s.id)}
                        >
                          {s.label}
                        </Chip>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <label className="text-xs font-bold text-[#000000]">{t("dashboard.settings.articlePrompt")}</label>
                      <span className="text-[10px] text-[#000000] shrink-0">
                        {formatFa(articleUserPrompt.length)}/{formatFa(ARTICLE_USER_PROMPT_MAX)}
                      </span>
                    </div>
                    <textarea
                      value={articleUserPrompt}
                      onChange={(e) => setArticleUserPrompt(e.target.value.slice(0, ARTICLE_USER_PROMPT_MAX))}
                      maxLength={ARTICLE_USER_PROMPT_MAX}
                      rows={4}
                      placeholder={t("article.modal.articlePromptPlaceholder")}
                      className="w-full resize-none rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6] px-3.5 py-2.5 text-xs leading-6 text-[#000000] placeholder:text-[#000000]/35 focus:outline-none focus:border-[#1B6F63] focus:ring-2 focus:ring-[#1B6F63]/15 transition-all"
                    />
                    <p className="text-[10px] text-[#000000] mt-1.5">{t("dashboard.settings.articlePromptHint")}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <label className="text-xs font-bold text-[#000000]">{t("dashboard.settings.imagePrompt")}</label>
                      <span className="text-[10px] text-[#000000] shrink-0">
                        {formatFa(imageUserPrompt.length)}/{formatFa(IMAGE_USER_PROMPT_MAX)}
                      </span>
                    </div>
                    <textarea
                      value={imageUserPrompt}
                      onChange={(e) => setImageUserPrompt(e.target.value.slice(0, IMAGE_USER_PROMPT_MAX))}
                      maxLength={IMAGE_USER_PROMPT_MAX}
                      rows={4}
                      placeholder={t("article.modal.imagePromptPlaceholder")}
                      className="w-full resize-none rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6] px-3.5 py-2.5 text-xs leading-6 text-[#000000] placeholder:text-[#000000]/35 focus:outline-none focus:border-[#1B6F63] focus:ring-2 focus:ring-[#1B6F63]/15 transition-all"
                    />
                    <p className="text-[10px] text-[#000000] mt-1.5">{t("article.modal.imagePromptHint")}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ================= فوتر ثابت ================= */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[#DAD5C7] bg-[#FBFAF6]">
          <button type="button" onClick={onClose} className="text-xs font-bold text-[#000000] px-3 py-2.5 hover:opacity-70">
            {t("common.actions.cancel")}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(
                selected,
                selectedImageModel,
                effectiveCount,
                imageStyle,
                imageUserPrompt.trim(),
                articleUserPrompt.trim(),
                selectedSectionRange.min,
                selectedSectionRange.max,
              );
            }}
            className="rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#1B6F63] to-[#14564C] text-white text-sm font-bold px-6 py-2.5 hover:from-[#1F8073] hover:to-[#1B6F63] transition-all shadow-lg shadow-[#1B6F63]/25"
          >
            {t("article.modal.start")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSelectModal;