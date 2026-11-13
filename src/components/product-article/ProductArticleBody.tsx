import React, { useMemo, useState } from "react";
import { formatMoney } from "../../utils/priceUnit";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { productArticleService } from "../../services/api";
import type {
  ProductArticle,
  ProductArticleEditableField,
  ProductArticleProduct,
  ProductArticleSection,
} from "../../services/api";
import { Spinner } from "../article-generate/UiBits";
import { ArticleImageCard } from "../article-generate/ArticleImageCard";
import { FaqAccordion, parseFaqMarkdown } from "../article-generate/FaqCard";
import { getLocale, t } from "../../i18n";

interface Props {
  siteId: number | string;
  article: ProductArticle;
  isFreePlan: boolean;
  regeneratingSectionId: number | null;
  onRegenerateSection: (section: ProductArticleSection) => void;
  onRefresh: () => Promise<void> | void;
}

/* ------------------------------------------------------------------ */
/*  استایل‌های مشترک                                                    */
/* ------------------------------------------------------------------ */

const card = "rounded-2xl border border-[#E4E5F0] bg-white p-4 sm:p-6";

const ghostBtn =
  "rounded-lg border border-[#E4E5F0] px-3 py-1.5 text-xs font-bold text-[#0D0F23] hover:bg-[#EFEDFF]/40 disabled:opacity-40 sm:px-2.5 sm:py-1 sm:text-[11px]";
const primaryBtn =
  "rounded-xl bg-[#0D0F23] px-4 py-2 text-xs sm:py-1.5 font-bold text-white disabled:opacity-50";
const secondaryBtn =
  "rounded-xl border border-[#E4E5F0] px-4 py-2 text-xs font-bold text-[#0D0F23] disabled:opacity-50 sm:py-1.5";
const inputCls =
  "w-full rounded-xl border border-[#E4E5F0] bg-white p-3 text-base leading-7 text-[#0D0F23] outline-none sm:text-sm focus:border-[#5B47FB]";

const CardTitle: React.FC<{ children: React.ReactNode; aside?: React.ReactNode }> = ({
  children,
  aside,
}) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
    <h2 className="flex items-center gap-2 text-sm font-black text-[#0D0F23]">
      <span className="h-4 w-1 rounded-full bg-[#5B47FB]" />
      {children}
    </h2>
    {aside}
  </div>
);

/* ------------------------------------------------------------------ */
/*  ادیتور درجا                                                         */
/* ------------------------------------------------------------------ */

