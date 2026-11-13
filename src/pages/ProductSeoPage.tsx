// src/pages/ProductSeoPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { siteService, contentChatSessionService, productSeoIdeaService } from "../services/api";
import IdeaCard from "../components/product-article/IdeaCard";
import type { IdeaWithArticle } from "../components/product-article/IdeaCard";
import IdeaEditModal from "../components/product-article/IdeaEditModal";
import ProductPickerModal, { faNum } from "../components/product-article/ProductPickerModal";
import type { PickerProduct } from "../components/product-article/ProductPickerModal";
import { ICONS, Icon } from "../components/product-article/ModalShell";
import ProductArticleGeneratePage from "./ProductArticleGeneratePage";
import { t } from "../i18n";

// درخواست آماده؛ هنگام باز شدن صفحه داخل کادر نوشتن قرار می‌گیرد.
// اگر کاربر کادر را خالی بفرستد هم همین درخواست ارسال می‌شود.
const getDefaultPrompt = () => t("product.seo.defaultPrompt");

// وقتی کاربر محصولات را دستی انتخاب کرده و کادر را خالی فرستاده
const getManualPrompt = () => t("product.seo.manualPrompt");

const MAX_MANUAL_PRODUCTS = 8; // باید با MAX_MANUAL_PRODUCTS در کنترلر یکی باشد
// توضیح ساده‌ی کارکرد ابزار (نمای اولیه)
const BENEFITS = [
  {
    get title() { return t("product.seo.benefits.introTitle"); },
    get text() { return t("product.seo.benefits.introText"); },
    icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  },
  {
    get title() { return t("product.seo.benefits.googleTitle"); },
    get text() { return t("product.seo.benefits.googleText"); },
    icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  },
  {
    get title() { return t("product.seo.benefits.salesTitle"); },
    get text() { return t("product.seo.benefits.salesText"); },
    icon: "M3 17l5-5 4 4 8-9M14 7h6v6",
  },
];

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 40; // حدود ۲ دقیقه

type Msg = { id: string | number; role: "user" | "assistant"; content: string };

const segClass = (active: boolean) =>
  `inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
    active ? "bg-white text-[#4935E0] shadow-sm" : "text-[#6C7193] hover:text-[#0D0F23]"
  }`;

const ProductSeoPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const siteParam = params.get("site");
  const chatParam = params.get("chat");
  const articleParam = params.get("article"); // مقاله‌ی بازشده (ULID)

  const [siteId, setSiteId] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  // درخواست آماده از همان ابتدا داخل کادر است
  const [prompt, setPrompt] = useState(() => getDefaultPrompt());
  const [messages, setMessages] = useState<Msg[]>([]);
  const [ideas, setIdeas] = useState<IdeaWithArticle[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectingId, setSelectingId] = useState<number | string | null>(null);

  // انتخاب دستی محصولات قبل از تولید ایده (خالی = انتخاب خودکار)
  const [manualProducts, setManualProducts] = useState<PickerProduct[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const isManual = manualProducts.length > 0;

  // ایده‌ای که در مودال ویرایش باز است
  const [editingIdea, setEditingIdea] = useState<IdeaWithArticle | null>(null);

  // ایده‌ای که کاربر «تولید مقاله» را برایش زده و هنوز مقاله‌اش ساخته نشده
  const [ideaForNew, setIdeaForNew] = useState<string | null>(null);
  // مقاله‌ای که همین الان شروع شده (تا آدرس آپدیت شود هم نمای مقاله باز بماند)
  const [startedArticleId, setStartedArticleId] = useState<string | null>(null);

  const effectiveArticleId = articleParam ?? startedArticleId;
  const showArticle = ideaForNew !== null || !!effectiveArticleId;

  const sessionIdRef = useRef<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTokenRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ساخت آدرس صفحه با حفظ site/chat و افزودن اختیاریِ article
  const buildUrl = (opts?: { article?: number | string | null }) => {
    const q = new URLSearchParams();
    if (siteId) q.set("site", String(siteId));
    if (sessionIdRef.current) q.set("chat", sessionIdRef.current);
    else if (chatParam) q.set("chat", chatParam);
    if (opts?.article) q.set("article", String(opts.article));
    return `/product-seo?${q.toString()}`;
  };

  const stopPoll = () => {
    pollTokenRef.current += 1;
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    pollTimerRef.current = null;
  };

  const reset = () => {
    stopPoll();
    sessionIdRef.current = null;
    setMessages([]);
    setIdeas([]);
    setBusy(false);
    setError(null);
    setPrompt(getDefaultPrompt()); // گفتگوی تازه = درخواست آماده
    setManualProducts([]);
    setPickerOpen(false);
    setEditingIdea(null);
    setIdeaForNew(null);
    setStartedArticleId(null);
  };

  // پیدا کردن سایت
  useEffect(() => {
    (async () => {
      if (siteParam) {
        setSiteId(siteParam);
        return;
      }
      try {
        const res = await siteService.list(1);
        const first = res.success ? res.data?.data?.[0] : null;
        if (first) setSiteId(first.id);
      } catch (err) {
        console.error("[ProductSeo] site list error:", err);
      }
    })();
  }, [siteParam]);

  // پیدا کردن دامنه برای نمایش
  useEffect(() => {
    if (!siteId) return;
    siteService
      .show(siteId)
      .then((res) => {
        const s = (res.data as any)?.site || (res.data as any)?.data;
        setDomain(s?.domain ?? null);
        // سایت فروشگاهی (ووکامرس) نیست؛ این صفحه برایش معنی ندارد
      })
      .catch((err) => console.error("[ProductSeo] site show error:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  const pollIdeas = (id: string, batch: number) => {
    stopPoll();
    const token = pollTokenRef.current;
    let attempts = 0;
    setBusy(true);

    const tick = async () => {
      if (token !== pollTokenRef.current) return;
      attempts += 1;
      try {
        const res = await productSeoIdeaService.list(id, batch);
        if (token !== pollTokenRef.current) return;
        if (res.success && res.data) {
          if (res.data.error) {
            setError(res.data.error);
            setBusy(false);
            return;
          }
          if (res.data.data?.length) {
            setIdeas(res.data.data as IdeaWithArticle[]);
            setBusy(false);
            return;
          }
        }
      } catch (err) {
        console.error("[ProductSeo] poll error:", err);
      }
      if (attempts >= POLL_MAX_ATTEMPTS) {
        setError(t("product.seo.errors.slow"));
        setBusy(false);
        return;
      }
      pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    };

    tick();
  };

  // باز کردن یک گفتگوی قبلی (kind=product) یا شروع گفتگوی خالی
  useEffect(() => {
    if (!siteId) return;
    if (!chatParam) {
      reset();
      return;
    }
    if (sessionIdRef.current === chatParam) return; // همین الان خودمان ساختیمش

    (async () => {
      stopPoll();
      try {
        const res = await contentChatSessionService.show(siteId, chatParam);
        const list: any[] = res.success ? res.data?.session?.messages ?? [] : [];
        sessionIdRef.current = chatParam;
        setMessages(list.map((m) => ({ id: m.id, role: m.role, content: m.content })));
        setIdeas([]);
        setError(null);
        setBusy(false);
        setEditingIdea(null);
        setIdeaForNew(null);
        setStartedArticleId(null);
        // گفتگوی قبلی باز شده؛ درخواست آماده دیگر لازم نیست
        setPrompt("");
        const last = [...list].reverse().find((m) => m.batch);
        if (last) {
          const r = await productSeoIdeaService.list(siteId, Number(last.batch));
          if (r.success && r.data?.data?.length) setIdeas(r.data.data as IdeaWithArticle[]);
          else pollIdeas(siteId, Number(last.batch));
        }
      } catch (err) {
        console.error("[ProductSeo] open chat error:", err);
        setError(t("product.seo.errors.open"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, chatParam]);

  useEffect(() => stopPoll, []);

  /* ── انتخاب دستی محصولات ── */
  const confirmManualProducts = (items: PickerProduct[]) => {
    setManualProducts(items);
    setPickerOpen(false);
    // متن آماده درباره‌ی «پرفروش‌ترین‌ها» با انتخاب دستی نمی‌خواند
    if (items.length > 0 && prompt === getDefaultPrompt()) setPrompt("");
    if (items.length === 0 && prompt.trim() === "") setPrompt(getDefaultPrompt());
  };

  const useAutoMode = () => {
    setManualProducts([]);
    if (prompt.trim() === "") setPrompt(getDefaultPrompt());
  };

  const send = async () => {
    if (!siteId || busy) return;
    setBusy(true);
    setError(null);
    setIdeas([]);
    setEditingIdea(null);
    setIdeaForNew(null);
    setStartedArticleId(null);

    const productIds = manualProducts.map((p) => p.id);
    const text = prompt.trim() || (productIds.length ? getManualPrompt() : getDefaultPrompt());
    setPrompt("");

    try {
      // ۱) اول گفتگو (kind=product) ساخته می‌شود
      if (!sessionIdRef.current) {
        const created = await contentChatSessionService.create(siteId, { kind: "product" });
        if (!created.success || !created.data?.session) {
          setError(created.message || t("product.seo.errors.create"));
          setPrompt(text);
          setBusy(false);
          return;
        }
        sessionIdRef.current = String(created.data.session.id);
        navigate(`/product-seo?site=${siteId}&chat=${sessionIdRef.current}`, { replace: true });
      } else if (articleParam) {
        // اگر مقاله‌ای باز بود و کاربر ایده‌ی جدید خواست، از نمای مقاله خارج شو
        navigate(buildUrl(), { replace: true });
      }
      const sid = sessionIdRef.current!;

      // ۲) بعد تولید ایده (با محصولات انتخابی کاربر، یا خودکار)
      const res = await productSeoIdeaService.generate(
        siteId,
        productIds.length ? { prompt: text, product_ids: productIds } : { prompt: text },
      );
      if (!res.success || !res.data) {
        setError(res.message || t("dashboard.errors.ideas"));
        setPrompt(text);
        setBusy(false);
        return;
      }
      const batch = res.data.batch;

      const userContent = productIds.length
        ? `${text}\n(${t("product.seo.selectedCount", { count: productIds.length })})`
        : text;
      const userMsg = { role: "user" as const, kind: "request", content: userContent, batch };
      const botMsg = {
        role: "assistant" as const,
        kind: "confirmation",
        content: t("product.seo.requestIn"),
        batch,
      };
      await contentChatSessionService.addMessage(siteId, sid, userMsg as any);
      await contentChatSessionService.addMessage(siteId, sid, botMsg as any);

      const now = Date.now();
      setMessages((m) => [
        ...m,
        { id: `u-${now}`, role: "user", content: userMsg.content },
        { id: `a-${now}`, role: "assistant", content: botMsg.content },
      ]);
      setManualProducts([]); // انتخاب دستی فقط برای همین درخواست بود
      setRefreshKey((k) => k + 1);
      pollIdeas(siteId, batch);
    } catch (err) {
      console.error("[ProductSeo] send error:", err);
      setError(t("product.errors.server"));
      setPrompt(text);
      setBusy(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  /* ── انتخاب ایده ←  مشاهده‌ی مقاله‌ی موجود، یا رفتن به مرحله‌ی تولید ── */
  const selectIdea = async (idea: IdeaWithArticle) => {
    if (!siteId || selectingId !== null) return;

    // ایده‌ای که مقاله دارد (در هر وضعیتی) هرگز دوباره تولید نمی‌شود؛ فقط مقاله‌ی موجود باز می‌شود.
    if (idea.article_id) {
      setStartedArticleId(String(idea.article_id));
      navigate(buildUrl({ article: idea.article_id }));
      return;
    }

    setSelectingId(idea.id);
    setError(null);

    // ثبت پیام در گفتگو (اگر شکست خورد، جلوی تولید مقاله را نمی‌گیرد)
    if (sessionIdRef.current) {
      const content = t("analyze.article.request", { title: idea.title });
      try {
        await contentChatSessionService.addMessage(siteId, sessionIdRef.current, {
          role: "user",
          kind: "article_request",
          content,
          metadata: { product_idea_id: idea.id },
        } as any);
        setMessages((m) => [...m, { id: `ar-${Date.now()}`, role: "user", content }]);
      } catch (err) {
        console.error("[ProductSeo] add article_request message error:", err);
      }
    }

    setSelectingId(null);
    setIdeaForNew(String(idea.id)); // نمای تولید مقاله باز می‌شود (اول مودال انتخاب مدل)
  };

  // ایده‌ی ویرایش‌شده از سرور برمی‌گردد؛ وضعیت مقاله‌ی کارت را حفظ می‌کنیم
  const handleIdeaSaved = (updated: any) => {
    setIdeas((list) =>
      list.map((i) =>
        String(i.id) === String(updated.id)
          ? { ...i, ...updated, article_id: i.article_id, article_status: i.article_status }
          : i,
      ),
    );
    setEditingIdea(null);
  };

  /* ── callbackهای صفحه‌ی مقاله ── */
  const handleArticleStarted = (articleId: string | number, ideaId: string | number) => {
    // ایده را با مقاله‌اش مرتبط کن تا کارت قفل شود و فقط «مشاهده» بماند
    setIdeas((list) =>
      list.map((i) =>
        String(i.id) === String(ideaId) ? { ...i, article_id: articleId, article_status: "pending" } : i,
      ),
    );
    setStartedArticleId(String(articleId)); // نمای مقاله منتظر آپدیت آدرس نمی‌ماند
    setIdeaForNew(null);
    navigate(buildUrl({ article: articleId }), { replace: true });
    setRefreshKey((k) => k + 1);
  };

  // وضعیت مقاله هنگام polling به کارت ایده منتقل می‌شود (تا بعد از بازگشت، «تولید شد» نمایش داده شود)
  const handleArticleStatusChange = (articleId: string | number, status: string) => {
    setIdeas((list) =>
      list.map((i) =>
        String(i.article_id) === String(articleId) && i.article_status !== status
          ? { ...i, article_status: status }
          : i,
      ),
    );
  };

  const backToIdeas = () => {
    setIdeaForNew(null);
    setStartedArticleId(null);
    navigate(buildUrl(), { replace: true });
  };

  return (
    <Layout
      activeView="product-seo"
      onChangeView={() => {}}
      siteId={siteId ?? undefined}
      siteDomain={domain}
      conversationKind="product"
      refreshConversationsKey={refreshKey}
      activeConversationId={chatParam ?? undefined}
      onSelectConversation={(c) => navigate(`/product-seo?site=${siteId}&chat=${c.id}`)}
      onNewConversation={() => navigate(`/product-seo?site=${siteId}`)}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <main className="flex-1 min-h-0 overflow-y-auto">
          {/* ═══════════ نمای تولید/نمایش مقاله ═══════════ */}
          {showArticle && siteId ? (
            <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4">
              <button
                type="button"
                onClick={backToIdeas}
                className="mb-3 inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#E4E5F0] bg-[#FAFAFE] px-4 text-xs font-bold text-[#0D0F23] transition hover:bg-[#F3F2FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B47FB]"
              >
                <span aria-hidden className="inline-block rtl:-scale-x-100">←</span> {t("product.seo.backToIdeas")}
              </button>

              <ProductArticleGeneratePage
                siteId={siteId}
                ideaId={ideaForNew ?? undefined}
                articleId={effectiveArticleId ?? undefined}
                embedded
                onArticleStarted={handleArticleStarted}
                onStatusChange={handleArticleStatusChange}
                onArticleBack={backToIdeas}
              />
            </div>
          ) : (
            /* ═══════════ نمای گفتگو و ایده‌ها ═══════════ */
            <div className="mx-auto max-w-5xl space-y-4 px-3 py-5 sm:px-6 sm:py-8">
              {messages.length === 0 && !busy && (
                <div className="mx-auto max-w-2xl py-6 text-center sm:py-12">
                  <div
                    aria-hidden
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFEDFF] text-[#4935E0]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>

                  <h3 className="mb-3 text-lg font-black leading-8 text-[#0D0F23] sm:text-2xl">
                    {t("product.seo.heroTitle", { store: domain || t("product.seo.yourStore") })}
                  </h3>
                  <p className="mx-auto max-w-xl text-sm leading-8 text-[#0D0F23] sm:text-base">
                    {t("product.seo.heroBody")}
                  </p>

                  <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                    {BENEFITS.map((b) => (
                      <li
                        key={b.title}
                        className="flex flex-col items-center rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE] px-2 py-3 text-center sm:items-start sm:px-4 sm:py-4 sm:text-start"
                      >
                        <span
                          aria-hidden
                          className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFEDFF] text-[#4935E0] sm:mb-2 sm:h-9 sm:w-9"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d={b.icon} />
                          </svg>
                        </span>
                        <p className="text-[11px] font-black leading-5 text-[#0D0F23] sm:text-sm">{b.title}</p>
                        <p className="mt-1 hidden text-xs leading-6 text-[#6C7193] sm:block">{b.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-7 sm:max-w-[75%] ${
                      m.role === "user"
                        ? "rounded-ee-md bg-[#5B47FB] text-white"
                        : "rounded-es-md border border-[#E4E5F0] bg-[#FAFAFE] text-[#0D0F23]"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {busy && (
                <>
                  <div
                    role="status"
                    className="flex items-center gap-3 rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE] px-4 py-3 text-xs leading-6 text-[#3B3F5C] sm:text-sm"
                  >
                    <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#5B47FB]/30 border-t-[#5B47FB]" />
                    {t("product.seo.working")}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-36 animate-pulse rounded-2xl border border-[#E4E5F0] bg-[#F3F2FB]" />
                    ))}
                  </div>
                </>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-[#E3C4BC] bg-[#F7EEEA] px-4 py-3 text-xs leading-6 text-[#B3453A] sm:text-sm"
                >
                  {error}
                </div>
              )}

              {ideas.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="flex flex-col gap-2">
                      <div className="flex-1 [&>*]:h-full">
                        <IdeaCard idea={idea} loading={selectingId === idea.id} onSelect={selectIdea} />
                      </div>

                      {/* ایده‌ای که مقاله دارد قفل است و ویرایش ندارد */}
                      {!idea.article_id && siteId && (
                        <button
                          type="button"
                          onClick={() => setEditingIdea(idea)}
                          disabled={selectingId !== null}
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E4E5F0] bg-[#FAFAFE] text-xs font-bold text-[#0D0F23] transition hover:border-[#5B47FB]/50 hover:bg-[#F3F2FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B47FB] disabled:opacity-60"
                        >
                          <Icon d={ICONS.pencil} className="h-4 w-4" />
                          {t("product.seo.editIdea")}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* نوار ورودی فقط در نمای ایده‌ها */}
        {!showArticle && (
          <div className="shrink-0 px-3 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 sm:pt-5 sm:pb-4">
            <div className="mx-auto max-w-4xl rounded-3xl border border-[#E4E5F0] bg-white shadow-sm transition-all focus-within:border-[#5B47FB]/60 focus-within:ring-4 focus-within:ring-[#5B47FB]/10">
              {/* روش انتخاب محصول: خودکار / دستی */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 pt-3">
                <div role="group" aria-label={t("product.seo.selectionMethod")} className="inline-flex rounded-2xl bg-[#F3F2FB] p-1">
                  <button type="button" onClick={useAutoMode} disabled={busy} aria-pressed={!isManual} className={segClass(!isManual)}>
                    <Icon d={ICONS.sparkles} className="h-4 w-4" />
                    {t("product.seo.auto")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    disabled={busy || !siteId}
                    aria-pressed={isManual}
                    className={segClass(isManual)}
                  >
                    <Icon d={ICONS.bag} className="h-4 w-4" />
                    {t("product.seo.manual")}
                    {isManual && (
                      <span className="rounded-full bg-[#5B47FB] px-1.5 text-[10px] leading-4 text-white">
                        {faNum(manualProducts.length)}
                      </span>
                    )}
                  </button>
                </div>
                <p className="min-w-0 flex-1 text-[11px] leading-5 text-[#6C7193]">
                  {isManual
                    ? t("product.seo.manualHint")
                    : t("product.seo.autoHint")}
                </p>
              </div>

              {isManual && (
                <div className="mt-2 flex items-center gap-2 px-3">
                  <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1" aria-label={t("product.picker.selected")}>
                    {manualProducts.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex max-w-[12rem] shrink-0 items-center gap-1 rounded-full bg-[#EFEDFF] py-1 pe-1.5 ps-3 text-[11px] font-bold text-[#4935E0]"
                      >
                        <span className="truncate">{p.name}</span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setManualProducts((l) => l.filter((x) => x.id !== p.id))}
                          aria-label={t("product.editIdea.removeProduct", { name: p.name })}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full hover:bg-white/70"
                        >
                          <Icon d={ICONS.x} className="h-3 w-3" stroke={2.2} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    disabled={busy}
                    className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-black text-[#5B47FB] hover:bg-[#EFEDFF]"
                  >
                    {t("analyze.idea.editShort")}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 p-3">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={onKeyDown}
                  maxLength={500}
                  rows={2}
                  disabled={busy}
                  aria-label={t("product.seo.requestAria")}
                  placeholder={
                    isManual
                      ? t("product.seo.placeholderManual")
                      : t("product.seo.placeholderAuto")
                  }
                  className="max-h-40 min-h-[5.5rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-7 text-[#0A0B1E] outline-none placeholder:text-[#9A9DB8] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={busy || !siteId}
                  aria-label={t("product.seo.generate")}
                  className="inline-flex h-11 shrink-0 self-center items-center justify-center gap-2 rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#9B5CFF] px-4 text-sm font-black text-white shadow-lg shadow-[#5B47FB]/20 transition-all hover:from-[#6C5BFF] hover:to-[#5B47FB] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B47FB] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                >
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span className="hidden sm:inline">{t("analyze.ideasBar.generating")}</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">{t("product.seo.generate")}</span>
                      <svg className="h-5 w-5 -scale-x-100" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="mx-auto mt-2 hidden max-w-4xl px-2 text-[11px] leading-5 text-[#6C7193] sm:block">
              {t("product.seo.keyHint")}
            </p>
          </div>
        )}
      </div>

      {/* ═══════════ مودال‌ها ═══════════ */}
      {pickerOpen && siteId && (
        <ProductPickerModal
          siteId={siteId}
          selected={manualProducts}
          max={MAX_MANUAL_PRODUCTS}
          title={t("product.seo.pickTitle")}
          subtitle={t("product.seo.pickSubtitle")}
          confirmLabel={t("product.seo.pickConfirm")}
          minSelected={0}
          onClose={() => setPickerOpen(false)}
          onConfirm={confirmManualProducts}
        />
      )}

      {editingIdea && siteId && (
        <IdeaEditModal
          siteId={siteId}
          idea={editingIdea as any}
          onClose={() => setEditingIdea(null)}
          onSaved={handleIdeaSaved}
        />
      )}
    </Layout>
  );
};

export default ProductSeoPage;