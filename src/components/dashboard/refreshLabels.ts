import type { RefreshReason, RefreshStatus } from "../../services/api";
import { t, formatNumber } from "../../i18n";

/** Shared "article update" texts for the automation dashboard and the past-articles page. */

/** Object whose values are translated on every read (labels follow the active UI language). */
const translated = <K extends string>(prefix: string, keys: readonly K[]): Record<K, string> => {
  const out = {} as Record<K, string>;
  for (const key of keys) Object.defineProperty(out, key, { enumerable: true, get: () => t(`${prefix}.${key}`) });
  return out;
};

const REASONS = ["near_first_page", "declining", "low_ctr", "manual"] as const;

export const REASON_LABEL: Record<RefreshReason, string> = translated("growth.reason", REASONS);

export const REASON_HINT: Record<RefreshReason, string> = translated("growth.reasonHint", REASONS);

const STATUS_CLS: Record<RefreshStatus, string> = {
  queued: "bg-[#EFEDE6] text-[#384B43]",
  generating: "bg-[#EFEDE6] text-[#384B43]",
  ready: "bg-[#FFF4D6] text-[#8A6100]",
  applying: "bg-[#EFEDE6] text-[#384B43]",
  applied: "bg-[#DCEFEA] text-[#14564C]",
  reverted: "bg-[#EFEDE6] text-[#6B7A73]",
  discarded: "bg-[#EFEDE6] text-[#9BA69F]",
  failed: "bg-[#F7EEEA] text-[#B3453A]",
};

export const STATUS_LABEL: Record<RefreshStatus, { text: string; cls: string }> = Object.fromEntries(
  (Object.keys(STATUS_CLS) as RefreshStatus[]).map((status) => [
    status,
    { get text() { return t(`growth.status.${status}`); }, cls: STATUS_CLS[status] },
  ]),
) as Record<RefreshStatus, { text: string; cls: string }>;

export const BUSY_STATUSES: RefreshStatus[] = ["queued", "generating", "applying"];

/** Locale-aware number (name kept from the original Persian helper). */
export const fa = (n: number) => formatNumber(n);
export const faPos = (p: number | null) => (p == null ? "—" : formatNumber(p, { maximumFractionDigits: 1 }));