const InlineEditor: React.FC<{
  value: string;
  multiline?: boolean;
  rows?: number;
  onSave: (v: string) => Promise<void>;
  onCancel: () => void;
}> = ({ value, multiline, rows = 8, onSave, onCancel }) => {
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setErr(null);
    try {
      await onSave(draft);
    } catch (e: any) {
      setErr(e?.message || t("product.body.saveFailed"));
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      {multiline ? (
        <textarea className={inputCls} rows={rows} value={draft} onChange={(e) => setDraft(e.target.value)} />
      ) : (
        <input className={inputCls} value={draft} onChange={(e) => setDraft(e.target.value)} />
      )}
      {err && <p className="text-xs font-bold text-rose-600">{err}</p>}
      <div className="flex gap-2">
        <button onClick={save} disabled={saving || !draft.trim()} className={primaryBtn}>
          {saving ? t("common.status.saving") : t("article.actions.save")}
        </button>
        <button onClick={onCancel} disabled={saving} className={secondaryBtn}>
          {t("common.actions.cancel")}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ویترین محصول: تصویر + قیمت + مشخصات + خرید (شبیه برگه‌ی مشخصات)       */
/* ------------------------------------------------------------------ */

const toNum = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const formatPrice = (price: ProductArticleProduct["price"], currency?: string | null) => {
  if (price == null || price === "") return null;
  const n = toNum(price);
  return n > 0 ? (formatMoney(n, currency) ?? String(price)) : String(price);
};

const ProductShowcase: React.FC<{ product: ProductArticleProduct }> = ({ product: p }) => {
  const price = formatPrice(p.price, p.currency);
  const cur = toNum(p.price);
  const reg = toNum(p.regular_price);
  const discount = reg > cur && cur > 0 ? Math.round((1 - cur / reg) * 100) : 0;
  const specs = (p.specs ?? []).slice(0, 5);
  const linkProps = { href: p.url ?? undefined, target: "_blank", rel: "noopener noreferrer" };

  const image = p.image ? (
    <img
      src={p.image}
      alt={p.name ?? ""}
      loading="lazy"
      className="h-56 w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 sm:h-64"
    />
  ) : (
    <div className="flex h-56 items-center justify-center text-6xl opacity-60">🛍️</div>
  );

  return (
    <article className="group overflow-hidden rounded-3xl bg-gradient-to-bl rtl:bg-gradient-to-br from-[#F6F6FB] via-white to-[#EFEDFF]/50 ring-1 ring-[#E4E5F0]/70 sm:flex">
      {/* تصویر */}
      <div className="relative flex items-center justify-center p-5 sm:w-[38%] sm:shrink-0 sm:p-6">
        {discount > 0 && (
          <span className="absolute end-4 top-4 z-10 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
            {t("billing.badges.percentOff", { percent: (discount / 100).toLocaleString(getLocale(), { style: "percent" }) })}
          </span>
        )}
        {p.url ? (
          <a {...linkProps} className="block w-full" aria-label={p.name ?? t("product.body.product")}>
            {image}
          </a>
        ) : (
          <div className="w-full">{image}</div>
        )}
      </div>

      {/* اطلاعات */}
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6 sm:ps-2">
        <div>
          {p.category && (
            <p className="mb-1 text-[11px] font-bold text-[#5B47FB]">{p.category}</p>
          )}
          <h4 className="text-base font-black leading-8 text-[#0D0F23]">
            {p.url ? (
              <a {...linkProps} className="no-underline hover:text-[#5B47FB]">
                {p.name ?? t("product.body.productNumber", { id: p.id })}
              </a>
            ) : (
              (p.name ?? t("product.body.productNumber", { id: p.id }))
            )}
          </h4>
        </div>

        {price && (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xl font-black text-[#5B47FB]">{price}</span>
            {discount > 0 && (
              <span className="text-xs text-[#0D0F23]/45 line-through">
                {formatMoney(reg, p.currency)}
              </span>
            )}
            {p.in_stock != null && (
              <span
                className={`flex items-center gap-1 text-[11px] font-bold ${p.in_stock ? "text-emerald-700" : "text-rose-600"}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${p.in_stock ? "bg-emerald-600" : "bg-rose-500"}`} />
                {p.in_stock ? t("product.body.inStock") : t("product.body.outOfStock")}
              </span>
            )}
          </div>
        )}

        {specs.length > 0 ? (
          <dl className="space-y-2 text-[13px] leading-6">
            {specs.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <dt className="shrink-0 text-[#0D0F23]/55">{s.label}</dt>
                <span aria-hidden className="min-w-3 flex-1 border-b border-dotted border-[#E4E5F0]" />
                <dd className="max-w-[60%] text-start font-bold text-[#0D0F23]">{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          p.excerpt && (
            <p className="line-clamp-3 text-[13px] leading-7 text-[#0D0F23]/65">{p.excerpt}</p>
          )
        )}

        {p.url && (
          <a
            {...linkProps}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B47FB] px-6 py-3 text-sm font-black text-white no-underline transition-colors hover:bg-[#0D0F23] active:bg-[#0D0F23] sm:self-start"
          >
            {t("product.body.viewProduct")}
            <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
          </a>
        )}
      </div>
    </article>
  );
};

const ProductList: React.FC<{ products: ProductArticleProduct[] }> = ({ products }) => (
  <div className="space-y-4">
    {products.map((p) => (
      <ProductShowcase key={p.id} product={p} />
    ))}
  </div>
);

/* ویترین فقط زیر بخش‌های product؛ بخش comparison جدول لینک‌دار خودش را دارد */
const showsProducts = (s: ProductArticleSection) => {
  const n = s.products?.length ?? 0;
  const type = (s as any).type as string | undefined;
  return n > 0 && (type ? type === "product" : n === 1);
};

const SectionProducts: React.FC<{ section: ProductArticleSection }> = ({ section }) => {
  if (!showsProducts(section)) return null;
  return (
    <div className="mb-6">
      <ProductList products={section.products!} />
    </div>
  );
};

/* محصولات کل مقاله؛ فقط آن‌هایی که قبلاً در ویترین یک بخش نشان داده نشده‌اند */
const ArticleProductsCard: React.FC<{ article: ProductArticle }> = ({ article }) => {
  const shown = new Set(
    article.sections.filter(showsProducts).flatMap((s) => (s.products ?? []).map((p) => p.id)),
  );
  const rest = (article.products ?? []).filter((p) => !shown.has(p.id));
  if (!rest.length) return null;
  return (
    <div className={card}>
      <CardTitle>{t("product.body.recommended")}</CardTitle>
      <ProductList products={rest} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  متا و سئو                                                           */
/* ------------------------------------------------------------------ */

const META_FIELDS: { key: ProductArticleEditableField; label: string; multiline?: boolean }[] = [
  { key: "meta_title", get label() { return t("article.target.meta_title"); } },
  { key: "meta_description", get label() { return t("article.target.meta_description"); }, multiline: true },
  { key: "excerpt", get label() { return t("article.target.excerpt"); }, multiline: true },
  { key: "focus_keyword", get label() { return t("article.meta.focusKeyword"); } },
  { key: "slug", get label() { return t("article.meta.slug"); } },
];

/* فقط نمایشی: بک‌اند برای این‌ها endpoint ویرایش ندارد */
const READONLY_META_FIELDS: { key: "og_title" | "og_description"; label: string }[] = [
  { key: "og_title", get label() { return t("article.meta.ogTitle"); } },
  { key: "og_description", get label() { return t("article.meta.ogDescription"); } },
];

const schemaToText = (schema: unknown): string => {
  if (schema == null || schema === "") return "";
  if (typeof schema === "string") {
    try {
      return JSON.stringify(JSON.parse(schema), null, 2);
    } catch {
      return schema;
    }
  }
  try {
    return JSON.stringify(schema, null, 2);
  } catch {
    return "";
  }
};

const MetaCard: React.FC<{
  siteId: Props["siteId"];
  article: ProductArticle;
  onRefresh: Props["onRefresh"];
}> = ({ siteId, article, onRefresh }) => {
  const [editing, setEditing] = useState<ProductArticleEditableField | null>(null);

  if (!article.meta_generated_at && !article.meta_title) return null;

  const schemaText = schemaToText(article.product_schema);

  return (
    <div className={card}>
      <CardTitle
        aside={
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#0D0F23]/60">
            {article.word_count ? <span>{t("article.words", { count: article.word_count })}</span> : null}
            {article.seo_score != null ? (
              <span className="rounded-full bg-[#EFEDFF] px-2.5 py-0.5 font-bold text-[#5B47FB]">
                {t("product.body.seoScore", { score: article.seo_score })}
              </span>
            ) : null}
          </div>
        }
      >
        {t("article.steps.meta")}
      </CardTitle>

      <dl className="divide-y divide-[#E4E5F0]/70">
        {META_FIELDS.map((f) => {
          const value = (article[f.key as keyof ProductArticle] as string | null) ?? "";
          return (
            <div key={f.key} className="py-3 first:pt-0 last:pb-0">
              <div className="mb-1 flex items-center justify-between">
                <dt className="text-[11px] font-bold text-[#0D0F23]/55">{f.label}</dt>
                {editing !== f.key && (
                  <button className={ghostBtn} onClick={() => setEditing(f.key)}>
                    {t("analyze.idea.editShort")}
                  </button>
                )}
              </div>
              {editing === f.key ? (
                <InlineEditor
                  value={value}
                  multiline={f.multiline}
                  rows={3}
                  onCancel={() => setEditing(null)}
                  onSave={async (v) => {
                    const res = await productArticleService.updateField(siteId, article.id, {
                      target_type: f.key,
                      value: v,
                    });
                    if ((res as any)?.success === false) throw new Error((res as any).message);
                    await onRefresh();
                    setEditing(null);
                  }}
                />
              ) : (
                <dd
                  className="break-words text-sm leading-7 text-[#0D0F23]"
                  dir={f.key === "slug" ? "ltr" : undefined}
                >
                  {value || <span className="text-[#0D0F23]/40">—</span>}
                </dd>
              )}
            </div>
          );
        })}

        {READONLY_META_FIELDS.map((f) => {
          const value = article[f.key] ?? "";
          return (
            <div key={f.key} className="py-3 last:pb-0">
              <dt className="mb-1 text-[11px] font-bold text-[#0D0F23]/55">{f.label}</dt>
              <dd className="break-words text-sm leading-7 text-[#0D0F23]">
                {value || <span className="text-[#0D0F23]/40">—</span>}
              </dd>
            </div>
          );
        })}
      </dl>

      {schemaText && (
        <details className="group mt-3 rounded-xl border border-[#E4E5F0] bg-[#FAFAFE]">
          <summary className="cursor-pointer select-none px-3 py-2.5 text-[11px] font-bold text-[#0D0F23]/65">
            {t("product.body.schema")}
          </summary>
          <pre
            dir="ltr"
            className="max-h-72 overflow-auto border-t border-[#E4E5F0] p-3 text-start text-[11px] leading-5 text-[#0D0F23]"
          >
            {schemaText}
          </pre>
        </details>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  کارت یک سکشن (مثل بخشی از یک مقاله)                                  */
/* ------------------------------------------------------------------ */

/* جدول مقایسه فقط در article.content است (assemble)؛ همان را بیرون می‌کشیم */
const extractTable = (md: string) => md.match(/(?:^\|.*\|[ \t]*(?:\n|$))+/m)?.[0] ?? "";

const markdownComponents: Components = {
  a: ({ node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-[#5B47FB] underline decoration-[#5B47FB]/40 underline-offset-4 hover:decoration-[#5B47FB]"
    />
  ),
  table: ({ node, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-sm" />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th {...props} className="border border-[#E4E5F0] bg-[#EFEDFF]/40 p-2 text-start font-black" />
  ),
  td: ({ node, ...props }) => <td {...props} className="border border-[#E4E5F0] p-2 align-top" />,
  img: ({ node, ...props }) => (
    <img
      {...props}
      loading="lazy"
      className="mx-auto my-4 h-auto max-h-96 max-w-full rounded-xl border border-[#E4E5F0] object-contain"
    />
  ),
};

/* سکشنی که FAQ را به‌صورت Markdown (### سوال + پاسخ) نگه می‌دارد */
const isFaqSection = (s: ProductArticleSection) => /سوال|پرسش|faq/i.test(s.heading ?? "");

const SectionCard: React.FC<{
  siteId: Props["siteId"];
  article: ProductArticle;
  section: ProductArticleSection;
  regenerating: boolean;
  articleDone: boolean;
  onRegenerate: () => void;
  onRefresh: Props["onRefresh"];
}> = ({ siteId, article, section, regenerating, articleDone, onRegenerate, onRefresh }) => {
  const [editing, setEditing] = useState(false);
  const generating = section.status === "pending" || section.status === "generating" || regenerating;
  const canAct = articleDone && !generating;
  const faqItems = useMemo(
    () => (isFaqSection(section) ? parseFaqMarkdown(section.content ?? "") : []),
    [section],
  );
  const body =
    (section as any).type === "comparison"
      ? `${extractTable((article as any).content ?? "")}\n\n${section.content ?? ""}`
      : (section.content ?? "");

  return (
    <div className={card}>
      <div className="mb-4 flex flex-col gap-3 border-b border-[#E4E5F0]/70 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-base font-black leading-8 text-[#0D0F23] sm:text-lg sm:leading-9">{section.heading}</h3>
        {canAct && !editing && (
          <div className="flex shrink-0 gap-1.5 sm:pt-1.5">
            <button className={ghostBtn} onClick={() => setEditing(true)}>
              {t("analyze.idea.editShort")}
            </button>
            <button className={ghostBtn} onClick={onRegenerate}>
              {t("article.banner.regenerate")}
            </button>
          </div>
        )}
      </div>
      {!editing && !generating && <SectionProducts section={section} />}

      {section.status === "failed" && (
        <p className="mb-2 text-xs font-bold text-rose-600">
          {section.error_message || t("article.final.sectionFailed")}
        </p>
      )}

      {editing ? (
        <InlineEditor
          value={section.content ?? ""}
          multiline
          rows={14}
          onCancel={() => setEditing(false)}
          onSave={async (v) => {
            const res = await productArticleService.updateSection(siteId, article.id, section.id, {
              content: v,
            });
            if ((res as any)?.success === false) throw new Error((res as any).message);
            await onRefresh();
            setEditing(false);
          }}
        />
      ) : generating ? (
        <div className="flex items-center gap-2 py-6 text-xs font-bold text-[#0D0F23]/60">
          <Spinner className="h-4 w-4" />
          {section.content && !regenerating ? t("analyze.ideasBar.generating") : t("product.body.writingSection")}
        </div>
      ) : faqItems.length ? (
        <FaqAccordion items={faqItems} />
      ) : section.content ? (
        <div
          className="prose prose-sm max-w-none break-words leading-8 text-[#0D0F23] sm:prose-base prose-headings:font-black"
          dir="auto"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {body}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="py-4 text-xs text-[#0D0F23]/40">{t("product.body.noContent")}</p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  FAQ — همان آکاردئونِ مشترک صفحه‌ی مقاله                             */
/* ------------------------------------------------------------------ */

const FaqCard: React.FC<{
  siteId: Props["siteId"];
  article: ProductArticle;
  onRefresh: Props["onRefresh"];
}> = ({ siteId, article, onRefresh }) => {
  const faq = article.faq_schema ?? [];
  if (!faq.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4E5F0] bg-white">
      <div className="flex items-center gap-3 border-b border-[#E4E5F0] bg-gradient-to-r rtl:bg-gradient-to-l from-[#FAFAFE] to-[#EFEDFF]/40 px-4 py-4 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFEDFF] text-base">
          ❓
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-[#0D0F23]">{t("article.faq.title")}</h3>
          <p className="text-[10px] font-bold text-[#0D0F23]/50">{t("article.faq.count", { count: faq.length })}</p>
        </div>
      </div>

      <div className="p-2.5 sm:p-3">
        <FaqAccordion
          items={faq}
          editable
          onSave={async (index, draft) => {
            const res = await productArticleService.updateFaq(siteId, article.id, index, {
              question: draft.question,
              answer: draft.answer,
            });
            if ((res as any)?.success === false) throw new Error((res as any).message);
            await onRefresh();
          }}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  بدنه‌ی اصلی (تایم‌لاین جداست: ProductStepTimeline)                   */
/* ------------------------------------------------------------------ */

export const ProductArticleBody: React.FC<Props> = ({
  siteId,
  article,
  isFreePlan,
  regeneratingSectionId,
  onRegenerateSection,
  onRefresh,
}) => {
  const articleDone = article.status === "completed" || article.status === "failed";
  const faqInSection = article.sections.some(
    (s) => isFaqSection(s) && parseFaqMarkdown(s.content ?? "").length > 0,
  );

  return (
    <div className="space-y-4">
      <ArticleImageCard
        siteId={siteId}
        article={article}
        isFreePlan={isFreePlan}
        onRegenerate={async (prompt, model) => {
          const res = await productArticleService.regenerateImage(siteId, article.id, {
            prompt,
            model,
          });
          // image_status روی سرور pending می‌شود؛ با refresh کارت به حالت loading می‌رود و polling ادامه می‌دهد.
          if ((res as any)?.success !== false) await onRefresh();
          return res;
        }}
      />

      <MetaCard siteId={siteId} article={article} onRefresh={onRefresh} />

      {article.sections.map((section) => (
        <SectionCard
          key={section.id}
          siteId={siteId}
          article={article}
          section={section}
          regenerating={regeneratingSectionId === section.id}
          articleDone={articleDone}
          onRegenerate={() => onRegenerateSection(section)}
          onRefresh={onRefresh}
        />
      ))}

      <ArticleProductsCard article={article} />

      {!faqInSection && <FaqCard siteId={siteId} article={article} onRefresh={onRefresh} />}
    </div>
  );
};