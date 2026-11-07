import React, { useState } from "react";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { t } from "../i18n";

/**
 * Developer documentation for the public agent API.
 * Kept in English for every UI language (developer docs, code samples and field names are English anyway);
 * only the page chrome (title, button) is translated.
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "https://api.sevof.com";
const BASE = `${API_BASE_URL.replace(/\/$/, "")}/api/agent/v1`;

type Param = { name: string; type: string; required?: boolean; description: string };

type Endpoint = {
  method: "GET" | "POST";
  path: string;
  description: string;
  params?: Param[];
  body?: string;
  response?: string;
};

type Group = {
  id: string;
  title: string;
  intro: string;
  steps?: string[];
  endpoints: Endpoint[];
  statuses?: string;
  statusNote?: string;
};

const CodeBlock: React.FC<{ children: string }> = ({ children }) => (
  <pre
    dir="ltr"
    className="bg-[#1E2A28] text-[#E8E5DC] text-xs sm:text-[13px] leading-relaxed rounded-lg p-4 overflow-x-auto"
  >
    <code>{children}</code>
  </pre>
);

const Section: React.FC<{ id?: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="space-y-3 scroll-mt-20">
    <h2 className="text-base font-bold text-[#1E2A28]">{title}</h2>
    {children}
  </section>
);

/** The curl sample is built from method, path and body so it always matches the docs. */
const curlFor = ({ method, path, body }: Endpoint) => {
  const url = `${BASE}${path.replace(/\{[a-zA-Z]+\}/g, "01jc8w3k2m5n7p9q4r6s8t0v2x")}`;
  const lines = [`curl${method === "POST" ? " -X POST" : ""} ${url}`, `  -H "X-Agent-Key: sk_agent_xxxxxxxx"`];
  if (body) lines.push(`  -H "Content-Type: application/json"`, `  -d '${body}'`);
  return lines.join(" \\\n");
};

