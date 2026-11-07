// src/types/index.ts

// ─── Generic API Wrapper ──────────────────────────────────────────────────────
// طوری طراحی شده که اگه بک‌اند بعداً فیلدهای بیشتری (errors, meta, ...) اضافه کرد
// نیازی به تغییر این تایپ نباشه.

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  error?: string;
  [key: string]: unknown;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
export interface ArticleBanner {
  id: number;
  status: "pending" | "generating" | "generated" | "failed";
  html: string | null;
  logo_url: string | null;
  site_name: string | null;
  prompt: string | null;
  error_message: string | null;
}
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface EntityLink {
  url: string;
  title: string;
  priority: number;
}

export interface SiteEntity {
  name: string;
  description: string;
  type: string;
  links: EntityLink[];
}

export interface WebsiteEntity {
  id: number;
  primary_entity: SiteEntity | null;
  core_entities: SiteEntity[];
  updated_at: string;
}
export interface ArticleIdeaScoreCriterion {
  score: number;
  max: number;
  reason: string;
  detected_intent?: string | null;
}

export interface ArticleIdeaScoreBreakdown {
  entity_relevance?: ArticleIdeaScoreCriterion;
  search_intent?: ArticleIdeaScoreCriterion;
  business_value?: ArticleIdeaScoreCriterion;
  serp_opportunity?: ArticleIdeaScoreCriterion;
  overall_recommendation?: string;
  suggested_content_type?: "article" | "service_page" | "product_page" | "avoid" | null;
}

export interface ArticleIdeaRelatedLink {
  url: string;
  title: string;
  match_score: number;
}

export interface ArticleIdeaTaxonomyTerm {
  id: number;
  name: string;
  slug: string | null;
}

export interface ArticleIdea {
  id: string;
  title: string;
  meta_description: string | null;
  hook: string | null;
  batch: number;
  has_article: boolean;
  article_id?: string | null;
  entity: {
    name: string;
    scope: "primary" | "core";
    type: string | null;
  };
  internal_link: {
    url: string | null;
    title: string | null;
  };
  related_links: ArticleIdeaRelatedLink[];
  /** دسته‌بندی وردپرسی انتخاب‌شده توسط AI از بین taxonomy واقعیِ سایت؛ اگر
   *  سایت taxonomy نداشته یا مورد مناسبی پیدا نشده باشد null است. */
  category: ArticleIdeaTaxonomyTerm | null;
  /** برچسب‌های وردپرسی انتخاب‌شده (۰ تا ۳ مورد)؛ اگر موردی مرتبط نبود آرایه‌ی خالی است. */
  tags: ArticleIdeaTaxonomyTerm[];
  outline: string[];
  priority: number;
  status: "suggested" | "approved" | "rejected" | "used";
  /** کاربر گفته Auto Pilot از این ایده مقاله نسازد */
  autopilot_excluded?: boolean;
  created_at: string;
  seo_score: number | null;
  score_breakdown: ArticleIdeaScoreBreakdown | null;
  scored_at: string | null;
  scoring_error: string | null;
  is_scored: boolean;
}
// ─── User ──────────────────────────────────────────────────────────────────────
// UserResource بک‌اند احتمالاً بعداً فیلدهای بیشتری برمی‌گردونه (avatar, role, ...)
// این تایپ باز (extensible) نگه داشته شده.برب

