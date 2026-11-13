import { env } from "../env";
// src/services/api.ts
import axios from "axios";
import { t, getLang } from "../i18n";
import type {
  ApiResponse,
  AuthTokenResponseData,
  GoogleAuthRequest,
  MeResponseData,
  PaginatedResponse,
  SendOtpRequest,
  ShowSiteResponseData,
  Site,
  StoreSiteRequest,
  StoreSiteResponseData,
  VerifyOtpRequest,
  WebsiteEntity,
  ArticleIdea,
  // SiteKeywordTrendQuery,
  // SiteKeywordTrendRisingQuery,
  // SiteKeywordTrend,
  SiteKeywordTrendsResponseData,
  AnalyzeSiteKeywordsResponseData,
  // KeywordAnalysisStatus,
   Article,
  ArticleGenerateResponse,
  ArticleListItem,
  DashboardData,
  AgentSetting,
  UpdateAgentSettingPayload,
  ContentChatSession,
  ContentChatSessionMessage,
  ContentChatSessionMessagePayload,
} from "../types";

// ─── Axios Instance ───────────────────────────────────────────────────────────
// ─── Token Storage ────────────────────────────────────────────────────────────
// همه‌ی دسترسی‌ها به توکن فقط از همین‌جا انجام می‌شود.
// از localStorage استفاده می‌کنیم تا بعد از بستن مرورگر هم لاگین بماند.
 
const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "user";
 
export const tokenStorage = {
  get: (): string | null => {
    try {
      const local = localStorage.getItem(AUTH_TOKEN_KEY);
      if (local) return local;
 
      // مهاجرت: کاربرانی که همین الان با نسخه‌ی قبلی لاگین‌اند (sessionStorage)
      const legacy = sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (legacy) {
        localStorage.setItem(AUTH_TOKEN_KEY, legacy);
        const legacyUser = sessionStorage.getItem(AUTH_USER_KEY);
        if (legacyUser) localStorage.setItem(AUTH_USER_KEY, legacyUser);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_USER_KEY);
        return legacy;
      }
      return null;
    } catch {
      // مثلاً وقتی مرورگر دسترسی به storage را بسته باشد
      return null;
    }
  },
 
  set: (token: string, user?: unknown): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      if (user !== undefined && user !== null) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }
    } catch {
      // اگر ذخیره نشد، فقط لاگین ماندگار نمی‌شود؛ برنامه نباید کرش کند
    }
  },
 
  getUser: <T = unknown>(): T | null => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
 
  clear: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
    } catch {
      /* ignore */
    }
  },
};
 
// ─── Axios Instance ───────────────────────────────────────────────────────────
 
const api = axios.create({
  baseURL: env("VITE_API_BASE_URL") || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});
 
// درخواست: توکن را از tokenStorage می‌خواند و به هدر اضافه می‌کند
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // زبان رابط کاربری را به بک‌اند می‌فرستیم تا پیام‌ها و محتوا به همان زبان برگردند
  config.headers["Accept-Language"] = getLang();
  return config;
});
 
// صفحه‌هایی که بدون لاگین در دسترس‌اند؛ روی این‌ها نباید ریدایرکت به /login بشود
const PUBLIC_PATHS = ["/login", "/admin-login", "/impersonate"];
 
// درخواست‌های ورود (OTP، ایمیل، گوگل، ادمین): ۴۰۱ اینجا یعنی «اطلاعات اشتباه است»،
// نه «توکن منقضی شده»؛ پس نباید کاربر ریدایرکت شود.
const isLoginAttempt = (url?: string): boolean => {
  if (!url || !url.includes("/auth/")) return false;
  return !url.includes("/auth/me") && !url.includes("/auth/logout");
};
 
// پاسخ: اگر ۴۰۱ بود (توکن منقضی/نامعتبر)، توکن را پاک می‌کند و به login می‌فرستد
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !isLoginAttempt(error.config?.url) &&
      !PUBLIC_PATHS.includes(window.location.pathname)
    ) {
      tokenStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
 
// تابع کمکی مشترک برای همه‌ی سرویس‌ها تا هندل خطا یکجا و یکدست باشه؛
// اگه بعداً فرمت خطای بک‌اند عوض شد، فقط همینجا رو تغییر بده کافیه.
async function request<T>(promise: Promise<{ data: any }>): Promise<ApiResponse<T>> {
  try {
    const response = await promise;
    return { success: true, data: response.data as T, message: response.data?.message };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || t("common.errors.generic"),
      data: error.response?.data,
      errors: error.response?.data?.errors,
      error: error.message,
      status: error.response?.status,
    };
  }
}
 
// ذخیره‌ی توکن و کاربر بعد از لاگین موفق (OTP، Google، ایمیل، ادمین، impersonate)
function persistAuth(data: AuthTokenResponseData) {
  tokenStorage.set(data.token, data.user);
}
 
// ─── Auth Service ─────────────────────────────────────────────────────────────
 
type EmailLoginResponseData = {
  status: "login" | "verification_required";
  message: string;
  token?: string;
  token_type?: string;
  user?: unknown;
};

// مهم: این فایل standalone نیست. typeها را به src/services/api اضافه کنید و اگر contentResearchService از قبل وجود دارد،
// خودِ شیء قبلی را کامل با نسخه زیر جایگزین کنید؛ صرفاً ساختن فایل جدا باعث نمی‌شود import صفحه تحلیل به آن متصل شود.

export type ContentResearchType = "keyword_clusters" | "competitor_gaps";
export type ContentResearchStatus = "queued" | "processing" | "done" | "failed";

export type KeywordClusterResult = {
  id: number;
  name: string;
  primary_keyword: string;
  related_keywords: string[];
  search_intent: "informational" | "commercial" | "transactional" | "navigational";
  estimated_search_volume: number;
  volume_label: "low" | "medium" | "high" | "observed_impressions" | "assistant_estimate";
  trend_direction: "up" | "stable" | "down" | "unavailable" | "estimated";
  trend_percentage: number | null;
  difficulty: "low" | "medium" | "high" | "unavailable" | `estimated:${number}`;
  opportunity_score: number;
  competitor_count: number;
  data_source: "demo" | string;
  evidence: Record<string, unknown>;
};

export type ResearchCompetitor = {

  id: number;
  domain: string | null;
  display_name: string;
  best_position: number | null;
  visibility_score: number;
  threat_level: "low" | "medium" | "high";
  threat_score: number;
  data_source: "demo" | string;
  evidence: Record<string, unknown>;
};

export type ContentGapResult = {
  id: number;
  query: string;
  title: string;
  gap_type: "topic" | "position" | "format" | "intent" | "freshness" | "trust";
  description: string;
  recommended_angle: string;
  opportunity_score: number;
  threat_level: "low" | "medium" | "high";
  competitor: string | null;
  data_source: "demo" | string;
  evidence: Record<string, unknown>;
};

export type ContentResearchSession = {

  id: string;
  type: ContentResearchType;
  status: ContentResearchStatus;
  prompt: string | null;
  data_source: "demo" | string;
  error: string | null;
  completed_at: string | null;
  created_at: string | null;
  manus_task_id?: string | null;
  manus_task_url?: string | null;
};
export type Recommendation = {
  priority?: number;
  title: string;
  action: string;
  expected_result?: string;
  related_keywords?: string[];
};

export type ContentResearchResult = {
  clusters?: KeywordClusterResult[];
  competitors?: ResearchCompetitor[];
  gaps?: ContentGapResult[];
  summary?: string | null;
  site_analysis?: {
    status?: string;
    pages_reviewed?: string[];
    strengths?: string[];
    weaknesses?: string[];
  };
  recommendations?: Recommendation[];   // ⬅️ به‌جای string[]
  manus_task_id?: string | null;
  manus_task_url?: string | null;
};

export type ContentResearchResponse = {
  session: ContentResearchSession;
  result: ContentResearchResult | null;
};

export type ContentResearchLatestResponse = {
  session: ContentResearchSession | null;
  result: ContentResearchResult | null;
};

export type ContentResearchListResponse = {

  sessions: ContentResearchSession[];
};

export type ContentChatSessionResponse = {
  session: ContentChatSession;
};

export type ContentChatSessionListResponse = {
  sessions: ContentChatSession[];
};

export type ContentChatSessionMessageResponse = {
  message: ContentChatSessionMessage;
  session?: ContentChatSession;
};

export const contentChatSessionService = {
  list: (siteId: number | string): Promise<ApiResponse<ContentChatSessionListResponse>> =>
    request(api.get(`/api/v1/sites/${siteId}/chat-sessions`)),

  create: (
    siteId: number | string,
payload?: { title?: string | null; kind?: "analysis" | "product" },  ): Promise<ApiResponse<ContentChatSessionResponse>> =>
    request(api.post(`/api/v1/sites/${siteId}/chat-sessions`, payload ?? {})),

  firstMessage: (
    siteId: number | string,
    payload: ContentChatSessionMessagePayload,
  ): Promise<ApiResponse<ContentChatSessionMessageResponse>> =>
    request(api.post(`/api/v1/sites/${siteId}/chat-sessions/first-message`, payload)),

  show: (
    siteId: number | string,
    sessionId: number | string,
  ): Promise<ApiResponse<ContentChatSessionResponse>> =>
    request(api.get(`/api/v1/sites/${siteId}/chat-sessions/${sessionId}`)),

  addMessage: (
    siteId: number | string,
    sessionId: number | string,
    payload: ContentChatSessionMessagePayload,
  ): Promise<ApiResponse<ContentChatSessionMessageResponse>> =>
    request(api.post(`/api/v1/sites/${siteId}/chat-sessions/${sessionId}/messages`, payload)),

  updateMessage: (
    siteId: number | string,
    sessionId: number | string,
    messageId: number | string,
    payload: Partial<Pick<ContentChatSessionMessagePayload, "answered" | "batch" | "article_id" | "content_research_session_id" | "metadata">>,
  ): Promise<ApiResponse<{ message: ContentChatSessionMessage }>> =>
    request(api.patch(`/api/v1/sites/${siteId}/chat-sessions/${sessionId}/messages/${messageId}`, payload)),
};

export const contentResearchService = {
  list: (
    siteId: number | string,
  ): Promise<ApiResponse<ContentResearchListResponse>> => {
    return request(api.get(`/api/v1/sites/${siteId}/content-research`));
  },

  create: (
    siteId: number | string,
    payload: { type: ContentResearchType; prompt?: string },
  ): Promise<ApiResponse<ContentResearchResponse>> => {
    return request(api.post(`/api/v1/sites/${siteId}/content-research`, payload));
  },

  show: (
    siteId: number | string,
    sessionId: number | string,
  ): Promise<ApiResponse<ContentResearchResponse>> => {
    return request(api.get(`/api/v1/sites/${siteId}/content-research/${sessionId}`));
  },

  latest: (
    siteId: number | string,
    type: ContentResearchType,
  ): Promise<ApiResponse<ContentResearchLatestResponse>> => {
    return request(api.get(`/api/v1/sites/${siteId}/content-research/latest/${type}`));
  },
};

// مهم: این typeها و شیء را به همان فایل واقعی src/services/api اضافه کنید.
// اگر searchConsoleService قبلاً وجود دارد، خود شیء قبلی را کامل با نسخه زیر جایگزین کنید.

export type SearchConsoleProperty = {
  id: number;
  property_url: string;
  permission_level: string | null;
  sync_status: "idle" | "queued" | "syncing" | "done" | "failed";
  last_synced_at: string | null;
  last_sync_error: string | null;
};

export type SearchConsoleQuery = {
  query: string;
  page: string | null;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number | null;
  start_date: string;
  end_date: string;
  fetched_at: string;
};

