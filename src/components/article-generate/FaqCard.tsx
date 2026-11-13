// src/components/article-generate/FaqCard.tsx
import React, { useEffect, useState } from "react";
import { articleService } from "../../services/api";
import type { Article, ArticleFaqItem } from "../../types";
import { CHAT_DRAG_MIME, serializeDrag, targetFromFaq } from "./chatTarget";
import type { ChatTargetSelection } from "./chatTarget";
import { Spinner } from "./UiBits";
import { t, formatNumber } from "../../i18n";

const faIndex = (n: number) => formatNumber(n);

/* ═══════════════════════════════════════════════════════════
   بخش ۱: هسته‌ی مشترک آکاردئون FAQ
   این تنها جایی است که ظاهر/رفتار آکاردئون FAQ پیاده‌سازی می‌شود.
   FaqCard (پایین همین فایل) و FinalArticleCard هر دو از همین
   FaqAccordion استفاده می‌کنند — تا هر تغییری فقط اینجا اعمال شود.
   عمداً generic است: هر آیتمی با question/answer قابل استفاده است،
   بدون از دست رفتن فیلدهای اضافه‌اش (مثلاً id).
═══════════════════════════════════════════════════════════ */

export interface FaqAccordionBaseItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps<T extends FaqAccordionBaseItem> {
  items: T[];
  /** پیش‌فرض: اولین آیتم باز باشد تا کارت خالی به‌نظر نرسد. null یعنی همه بسته. */
  defaultOpenIndex?: number | null;
  /** دکمه‌ی ✏️ ویرایش + فرم درون‌خطی سوال/پاسخ را فعال می‌کند. */
  editable?: boolean;
  /** دکمه‌ی 💬 گفتگو را فعال می‌کند. */
  chatEnabled?: boolean;
  /** درگ‌وdrop هر آیتم به گفتگو را فعال می‌کند. */
  draggableItems?: boolean;
  /** ایندکس آیتمی که هم‌اکنون به‌عنوان هدف گفتگو انتخاب شده (برای هایلایت). */
  selectedIndex?: number | null;
  onSelect?: (index: number, item: T) => void;
  onDragStart?: (index: number, item: T, e: React.DragEvent<HTMLDivElement>) => void;
  /** باید مقدار ذخیره‌شده (یا چیزی که سرور برگردانده) را برگرداند تا state لوکال آپدیت شود. */
  onSave?: (index: number, draft: T) => Promise<T | void> | T | void;
}