export interface User {
  id: number;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// ─── Auth: OTP ──────────────────────────────────────────────────────────────────

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

// ─── Auth: Google ───────────────────────────────────────────────────────────────

export interface GoogleAuthRequest {
  id_token: string;
}

// ─── Auth: Shared login response (verifyOtp و google هر دو همین شکل رو برمی‌گردونن) ──

export interface AuthTokenResponseData {
  message: string;
  token: string;
  token_type: string; // "Bearer"
  user: User;
}

// ─── Auth: Me ────────────────────────────────────────────────────────────────────

export interface MeResponseData {
  user: User;
}

// ─── Site ────────────────────────────────────────────────────────────────────────

export type SiteStatus =
  | "pending"
  | "crawling"
  | "analyzing"
  | "completed"
  | "failed"
  | (string & {}); // برای اینکه اگه بک‌اند یه status جدید اضافه کرد، تایپ خطا نده

export interface Site {
  id: string;
  user_id?: number;
  domain: string;
  url: string;
  status: SiteStatus;
  niche?: string | null;
  summary?: string | null;
  crawled_pages?: unknown;
  ai_response?: unknown;
  error_message?: string | null;
  analyzed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
    keywords?: string[] | null;   // <-- این خط اضافه شد
   final_keyword: string | null;
  final_title: string | null;
  keyword_analysis_status: KeywordAnalysisStatus;
  keyword_analysis_error: string | null;
  idea_generation_status: string | null;
  idea_generation_batch: number;

idea_generation_error: string | null;
}

export interface StoreSiteRequest {
  domain: string;
}

export interface StoreSiteResponseData {
  message: string;
  site: Site;
}

export interface ShowSiteResponseData {
  site: Site;
}




// flow2
// Types

export interface SiteKeywordTrendQuery {
  query: string;
  value?: number;
}

export interface SiteKeywordTrendRisingQuery {
  query: string;
  value: number;
  change: string;
}

export interface SiteKeywordTrend {
  id: number;
  site_id: number;
  keyword: string;
  geo: string;
  timeframe: string;
  top_queries: SiteKeywordTrendQuery[] | null;
  rising_queries: SiteKeywordTrendRisingQuery[] | null;
  status: "pending" | "fetched" | "failed";
  error_message: string | null;
  fetched_at: string | null;
  created_at: string;
  updated_at: string;
}

export type KeywordAnalysisStatus =
  | "not_started"
  | "pending"
  | "processing"
  | "done"
  | "failed";

export interface AnalyzeSiteKeywordsResponseData {
  message: string;
  site: Site;
}

export interface SiteKeywordTrendsResponseData {
  site: Site;
  trends: SiteKeywordTrend[];
}



/**
 * Types مربوط به مقالات — دقیقاً منطبق بر جداول articles و article_sections در backend
 */

/** وضعیت‌های مقاله — مطابق ثابت‌های App\Models\Article */
export type ArticleStatus =
  | "pending"
  | "creating_brief"
  | "generating_outline"
  | "generating_sections"
  | "generating_meta"
  | "reviewing"
  | "completed"
  | "paused_credit" 
  | "failed";

/** رکورد کامل جدول articles — خروجی endpoint show (همراه sections) */
export interface Article {
  id: string;
  article_idea_id: number;
  website_id: number;
  title: string;
  meta_description: string | null;
  status: ArticleStatus;
  brief: ArticleBrief | null;
  outline: ArticleOutlineSection[] | null;
  content: string | null; // مقاله نهایی ترکیب‌شده (Markdown) — بعد از finalize پر می‌شود
  seo_score: number | null;
  seo_review: ArticleSeoReview | null;
  word_count: number | null;
  error_message: string | null;
    banner?: ArticleBanner | null;
  banner_status?: "pending" | "generating" | "generated" | "failed" | null;