export type SearchConsoleStatus = {
  connection: {
    status: "connected" | "expired" | "failed";
    last_error: string | null;
    email: string | null;
  } | null;
  property: SearchConsoleProperty | null;
};

export const searchConsoleService = {
  /** returnTo="automation": بعد از تأیید گوگل به داشبورد اتوماسیون همین سایت برمی‌گردد */
  connect: (siteId: number | string, returnTo?: "automation"): Promise<ApiResponse<{ authorization_url: string }>> =>
    request(api.post(`/api/v1/sites/${siteId}/search-console/connect`, returnTo ? { return_to: returnTo } : {})),

  status: (siteId: number | string): Promise<ApiResponse<SearchConsoleStatus>> =>
    request(api.get(`/api/v1/sites/${siteId}/search-console`)),

  properties: (siteId: number | string): Promise<ApiResponse<{ properties: Array<{ property_url: string; permission_level: string | null }> }>> =>
    request(api.get(`/api/v1/sites/${siteId}/search-console/properties`)),

  selectProperty: (siteId: number | string, propertyUrl: string): Promise<ApiResponse<{ property: SearchConsoleProperty }>> =>
    request(api.put(`/api/v1/sites/${siteId}/search-console/property`, { property_url: propertyUrl })),

  sync: (siteId: number | string): Promise<ApiResponse<{ property: SearchConsoleProperty }>> =>
    request(api.post(`/api/v1/sites/${siteId}/search-console/sync`)),

  queries: (siteId: number | string): Promise<ApiResponse<{ queries: SearchConsoleQuery[] }>> =>
    request(api.get(`/api/v1/sites/${siteId}/search-console/queries`)),

  disconnect: (siteId: number | string): Promise<ApiResponse<{ message: string }>> =>
    request(api.delete(`/api/v1/sites/${siteId}/search-console`)),

  /** Fully disconnect the Google account (for all sites) so a different one can be connected */
  disconnectAccount: (siteId: number | string): Promise<ApiResponse<{ message: string }>> =>
    request(api.delete(`/api/v1/sites/${siteId}/search-console/account`)),
};

// ─── نتیجه‌ی سرچ کنسول و به‌روزرسانی مقاله‌ها (داشبورد اتوماسیون) ─────────────

export type GscTotals = { clicks: number; impressions: number; ctr: number; position: number | null };

export type GscArticleRow = {
  id: number | string;
  type: "article" | "product_article";
  title: string;
  url: string | null;
  clicks: number;
  previous_clicks: number | null;
  impressions: number;
  ctr: number;
  position: number | null;
  previous_position: number | null;
  top_query: string | null;
};

export type RefreshReason = "near_first_page" | "declining" | "low_ctr" | "manual";

export type RefreshStatus = "queued" | "generating" | "ready" | "applying" | "applied" | "reverted" | "discarded" | "failed";

/** مرحله‌ی زنده‌ی ساخت/انتشار به‌روزرسانی */
export type RefreshStage = "reading" | "writing" | "checking" | "publishing" | null;

export type RefreshOpportunity = GscArticleRow & {
  reason: RefreshReason;
  potential_clicks: number;
  estimate: { min: number; max: number };
};

export type ArticleRefreshSummary = {
  id: string;
  article_id: string | null;
  article_title: string | null;
  status: RefreshStatus;
  stage: RefreshStage;
  stage_started_at: string | null;
  trigger: "manual" | "agent";
  reason: RefreshReason;
  summary: string | null;
  metrics: Partial<GscArticleRow> & { potential_clicks?: number | null } | null;
  credit_used: number;
  changed_sections: number;
  meta_changed: boolean;
  /** تعداد لینک داخلی تازه */
  new_links?: number;
  error: string | null;
  created_at: string | null;
  applied_at: string | null;
};

/** لینک داخلی تازه‌ای که به‌روزرسانی به یک صفحه‌ی دیگرِ همین سایت داده؛ n شماره‌ی تغییری است که در آن نشسته */
export type RefreshNewLink = {
  n: number;
  anchor: string;
  url: string;
  title: string;
  kind: "youtix" | "product" | "post";
  section: string;
};

export type ArticleRefreshDetail = ArticleRefreshSummary & {
  links?: RefreshNewLink[];
  /** مقاله‌ی یوتیکس Markdown است؛ پست قدیمی سایت HTML خام وردپرس */
  format: "markdown" | "html";
  queries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number | null }>;
  meta: {
    before: { meta_title?: string | null; meta_description?: string | null };
    after: { meta_title?: string | null; meta_description?: string | null };
  };
  sections: Array<{ id: number; heading: string; instruction: string | null; before: string; after: string }>;
  /** کل مقاله به ترتیب؛ در بخش تغییرکرده پاراگراف‌های عوض‌شده با data-yx-edit / data-yx-n برجسته‌اند */
  document?: Array<{ id: number; heading: string; html: string; before_html: string; changed: boolean }>;
  edits?: Array<{ n: number; action: "replace" | "insert_after"; why: string; before: string | null; after: string; section: string }>;
};

export type SearchConsoleInsights = {
  connection: { status: "connected" | "expired" | "failed"; last_error: string | null; email: string | null } | null;
  property: {
    property_url: string;
    sync_status: SearchConsoleProperty["sync_status"];
    last_synced_at: string | null;
    last_sync_error: string | null;
  } | null;
  site_totals: { start_date: string; end_date: string; current: GscTotals; previous: GscTotals } | null;
  articles: {
    count: number;
    with_data: number;
    clicks: number;
    previous_clicks: number | null;
    impressions: number;
    previous_impressions: number | null;
    items: GscArticleRow[];
  };
  opportunities: RefreshOpportunity[];
  /** جستجوهایی که سایت در گوگل دیده می‌شود ولی هنوز صفحه‌ی خوبی برایشان ندارد (موضوع مقاله‌ی تازه) */
  query_opportunities?: Array<{ query: string; impressions: number; clicks: number; best_position: number; question: boolean }>;
  refreshes: ArticleRefreshSummary[];
  automation: { agent_enabled: boolean; refresh_enabled: boolean; auto_publish: boolean; has_paid_plan: boolean };
};

export const searchConsoleInsightsService = {
  get: (siteId: number | string): Promise<ApiResponse<SearchConsoleInsights>> =>
    request(api.get(`/api/v1/sites/${siteId}/search-console/insights`)),

  startRefresh: (siteId: number | string, articleId: number | string): Promise<ApiResponse<{ data: ArticleRefreshSummary }>> =>
    request(api.post(`/api/v1/sites/${siteId}/articles/${articleId}/refresh`)),

  getRefresh: (siteId: number | string, refreshId: string): Promise<ApiResponse<{ data: ArticleRefreshDetail }>> =>
    request(api.get(`/api/v1/sites/${siteId}/article-refreshes/${refreshId}`)),

  applyRefresh: (siteId: number | string, refreshId: string): Promise<ApiResponse<{ data: ArticleRefreshSummary }>> =>
    request(api.post(`/api/v1/sites/${siteId}/article-refreshes/${refreshId}/apply`)),

  revertRefresh: (siteId: number | string, refreshId: string): Promise<ApiResponse<{ data: ArticleRefreshSummary }>> =>
    request(api.post(`/api/v1/sites/${siteId}/article-refreshes/${refreshId}/revert`)),

  discardRefresh: (siteId: number | string, refreshId: string): Promise<ApiResponse<{ data: ArticleRefreshSummary }>> =>
    request(api.post(`/api/v1/sites/${siteId}/article-refreshes/${refreshId}/discard`)),
};

// ─── آپدیت مقاله‌های گذشته (پست‌های قدیمی خود سایت) ─────────────────────────

export type PastArticleFilter = "all" | "needs_update" | "opportunity" | "updated" | "not_editable";

/** ایرادی که بررسی خودکار سئو در مقاله پیدا کرده */
export type SeoIssue = {
  code: "outdated_year_title" | "no_internal_links" | "weak_internal_links" | "outdated_year_text" | "thin_content" | "no_headings" | "stale";
  severity: "high" | "medium";
  label: string;
  detail: string;
};

/** نتیجه‌ی بررسی سئوی متن؛ وقتی audited=false یعنی متن هنوز خوانده نشده و لینک‌ها نامعلوم‌اند */
export type SeoAudit = {
  issues: SeoIssue[];
  internal_links: number | null;
  recommended_links: number | null;
  audited: boolean;
};

export type PastArticle = SeoAudit & {
  id: string;
  /** فرصت در گوگل یا ایراد جدی سئو */
  needs_update: boolean;
  title: string;
  url: string;
  published_at: string | null;
  modified_at: string | null;
  word_count: number | null;
  editable: boolean;
  not_editable_message: string | null;
  gsc: { clicks: number; previous_clicks: number | null; impressions: number; ctr: number; position: number | null; top_query: string | null } | null;
  reason: RefreshReason | null;
  potential_clicks: number | null;
  estimate: { min: number; max: number } | null;
  refresh: {
    id: string;
    status: RefreshStatus;
    stage: RefreshStage;
    stage_started_at: string | null;
    credit_used: number;
    changed_sections: number;
    meta_changed: boolean;
    error: string | null;
    created_at: string | null;
    applied_at: string | null;
  } | null;
};

export type PastArticlesResponse = {
  connection: { type: "wordpress" | "shopify" | null; plugin_version: string | null; min_plugin_version: string };
  sync: {
    status: "queued" | "syncing" | "done" | "failed" | "outdated" | null;
    synced_at: string | null;
    error: string | null;
    /** تعداد کل مقاله‌های سایت و تعدادی که تا الان خوانده شده */
    total: number | null;
    fetched: number | null;
  } | null;
  search_console_connected: boolean;
  counts: Record<PastArticleFilter, number>;
  items: PastArticle[];
  page: number;
  pages: number;
  total: number;
};

export type PastArticleContent = SeoAudit & {
  id: string;
  title: string;
  url: string;
  content: string;
  editable: boolean;
  not_editable_message: string | null;
  seo: { plugin: string | null; meta_title: string | null; meta_description: string | null };
};

export const pastArticlesService = {
  /** متن کامل و زنده‌ی مقاله از سایت */
  show: (siteId: number | string, postId: string): Promise<ApiResponse<{ data: PastArticleContent }>> =>
    request(api.get(`/api/v1/sites/${siteId}/past-articles/${postId}`)),

  list: (siteId: number | string, params: { filter?: PastArticleFilter; search?: string; page?: number }): Promise<ApiResponse<PastArticlesResponse>> =>
    request(api.get(`/api/v1/sites/${siteId}/past-articles`, { params })),

  sync: (siteId: number | string): Promise<ApiResponse<{ message: string }>> =>
    request(api.post(`/api/v1/sites/${siteId}/past-articles/sync`)),

  startRefresh: (siteId: number | string, postId: string): Promise<ApiResponse<{ data: { id: string; status: RefreshStatus } }>> =>
    request(api.post(`/api/v1/sites/${siteId}/past-articles/${postId}/refresh`)),
};

// ─── کسب درآمد با معرفی (فعلاً فقط ثبت درخواست همکاری) ─────────────────────────

export type ReferralStatus = "pending" | "approved" | "rejected";

export type ReferralRequestItem = {
  id: number;
  status: ReferralStatus;
  phone: string;
  channels: string[];
  audience_size: string | null;
  description: string;
  created_at: string | null;
};

export type ReferralInfo = {
  request: ReferralRequestItem | null;
  default_phone: string | null;
  channels: Record<string, string>;
  audience_sizes: Record<string, string>;
};

export type ReferralPayload = { phone: string; channels: string[]; audience_size: string | null; description: string };

export const referralService = {
  get: (): Promise<ApiResponse<ReferralInfo>> => request(api.get("/api/v1/referral-request")),

  submit: (payload: ReferralPayload): Promise<ApiResponse<{ message: string; request: ReferralRequestItem }>> =>
    request(api.post("/api/v1/referral-request", payload)),
};

