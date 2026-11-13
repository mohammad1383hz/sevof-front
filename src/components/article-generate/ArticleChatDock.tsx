import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { articleChatService } from "../../services/api";
import type { Article, ArticleChatMessage, ArticleTargetRef } from "../../types";
import { Spinner } from "./UiBits";
import { MarkdownView } from "./MarkdownView";
import { TARGET_TYPE_LABELS } from "./constants";
import { CHAT_DRAG_MIME, parseDrag, targetFromField } from "./chatTarget";
import type { ChatTargetSelection } from "./chatTarget";
import { DEFAULT_MODEL_ID, PRO_MODEL_ID } from "./chatModels";
import { ChatModelSelector } from "./ChatModelSelector";
import { t } from "../../i18n";
interface ArticleChatDockProps {
  siteId: number | string;
  article: Article;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (target: ChatTargetSelection | null) => void;
  onTargetApplied: (target: ArticleTargetRef) => void;
  /**
   * وقتی مسیر «کل مقاله» (Agent/Planner) اجرا می‌شود، پاسخ سرور به‌جای یک
   * target مشخص، کل مقاله‌ی تازه (با section های اضافه/حذف/جابه‌جاشده) را
   * برمی‌گرداند. این callback همان چیزی است که باید state مقاله در صفحه‌ی
   * والد را با آن جایگزین کند تا نیازی به رفرش دستی نباشد.
   */
  onArticleChange: (article: Article) => void;
  /** آیا پنل باز است (کنترل‌شده از بیرون — Layout — تا Sidebar بتواند
   *  بر اساس آن اندازه‌ی لیست مقالات را تنظیم کند). */
  open: boolean;
  /** تغییر وضعیت باز/بسته (کلیک روی هدر) */
  onToggleOpen: () => void;
  /**
   * آیا پلن کاربر رایگان است — برای تعیین اینکه کدام مدل‌های چت در دسترسند.
   * کاربر رایگان فقط می‌تواند مدل Sevof Mini را انتخاب کند؛ بقیه‌ی
   * مدل‌ها قفل (disabled) نشان داده می‌شوند و با کلیک روی آن‌ها به صفحه‌ی
   * اشتراک هدایت می‌شود.
   */
  isFreePlan: boolean;
}

/**
 * حباب «در حال تایپ» — وقتی پیام کاربر ارسال شده و منتظر پاسخ AI هستیم
 * دقیقاً مثل حباب پیام assistant رندر می‌شود، با سه نقطه‌ی انیمیشن‌دار
 * به‌جای متن، تا کاربر مطمئن شود سیستم در حال پردازش درخواست اوست.
 */
const TypingIndicator: React.FC = () => (
  <div className="flex justify-end">
    <div className="max-w-[90%] rounded-2xl bg-[#DCEFEA] px-3 py-2.5 text-[#1B6F63]">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1B6F63]/50 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1B6F63]/50 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1B6F63]/50" />
      </div>
    </div>
  </div>
);

/**
 * پنل گفتگوی AI مقاله — حالا به‌عنوان بخشی از سایدبار رندر می‌شود (نه نوار ثابت پایین صفحه).
 * والد (Sidebar) باید این کامپوننت را داخل یک container با `flex-1 min-h-0 flex flex-col`
 * قرار دهد تا ارتفاعِ باقی‌مانده‌ی سایدبار را بگیرد و لیست پیام‌ها به‌درستی اسکرول شود.
 */
