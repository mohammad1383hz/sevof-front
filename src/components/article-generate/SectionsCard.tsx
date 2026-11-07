import React, { useState } from "react";
import { articleService } from "../../services/api";
import type { Article, ArticleSection } from "../../types";
import { SECTION_TYPE_LABELS } from "./constants";
import { MarkdownView } from "./MarkdownView";
import { Spinner, SectionStatusBadge } from "./UiBits";



import { CHAT_DRAG_MIME, serializeDrag, targetFromSection } from "./chatTarget";
import type { ChatTargetSelection } from "./chatTarget";
import { t, getLocale } from "../../i18n";
interface SectionsCardProps {
  siteId: number | string;
  article: Article;
  onRegenerate: (section: ArticleSection) => void;
  regeneratingId: string | null;
  selectedTarget: ChatTargetSelection | null;
  onSelectTarget: (t: ChatTargetSelection) => void;
  onArticleChange: (article: Article) => void;
}

export const SectionsCard: React.FC<SectionsCardProps> = ({
  siteId,
  article,
  onRegenerate,
  regeneratingId,
  selectedTarget,
  onSelectTarget,
  onArticleChange,
}) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ heading: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const outlineLoading = article.status === "generating_outline";
  const sections = article.sections ?? [];
  const done = sections.filter((s) => s.status === "generated").length;
  const total = sections.length;

  const generatingId =
    article.status === "generating_sections"
      ? sections.find((s) => s.status === "pending")?.id ?? null
      : null;

  const canRegenerate = article.status === "completed" || article.status === "failed";
  const canEdit = (s: ArticleSection) => !!s.content && s.status !== "pending";

  const startEdit = (section: ArticleSection) => {
    setEditingId(section.id);
    setDraft({ heading: section.heading, content: section.content ?? "" });
    setSaveError(null);
    setOpenId(section.id);
  };

  const saveEdit = async (section: ArticleSection) => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await articleService.updateSection(siteId, article.id, section.id, {
        heading: draft.heading,
        content: draft.content,
      });
      const target = (res as any)?.data?.target ?? (res as any)?.target;
      const newHeading = target?.label ?? draft.heading;
      const newContent = (target?.value as string) ?? draft.content;

      onArticleChange({
        ...article,
        sections: article.sections.map((s) => (s.id === section.id ? { ...s, heading: newHeading, content: newContent } : s)),
      });
      setEditingId(null);
    } catch (err: any) {
      setSaveError(err?.message || t("analyze.idea.errors.save"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-black text-slate-900">📝 {t("article.sections.title")}</h3>
        {total > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-500">
              {t("article.sections.progress", { done, total })}
            </span>
            <div className="h-1.5 w-32 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r rtl:bg-gradient-to-l from-blue-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${total ? (done / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {total === 0 ? (
        <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
          {outlineLoading && <Spinner />}
          {outlineLoading ? t("article.sections.designing") : t("article.sections.none")}
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((section) => {
            const isOpen = openId === section.id;
            const isEditing = editingId === section.id;
            const isGeneratingThis = generatingId === section.id || regeneratingId === section.id;
            const isSelected = selectedTarget?.type === "section" && selectedTarget.id === section.id;

            return (
              <div
                key={section.id}
                draggable={canEdit(section) && !isEditing}
                onDragStart={(e) => {
                  e.dataTransfer.setData(CHAT_DRAG_MIME, serializeDrag(targetFromSection(section)));
                  e.dataTransfer.effectAllowed = "copy";
                }}
                className={`rounded-xl border transition-colors ${
                  isSelected || isGeneratingThis
                    ? "border-blue-300 bg-blue-50/40"
                    : section.status === "failed"
                    ? "border-rose-200 bg-rose-50/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="w-full flex items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => section.content && setOpenId(isOpen ? null : section.id)}
                    className="flex flex-1 items-center gap-3 text-start min-w-0"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-black text-slate-500 shrink-0">
                      {(section.position + 1).toLocaleString(getLocale())}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 truncate">{section.heading}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {SECTION_TYPE_LABELS[section.type] ?? section.type} · ~{t("article.words", { count: section.target_words })}
                      </div>
                    </div>
                  </button>

                  {isGeneratingThis ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 shrink-0">
                      <Spinner className="h-3.5 w-3.5" /> {t("analyze.ideasBar.generating")}
                    </span>
                  ) : (
                    <>
                      {canEdit(section) && (
                        <button
                          type="button"
                          onClick={() => onSelectTarget(targetFromSection(section))}
                          className="rounded-lg px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 shrink-0"
                        >
                          💬 {t("article.actions.chat")}
                        </button>
                      )}
                      <SectionStatusBadge status={section.status} />
                    </>
                  )}

                  {section.content && (
                    <button type="button" onClick={() => setOpenId(isOpen ? null : section.id)}>
                      <svg className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                {section.status === "failed" && section.error_message && (
                  <p className="px-4 pb-2 text-[11px] text-rose-500 leading-5">{section.error_message}</p>
                )}

                {isOpen && section.content && (
                  <div className="border-t border-slate-100 px-4 py-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          value={draft.heading}
                          onChange={(e) => setDraft((d) => ({ ...d, heading: e.target.value }))}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold focus:border-blue-400 focus:outline-none"
                        />
                        <textarea
                          value={draft.content}
                          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                          rows={10}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs leading-6 font-mono focus:border-blue-400 focus:outline-none"
                        />
                        {saveError && <p className="text-[10px] font-bold text-rose-500">{saveError}</p>}
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setEditingId(null)} disabled={saving} className="rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-100">
                            {t("common.actions.cancel")}
                          </button>
                          <button type="button" onClick={() => saveEdit(section)} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 disabled:opacity-50">
                            {saving ? <Spinner className="h-3 w-3" /> : t("article.actions.save")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <MarkdownView text={section.content} />
                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(section)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                          >
                            ✏️ {t("article.sections.editManually")}
                          </button>
                          {canRegenerate && (
                            <button
                              type="button"
                              disabled={regeneratingId !== null}
                              onClick={() => onRegenerate(section)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50"
                            >
                               {t("article.sections.regenerate")}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};