/** تصویر مقاله به‌صورت فایل WebP (فایل‌های /storage هدر CORS ندارند، پس تبدیل سمت سرور است) */
export const imageService = {
  webp: (url: string): Promise<Blob> =>
    api.get("/api/v1/images/webp", { params: { url }, responseType: "blob" }).then((res) => res.data as Blob),
};


// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * بررسی وجود توکن ذخیره‌شده (localStorage)
   * اعتبار واقعی توکن را بک‌اند با ۴۰۱ مشخص می‌کند.
   */
  isAuthenticated: (): boolean => {
    return Boolean(tokenStorage.get());
  },
 
  /**
   * ورود/ثبت‌نام با ایمیل و پسورد
   * POST /api/v1/auth/email/login
   * اگر status === "login" باشد توکن همین‌جا ذخیره می‌شود.
   */
  sendEmailLogin: async (
    payload: { email: string; password: string }
  ): Promise<ApiResponse<EmailLoginResponseData>> => {
    const result = await request<EmailLoginResponseData>(
      api.post("/api/v1/auth/email/login", payload)
    );
    if (result.success && result.data?.status === "login" && result.data.token) {
      tokenStorage.set(result.data.token, result.data.user);
    }
    return result;
  },
 
  /**
   * تأیید کد ایمیل
   * POST /api/v1/auth/email/verify
   */
  verifyEmail: async (
    payload: { email: string; code: string }
  ): Promise<ApiResponse<AuthTokenResponseData>> => {
    const result = await request<AuthTokenResponseData>(
      api.post("/api/v1/auth/email/verify", payload)
    );
    if (result.success && result.data) {
      persistAuth(result.data);
    }
    return result;
  },
 
  exchangeImpersonate: async (
    code: string
  ): Promise<ApiResponse<AuthTokenResponseData>> => {
    const result = await request<AuthTokenResponseData>(
      api.post("/api/v1/auth/admin/impersonate/exchange", { code })
    );
    if (result.success && result.data) {
      persistAuth(result.data);
    }
    return result;
  },
 
  adminLogin: async (
    payload: { phone: string; password: string }
  ): Promise<ApiResponse<AuthTokenResponseData>> => {
    const result = await request<AuthTokenResponseData>(
      api.post("/api/v1/auth/admin/login", payload)
    );
    if (result.success && result.data) {
      persistAuth(result.data);
    }
    return result;
  },
 
  impersonate: async (
    payload: { phone: string }
  ): Promise<ApiResponse<AuthTokenResponseData>> => {
    const result = await request<AuthTokenResponseData>(
      api.post("/api/v1/auth/admin/impersonate", payload)
    );
    if (result.success && result.data) {
      persistAuth(result.data);
    }
    return result;
  },
 
  /**
   * ارسال کد تأیید به شماره موبایل
   * POST /api/v1/auth/otp/send
   */
  sendOtp: (payload: SendOtpRequest): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post("/api/v1/auth/otp/send", payload));
  },
 
  /**
   * تأیید کد OTP و ورود
   * POST /api/v1/auth/otp/verify
   */
  verifyOtp: async (
    payload: VerifyOtpRequest
  ): Promise<ApiResponse<AuthTokenResponseData>> => {
    const result = await request<AuthTokenResponseData>(
      api.post("/api/v1/auth/otp/verify", payload)
    );
    if (result.success && result.data) {
      persistAuth(result.data);
    }
    return result;
  },
 
  /**
   * ورود با گوگل
   * POST /api/v1/auth/google
   */
  loginWithGoogle: async (
    payload: GoogleAuthRequest
  ): Promise<ApiResponse<AuthTokenResponseData>> => {
    const result = await request<AuthTokenResponseData>(
      api.post("/api/v1/auth/google", payload)
    );
    if (result.success && result.data) {
      persistAuth(result.data);
    }
    return result;
  },
 
  /**
   * گرفتن اطلاعات کاربر جاری
   * GET /api/v1/auth/me
   */
  me: (): Promise<ApiResponse<MeResponseData>> => {
    return request(api.get("/api/v1/auth/me"));
  },
 
  /**
   * خروج — حذف توکن از سرور و از storage
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      await api.post("/api/v1/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },
};


// ─── Site Service ──────────────────────────────────────────────────────────────

// --- اضافه به src/services/api.ts ---
export interface Announcement {
  id: number;
  title: string;
  body: string;
  updated_at: string;
}
 
/** GET /api/v1/announcements */
export interface AnnouncementsResponseData {
  has_announcement: boolean;
  announcements: Announcement[];
}
 
export const announcementService = {
  /**
   * اطلاعیه‌های مربوط به کاربر لاگین‌شده (بر اساس اشتراک)
   * GET /api/v1/announcements
   */
  list: (): Promise<ApiResponse<AnnouncementsResponseData>> => {
    return request(api.get("/api/v1/announcements"));
  },
};
 
// اضافه به siteService موجود:
export const siteService = {
  list: (page = 1): Promise<ApiResponse<PaginatedResponse<Site>>> => {
    return request(api.get("/api/v1/sites", { params: { page } }));
  },
destroy: (siteId: number | string): Promise<ApiResponse<unknown>> => {
  return request(api.delete(`/api/v1/sites/${siteId}`));
},

  store: (payload: StoreSiteRequest): Promise<ApiResponse<StoreSiteResponseData>> => {
    return request(api.post("/api/v1/sites", payload));
  },

  show: (siteId: number | string): Promise<ApiResponse<ShowSiteResponseData>> => {
    return request(api.get(`/api/v1/sites/${siteId}`));
  },

  /**
   * دریافت Primary Entity و Core Entities یک سایت
   * GET /api/v1/sites/{site}/entity
   */
  getEntity: (siteId: number | string): Promise<ApiResponse<{ data: WebsiteEntity | null }>> => {
    return request(api.get(`/api/v1/sites/${siteId}/entity`));
  },
};
// این بخش را در همان فایل ../../services/api جایگزین articleIdeaService فعلی کنید.
// بک‌اند فعلی می‌تواند payload را نادیده بگیرد؛ پس از تغییر بک‌اند، prompt و mode را مصرف کنید.

export type ArticleIdeaGenerationMode =
  | "trend_opportunities"
  | "keyword_clusters"
  | "content_gap";

export type ArticleIdeaGenerationRequest = {
  prompt?: string;
  mode?: ArticleIdeaGenerationMode;
  entity_name?: string;
  entity_scope?: "primary" | "core";
};

export type ArticleIdeaUpdateRequest = {
  title?: string;
  meta_description?: string | null;
  hook?: string | null;
  entity_name?: string;
  entity_scope?: "primary" | "core";
  entity_type?: string | null;
  target_url?: string | null;
  target_url_title?: string | null;
  priority?: number;
  outline?: string[] | null;
  status?: ArticleIdea["status"];
  /** true = اتوماسیون (Auto Pilot) از این ایده مقاله نمی‌سازد؛ تولید دستی مجاز است */
  autopilot_excluded?: boolean;
  tags?: string[];
  related_links?: { title: string; url: string }[];
};

export type ArticleIdeaEntityOption = {
  name: string;
  scope: "primary" | "core";
  type: string | null;
  description: string;
};

export type ArticleIdeaGenerationResponse = {
  message: string;
  batch?: number;
  mode?: ArticleIdeaGenerationMode;
  action?: "select_entity";
  code?: "entity_required";
  entities?: ArticleIdeaEntityOption[];
  entity?: {
    name: string;
    scope: "primary" | "core";
    type: string | null;
  };
};



