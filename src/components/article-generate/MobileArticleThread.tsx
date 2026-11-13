// src/components/article-generate/MobileArticleThread.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { articleChatService } from "../../services/api";
import type { Article, ArticleChatMessage, ArticleSection, ArticleTargetRef } from "../../types";
import { Spinner } from "./UiBits";
import { MarkdownView } from "./MarkdownView";
import { TARGET_TYPE_LABELS, isInProgress } from "./constants";
import { applyTargetRef, targetFromField } from "./chatTarget";
import type { ChatTargetSelection } from "./chatTarget";
import { ArticleMetaCard } from "./ArticleMetaCard";
import { FinalArticleCard } from "./FinalArticleCard";
import { FaqCard } from "./FaqCard";
import { ArticleImageCard } from "./ArticleImageCard";
import { ChatModelSelector } from "./ChatModelSelector";
import { DEFAULT_MODEL_ID, PRO_MODEL_ID } from "./chatModels";
import { t } from "../../i18n";
interface MobileArticleThreadProps {
  siteId: number | string;
  article: Article;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (target: ChatTargetSelection | null) => void;
  onArticleChange: (article: Article) => void;
  onRegenerateSection: (section: ArticleSection) => void;
  regeneratingSectionId: string | null;
  /**
   * آیا پلن کاربر رایگان است — برای تعیین اینکه کدام مدل‌های چت در سلکتورِ
   * پایین صفحه (نوار ورودی چت) قابل انتخاب‌اند. دقیقاً همان مقداری که در
   * دسکتاپ به ArticleChatDock پاس داده می‌شود، باید اینجا هم از صفحه‌ی
   * والد (ArticleGeneratePage) پاس داده شود.
   */
  isFreePlan: boolean;
}

interface HistoryTurn {
  user: ArticleChatMessage;
  assistant: ArticleChatMessage;
}

/** خلاصه‌ی فقط-خواندنیِ یک نسخه‌ی قدیمیِ مقاله — بدون هیچ دکمه‌ی تعاملی.
 *  عمداً از کامپوننت‌های اصلیِ تعاملی استفاده نمی‌کند تا هیچ ادیت/چتی
 *  روی نسخه‌های قبلی ممکن نباشد (طبق درخواست: «فقط برای مشاهده»). */
