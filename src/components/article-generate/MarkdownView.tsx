import React, { useMemo } from "react";
import { getLocale } from "../../i18n";


const INLINE_SPLIT =
  /(`[^`]+`|\*\*[^*]+\*\*|<u>[^<]+<\/u>|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string): React.ReactNode[] {
  return text.split(INLINE_SPLIT).map((p, i) => {
    if (!p) return null;

    if (p.startsWith("`") && p.endsWith("`") && p.length > 1) {
      return (
        <code key={i} dir="ltr" className="rounded bg-[#F3F3FA] px-1.5 py-0.5 text-[0.85em] font-mono text-[#B3453A]">
          {p.slice(1, -1)}
        </code>
      );
    }

    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-[#0D0F23]">
          {p.slice(2, -2)}
        </strong>
      );
    }

    if (p.startsWith("<u>") && p.endsWith("</u>")) {
      return (
        <u key={i} className="underline decoration-[#5B47FB] underline-offset-2">
          {p.slice(3, -4)}
        </u>
      );
    }

    if ((p.startsWith("*") && p.endsWith("*") && !p.startsWith("**")) || (p.startsWith("_") && p.endsWith("_"))) {
      return (
        <em key={i} className="italic text-[#0D0F23]">
          {p.slice(1, -1)}
        </em>
      );
    }

    const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noreferrer"
          className="text-[#5B47FB] hover:text-[#4935E0] underline decoration-[#EFEDFF] underline-offset-4"
        >
          {link[1]}
        </a>
      );
    }

    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export const MarkdownView: React.FC<{ text: string }> = ({ text }) => {
  const blocks = useMemo(() => {
    const lines = text.split("\n");
    const out: React.ReactNode[] = [];
    let i = 0,
      key = 0;

    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (!trimmed) {
        i++;
        continue;
      }

      const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const level = h[1].length;
        const cls =
          level === 1
            ? "text-base sm:text-xl font-black text-[#0D0F23] mt-4 mb-2 sm:mt-6 sm:mb-3"
            : level === 2
            ? "text-sm sm:text-base font-black text-[#0D0F23] mt-4 mb-1.5 sm:mt-6 sm:mb-2 flex items-center gap-1.5 sm:gap-2 before:content-[''] before:w-1 before:h-4 sm:before:w-1.5 sm:before:h-5 before:rounded-full before:bg-gradient-to-b before:from-[#5B47FB] before:to-[#4935E0]"
            : "text-xs sm:text-sm font-black text-[#0D0F23] mt-3 mb-1.5 sm:mt-4 sm:mb-2";
        out.push(
          <p key={key++} className={cls}>
            {renderInline(h[2])}
          </p>,
        );
        i++;
        continue;
      }

      // نقل‌قول (> متن) — پشتیبانی جدید
      if (/^>\s?/.test(trimmed)) {
        const quoteLines: string[] = [];
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        out.push(
          <blockquote
            key={key++}
            className="my-2 sm:my-3 border-s-4 border-[#E4E5F0] bg-[#FAFAFE] py-2 ps-3 sm:ps-4 text-xs sm:text-sm italic text-[#494D6B] leading-6 sm:leading-7"
          >
            {quoteLines.map((ql, qi) => (
              <p key={qi}>{renderInline(ql)}</p>
            ))}
          </blockquote>,
        );
        continue;
      }

      if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
        const items: string[] = [];
        const isOrdered = /^\d+\.\s+/.test(trimmed);
        while (i < lines.length && (/^[-*]\s+/.test(lines[i].trim()) || /^\d+\.\s+/.test(lines[i].trim()))) {
          items.push(lines[i].trim().replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));
          i++;
        }
        const ListTag = isOrdered ? "ol" : "ul";
        out.push(
          <ListTag key={key++} className="my-1.5 sm:my-2 space-y-1 sm:space-y-1.5">
            {items.map((it, ii) => (
              <li key={ii} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#0D0F23] leading-6 sm:leading-7">
                {isOrdered ? (
                  <span className="mt-0.5 shrink-0 text-[#5B47FB] font-black text-[11px] sm:text-xs">
                    {(ii + 1).toLocaleString(getLocale())}.
                  </span>
                ) : (
                  <span className="mt-2 sm:mt-2.5 h-1.5 w-1.5 rounded-full bg-[#5B47FB] shrink-0" />
                )}
                <span>{renderInline(it)}</span>
              </li>
            ))}
          </ListTag>,
        );
        continue;
      }

      if (/^-{3,}$/.test(trimmed)) {
        out.push(<hr key={key++} className="my-3 sm:my-4 border-[#E4E5F0]" />);
        i++;
        continue;
      }

      out.push(
        <p key={key++} className="text-xs sm:text-sm font-medium text-[#0D0F23] leading-6 sm:leading-7 my-1.5 sm:my-2">
          {renderInline(trimmed)}
        </p>,
      );
      i++;
    }
    return out;
  }, [text]);

  return <div dir="auto">{blocks}</div>;
};