export const ArticleChatDock: React.FC<ArticleChatDockProps> = ({
  siteId,
  article,
  selectedTarget,
  onSelectTarget,
  onTargetApplied,
  onArticleChange,
  open,
  onToggleOpen,
  isFreePlan,
}) => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ArticleChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ── مدل انتخابی برای گفتگو — فعلاً فقط state محلی (Frontend-only) ──
  const [selectedModelId, setSelectedModelId] = useState<string>(isFreePlan ? DEFAULT_MODEL_ID : PRO_MODEL_ID);
  // پلن معمولاً بعد از mount لود می‌شود؛ کاربر پولی پیش‌فرض Pro می‌گیرد.
  useEffect(() => setSelectedModelId(isFreePlan ? DEFAULT_MODEL_ID : PRO_MODEL_ID), [isFreePlan]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!article?.id) return;

    let cancelled = false;
    setLoadingHistory(true);
    setError(null);
    articleChatService
      .list(siteId, article.id)
      .then((res) => {
        if (cancelled) return;
        const data = (res as any)?.data?.data ?? (res as any)?.data ?? [];
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError(t("analyze.errors.history"));
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });

    return () => {
      cancelled = true;
    };
  }, [siteId, article?.id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, sending]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const raw = e.dataTransfer.getData(CHAT_DRAG_MIME) || e.dataTransfer.getData("text/plain");
    const target = raw ? parseDrag(raw) : null;
    if (target) {
      onSelectTarget(target);
    }
  };

  /**
   * انتخاب «کل مقاله» به‌عنوان هدف گفتگو (بدون نیاز به درگ‌ودراپ یک بخش خاص).
   * از همون هلپر آماده‌ی targetFromField استفاده می‌کنیم که type را "general"
   * و value را برابر article.content قرار می‌دهد (دقیقاً همان چیزی که سرور و
   * applyTargetRef برای ویرایش «متن کامل مقاله» انتظار دارند).
   */
  const handleSelectWholeArticle = () => {
    onSelectTarget(targetFromField("general", article));
  };

  const handleSend = async () => {
    const text = message.trim();
    if (!text || !selectedTarget || sending) return;

    setSending(true);
    setError(null);

    const optimisticId = -Date.now();
    const optimisticUser: ArticleChatMessage = {
      id: optimisticId,
      article_id: article.id,
      role: "user",
      target_type: selectedTarget.type,
      target_id: selectedTarget.id,
      target_label: selectedTarget.label,
      content: text,
      applied: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);
    setMessage("");

    try {
      const res = await articleChatService.send(siteId, article.id, {
        target_type: selectedTarget.type,
        target_id:
          selectedTarget.type === "section" || selectedTarget.type === "faq"
            ? selectedTarget.id
            : undefined,
        message: text,
        model: selectedModelId,
      });

      const payload = (res as any)?.data ?? res;
      if (!payload?.assistant_message) {
        throw new Error(payload?.message || t("article.errors.invalidResponse"));
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticId),
        payload.user_message,
        payload.assistant_message,
      ]);

      if (payload.applied && payload.target) {
        // مسیر section/faq خاص: سرور فقط همون تکه‌ی تغییریافته را برمی‌گرداند.
        onTargetApplied(payload.target as ArticleTargetRef);
        onSelectTarget({
          type: payload.target.type,
          id: payload.target.id,
          label: payload.target.label,
          value: payload.target.value,
        });
      } else if (payload.article) {
        // مسیر «کل مقاله» (Agent/Planner): سرور کل مقاله‌ی تازه (با section های
        // اضافه/حذف/جابه‌جاشده) را برمی‌گرداند، نه یک target مشخص. باید همین‌جا
        // state مقاله را جایگزین کنیم تا کاربر بدون رفرش دستی، تغییرات را ببیند.
        onArticleChange(payload.article as Article);
      }
    } catch (err: any) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setMessage(text);

      // === تشخیص خطای «اشتراک/توکن تموم شده» ===
      // نکته‌ی مهم: این بخش بسته به شکلِ دقیق خطایی است که تابع `request` در
      // services/api.ts برمی‌گرداند (مثلاً از یک axios interceptor). اینجا هم
      // err.status و هم err.response.status، و هم err.data و هم
      // err.response.data را چک می‌کنیم تا با هر دو حالت رایج کار کند؛ اگر
      // request در پروژه‌ی شما ساختار متفاوتی دارد (مثلاً خودش خطا را
      // normalize کرده و شکل دیگری برمی‌گرداند)، همین چند خط زیر را مطابق آن
      // اصلاح کن — بقیه‌ی منطق (ریدایرکت به /subscription) دست‌نخورده می‌ماند.
      const status = err?.status ?? err?.response?.status;
      const errorCode = err?.data?.error_code ?? err?.response?.data?.error_code;
      const serverMessage = err?.data?.message ?? err?.response?.data?.message ?? err?.message;

      const isSubscriptionError = errorCode === "subscription_required" || status === 403;

      if (isSubscriptionError) {
        const msg = serverMessage || t("article.chat.noCredits");
        setError(msg);
        // کمی مکث تا کاربر پیام رو ببینه، بعد هدایت به صفحه‌ی خرید/تمدید اشتراک
        setTimeout(() => {
          navigate("/subscription", { state: { reason: msg } });
        }, 1800);
      } else {
        setError(serverMessage || t("article.chat.sendFailed"));
      }
    } finally {
      setSending(false);
    }
  };

  const targetLabel = selectedTarget
    ? `${TARGET_TYPE_LABELS[selectedTarget.type] ?? selectedTarget.type}${
        selectedTarget.type === "section" || selectedTarget.type === "faq"
          ? ` — ${selectedTarget.label}`
          : ""
      }`
    : null;

  /** پیام «هنوز چیزی انتخاب نشده» + لینک انتخاب کل مقاله — در دو جای پنل استفاده می‌شود. */
  const NoTargetHint = () => (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-black text-[#B3453A]">
        {t("article.chat.selectSection")}
      </span>
      <span className="text-[10px] font-bold text-[#000000]/40">{t("article.chat.or")}</span>
      <button
        type="button"
        onClick={handleSelectWholeArticle}
        className="text-[10px] font-black text-[#1B6F63] underline underline-offset-2 hover:text-[#14564C]"
      >
        {t("article.chat.selectAll")}
      </button>
    </div>
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`flex h-full min-h-0 flex-col transition-colors ${
        dragOver ? "bg-[#DCEFEA]/60" : "bg-[#FBFAF6]"
      }`}
    >
      {/* هدر: عنوان + دکمه‌ی جمع/باز کردن (همون «دراپ‌داون» فعال/غیرفعال‌سازی) */}
      <div className="flex w-full shrink-0 items-center justify-between px-3 py-2.5">
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex items-center gap-2 text-start"
        >
          <span className="text-xs font-black text-[#1E2A28]">💬 {t("article.chat.title")}</span>
          <svg
            className={`h-3.5 w-3.5 text-[#000000]/60 transition-transform ${open ? "" : "rotate-180"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.3 12.7a1 1 0 010-1.4L10 6.6l4.7 4.7a1 1 0 11-1.4 1.4L10 9.4l-3.3 3.3a1 1 0 01-1.4 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* نشانگر بخشِ انتخاب‌شده وقتی پنل بسته است (تا کاربر بدون باز کردن هم بدونه چیزی انتخاب شده) */}
      {!open && (
        <div className="shrink-0 px-3 pb-2">
          {targetLabel ? (
            <span className="truncate rounded-full bg-[#DCEFEA] px-2 py-0.5 text-[10px] font-bold text-[#1B6F63]">
              {targetLabel}
            </span>
          ) : (
            <NoTargetHint />
          )}
        </div>
      )}

      {open && (
        <div className="flex min-h-0 flex-1 flex-col border-t border-[#DAD5C7]">
          {dragOver && (
            <div className="mx-3 mt-2 shrink-0 rounded-xl border-2 border-dashed border-[#1B6F63] bg-[#DCEFEA]/60 py-2 text-center text-[10px] font-bold text-[#1B6F63]">
              {t("article.chat.drop")}
            </div>
          )}

          <div ref={listRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-2.5">
            {loadingHistory ? (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-[#000000]/70">
                <Spinner className="h-4 w-4" /> {t("article.chat.loading")}
              </div>
            ) : messages.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#000000]/70">
                {t("article.chat.empty")}
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-[11px] leading-5 ${
                      m.role === "user" ? "bg-[#EFEDE6] text-[#1E2A28]" : "bg-[#DCEFEA] text-[#1E2A28]"
                    }`}
                  >
                    {m.target_label && (
                      <div
                        className={`mb-1 text-[10px] font-bold ${
                          m.role === "user" ? "text-[#000000]/70" : "text-[#1B6F63]"
                        }`}
                      >
                        {TARGET_TYPE_LABELS[m.target_type ?? ""] ?? m.target_type} · {m.target_label}
                      </div>
                    )}
                    <MarkdownView text={m.content} />
                    {m.role === "assistant" && m.applied && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#EDE3CF] px-2 py-0.5 text-[10px] font-bold text-[#8A6A2F]">
                        ✓ {t("article.chat.applied")}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {sending && <TypingIndicator />}
          </div>

          {error && (
            <div className="mx-3 mb-2 flex shrink-0 items-center justify-between rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] px-3 py-2">
              <p className="text-[10px] font-bold text-[#B3453A]">{error}</p>
              <button onClick={() => setError(null)} className="text-[#C97C6E] text-xs">✕</button>
            </div>
          )}

          <div className="shrink-0 space-y-1.5 border-t border-[#DAD5C7] p-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {targetLabel ? (
                  <>
                    <span className="truncate rounded-full bg-[#DCEFEA] px-2 py-0.5 text-[10px] font-bold text-[#1B6F63]">
                      {targetLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTarget(null)}
                      className="shrink-0 text-[10px] font-bold text-[#000000]/70 hover:text-[#B3453A]"
                    >
                      {t("article.chat.clearTarget")}
                    </button>
                  </>
                ) : (
                  <NoTargetHint />
                )}
              </div>

              {/* سلکتور مدل — گوشه‌ی مقابلِ نشانگر بخشِ انتخاب‌شده */}
              <ChatModelSelector
                selectedModelId={selectedModelId}
                onSelect={setSelectedModelId}
                isFreePlan={isFreePlan}
                onRequireUpgrade={() => navigate("/subscription")}
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={!selectedTarget || sending}
              rows={2}
              placeholder={
                selectedTarget
                  ? t("article.chat.placeholder")
                  : t("article.chat.placeholderEmpty")
              }
              className="w-full resize-none rounded-xl border border-[#DAD5C7] px-3 py-2 text-[11px] focus:border-[#1B6F63] focus:outline-none disabled:bg-[#EFEDE6] disabled:text-[#9BA69F]"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!selectedTarget || !message.trim() || sending}
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[#1B6F63] text-xs font-bold text-white transition-colors hover:bg-[#14564C] disabled:opacity-40"
            >
              {sending ? <Spinner className="h-3.5 w-3.5" /> : t("support.reply.send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};