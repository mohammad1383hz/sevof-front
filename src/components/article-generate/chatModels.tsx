// src/components/article-generate/chatModels.tsx
import { t } from "../../i18n";

/** A chat model option shown in the selector. */
export interface ChatModelOption {
  /** Unique id — what is sent to the server (e.g. model: selectedModelId) */
  id: string;
  /** Display label */
  label: string;
  /** Short description under the model name (optional) */
  description?: string;
  /** Pro-only model: free users see it locked. */
  proOnly?: boolean;
  /** Highlighted as the recommended option. */
  recommended?: boolean;
}

export const DEFAULT_MODEL_ID = "sevof-mini";
export const PRO_MODEL_ID = "sevof-2-pro";

/** Text models (articles, product articles, edit chat, agent). */
export const CHAT_MODELS: ChatModelOption[] = [
  {
    id: DEFAULT_MODEL_ID,
    label: "Sevof Mini",
    get description() { return t("article.models.nano"); },
  },
  {
    id: PRO_MODEL_ID,
    label: "Sevof 2 Pro",
    get description() { return t("article.models.luna"); },
    proOnly: true,
    recommended: true,
  },
];

/** Older stored ids (e.g. the agent's content_model) → current id */
const LEGACY_MODEL_IDS: Record<string, string> = {
  "youtix-mini": DEFAULT_MODEL_ID,
  "youtix-2-pro": PRO_MODEL_ID,
  "gpt-5-nano": DEFAULT_MODEL_ID,
  "gpt-5.4-mini": PRO_MODEL_ID,
  "gpt-5.6-luna": PRO_MODEL_ID,
};

export const normalizeModelId = (id?: string | null): string => {
  const mapped = (id && LEGACY_MODEL_IDS[id]) || id;
  return CHAT_MODELS.some((m) => m.id === mapped) ? (mapped as string) : DEFAULT_MODEL_ID;
};