const EndpointCard: React.FC<{ endpoint: Endpoint }> = ({ endpoint }) => {
  const { method, path, description, params, response } = endpoint;
  const methodColor = method === "GET" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700";
  return (
    <div dir="ltr" className="bg-white border border-[#DAD5C7] rounded-xl p-4 space-y-3 text-left">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-mono font-bold rounded px-2 py-0.5 ${methodColor}`}>{method}</span>
        <code className="text-sm text-[#1E2A28] break-all">{path}</code>
      </div>
      <p className="text-sm text-[#5B6560] leading-relaxed">{description}</p>
      {params && params.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[#9BA69F]">
              <tr>
                <th className="py-1.5 pr-3 font-medium">Parameter</th>
                <th className="py-1.5 pr-3 font-medium">Type</th>
                <th className="py-1.5 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE1]">
              {params.map((p) => (
                <tr key={p.name} className="align-top">
                  <td className="py-1.5 pr-3 whitespace-nowrap">
                    <code className="text-[#1E2A28]">{p.name}</code>
                    {p.required && <span className="ml-1 text-[10px] text-rose-600">required</span>}
                  </td>
                  <td className="py-1.5 pr-3 text-[#9BA69F] whitespace-nowrap">{p.type}</td>
                  <td className="py-1.5 text-[#5B6560] leading-5">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CodeBlock>{curlFor(endpoint)}</CodeBlock>
      {response && <CodeBlock>{response}</CodeBlock>}
    </div>
  );
};

const GROUPS: Group[] = [
  {
    id: "articles",
    title: "Articles",
    intro: "Generate blog articles with the site's agent settings (model, tone, images and publishing) and read the generated articles.",
    steps: ["Create an article generation task", "Poll the task status every 30 seconds", "Fetch the full article with article_id"],
    endpoints: [
      {
        method: "GET",
        path: "/articles",
        description: "Lists the articles of the site this key belongs to, newest first.",
        response: `{
  "data": [
    { "id": "01jc8w3k2m5n7p9q4r6s8t0v2x", "title": "...", "slug": "...", "status": "completed", "created_at": "..." }
  ]
}`,
      },
      {
        method: "GET",
        path: "/articles/{id}",
        description: "Full details of one article, including its sections, meta fields and banner.",
      },
      {
        method: "POST",
        path: "/article-generation-tasks",
        description: "Creates a new article generation task and starts it in the background.",
        response: `{
  "id": "task_ab12cd34...",
  "status": "running"
}`,
      },
      {
        method: "GET",
        path: "/article-generation-tasks/{id}",
        description: "Task status: running, completed or failed. A completed task returns article_id; a failed one returns error.",
        response: `{
  "id": "task_ab12cd34...",
  "status": "completed",
  "article_id": "01jc8w3k2m5n7p9q4r6s8t0v2x"
}`,
      },
    ],
  },
  {
    id: "product-articles",
    title: "Product articles",
    intro: "SEO articles about your store's products: first ideas are created (each idea covers several related products), then one article per idea.",
    steps: [
      "Create ideas (POST /product-ideas) — they are built in the background",
      "Poll the idea list until status is completed",
      "Create an article from the idea you like",
      "Poll the article until it is completed",
    ],
    endpoints: [
      {
        method: "POST",
        path: "/product-ideas",
        description: "Creates a new batch of product article ideas in the background.",
        params: [
          { name: "prompt", type: "string", description: "Optional guidance for the ideas (max 500 characters)." },
          { name: "product_ids", type: "int[]", description: "Limit the ideas to these products (ids from /product-ideas/products)." },
        ],
        body: `{"prompt": "Compare the best-selling models"}`,
        response: `{
  "message": "...",
  "batch": 3
}`,
      },
      {
        method: "GET",
        path: "/product-ideas",
        description: "Ideas of the latest batch. status is the batch build status; ideas that already have an article include article_id and article_status.",
        params: [{ name: "batch", type: "int", description: "A specific batch; defaults to the latest." }],
        response: `{
  "batch": 3,
  "status": "completed",
  "data": [
    {
      "id": "01jc8w3k2m5n7p9q4r6s8t0v2x",
      "title": "...",
      "products": [{ "id": 5, "name": "...", "url": "..." }],
      "article_id": null,
      "article_status": null
    }
  ]
}`,
      },
      {
        method: "GET",
        path: "/product-ideas/products",
        description: "The site's in-stock products, to pick product_ids from.",
        params: [
          { name: "search", type: "string", description: "Search in product names." },
          { name: "category_id", type: "int", description: "Only products in this category and its subcategories." },
        ],
      },
      {
        method: "POST",
        path: "/product-ideas/{id}/article",
        description: "Creates an article from an idea. If the idea already has an article, that article is returned.",
        params: [
          { name: "article_user_prompt", type: "string", description: "Optional writing guidance (max 2000 characters)." },
          { name: "min_sections", type: "int", description: "Minimum number of sections (1–50)." },
          { name: "max_sections", type: "int", description: "Maximum number of sections (1–50)." },
          { name: "model", type: "string", description: "sevof-mini or sevof-2-pro (paid plans only). Defaults by plan." },
        ],
        body: `{"min_sections": 5, "max_sections": 8}`,
        response: `{
  "message": "...",
  "started": true,
  "article_id": "01JABC...",
  "model": "gpt-4o-mini"
}`,
      },
      {
        method: "GET",
        path: "/product-articles",
        description: "The site's product articles with generation and publishing status.",
        response: `{
  "data": [
    { "id": "01JABC...", "title": "...", "status": "completed", "publish_status": "published", "wp_permalink": "...", "shopify_url": null, "word_count": 1850 }
  ]
}`,
      },
      {
        method: "GET",
        path: "/product-articles/{id}",
        description: "Full text of a product article: sections, products per section, FAQ and meta fields.",
      },
      {
        method: "POST",
        path: "/product-articles/{id}/retry",
        description: "Resumes an article that failed or paused because credit ran out (paused_credit).",
      },
    ],
    statuses: "pending → creating_brief → creating_assignments → generating_sections → generating_meta → completed",
    statusNote: "On error the status becomes failed; when credit runs out it becomes paused_credit. Both continue with retry.",
  },
  {
    id: "product-fixes",
    title: "Product page fixes",
    intro: "Product pages are checked and suggested copy is generated for whatever is missing (description, attributes, tags, FAQ, image alt text, SEO meta…). Nothing changes on your store until you approve it.",
    steps: [
      "Fetch your products",
      "Start the check for the products you pick",
      "Poll the list until each item is ready (or skipped)",
      "Fetch the current-vs-proposed preview",
      "Approve the fields you want sent to your store",
    ],
    endpoints: [
      {
        method: "GET",
        path: "/product-fixes/products",
        description: "The site's products available for checking (paginated).",
        params: [
          { name: "search", type: "string", description: "Search in product names." },
          { name: "page", type: "int", description: "Page number." },
        ],
      },
      {
        method: "POST",
        path: "/product-fixes",
        description: "Starts checking the selected products in the background. Products with an unpublished result are not checked again (already_open). The free plan has a cap.",
        params: [{ name: "product_ids", type: "int[]", required: true, description: "Product ids (paid plans: up to 100 per run)." }],
        body: `{"product_ids": [5, 9, 12]}`,
        response: `{
  "message": "...",
  "batch": 7
}`,
      },
      {
        method: "GET",
        path: "/product-fixes",
        description: "Status of each product and the fields that were missing (missing_fields): every unpublished item plus the latest run.",
        params: [{ name: "batch", type: "int", description: "Only this run; omit to get every unpublished item." }],
        response: `{
  "batch": 7,
  "data": [
    { "id": "01jc8w3k2m5n7p9q4r6s8t0v2x", "status": "ready", "missing_fields": ["description", "faq"], "product": { "id": 5, "name": "..." } }
  ]
}`,
      },
      {
        method: "GET",
        path: "/product-fixes/{id}",
        description: "Preview of one item: current (what the page has now) and proposed (suggested value per field).",
      },
      {
        method: "POST",
        path: "/product-fixes/{id}/approve",
        description: "Approves the selected fields and sends them to your store (WordPress/WooCommerce or Shopify) in the background. Only ready items can be approved.",
        params: [
          {
            name: "fields",
            type: "string[]",
            required: true,
            description: "Any of: short_description, description, category_link, attributes, tags, faq, image_alts, seo_title, meta_description, focus_keyword. Shopify stores ignore short_description, attributes and focus_keyword.",
          },
        ],
        body: `{"fields": ["description", "faq", "meta_description"]}`,
      },
    ],
    statuses: "pending → analyzing → ready → approved → published",
    statusNote: "A product with nothing missing becomes skipped; a failed check becomes failed.",
  },
  {
    id: "refresh",
    title: "Article updates",
    intro: "Update published articles using Search Console data — both your site's older posts (through the WordPress plugin) and articles Sevof wrote. Each request creates an update that you approve or discard once it is ready.",
    steps: [
      "For older posts, sync your site's posts first",
      "Fetch the article list; reason tells you which ones are worth updating",
      "Start an update and keep its id",
      "Poll until it is ready",
      "apply to publish it on your site, or discard to drop it",
    ],
    endpoints: [
      {
        method: "POST",
        path: "/past-articles/sync",
        description: "Reads your published WordPress posts through the plugin (in the background).",
      },
      {
        method: "GET",
        path: "/past-articles",
        description: "Your site's older posts with Search Console stats and their latest update. reason explains why an update is suggested: near_first_page, declining (falling clicks) or low_ctr (many impressions, few clicks).",
        params: [
          { name: "filter", type: "string", description: "all, opportunity (worth updating), updated or not_editable." },
          { name: "search", type: "string", description: "Search in titles." },
          { name: "page", type: "int", description: "Page number." },
        ],
        response: `{
  "data": [
    {
      "id": "01jc8w3k2m5n7p9q4r6s8t0v2x", "title": "...", "url": "...", "editable": true,
      "gsc": { "clicks": 12, "impressions": 940, "position": 14.2 },
      "reason": "low_ctr",
      "refresh": null
    }
  ]
}`,
      },
      {
        method: "GET",
        path: "/past-articles/{id}",
        description: "The current text of an older post, read live from your site.",
      },
      {
        method: "POST",
        path: "/past-articles/{id}/refresh",
        description: "Creates an update for an older post. Uses credit.",
        response: `{
  "data": { "id": "01jc8w3k2m5n7p9q4r6s8t0v2x", "status": "queued" }
}`,
      },
      {
        method: "POST",
        path: "/articles/{id}/refresh",
        description: "Creates an update for a published article written by Sevof. Uses credit.",
      },
      {
        method: "GET",
        path: "/article-refreshes/{id}",
        description: "Status and result of an update: change summary, number of changed sections, and before/after text.",
        response: `{
  "data": {
    "id": "01jc8w3k2m5n7p9q4r6s8t0v2x", "status": "ready", "summary": "...",
    "changed_sections": 3, "meta_changed": true, "credit_used": 6.4
  }
}`,
      },
      {
        method: "POST",
        path: "/article-refreshes/{id}/apply",
        description: "Publishes a ready update on your site.",
      },
      {
        method: "POST",
        path: "/article-refreshes/{id}/revert",
        description: "Reverts an applied update and restores the previous text on your site.",
      },
      {
        method: "POST",
        path: "/article-refreshes/{id}/discard",
        description: "Drops a ready or failed update without publishing it.",
      },
    ],
    statuses: "queued → generating → ready → applying → applied",
    statusNote: "An update can also become failed; discard makes it discarded and revert makes it reverted.",
  },
];

const ERRORS: [string, string][] = [
  ["401", "The key is missing, invalid or revoked."],
  ["402", "Not enough credit or no active plan (code: insufficient_credit)."],
  ["403 / 404", "The item doesn't belong to this key's site or doesn't exist."],
  ["409", "A previous job is still running, or the WordPress plugin needs an update (code: plugin_outdated)."],
  ["422", "Invalid input or a missing prerequisite (e.g. no WordPress/Shopify or Search Console connection); the reason is in message."],
];

const ApiDocsPage: React.FC = () => {
  const [activeView, setActiveView] = useState<SidebarView>("api-docs" as SidebarView);
  const navigate = useNavigate();

  return (
    <Layout activeView={activeView} onChangeView={setActiveView}>
      <div className="p-3 sm:p-4 lg:p-5 max-w-3xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#1E2A28]">{t("developer.docs.title")}</h1>
            <p className="text-xs text-[#9BA69F] mt-0.5">{t("developer.docs.subtitle")}</p>
          </div>
          <button
            onClick={() => navigate("/developer/api-keys")}
            className="shrink-0 bg-[#1B6F63] text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            {t("developer.docs.createKey")}
          </button>
        </div>

        <div dir="ltr" className="space-y-6 text-left">
          <nav className="flex flex-wrap gap-2" aria-label="Documentation sections">
            {GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="text-xs font-medium rounded-full border border-[#DAD5C7] bg-white px-3 py-1.5 text-[#1B6F63] hover:border-[#1B6F63]"
              >
                {g.title}
              </a>
            ))}
            <a href="#errors" className="text-xs font-medium rounded-full border border-[#DAD5C7] bg-white px-3 py-1.5 text-[#1B6F63] hover:border-[#1B6F63]">
              Errors
            </a>
          </nav>

          <Section title="Authentication">
            <p className="text-sm text-[#5B6560] leading-relaxed">
              Send your API key with every request in one of these two forms. Create keys on the API keys page — a key
              is shown only once, when it is created, so store it somewhere safe right away. Each key can only access
              the site it was created for, and usage is billed to that account's credit.
            </p>
            <CodeBlock>{`X-Agent-Key: sk_agent_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# or, equivalently:
Authorization: Bearer sk_agent_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</CodeBlock>
          </Section>

          <Section title="Base URL">
            <CodeBlock>{BASE}</CodeBlock>
            <p className="text-sm text-[#5B6560] leading-relaxed">
              POST bodies are JSON (<code>Content-Type: application/json</code>). Long jobs (articles, ideas, product
              checks and updates) run in the background: the request answers <code>202</code> right away and you poll
              the status about every 30 seconds.
            </p>
          </Section>

          {GROUPS.map((group) => (
            <Section key={group.id} id={group.id} title={group.title}>
              <p className="text-sm text-[#5B6560] leading-relaxed">{group.intro}</p>
              {group.steps && (
                <ol className="list-decimal pl-5 space-y-1 text-sm text-[#3D453F]">
                  {group.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              )}
              {group.statuses && (
                <div className="text-xs text-[#5B6560] leading-6 space-y-1">
                  <p className="font-bold text-[#3D453F]">Statuses:</p>
                  <code className="block bg-white border border-[#DAD5C7] rounded-lg px-3 py-2 text-[#1E2A28] overflow-x-auto whitespace-nowrap">
                    {group.statuses}
                  </code>
                  {group.statusNote && <p>{group.statusNote}</p>}
                </div>
              )}
              {group.endpoints.map((e) => (
                <EndpointCard key={`${e.method} ${e.path}`} endpoint={e} />
              ))}
            </Section>
          ))}

          <Section id="errors" title="Errors">
            <p className="text-sm text-[#5B6560]">Every error explains the reason in plain language in <code>message</code>:</p>
            <CodeBlock>{`{
  "message": "You don't have enough credit left.",
  "code": "insufficient_credit"
}`}</CodeBlock>
            <div className="bg-white border border-[#DAD5C7] rounded-xl divide-y divide-[#EFEBE1]">
              {ERRORS.map(([code, text]) => (
                <div key={code} className="flex gap-3 px-4 py-2.5 text-sm">
                  <code className="shrink-0 w-16 font-bold text-[#1E2A28]">{code}</code>
                  <span className="text-[#5B6560]">{text}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Notes">
            <ul className="list-disc pl-5 space-y-1 text-sm text-[#5B6560]">
              <li>Ids are 26-character strings, not numbers. Older numeric ids are still accepted, but use the new ids. Product ids (product_ids) are numbers.</li>
              <li>Revoking a key cuts off its access immediately.</li>
              <li>Publishing (articles, product changes, article updates) goes through the WordPress or Shopify connection you set up in the app.</li>
              <li>Nothing changes on a product page or a published article until you call approve or apply.</li>
            </ul>
          </Section>
        </div>
      </div>
    </Layout>
  );
};

export default ApiDocsPage;
