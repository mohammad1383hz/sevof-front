// Runtime settings for the Sevof panel. An empty or missing value falls back to the build-time .env.
// In production this file is served from /var/www/sevof-front/config.js (outside build/), so deploys keep it.
window.SEVOF_CONFIG = {
  VITE_API_BASE_URL: "",
  VITE_UPLOADS_URL: "",
  VITE_GOOGLE_CLIENT_ID: "",
  VITE_WP_PLUGIN_PAGE_URL: "",
};