export const articleIdeaService = {
  /** لیست ایده‌های ثبت‌شده برای یک سایت */
  list: (siteId: number | string): Promise<ApiResponse<{ data: ArticleIdea[] }>> => {
    return request(api.get(`/api/v1/sites/${siteId}/article-ideas`));
  },

  /**
   * درخواست تولید ایده یا تحلیل محتوا.
   * در نسخه فعلی، این endpoint همان خروجی ایده‌ها را برمی‌گرداند؛
   * بک‌اند آینده باید prompt و mode را برای تولید پاسخ شخصی‌سازی‌شده استفاده کند.
   */
  generate: (
    siteId: number | string,
    payload: ArticleIdeaGenerationRequest = {},
  ): Promise<ApiResponse<ArticleIdeaGenerationResponse>> => {
    return request(api.post(`/api/v1/sites/${siteId}/article-ideas/generate`, payload));
  },

  /** تلاش مجدد برای ادامه فرآیند تولید ایده از همان مرحله خطا */
  retry: (siteId: number | string): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/article-ideas/retry`));
  },

  /** تغییر وضعیت یک ایده (approved / rejected / used) */
  updateStatus: (
    siteId: number | string,
    ideaId: number | string,
    status: ArticleIdea["status"],
  ): Promise<ApiResponse<{ data: ArticleIdea }>> => {
    return request(
      api.patch(`/api/v1/sites/${siteId}/article-ideas/${ideaId}/status`, { status }),
    );
  },

  update: (
    siteId: number | string,
    ideaId: number | string,
    payload: ArticleIdeaUpdateRequest,
  ): Promise<ApiResponse<{ data: ArticleIdea }>> => {
    return request(
      api.patch(`/api/v1/sites/${siteId}/article-ideas/${ideaId}`, payload),
    );
  },
};





/** وضعیت پردازش یک محصول در فلو سئو */
export type PageProductSeoStatus =
  | "pending" // در صف
  | "analyzing" // در حال بررسی نقص‌ها / تولید
  | "ready" // آماده‌ی پیش‌نمایش، ویرایش و تأیید
  | "skipped" // نقصی نداشت
  | "approved" // تأیید شد، در انتظار ارسال
  | "published" // در ووکامرس ذخیره شد
  | "failed";

/** وضعیت همگام‌سازی با ووکامرس */
export type PageProductSeoWpSyncStatus =
  | "not_synced"
  | "syncing"
  | "synced"
  | "failed";

/** فیلدهای قابل تولید، ویرایش و تأیید */
export type PageProductSeoField =
  | "short_description"
  | "description"
  | "category_link"
  | "attributes"
  | "tags"
  | "faq"
  | "image_alts"
  | "seo_title"
  | "meta_description"
  | "focus_keyword";
/**
 * منبع یک مشخصه:
 * - seller_data: از اطلاعات خود محصول
 * - ai: از دانش مدل
 * - user: کاربر دستی اضافه/تغییر داده
 */
export type PageProductSeoAttributeSource = "seller_data" | "ai" | "user";

/** یک مشخصه‌ی محصول (verified همیشه null است؛ تأیید بیرونی نداریم) */
export interface PageProductSeoAttribute {
  name: string;
  value: string;
  source: PageProductSeoAttributeSource | string;
  verified: boolean | null;
}

/** خروجی ساختاریافته‌ی AI بعد از کنترل کیفیت (فقط فیلدهای ناقص حضور دارند) */
export interface PageProductSeoResult {
  short_description?: string;
  description?: string;
  /** توضیحات فعلی به دسته‌ی محصول لینک نمی‌دهد؛ با تأیید، فقط همین لینک به توضیحات اضافه می‌شود */
  category_link?: { name: string; url: string };
  attributes?: PageProductSeoAttribute[];
  seo_title?: string;
  meta_description?: string;
  tags?: string[];
faq?: { question: string; answer: string }[];
image_alts?: { id: number; alt: string }[];
focus_keyword?: string;
  /** مواردی که باید فروشنده تکمیل کند (مثلاً ابعاد) */
  needs_seller_input: string[];
  /** عددهای داخل متن که در اطلاعات فعلی محصول نبودند (فقط هشدار) */
  unproven_numbers?: string[];
  /** سازگاری با نسخه‌های قبل؛ همیشه خالی است */
  rejected_attributes?: PageProductSeoAttribute[];
  /** فیلدهایی که کاربر دستی ویرایش کرده (برای برچسب «ویرایش‌شده») */
  edited_fields?: PageProductSeoField[];
  /** مقدار اولیه‌ی AI برای هر فیلد ویرایش‌شده (برای «بازگردانی») */
  original?: {
    short_description?: string;
    description?: string;
    seo_title?: string;
    meta_description?: string;
    attributes?: PageProductSeoAttribute[];
  };
}

/** یک ردیف لیست */
export interface PageProductSeoItem {
  id: string;
  status: PageProductSeoStatus;
  error: string | null;
  /** ایرادهای پیدا شده (فیلدهای خالی)؛ قبل از باز کردن پیش‌نمایش هم در لیست نمایش داده می‌شود */
  missing_fields: PageProductSeoField[];
  wp_sync_status: PageProductSeoWpSyncStatus;
  publish_error: string | null;
  product: {
    id: number | null;
    name: string | null;
    url: string | null;
  };
}

/** جزئیات پیش‌نمایش (فعلی در برابر پیشنهادی) */
export interface PageProductSeoDetail {
  id: string;
  status: PageProductSeoStatus;
  error: string | null;
  /** دیگر سرچ نداریم؛ همیشه false (یا null برای ردیف‌های قدیمی) */
  needs_search: boolean | null;
  missing_fields: PageProductSeoField[] | null;
  /** همیشه خالی (سرچ حذف شده)؛ برای سازگاری نگه داشته شده */
  sources: string[];
  current: {
    short_description: string | null;
    description: string | null;
  };
  proposed: PageProductSeoResult | null;
  wp_sync_status: PageProductSeoWpSyncStatus;
  publish_error: string | null;
}

export interface PageProductSeoStartRequest {
  /** حداکثر ۱۰۰ محصول */
  product_ids: number[];
}

export interface PageProductSeoStartResponse {
  message: string;
  batch: number;
  /** محصولات تازه‌ی این نوبت */
  added?: number;
  /** محصولاتی که نتیجه‌ی منتشرنشده داشتند و دوباره پردازش نشدند */
  already_open?: number;
}

export interface PageProductSeoListResponse {
  batch: number;
  data: PageProductSeoItem[];
}

/** ویرایش دستی: فقط فیلدهای تغییرکرده را بفرست */
export interface PageProductSeoUpdateRequest {
  short_description?: string;
  description?: string;
  seo_title?: string;
  meta_description?: string;
    tags?: string[];
  faq?: { question: string; answer: string }[];
  image_alts?: { id: number; alt: string }[];
  focus_keyword?: string;

  /** کل لیست مشخصاتی که باید منتشر شود (جایگزین لیست قبلی می‌شود) */
  attributes?: Pick<PageProductSeoAttribute, "name" | "value">[];
  /** برگرداندن فیلدها به مقدار اولیه‌ی AI (فقط فیلدهایی که قبلاً ویرایش شده‌اند) */
  revert?: PageProductSeoField[];
}

export interface PageProductSeoUpdateResponse {
  message: string;
  /** نتیجه‌ی به‌روزشده؛ state پیش‌نمایش را با آن جایگزین کن */
  data: { proposed: PageProductSeoResult };
}

export interface PageProductSeoApproveRequest {
  /** فقط فیلدهایی که کاربر تأیید کرده */
  fields: PageProductSeoField[];
}

/** محصول در لیست انتخاب (از جدول محصولات همگام‌سازی‌شده‌ی سایت) */
export interface PageProductSeoPickerProduct {
  id: number;
  name: string;
  url: string | null;
  price: number | null;
  /** IRR (ریال) یا IRT (تومان) */
  currency?: string | null;
  image: string | null;
}

export interface PageProductSeoPickerResponse {
  data: PageProductSeoPickerProduct[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

/** سقف‌ها، هم‌راستا با اعتبارسنجی بک‌اند (برای شمارنده‌ی کاراکتر در فرم) */
export const PAGE_PRODUCT_SEO_LIMITS = {
  short_description: 1000,
  description: 20000,
  seo_title: 70,
  meta_description: 160,
  attributes: 30,
  attribute_name: 100,
  attribute_value: 500,
  
} as const;

export const pageProductSeoService = {
  /** لیست نتایج یک batch (پیش‌فرض: آخرین batch سایت) */
  list: (
    siteId: number | string,
    batch?: number,
  ): Promise<ApiResponse<PageProductSeoListResponse>> => {
    return request(
      api.get(`/api/v1/sites/${siteId}/page-product-seo`, {
        params: batch !== undefined ? { batch } : undefined,
      }),
    );
  },
 
  /** محصولات همگام‌سازی‌شده‌ی سایت برای انتخاب (جستجو + صفحه‌بندی) */
  products: (
    siteId: number | string,
    params: { search?: string; page?: number } = {},
  ): Promise<ApiResponse<PageProductSeoPickerResponse>> => {
    return request(
      api.get(`/api/v1/sites/${siteId}/page-product-seo/products`, { params }),
    );
  },
 
  /** شروع بهینه‌سازی سئو برای محصولات انتخاب‌شده (پردازش در پس‌زمینه، پاسخ 202) */
  start: (
    siteId: number | string,
    payload: PageProductSeoStartRequest,
  ): Promise<ApiResponse<PageProductSeoStartResponse>> => {
    return request(api.post(`/api/v1/sites/${siteId}/page-product-seo`, payload));
  },
 
  /** پیش‌نمایش یک محصول: اطلاعات فعلی در برابر نتیجه‌ی پیشنهادی */
  show: (
    siteId: number | string,
    optimizationId: number | string,
  ): Promise<ApiResponse<{ data: PageProductSeoDetail }>> => {
    return request(
      api.get(`/api/v1/sites/${siteId}/page-product-seo/${optimizationId}`),
    );
  },
 
  /** ویرایش دستی نتیجه‌ی پیشنهادی (پیش از تأیید). فقط فیلدهای تغییرکرده را بفرست */
  update: (
    siteId: number | string,
    optimizationId: number | string,
    payload: PageProductSeoUpdateRequest,
  ): Promise<ApiResponse<PageProductSeoUpdateResponse>> => {
    return request(
      api.patch(
        `/api/v1/sites/${siteId}/page-product-seo/${optimizationId}`,
        payload,
      ),
    );
  },
 
  /** تأیید کاربر؛ فقط فیلدهای انتخاب‌شده به ووکامرس ارسال می‌شوند (پاسخ 202) */
  approve: (
    siteId: number | string,
    optimizationId: number | string,
    payload: PageProductSeoApproveRequest,
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(
      api.post(
        `/api/v1/sites/${siteId}/page-product-seo/${optimizationId}/approve`,
        payload,
      ),
    );
  },
};
 
/**
 * فقط فیلدهایی را می‌سازد که کاربر واقعاً نسبت به proposed عوض کرده.
 * اگر نتیجه {} بود، نیازی به صدا زدن update نیست.
 */
export function buildSeoEditPayload(
  proposed: Partial<Record<PageProductSeoField, unknown>>,
  draft: PageProductSeoUpdateRequest,
): PageProductSeoUpdateRequest {
  const payload: Record<string, unknown> = {};
 
  (Object.keys(draft) as Exclude<PageProductSeoField, "category_link">[]).forEach((field) => {
    const next = draft[field];
 
    if (next === undefined) return;
 
    // برای attributes فقط name/value مقایسه می‌شود (source/verified سمت سرور است)
    const current =
      field === "attributes" && Array.isArray(proposed.attributes)
        ? (proposed.attributes as { name: string; value: string }[]).map(
            ({ name, value }) => ({ name, value }),
          )
        : proposed[field];
 
    if (JSON.stringify(next) === JSON.stringify(current)) return;
 
    payload[field] = next;
  });
 
  return payload as PageProductSeoUpdateRequest;
}
 


/**
 * سرویس ایده‌های مقاله
 */
// export const articleIdeaService = {
//   /**
//    * لیست ایده‌های مقاله ثبت‌شده برای یک سایت
//    * GET /api/v1/sites/{site}/article-ideas
//    */
//   list: (siteId: number | string): Promise<ApiResponse<{ data: ArticleIdea[] }>> => {
//     return request(api.get(`/api/v1/sites/${siteId}/article-ideas`));
//   },

//   /**
//    * درخواست تولید ۱۰ ایده مقاله جدید (async — باید بعداً با list چک شود)
//    * POST /api/v1/sites/{site}/article-ideas/generate
//    */
//   generate: (siteId: number | string): Promise<ApiResponse<{ message: string }>> => {
//     return request(api.post(`/api/v1/sites/${siteId}/article-ideas/generate`));
//   },

//   /**
//    * تلاش مجدد برای ادامه‌ی فرآیند تولید ایده از همون مرحله‌ای که خطا خورده
//    * POST /api/v1/sites/{site}/article-ideas/retry
//    */
//   retry: (siteId: number | string): Promise<ApiResponse<{ message: string }>> => {
//     return request(api.post(`/api/v1/sites/${siteId}/article-ideas/retry`));
//   },

//   /**
//    * تغییر وضعیت یک ایده (approved / rejected / used)
//    * PATCH /api/v1/sites/{site}/article-ideas/{idea}/status
//    */
//   updateStatus: (
//     siteId: number | string,
//     ideaId: number | string,
//     status: ArticleIdea["status"]
//   ): Promise<ApiResponse<{ data: ArticleIdea }>> => {
//     return request(
//       api.patch(`/api/v1/sites/${siteId}/article-ideas/${ideaId}/status`, { status })
//     );
//   },
// };
export interface ArticleRegenerateImagePayload {
  prompt: string;
  model?: string;
}

export interface ArticleRegenerateImageResponse {
  message: string;
  article: Article;
}


/**
 * سرویس مقالات
 */
export const articleService = {
  /**
   * لیست مقالات یک سایت (خلاصه — بدون content و sections)
   * GET /api/v1/sites/{site}/articles
   */
  list: (
    siteId: number | string,
    params?: { source?: string }
  ): Promise<ApiResponse<{ data: ArticleListItem[] }>> => {
    return request(api.get(`/api/v1/sites/${siteId}/articles`, { params }));
  },

  /**
   * شروع تولید مقاله از روی یک ایده (async — پیشرفت را با show دنبال کنید)
   * پاسخ 202 با article_id — اگر قبلاً مقاله‌ای برای این ایده باشد، 409 برمی‌گردد
   * POST /api/v1/sites/{site}/ideas/{idea}/articles
   */
// src/services/api.ts (فقط متد generate داخل articleService)
regenerateGalleryImage: (
  siteId: number | string,
  articleId: number | string,
  payload: { index: number; prompt: string; model: string }
) => api.post(`/api/v1/sites/${siteId}/articles/${articleId}/regenerate-gallery-image`, payload),
generate: (
  siteId: number | string,
  ideaId: number | string,
  payload?: {
    model?: string;
    image_model?: string;
    image_count?: number;
    image_style?: string;
    image_user_prompt?: string;
    article_user_prompt?: string; // ← جدید
    min_sections?: number;         // ← جدید
    max_sections?: number;         // ← جدید
  }
): Promise<ApiResponse<ArticleGenerateResponse>> => {
  return request(
    api.post(`/api/v1/sites/${siteId}/ideas/${ideaId}/articles`, payload)
  );
},
regenerateBanner: (
  siteId: number | string,
  articleId: number | string
): Promise<ApiResponse<{ message: string }>> => {
  return request(
    api.post(`/api/v1/sites/${siteId}/articles/${articleId}/banner/regenerate`)
  );
},
  /**
   * جزئیات کامل یک مقاله همراه با تمام بخش‌ها
   * برای نمایش progress (وضعیت هر section) و مقاله نهایی
   * GET /api/v1/sites/{site}/articles/{article}
   */
  show: (
    siteId: number | string,
    articleId: number | string
  ): Promise<ApiResponse<{ data: Article }>> => {
    return request(api.get(`/api/v1/sites/${siteId}/articles/${articleId}`));
  },

  /**
   * تلاش مجدد برای مقاله failed — از همان‌جایی که متوقف شده ادامه می‌دهد
   * (brief/outline/بخش‌های موفق دوباره تولید نمی‌شوند)
   * POST /api/v1/sites/{site}/articles/{article}/retry
   */
  retry: (
    siteId: number | string,
    articleId: number | string
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/articles/${articleId}/retry`));
  },
   regenerateImage: (
    siteId: number | string,
    articleId: number | string,
    payload: ArticleRegenerateImagePayload
  ): Promise<ApiResponse<ArticleRegenerateImageResponse>> => {
    return request(
      api.post(`/api/v1/sites/${siteId}/articles/${articleId}/regenerate-image`, payload)
    );
  },

  /**
   * بازتولید یک بخش خاص (وقتی کاربر از یک بخش راضی نیست)
   * بعد از بازتولید، combine و SEO review دوباره اجرا می‌شود
   * فقط وقتی مقاله completed یا failed است مجاز است (422 در غیر این صورت)
   * POST /api/v1/sites/{site}/articles/{article}/sections/{section}/regenerate
   */
  regenerateSection: (
    siteId: number | string,
    articleId: number | string,
    sectionId: number | string
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(
      api.post(
        `/api/v1/sites/${siteId}/articles/${articleId}/sections/${sectionId}/regenerate`
      )
    );
  },
   updateField: (
    siteId: number | string,
    articleId: number | string,
    payload: ArticleUpdateFieldPayload
  ): Promise<ApiResponse<ArticleUpdateFieldResponse>> => {
    return request(api.patch(`/api/v1/sites/${siteId}/articles/${articleId}`, payload));
  },
 
  /**
   * ویرایش دستیِ یک بخش (section) مقاله
   * PATCH /api/v1/sites/{site}/articles/{article}/sections/{section}
   */
  updateSection: (
    siteId: number | string,
    articleId: number | string,
    sectionId: number | string,
    payload: ArticleUpdateSectionPayload
  ): Promise<ApiResponse<ArticleUpdateFieldResponse>> => {
    return request(
      api.patch(`/api/v1/sites/${siteId}/articles/${articleId}/sections/${sectionId}`, payload)
    );
  },
 
  /**
   * ویرایش دستیِ یک آیتم FAQ (بر اساس ایندکس آرایه)
   * PATCH /api/v1/sites/{site}/articles/{article}/faq/{index}
   */
  updateFaq: (
    siteId: number | string,
    articleId: number | string,
    faqIndex: number,
    payload: ArticleUpdateFaqPayload
  ): Promise<ApiResponse<ArticleUpdateFieldResponse>> => {
    return request(
      api.patch(`/api/v1/sites/${siteId}/articles/${articleId}/faq/${faqIndex}`, payload)
    );
  },
};
// Service

