import { t } from "../../../i18n";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-24 px-6">
      <div className="h-16 w-16 rounded-3xl bg-gradient-to-br rtl:bg-gradient-to-bl from-[#1B6F63] to-[#14564C] flex items-center justify-center text-white mb-6 shadow-xl shadow-[#1B6F63]/25">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h2 className="text-xl font-black text-[#1E2A28] mb-2">{t("analyze.empty.title")}</h2>
      <p className="text-sm text-[#000000] leading-7 max-w-sm">
        {t("analyze.empty.body")}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {[t("layout.nav.contentSeo"), t("analyze.empty.tagEntities"), t("analyze.empty.tagIdeas")].map((tag) => (
          <span key={tag} className="text-xs font-semibold text-[#000000]/70 border border-[#DAD5C7] rounded-full px-3 py-1.5 bg-[#FBFAF6]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
