// src/components/article-generate/FinalArticleCard.tsx
import React, { useState } from "react";
import { articleService } from "../../services/api";
import type { Article, ArticleSection } from "../../types";
import { MarkdownView } from "./MarkdownView";
import { copyArticleForWp } from "../../utils/copyArticle";
import { CheckIcon, Spinner } from "./UiBits";
import { CHAT_DRAG_MIME, serializeDrag, targetFromField, targetFromSection } from "./chatTarget";
import type { ChatTargetSelection } from "./chatTarget";
import { RichMarkdownEditor } from "./RichMarkdownEditor";
import { FaqAccordion, parseFaqMarkdown } from "./FaqCard";
import { BannerCard } from "./BannerCard";
import { GalleryImageCard, type SectionGalleryImage } from "./GalleryImageCard";
import { t, getLocale } from "../../i18n";
import { ArticleImagesPanel } from "./ArticleImagesPanel";
import { collectArticleImages } from "../../utils/articleImages";
// const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL ?? "";
interface FinalArticleCardProps {
  siteId: number | string;
  article: Article;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (t: ChatTargetSelection) => void;
  onArticleChange: (article: Article) => void;
  onRegenerateSection: (section: ArticleSection) => void;
  regeneratingSectionId: string | null;
  sectionActionLabel?: string;
  isFreePlan: boolean;
}

const HEADING_CLASS = "text-base sm:text-xl font-black text-[#1E2A28] leading-7 sm:leading-8";

/* ─────────────────────────────────────────────────────────
   تصاویر گالری (بک‌اند به هر سکشن، در صورت وجود، یک آرایه‌ی
   images_after می‌چسبونه: تصاویری که باید دقیقاً بعد از همون
   سکشن نشون داده بشن. ترتیب/جایگاه‌شون کاملاً سمت بک‌اند
   (FinalizeArticleJob) تعیین شده و اینجا فقط رندر می‌شن —
   هیچ منطق چیدمانی سمت فرانت نداریم.
───────────────────────────────────────────────────────── */


type SectionWithGallery = ArticleSection & { images_after?: SectionGalleryImage[] };