export const siteKeywordService = {
  /**
   * شروع تحلیل کلمات کلیدی سایت (گوگل ترندز + انتخاب نهایی توسط AI)
   * POST /api/v1/sites/{site}/analyze-keywords
   */
  analyze: (siteId: number | string): Promise<ApiResponse<AnalyzeSiteKeywordsResponseData>> => {
    return request(api.post(`/api/v1/sites/${siteId}/analyze-keywords`));
  },

  /**
   * دریافت نتایج تحلیل کلمات کلیدی و ترندهای هر کدام
   * GET /api/v1/sites/{site}/keyword-trends
   */
  trends: (siteId: number | string): Promise<ApiResponse<SiteKeywordTrendsResponseData>> => {
    return request(api.get(`/api/v1/sites/${siteId}/keyword-trends`));
  },
};






// اضافه به src/services/api.ts
// این بلوک‌ها رو کنار articleService موجود (همون فایل) اضافه کن —
// از همون `request` و `api` و `ApiResponse` که بالای فایل import شده استفاده می‌کنن.

import type {
  ArticleChatMessage,
  ArticleChatSendPayload,
  ArticleChatSendResponse,
  ArticleUpdateFieldPayload,
  ArticleUpdateFieldResponse,
  ArticleUpdateFaqPayload,
  ArticleUpdateSectionPayload,
} from "../types";

/* ════════════════════════════════════════════════
   متدهای جدید برای اضافه‌شدن داخل articleService موجود
   (کنار list / generate / show / retry / regenerateSection)
════════════════════════════════════════════════ */
export const articleServiceAdditions = {
  /**
   * ویرایش دستیِ فیلدهای کلی مقاله: title, meta_title, meta_description, excerpt, general(=content)
   * PATCH /api/v1/sites/{site}/articles/{article}
   */
  updateField: (
    siteId: number | string,
    articleId: number | string,
    payload: ArticleUpdateFieldPayload
  ): Promise<ApiResponse<ArticleUpdateFieldResponse>> => {
    return request(api.patch(`/api/v1/sites/${siteId}/articles/${articleId}`, payload));
  },

  /**
   * ویرایش دستیِ یک بخش (section) مقاله
   * PATCH /api/v1/sites/{site}/articles/{article}/sections/{section}
   */
  updateSection: (
    siteId: number | string,
    articleId: number | string,
    sectionId: number | string,
    payload: ArticleUpdateSectionPayload
  ): Promise<ApiResponse<ArticleUpdateFieldResponse>> => {
    return request(
      api.patch(
        `/api/v1/sites/${siteId}/articles/${articleId}/sections/${sectionId}`,
        payload
      )
    );
  },

  /**
   * ویرایش دستیِ یک آیتم FAQ (بر اساس ایندکس آرایه)
   * PATCH /api/v1/sites/{site}/articles/{article}/faq/{index}
   */
  updateFaq: (
    siteId: number | string,
    articleId: number | string,
    faqIndex: number,
    payload: ArticleUpdateFaqPayload
  ): Promise<ApiResponse<ArticleUpdateFieldResponse>> => {
    return request(
      api.patch(`/api/v1/sites/${siteId}/articles/${articleId}/faq/${faqIndex}`, payload)
    );
  },
};

/* ════════════════════════════════════════════════
   سرویس مستقل چت مقاله
════════════════════════════════════════════════ */
export const articleChatService = {
  /**
   * تاریخچه‌ی کامل چت یک مقاله (وقتی صفحه مقاله باز می‌شود نشونش بده)
   * GET /api/v1/sites/{site}/articles/{article}/chat
   */
  list: (
    siteId: number | string,
    articleId: number | string
  ): Promise<ApiResponse<{ data: ArticleChatMessage[] }>> => {
    return request(api.get(`/api/v1/sites/${siteId}/articles/${articleId}/chat`));
  },

  /**
   * ارسال یک پیام چت (sync) — پاسخ AI + وضعیت اعمال‌شدن + مقدار جدید target برمی‌گردد
   * POST /api/v1/sites/{site}/articles/{article}/chat
   */
  send: (
    siteId: number | string,
    articleId: number | string,
    payload: ArticleChatSendPayload
  ): Promise<ApiResponse<ArticleChatSendResponse>> => {
    return request(api.post(`/api/v1/sites/${siteId}/articles/${articleId}/chat`, payload));
  },
};




export const agentService = {
  /**
   * دریافت تنظیمات فعلی Agent (اگر برای سایت وجود نداشته باشد، بک‌اند خودش با مقادیر پیش‌فرض می‌سازد)
   * GET /api/v1/sites/{site}/agent-settings
   */
  get: (siteId: number | string): Promise<ApiResponse<{ data: AgentSetting }>> => {
    return request(api.get(`/api/v1/sites/${siteId}/agent-settings`));
  },

  /**
   * تغییر تنظیمات Auto Mode (روشن/خاموش کردن هرکدام از دو Agent، سقف روزانه و ...)
   * PATCH /api/v1/sites/{site}/agent-settings
   */
  update: (
    siteId: number | string,
    payload: UpdateAgentSettingPayload
  ): Promise<ApiResponse<{ data: AgentSetting }>> => {
    return request(api.patch(`/api/v1/sites/${siteId}/agent-settings`, payload));
  },

  /**
   * دکمه‌ی «همین الان ایده بساز» — مستقل از Agent مقاله و از روشن/خاموش بودن Auto Mode
   * POST /api/v1/sites/{site}/agent-settings/run-ideas
   */
  runIdeasNow: (siteId: number | string): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/agent-settings/run-ideas`));
  },

  /**
   * دکمه‌ی «همین الان مقاله بساز» — مستقل از Agent ایده و از روشن/خاموش بودن Auto Mode
   * POST /api/v1/sites/{site}/agent-settings/run-articles
   */
  runArticlesNow: (siteId: number | string): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/agent-settings/run-articles`));
  },
};


// ============ Plan ============
// ============ Plan ============

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  credit: number;
  site_limit: number;
  article_limit: number;
  is_active: boolean;
  is_free: boolean;
  price: number;               // قیمت اصلی (قبل از تخفیف)
  discount_percentage: number; // درصد تخفیف (۰ تا ۱۰۰)
  final_price: number;         // قیمت نهایی پس از اعمال تخفیف
  features: string[] | null;
  /** قیمت هر مدت قابل خرید (پلن رایگان فقط ماهانه) */
  periods?: PlanPeriod[];
}

export type BillingPeriodMonths = 1 | 3 | 6;

export interface PlanPeriod {
  months: BillingPeriodMonths;
  discount_percentage: number;
  original_price: number; // قیمت خام کل دوره
  final_price: number;    // مبلغ پرداختی کل دوره
  monthly_price: number;  // معادل ماهانه
  credit: number;         // کردیت کل دوره
}

// ============ Subscription ============

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: SubscriptionStatus;
  starts_at: string; // ISO datetime (cast: datetime)
  ends_at: string | null; // ISO datetime (cast: datetime)
  tokens_used: number;
  plan?: Plan; // فقط وقتی load('plan') شده باشه (مثلا در subscribe)
  created_at: string;
  updated_at: string;
}

// ============ subscription/me ============
// خروجی دقیق SubscriptionService::getUsageStats()

export interface SubscriptionUsageStatsInactive {
  has_active_subscription: false;
  plan_name: null;
  is_free: true;
  token_limit: 0;
  tokens_used: 0;
  remaining_tokens: 0;
  usage_percentage: 0;
}

export interface SubscriptionUsageStatsActive {
  has_active_subscription: true;
  subscription_id: number;
  plan_name: string;
  plan_slug: string;
  is_free: boolean;
  credit_limit: number;
  credit_used: number;
  remaining_credit: number;
  credit_usage_percentage: number;
  period_months?: number;
  queued_period_months?: number | null;
  starts_at: string;
  ends_at: string | null;
}

export type SubscriptionUsageStats =
  | SubscriptionUsageStatsInactive
  | SubscriptionUsageStatsActive;

export interface SubscriptionMeResponse {
  subscription: SubscriptionUsageStats;
}

// ============ subscription/usage ============
// خروجی دقیق TokenUsageService::getUserUsageHistory() -> Collection<TokenUsage>

