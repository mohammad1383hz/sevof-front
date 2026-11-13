// src/pages/AnalyzePage/index.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { siteService, articleIdeaService, contentResearchService, contentChatSessionService, searchConsoleService, subscriptionService } from "../../services/api";
import type { ArticleIdeaUpdateRequest } from "../../services/api";
import type { Site, WebsiteEntity, ArticleIdea, ContentChatSession, ContentChatSessionMessagePayload } from "../../types";
import ArticleGeneratePage from "../ArticleGeneratePage";
import Layout from "../../components/Layout";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import type { SidebarView } from "../../components/Sidebar";

import type { Phase } from "./types";
import { POLL_STATUSES, POLL_INTERVAL_MS, SCORE_POLL_INTERVAL_MS, SCORE_POLL_MAX_ATTEMPTS } from "./constants";
import { statusToPhase, isValidDomain, smoothScrollTo } from "./utils/helpers";
import { useTypewriter } from "./hooks/useTypewriter";
import {
  UserBubble,
  IdeaRequestUserBubble,
  ProgressBubble,
  SummaryBubble,
  EntitiesBubble,
  IdeasBubble,
  InputBar,
  EmptyState,
  ContentChatBar,
  ContentChatTimeline,
  type ContentChatRequest,
  type ContentChatEntityOption,
  type ContentConversationMessage,
  ContentResearchBubble,
  ContentResearchProgressBubble,
  IdeaGenerationProgressBubble,
  UpgradePlanModal,
} from "./components";
import type { Recommendation } from "./components/ContentResearchBubble";
import { t } from "../../i18n";
import { tx } from "../../i18n/rich";
interface AnalyzePageProps {
  onLogout: () => void;
}

type SessionConversationMessage = ContentConversationMessage & {
  serverId?: string;
  articleId?: string;
};

type ActiveArticle = {
  ideaId?: string;
  articleId?: string;
};

const asPositiveNumber = (value: unknown): number | undefined => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

/** شناسه‌ها توکن (رشته) هستند؛ مقدار خالی یعنی نامشخص */
const asToken = (value: unknown): string | undefined => (
  typeof value === "string" && value !== "" ? value : undefined
);

const messageResearchId = (message: unknown): string | undefined => {
  const row = (message || {}) as { research_id?: unknown; content_research_session_id?: unknown };
  return asToken(row.research_id ?? row.content_research_session_id);
};

const messageIdeaId = (message: unknown): string | undefined => {
  const row = (message || {}) as {
    idea_id?: unknown;
    metadata?: Record<string, unknown> | null;
  };
  return asToken(row.metadata?.idea_id ?? row.idea_id);
};

const messageBatch = (message: unknown): number | undefined => (
  asPositiveNumber((message as { batch?: unknown } | null)?.batch)
);

type ResearchChat = {
  id: string;
  type: "keyword_clusters" | "competitor_gaps";
  label: string;
  message: string;
  status: "queued" | "processing" | "done" | "failed";
  error: string | null;
  result: {
    clusters?: any[];
    competitors?: any[];
    gaps?: any[];
    summary?: string | null;
    site_analysis?: { status?: string; pages_reviewed?: string[]; strengths?: string[]; weaknesses?: string[] };
recommendations?: Recommendation[];
    manus_task_url?: string | null;
  } | null;
};

type SearchConsolePropertyState = {
  id: number;
  property_url: string;
  permission_level: string | null;
  sync_status: "idle" | "queued" | "syncing" | "done" | "failed";
  last_synced_at: string | null;
  last_sync_error: string | null;
};

type SearchConsoleQueryState = {
  query: string;
  page: string | null;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number | null;
};

