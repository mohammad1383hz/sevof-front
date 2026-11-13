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
        ? "border-[#5B47FB]/25 bg-gradient-to-br rtl:bg-gradient-to-bl from-[#EFEDFF] to-[#EFEDFF]/60"
        : "border-[#E4E5F0] bg-[#FAFAFE]"
    }`}>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isPrimary && (
            <span className="inline-flex items-center rounded-full bg-[#5B47FB] text-white text-[11px] font-bold px-2.5 py-0.5">
              {t("dashboard.keywords.primary")}
            </span>
          )}
          <span className="text-sm font-black text-[#0D0F23]">{entity.name}</span>
        </div>
        <span className="text-[11px] font-semibold text-[#0D0F23]/70 border border-[#E4E5F0] rounded-full px-2.5 py-0.5">
          {entity.type}
        </span>
      </div>

      <p className="text-xs text-[#0D0F23] leading-5 mb-3">
        {streaming ? visible : entity.description}
        {streaming && !done && (
          <span className="inline-block w-1.5 h-3 bg-[#5B47FB]/60 animate-pulse rounded-sm align-middle ms-1" />
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
                className="flex items-center justify-between gap-2 text-xs bg-[#F3F2FB] hover:bg-[#EFEDFF] rounded-xl px-3 py-2 transition-colors group"
              >
                <span className="text-[#0D0F23] group-hover:text-[#5B47FB] truncate">{link.title}</span>
                <span className="text-[#0D0F23]/60 font-mono shrink-0">{link.priority}</span>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