const FrozenArticleSummary: React.FC<{ article: Article }> = ({ article }) => {
  const sections = article.sections ?? [];
  const faq = article.faq ?? [];
  return (
    <div className="space-y-3">
      <h4 className="text-base font-black text-[#0D0F23] leading-7">{article.title}</h4>
      {article.excerpt && <p className="text-xs text-[#0D0F23] leading-6">{article.excerpt}</p>}
      {article.content ? (
        <MarkdownView text={article.content} />
      ) : (
        <div className="space-y-2">
          {sections.map((s) => (
            <MarkdownView key={s.id} text={`## ${s.heading}\n\n${s.content ?? ""}`} />
          ))}
        </div>
      )}
      {faq.length > 0 && (
        <div className="space-y-1.5 border-t border-[#E4E5F0] pt-3">
          <p className="text-[11px] font-black text-[#0D0F23]">❓ {t("article.sectionType.faq")}</p>
          {faq.map((f, i) => (
            <div key={i} className="text-xs text-[#0D0F23] leading-6">
              <span className="font-bold text-[#0D0F23]">
                {i + 1}. {f.question}
              </span>
              <p className="mt-0.5 text-[#0D0F23]">{f.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CollapsedVersion: React.FC<{ label: string; article: Article }> = ({ label, article }) => (
  <details className="group rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE]">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-xs font-bold text-[#0D0F23]">
      <span>{label}</span>
      <span className="flex items-center gap-1 text-[#0D0F23]/60">
        {t("dashboard.view")}
        <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" clipRule="evenodd" />
        </svg>
      </span>
    </summary>
    <div className="select-text border-t border-[#E4E5F0] p-4">
      <FrozenArticleSummary article={article} />
    </div>
  </details>
);

const MessageBubble: React.FC<{ message: ArticleChatMessage }> = ({ message }) => (
  <div className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
    <div
      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-6 ${
        message.role === "user" ? "bg-[#F3F2FB] text-[#0D0F23]" : "bg-[#EFEDFF] text-[#0D0F23]"
      }`}
    >
      {message.target_label && (
        <div className={`mb-1 text-[10px] font-bold ${message.role === "user" ? "text-[#0D0F23]/70" : "text-[#5B47FB]"}`}>
          {TARGET_TYPE_LABELS[message.target_type ?? ""] ?? message.target_type} · {message.target_label}
        </div>
      )}
      <MarkdownView text={message.content} />
    </div>
  </div>
);

const TypingBubble: React.FC = () => (
  <div className="flex justify-end">
    <div className="rounded-2xl bg-[#EFEDFF] px-3.5 py-2.5 text-[#5B47FB]">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5B47FB]/50 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5B47FB]/50 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5B47FB]/50" />
      </div>
    </div>
  </div>
);

/** بلوکِ کاملِ «نسخه‌ی زنده و فعلیِ» مقاله — همان کامپوننت‌های واقعیِ صفحه
 *  (عنوان + تنظیمات سئو + بخش‌ها + FAQ)، کاملاً تعاملی، دقیقاً مثل دسکتاپ. */
const LiveArticleBlock: React.FC<{
  siteId: number | string;
  article: Article;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (t: ChatTargetSelection) => void;
  onArticleChange: (article: Article) => void;
  onRegenerateSection: (section: ArticleSection) => void;
  regeneratingSectionId: string | null;
  isFreePlan: boolean;
}> = ({
  siteId,
  article,
  selectedTarget,
  onSelectTarget,
  onArticleChange,
  onRegenerateSection,
  regeneratingSectionId,
  isFreePlan,
}) => (
  <div className="space-y-4">
    <ArticleImageCard
      siteId={siteId}
      article={article}
      onArticleChange={onArticleChange}
      isFreePlan={isFreePlan}
    />
    <div className="rounded-2xl border border-[#E4E5F0] bg-gradient-to-r rtl:bg-gradient-to-l from-[#FAFAFE] to-[#EFEDFF]/50 p-5">
      <h1 className="text-lg font-black text-[#0D0F23] leading-8">{article.title}</h1>
    </div>
    <ArticleMetaCard
      siteId={siteId}
      article={article}
      selectedTarget={selectedTarget}
      onSelectTarget={onSelectTarget}
      onArticleChange={onArticleChange}
    />
   <FinalArticleCard
  siteId={siteId}
  article={article}
  selectedTarget={selectedTarget}
  onSelectTarget={onSelectTarget}
  onArticleChange={onArticleChange}
  onRegenerateSection={onRegenerateSection}
  regeneratingSectionId={regeneratingSectionId}
  sectionActionLabel={t("article.chat.withAgent")}
  isFreePlan={isFreePlan}
/>
    <FaqCard
      siteId={siteId}
      article={article}
      selectedTarget={selectedTarget}
      onSelectTarget={onSelectTarget}
      onArticleChange={onArticleChange}
    />
  </div>
);
export const MobileArticleThread: React.FC<MobileArticleThreadProps> = ({
  siteId,
  article,
  selectedTarget,
  onSelectTarget,
  onArticleChange,
  onRegenerateSection,
  regeneratingSectionId,
  isFreePlan,
}) => {
  const navigate = useNavigate();

  const [priorMessages, setPriorMessages] = useState<ArticleChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [frozenSnapshots, setFrozenSnapshots] = useState<Article[]>([]);
  const [turns, setTurns] = useState<HistoryTurn[]>([]);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── مدل انتخابی برای گفتگو — فعلاً فقط state محلی (Frontend-only)،
  // دقیقاً همان چیزی که در ArticleChatDock (نسخه‌ی دسکتاپ) وجود دارد. ──
  const [selectedModelId, setSelectedModelId] = useState<string>(isFreePlan ? DEFAULT_MODEL_ID : PRO_MODEL_ID);
  // پلن معمولاً بعد از mount لود می‌شود؛ کاربر پولی پیش‌فرض Pro می‌گیرد.
  useEffect(() => setSelectedModelId(isFreePlan ? DEFAULT_MODEL_ID : PRO_MODEL_ID), [isFreePlan]);

  // ── آیا مقاله هنوز در حال تولید/پردازش است — تا وقتی true است، چت
  // کاملاً غیرفعال می‌شود (نه دکمه‌ی ارسال، نه textarea، نه سلکتور مدل)
  // و به‌جای ردیف انتخاب هدف، یک پیام صریح نمایش داده می‌شود که کاربر
  // بفهمد چرا نمی‌تواند چت کند. این مقدار مستقیماً از article.status
  // (که با polling در ArticleGeneratePage به‌روزرسانی می‌شود) مشتق
  // می‌شود، پس نیازی به state جداگانه یا افکت اضافی نیست. ──
  const generating = isInProgress(article.status);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const articleRef = useRef(article);

  const getScrollParent = (): HTMLElement | null => {
    let node = scrollRef.current?.parentElement ?? null;
    while (node) {
      const style = window.getComputedStyle(node);
      if ((style.overflowY === "auto" || style.overflowY === "scroll") && node.scrollHeight > node.clientHeight) {
        return node;
      }
      node = node.parentElement;
    }
    return document.scrollingElement as HTMLElement | null;
  };
  articleRef.current = article;

  articleRef.current = article;

  // ── auto-resize برای textarea چت: با تایپ کاربر قد می‌کشد، اما بیشتر از MAX_TEXTAREA_HEIGHT نه ──
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX_TEXTAREA_HEIGHT = 160; // px

  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [message]);
  /** بارگذاری گفتگوهای قبلیِ ثبت‌شده در سرور — فقط برای نمایشِ متنی
   *  (سرور نسخه‌ی مقاله در لحظه‌ی هر پیام قدیمی را برنمی‌گرداند). */
  useEffect(() => {
    if (!article?.id) return;
    let cancelled = false;
    setLoadingHistory(true);
    articleChatService
      .list(siteId, article.id)
      .then((res) => {
        if (cancelled) return;
        const data = (res as any)?.data?.data ?? (res as any)?.data ?? [];
        setPriorMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        /* خطای شبکه در بارگذاری تاریخچه مانع کارکردِ چتِ جدید نمی‌شود */
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, article?.id]);

  useEffect(() => {
    const scrollParent = getScrollParent();
    if (!scrollParent) return;
    const distanceFromBottom = scrollParent.scrollHeight - scrollParent.scrollTop - scrollParent.clientHeight;
    if (distanceFromBottom > 180) return;
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length, sending]);

  const handleSelectWholeArticle = () => {
    onSelectTarget(targetFromField("general", article));
  };

  const handleSend = async () => {
    const text = message.trim();
    if (!text || !selectedTarget || sending || generating) return;

    setSending(true);
    setError(null);
    setMessage("");

    const beforeArticle = articleRef.current;

    try {
    const res = await articleChatService.send(siteId, beforeArticle.id, {
  target_type: selectedTarget.type,
  target_id: selectedTarget.type === "section" || selectedTarget.type === "faq" ? selectedTarget.id : undefined,
  message: text,
  model: selectedModelId,
});

      const payload = (res as any)?.data ?? res;
      if (!payload?.assistant_message) {
        throw new Error(payload?.message || t("article.errors.invalidResponse"));
      }

      let updatedArticle: Article = beforeArticle;

      if (payload.applied && payload.target) {
        const targetRef = payload.target as ArticleTargetRef;
        updatedArticle = applyTargetRef(beforeArticle, targetRef);
        onSelectTarget({
          type: targetRef.type,
          id: targetRef.id,
          label: targetRef.label ?? "",
          value: targetRef.value,
        });
      } else if (payload.article) {
        // مسیر «کل مقاله» (Agent/Planner)
        updatedArticle = payload.article as Article;
      }

      setFrozenSnapshots((prev) => [...prev, beforeArticle]);
      setTurns((prev) => [...prev, { user: payload.user_message, assistant: payload.assistant_message }]);
      onArticleChange(updatedArticle);
    } catch (err: any) {
      setMessage(text);

      const status = err?.status ?? err?.response?.status;
      const errorCode = err?.data?.error_code ?? err?.response?.data?.error_code;
      const serverMessage = err?.data?.message ?? err?.response?.data?.message ?? err?.message;
      const isSubscriptionError = errorCode === "subscription_required" || status === 403;

      if (isSubscriptionError) {
        const msg = serverMessage || t("article.chat.noCredits");
        setError(msg);
        setTimeout(() => navigate("/subscription", { state: { reason: msg } }), 1800);
      } else {
        setError(serverMessage || t("article.chat.sendFailed"));
      }
    } finally {
      setSending(false);
    }
  };

  const targetLabel = selectedTarget
    ? `${TARGET_TYPE_LABELS[selectedTarget.type] ?? selectedTarget.type}${
        selectedTarget.type === "section" || selectedTarget.type === "faq" ? ` — ${selectedTarget.label}` : ""
      }`
    : null;

  return (
    <div className="mx-auto max-w-2xl px-3 pb-56 pt-2">
      {!loadingHistory && priorMessages.length > 0 && (
        <details className="mb-4 rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE]">
          <summary className="cursor-pointer list-none px-4 py-3 text-xs font-bold text-[#0D0F23]">
            {t("article.chat.previous", { count: priorMessages.length })}
          </summary>
          <div className="space-y-2 border-t border-[#E4E5F0] p-3">
            {priorMessages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>
        </details>
      )}
      {loadingHistory && (
        <div className="mb-4 flex items-center justify-center gap-2 py-4 text-xs text-[#0D0F23]/70">
          <Spinner className="h-4 w-4" /> {t("article.chat.loadingPrevious")}
        </div>
      )}

      <div className="space-y-4">
        {frozenSnapshots.length === 0 ? (
       <LiveArticleBlock
  siteId={siteId}
  article={article}
  selectedTarget={selectedTarget}
  onSelectTarget={onSelectTarget}
  onArticleChange={onArticleChange}
  onRegenerateSection={onRegenerateSection}
  regeneratingSectionId={regeneratingSectionId}
  isFreePlan={isFreePlan}
/>
        ) : (
          <>
            {frozenSnapshots.map((snap, i) => (
              <React.Fragment key={i}>
                <CollapsedVersion
                  label={i === 0 ? t("article.chat.firstDraft") : t("article.chat.draft", { index: i + 1 })}
                  article={snap}
                />
                <MessageBubble message={turns[i].user} />
                <MessageBubble message={turns[i].assistant} />
              </React.Fragment>
            ))}
           <LiveArticleBlock
  siteId={siteId}
  article={article}
  selectedTarget={selectedTarget}
  onSelectTarget={onSelectTarget}
  onArticleChange={onArticleChange}
  onRegenerateSection={onRegenerateSection}
  regeneratingSectionId={regeneratingSectionId}
  isFreePlan={isFreePlan}
/>
          </>
        )}
        {sending && <TypingBubble />}
        <div ref={scrollRef} />
      </div>

      {/* ورودی چت ثابت (Sticky) پایین صفحه — فقط موبایل */}
   <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <div className="mx-auto max-w-2xl space-y-1.5">
          {error && (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] px-3 py-2">
              <p className="text-[10px] font-bold text-[#B3453A]">{error}</p>
              <button onClick={() => setError(null)} className="text-xs text-[#C97C6E]">
                ✕
              </button>
            </div>
          )}

          {/* باکسِ واحدِ ورودیِ چت — ردیفِ بالا فقط چیپِ هدف، ردیفِ پایین
              دکمه‌ی ارسال + textarea + سلکتورِ مدل، همه داخلِ یک قابِ گرد.
              تا وقتی مقاله هنوز در حال تولید است (generating === true)،
              کل این باکس هم بصری کم‌رنگ می‌شود و هم pointer-events آن
              غیرفعال می‌شود — تا کاربر نتواند هیچ تعاملی با چت داشته باشد. */}
          <div
            className={`rounded-2xl border border-[#E4E5F0] bg-white shadow-sm transition-colors focus-within:border-[#5B47FB] ${
              generating ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {/* ردیف بالا: چیپِ بخشِ انتخاب‌شده یا راهنمای انتخاب — یا در
                حالتِ در-حال-تولید، یک پیامِ صریح که علتِ غیرفعال‌بودنِ چت
                را نشان می‌دهد. */}
            <div className="flex flex-wrap items-center gap-1.5 px-3 pt-2 pb-0.5">
              {generating ? (
                <span className="flex items-center gap-1.5 text-[9px] font-black text-[#5B47FB]">
  <Spinner className="h-3 w-3" />
  {t("article.chat.waitForArticle")}
</span>
              ) : (
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  {targetLabel ? (
                    <>
                      <span className="truncate rounded-full bg-[#EFEDFF] px-2 py-0.5 text-[9px] font-bold text-[#5B47FB]">
                        {targetLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectTarget(null)}
                        className="text-[9px] font-bold text-[#0D0F23]/70 hover:text-[#B3453A]"
                      >
                        {t("article.chat.clearTarget")}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-black text-[#B3453A]">{t("article.chat.useSelect")}</span>
                      <span className="text-[9px] font-bold text-[#0D0F23]/40">{t("article.chat.or")}</span>
                      <button
                        type="button"
                        onClick={handleSelectWholeArticle}
                        className="text-[9px] font-black text-[#5B47FB] underline underline-offset-2"
                      >
                        {t("article.chat.selectAll")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ردیف پایین: دکمه‌ی ارسال + textarea + سلکتور مدل (منتقل‌شده به اینجا) */}
            <div className="flex items-end gap-2 px-2.5 pb-2 pt-0.5">
              <button
                type="button"
                onClick={handleSend}
                disabled={!selectedTarget || !message.trim() || sending || generating}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B47FB] text-white transition-colors hover:bg-[#4935E0] disabled:opacity-40"
                aria-label={t("article.chat.sendAria")}
              >
                {sending ? (
                  <Spinner className="h-4 w-4 text-white" />
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19V5" />
                    <path d="M5 12l7-7 7 7" />
                  </svg>
                )}
              </button>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={!selectedTarget || sending || generating}
                rows={1}
                placeholder={
                  generating
                    ? t("article.chat.disabledUntilDone")
                    : selectedTarget
                    ? t("article.chat.placeholderShort")
                    : t("article.chat.selectFirst")
                }
                style={{ maxHeight: MAX_TEXTAREA_HEIGHT, overflowY: "auto" }}
                className="flex-1 resize-none border-0 bg-transparent px-1 py-1 text-xs leading-5 focus:outline-none disabled:text-[#9A9DB8]"
              />

              {/* سلکتور مدل — منتقل‌شده به کنارِ textarea در ردیفِ پایین */}
              <ChatModelSelector
                selectedModelId={selectedModelId}
                onSelect={setSelectedModelId}
                isFreePlan={isFreePlan}
                onRequireUpgrade={() => navigate("/subscription")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};