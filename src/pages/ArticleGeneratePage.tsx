// src/pages/ArticleGeneratePage.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { articleService, wordpressService, subscriptionService } from "../services/api";
import type { Article, ArticleSection } from "../types";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import { MobileArticleThread } from "../components/article-generate/MobileArticleThread";
import { DesktopArticleThread } from "../components/article-generate/DesktopArticleThread";
import { POLL_INTERVAL_MS, isInProgress } from "../components/article-generate/constants";
import { Spinner } from "../components/article-generate/UiBits";
import {
  PublishToWordPressBar,
  WordPressHeaderControl,
  type WpBusyAction,
} from "../components/article-generate/PublishToWordPressBar";
import { StepTimeline } from "../components/article-generate/StepTimeline";
import { BriefCard } from "../components/article-generate/BriefCard";
// import { SectionsCard } from "../components/article-generate/SectionsCard";
import { SeoReviewCard } from "../components/article-generate/SeoReviewCard";
import { ArticleImageCard } from "../components/article-generate/ArticleImageCard";
import { ErrorBanner } from "../components/article-generate/ErrorBanner";
import type { ChatTargetSelection } from "../components/article-generate/chatTarget";
import ModelSelectModal from "../components/article-generate/ModelSelectModal";
import { t } from "../i18n";

interface ArticleGeneratePageProps {
  siteId: number | string;
  /** برای شروع تولید جدید از روی یک ایده */
  ideaId?: number | string;
  /** برای باز کردن مقاله‌ای که قبلاً ساخته/شروع شده */
  articleId?: number | string;
  /** وقتی true باشد صفحه داخل سشن محتوا رندر می‌شود و Layout/route جدید نمی‌سازد. */
  embedded?: boolean;
  onArticleStarted?: (articleId: string, ideaId: string) => void;
  onArticleBack?: () => void;
  /**
   * وقتی embedded=true است، این صفحه خودش <Layout> نمی‌سازد، پس هدرِ
   * موبایلِ Layout (که میزبانِ mobileHeaderExtra است) هم اینجا وجود ندارد.
   * برای این‌که دکمه‌ی وردپرسِ موبایل بدون ساختنِ یک هدرِ تکراری نمایش
   * داده شود، این صفحه محتوای آن دکمه (WordPressHeaderControl) را از
   * طریق این callback به کامپوننتِ والد (همان‌که صاحبِ <Layout> واقعی
   * است، یعنی «سشن محتوا») می‌دهد؛ والد آن را در mobileHeaderExtra
   * همان Layout قرار می‌دهد. با تغییر article/wpBusy/... این تابع دوباره
   * صدا زده می‌شود تا محتوا به‌روز بماند، و روی unmount با null پاک می‌شود.
   */
  onMobileHeaderExtraChange?: (node: React.ReactNode | null) => void;
}
type LayoutOwnProps = Omit<React.ComponentProps<typeof Layout>, "children">;

const PageShell: React.FC<{
  embedded: boolean;
  layoutProps: LayoutOwnProps;
  children: React.ReactNode;
}> = ({ embedded, layoutProps, children }) =>
  embedded ? <>{children}</> : <Layout {...layoutProps}>{children}</Layout>;



