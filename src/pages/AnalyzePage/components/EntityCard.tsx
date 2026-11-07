import { useEffect } from "react";
import type { SiteEntity } from "../../../types";
import { useTypewriter } from "../hooks/useTypewriter";
import { t } from "../../../i18n";

export function EntityCard({
  entity,
  isPrimary,
  streaming = false,
  onDone,
}: {
  entity: SiteEntity;
  isPrimary: boolean;
  streaming?: boolean;
  onDone?: () => void;
}) {
  const { visible, done } = useTypewriter(entity.description || "", streaming, 4, 14);

  useEffect(() => {
    if (streaming && done) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming, done]);

  return (
    <div className={`rounded-2xl border p-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
      isPrimary
        ? "border-[#1B6F63]/25 bg-gradient-to-br rtl:bg-gradient-to-bl from-[#DCEFEA] to-[#DCEFEA]/60"
        : "border-[#DAD5C7] bg-[#FBFAF6]"
    }`}>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isPrimary && (
            <span className="inline-flex items-center rounded-full bg-[#1B6F63] text-white text-[11px] font-bold px-2.5 py-0.5">
              {t("dashboard.keywords.primary")}
            </span>
          )}
          <span className="text-sm font-black text-[#1E2A28]">{entity.name}</span>
        </div>
        <span className="text-[11px] font-semibold text-[#000000]/70 border border-[#DAD5C7] rounded-full px-2.5 py-0.5">
          {entity.type}
        </span>
      </div>

      <p className="text-xs text-[#000000] leading-5 mb-3">
        {streaming ? visible : entity.description}
        {streaming && !done && (
          <span className="inline-block w-1.5 h-3 bg-[#1B6F63]/60 animate-pulse rounded-sm align-middle ms-1" />
        )}
      </p>

      {(!streaming || done) && entity.links?.length > 0 && (
        <div className="space-y-1">
          {entity.links
            .slice()
            .sort((a, b) => b.priority - a.priority)
            .map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 text-xs bg-[#EFEDE6] hover:bg-[#DCEFEA] rounded-xl px-3 py-2 transition-colors group"
              >
                <span className="text-[#000000] group-hover:text-[#1B6F63] truncate">{link.title}</span>
                <span className="text-[#000000]/60 font-mono shrink-0">{link.priority}</span>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
