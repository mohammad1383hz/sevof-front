import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DashboardAgent } from "../../types";
import { CHAT_MODELS, normalizeModelId, type ChatModelOption } from "../article-generate/chatModels";
import { IMAGE_MODELS, DEFAULT_IMAGE_MODEL_ID, type ImageModelOption } from "../article-generate/imageModels";
import { t, formatNumber, formatDate } from "../../i18n";

// نکته: به فایل types (DashboardAgent) این فیلدها را هم اضافه کنید:
//   publish_interval_days?: number; content_model?: string; image_generation_enabled?: boolean;
//   image_model?: string; images_per_article?: number; image_user_prompt?: string | null;
//   article_user_prompt?: string | null; min_sections?: number | null; max_sections?: number | null;

interface AgentSettingsPanelProps {
  agent: DashboardAgent;
  onSave: (payload: {
    default_publish_status: "draft" | "publish";
    daily_article_limit: number;
    daily_idea_count: number;
    daily_start_hour: number;
    publish_interval_days: number;
    content_model: string;
    image_generation_enabled: boolean;
    image_model: string | null;
    images_per_article: number;
    image_user_prompt: string | null;
    article_user_prompt: string | null;
    min_sections: number | null;
    max_sections: number | null;
  }) => Promise<void> | void;
}

type IntervalOption = "1" | "2" | "3" | "7" | "custom";
type SectionRangeOption = "6-8" | "8-10" | "10-12";

const PRESET_INTERVALS: IntervalOption[] = ["1", "2", "3", "7"];
const hourOptions = Array.from({ length: 24 }, (_, i) => i);
const ARTICLE_PROMPT_MAX_LENGTH = 2000;
const IMAGE_PROMPT_MAX_LENGTH = 500;

const IMAGE_CREDIT_COST: Record<string, number> = { "gpt-image-2": 10, "nano-banana-2": 10, flux: 10 };

const SECTION_RANGE_MAP: Record<SectionRangeOption, { min: number; max: number }> = {
  "6-8": { min: 6, max: 8 },
  "8-10": { min: 8, max: 10 },
  "10-12": { min: 10, max: 12 },
};
const DEFAULT_SECTION_RANGE: SectionRangeOption = "8-10";

const resolveSectionRangeOption = (min?: number | null, max?: number | null): SectionRangeOption => {
  if (min == null || max == null) return DEFAULT_SECTION_RANGE;
  return (
    (Object.keys(SECTION_RANGE_MAP) as SectionRangeOption[]).find(
      (k) => SECTION_RANGE_MAP[k].min === min && SECTION_RANGE_MAP[k].max === max
    ) ?? DEFAULT_SECTION_RANGE
  );
};

// ---------- English number formatting ----------
const formatFa = (n: number) => formatNumber(n);
const formatHour = (h: number) => formatDate(new Date(2000, 0, 1, h, 0), { hour: "2-digit", minute: "2-digit" });

const intervalPhrase = (days: number): string =>
  days <= 1
    ? t("dashboard.settings.interval.everyDay")
    : days === 2
    ? t("dashboard.settings.interval.everyOtherDay")
    : days === 7
    ? t("dashboard.settings.interval.everyWeek")
    : t("dashboard.settings.interval.everyNDays", { days });

const buildShortPreview = (articleCount: number, intervalDays: number): string => {
  return `📅 ${t("dashboard.settings.preview.short", { count: articleCount, interval: intervalPhrase(intervalDays) })}`;
};

const buildFullPreview = (
  articleCount: number,
  intervalDays: number,
  startHour: number,
  publishStatus: "draft" | "publish",
  imageGenerationEnabled: boolean,
  imagesPerArticle: number
): string => {
  const vars = {
    time: formatHour(startHour),
    interval: intervalPhrase(intervalDays),
    count: articleCount,
    images: imagesPerArticle,
  };
  const base = publishStatus === "publish" ? "dashboard.settings.preview.publish" : "dashboard.settings.preview.draft";
  return t(imageGenerationEnabled ? `${base}WithImages` : base, vars);
};

