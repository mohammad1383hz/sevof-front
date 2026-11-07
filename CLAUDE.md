# Sevof — front (React panel)

Sevof is the global edition of the seobot/Youtix SEO agent: users add their website, Sevof analyzes it,
finds keyword and content opportunities, writes SEO articles and product articles, publishes them to
WordPress or Shopify, and refreshes them with Google Search Console data.

- This repo: `E:\backup\front-univeciry\seobot-national` (branched from the Iranian front `E:\backup\front-univeciry\seobot` at commit `456c788`).
- Backend: `D:\seobot-national` (Laravel; read its `CLAUDE.md` for API flows).
- When seobot gains a feature, port it here with a three-way merge (base `456c788`, or the last merged seobot commit),
  then move every user-facing string into the locales. Never copy changes back into seobot.

## Stack
React 19 + TypeScript + Vite 7 + Tailwind 3 + react-router 7. HTTP via axios in `src/services/api.ts`
(`request()` returns `ApiResponse<T>` = `{ success, data, message, status }`).

Scripts: `npm run dev`, `npm run build` (runs `tsc -b`), `npm run lint`, `npm run i18n:check`.

Env (`.env`): `VITE_API_BASE_URL`, `VITE_UPLOADS_URL`, `VITE_GOOGLE_CLIENT_ID` (Sevof's own Google OAuth client),
`VITE_WP_PLUGIN_PAGE_URL` (WordPress.org page of the Sevof plugin, once published).

## Internationalization (8 languages)
`src/i18n/` — en (source), de, fr, es, pt, it, tr, ar (RTL). Language comes from `?lang=`, the saved choice,
the visitor's country, then English. Switching language re-mounts the app.

- Use `t("namespace.key", vars)` for text, `tx(key, { part: <jsx/> })` when a sentence contains links/markup,
  `tMaybe(key, fallback)` for API-provided enums. Numbers/dates: `formatNumber`, `formatDate`, `formatRelative`, `getLocale()`.
- **Never** put user-visible text at module level as a plain string — it would freeze in the first language.
  Use getters (`get label() { return t(...) }`) or functions (see `refreshLabels.ts`, `chatModels.tsx`).
- Every key must exist in all 8 locales; non-English files are typed `typeof en`, so `tsc` fails on missing keys.
  Run `npm run i18n:check` after adding keys. Plurals are `{ one, other }` objects.
- Namespaces: common, auth, layout, billing, dashboard, support, developer, analyze, article, product, pps, landing,
  growth (Search Console results, article refreshes, past articles, referral, image export, Shopify banner texts).
- Use logical Tailwind classes (`ms-/me-/ps-/pe-/start-/end-`, `text-start`) so Arabic RTL works.
- The API docs page (`ApiDocsPage.tsx`) is intentionally English in every language (developer content); only its header is translated.

## Product rules that differ from seobot
- Sign-in: email + emailed 6-digit code, or Google. No phone/SMS anywhere.
- Billing: Stripe Checkout in USD. API prices are **integer cents** (`fromCents`, `money()` in `SubscriptionPage.tsx`).
  Stripe returns to `/payment/result?session_id=…`; `PaymentResultPage` calls `subscriptionService.confirmStripe()` and polls briefly.
- Publishing targets: WordPress (plugin, `WordPressConnectionCard`) and Shopify (OAuth app, `ShopifyConnectionCard`),
  switched in `SiteConnectionPanel`. Wix/Webflow/Notion are shown as "soon".
  Installs started inside Shopify land on `/shopify/connect?shop=…` (`ShopifyConnectPage`), which survives sign-in via sessionStorage.
  Published Shopify articles carry `shopify_article_id` / `shopify_url` (WordPress: `wp_post_id` / `wp_permalink`).
- Product prices use the product's ISO currency (`utils/priceUnit.ts` → `formatMoney`).
- Chat model ids: `sevof-mini`, `sevof-2-pro` (old `youtix-*` and `gpt-*` ids are mapped in `chatModels.tsx`).
- Brand name is **Sevof** everywhere. The WordPress plugin is Sevof Connector (`public/downloads/wordpress-plugin.zip`, REST namespace `sevof-connector/v1`); see backend CLAUDE.md.

## Known leftovers
- `src/pages/LandingPage.tsx`, `LandingPage2.tsx` and `src/components/landing/*` are not routed and contain copy from a
  third-party product ("SEObot AI"). Don't route or ship them; replace with Sevof's own landing.
- Brand assets in `public/logo*` are still the old brand's files.
- Persian comments remain in older files; they are comments only. New code comments should be English.
