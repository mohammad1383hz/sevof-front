// src/components/article-generate/DesktopArticleThread.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { articleChatService } from "../../services/api";
import type { Article, ArticleChatMessage, ArticleSection, ArticleTargetRef } from "../../types";
import { Spinner } from "./UiBits";
import { MarkdownView } from "./MarkdownView";
import { TARGET_TYPE_LABELS, isInProgress } from "./constants";
import { applyTargetRef, targetFromField, CHAT_DRAG_MIME } from "./chatTarget";
import type { ChatTargetSelection } from "./chatTarget";
import { ArticleMetaCard } from "./ArticleMetaCard";
import { FinalArticleCard } from "./FinalArticleCard";
import { FaqCard } from "./FaqCard";
import { ChatModelSelector } from "./ChatModelSelector";
import { DEFAULT_MODEL_ID, PRO_MODEL_ID } from "./chatModels";
import { useDesktopSidebarOpen } from "../../context/SidebarLayoutContext";
import { t } from "../../i18n";

/**
 * نسخه‌ی دسکتاپِ ترد چتِ مقاله — از نظر رفتار (تاریخچه‌ی گفتگو، نسخه‌های
 * منجمدشده‌ی قبلیِ مقاله بین پیام‌ها، کارت‌های زنده‌ی قابل‌ویرایش، و نوارِ
 * ورودیِ ثابت پایین صفحه) دقیقاً معادل MobileArticleThread است؛ فقط
 * اندازه‌ها/چیدمان برای صفحه‌ی دسکتاپ (و کنارِ سایدبارِ ثابت سمت راست)
 * تنظیم شده‌اند. عمداً یک فایلِ کاملاً جدا است تا هیچ تغییری در
 * MobileArticleThread ایجاد نشود.
 *
 * توجه: تصویر شاخص مقاله (ArticleImageCard) و تیترِ H1 عمداً اینجا نیستند
 * — چون در ArticleGeneratePage همان‌طور که قبلاً بودند، بیرون از این
 * کامپوننت و بدون تغییر باقی می‌مانند.
 *
 * ── Drag & Drop ──
 * FinalArticleCard برای «کل مقاله» و برای هر بخش، یک DragHandle دارد که
 * روی dragstart دیتای هدف (ChatTargetSelection سریالایز‌شده) را با mime
 * type به نام CHAT_DRAG_MIME ست می‌کند. اینجا (داخل DesktopArticleThread)
 * باکسِ ورودیِ چت را به یک drop zone تبدیل می‌کنیم: با رهاکردنِ آن دستگیره
 * روی این باکس، همان هدف به‌عنوانِ selectedTarget انتخاب می‌شود — دقیقاً
 * همان اتفاقی که با کلیک روی دکمه‌ی «گفتگو» می‌افتد.
 *
 * ── نمایشِ فوریِ پیامِ کاربر (Optimistic) ──
 * قبلاً پیامِ کاربر فقط بعد از رسیدنِ پاسخِ سرور (همراه با پیامِ دستیار)
 * به‌عنوانِ یک turn کامل اضافه می‌شد؛ یعنی تا وقتی جواب نمی‌آمد، کاربر
 * پیامِ خودش را در صفحه نمی‌دید و فقط حبابِ لودینگ (TypingBubble) بود.
 * حالا به‌محضِ فشردنِ دکمه‌ی ارسال، پیامِ کاربر بلافاصله (pendingUser)
 * رندر می‌شود و صفحه به‌همان لحظه تا انتها اسکرول می‌شود؛ وقتی پاسخِ
 * سرور رسید، pendingUser پاک شده و turn واقعی (شاملِ همان پیامِ کاربر +
 * پاسخِ دستیار) جایگزینش می‌شود — بدون هیچ پرشِ بصری محسوس.
 *
 * ── غیرفعال‌بودنِ چت حینِ تولیدِ مقاله ──
 * تا وقتی وضعیتِ مقاله هنوز «در حال پیشرفت» است (isInProgress(article.status)
 * === true، یعنی هنوز تولید بخش‌ها/تصویر/... تمام نشده)، کاربر نباید
 * بتواند چت کند: کلِ باکسِ ورودیِ چت غیرفعال و کم‌رنگ می‌شود، به‌جایِ
 * ردیفِ انتخابِ هدف یک پیامِ صریح («در حال تولید مقاله…») نشان داده
 * می‌شود، drag&drop روی باکس هم غیرفعال می‌شود، و handleSend هم به‌طور
 * مستقل این حالت را چک می‌کند تا از هر مسیرِ احتمالیِ دیگر هم جلوگیری شود.
 */

