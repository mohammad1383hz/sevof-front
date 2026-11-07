// src/i18n/index.ts
// Lightweight runtime for the multilingual interface.
//
// - `t("ns.key", { var })` can be used anywhere (components, helpers, services).
// - The active language is chosen once before the first render (see `initI18n`):
//     1. `?lang=xx` in the URL, 2. the language the user picked earlier,
//     3. the visitor's country from their IP address, 4. English.
// - Changing the language re-mounts the app (see `I18nRoot`), so every string,
//   including ones computed outside React, is re-evaluated in the new language.

import { useSyncExternalStore } from "react";
import { DEFAULT_LANG, getLanguageInfo, isLang, langForCountry, type Lang } from "./config";
import { detectCountry } from "./geo";
import en from "./locales/en";
import { PLURAL_FORMS, type Plural } from "./plural";

export * from "./config";

type Tree = { [key: string]: string | Plural | Tree };

/** Shape every locale must implement — derived from the English source copy. */
export type Messages = typeof en;

const LANG_STORAGE_KEY = "i18n.lang";

const loaders: Record<Exclude<Lang, "en">, () => Promise<{ default: Messages }>> = {
  de: () => import("./locales/de"),
  fr: () => import("./locales/fr"),
  es: () => import("./locales/es"),
  pt: () => import("./locales/pt"),
  it: () => import("./locales/it"),
  tr: () => import("./locales/tr"),
  ar: () => import("./locales/ar"),
};

let currentLang: Lang = DEFAULT_LANG;
let currentMessages: Messages = en;
const listeners = new Set<() => void>();

/* ------------------------------------------------------------------ */
/* Lookup + interpolation                                              */
/* ------------------------------------------------------------------ */

function lookup(tree: unknown, key: string): string | Plural | undefined {
  let node: unknown = tree;
  for (const part of key.split(".")) {
    if (node == null || typeof node !== "object") return undefined;
    node = (node as Tree)[part];
  }
  if (typeof node === "string") return node;
  if (isPlural(node)) return node;
  return undefined;
}

/** A plural entry is an object made only of `one` / `other` (and optionally `zero`) strings. */
function isPlural(node: unknown): node is Plural {
  if (!node || typeof node !== "object") return false;
  const keys = Object.keys(node);
  return keys.includes("one") && keys.includes("other") && keys.every((k) => (PLURAL_FORMS as string[]).includes(k));
}

export type TVars = Record<string, string | number | null | undefined>;

function interpolate(template: string, vars?: TVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name];
    if (value === undefined || value === null) return match;
    return typeof value === "number" ? formatNumber(value) : String(value);
  });
}

function pickPlural(entry: Plural, count: number): string {
  if (count === 0 && entry.zero) return entry.zero;
  const rule = new Intl.PluralRules(getLanguageInfo(currentLang).locale).select(count);
  return entry[rule] ?? entry.other;
}

/**
 * Translate a dotted key, e.g. auth.login.title.
 * Plural entries (`{ one, other }`) are resolved with `vars.count`.
 * Falls back to English, then to the key itself, so a missing string is never blank.
 */
export function t(key: string, vars?: TVars): string {
  const entry = lookup(currentMessages, key) ?? lookup(en, key);
  if (entry === undefined) {
    if (import.meta.env.DEV) console.warn(`[i18n] Missing key: ${key}`);
    return key;
  }
  if (typeof entry === "string") return interpolate(entry, vars);
  const count = Number(vars?.count ?? 0);
  return interpolate(pickPlural(entry, count), vars);
}

/** True when the key exists (in the active language or English). */
export function hasKey(key: string): boolean {
  return (lookup(currentMessages, key) ?? lookup(en, key)) !== undefined;
}

/** Translate a dynamic value (e.g. a status coming from the API) with a fallback when unknown. */
export function tMaybe(key: string, fallback: string, vars?: TVars): string {
  return hasKey(key) ? t(key, vars) : fallback;
}

/* ------------------------------------------------------------------ */
/* Locale-aware formatting                                             */
/* ------------------------------------------------------------------ */

export function getLang(): Lang {
  return currentLang;
}

export function getLocale(): string {
  return getLanguageInfo(currentLang).locale;
}

export function getDir(): "ltr" | "rtl" {
  return getLanguageInfo(currentLang).dir;
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  if (!Number.isFinite(value)) return String(value);
  return new Intl.NumberFormat(getLocale(), options).format(value);
}

export function formatDate(
  value: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string {
  if (value === null || value === undefined || value === "") return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(getLocale(), options).format(date);
}

export function formatDateTime(value: string | number | Date | null | undefined): string {
  return formatDate(value, { dateStyle: "medium", timeStyle: "short" });
}

/** "3 hours ago", "vor 3 Stunden", "۳ ساعت پیش" … */
export function formatRelative(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 45) return t("common.time.justNow");
  const rtf = new Intl.RelativeTimeFormat(getLocale(), { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["minute", 60],
    ["hour", 3600],
    ["day", 86400],
    ["week", 604800],
    ["month", 2592000],
    ["year", 31536000],
  ];
  let unit: Intl.RelativeTimeFormatUnit = "minute";
  let size = 60;
  for (const [u, s] of units) {
    if (abs >= s) {
      unit = u;
      size = s;
    }
  }
  return rtf.format(Math.round(diffSec / size), unit);
}

/* ------------------------------------------------------------------ */
/* Language selection                                                  */
/* ------------------------------------------------------------------ */

function applyDocumentLanguage(lang: Lang) {
  const info = getLanguageInfo(lang);
  const root = document.documentElement;
  root.lang = info.htmlLang;
  root.dir = info.dir;
  root.dataset.lang = lang;
  document.title = t("common.appTitle");
}

async function loadMessages(lang: Lang): Promise<Messages> {
  if (lang === "en") return en;
  try {
    return (await loaders[lang]()).default;
  } catch (err) {
    console.error(`[i18n] Could not load "${lang}", falling back to English`, err);
    return en;
  }
}

async function activate(lang: Lang) {
  const messages = await loadMessages(lang);
  currentLang = messages === en ? "en" : lang;
  currentMessages = messages;
  applyDocumentLanguage(currentLang);
  listeners.forEach((fn) => fn());
}

function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

/** Switch the interface language and remember the user's choice. */
export async function setLanguage(lang: Lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  await activate(lang);
}

/**
 * Chooses the initial language. Resolves quickly when the choice is cached;
 * on a first visit it waits for the geo-IP lookup (capped by a short timeout).
 */
export async function initI18n(): Promise<Lang> {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (isLang(fromUrl)) {
    await setLanguage(fromUrl);
    return currentLang;
  }

  const stored = readStoredLang();
  if (stored) {
    await activate(stored);
    return currentLang;
  }

  let lang: Lang = DEFAULT_LANG;
  try {
    lang = langForCountry(await detectCountry());
  } catch {
    lang = DEFAULT_LANG;
  }
  await activate(lang);
  return currentLang;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** React hook: the active language; components using it re-render on change. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang);
}
