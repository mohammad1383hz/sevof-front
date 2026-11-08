type EnvKey = "VITE_API_BASE_URL" | "VITE_UPLOADS_URL" | "VITE_GOOGLE_CLIENT_ID" | "VITE_WP_PLUGIN_PAGE_URL";

declare global {
  interface Window {
    SEVOF_CONFIG?: Partial<Record<EnvKey, string>>;
  }
}

/** A value from /config.js (set on the server, no rebuild needed) wins over the build-time .env. */
export const env = (key: EnvKey): string | undefined => window.SEVOF_CONFIG?.[key] || import.meta.env[key];
