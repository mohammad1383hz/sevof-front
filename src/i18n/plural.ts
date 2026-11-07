// src/i18n/plural.ts
// Plural entries: `one` and `other` are required; languages with richer plural rules
// (e.g. Arabic) can add `zero`, `two`, `few` and `many` — chosen with Intl.PluralRules.

export type PluralForm = "zero" | "one" | "two" | "few" | "many" | "other";
export type Plural = { one: string; other: string } & Partial<Record<Exclude<PluralForm, "one" | "other">, string>>;

export const PLURAL_FORMS: PluralForm[] = ["zero", "one", "two", "few", "many", "other"];

/** Marks an object as a plural entry so every locale may supply the forms its grammar needs. */
export const plural = (forms: Plural): Plural => forms;
