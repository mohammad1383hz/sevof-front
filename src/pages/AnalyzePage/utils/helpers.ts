import type { Phase } from "../types";

export function statusToPhase(status: string): Phase {
  if (status === "pending") return "queued";
  if (status === "crawling") return "crawling";
  if (status === "analyzing") return "analyzing";
  if (status === "done" || status === "completed") return "done";
  if (status === "failed") return "failed";
  return "queued";
}

/** فقط دامنه معتبر قبول می‌شود — بدون http/https، بدون مسیر یا فاصله */
export function isValidDomain(raw: string): boolean {
  let value = raw.trim();
  if (!value) return false;

  // اگه پروتکل داشت (http:// یا https://)، حذفش کن و باقی رو چک کن
  value = value.replace(/^https?:\/\//i, "");

  if (!value) return false;
  if (/\s/.test(value)) return false; // فاصله ممنوع
  if (value.includes("/") || value.includes("?") || value.includes("@")) return false; // مسیر/کوئری ممنوع

  const domainRegex = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
  return domainRegex.test(value);
}

/* ════════════════════════════════════════════════
   SMOOTH SCROLL HELPER (سرعت کنترل‌شده)
════════════════════════════════════════════════ */
// اگه روی همون المنت یه اسکرول جدید قبل از تمومشدن قبلی صدا زده بشه (مثلاً
// کلیک سریع و پشت‌سرهم روی دکمه‌های ناوبری)، انیمیشن قبلی باید کنسل بشه؛
// وگرنه دو حلقه‌ی rAF هم‌زمان روی scrollTop رقابت می‌کنن و نتیجه لرزون/گیر
// می‌شه. یه توکن به‌ازای هر المنت نگه می‌داریم تا فقط آخرین درخواست برنده باشه.
const scrollAnimationTokens = new WeakMap<HTMLElement, number>();

export function smoothScrollTo(el: HTMLElement, target: number, duration = 700) {
  const start = el.scrollTop;
  const change = target - start;
  const startTime = performance.now();

  const token = (scrollAnimationTokens.get(el) ?? 0) + 1;
  scrollAnimationTokens.set(el, token);

  const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  function step(now: number) {
    // اگه در این فاصله درخواست جدیدتری اومده باشه، این حلقه‌ی قدیمی خودش را متوقف می‌کند
    if (scrollAnimationTokens.get(el) !== token) return;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.scrollTop = start + change * easeInOutQuad(progress);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}