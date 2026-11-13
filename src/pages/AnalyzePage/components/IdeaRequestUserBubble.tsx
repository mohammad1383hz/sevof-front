import { t } from "../../../i18n";

export function IdeaRequestUserBubble({
  domain,
  message,
  label,
}: {
  domain: string;
  message?: string;
  label?: string;
}) {
  const isChatRequest = Boolean(message);

  return (
    <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-xl">
        <div className="bg-gradient-to-br rtl:bg-gradient-to-bl from-[#5B47FB] to-[#9B5CFF] text-white rounded-3xl rounded-se-lg px-5 py-3 shadow-lg shadow-[#5B47FB]/20">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#EFEDFF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 5.969 5.969 0 002.328-.256c.19-.06.4-.036.586.045A9.06 9.06 0 0012 20.25z" />
            </svg>
            {isChatRequest ? (
              <span className="text-xs font-bold text-[#EFEDFF]">{label || t("analyze.request.title")}</span>
            ) : (
              <span dir="ltr" className="font-bold text-sm">{domain}</span>
            )}
          </div>

          {isChatRequest ? (
            <p className="text-sm leading-6 mt-2 whitespace-pre-wrap">{message}</p>
          ) : (
            <p className="text-xs text-[#EFEDFF] mt-1">{t("analyze.request.body")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