  completed_at: string | null;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
  image_alt?: string | null;
  image_prompt?: string | null;
  image_status?: ArticleImageStatus;
  image_error?: string | null;
  sections: ArticleSection[];
  meta_title?: string | null;
  excerpt?: string | null;
  focus_keyword?: string | null;
  slug?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  faq_schema?: Record<string, unknown> | null;
  faq?: ArticleFaqItem[] | null;
}

/** وضعیت‌های هر بخش — مطابق ثابت‌های App\Models\ArticleSection */
export type ArticleSectionStatus = "pending" | "generated" | "failed";

/** نوع بخش — مطابق enum خروجی outlineSchema در ArticleWriterService */
export type ArticleSectionType = "introduction" | "section" | "faq" | "conclusion";

export type SearchIntent =
  | "informational"
  | "commercial"
  | "transactional"
  | "navigational";

/** خروجی مرحله Brief — مطابق briefSchema در ArticleWriterService */
export interface ArticleBrief {
  audience: string;
  search_intent: SearchIntent;
  goal: string;
  tone: string;
  target_word_count: number;
  important_topics: string[];
  competitor_gaps: string[];
  internal_link_plan: {
    url: string;
    anchor_suggestion: string;
    best_section: string;
  };
}

/** یک آیتم از outline — مطابق outlineSchema */
export interface ArticleOutlineSection {
  type: ArticleSectionType;
  heading: string;
  subheadings: string[];
  key_points: string[];
  target_words: number;
}

/** خروجی مرحله SEO Review — مطابق reviewSchema */
export interface ArticleSeoReview {
  seo_score: number;
  breakdown: {
    intent_match: number;
    keyword_usage: number;
    entity_coverage: number;
    completeness: number;
    readability: number;
    structure: number;
  };
  suggestions: string[];
}

/** رکورد جدول article_sections */
export interface ArticleSection {
  id: string;
  article_id: number;
  position: number;
  type: ArticleSectionType;
  heading: string;
  subheadings: string[] | null;
  key_points: string[] | null;
  target_words: number;
  content: string | null; // Markdown — تا قبل از تولید null است
  status: ArticleSectionStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

/** رکورد کامل جدول articles — خروجی endpoint show (همراه sections) */

export type ArticleImageStatus = "pending" | "generating" | "generated" | "failed";

/**
 * آیتم لیست مقالات — endpoint index فقط این ستون‌ها را select می‌کند
 * (id, article_idea_id, title, status, seo_score, word_count, completed_at, created_at)
 * + رابطه idea با ستون‌های محدود
 */
export interface ArticleListItem {
  id: string;
  article_idea_id: number;
  title: string;
  status: ArticleStatus;
  publish_status?: "draft" | "published" | "failed" | null;
  wp_permalink?: string | null;
  seo_score: number | null;
  word_count: number | null;
  completed_at: string | null;
  published_at?: string | null;
  created_at: string;

  // فقط وقتی publish_status === "failed" مقدار دارد؛ دلیل واقعی شکست انتشار
  // که از جدول article_publish_logs (آخرین تلاش با action=publish) خوانده می‌شود.
  publish_error?: string | null;
  publish_error_at?: string | null;

  idea: {
    id: string;
    title: string;
    entity_name: string;
  } | null;
}

/** پاسخ 202 هنگام شروع تولید مقاله */
export interface ArticleGenerateResponse {
  message: string;
  article_id: string;
}













export interface AgentIdeasSummary {
  enabled: boolean;
  daily_count: number | null;
  last_run_at: string | null;
  next_run_at: string | null;
}

export interface AgentArticlesSummary {
  enabled: boolean;
  daily_limit: number | null;
  last_run_at: string | null;
  next_run_at: string | null;
}

export interface DashboardAgent {
  status: string | null; // idle | working | generating_ideas | waiting_for_scored_ideas | ...
  running_jobs: number;
  queued_jobs: number;
  
  ideas: AgentIdeasSummary;
  articles: AgentArticlesSummary;

}

export interface DashboardStatistics {
  total_articles: number;
  published: number;
  generating: number;
  failed: number;
  average_seo_score: number | null;
  total_words: number;
  keywords_found?: number;
  opportunities_discovered?: number;
  articles_written?: number;
  articles_published?: number;
}

export type DashboardActivityType =
  | "article_generation_started"
  | "article_generated"
  | "idea_created"
  | "keyword_discovered";

export interface DashboardActivity {
  type: DashboardActivityType;
  label: string;
  subject: string | null;
  article_id?: string;
  idea_id?: string;
  at: string;
}

export interface DashboardEntity {
  name: string;
  scope: string | null;
  type: string | null;
}

export interface DashboardScheduleGroup {
  enabled: boolean;
  next_run_at: string | null;
}

export interface DashboardSchedule {
  ideas: DashboardScheduleGroup;
  articles: DashboardScheduleGroup;
  steps_ideas: string[];
  steps_articles: string[];
}




export interface AgentSetting {
  id: number;
  site_id: number;

