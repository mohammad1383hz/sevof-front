import { env } from "../env";
// src/services/api.ts
import axios from "axios";
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

const api = axios.create({
  baseURL: env("VITE_API_BASE_URL") || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// درخواست: توکن از sessionStorage می‌خونه و به هدر اضافه می‌کنه
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// پاسخ: اگه 401 بود، توکن رو پاک می‌کنه و به login ریدایرکت می‌کنه
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
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
      message: error.response?.data?.message || "Something went wrong. Please try again.",
      data: error.response?.data,
      errors: error.response?.data?.errors,
      error: error.message,
      status: error.response?.status,   // ← همین یک خط اضافه شود
    };
  }
}

// ذخیره‌ی توکن و کاربر بعد از لاگین موفق (چه OTP چه Google)
function persistAuth(data: AuthTokenResponseData) {
  sessionStorage.setItem("authToken", data.token);
  sessionStorage.setItem("user", JSON.stringify(data.user));
}
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

  id: number;
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
    payload?: { title?: string | null; kind?: "analysis" },
  ): Promise<ApiResponse<ContentChatSessionResponse>> =>
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
  } | null;
  property: SearchConsoleProperty | null;
};

export const searchConsoleService = {
  connect: (siteId: number | string): Promise<ApiResponse<{ authorization_url: string }>> =>
    request(api.post(`/api/v1/sites/${siteId}/search-console/connect`)),

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
};


// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * بررسی وجود توکن معتبر در session
   */
  isAuthenticated: (): boolean => {
    return Boolean(sessionStorage.getItem("authToken"));
  },
  sendEmailLogin: (
  payload: { email: string; password: string }
): Promise<ApiResponse<{ status: "login" | "verification_required"; message: string; token?: string; token_type?: string; user?: unknown }>> => {
  return request(api.post("/api/v1/auth/email/login", payload));
},

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
   * خروج — حذف توکن از سرور و sessionStorage
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      await api.post("/api/v1/auth/logout");
    } finally {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
    }
  },
};

// ─── Site Service ──────────────────────────────────────────────────────────────

// --- اضافه به src/services/api.ts ---


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
  list: (siteId: number | string): Promise<ApiResponse<{ data: ArticleListItem[] }>> => {
    return request(api.get(`/api/v1/sites/${siteId}/articles`));
  },

  /**
   * شروع تولید مقاله از روی یک ایده (async — پیشرفت را با show دنبال کنید)
   * پاسخ 202 با article_id — اگر قبلاً مقاله‌ای برای این ایده باشد، 409 برمی‌گردد
   * POST /api/v1/sites/{site}/ideas/{idea}/articles
   */
  generate: (
  siteId: number | string,
  ideaId: number | string,
  payload?: { model?: string }
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
  id: number;
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
    submitExitSurvey: (payload: {
    trigger_type: ExitSurveyTrigger;
    reason_key: ExitSurveyReason;
    reason_text?: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    return request(api.post(`/api/v1/subscription/exit-survey`, payload));
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
  subscribe: (planId: number | string): Promise<ApiResponse<SubscribeResponse>> => {
    return request(api.post(`/api/v1/plans/${planId}/subscribe`));
  },
};






// این بخش رو داخل فایل services/api.ts اضافه کن، کنار subscriptionService
// (از همون axios instance موجود در فایل — اینجا با نام `api` فرض شده؛
//  اگه اسمش فرق داره، فقط همون رو جایگزین کن)

export interface PageVisitStartResponse {
  success: boolean;
  data?: { visit_id: number };
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
  heartbeat: (visitId: number) =>
    api
      .post<ApiSimpleResponse>(`api/v1/page-visits/${visitId}/heartbeat`)
      .then((r) => r.data),

  /** پایان ویزیت — موقع ترک صفحه */
  end: (visitId: number) =>
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
  id: number;
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
    throw new Error(`You can attach up to ${MAX_TICKET_IMAGES} images.`);
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
  revoke: (id: number): Promise<ApiResponse<{ message: string }>> => {
    return request(api.delete(`/api/v1/api-keys/${id}`));
  },
};

export interface ApiKey {
  id: number;
  name: string;
  /** فقط ۴ کاراکتر آخر کلید، برای شناسایی در UI — خود کلید هرگز برنمی‌گرده */
  key_last_four: string;
  created_at: string;
  last_used_at: string | null;
  /** اگر null باشد یعنی کلید فعال است */
  revoked_at: string | null;
}
 
export interface CreateApiKeyPayload {
  name: string;
}
 
export interface CreateApiKeyResponse {
  id: number;
  name: string;
  /** کلید خام — فقط همین یک بار در پاسخ برمی‌گرده، جایی ذخیره‌اش نمی‌کنیم */
  api_key: string;
  warning: string;
}
export type WordPressConnectionStatus = 'pending' | 'connected' | 'disconnected';

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
  show: (siteId: number | string): Promise<ApiResponse<{ data: SiteConnection | null }>> => {
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


























export default api;