export function FaqAccordion<T extends FaqAccordionBaseItem>({
  items,
  defaultOpenIndex = 0,
  editable = false,
  chatEnabled = false,
  draggableItems = false,
  selectedIndex = null,
  onSelect,
  onDragStart,
  onSave,
}: FaqAccordionProps<T>) {
  const [localItems, setLocalItems] = useState<T[]>(items);
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<FaqAccordionBaseItem>({ question: "", answer: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // اگر آرایه‌ی items از بیرون عوض شد (مثلاً بعد از رفرش مقاله)، state لوکال هم‌گام شود.
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  if (localItems.length === 0) return null;

  const startEdit = (index: number, item: T) => {
    setEditingIndex(index);
    setDraft({ question: item.question, answer: item.answer });
    setError(null);
    setOpenIndex(index);
  };

  const save = async (index: number) => {
    if (!onSave) return;

    setSaving(true);
    setError(null);
    try {
      const current = localItems[index];
      const merged = { ...current, ...draft } as T;
      const result = await onSave(index, merged);
      const newValue = (result as T | undefined) ?? merged;

      setLocalItems((prev) => prev.map((it, i) => (i === index ? newValue : it)));
      setEditingIndex(null);
    } catch (err: any) {
      setError(err?.message || t("article.faq.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {localItems.map((item, index) => {
        const isSelected = selectedIndex === index;
        const isEditing = editingIndex === index;
        const isOpen = isEditing || openIndex === index;

        return (
          <div
            key={index}
            draggable={draggableItems && !isEditing}
            onDragStart={(e) => onDragStart?.(index, item, e)}
            className={`rounded-xl border transition-colors ${
              isSelected
                ? "border-[#5B47FB]/50 bg-[#EFEDFF]/40"
                : isOpen
                ? "border-[#E4E5F0] bg-[#FAFAFE]"
                : "border-transparent hover:bg-[#FAFAFE]"
            }`}
          >
            {/* سرِ آیتم — همیشه قابل کلیک برای باز/بسته کردن */}
            <button
              type="button"
              onClick={() => !isEditing && setOpenIndex((cur) => (cur === index ? null : index))}
              className="flex w-full items-center gap-3 px-3.5 py-3 text-start"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black transition-colors ${
                  isSelected || isOpen ? "bg-[#5B47FB] text-white" : "bg-[#F3F2FB] text-[#0D0F23]"
                }`}
              >
                {faIndex(index + 1)}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-bold text-[#0D0F23]">{item.question}</span>
              <svg
                className={`h-3.5 w-3.5 shrink-0 text-[#0D0F23]/40 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
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

            {/* بدنه‌ی باز شده */}
            {isOpen && (
              <div className="px-3.5 pb-3.5 ps-[3.1rem]">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      value={draft.question}
                      onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
                      placeholder={t("article.faq.question")}
                      className="w-full rounded-lg border border-[#E4E5F0] bg-white px-3 py-2 text-xs focus:border-[#5B47FB] focus:outline-none"
                    />
                    <textarea
                      value={draft.answer}
                      onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))}
                      rows={3}
                      placeholder={t("article.faq.answer")}
                      className="w-full rounded-lg border border-[#E4E5F0] bg-white px-3 py-2 text-xs leading-6 focus:border-[#5B47FB] focus:outline-none"
                    />
                    {error && <p className="text-[10px] font-bold text-[#B3453A]">{error}</p>}
                    <div className="flex justify-end gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setEditingIndex(null)}
                        disabled={saving}
                        className="rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#0D0F23]/60 hover:bg-[#F3F2FB]"
                      >
                        {t("common.actions.cancel")}
                      </button>
                      <button
                        type="button"
                        onClick={() => save(index)}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#5B47FB] px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#4935E0] disabled:opacity-50"
                      >
                        {saving ? <Spinner className="h-3 w-3 text-white" /> : t("article.actions.save")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-line text-xs leading-7 text-[#0D0F23]/80">{item.answer}</p>
                    {(chatEnabled || editable) && (
                      <div className="mt-2 flex items-center gap-1">
                        {chatEnabled && (
                          <button
                            type="button"
                            onClick={() => onSelect?.(index, item)}
                            className="rounded-lg px-2 py-1 text-[10px] font-bold text-[#5B47FB] hover:bg-[#EFEDFF]"
                          >
                            💬 {t("article.actions.chat")}
                          </button>
                        )}
                        {editable && (
                          <button
                            type="button"
                            onClick={() => startEdit(index, item)}
                            className="rounded-lg px-2 py-1 text-[10px] font-bold text-[#0D0F23]/60 hover:bg-[#F3F2FB]"
                          >
                            ✏️ {t("analyze.idea.editShort")}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   بخش ۲: پارسر Markdown → آرایه‌ی {question, answer}
   FinalArticleCard چون FAQ را داخل section.content به‌صورت
   Markdown (### سوال\nپاسخ) ذخیره می‌کند، به این پارسر نیاز دارد.
   اینجا export می‌شود تا هم اینجا هم آنجا از همین یک پیاده‌سازی
   استفاده شود.
═══════════════════════════════════════════════════════════ */

export interface FaqMarkdownItem {
  question: string;
  answer: string;
}

export function parseFaqMarkdown(markdown: string): FaqMarkdownItem[] {
  const normalized = `\n${(markdown ?? "").trim()}\n`;
  const headingRegex = /^###\s+(.+)$/gm;
  const matches: { question: string; start: number; end: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(normalized)) !== null) {
    matches.push({
      question: match[1].trim(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  if (matches.length === 0) return [];

  const items: FaqMarkdownItem[] = [];
  for (let i = 0; i < matches.length; i++) {
    const answerStart = matches[i].end;
    const answerEnd = i + 1 < matches.length ? matches[i + 1].start : normalized.length;
    const answer = normalized.slice(answerStart, answerEnd).trim();

    if (matches[i].question && answer) {
      items.push({ question: matches[i].question, answer });
    }
  }

  return items;
}

/* ═══════════════════════════════════════════════════════════
   بخش ۳: خودِ FaqCard — روی article.faq کار می‌کند و ذخیره‌سازی
   را از طریق articleService.updateFaq انجام می‌دهد. رندر آکاردئون
   کاملاً به FaqAccordion بالا واگذار شده است.
═══════════════════════════════════════════════════════════ */

interface FaqCardProps {
  siteId: number | string;
  article: Article;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (t: ChatTargetSelection) => void;
  onArticleChange: (article: Article) => void;
}

export const FaqCard: React.FC<FaqCardProps> = ({ siteId, article, selectedTarget, onSelectTarget, onArticleChange }) => {
  const faq = article.faq ?? [];

  if (faq.length === 0) return null;

  const handleSave = async (index: number, draft: ArticleFaqItem): Promise<ArticleFaqItem> => {
    const res = await articleService.updateFaq(siteId, article.id, index, draft);
    const target = (res as any)?.data?.target ?? (res as any)?.target;
    const newValue = (target?.value as ArticleFaqItem) ?? draft;

    onArticleChange({ ...article, faq: faq.map((f, i) => (i === index ? newValue : f)) });

    return newValue;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4E5F0] bg-white">
      {/* هدر کارت */}
      <div className="flex items-center gap-3 border-b border-[#E4E5F0] bg-gradient-to-r rtl:bg-gradient-to-l from-[#FAFAFE] to-[#EFEDFF]/40 px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFEDFF] text-base">
          ❓
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-[#0D0F23]">{t("article.faq.title")}</h3>
          <p className="text-[10px] font-bold text-[#0D0F23]/50">{t("article.faq.count", { count: faq.length })}</p>
        </div>
      </div>

      {/* لیست آکاردئونی */}
      <div className="p-2.5 sm:p-3">
        <FaqAccordion<ArticleFaqItem>
          items={faq}
          editable
          chatEnabled
          draggableItems
          selectedIndex={selectedTarget?.type === "faq" ? Number(selectedTarget.id) : null}
          onSelect={(index, item) => onSelectTarget(targetFromFaq(index, item))}
          onDragStart={(index, item, e) => {
            e.dataTransfer.setData(CHAT_DRAG_MIME, serializeDrag(targetFromFaq(index, item)));
            e.dataTransfer.effectAllowed = "copy";
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};