  ideas_enabled: boolean;
  daily_idea_count: number | null; // فعلاً فقط ذخیره می‌شود، سرویس تولید ایده هنوز استاتیک است
  last_ideas_run_at: string | null;
  next_ideas_run_at: string | null;

  articles_enabled: boolean;
  daily_article_limit: number | null;
  last_articles_run_at: string | null;
  next_articles_run_at: string | null;

  status: string | null;

  created_at: string;
  updated_at: string;
}




// ===== Types مربوط به Dashboard و Agent =====

export interface AgentSetting {
  id: number;
  site_id: number;
  ideas_enabled: boolean;
  daily_idea_count: number | null;
  last_ideas_run_at: string | null;
  next_ideas_run_at: string | null;
  articles_enabled: boolean;
  daily_article_limit: number | null;
  last_articles_run_at: string | null;
  next_articles_run_at: string | null;
  status: string | null;
}
export interface UpdateAgentSettingPayload {
  agent_enabled?: boolean; // ⬅️ اضافه کنید
  /** به‌روزرسانی خودکار مقاله‌ها با داده‌ی سرچ کنسول (فقط Pro) */
  refresh_enabled?: boolean;
  ideas_enabled?: boolean;
  articles_enabled?: boolean;
  daily_idea_count?: number;
  daily_article_limit?: number;
  default_publish_status?: "draft" | "publish";
  daily_start_hour?: number;
  publish_interval_days?: number;
}

export interface DashboardAgent {
  status: string | null;
  running_jobs: number;
    agent_enabled?: boolean;
  enabled?: boolean;

  queued_jobs: number;
  default_publish_status?: "draft" | "publish";
  daily_article_limit?: number | null;
  daily_idea_count?: number | null;
  daily_start_hour?: number; // ساعت شروع فعالیت روزانه (0 تا 23)
  publish_interval_days?: number;
  content_model?: string;
  image_generation_enabled?: boolean;
  image_model?: string;
  images_per_article?: number;
  image_user_prompt?: string | null;
  article_user_prompt?: string | null;   // ⬅️ جدید
  min_sections?: number | null;          // ⬅️ جدید
  max_sections?: number | null; 

