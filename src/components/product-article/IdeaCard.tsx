import React from "react";
import type { ProductSeoIdea, ProductSeoIdeaProduct } from "../../services/api";
import { Spinner } from "../article-generate/UiBits";
import { t } from "../../i18n";

/** ایده + وضعیت مقاله + لینک داخلی (همه در ProductSeoIdea تعریف شده‌اند) */
export type IdeaWithArticle = ProductSeoIdea;

const STYLE_LABELS: Record<string, string> = {
  get price() { return t("product.styles.price"); },
  get comparison() { return t("product.styles.comparison"); },
  get buying_guide() { return t("product.styles.buying_guide"); },
};

type IdeaState = "new" | "progress" | "completed" | "failed" | "paused";

const getState = (idea: IdeaWithArticle): IdeaState => {
  if (!idea.article_id) return "new";
  if (idea.article_status === "completed") return "completed";
  if (idea.article_status === "failed") return "failed";
  if (idea.article_status === "paused_credit") return "paused";
  return "progress";
};

const outline = (c: string) => `border ${c} bg-white hover:bg-[#F3F2FB]`;

const UI: Record<IdeaState, { card: string; badge?: string; text?: string; button: string; label: string }> = {
  new: {
    card: "border-[#E4E5F0] bg-[#FAFAFE] hover:border-[#5B47FB]/50 hover:shadow-md",
    button: "bg-[#5B47FB] text-white hover:bg-[#4935E0]",
    get label() { return t("dashboard.opportunities.generate"); },
  },
  progress: {
    card: "border-[#5B47FB]/40 bg-[#F4F9F7]",
    badge: "bg-[#EFEDFF] text-[#4935E0]",
    get text() { return t("analyze.ideasBar.generating"); },
    button: outline("border-[#5B47FB] text-[#5B47FB]"),
    get label() { return t("product.idea.viewProgress"); },
  },
  completed: {
    card: "border-[#5B47FB]/40 bg-[#F1F8F5]",
    badge: "bg-[#5B47FB] text-white",
    get text() { return t("product.idea.generated"); },
    button: outline("border-[#5B47FB] text-[#5B47FB]"),
    get label() { return t("analyze.idea.viewArticle"); },
  },
  failed: {
    card: "border-rose-200 bg-rose-50/60",
    badge: "bg-rose-100 text-rose-700",
    get text() { return t("product.idea.failed"); },
    button: outline("border-rose-300 text-rose-600"),
    get label() { return t("product.idea.viewRetry"); },
  },
  paused: {
    card: "border-amber-200 bg-amber-50/60",
    badge: "bg-amber-100 text-amber-700",
    get text() { return t("product.idea.paused"); },
    button: outline("border-amber-300 text-amber-700"),
    get label() { return t("analyze.idea.viewArticle"); },
  },
};

const Icon: React.FC<{ d: string; className?: string }> = ({ d, className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d={d} />
  </svg>
);

const CHECK = "M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z";
const LINK =
  "M12.6 7.4a1 1 0 010 1.4l-3.8 3.8a1 1 0 01-1.4-1.4l3.8-3.8a1 1 0 011.4 0zM8.2 5.2l1.1-1.1a3.5 3.5 0 015 5l-1.1 1.1a1 1 0 11-1.4-1.4l1.1-1.1a1.5 1.5 0 00-2.1-2.1L9.7 6.7a1 1 0 11-1.5-1.5zM11.8 14.8l-1.1 1.1a3.5 3.5 0 01-5-5l1.1-1.1a1 1 0 111.4 1.4l-1.1 1.1a1.5 1.5 0 002.1 2.1l1.1-1.1a1 1 0 111.5 1.5z";
const BOX = "M10 2l7 3.5v9L10 18l-7-3.5v-9L10 2zm0 2.2L6 6.2l4 2 4-2-4-2zM5 7.9v5.6l4 2v-5.6l-4-2zm6 7.6l4-2V7.9l-4 2v5.6z";

const thumbOf = (p: ProductSeoIdeaProduct): string | null => {
  let images: any = (p as any).images;
  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch {
      return null;
    }
  }
  const first = Array.isArray(images) ? images[0] : null;
  const src = typeof first === "string" ? first : first?.src ?? first?.url;
  return typeof src === "string" && src ? src : null;
};

