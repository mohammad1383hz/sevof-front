// src/i18n/geo.ts
// Detects the visitor's country from their IP address using public geo-IP services.
// The result is cached so the lookup only happens on the first visit (and once a week after).

const GEO_CACHE_KEY = "i18n.geo";
const GEO_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const GEO_TIMEOUT_MS = 3000;

interface GeoCache {
  country: string | null;
  at: number;
}

function readCache(): GeoCache | null {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GeoCache;
    if (typeof parsed?.at !== "number" || Date.now() - parsed.at > GEO_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(country: string | null) {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ country, at: Date.now() } satisfies GeoCache));
  } catch {
    /* storage unavailable (private mode) — detection simply runs again next time */
  }
}

const isCountryCode = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z]{2}$/.test(v.trim());

type Provider = (signal: AbortSignal) => Promise<string>;

const providers: Provider[] = [
  async (signal) => {
    const res = await fetch("https://ipwho.is/?fields=success,country_code", { signal });
    const data = await res.json();
    if (data?.success === false || !isCountryCode(data?.country_code)) throw new Error("ipwho.is");
    return data.country_code;
  },
  async (signal) => {
    const res = await fetch("https://api.country.is/", { signal });
    const data = await res.json();
    if (!isCountryCode(data?.country)) throw new Error("country.is");
    return data.country;
  },
  async (signal) => {
    const res = await fetch("https://ipapi.co/country/", { signal });
    const text = (await res.text()).trim();
    if (!res.ok || !isCountryCode(text)) throw new Error("ipapi.co");
    return text;
  },
];

/**
 * Returns the visitor's ISO country code (e.g. "US", "DE"), or null when it cannot be determined.
 * All providers are queried in parallel and the first valid answer wins; the whole lookup
 * is capped at a few seconds so a slow network never blocks the app for long.
 */
export async function detectCountry(): Promise<string | null> {
  const cached = readCache();
  if (cached) return cached.country;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
  try {
    const country = await Promise.any(providers.map((p) => p(controller.signal)));
    const code = country.trim().toUpperCase();
    writeCache(code);
    return code;
  } catch {
    // Do not cache failures for long: retry on the next visit.
    return null;
  } finally {
    window.clearTimeout(timer);
    controller.abort();
  }
}