const AnalyzePage: React.FC<AnalyzePageProps> = ({ }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const siteIdParam = searchParams.get("site");
  const articleIdParam = searchParams.get("article");
  const ideaIdParam = searchParams.get("idea");
  const chatSessionIdParam = searchParams.get("chat");
  const newChatParam = searchParams.get("new_chat") === "1";
  const isNewFlow = location.pathname === "/analyze" || searchParams.get("new") === "1";

  /* ── Input ── */
  const [domain, setDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideasRequested, setIdeasRequested] = useState(false);
  const [chatRequests, setChatRequests] = useState<Array<ContentChatRequest & { batch: number }>>([]);
  const [conversationMessages, setConversationMessages] = useState<SessionConversationMessage[]>([]);
  const [chatSession, setChatSession] = useState<ContentChatSession | null>(null);
  const chatSessionRef = useRef<ContentChatSession | null>(null);
  const [isDraftChat, setIsDraftChat] = useState(false);
  // چون isDraftChat یک state است، بعد از setIsDraftChat(...) بلافاصله (در همان
  // تیک همزمان) به مقدار جدید خوانده نمی‌شود. جاهایی مثل persistMessage باید
  // بلافاصله بعد از prepareLocalDraft/selectChatSession از مقدار درست باخبر
  // باشند (مثلاً وقتی برای یک ایده‌ی دوم سشن جدید ساخته می‌شود و بلافاصله
  // اولین پیام برایش ارسال می‌شود)، پس یک ref موازی نگه می‌داریم.
  const isDraftChatRef = useRef(false);
  const setDraftChatState = (value: boolean) => {
    isDraftChatRef.current = value;
    setIsDraftChat(value);
  };
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [conversationsRefreshKey, setConversationsRefreshKey] = useState(0);
  const [activeArticle, setActiveArticle] = useState<ActiveArticle | null>(null);
  const [articleMobileHeaderExtra, setArticleMobileHeaderExtra] = useState<React.ReactNode>(null);  // ایده‌هایی که برایشان تولید مقاله همین الان (در همین سشن) شروع شده. فقط برای
  // غیرفعال‌کردن آنیِ دکمه‌ی «تولید مقاله» تا قبل از رسیدن وضعیت نهایی است.
  // منبع قطعی و پایدار (حتی بعد از رفرش صفحه) از بک‌اند می‌آید:
  // idea.has_article / idea.status === "used" — در IdeasBubble استفاده می‌شود
  // و باعث می‌شود دکمه به «مشاهده مقاله» تبدیل شود.
  const [ideaArticleStartedIds, setIdeaArticleStartedIds] = useState<Set<string>>(new Set());
  const markIdeaArticleStarted = (ideaId: string) => {
    setIdeaArticleStartedIds((current) => {
      if (current.has(ideaId)) return current;
      const next = new Set(current);
      next.add(ideaId);
      return next;
    });
  };
  const sessionBootstrapRef = useRef<string | null>(null);
  const justAnalyzedRef = useRef(false);
  const [preparedPrompt, setPreparedPrompt] = useState<string | null>(null);
  const [researchChats, setResearchChats] = useState<ResearchChat[]>([]);
  const researchPollRefs = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  /* ── Google Search Console ── */
  const [gscConnectionStatus, setGscConnectionStatus] = useState<"connected" | "expired" | "failed" | null>(null);
  const [gscConnectionError, setGscConnectionError] = useState<string | null>(null);
  const [gscProperty, setGscProperty] = useState<SearchConsolePropertyState | null>(null);
  const [gscProperties, setGscProperties] = useState<Array<{ property_url: string; permission_level: string | null }>>([]);
  const [gscQueries, setGscQueries] = useState<SearchConsoleQueryState[]>([]);
  const [gscLoading, setGscLoading] = useState(false);
  const gscPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Site / Phase ── */
  const [site, setSite] = useState<Site | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Streaming ── */
  const [shouldStream, setShouldStream] = useState(false);
  const [streamDone, setStreamDone] = useState(false);

  /* ── Entity ── */
  const [entity, setEntity] = useState<WebsiteEntity | null>(null);
  const [entityLoading, setEntityLoading] = useState(false);
const [selectedEntity, setSelectedEntity] = useState<ContentChatEntityOption | null>(null);
const [submittingTrend, setSubmittingTrend] = useState(false);
  /* ── Ideas ── */
  const [ideas, setIdeas] = useState<ArticleIdea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const ideasPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Score polling ── */
  const scorePollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scorePollAttempts = useRef(0);

  /* ── Helpers: stop polls ── */
  const stopPolling = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
  const stopIdeasPolling = () => { if (ideasPollRef.current) { clearInterval(ideasPollRef.current); ideasPollRef.current = null; } };
  const stopScorePolling = () => { if (scorePollRef.current) { clearInterval(scorePollRef.current); scorePollRef.current = null; } };
  const stopResearchPolling = (sessionId?: string) => {
    if (sessionId !== undefined) {
      const timer = researchPollRefs.current.get(sessionId);
      if (timer) clearInterval(timer);
      researchPollRefs.current.delete(sessionId);
      return;
    }

    researchPollRefs.current.forEach((timer) => clearInterval(timer));
    researchPollRefs.current.clear();
  };
  const stopGscPolling = () => {
    if (gscPollRef.current) {
      clearInterval(gscPollRef.current);
      gscPollRef.current = null;
    }
  };

  const startResearchPolling = (siteId: string, sessionId: string) => {
    if (researchPollRefs.current.has(sessionId)) return;
    const timer = setInterval(() => pollContentResearch(siteId, sessionId), 2500);
    researchPollRefs.current.set(sessionId, timer);
  };

  /* ── Idea generation status ── */
  const [ideaGenStatus, setIdeaGenStatus] = useState<string | null>(null);
  const [ideaGenError, setIdeaGenError] = useState<string | null>(null);
  const [ideaRetrying, setIdeaRetrying] = useState(false);
const [currentBatch, setCurrentBatch] = useState(0); // از site.idea_generation_batch میاد
// برخلاف currentBatch (که مخصوص نمایش/سشن جاری است و با هر سشن جدید یا
// درفت تازه ریست می‌شود)، این مقدار هرگز با تعویض یا ساخت سشن عوض نمی‌شود.
// تنها منبع حقیقت برای «آیا کاربر رایگان قبلاً از سهمیه‌اش استفاده کرده»
// همین است و همیشه مستقیماً از داده‌ی واقعی بک‌اند (site.idea_generation_batch)
// می‌آید — سشن اصلاً در این تصمیم نقشی ندارد.
const [totalIdeaBatchesUsed, setTotalIdeaBatchesUsed] = useState(0);  const ideaStatusPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ideasByBatch = useMemo(() => {
    const map = new Map<number, ArticleIdea[]>();
    for (const idea of ideas) {
      const arr = map.get(idea.batch) || [];
      arr.push(idea);
      map.set(idea.batch, arr);
    }
    return map;
  }, [ideas]);

  const visibleIdeaBatches = useMemo(() => {
    const batches = new Set<number>();
    conversationMessages.forEach((message) => {
      if (message.batch) batches.add(message.batch);
    });
    chatRequests.forEach((request) => batches.add(request.batch));
    return Array.from(batches).sort((a, b) => a - b);
  }, [conversationMessages, chatRequests]);

  const mainRef = useRef<HTMLElement | null>(null);
  const autoScrollEnabled = useRef(true);
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = mainRef.current;
      if (el) smoothScrollTo(el, el.scrollHeight, 500);
    });
  };

  const scrollToEntityRequest = () => {
    autoScrollEnabled.current = false;
    requestAnimationFrame(() => {
      const container = mainRef.current;
      const request = container?.querySelector<HTMLElement>("[data-entity-request=\"true\"]");
      if (!container || !request) {
        scrollToBottom();
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const requestRect = request.getBoundingClientRect();
      const targetTop = container.scrollTop + requestRect.top - containerRect.top - 16;
      smoothScrollTo(container, Math.max(0, targetTop), 500);
    });
  };

  /* ── Navigation کوچک بین پیام‌های قبلی سشن (کنترل سمت راست) ──
     فقط برای جابه‌جایی سریع؛ هیچ منطق یا UI موجودی را تغییر نمی‌دهد.

     نکته‌ی مهم (باگ نسخه‌ی قبل): پیدا کردن هدف بر اساس «وسط صفحه» باعث
     می‌شد بعد از یک بار اسکرول، همان پیام دوباره به‌عنوان نزدیک‌ترین انتخاب
     شود و دکمه‌ها گاهی هیچ حرکتی نکنند. برای رفع کامل این مشکل، همیشه
     نزدیک‌ترین پیام به «لبه‌ی بالای ناحیه دید» پیدا می‌شود و سپس دقیقاً
     یک پله (بر اساس جهت) جلوتر یا عقب‌تر می‌رویم؛ این روش هرگز گیر نمی‌کند. */
  const CHAT_NAV_TOP_OFFSET = 24;
  const CHAT_NAV_EPSILON = 6;

  const [chatNavCanUp, setChatNavCanUp] = useState(false);
  const [chatNavCanDown, setChatNavCanDown] = useState(false);

  const getChatMessageEls = (): HTMLElement[] => {
    const container = mainRef.current;
    if (!container) return [];
    return Array.from(container.querySelectorAll<HTMLElement>('[data-chat-message="true"]'));
  };

  const updateChatNavAvailability = () => {
    const el = mainRef.current;
    if (!el) {
      setChatNavCanUp(false);
      setChatNavCanDown(false);
      return;
    }
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setChatNavCanUp(el.scrollTop > CHAT_NAV_TOP_OFFSET);
    setChatNavCanDown(distanceFromBottom > CHAT_NAV_TOP_OFFSET);
  };

  const scrollChatMessageIntoView = (container: HTMLElement, el: HTMLElement, duration = 400) => {
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const rawTarget = container.scrollTop + elRect.top - containerRect.top - 16;
    const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
    smoothScrollTo(container, Math.min(Math.max(0, rawTarget), maxScroll), duration);
  };

  const jumpToAdjacentMessage = (direction: 1 | -1) => {
    const container = mainRef.current;
    if (!container) return;
    const els = getChatMessageEls();
    if (els.length === 0) return;

    autoScrollEnabled.current = false;

    const referenceTop = container.getBoundingClientRect().top + CHAT_NAV_TOP_OFFSET;

    // نزدیک‌ترین پیام به لبه‌ی بالای ناحیه دید را پیدا کن
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    let nearestOffset = 0;
    els.forEach((el, index) => {
      const offset = el.getBoundingClientRect().top - referenceTop;
      const distance = Math.abs(offset);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
        nearestOffset = offset;
      }
    });

    let targetIndex: number;
    if (direction === 1) {
      // اگه پیامِ نزدیک هنوز پایین‌تر از لبه‌ی بالاست (هنوز کاملاً بهش نرسیدیم)،
      // خودش هدف بعدی است؛ در غیر این صورت برو سراغ پیام بعدی.
      targetIndex = nearestOffset > CHAT_NAV_EPSILON ? nearestIndex : nearestIndex + 1;
    } else {
      targetIndex = nearestOffset < -CHAT_NAV_EPSILON ? nearestIndex : nearestIndex - 1;
    }
    targetIndex = Math.max(0, Math.min(els.length - 1, targetIndex));

    scrollChatMessageIntoView(container, els[targetIndex]);
    // نوار بالا/پایین بعد از پایان انیمیشن به‌روزرسانی می‌شود (رویداد scroll)
  };

  const jumpToLatestMessage = () => {
    autoScrollEnabled.current = true;
    scrollToBottom();
  };

  const setActiveChatSession = (session: ContentChatSession | null) => {
    chatSessionRef.current = session;
    setChatSession(session);
  };

  const toSessionMessage = (message: ContentChatSessionMessagePayload, localId?: string): SessionConversationMessage => ({
    id: localId || `session-message-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role: message.role,
    kind: message.kind as ContentConversationMessage["kind"],
    message: message.content,
    label: message.label || undefined,
    entity: (message.entity as ContentChatEntityOption | null | undefined) || undefined,
    options: (message.options as ContentChatEntityOption[] | null | undefined) || undefined,
    answered: message.answered,
    batch: messageBatch(message),
    researchId: messageResearchId(message),
    articleId: asToken(message.article_id),
    ideaId: messageIdeaId(message),
  });

  const persistMessage = async (message: ContentChatSessionMessagePayload): Promise<SessionConversationMessage | null> => {
    if (!site) return null;

    const activeSiteId = site.id;
    const activeSession = chatSessionRef.current;
    const wasDraft = !activeSession && isDraftChatRef.current;
    if (!activeSession && !wasDraft) return null;
    const requestBootstrapKey = `${activeSiteId}:${activeSession?.id ?? "new"}`;

    const response = activeSession
      ? await contentChatSessionService.addMessage(activeSiteId, activeSession.id, message)
      : await contentChatSessionService.firstMessage(activeSiteId, message);

    // اگر کاربر در زمان ارسال پیام سایت را عوض کرده، پاسخ قبلی دیگر معتبر نیست.
    if (sessionBootstrapRef.current !== requestBootstrapKey) return null;

    if (!response.success || !response.data?.message) {
      setSessionError(response.message || t("analyze.errors.saveMessage"));
      return null;
    }

    const persisted = response.data.message;
    if (response.data.session) {
      setActiveChatSession(response.data.session);
      setDraftChatState(false);
      if (wasDraft) navigate(`/dashboard?site=${activeSiteId}&chat=${response.data.session.id}`, { replace: true, state: { openConversation: true } });
    }
    setConversationsRefreshKey((key) => key + 1);
    return {
      ...toSessionMessage(message, `session-message-${persisted.id}`),
      serverId: persisted.id,
      articleId: asToken(persisted.article_id) || asToken(message.article_id),
      researchId: messageResearchId(persisted) || messageResearchId(message),
      ideaId: messageIdeaId(persisted) || messageIdeaId(message),
      batch: messageBatch(persisted) || messageBatch(message),
    };
  };

  const appendPersistedMessage = async (
    localMessage: SessionConversationMessage,
    payload: ContentChatSessionMessagePayload,
  ): Promise<SessionConversationMessage> => {
    const persisted = await persistMessage(payload);
    const message = persisted || localMessage;
    setConversationMessages((messages) => [...messages, message]);
    return message;
  };

  const restoreSessionResearch = async (siteId: string, sessionToken: string, persistedMessages: any[]) => {
    const isCurrentSession = () => sessionBootstrapRef.current === `${siteId}:${sessionToken}`;
    const uniqueResearch = new Map<string, any>();
    for (const message of persistedMessages) {
      const researchId = messageResearchId(message);
      if (researchId) uniqueResearch.set(researchId, message);
    }

    const requests = Array.from(uniqueResearch.entries()).map(([id, message]) => {
      const mode = message.metadata?.mode;
      return {
        id,
        type: mode === "keyword_clusters" ? "keyword_clusters" as const : "competitor_gaps" as const,
        label: message.label || (mode === "keyword_clusters" ? t("analyze.research.clusters") : t("analyze.chatBar.gap.label")),
        message: message.content,
      };
    });

    if (!isCurrentSession()) return;
    setResearchChats(requests.map((item) => ({
      ...item,
      status: "queued" as const,
      error: null,
      result: null,
    })));

    await Promise.all(requests.map(async (item) => {
      const response = await contentResearchService.show(siteId, item.id);
      if (!isCurrentSession()) return;

      if (!response.success || !response.data?.session) {
        setResearchChats((current) => current.map((research) => research.id === item.id ? {
          ...research,
          status: "failed",
          error: response.message || t("analyze.errors.researchResults"),
        } : research));
        return;
      }

      const session = response.data.session;
      const resolvedType = session.type === "keyword_clusters" || session.type === "competitor_gaps"
        ? session.type
        : item.type;
      setResearchChats((current) => current.map((research) => research.id === item.id ? {
        ...research,
        type: resolvedType,
        status: session.status,
        error: session.error,
        result: response.data?.result ?? null,
      } : research));

      if (session.status === "queued" || session.status === "processing") startResearchPolling(siteId, item.id);
    }));
  };

  const hydrateSession = async (siteId: string, session: ContentChatSession) => {
    const sessionToken = String(session.id);
    const isCurrentSession = () => sessionBootstrapRef.current === `${siteId}:${sessionToken}`;
    if (!isCurrentSession()) return null;

    const response = session.messages
      ? ({ success: true, data: { session } } as any)
      : await contentChatSessionService.show(siteId, session.id);
    if (!isCurrentSession()) return null;
    const loaded = response.success ? response.data?.session : null;
    if (!loaded) {
      setSessionError(response.message || t("analyze.errors.history"));
      return null;
    }

    const persistedMessages = [...((loaded.messages || []) as any[])].sort((a, b) => {
      const aTime = Date.parse(a.created_at || "");
      const bTime = Date.parse(b.created_at || "");
      if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) return aTime - bTime;
      // توکن ULID به ترتیب زمان ساخت مرتب می‌شود
      return String(a.id || "").localeCompare(String(b.id || ""));
    });
    const mappedMessages: SessionConversationMessage[] = persistedMessages.map((message) => ({
      id: `session-message-${message.id}`,
      serverId: message.id,
      role: message.role,
      kind: message.kind as ContentConversationMessage["kind"],
      message: message.content,
      label: message.label || undefined,
      entity: message.entity || undefined,
      options: message.options || undefined,
      answered: Boolean(message.answered),
      batch: messageBatch(message),
      researchId: messageResearchId(message),
      articleId: asToken(message.article_id),
      ideaId: messageIdeaId(message),
    }));

    if (!isCurrentSession()) return null;
    setActiveChatSession({ ...loaded, messages: persistedMessages });
    setConversationMessages(mappedMessages);
    const lastEntityMessage = [...persistedMessages].reverse().find((message) => message.entity?.name && message.entity?.scope);
    setSelectedEntity((lastEntityMessage?.entity as ContentChatEntityOption | undefined) || null);
    await restoreSessionResearch(siteId, String(loaded.id), persistedMessages);
    if (!isCurrentSession()) return null;
    setChatRequests(persistedMessages
      .filter((message) => message.role === "user" && messageBatch(message))
      .map((message) => ({
        message: message.content,
        mode: (message.metadata?.mode || "trend_opportunities") as ContentChatRequest["mode"],
        label: message.label || t("analyze.chat.yourRequest"),
        entity_name: message.entity?.name,
        entity_scope: message.entity?.scope,
        batch: messageBatch(message) as number,
      })));

    const batches = persistedMessages.map(messageBatch).filter((batch): batch is number => batch !== undefined);
    setCurrentBatch(batches.length ? Math.max(...batches) : 0);
    setIdeasRequested(batches.length > 0);

    let latestArticle: ActiveArticle | null = null;
    let requestedArticle: ActiveArticle | null = null;
    let requestedIdeaArticle: ActiveArticle | null = null;
    const requestedArticleId = asToken(articleIdParam);
    const requestedIdeaId = asToken(ideaIdParam);

    for (const message of persistedMessages) {
      const articleId = asToken(message.article_id);
      const ideaId = messageIdeaId(message);
      if (articleId) {
        const article = { articleId, ideaId };
        latestArticle = article;
        if (requestedArticleId === articleId) requestedArticle = article;
        if (requestedIdeaId && ideaId === requestedIdeaId) requestedIdeaArticle = article;
      } else if (requestedIdeaId && ideaId === requestedIdeaId && message.kind === "article_request") {
        requestedIdeaArticle = { ideaId };
      }
    }
    if (!isCurrentSession()) return null;
    setActiveArticle(requestedArticle || requestedIdeaArticle || latestArticle);
    return loaded;
  };

  const selectChatSession = async (session: ContentChatSession, updateUrl = true) => {
    if (!site) return;
    if (!isNewFlow && siteIdParam && String(site.id) !== siteIdParam) return;

    const activeSiteId = site.id;
    const sessionBootstrapKey = `${activeSiteId}:${session.id}`;
    setSessionLoading(true);
    setSessionError(null);
    stopIdeaStatusPolling();
    stopResearchPolling();
    setActiveArticle(null);
    setSelectedEntity(null);
    setConversationMessages([]);
    setChatRequests([]);
    setResearchChats([]);
    setIdeasRequested(false);
    setCurrentBatch(0);
    setIdeaGenStatus(null);
    setIdeaGenError(null);
    setPreparedPrompt(null);
    setActiveChatSession(session);
    setDraftChatState(false);
    sessionBootstrapRef.current = sessionBootstrapKey;
    await hydrateSession(activeSiteId, session);

    // پاسخ سشن قدیمی نباید پس از تغییر سایت، state یا URL را بازنویسی کند.
    if (sessionBootstrapRef.current !== sessionBootstrapKey) return;

    setSessionLoading(false);
    if (updateUrl) navigate(`/dashboard?site=${activeSiteId}&chat=${session.id}`, { replace: true, state: { openConversation: true } });
  };

const prepareLocalDraft = (siteId: string) => {
    justAnalyzedRef.current = false;
    stopIdeaStatusPolling();
    stopResearchPolling();
    sessionBootstrapRef.current = `${siteId}:new`;
    setSessionError(null);
    setActiveChatSession(null);
    setDraftChatState(true);
    setConversationMessages([]);
    setChatRequests([]);
    setResearchChats([]);
    setIdeasRequested(false);
    setCurrentBatch(0);
    setIdeaGenStatus(null);
    setIdeaGenError(null);
    setPreparedPrompt(null);
    setSelectedEntity(null);
    setActiveArticle(null);
    setSessionLoading(false);
};

const ensureChatSession = async (siteId: string) => {
    if (!isNewFlow && siteIdParam && String(siteId) !== siteIdParam) return;

    const hasExplicitSession = Boolean(chatSessionIdParam) && !newChatParam;

    // (۱) یک chat id مشخص در URL هست — همون سشن رو از سرور بگیر و نشون بده.
    if (hasExplicitSession) {
      const bootstrapKey = `${siteId}:${chatSessionIdParam}`;
      if (chatSession && chatSession.site_id === siteId && String(chatSession.id) === chatSessionIdParam) return;
      if (sessionBootstrapRef.current === bootstrapKey) return;
      sessionBootstrapRef.current = bootstrapKey;

      setSessionLoading(true);
      setSessionError(null);
      const response = await contentChatSessionService.show(siteId, chatSessionIdParam!);
      if (!response.success || !response.data?.session) {
        if (sessionBootstrapRef.current === bootstrapKey) {
          setSessionError(response.message || t("analyze.errors.history"));
          prepareLocalDraft(siteId);
        }
        return;
      }

      if (sessionBootstrapRef.current !== bootstrapKey) return;
      await selectChatSession(response.data.session, false);
      return;
    }

    // (۲) کاربر صراحتاً «گفتگوی جدید» زده (new_chat=1) — همیشه درفت خالی،
    // حتی اگر پرچمِ تحلیلِ تازه هم ست باشه؛ انتخاب صریح کاربر اولویت داره.
    if (newChatParam) {
      justAnalyzedRef.current = false;
      const bootstrapKey = `${siteId}:new`;
      if (sessionBootstrapRef.current === bootstrapKey && isDraftChatRef.current) return;
      prepareLocalDraft(siteId);
      return;
    }

    // (۳) نه chat هست نه new_chat. اگر همین الان نتیجه‌ی مستقیمِ یک
    // ارسال/تلاش‌مجددِ تازه‌ی دامنه‌ست (پرچم true)، سشن «اطلاعات سایت»
    // (kind: analysis) را پیدا یا بساز و نشانش بده تا نتایج تحلیل از دست
    // نرود. این پرچم فقط یک‌بار مصرف می‌شود.
    if (justAnalyzedRef.current) {
      justAnalyzedRef.current = false;

      const bootstrapKey = `${siteId}:analysis`;
      if (chatSession && chatSession.site_id === siteId && chatSession.kind === "analysis" && !isDraftChatRef.current) return;
      if (sessionBootstrapRef.current === bootstrapKey) return;
      sessionBootstrapRef.current = bootstrapKey;

      setSessionLoading(true);
      setSessionError(null);

      const listResponse = await contentChatSessionService.list(siteId);
      if (sessionBootstrapRef.current !== bootstrapKey) return;

      const sessions = listResponse.success ? (listResponse.data?.sessions ?? []) : [];
      let analysisSession = sessions.find((session) => session.kind === "analysis") ?? null;

      if (!analysisSession) {
        const createResponse = await contentChatSessionService.create(siteId, { kind: "analysis" });
        if (sessionBootstrapRef.current !== bootstrapKey) return;
        if (!createResponse.success || !createResponse.data?.session) {
          setSessionError(createResponse.message || t("analyze.errors.startSession"));
          prepareLocalDraft(siteId);
          return;
        }
        analysisSession = createResponse.data.session;
      }

      if (sessionBootstrapRef.current !== bootstrapKey) return;
      await selectChatSession(analysisSession, true);
      return;
    }

    // (۴) پیش‌فرض برای هر ورود دیگر — لاگین معمولی، رفرش صفحه، یا سوییچ
    // دامنه از سایدبار — دقیقاً رفتار قدیمی: یک درفت خالی نشان بده. سشن
    // تحلیل گم نمی‌شود، فقط دیگر خودکار باز نمی‌شود؛ کاربر از لیست
    // گفتگوهای سایدبار می‌تواند هر وقت خواست بازش کند.
    const bootstrapKey = `${siteId}:new`;
    if (sessionBootstrapRef.current === bootstrapKey && isDraftChatRef.current) return;
    prepareLocalDraft(siteId);
    const draftParams = new URLSearchParams(searchParams);
    draftParams.set("site", String(siteId));
    draftParams.set("new_chat", "1");
    navigate(`/dashboard?${draftParams.toString()}`, {
      replace: true,
      state: { openArticle: Boolean(articleIdParam || ideaIdParam) },
    });
};  const createNewChatSession = async () => {
    if (!site) return;
    // توجه: قبلاً اینجا `|| sessionLoading` هم چک می‌شد و اگر گفتگوی قبلی هنوز
    // در حال fetch شدن بود، کلیک بی‌صدا نادیده گرفته می‌شد. همین باعث می‌شد
    // کاربر مجبور شود دوبار کلیک کند: کلیک اول هیچ اتفاقی نمی‌افتاد، بعد
    // fetchِ قدیمی (که هنوز در پرواز بود) با تاخیر resolve می‌شد و مقاله/گفتگوی
    // قبلی را (اشتباهاً) روی صفحه می‌آورد، و فقط کلیک دوم واقعاً یک گفتگوی
    // خالی جدید می‌ساخت. حالا prepareLocalDraft بلافاصله sessionBootstrapRef را
    // عوض می‌کند، پس هر fetch در حال پرواز از قبل، توسط چک isCurrentSession()
    // در hydrateSession/ensureChatSession باطل (stale) تشخیص داده و نادیده
    // گرفته می‌شود؛ دیگر نیازی به صبر کردن برای پایان sessionLoading نیست.
    prepareLocalDraft(site.id);
    navigate(`/dashboard?site=${site.id}&new_chat=1`, { replace: true });
  };

  /* ── بارگذاری آخرین سایت کاربر هنگام ورود ── */
useEffect(() => {
  let cancelled = false;

  (async () => {
    if (!isNewFlow && siteIdParam && site && String(site.id) === siteIdParam) return;

    setBootstrapping(true);
    stopPolling();
    stopIdeasPolling();
    stopScorePolling();
    stopIdeaStatusPolling();
    stopResearchPolling();
    stopGscPolling();

    setSite(null);
    setPhase("idle");
    setDomain("");
    setEntity(null);
    setSelectedEntity(null);
    setConversationMessages([]);
    setActiveChatSession(null);
    setDraftChatState(false);
    setSessionError(null);
    setActiveArticle(null);
    setPreparedPrompt(null);
    setIdeas([]);
    setIdeasRequested(false);
    setChatRequests([]);
    setResearchChats([]);
    setGscConnectionStatus(null);
    setGscConnectionError(null);
    setGscProperty(null);
    setGscProperties([]);
    setGscQueries([]);
    setShouldStream(false);
    setStreamDone(false);
    setIdeaGenStatus(null);
    setIdeaGenError(null);
    setCurrentBatch(0);
    setTotalIdeaBatchesUsed(0); // ← سایت عوض شده، سهمیه هم باید از نو از بک‌اند خوانده شود
    justAnalyzedRef.current = false; // ← این یک خط اضافه شد

    sessionBootstrapRef.current = null;
    setError(null);

    if (isNewFlow) {
      setBootstrapping(false);
      return;
    }

    let loadedSite: Site | null = null;

    if (siteIdParam) {
      const res = await siteService.show(siteIdParam);
      if (res.success && res.data) {
        loadedSite = (res.data as any).site || (res.data as any).data;
      }
    } else {
      const res = await siteService.list(1);
      if (res.success && res.data?.data?.length) {
        loadedSite = res.data.data[0];
      }
    }

    if (cancelled) return;

    setBootstrapping(false);
    if (!loadedSite) return;

    setSite(loadedSite);
    const nextPhase = statusToPhase(loadedSite.status);
    setPhase(nextPhase);

    if (nextPhase === "done") {
      setShouldStream(false);
      setStreamDone(true);
    }

    setCurrentBatch(loadedSite.idea_generation_batch || 0);
    setTotalIdeaBatchesUsed(loadedSite.idea_generation_batch || 0); // ← منبع واقعی سهمیه
    setIdeaGenStatus(loadedSite.idea_generation_status);
    setIdeaGenError(loadedSite.idea_generation_error);

    if (POLL_STATUSES.has(loadedSite.status)) {
      stopPolling();
      pollRef.current = setInterval(() => pollSite(loadedSite!.id), POLL_INTERVAL_MS);
    }
  })();

  return () => {
    cancelled = true;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [siteIdParam, isNewFlow]);
  const sortIdeas = (list: ArticleIdea[]) =>
    list.slice().sort((a, b) => {
      const aS = a.seo_score !== null && a.seo_score !== undefined;
      const bS = b.seo_score !== null && b.seo_score !== undefined;
      if (aS && bS) return (b.seo_score as number) - (a.seo_score as number);
      if (aS) return -1;
      if (bS) return 1;
      return b.priority - a.priority;
    });

  const stopIdeaStatusPolling = () => {
    if (ideaStatusPollRef.current) { clearInterval(ideaStatusPollRef.current); ideaStatusPollRef.current = null; }
  };

const pollIdeaStatus = async (siteId: string) => {
  const res = await siteService.show(siteId);
  if (!res.success || !res.data) return;
  const s = res.data.site;
  setIdeaGenStatus(s.idea_generation_status);
  setIdeaGenError(s.idea_generation_error);
  setCurrentBatch(s.idea_generation_batch);
  setTotalIdeaBatchesUsed(s.idea_generation_batch); // ← منبع واقعی سهمیه، مستقل از سشن

  if (s.idea_generation_error) { stopIdeaStatusPolling(); return; }
  if (s.idea_generation_status === "done") {
    stopIdeaStatusPolling();
    await loadIdeas(siteId);
  }
};

  const [isFreePlan, setIsFreePlan] = useState(true);
  const [remainingTokens, setRemainingTokens] = useState<number | null>(null);
  const ESTIMATED_IDEA_CERDIT = 5;
  useEffect(() => {
    (async () => {
      const res = await subscriptionService.me();
      if (res.success && res.data) {
        const sub = res.data.subscription;
        setIsFreePlan(sub.is_free);
        setRemainingTokens(sub.has_active_subscription ? sub.remaining_credit : 0);
      }
    })();
  }, []);

const ideaGenLimitReached = isFreePlan
  ? totalIdeaBatchesUsed >= 3
  : remainingTokens !== null && remainingTokens < ESTIMATED_IDEA_CERDIT;
  // مودال مشترک «اعتبار/اشتراک کافی نیست» — هر جا کاربر به سقف رایگان یا
  // کمبود اعتبار برخورد کند (ایده‌های ترند، خوشه‌های کلمات کلیدی، شکاف
  // محتوایی رقبا) از همین یک مودال استفاده می‌شود تا مسیر خرید اشتراک/
  // اعتبار همیشه یکسان و واضح باشد.
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeModalMessage, setUpgradeModalMessage] = useState<string | undefined>(undefined);
  const openUpgradeModal = (message?: string) => {
    setUpgradeModalMessage(message);
    setUpgradeModalOpen(true);
  };
  const closeUpgradeModal = () => setUpgradeModalOpen(false);
  // بنر مشترک محدودیت اعتبار/اشتراک — همه‌جا (نوار پایین چت) از همین استفاده
// می‌شود تا هم پیام یکسان باشد و هم لینک واقعی به صفحه‌ی خرید اشتراک داشته
// باشیم؛ اول به‌صراحت می‌گوید چت غیرفعال شده ولی تولید مقاله همچنان ممکن
// است، بعد لینک واقعی /subscription را نشان می‌دهد.
const creditLimitBanner = (
  <span>
    {tx("analyze.credits.banner", {
      still: <span className="font-bold text-[#5B47FB]">{t("analyze.credits.bannerStill")}</span>,
    })}
    {" "}
    <Link
      to="/subscription"
      className="font-black text-[#5B47FB] underline underline-offset-2 hover:text-[#4935E0]"
    >
      {t("analyze.credits.viewPlans")}
    </Link>
  </span>
);
  const handleUpgradeNavigate = () => {
    setUpgradeModalOpen(false);
    // TODO: مسیر واقعی صفحه‌ی خرید/ارتقا پلن پروژه را اینجا جایگزین کنید.
    navigate("/subscription");
  };

  const enrichEntityOption = (option: ContentChatEntityOption): ContentChatEntityOption => {
    const source = option.scope === "primary"
      ? entity?.primary_entity
      : entity?.core_entities?.find((candidate) => candidate.name === option.name);

    return {
      ...option,
      type: option.type || source?.type || null,
      description: option.description || source?.description || "",
      links: option.links || source?.links || [],
    };
  };
const requestIdeasFromGap = async (gap: {
  title: string;
  query: string;
  description: string;
  recommended_angle: string;
}) => {
  const message = t("analyze.gapPrompt", { title: gap.title, query: gap.query, details: gap.description, angle: gap.recommended_angle });

  await handleContentChat({
    message,
    mode: "trend_opportunities",
    label: t("analyze.gapLabel", { title: gap.title }),
  });
};
const submitTrendRequest = async (params: {
  message: string;
  label: string;
  entityName?: string;
  entityScope?: "primary" | "core";
  requestMessageId?: string;
  requestServerId?: string;
}): Promise<boolean> => {
  if (!site) return false;

  setSubmittingTrend(true);

  const res = await articleIdeaService.generate(site.id, {
    mode: "trend_opportunities",
    prompt: params.message,
    entity_name: params.entityName,
    entity_scope: params.entityScope,
  });

  if (!res.success) {
    setSubmittingTrend(false);
    if (params.requestMessageId) {
      setConversationMessages((messages) => messages.map((item) => (
        item.id === params.requestMessageId ? { ...item, pending: false } : item
      )));
    }
    const errorPayload = (res.data || {}) as any;

    const entitySelectionRequired = errorPayload.code === "entity_required" || errorPayload.action === "select_entity";

    const isCreditError = !entitySelectionRequired && (
      (res as any).status === 402
      || ["insufficient_credit", "no_active_subscription", "plan_limit_reached", "subscription_required"].includes(errorPayload.code)
    );

    if (entitySelectionRequired) {
      const options = ((errorPayload.entities || []) as ContentChatEntityOption[]).map(enrichEntityOption);
      setSelectedEntity(null);
      const entityMessage = {
        id: `entity-request-${Date.now()}`,
        role: "assistant" as const,
        kind: "entity_request" as const,
        message: errorPayload.message || t("analyze.entity.pickPrompt"),
        options,
      };
      await appendPersistedMessage(entityMessage, {
        role: "assistant",
        kind: "entity_request",
        content: entityMessage.message,
        options,
        metadata: { mode: "trend_opportunities" },
      });
    } else {
           const errorMessageText = isCreditError
  ? (isFreePlan
    ? t("analyze.credits.chatFree")
    : t("analyze.credits.chatPaid"))
  : (res.message || t("analyze.errors.research"));
      const errorMessage = {
        id: `content-error-${Date.now()}`,
        role: "assistant" as const,
        kind: "error" as const,
        message: errorMessageText,
      };
      await appendPersistedMessage(errorMessage, {
        role: "assistant",
        kind: "error",
        content: errorMessage.message,
        metadata: { mode: "trend_opportunities" },
      });
      if (isCreditError) {
        // بک‌اند مستقل تشخیص داده سهمیه تمام شده — این تنها منبع حقیقتِ
        // سهمیه است و باید بلافاصله (مستقل از هر سشنی) قفل شود، تا حتی
        // اگر کاربر یک گفتگوی جدید باز کند، دوباره اجازه‌ی درخواست نگیرد.
        setTotalIdeaBatchesUsed((prev) => Math.max(prev, 1));
        openUpgradeModal(errorMessageText);
      }
    }

    if (entitySelectionRequired) {
      scrollToEntityRequest();
    } else {
      scrollToBottom();
    }
    return true;
  }

  // ✅ فقط اینجا، بعد از پاسخ موفق 202 واقعی از بک‌اند
  const responseEntity = (res.data as any)?.entity
    ? enrichEntityOption({ ...(res.data as any).entity, description: "" })
    : (params.entityName ? { name: params.entityName, scope: params.entityScope || "core", type: null, description: "" } : null);
  if (responseEntity) setSelectedEntity(responseEntity);

  const batch = (res.data as any)?.batch ?? (currentBatch + 1);

  const activeSessionId = chatSessionRef.current?.id;
  if (params.requestServerId && site && activeSessionId) {
    await contentChatSessionService.updateMessage(site.id, activeSessionId, params.requestServerId, { batch });
  }
  setConversationMessages((messages) => messages.map((item) => (
    item.id === params.requestMessageId ? { ...item, batch, pending: false } : item
  )));
  const confirmationMessage = {
    id: `entity-final-${Date.now()}`,
    role: "assistant" as const,
    kind: "confirmation" as const,
    message: t("analyze.entity.confirmed"),
    entity: responseEntity,
    batch,
  };
  await appendPersistedMessage(confirmationMessage, {
    role: "assistant",
    kind: "confirmation",
    content: confirmationMessage.message,
    entity: responseEntity,
    batch,
    metadata: {
      mode: "trend_opportunities",
      entity_name: responseEntity?.name || params.entityName,
      entity_scope: responseEntity?.scope || params.entityScope,
    },
  });

  setIdeasRequested(true);
  setCurrentBatch(batch);
  setTotalIdeaBatchesUsed((prev) => Math.max(prev, batch)); // ← منبع واقعی سهمیه، مستقل از سشن
  setIdeaGenStatus("connecting_sources"); // ← جاش همینجاست، نه قبل از فراخوانی API
  setIdeaGenError(null);
  setChatRequests((requests) => [...requests, {
    batch,
    message: params.message,
    mode: "trend_opportunities",
    label: params.label,
    entity_name: responseEntity?.name || params.entityName,
    entity_scope: responseEntity?.scope || params.entityScope,
  }]);
  stopIdeaStatusPolling();
  ideaStatusPollRef.current = setInterval(() => pollIdeaStatus(site.id), 3000);

  setSubmittingTrend(false);
  scrollToBottom();
  return true;
};

/** کاربر روی یکی از کارت‌های Entity در پیام سؤال کلیک می‌کند — این خودش «پیام دوم» واقعی است */
const handleEntitySelect = async (option: ContentChatEntityOption) => {
  if (submittingTrend) return;
  const selected = enrichEntityOption(option);

  setIdeaGenError(null);

  // پیام entity_request قبلی را answered علامت بزن تا کارت‌هایش غیرفعال (نه حذف) شوند.
  const pendingEntityMessage = [...conversationMessages].reverse().find((m) => m.kind === "entity_request" && !m.answered);
  const activeSessionId = chatSessionRef.current?.id;
  if (pendingEntityMessage?.serverId && site && activeSessionId) {
    await contentChatSessionService.updateMessage(site.id, activeSessionId, pendingEntityMessage.serverId, { answered: true });
  }
  setConversationMessages((messages) => messages.map((message) => (
    message.id === pendingEntityMessage?.id ? { ...message, answered: true } : message
  )));

  setSelectedEntity(selected);
  const choiceMessageId = `entity-choice-${Date.now()}`;
  const choiceMessage = {
    id: choiceMessageId,
    role: "user" as const,
    kind: "request" as const,
    message: `My selected Entity: ${selected.name}`,
    label: t("analyze.entity.pick"),
    entity: selected,
  };
  const persistedChoice = await appendPersistedMessage(choiceMessage, {
    role: "user",
    kind: "request",
    content: choiceMessage.message,
    label: choiceMessage.label,
    entity: selected,
    metadata: { mode: "trend_opportunities", entity_selection: true },
  });
  scrollToBottom();

  // آخرین پیام «request» کاربر که پرامپت اصلی‌اش را نوشته بود پیدا می‌کنیم تا همان متن دوباره ارسال شود.
  const lastUserPromptMessage = [...conversationMessages].reverse().find((m) => m.role === "user" && m.kind === "request" && !m.entity);
  const lastUserPrompt = lastUserPromptMessage?.message
    || t("analyze.chatBar.trends.prompt");

  await submitTrendRequest({
    message: lastUserPrompt,
    label: t("analyze.chatBar.trends.label"),
    entityName: selected.name,
    entityScope: selected.scope,
    requestMessageId: lastUserPromptMessage?.id || choiceMessageId,
    requestServerId: lastUserPromptMessage?.serverId || persistedChoice.serverId,
  });

  // نیازی به setSubmittingTrend(false) اینجا نیست — خودِ submitTrendRequest
  // در هر دو مسیر موفق/ناموفق قبل از return این کار را انجام می‌دهد.
};

const handleContentChat = async ({ message, mode, label, entity_name, entity_scope }: ContentChatRequest): Promise<boolean> => {
  if (!site) return false;

  // باگ قبلی: این محدودیت فقط روی مود «فرصت‌های محتوایی بر اساس ترند» چک
  // می‌شد و خوشه‌های کلمات کلیدی/شکاف محتوایی رقبا بدون هیچ بررسی اعتبار
  // مستقیماً به بک‌اند می‌رفتند. وقتی کاربر اشتراک/اعتبار نداشت، درخواست
  // در بک‌اند شکست می‌خورد (یا حتی silent fail) و کاربر فقط یک خطای مبهم
  // می‌دید، بدون هیچ راهنمایی برای خرید اشتراک. حالا همان محدودیت برای هر
  // سه مود اعمال می‌شود تا اصلاً درخواستی به سمت سرور ارسال نشود.
  if (ideaGenLimitReached) {
    const limitMessageText = isFreePlan
      ? t("analyze.credits.chatFree")
      : t("analyze.credits.chatPaid");    const limitMessage = {
      id: `content-limit-${Date.now()}`,
      role: "assistant" as const,
      kind: "error" as const,
      message: limitMessageText,
    };
    await appendPersistedMessage(limitMessage, {
      role: "assistant",
      kind: "error",
      content: limitMessage.message,
      metadata: { mode },
    });
    scrollToBottom();
    openUpgradeModal(limitMessageText);
    return true;
  }

  const requestMessageId = `user-request-${Date.now()}`;
  const selectedForRequest = selectedEntity;
  if (mode === "trend_opportunities") setSubmittingTrend(true);
  const userMessage = {
    id: requestMessageId,
    role: "user" as const,
    kind: "request" as const,
    message,
    label,
    entity: selectedForRequest,
    pending: mode === "trend_opportunities",
  };

  // پیام را optimistic نشان می‌دهیم تا کاربر بلافاصله درخواست خودش و loading را ببیند.
  setConversationMessages((messages) => [...messages, userMessage]);
  scrollToBottom();
  const persistedUserMessage = await persistMessage({
    role: "user",
    kind: "request",
    content: message,
    label,
    entity: selectedForRequest,
    metadata: { mode },
  });
  if (persistedUserMessage) {
    setConversationMessages((messages) => messages.map((item) => (
      item.id === requestMessageId
        ? { ...item, serverId: persistedUserMessage.serverId, pending: userMessage.pending }
        : item
    )));
  }
  setPreparedPrompt(null);
  setIdeaGenError(null);
  scrollToBottom();

  if (mode === "trend_opportunities") {
    await submitTrendRequest({
      message,
      label,
      entityName: entity_name || selectedForRequest?.name,
      entityScope: entity_scope || selectedForRequest?.scope,
      requestMessageId,
      requestServerId: persistedUserMessage?.serverId,
    });
  } else {
    const type = mode === "keyword_clusters" ? "keyword_clusters" : "competitor_gaps";
    const res = await contentResearchService.create(site.id, { type, prompt: message });

    if (!res.success || !res.data?.session) {
      // اگر با وجود چک سمت فرانت، بک‌اند هم به‌طور مستقل خطای کمبود
      // اعتبار/اشتراک برگرداند (مثلاً کد ۴۰۲ یا code های زیر)، باز هم باید
      // کاربر را با یک پیام روشن به سمت خرید اشتراک هدایت کنیم، نه یک خطای
      // مبهم عمومی.
      const errorPayload = (res.data || {}) as any;
      const isCreditError = (res as any).status === 402
        || ["insufficient_credit", "no_active_subscription", "plan_limit_reached", "subscription_required"].includes(errorPayload.code);

     const errorMessageText = isCreditError
  ? (isFreePlan
    ? t("analyze.credits.shortFree")
    : t("analyze.credits.shortPaid"))
  : (res.message || t("analyze.errors.opportunities"));      const errorMessage = {
        id: `research-error-${Date.now()}`,
        role: "assistant" as const,
        kind: "error" as const,
        message: errorMessageText,
      };
      await appendPersistedMessage(errorMessage, {
        role: "assistant",
        kind: "error",
        content: errorMessage.message,
        metadata: { mode },
      });
      if (isCreditError) {
        // بک‌اند مستقل تشخیص داده سهمیه تمام شده — این تنها منبع حقیقتِ
        // سهمیه است و باید بلافاصله (مستقل از هر سشنی) قفل شود، تا حتی
        // اگر کاربر یک گفتگوی جدید باز کند، دوباره اجازه‌ی درخواست نگیرد.
        setTotalIdeaBatchesUsed((prev) => Math.max(prev, 1));
        openUpgradeModal(errorMessageText);
      }
      return true;
    }

    const session = res.data.session;
    const activeSessionId = chatSessionRef.current?.id;
    if (persistedUserMessage?.serverId && activeSessionId) {
      await contentChatSessionService.updateMessage(site.id, activeSessionId, persistedUserMessage.serverId, {
        content_research_session_id: session.id,
      });
    }
    setIdeaGenError(null);
    setConversationMessages((messages) => messages.map((item) => item.id === requestMessageId ? { ...item, researchId: session.id } : item));
    const confirmationMessage = {
      id: `research-confirmation-${Date.now()}`,
      role: "assistant" as const,
      kind: "confirmation" as const,
      message: t("analyze.research.received"),
      researchId: session.id,
    };
    await appendPersistedMessage(confirmationMessage, {
      role: "assistant",
      kind: "confirmation",
      content: confirmationMessage.message,
      content_research_session_id: session.id,
      metadata: { mode },
    } as ContentChatSessionMessagePayload);
    setResearchChats((items) => [...items, {
      id: session.id,
      type,
      label,
      message,
      status: session.status,
      error: session.error,
      result: null,
    }]);

    startResearchPolling(site.id, session.id);
  }

  autoScrollEnabled.current = true;
  scrollToBottom();

  return true;
};

  const pollContentResearch = async (siteId: string, sessionId: string) => {
    const res = await contentResearchService.show(siteId, sessionId);

    if (!res.success || !res.data?.session) {
      return;
    }

    const session = res.data.session;
    setResearchChats((items) => items.map((item) => item.id === sessionId
      ? { ...item, status: session.status, error: session.error, result: res.data?.result ?? null }
      : item));

    if (session.status === "done" || session.status === "failed") stopResearchPolling(sessionId);
  };

  const handleRetryIdeas = async () => {
    if (!site) return;
    setIdeaRetrying(true);
    const res = await articleIdeaService.retry(site.id);
    setIdeaRetrying(false);
    if (!res.success) { setIdeaGenError(res.message || t("analyze.errors.retry")); return; }
    setIdeaGenError(null);
    stopIdeaStatusPolling();
    ideaStatusPollRef.current = setInterval(() => pollIdeaStatus(site.id), 3000);
  };

  /* تشخیص اینکه کاربر دستی اسکرول کرده یا نه */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      autoScrollEnabled.current = distanceFromBottom < 120;
      updateChatNavAvailability();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    updateChatNavAvailability();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  /* اسکرول خودکار با سرعت مناسب، فقط اگه کاربر خودش بالا نرفته باشه */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    if (autoScrollEnabled.current) smoothScrollTo(el, el.scrollHeight, 700);
    // محتوا (طول صفحه) عوض شده؛ وضعیت فعال/غیرفعال دکمه‌های ناوبری را
    // بعد از رندر شدن محتوای جدید به‌روز کن.
    requestAnimationFrame(() => requestAnimationFrame(updateChatNavAvailability));
  }, [phase, entity, ideas, streamDone, ideasRequested, chatRequests, researchChats, conversationMessages]);

  /* cleanup */
  useEffect(() => () => { stopPolling(); stopIdeasPolling(); stopScorePolling(); stopResearchPolling(); }, []);

  /* ── Poll site status ── */
  const pollSite = async (id: string) => {
    const res = await siteService.show(id);
    if (!res.success || !res.data) {
      setError(res.message || t("analyze.errors.status"));
      stopPolling();
      return;
    }
    const current = res.data.site;
    const nextPhase = statusToPhase(current.status);
    setSite(current);
    if (nextPhase === "done") setShouldStream(true);
    setPhase(nextPhase);
    if (!POLL_STATUSES.has(current.status)) stopPolling();
  };

  /* load entity + ideas when done */
  useEffect(() => {
    if (phase === "done" && site) {
      if (!isNewFlow && siteIdParam && String(site.id) !== siteIdParam) return;
      loadEntity(site.id);
      loadIdeas(site.id);
      loadSearchConsole(site.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, site?.id, siteIdParam, isNewFlow]);

  /* poll for pending scores */
  useEffect(() => {
    if (!site) return;
    if (!isNewFlow && siteIdParam && String(site.id) !== siteIdParam) return;
    const hasPending = ideas.some((i) => i.seo_score === null && !i.scoring_error);
    if (hasPending && !scorePollRef.current) {
      scorePollAttempts.current = 0;
      scorePollRef.current = setInterval(async () => {
        scorePollAttempts.current += 1;
        const result = await loadIdeas(site.id, true);
        const stillPending = result.some((i) => i.seo_score === null && !i.scoring_error);
        if (!stillPending || scorePollAttempts.current >= SCORE_POLL_MAX_ATTEMPTS) stopScorePolling();
      }, SCORE_POLL_INTERVAL_MS);
    }
    if (!hasPending) stopScorePolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideas, site?.id, siteIdParam, isNewFlow]);

  useEffect(() => {
    if (phase !== "done" || !site) return;

    // هنگام تغییر سایت، state قبلی برای یک رندر باقی می‌ماند.
    // در این فاصله نباید URL را با site.id قدیمی normalize کنیم.
    if (!isNewFlow && siteIdParam && String(site.id) !== siteIdParam) return;

    void ensureChatSession(site.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, site?.id, siteIdParam, chatSessionIdParam, newChatParam]);

  /* ── API calls ── */
  const loadEntity = async (siteId: string) => {
    setEntityLoading(true);
    const res = await siteService.getEntity(siteId);
    setEntityLoading(false);
    setEntity(res.success && res.data?.data ? res.data.data : null);
  };

const loadIdeas = async (siteId: string, silent = false): Promise<ArticleIdea[]> => {
  if (!silent) setIdeasLoading(true);
  const res = await articleIdeaService.list(siteId);
  if (!silent) setIdeasLoading(false);
  if (res.success && res.data?.data) {
    const next = res.data.data;
    setIdeas((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    return next;
  }
  return [];
};

  const handleEditIdea = async (ideaId: string, payload: ArticleIdeaUpdateRequest): Promise<boolean> => {
    if (!site) return false;

    const res = await articleIdeaService.update(site.id, ideaId, payload);
    const updatedIdea = res.success ? res.data?.data : null;

    if (!updatedIdea) return false;

    setIdeas((currentIdeas) => currentIdeas.map((idea) => (
      idea.id === ideaId ? updatedIdea : idea
    )));
    return true;
  };

  const loadSearchConsole = async (siteId: string) => {
    const [statusResponse, queriesResponse] = await Promise.all([
      searchConsoleService.status(siteId),
      searchConsoleService.queries(siteId),
    ]);

    if (statusResponse.success && statusResponse.data) {
      const data = statusResponse.data as any;
      setGscConnectionStatus(data.connection?.status || null);
      setGscConnectionError(data.connection?.last_error || null);
      setGscProperty(data.property || null);

      if (data.property?.sync_status === "queued" || data.property?.sync_status === "syncing") {
        startGscPolling(siteId);
      } else {
        stopGscPolling();
      }
    }

    if (queriesResponse.success && queriesResponse.data) {
      setGscQueries(((queriesResponse.data as any).queries || []) as SearchConsoleQueryState[]);
    }
  };

  const startGscPolling = (siteId: string) => {
    if (gscPollRef.current) return;
    gscPollRef.current = setInterval(() => loadSearchConsole(siteId), 3500);
  };

  const handleGscConnect = async () => {
    if (!site) return;
    setGscLoading(true);
    setGscConnectionError(null);
    const response = await searchConsoleService.connect(site.id);
    setGscLoading(false);

    const authorizationUrl = response.success ? (response.data as any)?.authorization_url : null;
    if (!authorizationUrl) {
      setGscConnectionError(response.message || t("analyze.gsc.errors.start"));
      return;
    }

    window.location.assign(authorizationUrl);
  };

  const handleLoadGscProperties = async () => {
    if (!site) return;
    setGscLoading(true);
    const response = await searchConsoleService.properties(site.id);
    setGscLoading(false);

    if (!response.success) {
      setGscConnectionError(response.message || t("analyze.gsc.errors.properties"));
      return;
    }

    const list = ((response.data as any)?.properties || []) as Array<{ property_url: string; permission_level: string | null }>;
    setGscProperties(list);
    // without this, "Show my sites" gave no feedback when the list came back empty
    setGscConnectionError(list.length ? null : t("analyze.gsc.errors.noProperties"));
  };

  const handleSelectGscProperty = async (propertyUrl: string) => {
    if (!site) return;
    setGscLoading(true);
    const response = await searchConsoleService.selectProperty(site.id, propertyUrl);
    setGscLoading(false);

    if (!response.success) {
      setGscConnectionError(response.message || t("analyze.gsc.errors.select"));
      return;
    }

    setGscProperty((response.data as any)?.property || null);
    setGscQueries([]);
  };

  const handleSyncGsc = async () => {
    if (!site) return;
    setGscLoading(true);
    const response = await searchConsoleService.sync(site.id);
    setGscLoading(false);

    if (!response.success) {
      setGscConnectionError(response.message || t("analyze.gsc.errors.sync"));
      return;
    }

    setGscProperty((response.data as any)?.property || null);
    startGscPolling(site.id);
  };

  const handleDisconnectGsc = async () => {
    if (!site) return;
    setGscLoading(true);
    const response = await searchConsoleService.disconnect(site.id);
    setGscLoading(false);

    if (!response.success) {
      setGscConnectionError(response.message || t("analyze.gsc.errors.disconnect"));
      return;
    }

    stopGscPolling();
    setGscProperty(null);
    setGscProperties([]);
    setGscQueries([]);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = domain.trim();
    if (!trimmed) { setError(t("analyze.errors.domainRequired")); return; }
    if (!isValidDomain(trimmed)) {
      setError(t("analyze.errors.domainInvalid"));
      return;
    }
    setSubmitting(true);
    const res = await siteService.store({ domain: trimmed });
    setSubmitting(false);

    if (!res.success || !res.data) { setError(res.message || t("analyze.errors.addDomain")); return; }

    const newSite = res.data.site;
    const alreadyAnalyzed = (res.data as any).already_analyzed === true;
    setSite(newSite);
justAnalyzedRef.current = true; // ← این یک خط اضافه شد

    const nextPhase = statusToPhase(newSite.status);
    if (nextPhase === "done") {
      setShouldStream(!alreadyAnalyzed);
      setStreamDone(alreadyAnalyzed);
    }
    setPhase(nextPhase);

    if (POLL_STATUSES.has(newSite.status)) {
      stopPolling();
      pollRef.current = setInterval(() => pollSite(newSite.id), POLL_INTERVAL_MS);
    }

    navigate(`/dashboard?site=${newSite.id}`, { replace: true });
  };

  const handleRetry = async () => {
    if (!site) return;
    setError(null);
    setSubmitting(true);

    const res = await siteService.store({ domain: site.domain });
    setSubmitting(false);

    if (!res.success || !res.data) {
      setError(res.message || t("analyze.errors.retry"));
      return;
    }

    const newSite = res.data.site;
    setSite(newSite);
justAnalyzedRef.current = true; // ← این یک خط اضافه شد

    const nextPhase = statusToPhase(newSite.status);
    setPhase(nextPhase);
    setShouldStream(false);
    setStreamDone(false);
    setEntity(null);
    setSelectedEntity(null);
    setConversationMessages([]);
    setPreparedPrompt(null);
    setIdeas([]);
    setChatRequests([]);
    setResearchChats([]);
    stopResearchPolling();

    if (POLL_STATUSES.has(newSite.status)) {
      stopPolling();
      pollRef.current = setInterval(() => pollSite(newSite.id), POLL_INTERVAL_MS);
    }
  };

  const [bootstrapping, setBootstrapping] = useState(true);
  const [sidebarView, setSidebarView] = useState<SidebarView>("info");
const chatBarRef = React.useRef<HTMLDivElement | null>(null);
const [chatBarHeight, setChatBarHeight] = React.useState(0);

React.useEffect(() => {
  const el = chatBarRef.current;
  if (!el) return;

  const updateHeight = () => {
    setChatBarHeight(el.getBoundingClientRect().height);
  };

  updateHeight();

  const observer = new ResizeObserver(updateHeight);
  observer.observe(el);

  return () => observer.disconnect();
}, [phase, streamDone]);
  useEffect(() => () => stopGscPolling(), []);

  /* ── Derived state ── */
  const inProgress = POLL_STATUSES.has(site?.status || "");

  const summaryText = site?.summary || "";
  const { visible: streamedSummary, done: typingDone } = useTypewriter(
    summaryText,
    phase === "done" && shouldStream,
  );
  useEffect(() => { if (typingDone) setStreamDone(true); }, [typingDone]);

  const inputDisabled = phase !== "idle" && phase !== "failed";
  const showSiteAnalysis = chatSession?.kind === "analysis" && !isDraftChat;

  useEffect(() => {
    if (!site) return;
    if (articleIdParam) {
      const nextArticleId = articleIdParam;
      if (activeArticle?.articleId !== nextArticleId) {
        setActiveArticle({ articleId: nextArticleId });
      }
      return;
    }
    if (ideaIdParam) {
      const nextIdeaId = ideaIdParam;
      if (activeArticle?.ideaId !== nextIdeaId) {
        setActiveArticle({ ideaId: nextIdeaId });
      }
    }
    // activeArticle عمداً در deps نیست: react-router v7 تغییر URL را در transition اعمال می‌کند،
    // پس بعد از setActiveArticle(null) (مثلاً «گفتگوی جدید») یک رندر با article قدیمی URL می‌آید و مقاله دوباره باز می‌شد.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleIdParam, ideaIdParam, site?.id]);

  const startArticleForIdea = async (idea: ArticleIdea) => {
    if (!site) return;
    // این ایده همین الان فعال است یا قبلاً برایش تولید مقاله شروع شده — دوباره کاری لازم نیست.
    if (activeArticle?.ideaId === idea.id || ideaArticleStartedIds.has(idea.id)) return;

    // هر سشنِ گفتگو فقط برای یک ایده/مقاله است. اگر همین سشن قبلاً برای یک
    // ایده‌ی دیگر درخواست مقاله ثبت کرده باشد (چه در حال تولید چه تمام‌شده)،
    // نمی‌توان دوباره از همان سشن استفاده کرد؛ در غیر این صورت پیامِ ایده‌ی
    // دوم اصلاً persist نمی‌شود و در UI هیچ اتفاقی نمی‌افتد — همان باگِ
    // «کلیک روی ایده‌ی دوم هیچ کاری نمی‌کند». پس اول یک گفتگوی (سشن) کاملاً
    // تازه می‌سازیم و ایده را در همان سشنِ جدید مطرح می‌کنیم.
    const sessionAlreadyHasAnotherArticle = conversationMessages.some(
      (message) => (message.kind === "article_request" || message.kind === "article") && message.ideaId !== idea.id,
    );
    if (sessionAlreadyHasAnotherArticle) {
      prepareLocalDraft(site.id);
      navigate(`/dashboard?site=${site.id}&new_chat=1`, { replace: true });
    }

    markIdeaArticleStarted(idea.id);

    const articleRequest = {
      id: `article-request-${idea.id}-${Date.now()}`,
      role: "user" as const,
      kind: "article_request" as const,
      message: t("analyze.article.request", { title: idea.title }),
      label: t("dashboard.opportunities.generate"),
      ideaId: idea.id,
    };

    await appendPersistedMessage(articleRequest, {
      role: "user",
      kind: "article_request",
      content: articleRequest.message,
      label: articleRequest.label,
      metadata: { idea_id: idea.id, source: "article_idea" },
    });
    setActiveArticle({ ideaId: idea.id });
    requestAnimationFrame(() => scrollToBottom());
  };

  /** برای ایده‌ای که مقاله‌اش قبلاً ساخته شده (idea.has_article / status === "used")
   *  صدا زده می‌شود؛ همان مقاله را باز می‌کند — بر خلاف startArticleForIdea چیز
   *  تازه‌ای persist نمی‌کند، فقط به مقاله‌ی موجود می‌رود. */
const viewArticleForIdea = (idea: ArticleIdea) => {
  if (!site) return;
  const articleId = idea.article_id ?? undefined;
  setActiveArticle({ articleId, ideaId: idea.id });

  const params = new URLSearchParams(searchParams);
  params.set("site", String(site.id));
  if (articleId) {
    params.set("article", String(articleId));
    params.delete("idea");
  } else {
    params.set("idea", String(idea.id));
    params.delete("article");
  }
  params.delete("new_chat");
  navigate(`/dashboard?${params.toString()}`, { replace: true, state: { openConversation: true } });
  requestAnimationFrame(() => scrollToBottom());
};

  const handleArticleStarted = async (articleId: string, ideaId: string) => {
    markIdeaArticleStarted(ideaId);
    setActiveArticle({ articleId, ideaId });
    const articleMessage = {
      id: `article-message-${articleId}`,
      role: "assistant" as const,
      kind: "article" as const,
      message: t("analyze.article.started"),
      label: t("dashboard.opportunities.generate"),
      articleId,
      ideaId,
    };
    await appendPersistedMessage(articleMessage, {
      role: "assistant",
      kind: "article",
      content: articleMessage.message,
      label: articleMessage.label,
      article_id: articleId,
      metadata: { idea_id: ideaId, source: "article_idea" },
    });
    setConversationsRefreshKey((key) => key + 1);

    const params = new URLSearchParams(searchParams);
    params.delete("new_chat");
    if (site) params.set("site", String(site.id));
    params.set("article", String(articleId));
    if (chatSessionRef.current?.id) params.set("chat", chatSessionRef.current.id);
    navigate(`/dashboard?${params.toString()}`, { replace: true, state: { openConversation: true } });
  };

  const handleArticleBack = () => {
    setActiveArticle(null);
    setIdeaGenError(null);
    const params = new URLSearchParams(searchParams);
    params.delete("article");
    params.delete("idea");
    if (!chatSessionRef.current?.id) params.set("new_chat", "1");
    navigate(`/dashboard?${params.toString()}`, {
      replace: true,
      state: chatSessionRef.current?.id ? { openConversation: true } : undefined,
    });
    requestAnimationFrame(() => scrollToBottom());
  };

  const renderResearchChat = (research: ResearchChat) => (
    <React.Fragment key={`research-${research.id}`}>
      {research.status === "done" && research.result ? (
         <ContentResearchBubble
          type={research.type}
          clusters={research.result.clusters}
          competitors={research.result.competitors}
          gaps={research.result.gaps}
          summary={research.result.summary}
          siteAnalysis={research.result.site_analysis}
          recommendations={research.result.recommendations}
          manusTaskUrl={research.result.manus_task_url}
          onGapAction={requestIdeasFromGap}
        />
      ) : (
        <ContentResearchProgressBubble
          type={research.type}
          error={research.status === "failed" ? research.error : null}
        />
      )}
    </React.Fragment>
  );

  const renderIdeasBatch = (batchNum: number) => {
    if (!site) return null;

    const isLatest = batchNum === currentBatch;
    const batchIdeas = ideasByBatch.get(batchNum) || [];
    const isLoadingBatch = ideasLoading && isLatest;
    const isCompleted = !isLatest
      || batchIdeas.length > 0
      || (!isLoadingBatch && !ideaGenStatus)
      || ideaGenStatus === "done";
    const request = chatRequests.find((item) => item.batch === batchNum);
    const requestShownInTimeline = conversationMessages.some((item) => item.role === "user" && item.batch === batchNum);

    return (
      <React.Fragment key={`ideas-batch-${batchNum}`}>
        {!requestShownInTimeline && (
          <IdeaRequestUserBubble
            domain={site.domain}
            message={request?.message}
            label={request?.label}
          />
        )}
        {isCompleted ? (
          <IdeasBubble
            ideas={batchIdeas}
            loading={isLoadingBatch}
            sortedIdeas={sortIdeas(batchIdeas)}
            onWriteArticle={startArticleForIdea}
            onEditIdea={handleEditIdea}
            onViewArticle={viewArticleForIdea}
            generatedIdeaIds={ideaArticleStartedIds}
          />
        ) : (
          <IdeaGenerationProgressBubble
            status={ideaGenStatus}
            error={ideaGenError}
            onRetry={handleRetryIdeas}
            retrying={ideaRetrying}
          />
        )}
      </React.Fragment>
    );
  };

  const activeArticleEventId = activeArticle
    ? [...conversationMessages].reverse().find((message) => (
      (activeArticle.articleId && message.articleId === activeArticle.articleId)
      || (activeArticle.ideaId && message.kind === "article_request" && message.ideaId === activeArticle.ideaId)
    ))?.id ?? null
    : null;

  const renderActiveArticle = () => activeArticle && site ? (
    <ArticleGeneratePage
      key={`article-session-${activeArticle.ideaId ?? activeArticle.articleId ?? "draft"}`}
      siteId={site.id}
      ideaId={activeArticle.ideaId}
      articleId={activeArticle.articleId}
      embedded
      onArticleStarted={handleArticleStarted}
      onArticleBack={handleArticleBack}
      onMobileHeaderExtraChange={setArticleMobileHeaderExtra}
    />
  ) : null;

  /* ════════ RENDER ════════ */
  return (
       <Layout
      activeView={sidebarView}
      siteDomain={site?.domain}
      siteId={site?.id}
      hideDesktopPlanBadge={Boolean(activeArticle)}
      disableContentScroll={Boolean(activeArticle)}
      activeArticleId={activeArticle?.articleId}
      refreshConversationsKey={conversationsRefreshKey}
      activeConversationId={chatSession?.id}
      onSelectConversation={(conversation) => selectChatSession({ id: String(conversation.id), site_id: site?.id ?? "", user_id: 0, kind: conversation.kind || "chat", title: conversation.title, messages_count: null, last_message_at: conversation.last_message_at || null, created_at: null, updated_at: null })}
      onNewConversation={createNewChatSession}
      onChangeView={(v) => setSidebarView(v)}
      mobileHeaderExtra={activeArticle ? articleMobileHeaderExtra : undefined}
    >
      <div className="h-full flex flex-col overflow-hidden relative [&_*]:font-bold!">
        {/* کنترل کوچک ناوبری بین پیام‌های قبلی سشن — سمت راست چت.
            فقط وقتی نمایش داده می‌شود که واقعاً پیامی برای جابه‌جایی وجود دارد،
            و هر دکمه وقتی به انتهای همان جهت رسیدیم غیرفعال می‌شود (به‌جای
            اینکه بی‌اثر و گیج‌کننده بماند). */}
        {!activeArticle && phase === "done" && streamDone && conversationMessages.length > 0 && (chatNavCanUp || chatNavCanDown) && (
          <div className="absolute start-2 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1.5">
            <button
              type="button"
              onClick={() => chatNavCanUp && jumpToAdjacentMessage(-1)}
              disabled={!chatNavCanUp}
              title={t("analyze.nav.previous")}
              aria-label={t("analyze.nav.previous")}
              className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#E4E5F0] bg-white/90 shadow-sm backdrop-blur transition-colors ${
                chatNavCanUp ? "text-[#3B3F5C] hover:bg-white cursor-pointer" : "text-[#B6B8CE] opacity-50 cursor-not-allowed"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => chatNavCanDown && jumpToAdjacentMessage(1)}
              disabled={!chatNavCanDown}
              title={t("analyze.nav.next")}
              aria-label={t("analyze.nav.next")}
              className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#E4E5F0] bg-white/90 shadow-sm backdrop-blur transition-colors ${
                chatNavCanDown ? "text-[#3B3F5C] hover:bg-white cursor-pointer" : "text-[#B6B8CE] opacity-50 cursor-not-allowed"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        )}
        {/* Chat area */}
<main
  ref={mainRef}
  className="min-h-0 flex-1 overflow-y-auto"
  style={{
    paddingBottom: `${chatBarHeight + 16}px`,
  }}
>
      <div className="max-w-5xl md:max-w-6xl xl:max-w-7xl mx-auto px-6 py-8">

            {/* Empty / welcome state */}
            {bootstrapping ? (
              <div className="flex items-center justify-center h-full py-24">
                <div className="h-6 w-6 border-2 border-[#E4E5F0] border-t-[#5B47FB] rounded-full animate-spin" />
              </div>
            ) : (
              phase === "idle" && <EmptyState />
            )}

            {/* Messages */}
            {site && (
              <>
                {/* اطلاعات اولیه سایت فقط در سشن پایه «تحلیل سایت» نمایش داده می‌شود */}
                {showSiteAnalysis && <UserBubble domain={site.domain} />}

                {/* Progress */}
                {inProgress && <ProgressBubble phase={phase} />}

                {phase === "failed" && (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-9 w-9 rounded-2xl bg-[#F7EEEA] flex items-center justify-center text-[#B3453A] shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-[#FAFAFE] rounded-3xl rounded-ss-lg border border-[#E3C4BC] p-5 shadow-sm">
                      <p className="text-sm font-bold text-[#B3453A] mb-1">{t("analyze.failed")}</p>
                      <p className="text-xs text-[#0D0F23] leading-6 mb-3">
                        {site.error_message || t("common.errors.generic")}
                      </p>
                      <button
                        type="button"
                        onClick={handleRetry}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#B3453A] text-white text-xs font-bold px-4 py-2 hover:bg-[#9C3B31] transition-all disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t("analyze.ideas.retrying")}
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                            </svg>
                            {t("analyze.ideas.retry")}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Results همیشه یک timeline واحد هستند؛ مقاله در انتهای همان
                    timeline به‌صورت inline رندر می‌شود و جای گفتگو را عوض نمی‌کند. */}
                {phase === "done" && (
                  <>
                    {showSiteAnalysis && summaryText && (
                      <SummaryBubble
                        text={summaryText}
                        streaming={shouldStream && !streamDone}
                        streamedText={streamedSummary}
                        niche={site.niche ?? null}
                        siteUrl={site.url}
                      />
                    )}
                    {streamDone && (
                      <>
                        {showSiteAnalysis && <EntitiesBubble entity={entity} loading={entityLoading} streaming={shouldStream} />}

                        {sessionError && (
                          <div className="mb-4 rounded-2xl border border-[#E3C4BC] bg-[#F7EEEA] px-4 py-3 text-xs font-bold text-[#B3453A]">
                            {sessionError}
                          </div>
                        )}
                        {sessionLoading && !chatSession && (
                          <div className="mb-4 rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE] px-4 py-3 text-xs font-bold text-[#6C7193]">
                            {t("analyze.chat.preparing")}
                          </div>
                        )}

                        {!showSiteAnalysis && !sessionLoading && conversationMessages.length === 0 && (
                          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                            <div className="h-14 w-14 rounded-3xl bg-gradient-to-br rtl:bg-gradient-to-bl from-[#5B47FB] to-[#4935E0] flex items-center justify-center text-white mb-5 shadow-xl shadow-[#5B47FB]/25">
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3.75l1.55 4.7a2.7 2.7 0 001.7 1.7l4.7 1.55-4.7 1.55a2.7 2.7 0 00-1.7 1.7L12 19.65l-1.55-4.7a2.7 2.7 0 00-1.7-1.7l-4.7-1.55 4.7-1.55a2.7 2.7 0 001.7-1.7L12 3.75z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-black text-[#0D0F23] mb-2">
                              {t("analyze.welcome.title", { domain: site.domain })}
                            </h3>
                            {/* <p className="text-sm text-[#0D0F23] leading-7 max-w-md">
                              کل محتوا، حوزه فعالیت و Entity‌های این سایت بررسی شده است.
                              هر سوالی درباره استراتژی محتوا، کلمات کلیدی، ایده مقاله یا تحلیل رقبا دارید، همین‌جا بپرسید.
                            </p> */}
                            <p className="text-sm leading-7 text-[#3B3F5C] font-bold">
  {tx("analyze.welcome.hello", { domain: <span className="font-black text-[#5B47FB]">{site.domain}</span> })}
  <br />
  {t("analyze.welcome.what")}
  <br />
  {t("analyze.welcome.ask")}
</p>
                          </div>
                        )}
{/* {!showSiteAnalysis && !sessionLoading && conversationMessages.length === 0 && (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <div className="h-20 w-20 rounded-3xl overflow-hidden mb-5 shadow-xl shadow-[#5B47FB]/25">
      <video
        className="w-full h-full object-cover"
        src="/videos/agent.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>

    <h3 className="text-lg font-black text-[#0D0F23] mb-2">
      ایجنت سئوی سایت {site.domain}
    </h3>

    <p className="text-sm leading-7 text-[#3B3F5C] font-bold">
      سلام! من دستیار سئوی سایت{" "}
      <span className="font-black text-[#5B47FB]">{site.domain}</span> هستم.
      <br />
      می‌تونم کلمات کلیدی مهم، فرصت‌های جدید محتوا و رقبات رو بررسی کنم
      و بهت بگم روی چه موضوعاتی کار کنی تا سایتت بهتر رشد کنه.
      <br />
      هر چیزی درباره سئو و محتوای سایتت می‌خوای بدونی، ازم بپرس.
    </p>
  </div>
)} */}
                        <ContentChatTimeline
                          domain={site.domain}
                          messages={conversationMessages}
                          selectedEntity={selectedEntity}
                          onEntitySelect={handleEntitySelect}
                          renderAfterMessage={(message) => {
                            if (message.kind === "confirmation" && message.batch) {
                              return renderIdeasBatch(message.batch);
                            }
                            if (message.kind === "confirmation" && message.researchId) {
                              const research = researchChats.find((item) => item.id === message.researchId);
                              return research ? renderResearchChat(research) : null;
                            }
                            if (message.id === activeArticleEventId) {
                              return renderActiveArticle();
                            }
                            return null;
                          }}
                        />

                        {/* فقط داده‌هایی که پیام legacy متناظر ندارند به‌عنوان
                            fallback بعد از timeline نشان داده می‌شوند. */}
                        {ideasRequested && visibleIdeaBatches
                          .filter((batchNum) => !conversationMessages.some((message) => message.batch === batchNum))
                          .map(renderIdeasBatch)}
                        {researchChats
                          .filter((research) => !conversationMessages.some((message) => message.researchId === research.id))
                          .map(renderResearchChat)}
                      </>
                    )}
                  </>
                )}

                {/* همان Article Generate Page با تمام کارت‌ها و progressهای
                    اصلی، اما بخشی از همین صفحه و بعد از رویدادهای timeline. */}
                {activeArticle && !activeArticleEventId && (
                  <div className="mt-6">
                    {renderActiveArticle()}
                  </div>
                )}              </>
            )}
          </div>
        </main>

        {/* Input bar / Chat-mode action bar */}
{/* Input bar / Chat-mode action bar */}
{/* Chat bar */}
<div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F3F2FB] via-[#F3F2FB]/95 to-transparent pointer-events-none" />

  <div
    ref={chatBarRef}
    className="relative w-full px-5 pb-4 pointer-events-auto"
  >
    {/* فقط وقتی نشون بده که کاربر واقعاً پایین‌تر از انتهای گفتگو باشه؛
        وگرنه یه دکمه‌ی بی‌فایده جلوی چشم می‌مونه. */}
    {!activeArticle && phase === "done" && streamDone && conversationMessages.length > 0 && chatNavCanDown && (
      <div className="mb-2 flex justify-center">
        <button
          type="button"
          onClick={jumpToLatestMessage}
          title={t("analyze.nav.latest")}
          className="flex items-center gap-1.5 rounded-full border border-[#E4E5F0] bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#3B3F5C] shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {t("analyze.nav.latestShort")}
        </button>
      </div>
    )}
    {activeArticle ? null : phase === "done" && streamDone ? (
      <ContentChatBar
          key={chatSession?.id ?? "draft"}
        onSend={handleContentChat}
        selectedEntity={selectedEntity}
        preparedPrompt={preparedPrompt}
        sending={
          submittingTrend
          || (ideaGenStatus !== null && ideaGenStatus !== "done" && !ideaGenError)
          || researchChats.some(
            (research) =>
              research.status === "queued" ||
              research.status === "processing"
          )
          || sessionLoading
        }
disabled={sessionLoading || (!chatSession && !isDraftChat)}
        creditLimitReached={ideaGenLimitReached}
        limitBanner={creditLimitBanner}
        error={ideaGenError || sessionError}
        gscConnectionStatus={gscConnectionStatus}
        gscConnectionError={gscConnectionError}
        gscProperty={gscProperty}
        gscProperties={gscProperties}
        gscQueries={gscQueries.map(q => ({
          ...q,
          trend_percentage: null
        }))}
        gscLoading={gscLoading}
        onGscConnect={handleGscConnect}
        onGscLoadProperties={handleLoadGscProperties}
        onGscSelectProperty={handleSelectGscProperty}
        onGscSync={handleSyncGsc}
        onGscDisconnect={handleDisconnectGsc}
       limitMessage={
  isFreePlan
    ? t("analyze.credits.barFree")
    : t("analyze.credits.barPaid")
}
      />
    ) : (
      <InputBar
        domain={domain}
        onChange={(v) => setDomain(v.replace(/[^\x00-\x7F]/g, ""))}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
        disabled={inputDisabled}
      />
    )}
  </div>
</div>
      </div>
      <UpgradePlanModal
        open={upgradeModalOpen}
        onClose={closeUpgradeModal}
        onUpgrade={handleUpgradeNavigate}
        isFreePlan={isFreePlan}
        message={upgradeModalMessage}
        // subscriptionUrl="/subscription"
      />
    </Layout>
  );
};

export default AnalyzePage;