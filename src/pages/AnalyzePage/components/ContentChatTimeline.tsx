import type { ContentChatEntityOption } from "./ContentChatBar";

import { Fragment, type ReactNode } from "react";
import { t } from "../../../i18n";
import { tx } from "../../../i18n/rich";

export type ContentConversationMessage = {
  id: string;
  role: "user" | "assistant";
  kind: "request" | "entity_request" | "confirmation" | "error" | "article_request" | "article" | "research";
  message: string;
  label?: string;
  entity?: ContentChatEntityOption | null;
  options?: ContentChatEntityOption[];
  /** وقتی true باشد یعنی به این entity_request قبلاً پاسخ داده شده و کارت‌ها باید غیرفعال (اما قابل مشاهده) بمانند */
  answered?: boolean;
  batch?: number;
  researchId?: string;
  articleId?: string;
  ideaId?: string;
  /** درخواست کاربر هنوز در حال پردازش است و باید loading داخل همان حباب نمایش داده شود */
  pending?: boolean;
};

export function ContentChatTimeline({
  messages,
  selectedEntity,
  onEntitySelect,
  renderAfterMessage,
}: {
  messages: ContentConversationMessage[];
  selectedEntity: ContentChatEntityOption | null;
  onEntitySelect: (entity: ContentChatEntityOption) => void;
  renderAfterMessage?: (message: ContentConversationMessage) => ReactNode;
  domain: string;
}) {
  return (
    <div className="space-y-1">
      {messages.map((message) => (
        <Fragment key={message.id}>
          <ConversationMessage
            message={message}
            selectedEntity={selectedEntity}
            onEntitySelect={onEntitySelect}
          />
          {renderAfterMessage?.(message)}
        </Fragment>
      ))}
    </div>
  );
}

function ConversationMessage({
  message,
  selectedEntity,
  onEntitySelect,
}: {
  message: ContentConversationMessage;
  selectedEntity: ContentChatEntityOption | null;
  onEntitySelect: (entity: ContentChatEntityOption) => void;
}) {
  if (message.role === "user") {
    return (
      <div
        id={`chat-msg-${message.id}`}
        data-chat-message="true"
        className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <div className="max-w-2xl">
          <div className="rounded-3xl rounded-se-lg bg-gradient-to-br rtl:bg-gradient-to-bl from-[#5B47FB] to-[#4935E0] px-5 py-4 text-white shadow-lg shadow-[#5B47FB]/20">
            <div className="flex items-center gap-2">
              <UserIcon />
              <span className="text-xs font-bold text-[#EFEDFF]">{message.label || t("analyze.chat.yourRequest")}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{message.message}</p>
            {message.pending && (
              <div
                role="status"
                aria-live="polite"
                className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-[#E9F6F2]"
              >
                <span className="inline-flex items-center gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#EFEDFF] [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#EFEDFF] [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#EFEDFF]" />
                </span>
                <span>{t("analyze.chat.preparingIdeas")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isError = message.kind === "error";
  const isArticle = message.kind === "article" || message.kind === "article_request";
  const isSelection = message.kind === "entity_request";
  const disabled = Boolean(message.answered);

  return (
    <div
      id={`chat-msg-${message.id}`}
      data-chat-message="true"
      data-entity-request={isSelection && !disabled ? "true" : undefined}
      className="scroll-mt-4 mb-5 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br rtl:bg-gradient-to-bl from-[#5B47FB] to-[#4935E0] text-white shadow-md shadow-[#5B47FB]/20">
        <AssistantIcon />
      </div>
      <div className={`min-w-0 max-w-3xl flex-1 overflow-hidden rounded-3xl rounded-ss-lg border shadow-sm ${isError ? "border-[#E3C4BC] bg-[#F7EEEA]" : isArticle ? "border-[#C8C0FF] bg-gradient-to-br rtl:bg-gradient-to-bl from-[#F7FCFA] to-[#E8F4F0]" : "border-[#E4E5F0]/80 bg-[#FAFAFE]"}`}>
        <div className="border-b border-[#E4E5F0]/70 px-5 py-3">
          <p className={`text-xs font-black ${isError ? "text-[#B3453A]" : isArticle ? "text-[#5B47FB]" : "text-[#4935E0]"}`}>{isArticle ? t("analyze.chat.articleHeader") : t("analyze.chat.assistant")}</p>
        </div>
        <div className="p-5">
          <p className={`whitespace-pre-wrap text-sm leading-7 ${isError ? "text-[#8C332B]" : "text-[#3B3F5C]"}`}>{message.message}</p>

          {isSelection && message.options && message.options.length > 0 && (
            <div className={`mt-4 grid gap-2.5 sm:grid-cols-2 ${disabled ? "opacity-60" : ""}`}>
              {message.options.map((option) => {
                const active = selectedEntity?.name === option.name && selectedEntity?.scope === option.scope;

                return (
                  <button
                    key={`${option.scope}:${option.name}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && onEntitySelect(option)}
                    aria-pressed={active}
                    className={`text-start rounded-2xl border px-4 py-3 transition-all ${disabled ? "cursor-not-allowed" : ""} ${
                      active
                        ? "border-[#5B47FB] bg-[#EFEDFF] text-[#4935E0] shadow-md shadow-[#5B47FB]/10"
                        : "border-[#E4E5F0] bg-white text-[#3B3F5C] hover:border-[#5B47FB]/70 hover:bg-[#F7F6FF]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-black">{option.name}</span>
                      {active && (
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#5B47FB] bg-[#5B47FB] text-[11px] text-white">✓</span>
                      )}
                    </div>
                    {option.description && (
                      <p className="mt-1 line-clamp-1 text-xs leading-5 text-[#7D819F]">{option.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {message.kind === "confirmation" && message.entity && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#C8C0FF] bg-[#F5F4FF] px-3 py-2">
              <CheckIcon />
              <p className="text-xs font-bold text-[#4935E0]">
                {tx("analyze.chat.selectedEntity", { name: <span className="font-black text-[#5B47FB]">{message.entity.name}</span> })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return <svg className="h-4 w-4 shrink-0 text-[#EFEDFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" /></svg>;
}

function AssistantIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3.75l1.55 4.7a2.7 2.7 0 001.7 1.7l4.7 1.55-4.7 1.55a2.7 2.7 0 00-1.7 1.7L12 19.65l-1.55-4.7a2.7 2.7 0 00-1.7-1.7l-4.7-1.55 4.7-1.55a2.7 2.7 0 001.7-1.7L12 3.75z" /></svg>;
}

function CheckIcon() {
  return <svg className="h-4 w-4 shrink-0 text-[#5B47FB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12.75l4.25 4.25L19 7.25" /></svg>;
}