interface DesktopArticleThreadProps {
  siteId: number | string;
  article: Article;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (target: ChatTargetSelection | null) => void;
  onArticleChange: (article: Article) => void;
  onRegenerateSection: (section: ArticleSection) => void;
  regeneratingSectionId: string | null;
  /** آیا پلن کاربر رایگان است — دقیقاً همان مقداری که در نسخه‌ی موبایل
   *  به سلکتور مدل پاس داده می‌شود. */
  isFreePlan: boolean;
}

interface HistoryTurn {
  user: ArticleChatMessage;
  assistant: ArticleChatMessage;
}

/** خلاصه‌ی فقط-خواندنیِ یک نسخه‌ی قدیمیِ مقاله — عیناً معادل نسخه‌ی موبایل. */
const FrozenArticleSummary: React.FC<{ article: Article }> = ({ article }) => {
  const sections = article.sections ?? [];
  const faq = article.faq ?? [];
  return (
    <div className="space-y-3">
      <h4 className="text-base font-black text-[#1E2A28] leading-7">{article.title}</h4>
      {article.excerpt && <p className="text-xs text-[#000000] leading-6">{article.excerpt}</p>}
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
        <div className="space-y-1.5 border-t border-[#DAD5C7] pt-3">
          <p className="text-[11px] font-black text-[#000000]">❓ {t("article.sectionType.faq")}</p>
          {faq.map((f, i) => (
            <div key={i} className="text-xs text-[#000000] leading-6">
              <span className="font-bold text-[#1E2A28]">
                {i + 1}. {f.question}
              </span>
              <p className="mt-0.5 text-[#000000]">{f.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CollapsedVersion: React.FC<{ label: string; article: Article }> = ({ label, article }) => (
  <details className="group rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6]">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-5 py-3.5 text-xs font-bold text-[#000000]">
      <span>{label}</span>
      <span className="flex items-center gap-1 text-[#000000]/60">
        {t("dashboard.view")}
        <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" clipRule="evenodd" />
        </svg>
      </span>
    </summary>
    <div className="select-text border-t border-[#DAD5C7] p-5">
      <FrozenArticleSummary article={article} />
    </div>
  </details>
);

const MessageBubble: React.FC<{ message: ArticleChatMessage; pending?: boolean }> = ({ message, pending }) => (
  <div className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
    <div
      className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-6 ${
        message.role === "user" ? "bg-[#EFEDE6] text-[#1E2A28]" : "bg-[#DCEFEA] text-[#1E2A28]"
      } ${pending ? "opacity-70" : ""}`}
    >
      {message.target_label && (
        <div className={`mb-1 text-[10px] font-bold ${message.role === "user" ? "text-[#000000]/70" : "text-[#1B6F63]"}`}>
          {TARGET_TYPE_LABELS[message.target_type ?? ""] ?? message.target_type} · {message.target_label}
        </div>
      )}
      <MarkdownView text={message.content} />
    </div>
  </div>
);

const TypingBubble: React.FC = () => (
  <div className="flex justify-end">
    <div className="rounded-2xl bg-[#DCEFEA] px-4 py-3 text-[#1B6F63]">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1B6F63]/50 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1B6F63]/50 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1B6F63]/50" />
      </div>
    </div>
  </div>
);

/** بلوکِ «نسخه‌ی زنده و فعلیِ» مقاله برای دسکتاپ — دقیقاً همان کارت‌هایی
 *  که قبلاً مستقیم داخل ArticleGeneratePage (نسخه‌ی دسکتاپ) رندر می‌شدند
 *  (تنظیمات سئو + بخش‌ها + سوالات متداول)، فقط حالا داخل ترد چت. */
const LiveArticleBlock: React.FC<{
  siteId: number | string;
  article: Article;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (t: ChatTargetSelection) => void;
  onArticleChange: (article: Article) => void;
  onRegenerateSection: (section: ArticleSection) => void;
  regeneratingSectionId: string | null;
  isFreePlan: boolean;
}> = ({ siteId, article, selectedTarget, onSelectTarget, onArticleChange, onRegenerateSection, regeneratingSectionId, isFreePlan }) => (
  <div className="space-y-4">
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

export const DesktopArticleThread: React.FC<DesktopArticleThreadProps> = ({
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

  // آیا سایدبارِ دسکتاپ در حال حاضر باز است — از Layout (از طریق Context)
  // خوانده می‌شود تا نوارِ ثابتِ پایینِ چت همیشه دقیقاً هم‌عرضِ ستونِ محتوا
  // بماند و با toggle سایدبار هماهنگ جابه‌جا شود (نه اینکه جایش ثابت
  // بماند و از ریتم محتوا عقب/جلو بیفتد).
  const desktopSidebarOpen = useDesktopSidebarOpen();

  const [priorMessages, setPriorMessages] = useState<ArticleChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [frozenSnapshots, setFrozenSnapshots] = useState<Article[]>([]);
  const [turns, setTurns] = useState<HistoryTurn[]>([]);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── پیامِ کاربر که هنوز در حالِ ارسال است (Optimistic UI) — بلافاصله
  // بعد از فشردنِ دکمه‌ی ارسال ست می‌شود تا کاربر بدونِ معطلی برای پاسخِ
  // سرور، پیامِ خودش را در انتهای گفتگو ببیند. با رسیدنِ پاسخ (چه موفق
  // چه ناموفق) دوباره null می‌شود. ──
  const [pendingUser, setPendingUser] = useState<ArticleChatMessage | null>(null);

  // ── مدل انتخابی برای گفتگو — دقیقاً معادل نسخه‌ی موبایل. ──
  const [selectedModelId, setSelectedModelId] = useState<string>(isFreePlan ? DEFAULT_MODEL_ID : PRO_MODEL_ID);
  // پلن معمولاً بعد از mount لود می‌شود؛ کاربر پولی پیش‌فرض Pro می‌گیرد.
  useEffect(() => setSelectedModelId(isFreePlan ? DEFAULT_MODEL_ID : PRO_MODEL_ID), [isFreePlan]);

  // ── وضعیتِ drag-over برای باکسِ ورودیِ چت — وقتی کاربر یکی از
  // دستگیره‌های درگ (کل مقاله / یک بخش) را روی این باکس نگه می‌دارد،
  // true می‌شود تا هایلایتِ بصری نشان داده شود. ──
  const [isDropTarget, setIsDropTarget] = useState(false);

  // ── آیا مقاله هنوز در حال تولید/پردازش است — تا وقتی true است، چت
  // کاملاً غیرفعال می‌شود (نه دکمه‌ی ارسال، نه textarea، نه drag&drop) و
  // به‌جای ردیف انتخاب هدف، یک پیام صریح نمایش داده می‌شود که کاربر
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

  // ── auto-resize برای textarea چت: با تایپ کاربر قد می‌کشد، اما بیشتر از MAX_TEXTAREA_HEIGHT نه ──
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX_TEXTAREA_HEIGHT = 160; // px — تقریباً هم‌ارزِ max-h-40

  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [message]);

  articleRef.current = article;

  /** بارگذاری گفتگوهای قبلیِ ثبت‌شده در سرور — همان منطقِ نسخه‌ی موبایل. */
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
    autoResizeTextarea();
  }, [message]);

  useEffect(() => {
    autoResizeTextarea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── اسکرول به انتهای گفتگو — با تغییرِ تعدادِ turnهای رسمی، شروع/پایانِ
  // ارسال، یا نمایش/حذفِ پیامِ درحالِ‌ارسالِ کاربر (pendingUser). به‌همین
  // خاطر است که همان لحظه‌ای که کاربر پیام را می‌فرستد (پیش از رسیدنِ
  // پاسخِ سرور) هم صفحه بلافاصله تا ته می‌رود. از requestAnimationFrame
  // استفاده می‌کنیم تا مطمئن شویم پیش از اسکرول، DOM (شاملِ ریسایزِ
  // textarea و رندرِ حبابِ جدید) کاملاً به‌روز شده است. ──
  useEffect(() => {
    const scrollParent = getScrollParent();
    if (!scrollParent) return;
    const distanceFromBottom = scrollParent.scrollHeight - scrollParent.scrollTop - scrollParent.clientHeight;
    // اگر کاربر بالای مقاله را می‌خواند، هیچ state/polling داخلی نباید او را
    // دوباره به انتهای صفحه ببرد. فقط وقتی نزدیک انتهاست، پیام جدید پایین می‌رود.
    if (distanceFromBottom > 180) return;

    const scrollToEnd = (smooth: boolean) => {
      scrollRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
    };
    const raf = requestAnimationFrame(() => scrollToEnd(false));
    const timeout = setTimeout(() => scrollToEnd(true), 120);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [turns.length, sending, pendingUser]);

  const handleSelectWholeArticle = () => {
    onSelectTarget(targetFromField("general", article));
  };

  const handleSend = async () => {
    const text = message.trim();
    if (!text || !selectedTarget || sending || generating) return;

    setSending(true);
    setError(null);
    setMessage("");

    // نمایشِ فوریِ پیامِ کاربر — تا خودِ همین لحظه (نه بعدِ رسیدنِ پاسخ)
    // پیامِ ارسال‌شده در انتهای گفتگو دیده شود، درست کنارِ حبابِ لودینگ.
    setPendingUser({
      id: -1,
      role: "user",
      content: text,
      target_type: selectedTarget.type,
      target_label: selectedTarget.label,
    } as unknown as ArticleChatMessage);

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
      // چه موفق چه ناموفق، پیامِ موقتِ Optimistic دیگر لازم نیست: در حالتِ
      // موفق جایش را turn واقعی می‌گیرد، در حالتِ ناموفق هم متن به
      // ورودیِ چت برگردانده شده (بالا) تا کاربر دوباره امتحان کند.
      setPendingUser(null);
    }
  };

  // ── Drag & Drop: دریافتِ هدف (کل مقاله / یک بخش / FAQ) که از
  // FinalArticleCard (یا هر کارتِ دیگری که از همین DragHandle استفاده
  // می‌کند) روی باکسِ ورودیِ چت رها شده است. تا وقتی مقاله در حال تولید
  // است، drop zone هم غیرفعال می‌شود تا کاربر نتواند از این مسیر هم
  // هدفی برای چت انتخاب کند. ──
  const handleDragOver = (e: React.DragEvent) => {
    if (generating) return;
    if (!e.dataTransfer.types.includes(CHAT_DRAG_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isDropTarget) setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // فقط وقتی واقعاً از باکس خارج شده (نه وقتی وارد یک فرزندِ داخلی شده)
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (generating) return;
    e.preventDefault();
    setIsDropTarget(false);

    const raw = e.dataTransfer.getData(CHAT_DRAG_MIME);
    if (!raw) return;

    try {
      const target = JSON.parse(raw) as ChatTargetSelection;
      if (!target?.type) return;
      onSelectTarget(target);
      // بعد از رهاکردن، فوکوس مستقیم برود روی textarea تا کاربر بلافاصله بتواند تایپ کند
      requestAnimationFrame(() => textareaRef.current?.focus());
    } catch {
      /* دیتای نامعتبر یا ناسازگار — بی‌صدا نادیده گرفته می‌شود */
    }
  };

  const targetLabel = selectedTarget
    ? `${TARGET_TYPE_LABELS[selectedTarget.type] ?? selectedTarget.type}${
        selectedTarget.type === "section" || selectedTarget.type === "faq" ? ` — ${selectedTarget.label}` : ""
      }`
    : null;

  return (
    <>
      <div className="space-y-4">
        {!loadingHistory && priorMessages.length > 0 && (
          <details className="rounded-2xl border border-[#DAD5C7] bg-[#FBFAF6]">
            <summary className="cursor-pointer list-none px-5 py-3.5 text-xs font-bold text-[#000000]">
              {t("article.chat.previous", { count: priorMessages.length })}
            </summary>
            <div className="space-y-2 border-t border-[#DAD5C7] p-4">
              {priorMessages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
          </details>
        )}
        {loadingHistory && (
          <div className="flex items-center justify-center gap-2 py-4 text-xs text-[#000000]/70">
            <Spinner className="h-4 w-4" /> {t("article.chat.loadingPrevious")}
          </div>
        )}

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

        {/* پیامِ درحالِ‌ارسالِ کاربر (Optimistic) — همراهِ حبابِ لودینگِ
            دستیار، دقیقاً در انتهای گفتگو، پیش از رسیدنِ پاسخِ سرور. */}
        {pendingUser && <MessageBubble message={pendingUser} pending />}
        {sending && <TypingBubble />}

        {/* لنگرِ اسکرول + فاصله‌ی خالیِ همیشگی — عمداً روی یک المنتِ واحد.
            نکته‌ی مهم: نوارِ ورودیِ چت position:fixed و bottom-0 است، یعنی
            همیشه یک بخشِ ثابت از پایینِ صفحه را می‌پوشاند، فارغ از مقدارِ
            اسکرول. اگر لنگرِ اسکرول را روی یک المنتِ خالی *قبل* از این
            فاصله می‌گذاشتیم (همان‌طور که قبلاً بود)، scrollIntoView دقیقاً
            کفِ پنجره‌ی مرورگر می‌بردش — یعنی درست پشتِ همین نوارِ ثابت، و
            پیام/لودینگ زیرش مخفی می‌ماند. با گذاشتنِ ref روی خودِ همین
            فاصله‌ی h-56، اسکرول تا انتهای واقعیِ سند می‌رود و آخرین پیام
            (بالای این فاصله) دقیقاً بالای نوارِ ثابت قرار می‌گیرد، نه
            پشتش. ارتفاعش (h-56) کمی بیشتر از بلندترینِ حالتِ ممکنِ نوارِ
            ورودی (وقتی خطا نشان داده می‌شود یا برچسبِ انتخاب‌شده به خط
            بعد می‌رود) در نظر گرفته شده است. */}
        <div ref={scrollRef} className="h-56 scroll-mb-4" aria-hidden="true" />
      </div>

      {/* نوار ورودیِ چت — ثابت (Fixed) پایین صفحه، فقط در دسکتاپ. عرضش
          (فاصله از لبه‌ی راست تا لبه‌ی سایدبار) به‌جای مقدارِ ثابتِ قبلی
          (lg:start-80)، حالا از desktopSidebarOpen مشتق می‌شود: وقتی
          سایدبار بازه lg:start-80 (هم‌عرضِ عرضِ واقعیِ سایدبار)، وقتی
          سایدبار جمع شده lg:start-0 (چون دیگر چیزی برای رزروکردنِ جا در
          سمت راست نیست). این دقیقاً همان تکنیکی است که در Layout.tsx برای
          نوار وضعیت پلن استفاده شده — بدونش، این نوار هنگام toggle کردنِ
          سایدبار همیشه انگار سایدبار بازه رفتار می‌کرد و با محتوا
          ناهماهنگ می‌شد. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 hidden px-4 pb-4 pt-3 backdrop-blur sm:px-6 lg:block transition-all duration-300 ${
          desktopSidebarOpen ? "lg:start-80" : "lg:start-0"
        }`}
      >
        <div className="mx-auto max-w-4xl space-y-2">
          {error && (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[#E3C4BC] bg-[#F7EEEA] px-3 py-2">
              <p className="text-[11px] font-bold text-[#B3453A]">{error}</p>
              <button onClick={() => setError(null)} className="text-xs text-[#C97C6E]">
                ✕
              </button>
            </div>
          )}

          {/* باکسِ واحدِ ورودیِ چت — بزرگ‌تر، شاملِ ردیفِ چیپِ هدف در بالا و
              ردیفِ تایپ/ارسال/مدل در پایین، همه داخل یک قاب‌ِ گرد و مشخص.
              این باکس همچنین drop-zoneِ درگ‌ودراپِ «کشیدن به گفتگو» است:
              با رهاکردنِ دستگیره‌ی درگِ کل مقاله یا یک بخش روی این باکس،
              همان هدف به‌عنوانِ selectedTarget انتخاب می‌شود.
              تا وقتی مقاله هنوز در حال تولید است (generating === true)،
              کل این باکس هم بصری کم‌رنگ می‌شود و هم pointer-events آن
              غیرفعال می‌شود — تا کاربر نتواند هیچ تعاملی (تایپ، ارسال،
              درگ‌ودراپ) با چت داشته باشد. */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border bg-white shadow-sm transition-colors focus-within:border-[#1B6F63] ${
              isDropTarget ? "border-[#1B6F63] ring-2 ring-[#1B6F63]/30 bg-[#DCEFEA]/30" : "border-[#DAD5C7]"
            } ${generating ? "opacity-60 pointer-events-none" : ""}`}
          >
            {/* اورلیِ راهنما هنگام درگ — فقط بصری، جلوی رویدادهای موس/درگ را نمی‌گیرد */}
            {isDropTarget && !generating && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#DCEFEA]/80 text-xs font-black text-[#1B6F63]">
                {t("article.chat.dropHere")}
              </div>
            )}

            {/* ردیف بالا: چیپِ هدفِ انتخاب‌شده — یا در حالتِ در-حال-تولید،
                یک پیامِ صریح که علتِ غیرفعال‌بودنِ چت را نشان می‌دهد. */}
            <div className="flex flex-wrap items-center gap-2 px-4 pt-2.5 pb-1">
              {generating ? (
                <span className="flex items-center gap-2 text-[11px] font-black text-[#1B6F63]">
                  <Spinner className="h-3.5 w-3.5" />
  {t("article.chat.waitForArticle")}
                </span>
              ) : (
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  {targetLabel ? (
                    <>
                      <span className="truncate rounded-full bg-[#DCEFEA] px-2.5 py-1 text-[11px] font-bold text-[#1B6F63]">
                        {targetLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectTarget(null)}
                        className="text-[11px] font-bold text-[#000000]/70 hover:text-[#B3453A]"
                      >
                        {t("article.chat.clearTarget")}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-black text-[#B3453A]">{t("article.chat.selectSection")}</span>
                      <span className="text-[11px] font-bold text-[#000000]/40">{t("article.chat.or")}</span>
                      <button
                        type="button"
                        onClick={handleSelectWholeArticle}
                        className="text-[11px] font-black text-[#1B6F63] underline underline-offset-2"
                      >
                        {t("article.chat.selectAll")}
                      </button>
                      <span className="text-[11px] font-bold text-[#000000]/40">{t("article.chat.orDrag")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ردیف پایین: دکمه‌ی ارسال + textarea + سلکتور مدل (منتقل‌شده به اینجا) */}
            <div className="flex items-end gap-2 px-3 pb-2.5 pt-0.5">
              <button
                type="button"
                onClick={handleSend}
                disabled={!selectedTarget || !message.trim() || sending || generating}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B6F63] text-white transition-colors hover:bg-[#14564C] disabled:opacity-40"
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
                className="flex-1 resize-none border-0 bg-transparent px-1.5 py-1 text-xs leading-5 focus:outline-none disabled:text-[#9BA69F]"
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
    </>
  );
};