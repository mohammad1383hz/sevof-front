import { getLocale } from "../i18n";

/**
 * "€1,200.00" / "1.200,00 €" — formatted in the UI locale with the product's ISO currency.
 * Unknown/invalid currency → plain number. Zero or missing amount → null.
 */
export const formatMoney = (amount: number | null | undefined, currency?: string | null): string | null => {
  if (!amount || amount <= 0) return null;

  const code = (currency || "").trim().toUpperCase();

  if (/^[A-Z]{3}$/.test(code)) {
    try {
      return new Intl.NumberFormat(getLocale(), { style: "currency", currency: code }).format(amount);
    } catch {
      // unsupported code → fall through to a plain number
    }
  }

  return amount.toLocaleString(getLocale());
};
