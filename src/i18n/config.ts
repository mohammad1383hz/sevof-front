// src/i18n/config.ts
// Supported interface languages and the country → language map used for IP-based detection.

export type Lang = "en" | "de" | "fr" | "es" | "pt" | "it" | "tr" | "ar";

export interface LanguageInfo {
  code: Lang;
  /** BCP-47 tag used for Intl number/date formatting. */
  locale: string;
  /** Value for <html lang>. */
  htmlLang: string;
  /** Name of the language written in that language. */
  nativeName: string;
  /** Short label shown in compact switchers. */
  short: string;
  dir: "ltr" | "rtl";
  flag: string;
}

export const DEFAULT_LANG: Lang = "en";

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", locale: "en-US", htmlLang: "en-US", nativeName: "English", short: "EN", dir: "ltr", flag: "🇺🇸" },
  { code: "de", locale: "de-DE", htmlLang: "de-DE", nativeName: "Deutsch", short: "DE", dir: "ltr", flag: "🇩🇪" },
  { code: "fr", locale: "fr-FR", htmlLang: "fr-FR", nativeName: "Français", short: "FR", dir: "ltr", flag: "🇫🇷" },
  { code: "es", locale: "es-ES", htmlLang: "es-ES", nativeName: "Español", short: "ES", dir: "ltr", flag: "🇪🇸" },
  { code: "pt", locale: "pt-BR", htmlLang: "pt-BR", nativeName: "Português", short: "PT", dir: "ltr", flag: "🇧🇷" },
  { code: "it", locale: "it-IT", htmlLang: "it-IT", nativeName: "Italiano", short: "IT", dir: "ltr", flag: "🇮🇹" },
  { code: "tr", locale: "tr-TR", htmlLang: "tr-TR", nativeName: "Türkçe", short: "TR", dir: "ltr", flag: "🇹🇷" },
  // Arabic: Gregorian calendar with Western digits, as is common in Arabic web software.
  { code: "ar", locale: "ar-u-nu-latn", htmlLang: "ar", nativeName: "العربية", short: "AR", dir: "rtl", flag: "🇸🇦" },
];

export const LANG_CODES = LANGUAGES.map((l) => l.code);

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANG_CODES as string[]).includes(value);
}

export function getLanguageInfo(code: Lang): LanguageInfo {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

/**
 * ISO 3166-1 alpha-2 country code → interface language.
 * Any country that is not listed (or an unknown country) falls back to English.
 */
const COUNTRY_LANG: Record<string, Lang> = {
  // German-speaking
  DE: "de", AT: "de", CH: "de", LI: "de",
  // French-speaking (incl. Francophone Africa)
  FR: "fr", BE: "fr", LU: "fr", MC: "fr", SN: "fr", CI: "fr", CM: "fr", ML: "fr", BF: "fr",
  NE: "fr", TG: "fr", BJ: "fr", GA: "fr", CG: "fr", CD: "fr", MG: "fr", GN: "fr", HT: "fr",
  RE: "fr", GP: "fr", MQ: "fr", GF: "fr", PF: "fr", NC: "fr", YT: "fr", PM: "fr", TD: "fr",
  CF: "fr", BI: "fr", KM: "fr",
  // Spanish-speaking
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es", EC: "es", GT: "es",
  CU: "es", BO: "es", DO: "es", HN: "es", PY: "es", SV: "es", NI: "es", CR: "es", PA: "es",
  UY: "es", PR: "es", GQ: "es",
  // Portuguese-speaking
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt", CV: "pt", GW: "pt", ST: "pt", TL: "pt",
  // Italian-speaking
  IT: "it", SM: "it", VA: "it",
  // Turkish-speaking
  TR: "tr",
  // Arabic-speaking (Gulf, Levant, Iraq, Egypt and North Africa)
  SA: "ar", AE: "ar", QA: "ar", KW: "ar", BH: "ar", OM: "ar", YE: "ar", IQ: "ar", JO: "ar",
  LB: "ar", SY: "ar", PS: "ar", EG: "ar", LY: "ar", SD: "ar", MA: "ar", DZ: "ar", TN: "ar",
  MR: "ar", DJ: "ar", SO: "ar",
};

export function langForCountry(country?: string | null): Lang {
  if (!country) return DEFAULT_LANG;
  return COUNTRY_LANG[country.trim().toUpperCase()] ?? DEFAULT_LANG;
}
