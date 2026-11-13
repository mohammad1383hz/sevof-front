import { t } from "../../../i18n";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-24 px-6">
      <div className="h-16 w-16 rounded-[20px] bg-sv-gradient flex items-center justify-center text-white mb-6 shadow-sv-cta ring-8 ring-[#5B47FB]/[0.07]">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0D0F23] mb-3">{t("analyze.empty.title")}</h2>
      <p className="text-sm sm:text-[15px] text-[#6C7193] font-medium leading-7 max-w-md">
        {t("analyze.empty.body")}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {[t("layout.nav.contentSeo"), t("analyze.empty.tagEntities"), t("analyze.empty.tagIdeas")].map((tag) => (
          <span key={tag} className="text-xs font-bold text-[#3B3F5C] border border-[#E4E5F0] rounded-full px-3.5 py-1.5 bg-white shadow-sv">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
