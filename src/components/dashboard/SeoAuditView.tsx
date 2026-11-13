import React from "react";
import type { RefreshNewLink, SeoAudit } from "../../services/api";
import { fa } from "./refreshLabels";
import { t } from "../../i18n";

const SEVERITY_CLS = {
  high: "bg-[#F7EEEA] text-[#B3453A]",
  medium: "bg-[#FFF4D6] text-[#8A6100]",
} as const;

const KIND_LABEL: Record<RefreshNewLink["kind"], string> = {
  get youtix() { return t("growth.audit.kindSevof"); },
  get product() { return t("growth.audit.kindProduct"); },
  get post() { return t("growth.audit.kindPost"); },
};

/** تعداد لینک داخلی در برابر مقدار پیشنهادی برای طول مقاله؛ صفر به کاربر نشان داده نمی‌شود (ایرادش جدا گفته می‌شود) */
export const InternalLinksBadge: React.FC<{ audit: SeoAudit }> = ({ audit }) => {
  if (!audit.audited || !audit.internal_links) return null;
  const enough = audit.recommended_links === null || audit.internal_links >= audit.recommended_links;
  return (
    <span className={enough ? "text-[#4935E0]" : "text-[#B3453A]"}>
      {t("growth.audit.internalLinks", { count: audit.internal_links })}{!enough && audit.recommended_links ? ` (${t("growth.audit.suggested", { count: fa(audit.recommended_links) })})` : ""}
    </span>
  );
};

/** ایرادهای سئو: compact برای ردیف فهرست (فقط برچسب)، وگرنه با توضیح کامل */
export const SeoIssueList: React.FC<{ audit: SeoAudit; compact?: boolean }> = ({ audit, compact }) => {
  if (audit.issues.length === 0) {
    return compact ? null : (
      <p className="text-xs leading-6 text-[#4935E0]">
        {audit.audited ? t("growth.audit.clean") : t("growth.audit.notAudited")}
      </p>
    );
  }

  if (compact) {
    return (
      <div className="mt-1 flex flex-wrap gap-1">
        {audit.issues.map((i) => (
          <span key={i.code} title={i.detail} className={`rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-[11px] ${SEVERITY_CLS[i.severity]}`}>
            {i.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {audit.issues.map((i) => (
        <li key={i.code} className="text-[11px] leading-5 text-[#3B3F5C]">
          <span className={`ml-1 rounded-full px-2 py-0.5 font-bold ${SEVERITY_CLS[i.severity]}`}>{i.label}</span>
          {i.detail}
        </li>
      ))}
    </ul>
  );
};

/** لینک‌های داخلی تازه‌ای که به‌روزرسانی اضافه کرده؛ کلیک روی شماره، همان تغییر را در متن نشان می‌دهد */
export const NewLinksList: React.FC<{ links: RefreshNewLink[]; onShow?: (n: number) => void }> = ({ links, onShow }) => {
  if (links.length === 0) return null;
  return (
    <div className="rounded-2xl border border-[#E4E5F0] bg-white p-4">
      <h3 className="mb-2 text-xs font-black text-[#0D0F23]">{t("growth.audit.newLinks", { count: fa(links.length) })}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={`${l.n}-${l.url}`} className="rounded-xl border border-[#E4E5F0]/70 p-2.5 text-[11px] leading-5">
            <button type="button" onClick={() => onShow?.(l.n)} className="w-full text-right" disabled={!onShow}>
              <span className="font-bold text-[#5B47FB]">«{l.anchor}»</span>
              <span className="text-[#6C7193]"> ← {l.title}</span>
            </button>
            <span className="mt-0.5 flex items-center justify-between gap-2 text-[10px] text-[#9A9DB8]">
              <span>
                {KIND_LABEL[l.kind]} · {t("growth.audit.change", { n: fa(l.n) })}
              </span>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-[#5B47FB]" dir="ltr">
                {l.url.replace(/^https?:\/\//, "")}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
