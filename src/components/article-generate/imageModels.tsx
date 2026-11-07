import { t } from "../../i18n";
// src/components/article-generate/imageModels.ts

/** توضیح یک مدل تولید تصویر که در سلکتور نمایش داده می‌شود. */
export interface ImageModelOption {
  /** شناسه‌ی یکتا — همان چیزی که برای سرور ارسال می‌شود (مثلاً image_model: selectedImageModelId) */
  id: string;
  /** برچسب نمایشی */
  label: string;
  /** آیا این مدل فقط برای پلن Pro است؟ */
  isPro?: boolean;
  /** برچسب کوچک کنار نام (مثلاً "Pro") */
  badge?: string;
  /** آیکون/لوگوی مدل */
  icon?: string;
  /** توضیح کوتاه زیر نام مدل (اختیاری) */
  description?: string;
  /** آیا این مدل پیشنهاد ما است؟ (اختیاری) */
  recommended?: boolean;
}

/** لیست مدل‌های قابل انتخاب برای تولید تصویر مقاله. */
export const IMAGE_MODELS: ImageModelOption[] = [
  {
    id: "flux",
    label: "Flux",
    isPro: true,
    badge: "Pro",
    icon: "/logo/flux_dark.webp",
    get description() { return t("article.imageModels.flux"); },
  },
  {
    id: "nano-banana-2",
    label: "Nano Banana 2",
    isPro: true,
    badge: "Pro",
    icon: "/logo/nan-banana.png",
    get description() { return t("article.imageModels.banana"); },
  },
  {
    id: "gpt-image-2",
    label: "GPT Image 2",
    isPro: true,
    badge: "Pro",
    icon: "/logo/gpt.png",
    get description() { return t("article.imageModels.gpt"); },
  },
  // {
  //   id: "midjourney",
  //   label: "Midjourney",
  //   isPro: true,
  //   badge: "Pro",
  //   icon: "/logo/midjurney.webp",
  //   description: "بهترین کیفیت هنری برای تصاویر جذاب‌تر.",
  // },
];

/** مدل پیش‌فرض تصویر — اولین آیتم لیست. */
export const DEFAULT_IMAGE_MODEL_ID: string = IMAGE_MODELS[0].id;

/**
 * تعداد تصویر پیش‌فرض و سقف مجاز در سلکتور.
 * کاربر رایگان همیشه توسط بک‌اند (ImageModelResolver) به ۱ محدود می‌شود،
 * این مقادیر فقط برای UI/stepper سمت فرانت هستند.
 */
export const DEFAULT_IMAGE_COUNT = 1;
export const MAX_IMAGE_COUNT = 3;