export interface TokenUsage {
  id: number;
  user_id: number;
  subscription_id: number;
  service_name: string;
  model: string | null;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionUsageHistoryResponse {
  usage: TokenUsage[];
}

// ============ plans/{plan}/subscribe ============

// ============ plans/{plan}/subscribe ============

export interface SubscribeFreeResponse {
  message: string;
  subscription: Subscription; // با plan لود شده (load('plan')) — حالت پلن رایگان
}

export interface SubscribePaidResponse {
  message: string;
  payment_url: string; // لینک درگاه زرین‌پال — حالت پلن پولی
}
export type ExitSurveyReason = 'price' | 'quality' | 'no_website' | 'other';
export type ExitSurveyTrigger = 'back_button' | 'timeout';

export type SubscribeResponse = SubscribeFreeResponse | SubscribePaidResponse;
export const subscriptionService = {
  /**
   * وضعیت و آمار مصرف اشتراک فعلی کاربر
   * GET /api/v1/subscription/me
   */
  me: (): Promise<ApiResponse<SubscriptionMeResponse>> => {
    return request(api.get(`/api/v1/subscription/me`));
  },
   /**
   * ثبت دلیل خروج از صفحه‌ی اشتراک — اگه reason_key برابر 'price' باشه،
   * بک‌اند ممکنه یک کد تخفیف اختصاصی هم برگردونه
   * POST /api/v1/subscription/exit-survey
   */
  submitExitSurvey: (payload: {
    trigger_type: ExitSurveyTrigger;
    reason_key: ExitSurveyReason;
    reason_text?: string;
  }): Promise<ApiResponse<{ message: string; discount: DiscountInfo | null }>> => {
    return request(api.post(`/api/v1/subscription/exit-survey`, payload));
  },

  /**
   * فعال‌سازی اشتراک روی یک پلن مشخص. discountCode اختیاریه — اگه بدی،
   * بک‌اند بین تخفیف خودکار پلن و کد ارسالی، هرکدوم بهتره رو اعمال می‌کنه
   * POST /api/v1/plans/{plan}/subscribe
   */
  /** After the Stripe redirect: confirm the Checkout Session (idempotent on the backend). */
  confirmStripe: (sessionId: string): Promise<ApiResponse<{ status: "success" | "pending" | "failed"; ref_id: string | null; message: string }>> =>
    request(api.post("/api/v1/payments/stripe/confirm", { session_id: sessionId })),

  subscribe: (
    planId: number | string,
    discountCode?: string,
    periodMonths: BillingPeriodMonths = 1
  ): Promise<ApiResponse<SubscribeResponse>> => {
    return request(
      api.post(`/api/v1/plans/${planId}/subscribe`, {
        discount_code: discountCode,
        period_months: periodMonths,
      })
    );
  },


  /**
   * تاریخچه‌ی مصرف توکن کاربر (حداکثر ۵۰ آیتم آخر، مرتب بر اساس created_at نزولی)
   * GET /api/v1/subscription/usage
   */
  usageHistory: (): Promise<ApiResponse<SubscriptionUsageHistoryResponse>> => {
    return request(api.get(`/api/v1/subscription/usage`));
  },

  /**
   * لیست تمام پلن‌های فعال (مرتب‌شده بر اساس قیمت صعودی)
   * GET /api/v1/plans
   */
  plans: (): Promise<ApiResponse<{ data: Plan[] }>> => {
    return request(api.get(`/api/v1/plans`));
  },

  /**
   * جزئیات یک پلن خاص
   * GET /api/v1/plans/{plan}
   */
  planShow: (planId: number | string): Promise<ApiResponse<{ data: Plan }>> => {
    return request(api.get(`/api/v1/plans/${planId}`));
  },

  /**
   * فعال‌سازی اشتراک روی یک پلن مشخص
   * اگه کاربر همین پلن رو داشته باشه، بک‌اند خطای 422 برمی‌گردونه
   * POST /api/v1/plans/{plan}/subscribe
   */

};

// ============ discounts ============

export interface DiscountInfo {
  code: string;
  percentage: number;
  expires_at: string | null;
  seconds_left: number | null;
}

export interface DiscountMeResponse {
  discount: DiscountInfo | null;
}

export const discountService = {
  /**
   * تخفیف قابل‌استفاده‌ی کاربر لاگین‌کرده (اختصاصی یا کلی) — برای بنر/تایمر تو فرانت
   * GET /api/v1/discounts/me
   */
  me: (): Promise<ApiResponse<DiscountMeResponse>> => {
    return request(api.get(`/api/v1/discounts/me`));
  },
};




// این بخش رو داخل فایل services/api.ts اضافه کن، کنار subscriptionService
// (از همون axios instance موجود در فایل — اینجا با نام `api` فرض شده؛
//  اگه اسمش فرق داره، فقط همون رو جایگزین کن)

export interface PageVisitStartResponse {
  success: boolean;
  data?: { visit_id: string };
  message?: string;
}

export interface ApiSimpleResponse {
  success: boolean;
  message?: string;
}

export const pageVisitService = {
  /** شروع ویزیت — موقع لود صفحه صدا زده می‌شه */
  start: (page: string) =>
    api.post<PageVisitStartResponse>("api/v1/page-visits/start", { page }).then((r) => r.data),

  /** heartbeat اختیاری — هر چند ثانیه یک‌بار */
  heartbeat: (visitId: string) =>
    api
      .post<ApiSimpleResponse>(`api/v1/page-visits/${visitId}/heartbeat`)
      .then((r) => r.data),

  /** پایان ویزیت — موقع ترک صفحه */
  end: (visitId: string) =>
    api.post<ApiSimpleResponse>(`api/v1/page-visits/${visitId}/end`).then((r) => r.data),
};







export type TicketStatus = "open" | "answered" | "closed";
export type TicketPriority = "low" | "normal" | "high";

export interface TicketReplyAuthor {
  id: number;
  name: string | null;
}

export interface TicketAttachment {
  id: number;
  url: string;
  original_name: string | null;
  mime_type: string | null;
  size: number | null;
}

export interface TicketReply {
  id: number;
  message: string;
  is_staff_reply: boolean;
  user: TicketReplyAuthor;
  attachments: TicketAttachment[];
  created_at: string;
}

export interface Ticket {
  id: string;
  subject: string;
  category: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  last_reply_at: string | null;
  closed_at: string | null;
  created_at: string;
  replies_count?: number;
  replies?: TicketReply[];
}

export interface TicketListMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface CreateTicketPayload {
  subject: string;
  message?: string; // اگر عکس ضمیمه شده باشد، متن اختیاری است
  category?: string;
  priority?: TicketPriority;
  images?: File[];
  phone?: string; // فقط وقتی کاربر شماره ثبت‌شده نداشته باشد (مثلاً ورود با گوگل/ایمیل) لازم است
}

export interface CreateTicketReplyPayload {
  message?: string; // اگر عکس ضمیمه شده باشد، متن اختیاری است
  images?: File[];
}

const MAX_TICKET_IMAGES = 5;
/**
 * اگر payload شامل عکس باشد، آن را به FormData تبدیل می‌کند تا multipart ارسال شود.
 * در غیر این صورت همان آبجکت ساده را برمی‌گرداند تا به شکل JSON بره (بدون تغییر رفتار قبلی).
 */
function toRequestBody<T extends { images?: File[] }>(payload: T): T | FormData {
  const { images, ...rest } = payload;

  if (!images || images.length === 0) {
    return rest as T;
  }

  if (images.length > MAX_TICKET_IMAGES) {
    throw new Error(t("support.errors.tooMany", { max: MAX_TICKET_IMAGES }));
  }

  const formData = new FormData();
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  images.forEach((file) => {
    formData.append("images[]", file);
  });

  return formData;
}

export const ticketService = {
  /**
   * لیست تیکت‌های کاربر (با امکان فیلتر بر اساس وضعیت)
   * GET /api/v1/tickets
   */
list: (params?: { status?: string; page?: number }): Promise<
  ApiResponse<{ tickets: Ticket[]; meta: TicketListMeta }>
> => {
  return request(api.get(`/api/v1/tickets`, { params }));
},
  /**
   * ثبت تیکت جدید (با امکان ضمیمه‌ی چند عکس)
   * POST /api/v1/tickets
   */
  create: (payload: CreateTicketPayload): Promise<ApiResponse<{ ticket: Ticket }>> => {
    const body = toRequestBody(payload);
    const isFormData = body instanceof FormData;
    return request(
      api.post(`/api/v1/tickets`, body, isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined)
    );
  },

  /**
   * جزئیات یک تیکت به همراه پاسخ‌ها
   * GET /api/v1/tickets/{id}
   */
  show: (ticketId: number | string): Promise<ApiResponse<{ ticket: Ticket }>> => {
    return request(api.get(`/api/v1/tickets/${ticketId}`));
  },

  /**
   * افزودن پاسخ جدید به تیکت (با امکان ضمیمه‌ی چند عکس)
   * POST /api/v1/tickets/{id}/replies
   */
  reply: (
    ticketId: number | string,
    payload: CreateTicketReplyPayload
  ): Promise<ApiResponse<{ reply: TicketReply }>> => {
    const body = toRequestBody(payload);
    const isFormData = body instanceof FormData;
    return request(
      api.post(
        `/api/v1/tickets/${ticketId}/replies`,
        body,
        isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
      )
    );
  },

  /**
   * بستن تیکت توسط کاربر
   * POST /api/v1/tickets/{id}/close
   */
  close: (ticketId: number | string): Promise<ApiResponse<{ ticket: Ticket }>> => {
    return request(api.post(`/api/v1/tickets/${ticketId}/close`));
  },
};













export const dashboardService = {
  /**
   * تمام داده‌های لازم برای صفحه Articles Dashboard در یک درخواست
   * GET /api/v1/sites/{site}/articles/dashboard
   */
  get: (siteId: number | string): Promise<ApiResponse<{ data: DashboardData }>> => {
    return request(api.get(`/api/v1/sites/${siteId}/articles/dashboard`));
  },
};

export const apiKeyService = {
  /**
   * لیست کلیدهای کاربر جاری
   * GET /api/v1/api-keys
   */
  list: (): Promise<ApiResponse<{ data: ApiKey[] }>> => {
    return request(api.get(`/api/v1/api-keys`));
  },
 
  /**
   * ساخت یک کلید جدید. مقدار خام کلید (api_key) فقط همین یک بار برمی‌گرده.
   * POST /api/v1/api-keys
   */
  create: (payload: CreateApiKeyPayload): Promise<ApiResponse<CreateApiKeyResponse>> => {
    return request(api.post(`/api/v1/api-keys`, payload));
  },
 
  /**
   * باطل کردن (revoke) یک کلید. کلید حذف نمی‌شود، فقط غیرفعال می‌شود.
   * DELETE /api/v1/api-keys/{id}
   */
  revoke: (id: string): Promise<ApiResponse<{ message: string }>> => {
    return request(api.delete(`/api/v1/api-keys/${id}`));
  },
};

export interface ApiKey {
  id: string;
  name: string;
  key_last_four: string;
  site_id: number | null;
  site?: { id: string; domain: string } | null;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface CreateApiKeyPayload {
  name: string;
  site_id: string;
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  site: { id: string; domain: string };
  api_key: string;
  warning: string;
}export type WordPressConnectionStatus = 'pending' | 'connected' | 'disconnected';

export type WordPressHealthStatus = 'healthy' | 'unhealthy' | 'unreachable';

export interface SiteConnection {
  id: number;
  site_id: number;
  status: WordPressConnectionStatus;
  client_id: string;
  // client_secret خام فقط در پاسخ connect/reconnect برمی‌گردد، نه در show/disconnect
  api_key: string;
  wp_url: string | null;
  wp_version: string | null;
  plugin_version: string | null;
  connected_at: string | null; // ISO date
  disconnected_at: string | null; // ISO date
  last_error: string | null;
  last_health_check_at: string | null; // ISO date
  last_health_status: WordPressHealthStatus | null;
  created_at: string;
  updated_at: string;
}

/**
 * فقط خروجی connect() و reconnect() — همان لحظه‌ای که client_secret خام
 * یک‌بار به کاربر نمایش داده می‌شود (رکورد کامل SiteConnection برنمی‌گردد).
 */
export interface ConnectCredentials {
  client_id: string;
  client_secret: string;
  api_key: string;
}

export interface TestConnectionResult {
  ok: boolean;
  status_code?: number;
  body?: unknown; // بدنه‌ی JSON پاسخ health پلاگین وردپرس
  message?: string; // فقط وقتی ok=false و اتصال اصلاً برقرار نشده (مثلاً wp_url خالی یا Exception)
}

/**
 * توجه: publish/update/destroy/syncStatus هیچ‌کدام data برنمی‌گردانند —
 * فقط یک Job را async صف می‌کنند و پیام تأیید (202) می‌دهند.
 * وضعیت واقعی انتشار (wp_post_id و ...) باید از خودِ مدل Article خوانده شود
 * (مثلاً با پُل زدن روی endpoint نمایش مقاله)، نه از این روت‌ها.
 */

// ==========================================================
// wordpressService — روت‌های پنل (auth:sanctum)
// sites/{site}/wordpress/*
// ==========================================================

export const wordpressService = {
  /**
   * دریافت وضعیت فعلی اتصال وردپرس این سایت.
   * توجه: اگر سایت هنوز هیچ اتصالی نساخته باشد، $site->connection می‌تواند null باشد.
   * GET /api/v1/sites/{site}/wordpress
   */
 show: (
  siteId: number | string
): Promise<
  ApiResponse<{
    provider?: "wordpress" | "shopify";
    data: SiteConnection | null;
  }>
> => {
  return request(api.get(`/api/v1/sites/${siteId}/wordpress`));
},
  /**
   * شروع اتصال — ساخت client_id / client_secret / api_key برای این سایت.
   * client_secret فقط همین یک‌بار خام برمی‌گردد؛ باید همین‌جا به کاربر نمایش
   * داده شود تا در تنظیمات پلاگین وردپرس وارد کند. (HTTP 201)
   * POST /api/v1/sites/{site}/wordpress/connect
   */
  connect: (siteId: number | string): Promise<ApiResponse<{ message: string; data: ConnectCredentials }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/wordpress/connect`));
  },

  /**
   * اتصال مجدد — بازتولید کامل client_id/client_secret/api_key (وضعیت به pending برمی‌گردد
   * و باید پلاگین وردپرس دوباره پیکربندی/handshake شود).
   * POST /api/v1/sites/{site}/wordpress/reconnect
   */
  reconnect: (siteId: number | string): Promise<ApiResponse<{ message: string; data: ConnectCredentials }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/wordpress/reconnect`));
  },

  /**
   * قطع اتصال سایت وردپرسی — رکورد کامل SiteConnection (بدون client_secret) برمی‌گردد.
   * POST /api/v1/sites/{site}/wordpress/disconnect
   */
  disconnect: (siteId: number | string): Promise<ApiResponse<{ message: string; data: SiteConnection }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/wordpress/disconnect`));
  },

  /**
   * تست اتصال دستی از پنل (Laravel به‌صورت مستقیم به health پلاگین پینگ می‌زند).
   * اگر ok=false باشد، بک‌اند کد وضعیت 422 برمی‌گرداند وگرنه 200.
   * POST /api/v1/sites/{site}/wordpress/test
   */
  test: (siteId: number | string): Promise<ApiResponse<{ message: string; data: TestConnectionResult }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/wordpress/test`));
  },
   syncArticle: (articleId: number | string): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post(`/api/v1/articles/${articleId}/wordpress`));
  },

  /**
   * حذف مقاله از وردپرس.
   * بعد از موفقیت، سمت لاراول wp_post_id/wp_permalink پاک و
   * wp_sync_status روی not_synced ست می‌شود.
   * DELETE /api/v1/articles/{article}/wordpress
   */
  destroyArticle: (articleId: number | string): Promise<ApiResponse<{ message: string }>> => {
    return request(api.delete(`/api/v1/articles/${articleId}/wordpress`));
  },

  /**
   * رفرش وضعیت مقاله از وردپرس (فقط خواندن — چیزی push نمی‌شود).
   * برای وقتی که پست مستقیماً توی وردپرس تغییر کرده و می‌خواهید
   * پنل با اون هماهنگ بشه.
   * PATCH /api/v1/articles/{article}/wordpress/sync
   */
  syncArticleStatus: (articleId: number | string): Promise<ApiResponse<{ message: string }>> => {
    return request(api.patch(`/api/v1/articles/${articleId}/wordpress/sync`));
  },



     syncProductArticle: (
    siteId: number | string,
    articleId: number | string,
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(
      api.post(`/api/v1/sites/${siteId}/product-articles/${articleId}/publish`),
    );
  },

  destroyProductArticle: (
    siteId: number | string,
    articleId: number | string,
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(
      api.delete(`/api/v1/sites/${siteId}/product-articles/${articleId}/publish`),
    );
  },

  syncProductArticleStatus: (
    siteId: number | string,
    articleId: number | string,
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(
      api.post(`/api/v1/sites/${siteId}/product-articles/${articleId}/publish/sync`),
    );
  },
};
// ==========================================================
// shopifyService — Shopify store connection (OAuth app)
// sites/{site}/shopify/*
// ==========================================================