const SectionGalleryImages: React.FC<{
  images?: SectionGalleryImage[];
  siteId: number | string;
  article: Article;
  onArticleChange: (article: Article) => void;
  canEditOrRegenerate: boolean;
  isProUser: boolean;
}> = ({ images, siteId, article, onArticleChange, canEditOrRegenerate, isProUser }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="my-2 space-y-2 sm:space-y-3">
      {images.map((img) => (
        <GalleryImageCard
          key={img.gallery_index}
          siteId={siteId}
          article={article}
          image={img}
          onArticleChange={onArticleChange}
          canEditOrRegenerate={canEditOrRegenerate}
          isProUser={isProUser}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   FAQ در section.type === "faq" با محتوای Markdown ذخیره می‌شود
   (### سوال ...\nپاسخ ...، پشت‌سرهم برای هر سوال). این محتوا را با
   parseFaqMarkdown (از FaqCard.tsx) به آرایه‌ی {question, answer}
   تبدیل و با همان FaqAccordion مشترک (از FaqCard.tsx) رندر
   می‌کنیم — دقیقاً همان ظاهر/رفتاری که در FaqCard استفاده شده،
   بدون پیاده‌سازی جداگانه. این‌جا فقط حالت نمایشیِ read-only
   لازم است (ویرایش کل بخش FAQ از طریق دکمه‌ی «ویرایش دستی» خودِ
   SectionBlock روی Markdown خام انجام می‌شود).
───────────────────────────────────────────────────────── */

// const faIndex = (n: number) => n.toLocaleString("en-US");

/* ─────────────────────────────────────────────────────────
   دستگیره‌ی درگ — همیشه آبی و با برچسب، تا کاملاً مشخص باشه
   برای «کشیدن به گفتگو» است. با className قابل کنترل هست
   (مثلاً hidden sm:inline-flex برای مخفی‌کردن روی موبایل).
───────────────────────────────────────────────────────── */
const DragHandle: React.FC<{
  onDragStart: (e: React.DragEvent<HTMLSpanElement>) => void;
  title?: string;
  label?: string;
  className?: string;
}> = ({ onDragStart, title, label, className = "" }) => (
  <span
    draggable
    onDragStart={(e) => {
      e.stopPropagation();
      onDragStart(e);
    }}
    title={title ?? t("article.final.dragToChat")}
    className={`inline-flex shrink-0 cursor-grab select-none items-center gap-1.5 rounded-lg border border-[#1B6F63]/25 bg-[#DCEFEA] px-2 py-1.5 text-[#1B6F63] shadow-sm transition-colors hover:border-[#1B6F63]/50 hover:bg-[#CBE0DA] active:cursor-grabbing active:bg-[#CBE0DA] ${className}`}
  >
    <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
      <circle cx="6" cy="4" r="1.7" />
      <circle cx="14" cy="4" r="1.7" />
      <circle cx="6" cy="10" r="1.7" />
      <circle cx="14" cy="10" r="1.7" />
      <circle cx="6" cy="16" r="1.7" />
      <circle cx="14" cy="16" r="1.7" />
    </svg>
    {label && <span className="whitespace-nowrap text-[10px] font-bold">{label}</span>}
  </span>
);

/* یک بلوکِ نمایشِ بخش، هنگامی که مقاله هنوز در حال تولید است — بدون هیچ تعاملی */
const GeneratingSectionBlock: React.FC<{ section: ArticleSection; index: number; isActive: boolean }> = ({
  section,
  index,
  isActive,
}) => {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 transition-colors ${
        section.status === "generated"
          ? "border-[#DAD5C7] bg-white"
          : isActive
          ? "border-[#1B6F63]/40 bg-[#DCEFEA]/40"
          : "border-[#DAD5C7]/60 bg-[#EFEDE6]/60"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] sm:text-[11px] font-bold text-[#9BA69F]">
          {t("article.final.section", { index: index + 1 })}
        </span>
        {section.status !== "generated" && isActive && (
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#1B6F63]">
            <Spinner className="h-3.5 w-3.5" /> {t("analyze.ideasBar.generating")}
          </span>
        )}
        {section.status !== "generated" && !isActive && (
          <span className="text-[10px] sm:text-[11px] font-bold text-[#9BA69F]">{t("article.final.waiting")}</span>
        )}
      </div>

      {section.status === "generated" && section.content ? (
        <div className="section-appear select-text">
          {section.type === "faq" ? (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-[#1E2A28]">{section.heading}</h4>
              <FaqAccordion items={parseFaqMarkdown(section.content)} />
            </div>
          ) : (
            <MarkdownView text={`## ${section.heading}\n\n${section.content}`} />
          )}
        </div>
      ) : section.status === "failed" ? (
        <p className="select-text text-[10px] sm:text-[11px] font-bold text-rose-500">
          {section.error_message || t("article.final.sectionFailed")}
        </p>
      ) : (
        <div className="space-y-1.5 py-1">
          <div className="h-2.5 w-3/4 rounded-full bg-[#DAD5C7]/70 animate-pulse" />
          <div className="h-2.5 w-full rounded-full bg-[#DAD5C7]/50 animate-pulse" />
          <div className="h-2.5 w-2/3 rounded-full bg-[#DAD5C7]/50 animate-pulse" />
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   ادیتور یک هدینگ + یک بلوک متنِ غنی (WYSIWYG) — عنوان همچنان
   یک input ساده است (تک‌خطی، بدون فرمت)، ولی بدنه حالا با
   RichMarkdownEditor (Bold/Italic/Underline/کد این‌لاین/لینک/
   هدینگ H3-H4/لیست/نقل‌قول/خط‌جدا) ویرایش می‌شود.
   editorKey باعث می‌شود با سوییچ بین بخش‌های مختلف، ویرایشگر با
   محتوای درستِ همان بخش از نو mount شود (چون MDXEditor نسبت به
   prop اولیه‌اش uncontrolled است).
───────────────────────────────────────────────────────── */
const HeadingAndBodyEditor: React.FC<{
  heading: string;
  body: string;
  onHeadingChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  editorKey?: string | number;
  saving?: boolean;
}> = ({ heading, body, onHeadingChange, onBodyChange, editorKey, saving }) => {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={heading}
        onChange={(e) => onHeadingChange(e.target.value)}
        placeholder={t("article.final.sectionTitle")}
        className={`w-full rounded-lg border border-[#DAD5C7] px-3 py-2 sm:px-3.5 sm:py-2.5 focus:border-[#1B6F63] focus:outline-none ${HEADING_CLASS}`}
      />
      <RichMarkdownEditor
        key={editorKey}
        initialMarkdown={body}
        onChangeMarkdown={onBodyChange}
        readOnly={saving}
        minHeightClassName="rmde-min-h"
      />
    </div>
  );
};

const PlainBodyEditor: React.FC<{
  body: string;
  onBodyChange: (v: string) => void;
  editorKey?: string | number;
  saving?: boolean;
}> = ({ body, onBodyChange, editorKey, saving }) => (
  <RichMarkdownEditor
    key={editorKey}
    initialMarkdown={body}
    onChangeMarkdown={onBodyChange}
    readOnly={saving}
    minHeightClassName="rmde-min-h-sm"
  />
);

interface ContentBlock {
  id: string;
  heading: string | null;
  body: string;
}

function parseContentToBlocks(raw: string): ContentBlock[] {
  const lines = (raw ?? "").split("\n");
  const blocks: ContentBlock[] = [];
  let current: ContentBlock | null = null;
  let uid = 0;

  const pushCurrent = () => {
    if (current) {
      current.body = current.body.replace(/^\n+/, "").replace(/\n+$/, "");
      blocks.push(current);
    }
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      pushCurrent();
      current = { id: `b${uid++}`, heading: line.slice(3).trim(), body: "" };
    } else {
      if (!current) current = { id: `b${uid++}`, heading: null, body: "" };
      current.body += (current.body ? "\n" : "") + line;
    }
  }
  pushCurrent();

  return blocks;
}

function blocksToContent(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => (b.heading !== null ? `## ${b.heading}\n\n${b.body}`.trim() : b.body.trim()))
    .filter(Boolean)
    .join("\n\n");
}

const GeneralArticleEditor: React.FC<{
  initialContent: string;
  onChange: (blocks: ContentBlock[]) => void;
  saving?: boolean;
}> = ({ initialContent, onChange, saving }) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => parseContentToBlocks(initialContent));

  const updateBlock = (id: string, patch: Partial<ContentBlock>) => {
    setBlocks((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...patch } : b));
      onChange(next);
      return next;
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {blocks.map((b) =>
        b.heading !== null ? (
          <HeadingAndBodyEditor
            key={b.id}
            editorKey={b.id}
            heading={b.heading}
            body={b.body}
            onHeadingChange={(v) => updateBlock(b.id, { heading: v })}
            onBodyChange={(v) => updateBlock(b.id, { body: v })}
            saving={saving}
          />
        ) : (
          <PlainBodyEditor
            key={b.id}
            editorKey={b.id}
            body={b.body}
            onBodyChange={(v) => updateBlock(b.id, { body: v })}
            saving={saving}
          />
        ),
      )}
    </div>
  );
};

export const FinalArticleCard: React.FC<FinalArticleCardProps> = ({
  siteId,
  article,
  selectedTarget,
  onSelectTarget,
  onArticleChange,
  sectionActionLabel,
    isFreePlan,

}) => {
  const [copied, setCopied] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const [editingGeneral, setEditingGeneral] = useState(false);
  const [generalBlocks, setGeneralBlocks] = useState<ContentBlock[]>([]);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionHeadingDraft, setSectionHeadingDraft] = useState("");
  const [sectionBodyDraft, setSectionBodyDraft] = useState("");
  const [savingSection, setSavingSection] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const sections = (article.sections ?? []) as SectionWithGallery[];
  const isGenerating = article.status === "generating_sections" || article.status === "generating_outline" || article.status === "pending" || article.status === "creating_brief" || article.status === "reviewing";
  const isCompleted = article.status === "completed";
  const canEditOrRegenerate = article.status === "completed" || article.status === "failed";

  const toggleCollapsed = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (isGenerating) {
    if (sections.length === 0) {
      return (
        <div className="rounded-2xl border border-[#DAD5C7] bg-white p-3.5 sm:p-5">
          <h3 className="text-xs sm:text-sm font-black text-[#1E2A28] mb-2.5 sm:mb-3">📝 {t("article.final.article")}</h3>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#9BA69F] py-2">
            <Spinner />
            {t("article.sections.designing")}
          </div>
        </div>
      );
    }

    const activeId = sections.find((s) => s.status === "pending")?.id ?? null;

    return (
      <div className="rounded-2xl border border-[#DAD5C7] bg-white p-3.5 sm:p-5">
        <style>{`
          @keyframes sectionAppear {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .section-appear { animation: sectionAppear .5s ease-out; }
        `}</style>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-black text-[#1E2A28]">📝 {t("article.final.article")}</h3>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#000000]">
            {t("article.sections.progress", { done: sections.filter((s) => s.status === "generated").length, total: sections.length })}
          </span>
        </div>
        <div className="space-y-2">
          {sections.map((s, idx) => (
            <React.Fragment key={s.id}>
              <GeneratingSectionBlock section={s} index={idx} isActive={s.id === activeId} />
<SectionGalleryImages
  images={s.images_after}
  siteId={siteId}
  article={article}
  onArticleChange={onArticleChange}
  canEditOrRegenerate={canEditOrRegenerate}
  isProUser={!isFreePlan}
/>              {idx === 0 && (
                <div className="mt-2">
<BannerCard siteId={siteId} article={article} onArticleChange={onArticleChange} />                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (!isCompleted || !article.content) {
    if (sections.length === 0) return null;

    return (
      <div className="rounded-2xl border border-[#DAD5C7] bg-white p-3.5 sm:p-5">
        <h3 className="text-xs sm:text-sm font-black text-[#1E2A28] mb-3 sm:mb-4">📝 {t("article.sections.title")}</h3>
        <div className="space-y-2">
          {sections.map((s, idx) => (
            <React.Fragment key={s.id}>
              <SectionBlock
                section={s}
                index={idx}
                siteId={siteId}
                article={article}
                isOpen={!collapsed.has(s.id)}
                onToggle={() => toggleCollapsed(s.id)}
                isSelected={selectedTarget?.type === "section" && selectedTarget.id === s.id}
                onSelectTarget={onSelectTarget}
                canEditOrRegenerate={canEditOrRegenerate}
                editingSectionId={editingSectionId}
                setEditingSectionId={setEditingSectionId}
                headingDraft={sectionHeadingDraft}
                setHeadingDraft={setSectionHeadingDraft}
                bodyDraft={sectionBodyDraft}
                setBodyDraft={setSectionBodyDraft}
                savingSection={savingSection}
                setSavingSection={setSavingSection}
                sectionError={sectionError}
                setSectionError={setSectionError}
                onArticleChange={onArticleChange}
                sectionActionLabel={sectionActionLabel}
              />
<SectionGalleryImages
  images={s.images_after}
  siteId={siteId}
  article={article}
  onArticleChange={onArticleChange}
  canEditOrRegenerate={canEditOrRegenerate}
  isProUser={!isFreePlan}
/>              {idx === 0 && (
                <div className="mt-2">
<BannerCard siteId={siteId} article={article} onArticleChange={onArticleChange} />                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  const isGeneralSelected = selectedTarget?.type === "general";
  const images = collectArticleImages(article);

const copy = async () => {
  try {
    await copyArticleForWp(article, {
      includeTitle: true,
      includeImages: true,
      rtl: false,
      source: "sections", // تصاویر و ترتیب بخش‌ها دقیقاً مثل صفحه
      // siteUrl: "https://your-wordpress-site.com", // اختیاری: برای کامل‌کردن لینک‌های نسبی
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error(err);
    alert(t("article.copy.failedRetry"));
  }
};
  const startEditGeneral = () => {
    setGeneralBlocks(parseContentToBlocks(article.content ?? ""));
    setEditingGeneral(true);
    setGeneralError(null);
  };

  const saveGeneral = async () => {
    setSavingGeneral(true);
    setGeneralError(null);
    try {
      const value = blocksToContent(generalBlocks);
      const res = await articleService.updateField(siteId, article.id, { target_type: "general", value });
      const target = (res as any)?.data?.target ?? (res as any)?.target;
      onArticleChange({ ...article, content: (target?.value as string) ?? value });
      setEditingGeneral(false);
    } catch (err: any) {
      setGeneralError(err?.message || t("article.final.saveFailed"));
    } finally {
      setSavingGeneral(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border-2 p-3.5 sm:p-5 transition-colors ${
        isGeneralSelected ? "border-[#1B6F63] bg-[#DCEFEA]/40" : "border-[#1B6F63]/25 bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#1B6F63] text-white">
            <CheckIcon />
          </span>
          <h3 className="text-xs sm:text-sm font-black text-[#1E2A28]">{t("article.final.ready")}</h3>
        </div>

        {!editingGeneral && (
          <div className="flex w-full items-center gap-1.5 sm:w-auto sm:gap-2">
            {/* دستگیره‌ی درگ فقط تو دسکتاپ معنی داره؛ روی موبایل مخفیه */}
            <DragHandle
              label={t("article.final.dragShort")}
              title={t("article.final.dragArticle")}
              className="hidden sm:inline-flex"
              onDragStart={(e) => {
                e.dataTransfer.setData(CHAT_DRAG_MIME, serializeDrag(targetFromField("general", article)));
                e.dataTransfer.effectAllowed = "copy";
              }}
            />

            <button
              type="button"
              onClick={() => onSelectTarget(targetFromField("general", article))}
              className="flex-1 rounded-xl px-2 py-2 text-[10px] sm:text-[11px] font-bold text-[#1B6F63] hover:bg-[#DCEFEA] sm:flex-none sm:px-3"
            >
              <span className="sm:hidden">💬 {t("article.actions.chat")}</span>
              <span className="hidden sm:inline">💬 {t("article.final.chatArticle")}</span>
            </button>

            <button
              type="button"
              onClick={startEditGeneral}
              className="flex-1 rounded-xl border border-[#DAD5C7] px-2 py-2 text-[10px] sm:text-[11px] font-bold text-[#000000] hover:border-[#1B6F63]/50 hover:text-[#1B6F63] sm:flex-none sm:px-3"
            >
              <span className="sm:hidden">✏️ {t("analyze.idea.editShort")}</span>
              <span className="hidden sm:inline">✏️ {t("article.final.editArticle")}</span>
            </button>

            <button
              type="button"
              onClick={copy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1E2A28] px-2 py-2 text-[10px] sm:text-[11px] font-bold text-white hover:bg-[#3D453F] transition-colors sm:flex-none sm:px-4"
            >
              {copied ? `✓ ${t("developer.keys.copied")}` : (
                <>
                  <span className="sm:hidden">{t("developer.keys.copy")}</span>
                  <span className="hidden sm:inline">{t("article.final.copyMarkdown")}</span>
                </>
              )}
            </button>

            {images.length > 0 && (
              <button
                type="button"
                onClick={() => setShowImages((v) => !v)}
                aria-expanded={showImages}
                className={`flex-1 rounded-xl border px-2 py-2 text-[10px] sm:text-[11px] font-bold transition-colors sm:flex-none sm:px-3 ${
                  showImages
                    ? "border-[#1B6F63] bg-[#DCEFEA] text-[#1B6F63]"
                    : "border-[#DAD5C7] text-[#000000] hover:border-[#1B6F63]/50 hover:text-[#1B6F63]"
                }`}
              >
                <span className="sm:hidden">🖼️ {t("growth.images.short")}</span>
                <span className="hidden sm:inline">🖼️ {t("growth.images.export", { count: images.length })}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {showImages && !editingGeneral && <ArticleImagesPanel items={images} />}

      {editingGeneral ? (
        <div className="space-y-3">
          <GeneralArticleEditor initialContent={article.content ?? ""} onChange={setGeneralBlocks} saving={savingGeneral} />
          {generalError && <p className="text-[10px] sm:text-[11px] font-bold text-rose-500">{generalError}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingGeneral(false)}
              disabled={savingGeneral}
              className="rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-bold text-[#000000] hover:bg-[#F4F2EC]"
            >
              {t("common.actions.cancel")}
            </button>
            <button
              type="button"
              onClick={saveGeneral}
              disabled={savingGeneral}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B6F63] px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-bold text-white hover:bg-[#14564C] disabled:opacity-50"
            >
              {savingGeneral ? <Spinner className="h-3.5 w-3.5" /> : t("article.actions.save")}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((s, idx) => (
            <React.Fragment key={s.id}>
              <SectionBlock
                section={s}
                index={idx}
                siteId={siteId}
                article={article}
                isOpen={!collapsed.has(s.id)}
                onToggle={() => toggleCollapsed(s.id)}
                isSelected={selectedTarget?.type === "section" && selectedTarget.id === s.id}
                onSelectTarget={onSelectTarget}
                canEditOrRegenerate={canEditOrRegenerate}
                editingSectionId={editingSectionId}
                setEditingSectionId={setEditingSectionId}
                headingDraft={sectionHeadingDraft}
                setHeadingDraft={setSectionHeadingDraft}
                bodyDraft={sectionBodyDraft}
                setBodyDraft={setSectionBodyDraft}
                savingSection={savingSection}
                setSavingSection={setSavingSection}
                sectionError={sectionError}
                setSectionError={setSectionError}
                onArticleChange={onArticleChange}
                sectionActionLabel={sectionActionLabel}
              />
<SectionGalleryImages
  images={s.images_after}
  siteId={siteId}
  article={article}
  onArticleChange={onArticleChange}
  canEditOrRegenerate={canEditOrRegenerate}
  isProUser={!isFreePlan}
/>              {idx === 0 && (
                <div className="mt-2">
<BannerCard siteId={siteId} article={article} onArticleChange={onArticleChange} />                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

interface SectionBlockProps {
  section: ArticleSection;
  index: number;
  siteId: number | string;
  article: Article;
  isOpen: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelectTarget: (t: ChatTargetSelection) => void;
  canEditOrRegenerate: boolean;
  editingSectionId: string | null;
  setEditingSectionId: (id: string | null) => void;
  headingDraft: string;
  setHeadingDraft: (v: string) => void;
  bodyDraft: string;
  setBodyDraft: (v: string) => void;
  savingSection: boolean;
  setSavingSection: (v: boolean) => void;
  sectionError: string | null;
  setSectionError: (v: string | null) => void;
  onArticleChange: (article: Article) => void;
  sectionActionLabel?: string;
}

const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  index,
  siteId,
  article,
  isOpen,
  onToggle,
  isSelected,
  onSelectTarget,
  canEditOrRegenerate,
  editingSectionId,
  setEditingSectionId,
  headingDraft,
  setHeadingDraft,
  bodyDraft,
  setBodyDraft,
  savingSection,
  setSavingSection,
  sectionError,
  setSectionError,
  onArticleChange,
  sectionActionLabel,
}) => {
  const isEditing = editingSectionId === section.id;
  const isFaqSection = section.type === "faq";

  const startEdit = () => {
    setEditingSectionId(section.id);
    setHeadingDraft(section.heading ?? "");
    setBodyDraft(section.content ?? "");
    setSectionError(null);
  };

  const saveEdit = async () => {
    setSavingSection(true);
    setSectionError(null);
    try {
      const heading = headingDraft.trim();
      const content = bodyDraft;
      const res = await articleService.updateSection(siteId, article.id, section.id, { heading, content });
      const target = (res as any)?.data?.target ?? (res as any)?.target;
      const newHeading = target?.label ?? heading;
      const newContent = (target?.value as string) ?? content;

      onArticleChange({
        ...article,
        sections: article.sections.map((s) =>
          s.id === section.id ? { ...s, heading: newHeading, content: newContent } : s,
        ),
      });
      setEditingSectionId(null);
    } catch (err: any) {
      setSectionError(err?.message || t("analyze.idea.errors.save"));
    } finally {
      setSavingSection(false);
    }
  };

  const combinedText = `## ${section.heading}\n\n${section.content ?? ""}`;

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isSelected
          ? "border-[#1B6F63]/40 bg-[#DCEFEA]/40"
          : section.status === "failed"
          ? "border-rose-200 bg-rose-50/30"
          : "border-[#DAD5C7] bg-white"
      }`}
    >
      <div className="w-full flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
        <button type="button" onClick={onToggle} className="flex flex-1 items-center gap-2 sm:gap-2.5 text-start min-w-0">
          <span className="flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#EFEDE6] text-[9px] sm:text-[10px] font-black text-[#000000] shrink-0">
            {isFaqSection ? "❓" : (index + 1).toLocaleString(getLocale())}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#9BA69F]">
            {isFaqSection ? t("article.sectionType.faq") : t("article.final.section", { index: index + 1 })}
          </span>
        </button>

        {/* توی ردیفِ هدرِ هر SectionBlock — روی موبایل مخفیه */}
        {canEditOrRegenerate && !isEditing && (
          <DragHandle
            label={t("article.final.dragShort")}
            title={t("article.final.dragSection")}
            className="hidden sm:inline-flex"
            onDragStart={(e) => {
              e.dataTransfer.setData(CHAT_DRAG_MIME, serializeDrag(targetFromSection(section)));
              e.dataTransfer.effectAllowed = "copy";
            }}
          />
        )}

        <button type="button" onClick={onToggle}>
          <svg
            className={`h-4 w-4 text-[#9BA69F] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {section.status === "failed" && section.error_message && (
        <p className="select-text px-3 pb-2 sm:px-4 text-[10px] sm:text-[11px] text-rose-500 leading-5">
          {section.error_message}
        </p>
      )}

      {isOpen && section.content && (
        <div className="border-t border-[#DAD5C7]/70 px-3 py-3 sm:px-4 sm:py-4">
          {isEditing ? (
            <div className="space-y-3">
              <HeadingAndBodyEditor
                editorKey={section.id}
                heading={headingDraft}
                body={bodyDraft}
                onHeadingChange={setHeadingDraft}
                onBodyChange={setBodyDraft}
                saving={savingSection}
              />
              {sectionError && <p className="text-[9px] sm:text-[10px] font-bold text-rose-500">{sectionError}</p>}
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSectionId(null)}
                  disabled={savingSection}
                  className="rounded-lg px-3 py-1.5 text-[10px] sm:text-[11px] font-bold text-[#000000] hover:bg-[#F4F2EC]"
                >
                  {t("common.actions.cancel")}
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={savingSection}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B6F63] px-3 py-1.5 text-[10px] sm:text-[11px] font-bold text-white hover:bg-[#14564C] disabled:opacity-50"
                >
                  {savingSection ? <Spinner className="h-3 w-3" /> : t("article.actions.save")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="select-text">
                {isFaqSection ? (
                  <div className="space-y-3">
                    <h4 className="text-sm sm:text-base font-black text-[#1E2A28]">{section.heading}</h4>
                    <FaqAccordion items={parseFaqMarkdown(section.content ?? "")} />
                  </div>
                ) : (
                  <MarkdownView text={combinedText} />
                )}
              </div>

              {canEditOrRegenerate && (
                <div className="mt-2.5 sm:mt-3 flex flex-wrap justify-end gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectTarget(targetFromSection(section))}
                    className={`rounded-xl border px-2.5 py-1.5 sm:px-3 text-[10px] sm:text-[11px] font-bold transition-colors ${
                      isSelected
                        ? "border-[#1B6F63]/40 bg-[#DCEFEA] text-[#1B6F63]"
                        : "border-[#DAD5C7] text-[#000000] hover:border-[#1B6F63]/40 hover:text-[#1B6F63]"
                    }`}
                  >
                    {sectionActionLabel ?? t("article.actions.chat")}
                  </button>
                  <button
                    type="button"
                    onClick={startEdit}
                    className="rounded-xl border border-[#DAD5C7] px-2.5 py-1.5 sm:px-3 text-[10px] sm:text-[11px] font-bold text-[#000000] hover:border-[#1B6F63]/40 hover:text-[#1B6F63] transition-colors"
                  >
                    {t("article.sections.editManually")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};