const intervalOptionLabels: Record<IntervalOption, string> = {
  "1": "dashboard.settings.intervalOptions.d1",
  "2": "dashboard.settings.intervalOptions.d2",
  "3": "dashboard.settings.intervalOptions.d3",
  "7": "dashboard.settings.intervalOptions.d7",
  custom: "dashboard.settings.intervalOptions.custom",
};

// ---------- آیکن سکه ----------
const CoinIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 010 3.5h-2.5a1.75 1.75 0 000 3.5H14.5" />
  </svg>
);

const CreditBadge: React.FC<{ cost?: number; selected?: boolean; compact?: boolean }> = ({ cost, selected, compact }) => {
  if (cost === undefined) return null;
  return (
    <div
      className={`w-full border-t border-dashed flex items-center justify-between gap-1 ${
        compact ? "mt-0.5 pt-1" : "mt-1 pt-2"
      } ${selected ? "border-[#5B47FB]/30" : "border-[#E4E5F0]"}`}
    >
      <span className="text-[10px] text-[#0D0F23]/55">{t("dashboard.settings.perImage")}</span>
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-black ${selected ? "bg-[#5B47FB] text-white" : "bg-[#EDE3CF] text-[#8A6A2F]"}`}>
        <CoinIcon />
        {t("dashboard.settings.credits", { count: formatFa(cost) })}
      </span>
    </div>
  );
};

interface FieldShellProps { label: string; hint?: string; trailing?: React.ReactNode; children: React.ReactNode; }
const FieldShell: React.FC<FieldShellProps> = ({ label, hint, trailing, children }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5 gap-2">
      <label className="block text-xs font-medium text-[#0D0F23]">{label}</label>
      {trailing}
    </div>
    {children}
    {hint && <p className="text-[11px] text-[#63667F] mt-1.5">{hint}</p>}
  </div>
);

interface SelectOption<T extends string | number> { value: T; label: string; }
interface CustomSelectProps<T extends string | number> {
  value: T; options: SelectOption<T>[]; onChange: (value: T) => void; maxListHeightClass?: string;
}
function CustomSelect<T extends string | number>({ value, options, onChange, maxListHeightClass = "max-h-64" }: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E4E5F0] bg-white px-3.5 py-2.5 text-sm text-[#0D0F23] shadow-sm transition-colors duration-150 hover:border-[#5B47FB]/50 focus:outline-none focus:border-[#5B47FB] focus:ring-4 focus:ring-[#5B47FB]/10">
        <span className="truncate">{selected?.label ?? ""}</span>
        <svg className={`h-4 w-4 shrink-0 text-[#9A9DB8] transition-transform duration-150 ${open ? "rotate-180 text-[#5B47FB]" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul role="listbox" className={`absolute z-20 mt-1.5 w-full overflow-y-auto rounded-xl border border-[#E4E5F0] bg-white p-1 shadow-lg ${maxListHeightClass}`}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={String(opt.value)} role="option" aria-selected={isSelected}>
                <button type="button" onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full rounded-lg px-3 py-2 text-start text-sm transition-colors ${isSelected ? "bg-[#5B47FB] text-white" : "text-[#0D0F23] hover:bg-[#5B47FB]/10"}`}>
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface NumberStepperProps { value: number; min: number; max: number; onChange: (value: number) => void; }
const NumberStepper: React.FC<NumberStepperProps> = ({ value, min, max, onChange }) => {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-[#E4E5F0] bg-white shadow-sm transition-colors duration-150 focus-within:border-[#5B47FB] focus-within:ring-4 focus-within:ring-[#5B47FB]/10 hover:border-[#5B47FB]/50">
      <button type="button" onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label={t("dashboard.settings.decrease")}
        className="flex h-10 w-10 shrink-0 items-center justify-center text-lg leading-none text-[#5B47FB] transition-colors hover:bg-[#5B47FB]/10 disabled:text-[#CFCDE0] disabled:hover:bg-transparent">
        −
      </button>
      <input type="number" inputMode="numeric" min={min} max={max} value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
        className="w-full border-x border-[#E4E5F0] bg-transparent py-2.5 text-center text-sm text-[#0D0F23] focus:outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
      <button type="button" onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label={t("dashboard.settings.increase")}
        className="flex h-10 w-10 shrink-0 items-center justify-center text-lg leading-none text-[#5B47FB] transition-colors hover:bg-[#5B47FB]/10 disabled:text-[#CFCDE0] disabled:hover:bg-transparent">
        +
      </button>
    </div>
  );
};

interface ModelOptionCardProps {
  label: string; description?: string; icon?: string; badge?: string; isLocked?: boolean;
  recommended?: boolean; selected: boolean; creditCost?: number; compact?: boolean; onSelect: () => void;
}
const ModelOptionCard: React.FC<ModelOptionCardProps> = ({ label, description, icon, badge, isLocked, recommended, selected, creditCost, compact, onSelect }) => (
  <button type="button" onClick={onSelect}
    className={`relative flex flex-col items-start gap-1 rounded-xl border text-start transition-colors duration-150 ${compact ? "p-1.5" : "p-3"} ${selected ? "border-[#5B47FB] bg-[#5B47FB]/5 ring-2 ring-[#5B47FB]/15" : "border-[#E4E5F0] bg-white hover:border-[#5B47FB]/40"}`}>
    {recommended && (
      <span className={`absolute -top-2 start-3 rounded-full bg-[#5B47FB] px-2 py-0.5 font-bold text-white shadow-sm ${compact ? "text-[9px]" : "text-[10px]"}`}>
        {t("dashboard.settings.recommended")}
      </span>
    )}
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        {icon && <img src={icon} alt="" className={`shrink-0 rounded object-contain ${compact ? "h-4 w-4" : "h-5 w-5"}`} />}
        <span className={`truncate font-bold text-[#0D0F23] ${compact ? "text-xs" : "text-sm"}`}>{label}</span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {(badge || isLocked) && <span className="rounded-md bg-[#E9C46A]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#8A6D1D]">{badge ?? t("layout.plan.pro")}</span>}
        <span className={`flex items-center justify-center rounded-full border ${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${selected ? "border-[#5B47FB] bg-[#5B47FB]" : "border-[#E4E5F0]"}`}>
          {selected && <span className={`rounded-full bg-white ${compact ? "h-1 w-1" : "h-1.5 w-1.5"}`} />}
        </span>
      </div>
    </div>
    {description && (
      <p className={`text-[#63667F] ${compact ? "text-[10px] leading-4 line-clamp-1" : "text-[11px] leading-5"}`}>{description}</p>
    )}
    <CreditBadge cost={creditCost} selected={selected} compact={compact} />
  </button>
);

// ---------- فیلد متنیِ با شمارنده‌ی کاراکتر (مشترک بین پرامپت مقاله و پرامپت تصویر) ----------
interface PromptFieldProps {
  label: string; hint: string; value: string; onChange: (v: string) => void; maxLength: number; placeholder: string; rows?: number;
}
const PromptField: React.FC<PromptFieldProps> = ({ label, hint, value, onChange, maxLength, placeholder, rows = 3 }) => (
  <FieldShell
    label={label}
    hint={hint}
    trailing={
      <span className={`text-[10px] tabular-nums ${value.length >= maxLength ? "text-rose-500 font-bold" : "text-[#9A9DB8]"}`}>
        {formatNumber(value.length)}/{formatNumber(maxLength)}
      </span>
    }
  >
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      maxLength={maxLength}
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-y rounded-xl border border-[#E4E5F0] bg-white px-3.5 py-2.5 text-sm text-[#0D0F23] shadow-sm transition-colors duration-150 placeholder:text-[#9A9DB8] hover:border-[#5B47FB]/50 focus:outline-none focus:border-[#5B47FB] focus:ring-4 focus:ring-[#5B47FB]/10"
    />
  </FieldShell>
);

// ---------- کامپوننت اصلی ----------
const AgentSettingsPanel: React.FC<AgentSettingsPanelProps> = ({ agent, onSave }) => {
  const initialIntervalDays = agent.publish_interval_days ?? 1;
  const initialIntervalOption: IntervalOption = (PRESET_INTERVALS as string[]).includes(String(initialIntervalDays))
    ? (String(initialIntervalDays) as IntervalOption)
    : "custom";

  const [publishStatus, setPublishStatus] = useState<"draft" | "publish">(agent.default_publish_status ?? "draft");
  const [articleCount, setArticleCount] = useState<number>(agent.daily_article_limit ?? 1);
  const [intervalOption, setIntervalOption] = useState<IntervalOption>(initialIntervalOption);
  const [customInterval, setCustomInterval] = useState<number>(initialIntervalOption === "custom" ? initialIntervalDays : 3);
  const [startHour, setStartHour] = useState<number>(agent.daily_start_hour ?? 9);

  const [contentModel, setContentModel] = useState<string>(normalizeModelId(agent.content_model));

  // تولید تصویر همیشه فعال است (دکمه‌ی روشن/خاموش حذف شد)
  const imageGenerationEnabled = true;
  const [imageModel, setImageModel] = useState<string>(agent.image_model ?? DEFAULT_IMAGE_MODEL_ID);
  const [imagesPerArticle, setImagesPerArticle] = useState<number>(
    agent.images_per_article && agent.images_per_article > 0 ? agent.images_per_article : 1
  );
  const [imageUserPrompt, setImageUserPrompt] = useState<string>(agent.image_user_prompt ?? "");

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [articleUserPrompt, setArticleUserPrompt] = useState<string>(agent.article_user_prompt ?? "");
  const [sectionRange, setSectionRange] = useState<SectionRangeOption>(
    resolveSectionRangeOption(agent.min_sections, agent.max_sections)
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const intervalDays = intervalOption === "custom" ? customInterval : Number(intervalOption);

  const costPerImage = IMAGE_CREDIT_COST[imageModel] ?? 0;
  const costPerArticle = costPerImage * imagesPerArticle;
  // const costPerCycle = costPerArticle * articleCount;

  const shortPreview = useMemo(() => buildShortPreview(articleCount, intervalDays), [articleCount, intervalDays]);
  const fullPreview = useMemo(
    () => buildFullPreview(articleCount, intervalDays, startHour, publishStatus, imageGenerationEnabled, imagesPerArticle),
    [articleCount, intervalDays, startHour, publishStatus, imageGenerationEnabled, imagesPerArticle]
  );

  const publishStatusOptions: SelectOption<"draft" | "publish">[] = [
    { value: "draft", label: t("dashboard.settings.publishOptions.draft") },
    { value: "publish", label: t("dashboard.settings.publishOptions.publish") },
  ];
  const intervalOptions: SelectOption<IntervalOption>[] = (Object.keys(intervalOptionLabels) as IntervalOption[]).map((key) => ({
    value: key, label: t(intervalOptionLabels[key]),
  }));
  const hourSelectOptions: SelectOption<number>[] = hourOptions.map((h) => ({ value: h, label: formatHour(h) }));
  const sectionRangeOptions: SelectOption<SectionRangeOption>[] = [
    { value: "6-8", label: t("dashboard.settings.sections.short") },
    { value: "8-10", label: t("dashboard.settings.sections.medium") },
    { value: "10-12", label: t("dashboard.settings.sections.long") },
  ];

  // گزینه‌های مدل مقاله و تصویر برای حالت انتخابِ کشویی (نسخه موبایل)
  const contentModelOptions: SelectOption<string>[] = CHAT_MODELS.map((m: ChatModelOption) => ({
    value: m.id,
    label: m.label,
  }));
  const imageModelOptions: SelectOption<string>[] = IMAGE_MODELS.map((m: ImageModelOption) => ({
    value: m.id,
    label: m.isPro ? `${m.label} (Pro)` : m.label,
  }));
  const selectedContentModel = CHAT_MODELS.find((m: ChatModelOption) => m.id === contentModel);
  const selectedImageModel = IMAGE_MODELS.find((m: ImageModelOption) => m.id === imageModel);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const trimmedImagePrompt = imageUserPrompt.trim();
      const trimmedArticlePrompt = articleUserPrompt.trim();
      const { min, max } = SECTION_RANGE_MAP[sectionRange];

      await onSave({
        default_publish_status: publishStatus,
        daily_article_limit: articleCount,
        daily_idea_count: articleCount,
        daily_start_hour: startHour,
        publish_interval_days: intervalDays,
        content_model: contentModel,
        image_generation_enabled: imageGenerationEnabled,
        image_model: imageModel,
        images_per_article: imagesPerArticle,
        image_user_prompt: trimmedImagePrompt ? trimmedImagePrompt : null,
        article_user_prompt: trimmedArticlePrompt ? trimmedArticlePrompt : null,
        min_sections: min,
        max_sections: max,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 border-t border-[#E4E5F0]/60 pt-4">
      <h3 className="text-sm font-bold text-[#0D0F23] mb-3">{t("dashboard.settings.title")}</h3>

      {/* ردیف اول: همیشه ۵ ستونه تا چیزی به خط بعد نیفتد */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <FieldShell
          label={t("dashboard.settings.publishStatus")}
          hint={publishStatus === "publish" ? t("dashboard.settings.publishHint") : t("dashboard.settings.draftHint")}
        >
          <CustomSelect value={publishStatus} options={publishStatusOptions} onChange={setPublishStatus} />
        </FieldShell>

        <FieldShell label={t("dashboard.settings.perCycle")} hint={t("dashboard.settings.perCycleHint")}>
          <NumberStepper value={articleCount} min={1} max={20} onChange={setArticleCount} />
        </FieldShell>

        <FieldShell label={t("dashboard.settings.schedule")} hint={t("dashboard.settings.scheduleHint")}>
          <CustomSelect value={intervalOption} options={intervalOptions} onChange={setIntervalOption} />
        </FieldShell>

        {intervalOption === "custom" ? (
          <FieldShell label={t("dashboard.settings.customInterval")} hint={t("dashboard.settings.customIntervalHint")}>
            <NumberStepper value={customInterval} min={1} max={30} onChange={setCustomInterval} />
          </FieldShell>
        ) : (
          <FieldShell label={t("dashboard.settings.startTime")} hint={t("dashboard.settings.startTimeHint")}>
            <CustomSelect value={startHour} options={hourSelectOptions} onChange={setStartHour} />
          </FieldShell>
        )}

        {intervalOption === "custom" && (
          <FieldShell label={t("dashboard.settings.startTime")} hint={t("dashboard.settings.startTimeHint")}>
            <CustomSelect value={startHour} options={hourSelectOptions} onChange={setStartHour} />
          </FieldShell>
        )}

        <FieldShell label={t("dashboard.settings.sectionCount")} hint={t("dashboard.settings.sectionCountHint")}>
          <CustomSelect value={sectionRange} options={sectionRangeOptions} onChange={setSectionRange} />
        </FieldShell>
      </div>

      <div className="mt-6">
        <h4 className="text-xs font-bold text-[#0D0F23] mb-2">{t("dashboard.settings.articleModel")}</h4>

        {/* موبایل: به‌جای کارت‌ها یک اینپوت کشویی ساده */}
        <div className="sm:hidden">
          <FieldShell label="" hint={selectedContentModel?.description}>
            <CustomSelect value={contentModel} options={contentModelOptions} onChange={setContentModel} />
          </FieldShell>
        </div>

        {/* دسکتاپ/تبلت: همان کارت‌های انتخابی قبلی، بدون تغییر */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-3">
          {CHAT_MODELS.map((m: ChatModelOption) => (
            <ModelOptionCard
              key={m.id}
              label={m.label}
              description={m.description}
              isLocked={m.proOnly}
              recommended={m.recommended}
              selected={contentModel === m.id}
              onSelect={() => setContentModel(m.id)}
            />
          ))}
        </div>
      </div>

      {/* تولید تصویر برای مقالات: همیشه فعال است */}
      <div className="mt-6">
        <h4 className="text-xs font-bold text-[#0D0F23] mb-2">{t("dashboard.settings.imagesTitle")}</h4>

        {/* موبایل: مدل تصویر به‌صورت اینپوت کشویی + تعداد تصویر کنارش */}
        <div className="sm:hidden space-y-3">
          <FieldShell label={t("dashboard.settings.imageModel")} hint={selectedImageModel?.description}>
            <CustomSelect value={imageModel} options={imageModelOptions} onChange={setImageModel} />
          </FieldShell>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <FieldShell label={t("dashboard.settings.imagesPerArticle")}>
                <NumberStepper value={imagesPerArticle} min={1} max={4} onChange={setImagesPerArticle} />
              </FieldShell>
            </div>
            <span className="inline-flex items-center justify-between gap-2 rounded-full bg-[#EDE3CF] px-3 py-1.5 text-[11px] font-bold text-[#8A6A2F] mt-6">
              <span className="inline-flex items-center gap-1"><CoinIcon />{t("dashboard.settings.perArticle")}</span>
              <span>{formatFa(costPerArticle)}</span>
            </span>
          </div>
        </div>

        {/* دسکتاپ/تبلت: همان کارت‌های انتخابی قبلی، بدون تغییر */}
        <div className="hidden sm:flex sm:flex-row gap-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 flex-1">
            {IMAGE_MODELS.map((m: ImageModelOption) => (
              <ModelOptionCard
                key={m.id}
                compact
                label={m.label}
                description={m.description}
                icon={m.icon}
                badge={m.badge}
                isLocked={m.isPro}
                recommended={m.recommended}
                selected={imageModel === m.id}
                creditCost={IMAGE_CREDIT_COST[m.id]}
                onSelect={() => setImageModel(m.id)}
              />
            ))}
          </div>

          <div className="flex flex-row lg:flex-col gap-2.5 lg:w-52 shrink-0">
            <div className="flex-1 lg:flex-none">
              <FieldShell label={t("dashboard.settings.imagesPerArticle")}>
                <NumberStepper value={imagesPerArticle} min={1} max={4} onChange={setImagesPerArticle} />
              </FieldShell>
            </div>
            <div className="flex flex-col justify-end gap-2">
              <span className="inline-flex items-center justify-between gap-2 rounded-full bg-[#EDE3CF] px-3 py-1.5 text-[11px] font-bold text-[#8A6A2F]">
                <span className="inline-flex items-center gap-1"><CoinIcon />{t("dashboard.settings.perArticle")}</span>
                <span>{formatFa(costPerArticle)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* تنظیمات پیشرفته: پرامپت مقاله + پرامپت تصویر کنار هم، و تعداد بخش‌های مقاله */}
      <div className="mt-6 rounded-xl border border-[#E4E5F0]/70 bg-[#FAFAFE]/60">
        <button type="button" onClick={() => setAdvancedOpen((v) => !v)} className="flex w-full items-center justify-between gap-2 px-4 py-3">
          <div className="text-start">
            <h4 className="text-xs font-bold text-[#0D0F23]">{t("dashboard.settings.advanced")}</h4>
            <p className="text-[11px] text-[#63667F] mt-0.5">{t("dashboard.settings.advancedHint")}</p>
          </div>
          <svg className={`h-4 w-4 shrink-0 text-[#63667F] transition-transform duration-150 ${advancedOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {advancedOpen && (
          <div className="px-4 pb-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <PromptField
                label={t("dashboard.settings.articlePrompt")}
                hint={t("dashboard.settings.articlePromptHint")}
                value={articleUserPrompt}
                onChange={setArticleUserPrompt}
                maxLength={ARTICLE_PROMPT_MAX_LENGTH}
                placeholder={t("dashboard.settings.articlePromptPlaceholder")}
                rows={3}
              />
              <PromptField
                label={t("dashboard.settings.imagePrompt")}
                hint={t("dashboard.settings.imagePromptHint")}
                value={imageUserPrompt}
                onChange={setImageUserPrompt}
                maxLength={IMAGE_PROMPT_MAX_LENGTH}
                placeholder={t("dashboard.settings.imagePromptPlaceholder")}
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 inline-flex items-center rounded-full bg-[#5B47FB]/10 px-3 py-1.5 text-xs font-medium text-[#4935E0]">
        {shortPreview}
      </div>

      <div className="mt-3 rounded-xl border border-[#5B47FB]/20 bg-[#FAFAFE] p-4">
        <p className="text-xs font-bold text-[#0D0F23] mb-1">{t("dashboard.settings.summary")}</p>
        <p className="text-sm leading-6 text-[#0D0F23]">{fullPreview}</p>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button onClick={handleSave} disabled={saving} className="bg-[#5B47FB] hover:bg-[#4935E0] disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          {saving ? t("common.status.saving") : t("dashboard.settings.save")}
        </button>
        {saved && <span className="text-xs text-[#5B47FB] font-medium">{t("common.status.saved")}</span>}
      </div>
    </div>
  );
};

export default AgentSettingsPanel;