export interface ShopifyConnection {
  id: number;
  shop_domain: string;
  shop_name: string | null;
  shop_url: string;
  status: string;
  last_error: string | null;
  connected_at: string | null;
}

export const shopifyService = {
  /** Current connection (data = null when not connected); configured=false when the server has no Shopify app keys. */
  show: (siteId: number | string): Promise<ApiResponse<{ configured: boolean; data: ShopifyConnection | null }>> =>
    request(api.get(`/api/v1/sites/${siteId}/shopify`)),

  /** Returns the Shopify consent URL; the browser is redirected there. */
  install: (siteId: number | string, shop: string): Promise<ApiResponse<{ authorize_url: string }>> =>
    request(api.post(`/api/v1/sites/${siteId}/shopify/install`, { shop })),

  test: (siteId: number | string): Promise<ApiResponse<{ message: string; data: { ok: boolean; message: string | null; shop_name?: string | null } }>> =>
    request(api.post(`/api/v1/sites/${siteId}/shopify/test`)),

  /** Uninstalls the app from the store and removes the connection. */
  disconnect: (siteId: number | string): Promise<ApiResponse<{ message: string; data: null }>> =>
    request(api.post(`/api/v1/sites/${siteId}/shopify/disconnect`)),
};

// ==========================================================
// articlePublishService — روت‌های پنل (auth:sanctum)
// sites/{site}/articles/{article}/publish/*
// ==========================================================

