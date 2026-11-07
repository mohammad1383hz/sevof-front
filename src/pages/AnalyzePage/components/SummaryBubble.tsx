import { AiBubble } from "./AiBubble";
import { MarkdownView } from "./MarkdownView";
import { t } from "../../../i18n";

/** نمایش خلاصه تحلیل */
export function SummaryBubble({
  text,
  streaming,
  streamedText,
  niche,
  siteUrl,
}: {
  text: string;
  streaming: boolean;
  streamedText: string;
  niche: string | null;
  siteUrl: string;
}) {
  return (
    <AiBubble
      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      title={t("analyze.summary.title")}
    >
      {/* Niche badge */}
      {niche && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#EDE3CF] text-[#8A6A2F] border border-[#EDE3CF] px-3 py-1.5 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
            </svg>
            {t("analyze.summary.industry", { niche })}
          </span>
          <a href={siteUrl} target="_blank" rel="noreferrer"
            dir="ltr"
            className="inline-flex items-center gap-1 text-xs text-[#1B6F63] hover:underline">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            {siteUrl}
          </a>
        </div>
      )}

      {/* Summary markdown */}
      <MarkdownView text={streaming ? streamedText : text} />
      {streaming && (
        <span className="inline-block w-2 h-4 bg-[#1B6F63] animate-pulse rounded-sm align-middle ms-1" />
      )}
    </AiBubble>
  );
}