  ideas: {
    enabled: boolean;
    daily_count: number | null;
    last_run_at: string | null;
    next_run_at: string | null;
  };
  articles: {
    enabled: boolean;
    daily_limit: number | null;
    last_run_at: string | null;
    next_run_at: string | null;
  };
}
export interface ModelOption {
  id: string;
  label: string;
  description: string;
  proOnly?: boolean;
  recommended?: boolean;
  icon?: string;
  badge?: string;
}
export interface DashboardStatistics {
  total_articles: number;
  published: number;
  generating: number;
  failed: number;
  average_seo_score: number | null;
  total_words: number;
  keywords_found?: number;
  opportunities_discovered?: number;
  articles_written?: number;
  articles_published?: number;
}

export interface DashboardActivity {
  type: "article_generation_started" | "article_generated" | "idea_created" | "keyword_discovered";
  label: string;
  subject: string | null;
  article_id?: string;
  idea_id?: string;
  at: string;
}

export interface DashboardEntity {
  name: string;
  scope: string | null;
  type: string | null;
}

export interface DashboardRecentArticle {
  id: string;
  article_idea_id: number | null;
  title: string;
  status: string;
  seo_score: number | null;
  word_count: number | null;
  completed_at: string | null;
  created_at: string;
  idea?: { id: string; title: string; entity_name: string | null };
}

export interface DashboardData {
  agent: DashboardAgent;
  statistics: DashboardStatistics;
  activities: DashboardActivity[];
  recent_articles: DashboardRecentArticle[];
  article_ideas: ArticleIdea[]; // از همون تایپ ArticleIdea که در پروژه‌ت تعریف شده
  keywords: string[];
  entities: DashboardEntity[];
  schedule: {
    ideas: { enabled: boolean; next_run_at: string | null };
    articles: { enabled: boolean; next_run_at: string | null };
    steps_ideas: string[];
    steps_articles: string[];
  };
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

export type ArticlePublishStatus =
  | 'not_published'
  | 'queued'
  | 'publishing'
  | 'published'
  | 'update_queued'
  | 'updating'
  | 'delete_queued'
  | 'deleting'
  | 'deleted'
  | 'failed';

export interface ArticlePublishLog {
  id: number;
  article_id: number;
  site_id: number;
  status: ArticlePublishStatus;
  wp_post_id: number | null;
  wp_post_url: string | null;
  error_message: string | null;
  attempts: number;
  created_at: string;
  updated_at: string;
}

export interface SyncStatusResult {
  status: ArticlePublishStatus;
  wp_post_id: number | null;
  wp_post_url: string | null;
}





//chat article
// اضافه به src/types.ts

/** نوع بخشی از مقاله که کاربر می‌تونه انتخاب/ویرایش کنه */
export type ArticleTargetType =
  | "section"
  | "faq"
  | "title"
  | "meta_title"
  | "meta_description"
  | "excerpt"
  | "general";

/** انواعی که برای مشخص‌کردنشون target_id لازمه (section و faq) */
export const TARGET_TYPES_REQUIRING_ID: ArticleTargetType[] = ["section", "faq"];

export interface ArticleFaqItem {
  question: string;
  answer: string;
}

export type ArticleChatRole = "user" | "assistant";

export interface ArticleChatMessage {
  id: number;
  article_id: number | string;
  role: ArticleChatRole;
  target_type: ArticleTargetType | null;
  target_id: string | number | null;
  target_label: string | null;
  content: string;
  applied: boolean;
  created_at: string;
  updated_at: string;
}

export type ArticleTargetValue = string | ArticleFaqItem;

export interface ArticleTargetRef {
  type: ArticleTargetType;
  id: string | number | null;
  label: string | null;
  value: ArticleTargetValue;
}

/* ── چت ── */

export interface ArticleChatSendPayload {
  target_type: ArticleTargetType;
  /** برای section و faq الزامی است */
  target_id?: string | number | null;
    model?: string; // ← جدید

  message: string;
}

export interface ArticleChatSendResponse {
  user_message: ArticleChatMessage;
  assistant_message: ArticleChatMessage;
  applied: boolean;
  target: ArticleTargetRef;
}

/* ── ویرایش دستی ── */

export interface ArticleUpdateFieldPayload {
 target_type:
    | "title"
    | "meta_title"
    | "meta_description"
    | "excerpt"
    | "focus_keyword"
    | "slug"
    | "og_title"
    | "og_description"
    | "general";
      value: string;
}

export interface ArticleUpdateSectionPayload {
  heading?: string;
  content: string;
}

export interface ArticleUpdateFaqPayload {
  question: string;
  answer: string;
}

export interface ArticleUpdateFieldResponse {
  target: ArticleTargetRef;
}



// ===== Session-based content conversation =====

export type ContentChatSessionMessageRole = "user" | "assistant";

export type ContentChatSessionMessage = {
  id: string;
  session_id: string;
  article_id: string | null;
  research_id: string | null;
  role: ContentChatSessionMessageRole;
  kind: string;
  content: string;
  label: string | null;
  entity: unknown | null;
  options: unknown[] | null;
  answered: boolean;
  batch: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ContentChatSession = {
  id: string;
  token?: string;
  site_id: string;
  user_id: number;
kind: "analysis" | "chat" | "product";
  title: string;
  messages_count: number | null;
  last_message_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  messages?: ContentChatSessionMessage[] | null;
};

export type ContentChatSessionMessagePayload = {
  role: ContentChatSessionMessageRole;
  kind: string;
  content: string;
  label?: string | null;
  entity?: unknown;
  options?: unknown[] | null;
  answered?: boolean;
  batch?: number | null;
  article_id?: string | null;
  content_research_session_id?: string | null;
  metadata?: Record<string, unknown> | null;
};