export const articlePublishService = {
  /**
   * انتشار مقاله در سایت وردپرسی متصل‌شده — فقط مقالات با status=completed قابل انتشارند.
   * موفق: 202 (Job صف شده). ناموفق (مثلاً مقاله تکمیل نشده): 422.
   * POST /api/v1/sites/{site}/articles/{article}/publish
   */
  publish: (
    siteId: number | string,
    articleId: number | string
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/articles/${articleId}/publish`));
  },

  /**
   * ویرایش مقاله‌ی از قبل منتشرشده در وردپرس — نیازمند وجود wp_post_id روی مقاله، وگرنه 422.
   * PUT /api/v1/sites/{site}/articles/{article}/publish
   */
  update: (
    siteId: number | string,
    articleId: number | string
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(api.put(`/api/v1/sites/${siteId}/articles/${articleId}/publish`));
  },

  /**
   * حذف مقاله از سایت وردپرسی — نیازمند وجود wp_post_id روی مقاله، وگرنه 422.
   * DELETE /api/v1/sites/{site}/articles/{article}/publish
   */
  destroy: (
    siteId: number | string,
    articleId: number | string
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(api.delete(`/api/v1/sites/${siteId}/articles/${articleId}/publish`));
  },

  /**
   * همگام‌سازی وضعیت انتشار مقاله با وردپرس (Job صف می‌شود، نتیجه sync در خودِ مدل Article ذخیره می‌شود).
   * POST /api/v1/sites/{site}/articles/{article}/publish/sync
   */
  syncStatus: (
    siteId: number | string,
    articleId: number | string
  ): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post(`/api/v1/sites/${siteId}/articles/${articleId}/publish/sync`));
  },
};

// ─────────────────────────────────────────────────────────────
// این بخش را جایگزین بخش «product» فعلی در services/api.ts کن
// (از //product تا انتهای productArticleService)
// ─────────────────────────────────────────────────────────────

type Id = number | string;
// ═══════════════════════════════════════════════════════════════════
// src/services/api.ts
// بخش «product» فعلی (از type Id تا productSeoIdeaService) را کامل با این جایگزین کن.
// `api`, `request`, `ApiResponse` همان‌هایی‌اند که بقیه‌ی فایل استفاده می‌کند.
// ═══════════════════════════════════════════════════════════════════

//product
export interface ProductSeoIdeaProduct {
  id: number;
  name: string;
  url: string | null;
  price: number | string | null;
  /** IRR (ریال) یا IRT (تومان) */
  currency?: string | null;
  images: string[] | null;
}

export interface ProductSeoIdeaCategory {
  id?: number;
  name: string;
}

export type ProductSeoContentStyle = "price" | "comparison" | "buying_guide";

export interface ProductSeoIdea {
  id: string;
  title: string;
  content_style: ProductSeoContentStyle | string;
  categories: ProductSeoIdeaCategory[] | null;
  products: ProductSeoIdeaProduct[];
  /** شناسه‌ی دسته‌ی هدف برای لینک داخلی (null = صفحه‌ی اصلی فروشگاه) */
  target_category_id?: number | null;
  /** آدرس کامل لینک داخلی مقاله */
  target_url?: string | null;
  /** عنوان نمایشی لینک داخلی (نام دسته‌ی هدف) */
  target_url_title?: string | null;
  /** ULID مقاله‌ی ساخته‌شده برای این ایده (بک‌اند در index اضافه می‌کند) */
  article_id?: Id | null;
  article_status?: string | null;
}

export interface ProductSeoIdeaListResponse {
  batch: number;
  /** مقدار `site.idea_generation_status`، مثلاً "generating_ideas" */
  status: string | null;
  error: string | null;
  data: ProductSeoIdea[];
}

export interface ProductSeoIdeaGenerateResponse {
  message: string;
  batch: number;
}

/** محصول در فهرست انتخاب (جستجو/صفحه‌بندی) */
export interface ProductSeoPickerProduct {
  id: number;
  name: string;
  url: string | null;
  price: number | null;
  /** IRR (ریال) یا IRT (تومان) */
  currency?: string | null;
  image: string | null;
  category_id: number | null;
}

export interface ProductSeoProductsResponse {
  data: ProductSeoPickerProduct[];
  meta: { current_page: number; last_page: number; total: number };
}

/** دسته‌ی فروشگاه برای فیلتر محصولات و انتخاب لینک داخلی */
export interface ProductSeoCategoryOption {
  id: number;
  name: string;
  parent_id: number | null;
  /** مسیر کامل، مثل «لوازم › فندک» */
  path: string;
  products_count: number;
  url: string | null;
}

export interface ProductSeoIdeaUpdatePayload {
  title?: string;
  product_ids?: number[];
  /** null = لینک به صفحه‌ی اصلی فروشگاه */
  target_category_id?: number | null;
}

export const productSeoIdeaService = {
  /** batch را ندهی، بک‌اند آخرین batch را برمی‌گرداند */
  list: (siteId: Id, batch?: number): Promise<ApiResponse<ProductSeoIdeaListResponse>> =>
    request(
      api.get(`/api/v1/sites/${siteId}/product-seo-ideas`, {
        params: batch !== undefined ? { batch } : undefined,
      }),
    ),
  /** افزودن محصول با لینک؛ اگر از قبل بود status=existing */
  importProduct: (
    siteId: Id,
    url: string,
  ): Promise<
    ApiResponse<{
      status: "created" | "existing";
      product: {
        id: number;
        name: string;
        url: string | null;
        price: number | null;
        image: string | null;
        category_id: number | null;
      };
    }>
  > => request(api.post(`/api/v1/sites/${siteId}/product-seo-ideas/products/import`, { url })),
  /** product_ids خالی/ندادن = انتخاب خودکار؛ با مقدار = ایده فقط برای همین محصولات */
  generate: (
    siteId: Id,
    payload: { prompt?: string | null; product_ids?: number[] },
  ): Promise<ApiResponse<ProductSeoIdeaGenerateResponse>> =>
    request(api.post(`/api/v1/sites/${siteId}/product-seo-ideas`, payload)),

  /** فهرست محصولات سایت (جستجو + فیلتر دسته + صفحه‌بندی) */
  products: (
    siteId: Id,
    params: { search?: string; category_id?: number; page?: number },
  ): Promise<ApiResponse<ProductSeoProductsResponse>> =>
    request(api.get(`/api/v1/sites/${siteId}/product-seo-ideas/products`, { params })),

  /** همه‌ی دسته‌های سایت */
  categories: (siteId: Id): Promise<ApiResponse<{ data: ProductSeoCategoryOption[] }>> =>
    request(api.get(`/api/v1/sites/${siteId}/product-seo-ideas/categories`)),

  /** ویرایش دستی ایده؛ فقط فیلدهای ارسال‌شده تغییر می‌کنند */
  updateIdea: (
    siteId: Id,
    ideaId: Id,
    payload: ProductSeoIdeaUpdatePayload,
  ): Promise<ApiResponse<{ data: ProductSeoIdea }>> =>
    request(api.patch(`/api/v1/sites/${siteId}/product-seo-ideas/${ideaId}`, payload)),
};
export type ProductArticleStatus =
  | "pending"
  | "creating_brief"
  | "creating_assignments"
  | "generating_sections"
  | "generating_meta"
  | "completed"
  | "failed"
  | "paused_credit";

export type ProductArticleSectionStatus =
  | "pending"
  | "generating"
  | "generated"
  | "failed";

export type ProductArticlePublishStatus =
  | "not_published"
  | "publishing"
  | "published"
  | "failed"
  | null;

/** وضعیت‌هایی که یعنی مقاله هنوز در حال تولید است (برای polling) */
export const PRODUCT_ARTICLE_BUSY_STATUSES: ProductArticleStatus[] = [
  "pending",
  "creating_brief",
  "creating_assignments",
  "generating_sections",
  "generating_meta",
];

export const isProductArticleBusy = (status: ProductArticleStatus): boolean =>
  PRODUCT_ARTICLE_BUSY_STATUSES.includes(status);

/* ------------------------------------------------------------------ */
/*  محصول                                                               */
/* ------------------------------------------------------------------ */

/** شکل محصول در خروجی show (هم در سطح مقاله، هم در هر سکشن) */
export interface ProductArticleProduct {
  id: number;
  name: string | null;
  price: string | number | null;
  /** IRR (ریال) یا IRT (تومان) */
  currency?: string | null;
  image: string | null;
  url: string | null;
  // جدید (همه اختیاری)
  regular_price?: string | number | null;
  category?: string | null;
  brand?: string | null;
  in_stock?: boolean | null;
  excerpt?: string | null;
  specs?: { label: string; value: string }[];
}
/** نام قدیمی؛ برای سازگاری با import های موجود */
export type ProductArticleSectionProduct = ProductArticleProduct;

/* ------------------------------------------------------------------ */
/*  سکشن                                                                */
/* ------------------------------------------------------------------ */

export interface ProductArticleSection {
  id: Id;
  product_article_id: Id;
  assignment_id: Id | null;
  position: number;
  type: string;
  heading: string;
  subheadings: string[] | null;
  key_points: string[] | null;
  target_words: number | null;
  product_ids: Array<number | string> | null;
  content: string | null;
  status: ProductArticleSectionStatus;
  error_message: string | null;
  products: ProductArticleProduct[];
  created_at?: string;
  updated_at?: string;
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                 */
/* ------------------------------------------------------------------ */

export interface ProductArticleFaqItem {
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ */
/*  مقاله                                                               */
/* ------------------------------------------------------------------ */

/** آیتم لیست مقالات (فقط ستون‌هایی که index برمی‌گردونه) */
export interface ProductArticleListItem {
  id: Id;
  product_seo_idea_id: Id | null;
  title: string;
  status: ProductArticleStatus;
  error_message: string | null;
  publish_status: ProductArticlePublishStatus;
  publish_error: string | null;
  publish_error_at: string | null;
  wp_permalink: string | null;
  seo_score: number | null;
  word_count: number | null;
  completed_at: string | null;
  published_at: string | null;
  created_at: string;
}

/** مقاله‌ی کامل (خروجی show) */
export interface ProductArticle {
  id: Id;
  site_id: Id;
  product_seo_idea_id: Id | null;
  title: string;
  status: ProductArticleStatus;
  error_message: string | null;

  content_style: string | null;
  categories: string[] | null;
  product_ids: Array<number | string> | null;

  selected_model: string | null;
  article_user_prompt: string | null;
  min_sections: number | null;
  max_sections: number | null;

  brief: unknown | null;
  content: string | null;
  image_status?: "pending" | "generating" | "generated" | "failed" | null;
  image_error?: string | null;
  image_prompt?: string | null;
  image_alt?: string | null;
  image_url?: string | null;
  image_model?: string | null;

  // متا / سئو
  meta_title: string | null;
  meta_description: string | null;
  excerpt: string | null;
  focus_keyword: string | null;
  slug: string | null;
  og_title: string | null;
  og_description: string | null;
  faq_schema: ProductArticleFaqItem[];
  product_schema: unknown | null;
  meta_generated_at: string | null;

  seo_score: number | null;
  word_count: number | null;

  // انتشار
  publish_status: ProductArticlePublishStatus;
  wp_permalink: string | null;
  completed_at: string | null;
  published_at: string | null;

  created_at: string;
  updated_at: string;

  sections: ProductArticleSection[];
  /** محصولات کل مقاله (بک‌اند در transformArticleForResponse پر می‌کند) */
  products?: ProductArticleProduct[];
  idea?: {
    id: Id;
    title: string;
    content_style: string | null;
  } | null;
}

/* ------------------------------------------------------------------ */
/*  Payload / Response                                                  */
/* ------------------------------------------------------------------ */

export interface GenerateProductArticlePayload {
  article_user_prompt?: string | null;
  min_sections?: number | null;
  max_sections?: number | null;
  model?: string | null;
  image_model?: string | null;
  image_style?: string | null;
  image_user_prompt?: string | null;
}

export interface GenerateProductArticleResponse {
  message: string;
  started: boolean;
  /** ULID رشته‌ای */
  article_id: Id;
  model?: string;
  article_user_prompt?: string | null;
  min_sections?: number | null;
  max_sections?: number | null;
}

export interface ProductArticleListResponse {
  data: ProductArticleListItem[];
}

export interface ProductArticleShowResponse {
  data: ProductArticle;
}

export interface ProductArticleMessageResponse {
  message: string;
}

/** فیلدهایی که با updateField قابل ویرایش دستی‌اند */
export type ProductArticleEditableField =
  | "title"
  | "meta_title"
  | "meta_description"
  | "excerpt"
  | "slug"
  | "focus_keyword";

export interface UpdateProductArticleFieldPayload {
  target_type: ProductArticleEditableField;
  value: string;
}

export interface UpdateProductArticleFieldResponse {
  target: {
    type: ProductArticleEditableField;
    id: null;
    value: string;
  };
}

export interface UpdateProductArticleSectionPayload {
  heading?: string;
  content: string;
}

export interface UpdateProductArticleSectionResponse {
  target: {
    type: "section";
    id: Id;
    heading: string;
    value: string;
  };
}

export interface UpdateProductArticleFaqPayload {
  question: string;
  answer: string;
}

export interface UpdateProductArticleFaqResponse {
  target: {
    type: "faq";
    id: number;
    question: string;
    answer: string;
  };
}

export const productArticleService = {
  /** لیست مقالات محصول یک سایت */
  list: (siteId: Id): Promise<ApiResponse<ProductArticleListResponse>> =>
    request(api.get(`/api/v1/sites/${siteId}/product-articles`)),

  /** جزئیات کامل مقاله (برای صفحه‌ی مقاله و polling) */
  show: (
    siteId: Id,
    articleId: Id,
  ): Promise<ApiResponse<ProductArticleShowResponse>> =>
    request(api.get(`/api/v1/sites/${siteId}/product-articles/${articleId}`)),

  /** شروع تولید مقاله از روی یک ایده (idempotent) */
  generate: (
    siteId: Id,
    ideaId: Id,
    payload: GenerateProductArticlePayload = {},
  ): Promise<ApiResponse<GenerateProductArticleResponse>> =>
    request(
      api.post(
        `/api/v1/sites/${siteId}/product-articles/ideas/${ideaId}/generate`,
        payload,
      ),
    ),

  /** بازتولید تصویر شاخص */
  regenerateImage: async (
    siteId: Id,
    articleId: Id,
    payload: { prompt: string; model: string },
  ) => {
    const res = await api.post(
      `/api/v1/sites/${siteId}/product-articles/${articleId}/regenerate-image`,
      payload,
    );
    return res.data;
  },

  /** ادامه‌ی تولید مقاله‌ی failed یا paused_credit */
  retry: (
    siteId: Id,
    articleId: Id,
  ): Promise<ApiResponse<ProductArticleMessageResponse>> =>
    request(
      api.post(`/api/v1/sites/${siteId}/product-articles/${articleId}/retry`),
    ),

  /** حذف مقاله */
  remove: (
    siteId: Id,
    articleId: Id,
  ): Promise<ApiResponse<ProductArticleMessageResponse>> =>
    request(
      api.delete(`/api/v1/sites/${siteId}/product-articles/${articleId}`),
    ),

  /** بازتولید یک بخش */
  regenerateSection: (
    siteId: Id,
    articleId: Id,
    sectionId: Id,
  ): Promise<ApiResponse<ProductArticleMessageResponse>> =>
    request(
      api.post(
        `/api/v1/sites/${siteId}/product-articles/${articleId}/sections/${sectionId}/regenerate`,
      ),
    ),

  /** ویرایش دستی فیلدهای متا/کلی */
  updateField: (
    siteId: Id,
    articleId: Id,
    payload: UpdateProductArticleFieldPayload,
  ): Promise<ApiResponse<UpdateProductArticleFieldResponse>> =>
    request(
      api.patch(
        `/api/v1/sites/${siteId}/product-articles/${articleId}/field`,
        payload,
      ),
    ),

  /** ویرایش دستی یک بخش */
  updateSection: (
    siteId: Id,
    articleId: Id,
    sectionId: Id,
    payload: UpdateProductArticleSectionPayload,
  ): Promise<ApiResponse<UpdateProductArticleSectionResponse>> =>
    request(
      api.patch(
        `/api/v1/sites/${siteId}/product-articles/${articleId}/sections/${sectionId}`,
        payload,
      ),
    ),

  /** ویرایش دستی یک آیتم FAQ (بر اساس ایندکس) */
  updateFaq: (
    siteId: Id,
    articleId: Id,
    index: number,
    payload: UpdateProductArticleFaqPayload,
  ): Promise<ApiResponse<UpdateProductArticleFaqResponse>> =>
    request(
      api.patch(
        `/api/v1/sites/${siteId}/product-articles/${articleId}/faq/${index}`,
        payload,
      ),
    ),
};


















export default api;