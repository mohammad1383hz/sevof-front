import { useState, type FormEvent } from "react";
import type { ArticleIdea } from "../../../types";
import type { ArticleIdeaUpdateRequest } from "../../../services/api";
import { ScoreRow } from "./ScoreRow";
import { t } from "../../../i18n";

const createEditForm = (idea: ArticleIdea) => ({
  title: idea.title || "",
  meta_description: idea.meta_description || "",
  hook: idea.hook || "",
  target_url: idea.internal_link?.url || "",
  target_url_title: idea.internal_link?.title || "",
  outline: (idea.outline || []).join("\n"),
  tags_input: (idea.tags || []).map((t) => t.name).join(", "),
});

type RelatedLinkDraft = { title: string; url: string };

const createRelatedLinksDraft = (idea: ArticleIdea): RelatedLinkDraft[] =>
  (idea.related_links || []).map((link) => ({ title: link.title || "", url: link.url || "" }));

export function ArticleIdeaCard({
  idea,
  onWrite,
  onEdit,
  onViewArticle,
  hasArticle = false,
  isGenerating = false,
}: {
  idea: ArticleIdea;
  onWrite: () => void;
  onEdit: (ideaId: string, payload: ArticleIdeaUpdateRequest) => Promise<boolean>;
  /** برای مقاله‌ی از قبل ساخته‌شده صدا زده می‌شود تا کاربر به همان مقاله برود. */
  onViewArticle?: () => void;
  /** اگر true باشد یعنی برای این ایده قبلاً مقاله ساخته و تمام شده (منبع: بک‌اند —
   *  idea.has_article / idea.status === "used"). دکمه به «مشاهده مقاله» تبدیل می‌شود. */
  hasArticle?: boolean;
  /** اگر true باشد یعنی تولید مقاله برای این ایده همین الان (در همین سشن) شروع شده
   *  ولی هنوز تمام نشده — دکمه غیرفعال می‌شود تا دوباره شروع نشود. */
  isGenerating?: boolean;
}) {
  const [showBreakdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [form, setForm] = useState(() => createEditForm(idea));
  const [relatedLinks, setRelatedLinks] = useState<RelatedLinkDraft[]>(() => createRelatedLinksDraft(idea));
  const isScored = idea.seo_score !== null && idea.seo_score !== undefined;
  // const hasError = !!idea.scoring_error;
  // const isPending = !isScored && !hasError;
  // const tone = isScored ? scoreTone(idea.seo_score as number) : null;
  const breakdown = idea.score_breakdown;

  const startEditing = () => {
    setForm(createEditForm(idea));
    setRelatedLinks(createRelatedLinksDraft(idea));
    setEditError(null);
    setIsEditing(true);
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateRelatedLink = (index: number, field: keyof RelatedLinkDraft, value: string) => {
    setRelatedLinks((current) =>
      current.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    );
  };

  const addRelatedLink = () => {
    setRelatedLinks((current) => [...current, { title: "", url: "" }]);
  };

  const removeRelatedLink = (index: number) => {
    setRelatedLinks((current) => current.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setEditError(null);

    const payload: ArticleIdeaUpdateRequest = {
      title: form.title.trim(),
      meta_description: form.meta_description.trim() || null,
      hook: form.hook.trim() || null,
      target_url: form.target_url.trim() || null,
      target_url_title: form.target_url_title.trim() || null,
      outline: form.outline.split("\n").map((item) => item.trim()).filter(Boolean),
      tags: form.tags_input.split(",").map((t) => t.trim()).filter(Boolean),
      related_links: relatedLinks
        .map((link) => ({ title: link.title.trim(), url: link.url.trim() }))
        .filter((link) => link.url),
    };

    const updated = await onEdit(idea.id, payload);
    setSaving(false);
    if (updated) {
      setIsEditing(false);
    } else {
      setEditError(t("analyze.idea.errors.save"));
    }
  };

  return (
    <div className="rounded-2xl border border-[#E4E5F0] bg-[#FAFAFE] p-4 hover:shadow-md transition-all duration-300">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <h3 className="text-sm font-black text-[#0D0F23] leading-6 flex-1">{idea.title}</h3>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={startEditing}
            title={t("analyze.idea.edit")}
            aria-label={t("analyze.idea.edit")}
            className="inline-flex items-center gap-1 h-7 rounded-lg border border-[#E4E5F0] px-2 text-[#0D0F23] font-bold hover:bg-[#EFEDFF] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.862 3.487a2.25 2.25 0 013.182 3.182L8.25 18.463 3.75 19.5l1.037-4.5L16.862 3.487z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 4.5l3.75 3.75" />
            </svg>
            <span className="text-[11px]">{t("analyze.idea.editShort")}</span>
          </button>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleEditSubmit} className="mb-4 rounded-2xl border border-[#E4E5F0] bg-white/60 p-4 space-y-5">
          {/* عنوان و هوک */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#0D0F23]">
              {t("analyze.idea.fields.title")}
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
                placeholder={t("analyze.idea.fields.titlePlaceholder")}
                className="mt-1.5 w-full rounded-lg border border-[#E4E5F0] bg-[#FAFAFE] px-3 py-2.5 text-xs font-semibold text-[#0D0F23] outline-none transition-colors focus:border-[#5B47FB] focus:ring-2 focus:ring-[#5B47FB]/10"
              />
            </label>

            <label className="block text-xs font-bold text-[#0D0F23]">
              {t("analyze.idea.fields.hook")}
              <input
                value={form.hook}
                onChange={(event) => updateField("hook", event.target.value)}
                placeholder={t("analyze.idea.fields.hookPlaceholder")}
                className="mt-1.5 w-full rounded-lg border border-[#E4E5F0] bg-[#FAFAFE] px-3 py-2 text-xs outline-none transition-colors focus:border-[#5B47FB] focus:ring-2 focus:ring-[#5B47FB]/10"
              />
            </label>

            <label className="block text-xs font-bold text-[#0D0F23]">
              {t("analyze.idea.fields.meta")}
              <input
                value={form.meta_description}
                onChange={(event) => updateField("meta_description", event.target.value)}
                placeholder={t("analyze.idea.fields.metaPlaceholder")}
                className="mt-1.5 w-full rounded-lg border border-[#E4E5F0] bg-[#FAFAFE] px-3 py-2 text-xs outline-none transition-colors focus:border-[#5B47FB] focus:ring-2 focus:ring-[#5B47FB]/10"
              />
            </label>
          </div>

          {/* برچسب‌ها */}
          <label className="block text-xs font-bold text-[#0D0F23]">
            {t("analyze.idea.fields.tags")} <span className="font-normal text-[#0D0F23]/50">{t("analyze.idea.fields.tagsHint")}</span>
            <input
              value={form.tags_input}
              onChange={(event) => updateField("tags_input", event.target.value)}
              placeholder={t("analyze.idea.fields.tagsPlaceholder")}
              className="mt-1.5 w-full rounded-lg border border-[#E4E5F0] bg-[#FAFAFE] px-3 py-2 text-xs outline-none transition-colors focus:border-[#5B47FB] focus:ring-2 focus:ring-[#5B47FB]/10"
            />
          </label>

          {/* لینک‌های داخلی */}
          <div className="rounded-xl border border-[#E4E5F0] bg-[#FAFAFE] p-3">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-[#4935E0]">
              🔗 {t("analyze.idea.fields.links")}
            </p>

            {/* لینک اصلی */}
            <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-[#C8C0FF] bg-[#EFEDFF] px-2.5 py-2">
              <span className="shrink-0 rounded-md bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-[#4935E0]">
                {t("dashboard.keywords.primary")}
              </span>
              <input
                value={form.target_url_title}
                onChange={(event) => updateField("target_url_title", event.target.value)}
                placeholder={t("analyze.idea.fields.linkTitle")}
                className="min-w-[120px] flex-1 rounded-md border border-[#C8C0FF] bg-[#FAFAFE] px-2 py-1.5 text-xs outline-none focus:border-[#5B47FB]"
              />
              <input
                value={form.target_url}
                onChange={(event) => updateField("target_url", event.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="min-w-[160px] flex-[1.5] rounded-md border border-[#C8C0FF] bg-[#FAFAFE] px-2 py-1.5 text-start text-xs outline-none focus:border-[#5B47FB]"
              />
            </div>

            {/* لینک‌های مرتبط */}
            {relatedLinks.map((link, index) => (
              <div
                key={index}
                className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-[#E4E5F0] bg-[#F3F2FB] px-2.5 py-2"
              >
                <span className="shrink-0 rounded-md bg-white/50 px-1.5 py-0.5 text-[10px] font-bold text-[#0D0F23]/60">
                  {t("analyze.idea.fields.related")}
                </span>
                <input
                  value={link.title}
                  onChange={(event) => updateRelatedLink(index, "title", event.target.value)}
                  placeholder={t("analyze.idea.fields.linkTitle")}
                  className="min-w-[120px] flex-1 rounded-md border border-[#E4E5F0] bg-[#FAFAFE] px-2 py-1.5 text-xs outline-none focus:border-[#5B47FB]"
                />
                <input
                  value={link.url}
                  onChange={(event) => updateRelatedLink(index, "url", event.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                  className="min-w-[160px] flex-[1.5] rounded-md border border-[#E4E5F0] bg-[#FAFAFE] px-2 py-1.5 text-start text-xs outline-none focus:border-[#5B47FB]"
                />
                <button
                  type="button"
                  onClick={() => removeRelatedLink(index)}
                  title={t("analyze.idea.fields.removeLink")}
                  aria-label={t("analyze.idea.fields.removeLink")}
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#B3453A] transition-colors hover:bg-[#F1D9D6]"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRelatedLink}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B47FB] transition-colors hover:text-[#4935E0]"
            >
              + {t("analyze.idea.fields.addLink")}
            </button>
          </div>

          {/* {t("analyze.idea.fields.outline")} */}
          <label className="block text-xs font-bold text-[#0D0F23]">
            Outline <span className="font-normal text-[#0D0F23]/50">{t("analyze.idea.fields.outlineHint")}</span>
            <textarea
              rows={4}
              value={form.outline}
              onChange={(event) => updateField("outline", event.target.value)}
              className="mt-1.5 w-full resize-y rounded-lg border border-[#E4E5F0] bg-[#FAFAFE] px-3 py-2 text-xs leading-5 outline-none transition-colors focus:border-[#5B47FB] focus:ring-2 focus:ring-[#5B47FB]/10"
            />
          </label>

          {editError && <p className="text-xs font-semibold text-[#B3453A]">{editError}</p>}

          <div className="flex items-center justify-end gap-2 border-t border-[#E4E5F0] pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="rounded-lg border border-[#E4E5F0] px-3 py-2 text-xs font-bold text-[#0D0F23] hover:bg-[#FAFAFE] disabled:opacity-50"
            >
              {t("common.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#5B47FB] px-4 py-2 text-xs font-bold text-white hover:bg-[#4935E0] disabled:opacity-50"
            >
              {saving ? t("common.status.saving") : t("analyze.idea.save")}
            </button>
          </div>
        </form>
      )}

      {idea.hook && <p className="text-xs text-[#5B47FB] font-medium leading-5 mb-2">{idea.hook}</p>}
      {idea.meta_description && <p className="text-xs text-[#0D0F23] leading-5 mb-3">{idea.meta_description}</p>}

      {/* Entity badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
          idea.entity.scope === "primary" ? "bg-[#EFEDFF] text-[#4935E0]" : "bg-[#F3F2FB] text-[#0D0F23]"
        }`}>
          {idea.entity.name}
        </span>
        {idea.entity.type && (
          <span className="text-[11px] text-[#0D0F23]/70 border border-[#E4E5F0] rounded-full px-2 py-0.5">
            {idea.entity.type}
          </span>
        )}
      </div>

     {/* Category / Tags — از taxonomy واقعیِ وردپرس سایت، توسط ArticleIdeaService::assignTaxonomy انتخاب شده */}
{(idea.category || (idea.tags && idea.tags.length > 0)) && (
  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
    {idea.category && (
      <>
        <span className="text-[11px] font-bold text-[#8A6A2F] shrink-0">{t("analyze.idea.category")}</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EDE3CF] text-[#8A6A2F] border border-[#E3D4B4]">
          📁 {idea.category.name}
        </span>
      </>
    )}
    {idea.tags?.map((tag) => (
      <span
        key={tag.id}
        className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F3F2FB] text-[#0D0F23]/70 border border-[#E4E5F0]"
      >
        #{tag.name}
      </span>
    ))}
  </div>
)}

      {/* Outline */}
      {idea.outline?.length > 0 && (
        <ul className="space-y-1 mb-3">
          {idea.outline.map((o, i) => (
            <li key={i} className="text-xs text-[#0D0F23] flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-[#E4E5F0] shrink-0" />
              {o}
            </li>
          ))}
        </ul>
      )}

      {/* Score breakdown */}
      {isScored && showBreakdown && breakdown && (
        <div className="mb-3 rounded-xl bg-[#F3F2FB] border border-[#E4E5F0] p-3 space-y-2.5">
          {breakdown.entity_relevance && <ScoreRow label={t("analyze.idea.score.entity")} data={breakdown.entity_relevance} />}
          {breakdown.search_intent && <ScoreRow label={t("analyze.idea.score.intent")} data={breakdown.search_intent} extra={breakdown.search_intent.detected_intent} />}
          {breakdown.business_value && <ScoreRow label={t("analyze.idea.score.business")} data={breakdown.business_value} />}
          {breakdown.serp_opportunity && <ScoreRow label={t("analyze.idea.score.serp")} data={breakdown.serp_opportunity} />}
          {breakdown.overall_recommendation && (
            <p className="text-xs text-[#0D0F23] leading-5 pt-1.5 border-t border-[#E4E5F0]">
              <strong className="text-[#0D0F23]">{t("analyze.idea.score.summary")} </strong>
              {breakdown.overall_recommendation}
            </p>
          )}
        </div>
      )}

      {/* Internal link */}
    {(() => {
  const allLinks = [
    ...(idea.internal_link.url
      ? [{ url: idea.internal_link.url, title: idea.internal_link.title, key: "primary" }]
      : []),
    ...(idea.related_links || []).map((link, i) => ({
      url: link.url,
      title: link.title,
      key: `${link.url}-${i}`,
    })),
  ];

  if (allLinks.length === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#8A6A2F] font-semibold bg-[#EDE3CF] rounded-lg px-2.5 py-1.5">
        {t("analyze.idea.noLinks")}
      </span>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-bold text-[#4935E0] shrink-0">🔗 {t("analyze.idea.linksLabel")}</span>
        {allLinks.map((link) => (
          <a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs text-[#4935E0] font-semibold bg-[#EFEDFF] rounded-lg px-2.5 py-1.5"
          >
            {link.title}
          </a>
        ))}
      </div>
      <p className="mt-1.5 text-[10px] font-bold text-[#8A6A2F]">
        ✨ {t("analyze.idea.linksHint")}
      </p>
    </>
  );
})()}
      {/* دکمه تولید مقاله / مشاهده مقاله */}
      <div className="mt-3 pt-3 border-t border-[#E4E5F0] flex justify-end">
        {hasArticle ? (
          <button
            type="button"
            onClick={onViewArticle}
            title={t("analyze.idea.viewArticleHint")}
            className="inline-flex items-center gap-1.5 rounded-xl text-xs font-bold px-4 py-2 transition-all duration-300 bg-[#EFEDFF] text-[#4935E0] hover:bg-[#DDD8FF] shadow-none"
          >
            {t("analyze.idea.viewArticle")}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={onWrite}
            disabled={isGenerating}
            title={isGenerating ? t("analyze.idea.generatingHint") : undefined}
            className={`inline-flex items-center gap-1.5 rounded-xl text-xs font-bold px-4 py-2 transition-all duration-300 ${
              isGenerating
                ? "bg-[#F3F2FB] text-[#9A9DB8] cursor-not-allowed shadow-none"
                : "bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#4935E0] text-white hover:from-[#6C5BFF] hover:to-[#5B47FB] shadow-md shadow-[#5B47FB]/20"
            }`}
          >
            {isGenerating ? t("analyze.ideasBar.generating") : t("dashboard.opportunities.generate")}
            {!isGenerating && (
              <svg className="w-3.5 h-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}