/** نمایش خوانا: بدون http(s):// و بدون اسلش آخر، با دیکد فارسی */
const prettyUrl = (raw: string): string => {
  const noProto = raw.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  try {
    return decodeURIComponent(noProto);
  } catch {
    return noProto;
  }
};

interface IdeaCardProps {
  idea: IdeaWithArticle;
  loading?: boolean;
  onSelect: (idea: IdeaWithArticle) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, loading = false, onSelect }) => {
  const state = getState(idea);
  const ui = UI[state];
  const products = idea.products || [];
  const categories = (idea.categories || []).map((c) => c.name).filter(Boolean).join(", ");
  const url = (idea.target_url || "").trim();
  const linkTitle = (idea.target_url_title || "").trim();

  return (
    <article className={`flex h-full flex-col gap-3 rounded-2xl border p-4 transition sm:p-5 ${ui.card}`}>
      {/* نشان‌ها */}
      <div className="flex min-h-[28px] items-center justify-between gap-2">
        <span className="rounded-full bg-[#F3F2FB] px-2.5 py-1 text-[11px] font-bold text-[#5B47FB]">
          {STYLE_LABELS[idea.content_style] || idea.content_style}
        </span>
        {ui.badge && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${ui.badge}`}>
            {state === "progress" && <Spinner className="h-3 w-3" />}
            {state === "completed" && <Icon d={CHECK} />}
            {ui.text}
          </span>
        )}
      </div>

      {/* عنوان (۲ خط ثابت) و دسته‌ها (۱ خط) */}
      <div>
        <h4 className="line-clamp-2 min-h-[56px] text-[15px] font-black leading-7 text-[#0D0F23]">{idea.title}</h4>
        <p className="mt-1 h-4 truncate text-[11px] text-[#6C7193]">{categories}</p>
      </div>

      {/* همه‌ی محصولات؛ این بخش فضای اضافه را می‌گیرد تا لینک و دکمه هم‌تراز پایین بمانند */}
      <ul className="flex-1 space-y-1.5">
        {products.map((p) => {
          const thumb = thumbOf(p);
          return (
            <li key={p.id} className="flex items-center gap-2.5 rounded-xl bg-white/60 p-1.5 ring-1 ring-[#E4E5F0]/60">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F3F2FB] text-[#9AA39D]">
                {thumb ? (
                  <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <Icon d={BOX} className="h-4 w-4" />
                )}
              </span>
              <span className="line-clamp-2 text-xs leading-5 text-[#3B3F5C]">{p.name}</span>
            </li>
          );
        })}
      </ul>

      {/* لینک داخلی: عنوان + آدرس (ارتفاع ثابت) */}
      <div className="h-[68px] rounded-xl border border-[#5B47FB]/20 bg-[#EAF4F1]/70 px-3 py-2">
        <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#5B47FB]">
          <Icon d={LINK} className="h-3 w-3 shrink-0" />
          {t("product.idea.internalLink")}
        </p>
        <p className="mt-0.5 truncate text-xs font-black text-[#0D0F23]">{linkTitle || "—"}</p>
        <p
          dir="ltr"
          title={url}
          className={`truncate text-start text-[11px] ${url ? "text-[#6C7193]" : "text-amber-700"}`}
        >
          {url ? prettyUrl(url) : "—"}
        </p>
      </div>

      {/* دکمه */}
      <button
        type="button"
        onClick={() => onSelect(idea)}
        disabled={loading}
        className={`inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl text-xs font-black transition active:scale-[0.98] disabled:opacity-60 ${ui.button}`}
      >
        {loading ? (
          <>
            <Spinner className="h-3.5 w-3.5" />
            {t("analyze.ideas.preparing")}
          </>
        ) : (
          ui.label
        )}
      </button>
    </article>
  );
};

export default IdeaCard;