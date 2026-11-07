import React, { useMemo } from "react";

function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-bold text-[#1E2A28]">{p.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}

export function MarkdownView({ text }: { text: string }) {
  const blocks = useMemo(() => {
    const lines = text.split("\n");
    const out: React.ReactNode[] = [];
    let i = 0, key = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) { i++; continue; }

      /* Headings */
      const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const level = h[1].length;
        const cls =
          level <= 2 ? "text-base font-black text-[#1E2A28] mt-5 mb-2" :
          level === 3 ? "text-sm font-black text-[#1E2A28] mt-4 mb-2 flex items-center gap-2 before:content-[''] before:w-1 before:h-4 before:rounded-full before:bg-gradient-to-b before:from-[#1B6F63] before:to-[#14564C]" :
          "text-sm font-bold text-[#1E2A28] mt-3 mb-1";
        out.push(<p key={key++} className={cls}>{renderInline(h[2])}</p>);
        i++; continue;
      }

      /* Tables */
      if (trimmed.startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i].trim()); i++;
        }
        const rows = tableLines
          .filter((l) => !/^\|[\s:\-|]+\|$/.test(l))
          .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
        if (rows.length > 0) {
          const [head, ...body] = rows;
          out.push(
            <div key={key++} className="my-3 overflow-x-auto rounded-xl border border-[#DAD5C7]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#EFEDE6]">
                    {head.map((c, ci) => (
                      <th key={ci} className="px-3 py-2.5 text-start text-xs font-bold text-[#000000] border-b border-[#DAD5C7] whitespace-nowrap">
                        {renderInline(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((r, ri) => (
                    <tr key={ri} className={ri % 2 ? "bg-[#EFEDE6]/50" : "bg-[#FBFAF6]"}>
                      {r.map((c, ci) => (
                        <td key={ci} className="px-3 py-2.5 text-[#000000] border-b border-[#DAD5C7] leading-6 align-top text-xs">
                          {renderInline(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>,
          );
        }
        continue;
      }

      /* Lists */
      if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
        const items: string[] = [];
        while (i < lines.length && (/^[-*]\s+/.test(lines[i].trim()) || /^\d+\.\s+/.test(lines[i].trim()))) {
          items.push(lines[i].trim().replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));
          i++;
        }
        out.push(
          <ul key={key++} className="my-2 space-y-1.5">
            {items.map((it, ii) => (
              <li key={ii} className="flex items-start gap-2 text-sm font-medium text-[#1E2A28] leading-6">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#1B6F63]/60 shrink-0" />
                <span>{renderInline(it)}</span>
              </li>
            ))}
          </ul>,
        );
        continue;
      }

      /* Divider */
      if (/^-{3,}$/.test(trimmed)) {
        out.push(<hr key={key++} className="my-4 border-[#DAD5C7]" />);
        i++; continue;
      }

      /* Paragraph */
      out.push(
        <p key={key++} className="text-sm font-medium text-[#1E2A28] leading-7 my-1.5">
          {renderInline(trimmed)}
        </p>,
      );
      i++;
    }
    return out;
  }, [text]);

  return <div dir="auto">{blocks}</div>;
}