const ArticleGeneratePage: React.FC<ArticleGeneratePageProps> = ({
  siteId,
  ideaId,
  articleId,
  embedded = false,
  onArticleStarted,
  onArticleBack,
  onMobileHeaderExtraChange,
}) => {
  const navigate = useNavigate();

  const [id, setId] = useState<number | string | null>(articleId ?? null);
  const [article, setArticle] = useState<Article | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pollNonce, setPollNonce] = useState(0);

  const [wpBusy, setWpBusy] = useState<WpBusyAction>(null);
  const [wpError, setWpError] = useState<string | null>(null);
  const [wpJustSucceeded, setWpJustSucceeded] = useState(false);

  // ── انتخاب فعلیِ گفتگو با AI (Section / FAQ / Title / ...) ──
  const [chatTarget, setChatTarget] = useState<ChatTargetSelection | null>(null);

  // ── وضعیت پلن کاربر — برای تعیین مدل‌های مجاز در سلکتور مدلِ چت
  // (هم دسکتاپ از طریق DesktopArticleThread و هم موبایل از طریق
  // MobileArticleThread به این مقدار نیاز دارند). ──
  // ── مدل و تعداد تصویرِ انتخابیِ کاربر در همون مودال (ModelSelectModal) ──
  // ── سبک تصویرِ انتخابی (minimal | infographic | conceptual | realistic | product) ──
  const [imageStyleChosen, setImageStyleChosen] = useState<string | null>(null);
  const [imageUserPromptChosen, setImageUserPromptChosen] = useState<string>("");
  // ── prompt دلخواه متن مقاله + بازه‌ی بخش‌بندی (از ModelSelectModal) ──
  const [articleUserPromptChosen, setArticleUserPromptChosen] = useState<string>("");
  const [minSectionsChosen, setMinSectionsChosen] = useState<number | null>(null);
  const [maxSectionsChosen, setMaxSectionsChosen] = useState<number | null>(null);
  // ── مودال انتخاب مدل قبل از شروع تولید مقاله ──
  // فقط وقتی از روی یک "ایده" داریم مقاله‌ی جدید می‌سازیم لازم است
  // (یعنی ideaId داریم و هنوز articleId ای در کار نیست).
  const [showModelModal, setShowModelModal] = useState<boolean>(!!ideaId && !articleId);
  const [modelChosen, setModelChosen] = useState<string | null>(null);
  // ── مدل و تعداد تصویرِ انتخابیِ کاربر در همون مودال (ModelSelectModal) ──
  const [imageModelChosen, setImageModelChosen] = useState<string | null>(null);
  const [imageCountChosen, setImageCountChosen] = useState<number | null>(null);

  const articleRef = useRef<Article | null>(null);
  articleRef.current = article;

  const generateStartedRef = useRef(false);
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [planLoaded, setPlanLoaded] = useState(false);

  /* ── همگام‌سازی با تغییر آدرس ──
     چون این کامپوننت هیچ‌وقت unmount نمی‌شه (Layout ثابت می‌مونه و فقط
     children عوض می‌شه)، وقتی کاربر از سایدبار روی مقاله‌ی دیگه‌ای کلیک
     می‌کنه یا از یک ideaId جدید مقاله می‌سازه، articleId/ideaId propها
     عوض می‌شن ولی state‌های داخلی (id، article، ...) خودشون به‌خودی‌خود
     ریست نمی‌شن — در نتیجه صفحه هنوز مقاله‌ی قبلی را نشان می‌داد و
     polling هم روی id قدیمی می‌ماند. این افکت با هر تغییر واقعی در
     پارامترهای مسیر، همه‌چیز را برای «مقاله/ایده‌ی جدید» از نو می‌سازد. */
  const routeKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const routeKey = `${ideaId ?? ""}|${articleId ?? ""}`;
    if (routeKeyRef.current === routeKey) return; // چیزی واقعاً عوض نشده
    routeKeyRef.current = routeKey;

    setId(articleId ?? null);
    setArticle(null);
    setFatalError(null);
    setActionError(null);
    setWpError(null);
    setWpBusy(null);
    setWpJustSucceeded(false);
    setRegeneratingId(null);
    setChatTarget(null);
    setPollNonce((n) => n + 1);
    generateStartedRef.current = false;
    setShowModelModal(!!ideaId && !articleId);
    setModelChosen(null);
    setImageModelChosen(null);
    setImageCountChosen(null);
    setImageStyleChosen(null);
    setImageUserPromptChosen("");
    setArticleUserPromptChosen("");
    setMinSectionsChosen(null);
    setMaxSectionsChosen(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, ideaId]);

  /* ── ۰) وضعیت پلن کاربر ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await subscriptionService.me();
        if (res.success && res.data) {
          setIsFreePlan(res.data.subscription.is_free);
        }
      } catch (err) {
        console.error("Error fetching subscription status:", err);
      } finally {
        setPlanLoaded(true);
      }
    })();
  }, []);

  /* ── ۱) شروع تولید یا باز کردن مقاله‌ی موجود ── */
  useEffect(() => {
    if (id || !ideaId) {
      if (!id && !ideaId) setFatalError(t("article.page.missingId"));
      return;
    }
    // تا کاربر مدل رو از مودال انتخاب نکرده، هیچ درخواستی به بک‌اند نمی‌ره
    // (مدل متن، مدل تصویر، تعداد تصویر، سبک تصویر و بازه‌ی بخش‌بندی — همه
    // با هم از مودال میان)
    if (
      !modelChosen ||
      !imageModelChosen ||
      imageCountChosen === null ||
      !imageStyleChosen ||
      minSectionsChosen === null ||
      maxSectionsChosen === null
    ) {
      return;
    }
    if (generateStartedRef.current) return;
    generateStartedRef.current = true;

    (async () => {
      try {
        const res = await articleService.generate(siteId, ideaId, {
          model: modelChosen,
          image_model: imageModelChosen,
          image_count: imageCountChosen,
          image_style: imageStyleChosen,
          ...(imageUserPromptChosen ? { image_user_prompt: imageUserPromptChosen } : {}),
          ...(articleUserPromptChosen ? { article_user_prompt: articleUserPromptChosen } : {}),
          min_sections: minSectionsChosen,
          max_sections: maxSectionsChosen,
        });

        // پاسخ ممکن است flat باشد ({article_id}) یا زیر data ({data:{article_id}})
        const payload: any = (res as any)?.data ?? res;
        const newId = payload?.article_id;

        if (res && (res as any).success === false) {
          throw new Error((res as any).message || t("article.page.startFailed"));
        }

        if (newId) {
          setId(newId);
          if (ideaId !== undefined) onArticleStarted?.(String(newId), String(ideaId));
        } else {
          throw new Error((res as any)?.message || t("article.page.noId"));
        }
      } catch (err: any) {
        generateStartedRef.current = false; // اجازه‌ی تلاش مجدد در رندر بعدی
        setFatalError(err?.message || t("article.page.startError"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    ideaId,
    siteId,
    modelChosen,
    imageModelChosen,
    imageCountChosen,
    imageStyleChosen,
    articleUserPromptChosen,
    minSectionsChosen,
    maxSectionsChosen,
  ]);
  /* ── ۲) polling وضعیت مقاله ── */
  const fetchArticle = useCallback(async () => {
    if (!id) return;
    try {
      const res = await articleService.show(siteId, id);
      const data = (res as any)?.data?.data ?? (res as any)?.data;
      if (!data) return; // خطای موقت شبکه — polling بعدی جبران می‌کند

      setArticle(data);

      setRegeneratingId((current) => {
        if (current === null) return current;
        const sec = data.sections?.find((s: ArticleSection) => s.id === current);
        return sec && sec.status !== "pending" ? null : current;
      });
    } catch {
      // خطای شبکه موقت — نادیده بگیر، polling بعدی دوباره تلاش می‌کند
    }
  }, [siteId, id]);

  useEffect(() => {
    if (!id) return;
    fetchArticle();

    const interval = setInterval(() => {
      const current = articleRef.current;
      if (current && isInProgress(current.status)) {
        fetchArticle();
        return;
      }
      // مقاله تمام شده، ولی شاید کاربر بعداً بنر را «بازتولید» کند و
      // article.banner_status دوباره "generating" شود؛ برای اینکه polling
      // بتواند آن را هم بگیرد، همین‌جا هم چک می‌کنیم (به‌جای متوقف‌کردنِ کامل).
      if (current && (current.banner_status === "generating" || current.banner_status === "pending")) {
        fetchArticle();
      }
      // در غیرِ این‌صورت این تیک را رد می‌کنیم؛ interval زنده می‌ماند تا اگر
      // وضعیتی دوباره تغییر کرد (مثلاً regenerate بنر)، خودکار ادامه پیدا کند.
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pollNonce]);

  /* ── ۳) اکشن‌ها ── */
  const handleRetry = async () => {
    if (!id) return;
    setRetrying(true);
    setActionError(null);
    try {
      const res = await articleService.retry(siteId, id);
      if ((res as any)?.success === false) {
        throw new Error((res as any).message || t("analyze.errors.retry"));
      }
      setArticle((a) => (a ? { ...a, status: "pending", error_message: null } : a));
      setPollNonce((n) => n + 1);
    } catch (err: any) {
      setActionError(err?.message || t("article.page.retryFailed"));
    } finally {
      setRetrying(false);
    }
  };

  const handleRegenerateSection = async (section: ArticleSection) => {
    if (!id) return;
    setRegeneratingId(section.id);
    setActionError(null);
    try {
      const res = await articleService.regenerateSection(siteId, id, section.id);
      if ((res as any)?.success === false) {
        throw new Error((res as any).message || t("article.page.regenFailed"));
      }

      setArticle((a) =>
        a
          ? {
              ...a,
              status: "generating_sections",
              sections: a.sections.map((s) =>
                s.id === section.id ? { ...s, status: "pending" as const } : s,
              ),
            }
          : a,
      );
      setPollNonce((n) => n + 1);
    } catch (err: any) {
      setRegeneratingId(null);
      setActionError(err?.message || t("article.page.regenFailedRetry"));
    }
  };

  const handlePublishToWordPress = async () => {
    if (!id) return;
    setWpBusy("publish");
    setWpError(null);
    setWpJustSucceeded(false);
    try {
      const res = await wordpressService.syncArticle(id);
      if ((res as any)?.success === false) {
        throw new Error((res as any)?.message || t("article.page.wpPublishFailed"));
      }
      setWpJustSucceeded(true);
      await fetchArticle();
      setTimeout(() => setWpJustSucceeded(false), 4000);
    } catch (err: any) {
      setWpError(err?.message || t("article.page.wpPublishFailedRetry"));
    } finally {
      setWpBusy(null);
    }
  };

  const handleUpdateOnWordPress = async () => {
    if (!id) return;
    setWpBusy("update");
    setWpError(null);
    setWpJustSucceeded(false);
    try {
      // همون endpoint create/update است؛ بک‌اند خودش بر اساس wp_post_id تشخیص می‌دهد
      const res = await wordpressService.syncArticle(id);
      if ((res as any)?.success === false) {
        throw new Error((res as any)?.message || t("article.page.wpUpdateFailed"));
      }
      setWpJustSucceeded(true);
      await fetchArticle();
      setTimeout(() => setWpJustSucceeded(false), 4000);
    } catch (err: any) {
      setWpError(err?.message || t("article.page.wpUpdateFailedRetry"));
    } finally {
      setWpBusy(null);
    }
  };

  const [articlesRefreshKey, setArticlesRefreshKey] = useState(0);
  const wasInProgressRef = useRef<boolean | null>(null);

  // به‌محض این‌که شناسه‌ی مقاله ساخته شد (چه تازه از ideaId، چه از prop)،
  // لیست سایدبار را یک‌بار رفرش کن تا آیتم جدید فوراً دیده شود.
  useEffect(() => {
    if (id) setArticlesRefreshKey((k) => k + 1);
  }, [id]);

  // وقتی وضعیت مقاله از «در حال تولید» به «تمام‌شده» تغییر کند، دوباره
  // لیست سایدبار را رفرش کن (بدون نیاز به رفرش دستی صفحه).
  useEffect(() => {
    if (!article) return;
    const inProgress = isInProgress(article.status);
    if (wasInProgressRef.current === true && !inProgress) {
      setArticlesRefreshKey((k) => k + 1);
    }
    wasInProgressRef.current = inProgress;
  }, [article?.status]);

  const handleDeleteFromWordPress = async () => {
    if (!id) return;
    setWpBusy("delete");
    setWpError(null);
    setWpJustSucceeded(false);
    try {
      const res = await wordpressService.destroyArticle(id);
      if ((res as any)?.success === false) {
        throw new Error((res as any)?.message || t("article.page.wpDeleteFailed"));
      }
      // بعد از حذف موفق، فیلدهای wp_* روی سرور پاک شده‌اند؛ فرانت رو هم optimistically ریست کن
      setArticle((a) =>
        a
          ? ({
              ...a,
              wp_post_id: null,
              wp_permalink: null,
              wp_sync_status: "not_synced",
              publish_status: null,
            } as Article)
          : a,
      );
      await fetchArticle();
    } catch (err: any) {
      setWpError(err?.message || t("article.page.wpDeleteFailedRetry"));
    } finally {
      setWpBusy(null);
    }
  };

  /* ── ۴) هندلرهای مربوط به چت / ویرایش (استفاده‌شده در کارت‌های فرزند و ترد چت) ── */

  /** وقتی یک کارت (Section/Meta/Faq/Final) خودش با ویرایش دستی مقاله را عوض کرد */
  const handleArticleChange = useCallback((updated: Article) => {
    setArticle(updated);
  }, []);

  /* ── ۵) هندلرهای مودال انتخاب مدل ──
     onConfirm مدل متن، مدل تصویر، تعداد تصویر، سبک تصویر، prompt دلخواه
     تصویر، prompt دلخواه متن مقاله و بازه‌ی بخش‌بندی (min/max) رو یک‌جا
     برمی‌گردونه؛ هیچ‌کدوم جدا پرسیده نمی‌شن — همه با همین یک تأیید ثبت
     می‌شن. */
  const handleConfirmModel = (
    modelId: string,
    imageModelId: string,
    imageCount: number,
    imageStyle: string,
    imageUserPrompt: string,
    articleUserPrompt: string,
    minSections: number,
    maxSections: number,
  ) => {
    setImageUserPromptChosen(imageUserPrompt);
    setArticleUserPromptChosen(articleUserPrompt);
    setMinSectionsChosen(minSections);
    setMaxSectionsChosen(maxSections);
    setModelChosen(modelId);
    setImageModelChosen(imageModelId);
    setImageCountChosen(imageCount);
    setImageStyleChosen(imageStyle);
    setShowModelModal(false);
  };

  const handleCancelModelModal = () => {
    setShowModelModal(false);
    if (embedded) {
      onArticleBack?.();
      return;
    }
    navigate(-1);
  };

  /* ── ۶) محتوایِ دکمه‌ی وردپرسِ موبایل ──
     این نود هم در حالتِ غیر-embedded به‌عنوان mobileHeaderExtay به Layoutِ
     خودِ همین صفحه داده می‌شود، و هم در حالتِ embedded (که خودِ این صفحه
     Layout نمی‌سازد) از طریقِ onMobileHeaderExtraChange به والد گزارش
     داده می‌شود تا او داخلِ mobileHeaderExtay هدرِ Layoutِ واقعی‌اش
     بگذارد. به این ترتیب هیچ هدرِ تکراری‌ای ساخته نمی‌شود و دکمه همیشه
     دقیقاً همان‌جایی‌ست که باید باشد. */
  const mobileWpControl = useMemo(() => {
    if (!article) return null;
    return (
      <WordPressHeaderControl
        siteId={siteId}
        article={article}
        busy={wpBusy}
        error={wpError}
        justSucceeded={wpJustSucceeded}
        onPublish={handlePublishToWordPress}
        onUpdate={handleUpdateOnWordPress}
        onDelete={handleDeleteFromWordPress}
        onDismissError={() => setWpError(null)}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, siteId, wpBusy, wpError, wpJustSucceeded]);

  // فقط در حالت embedded این callback را صدا می‌زنیم؛ در حالت غیر-embedded
  // خودِ این صفحه Layout می‌سازد و مستقیماً از layoutProps استفاده می‌کند.
  useEffect(() => {
    if (!embedded) return;
    onMobileHeaderExtraChange?.(mobileWpControl);
    return () => {
      onMobileHeaderExtraChange?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded, mobileWpControl]);

  /* پراپ‌های Layout — پنل چتِ سایدبار (ArticleChatDock) دیگر استفاده نمی‌شود:
     چت حالا مستقیم داخل خودِ صفحه رندر می‌شود (دسکتاپ: DesktopArticleThread
     با نوار ورودیِ ثابتِ پایین صفحه، موبایل: MobileArticleThread بدون هیچ
     تغییری)، پس دیگر چیزی به‌عنوان articleChat به Layout پاس داده نمی‌شود و
     پنل چتِ سایدبار به‌طور خودکار رندر نخواهد شد.

     mobileHeaderExtra: دکمه‌ی جمع‌وجورِ وردپرس که کنارِ بجِ پلن، داخل هدرِ
     h-14 موبایلِ Layout نشان داده می‌شود. این فقط وقتی استفاده می‌شود که
     خودِ این صفحه Layout بسازد (یعنی embedded=false)؛ در حالتِ embedded
     همین محتوا از طریقِ onMobileHeaderExtraChange به والد داده می‌شود. */
  const layoutProps = {
    siteId,
    activeView: "articles" as const,
    hideDesktopPlanBadge: true,
    activeArticleId: id ?? undefined,       // ← دیگه به URL وابسته نیست
    refreshArticlesKey: articlesRefreshKey, // ← trigger رفرشِ لیست
    onChangeView: (v: SidebarView) => {
      if (v === "info") navigate(`/sites/${siteId}`);
    },
    mobileHeaderExtra: mobileWpControl,
  };



  /* ── ۷) رندر ── */
  if (fatalError) {
    return (
      <PageShell embedded={embedded} layoutProps={layoutProps}>
        <div className="mx-auto max-w-3xl p-6">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3">
            <p className="text-sm font-bold text-rose-600">{fatalError}</p>
            <button
              type="button"
              onClick={() => {
                setFatalError(null);
                generateStartedRef.current = false;
                setId((prev) => prev); // فقط یک re-render برای رفتن دوباره به useEffect
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
            >
              {t("analyze.ideas.retry")}
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  /* قبل از هر چیزی — اگر داریم مقاله‌ی جدید از روی یک ایده می‌سازیم،
     اول باید مدل انتخاب شود. هیچ درخواستی به بک‌اند نمی‌رود تا این مودال بسته شود. */
  if (showModelModal) {
    // تا وضعیت واقعی پلن کاربر از سرور نیومده، مودال رو نشون نده
    // (وگرنه یه لحظه با حالت Free رندر می‌شه و بعد سریع به Pro تغییر می‌کنه)
    if (!planLoaded) {
      return (
        <PageShell embedded={embedded} layoutProps={layoutProps}>
          <div className="mx-auto max-w-3xl p-6">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E5F0] bg-white p-10">
              <Spinner className="h-6 w-6" />
              <p className="text-xs font-bold text-[#0D0F23]">{t("article.page.checkingPlan")}</p>
            </div>
          </div>
        </PageShell>
      );
    }

    return (
      <PageShell embedded={embedded} layoutProps={layoutProps}>
        <div className="mx-auto max-w-3xl p-6" />
        <ModelSelectModal
          open={showModelModal}
          isFreePlan={isFreePlan}
          onClose={handleCancelModelModal}
          onConfirm={handleConfirmModel}
        />
      </PageShell>
    );
  }

  if (!article) {
    return (
      <PageShell embedded={embedded} layoutProps={layoutProps}>
        <div className="mx-auto max-w-3xl p-6">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E5F0] bg-white p-10">
            <Spinner className="h-6 w-6" />
            <p className="text-xs font-bold text-[#0D0F23]">{t("article.page.preparing")}</p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell embedded={embedded} layoutProps={layoutProps}>
      {/* ── نسخه دسکتاپ — همان ساختار قبلی؛ تنها تفاوت این است که کارت‌های
          تعاملیِ سئو/بخش‌ها/سوالات متداول حالا داخل DesktopArticleThread
          هستند که یک ترد چت (دقیقاً معادل موبایل) با نوار ورودیِ ثابتِ
          پایین صفحه است، به‌جای پنل چتِ سایدبار. ── */}
      <div className="hidden lg:block">
        <PublishToWordPressBar
          siteId={siteId}
          article={article}
          busy={wpBusy}
          error={wpError}
          justSucceeded={wpJustSucceeded}
          onPublish={handlePublishToWordPress}
          onUpdate={handleUpdateOnWordPress}
          onDelete={handleDeleteFromWordPress}
          onDismissError={() => setWpError(null)}
          isFreePlan={isFreePlan}
          embedded={embedded}
        />

        <div className={`mx-auto max-w-4xl p-4 sm:p-6 pb-40 ${embedded ? "pt-16 sm:pt-16" : ""}`}>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E4E5F0] bg-gradient-to-r rtl:bg-gradient-to-l from-white to-[#EFEDFF]/50 p-5">
              <h1 className="text-lg font-black text-[#0D0F23] leading-8">{article.title}</h1>
              {isInProgress(article.status) && (
                <p className="mt-1 text-[11px] text-[#0D0F23]/70">
                  {t("article.page.autoRefresh")}
                </p>
              )}
            </div>

            {actionError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-rose-600">{actionError}</p>
                <button onClick={() => setActionError(null)} className="text-rose-400 text-xs">✕</button>
              </div>
            )}

            <ArticleImageCard
              siteId={siteId}
              article={article}
              onArticleChange={handleArticleChange}
              isFreePlan={isFreePlan}
            />
            <StepTimeline article={article} />
            <ErrorBanner article={article} onRetry={handleRetry} retrying={retrying} embedded={embedded} />
            <BriefCard article={article} />
            <SeoReviewCard article={article} />

            <DesktopArticleThread
              siteId={siteId}
              article={article}
              selectedTarget={chatTarget}
              onSelectTarget={setChatTarget}
              onArticleChange={handleArticleChange}
              onRegenerateSection={handleRegenerateSection}
              regeneratingSectionId={regeneratingId}
              isFreePlan={isFreePlan}
            />
          </div>
        </div>
      </div>

      {/* ── نسخه موبایل — دکمه‌ی وردپرس اینجا رندر نمی‌شود؛ در حالتِ
          غیر-embedded از طریق mobileHeaderExtra کنار بج پلن در هدرِ h-14
          خودِ Layoutِ همین صفحه نشان داده می‌شود. در حالتِ embedded، همان
          محتوا از طریق onMobileHeaderExtraChange به والد داده شده تا او
          آن را داخل mobileHeaderExtay هدرِ Layoutِ واقعی‌اش بگذارد —
          بدون ساختنِ هیچ هدرِ تکراری‌ای در این صفحه. ── */}
      <div className="lg:hidden w-full max-w-full">
        <div className={`w-full max-w-full px-4 sm:px-6 ${embedded ? "pt-4 sm:pt-4" : ""}`}>
          {isInProgress(article.status) && (
            <p className="mb-3 text-[11px] text-[#0D0F23]/70">
              {t("article.page.autoRefresh")}
            </p>
          )}

          {actionError && (
            <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-rose-600 min-w-0 break-words">{actionError}</p>
              <button onClick={() => setActionError(null)} className="text-rose-400 text-xs shrink-0">✕</button>
            </div>
          )}

          <div className="mb-4 space-y-3">
            <StepTimeline article={article} />
            <ErrorBanner article={article} onRetry={handleRetry} retrying={retrying} embedded={embedded} />
            <BriefCard article={article} />
          </div>
        </div>

        <MobileArticleThread
          siteId={siteId}
          article={article}
          selectedTarget={chatTarget}
          onSelectTarget={setChatTarget}
          onArticleChange={handleArticleChange}
          onRegenerateSection={handleRegenerateSection}
          regeneratingSectionId={regeneratingId}
          isFreePlan={isFreePlan}
        />
      </div>
    </PageShell>
  );
};

export default ArticleGeneratePage;