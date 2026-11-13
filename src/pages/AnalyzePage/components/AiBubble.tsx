
/** بابل سمت چپ — پاسخ هوش مصنوعی */
export function AiBubble({
  children,
  icon,
  title,
  noPadding,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title?: string;
  noPadding?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Avatar */}
      <div className="h-9 w-9 rounded-2xl bg-gradient-to-br rtl:bg-gradient-to-bl from-[#5B47FB] to-[#9B5CFF] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#5B47FB]/20 md:me-auto">
        {icon}
      </div>
      {/* Bubble */}
      <div className="w-full max-w-lg md:max-w-none bg-[#FAFAFE] rounded-3xl border border-[#E4E5F0]/80 shadow-sm overflow-hidden">
        {title && (
          <div className="px-5 pt-4 pb-2 border-b border-[#E4E5F0]">
            <p className="text-xs font-bold text-[#0D0F23]/70 uppercase tracking-wider">{title}</p>
          </div>
        )}
        <div className={noPadding ? "" : "p-5"}>
          {children}
        </div>
      </div>
    </div>
  );
}
