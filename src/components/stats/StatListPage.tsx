import { t } from "../../i18n";
// src/components/stats/StatListPage.tsx

export interface StatColumn<T> {
  /** کلید ستون — باید با یکی از فیلدهای آیتم مطابقت داشته باشد */
  key: keyof T;
  /** عنوان ستون که در هدر جدول نمایش داده می‌شود */
  label: string;
  /** رندر سفارشی مقدار سلول (اختیاری) — اگر ندهید، مقدار خام نمایش داده می‌شود */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  /** چیدمان متن ستون — پیش‌فرض راست (چون RTL هستیم)، برای اعداد معمولاً بهتره وسط باشه */
  align?: "right" | "center" | "left";
}

interface StatListPageProps<T> {
  /** آیکون بزرگ بالای صفحه (یک کامپوننت از lucide-react) */
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  /** عنوان اصلی صفحه، مثلاً «کلمات کلیدی» */
  title: string;
  /** توضیح کوتاه زیر عنوان */
  description?: string;
  /** ستون‌های جدول */
  columns: StatColumn<T>[];
  /** ردیف‌های داده */
  rows: T[];
  /** کلید یکتای هر ردیف برای React key */
  rowKey: (row: T) => string | number;
  /** آیا در حال بارگذاری هستیم */
  loading?: boolean;
  /** پیام خالی بودن لیست */
  emptyMessage?: string;
  /** محتوای اختیاری کنار عنوان (مثلاً فیلتر یا دکمه) */
  headerActions?: React.ReactNode;
}

/**
 * صفحه‌ی عمومیِ نمایش لیست برای هرکدام از آمار Agent (کلمات کلیدی، فرصت‌ها،
 * مقالات نوشته‌شده، مقالات منتشرشده). این کامپوننت فقط بخش «محتوای صفحه» را
 * می‌سازد؛ Layout/Sidebar را خودِ صفحه‌ی فراخواننده باید دور آن بپیچد تا با
 * بقیه‌ی صفحات هم‌ساختار بماند.
 */
function StatListPage<T>({
  icon: Icon,
  title,
  description,
  columns,
  rows,
  rowKey,
  loading,
  emptyMessage = t("common.empty.nothingYet"),
  headerActions,
}: StatListPageProps<T>) {
  const alignClass = (align?: "right" | "center" | "left") =>
    align === "center" ? "text-center" : align === "left" ? "text-start" : "text-start";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* هدر صفحه */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-[#5B47FB] flex items-center justify-center text-white shadow-sm shadow-[#5B47FB]/25 shrink-0">
            <Icon size={20} strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#0D0F23]">{title}</h1>
            {description && <p className="text-xs sm:text-sm font-bold text-[#9A9DB8] mt-0.5">{description}</p>}
          </div>
        </div>
        {headerActions && <div className="shrink-0">{headerActions}</div>}
      </div>

      {/* جدول */}
      <div className="rounded-2xl border border-[#E4E5F0] bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-14">
            <div className="h-4 w-4 border-2 border-[#E4E5F0] border-t-[#5B47FB] rounded-full animate-spin" />
            <p className="text-sm font-bold text-[#9A9DB8]">{t("common.status.loading")}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14 px-4 text-center">
            <p className="text-sm font-bold text-[#9A9DB8]">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F7F7FC] border-b border-[#E4E5F0]">
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className={`px-4 py-3 font-extrabold text-xs text-[#4B5550] whitespace-nowrap ${alignClass(
                        col.align
                      )}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className="border-b border-[#F3F2FB] last:border-b-0 hover:bg-[#F7F7FC]/70 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={`px-4 py-3 font-bold text-[#0D0F23] whitespace-nowrap ${alignClass(col.align)}`}
                      >
                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatListPage;
