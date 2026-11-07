// src/components/product-article/ProductPickerModal.tsx
import { formatMoney } from "../../utils/priceUnit";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { productSeoIdeaService } from "../../services/api";
import { ICONS, Icon, ModalShell } from "./ModalShell";
import CategoryPicker from "./CategoryPicker";
import { getLocale, t } from "../../i18n";

export interface PickerProduct {
  id: number;
  name: string;
  price: number | null;
  /** IRR یا IRT */
  currency?: string | null;
  image: string | null;
  url?: string | null;
}

export interface PickerCategory {
  id: number;
  name: string;
  parent_id: number | null;
  path: string;
  products_count: number;
  url: string | null;
}

/** محصول را از هر دو شکل پاسخ سرور (image | images[]) به یک شکل واحد تبدیل می‌کند. */
export const toPickerProduct = (p: any): PickerProduct => ({
  id: Number(p.id),
  name: String(p.name ?? ""),
  price: p.price !== null && p.price !== undefined && p.price !== "" ? Number(p.price) : null,
  currency: p.currency ?? null,
  image: p.image ?? (Array.isArray(p.images) ? p.images[0] ?? null : null),
  url: p.url ?? null,
});

export const formatPrice = (n: number | null, currency?: string | null) => formatMoney(n, currency) ?? "—";
export const faNum = (n: number) => n.toLocaleString(getLocale());

/** برش دو خطه بدون وابستگی به نسخه‌ی Tailwind */
export const clamp2: React.CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export const ProductThumb: React.FC<{ src: string | null; className?: string }> = ({ src, className = "h-12 w-12" }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DAD5C7] bg-[#EFEDE6] text-[#9BA69F] ${className}`}
    >
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <Icon d={ICONS.bag} className="h-5 w-5" />
      )}
    </span>
  );
};

interface Props {
  siteId: string;
  /** انتخاب فعلی (شروع مودال با همین‌ها) */
  selected: PickerProduct[];
  max: number;
  title: string;
  subtitle?: string;
  confirmLabel: string;
  /** حداقل تعداد برای فعال شدن دکمه‌ی تأیید */
  minSelected?: number;
  onConfirm: (items: PickerProduct[]) => void;
  onClose: () => void;
}

const ProductPickerModal: React.FC<Props> = ({
  siteId,
  selected,
  max,
  title,
  subtitle,
  confirmLabel,
  minSelected = 1,
  onConfirm,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<PickerCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [items, setItems] = useState<PickerProduct[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<PickerProduct[]>(selected);
  const [linkUrl, setLinkUrl] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const reqRef = useRef(0);

  // جستجو با تأخیر کوتاه (کمتر درخواست به سرور)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // با باز شدن بخش لینک، مکان‌نما روی فیلد برود
  useEffect(() => {
    if (linkOpen) linkInputRef.current?.focus();
  }, [linkOpen]);

  // پیام موفقیت بعد از چند ثانیه محو شود
  useEffect(() => {
    if (linkMsg?.type !== "ok") return;
    const t = setTimeout(() => setLinkMsg(null), 6000);
    return () => clearTimeout(t);
  }, [linkMsg]);

  const closeLink = () => {
    setLinkOpen(false);
    setLinkUrl("");
    setLinkMsg(null);
  };

  // دسته‌ها برای فیلتر (یک‌بار)
  useEffect(() => {
    let alive = true;
    setCatsLoading(true);
    productSeoIdeaService
      .categories(siteId)
      .then((res: any) => {
        if (alive && res.success && res.data) setCategories(res.data.data ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setCatsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [siteId]);

  const load = useCallback(
    async (pageNo: number) => {
      const req = ++reqRef.current;
      if (pageNo === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const res: any = await productSeoIdeaService.products(siteId, {
          search: debounced || undefined,
          category_id: categoryId || undefined,
          page: pageNo,
        });
        if (req !== reqRef.current) return;

        if (!res.success || !res.data) {
          if (pageNo === 1) setItems([]);
          setError(res.message || t("product.picker.loadFailed"));
          return;
        }

        const list: PickerProduct[] = (res.data.data ?? []).map(toPickerProduct);
        setItems((prev) =>
          pageNo === 1 ? list : [...prev, ...list.filter((n) => !prev.some((p) => p.id === n.id))],
        );
        setPage(res.data.meta?.current_page ?? pageNo);
        setLastPage(res.data.meta?.last_page ?? 1);
        setTotal(res.data.meta?.total ?? list.length);
      } catch {
        if (req === reqRef.current) {
          if (pageNo === 1) setItems([]);
          setError(t("product.errors.serverShort"));
        }
      } finally {
        if (req === reqRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [siteId, debounced, categoryId],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const atMax = picked.length >= max;
  const isPicked = (id: number) => picked.some((p) => p.id === id);

  const toggle = (p: PickerProduct) =>
    setPicked((list) => {
      if (list.some((x) => x.id === p.id)) return list.filter((x) => x.id !== p.id);
      return list.length >= max ? list : [...list, p];
    });

  const remove = (id: number) => setPicked((list) => list.filter((x) => x.id !== id));

  const addByLink = async () => {
    const url = linkUrl.trim();
    if (!url || linking) return;

    setLinking(true);
    setLinkMsg(null);

    try {
      const res: any = await productSeoIdeaService.importProduct(siteId, url);

      if (!res.success || !res.data?.product) {
        setLinkMsg({ type: "err", text: res.message || t("product.picker.addFailed") });
        return;
      }

      const product = toPickerProduct(res.data.product);
      const existed = res.data.status === "existing";

      // در لیست پایین هم نشان بده (اگر نبود)
      setItems((prev) => (prev.some((p) => p.id === product.id) ? prev : [product, ...prev]));

      if (!existed) {
        setTotal((t) => t + 1);
        // دسته‌ی محصول ممکن است تازه ساخته شده باشد
        productSeoIdeaService
          .categories(siteId)
          .then((r: any) => {
            if (r.success && r.data) setCategories(r.data.data ?? []);
          })
          .catch(() => {});
      }

      if (picked.some((p) => p.id === product.id)) {
        setLinkMsg({ type: "ok", text: t("product.picker.alreadySelected") });
      } else if (picked.length >= max) {
        setLinkMsg({
          type: "err",
          text: t("product.picker.addedAtLimit"),
        });
      } else {
        setPicked((list) => (list.some((x) => x.id === product.id) ? list : [...list, product]));
        setLinkMsg({
          type: "ok",
          text: existed
            ? t("product.picker.existingSelected")
            : t("product.picker.addedSelected"),
        });
      }

      setLinkUrl("");
      // بعد از موفقیت، بخش لینک جمع می‌شود و فقط پیام کوتاه می‌ماند
      setLinkOpen(false);
    } catch {
      setLinkMsg({ type: "err", text: t("product.errors.serverShort") });
    } finally {
      setLinking(false);
    }
  };

  const toolbar = (
    <>
      <div>
        {!linkOpen ? (
          <button
            type="button"
            onClick={() => {
              setLinkMsg(null);
              setLinkOpen(true);
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#1B6F63]/40 bg-[#F3F8F6] px-3 py-2.5 text-start transition hover:border-[#1B6F63] hover:bg-[#DCEFEA]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B6F63]"
          >
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DCEFEA] text-[#14564C]"
            >
              <Icon d="M12 5v14M5 12h14" className="h-4 w-4" stroke={2.4} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-black text-[#14564C]">{t("product.picker.manualTitle")}</span>
              <span className="mt-0.5 block text-[11px] leading-5 text-[#65716B]">
                {t("product.picker.manualHint")}
              </span>
            </span>
          </button>
        ) : (
          <div className="rounded-2xl border border-[#1B6F63]/30 bg-[#F3F8F6] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-black text-[#14564C]">{t("product.picker.manualTitle")}</p>
                <p className="mt-0.5 text-[11px] leading-5 text-[#65716B]">
                  {t("product.picker.manualBody")}
                </p>
              </div>
              <button
                type="button"
                onClick={closeLink}
                disabled={linking}
                aria-label={t("product.picker.closeManual")}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#65716B] transition hover:bg-white disabled:opacity-50"
              >
                <Icon d={ICONS.x} className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 flex gap-2">
              <input
                ref={linkInputRef}
                type="text"
                dir="ltr"
                inputMode="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    addByLink();
                  } else if (e.key === "Escape" && !linking) {
                    e.stopPropagation();
                    closeLink();
                  }
                }}
                disabled={linking}
                aria-label={t("product.picker.url")}
                placeholder="https://example.com/product/…"
                className="h-11 min-w-0 flex-1 rounded-2xl border border-[#DAD5C7] bg-white px-4 text-base text-[#17231E] outline-none transition placeholder:text-[#9BA69F] focus:border-[#1B6F63]/60 focus:ring-4 focus:ring-[#1B6F63]/10 disabled:opacity-60 sm:text-sm"
              />
              <button
                type="button"
                onClick={addByLink}
                disabled={linking || !linkUrl.trim()}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#1B6F63] to-[#14564C] px-4 text-xs font-black text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {linking && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {t("product.picker.add")}
              </button>
            </div>
          </div>
        )}
        {linkMsg && (
          <p
            role={linkMsg.type === "err" ? "alert" : "status"}
            className={`mt-1.5 px-1 text-[11px] leading-5 ${linkMsg.type === "err" ? "text-[#B3453A]" : "text-[#14564C]"}`}
          >
            {linkMsg.text}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_15rem]">
        <label className="relative block">
          <span className="sr-only">{t("product.picker.search")}</span>
          <Icon
            d={ICONS.search}
            className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9BA69F]"
          />
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("product.picker.searchPlaceholder")}
            className="h-11 w-full rounded-2xl border border-[#DAD5C7] bg-white pe-10 ps-10 text-base text-[#17231E] outline-none transition placeholder:text-[#9BA69F] focus:border-[#1B6F63]/60 focus:ring-4 focus:ring-[#1B6F63]/10 sm:text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={t("product.clearSearch")}
              className="absolute end-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#65716B] hover:bg-[#EFEDE6]"
            >
              <Icon d={ICONS.x} className="h-4 w-4" />
            </button>
          )}
        </label>

        <CategoryPicker
          mode="filter"
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
          loading={catsLoading}
        />
      </div>

      {picked.length > 0 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label={t("product.picker.selected")}>
          {picked.map((p) => (
            <span
              key={p.id}
              className="inline-flex max-w-[12rem] shrink-0 items-center gap-1 rounded-full bg-[#DCEFEA] py-1 pe-1.5 ps-3 text-[11px] font-bold text-[#14564C]"
            >
              <span className="truncate">{p.name}</span>
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label={t("product.editIdea.removeProduct", { name: p.name })}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full hover:bg-white/70"
              >
                <Icon d={ICONS.x} className="h-3 w-3" stroke={2.2} />
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-bold text-[#384B43]" aria-live="polite">
        {t("product.picker.count", { count: picked.length, max })}
        {atMax && <span className="ms-1 font-normal text-[#B3453A]">({t("product.picker.limit")})</span>}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        {picked.length > 0 && (
          <button
            type="button"
            onClick={() => setPicked([])}
            className="h-11 rounded-2xl px-3 text-xs font-bold text-[#65716B] transition hover:bg-[#EFEDE6]"
          >
            {t("product.picker.clear")}
          </button>
        )}
        <button
          type="button"
          onClick={() => onConfirm(picked)}
          disabled={picked.length < minSelected}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#1B6F63] to-[#14564C] px-5 text-sm font-black text-white shadow-lg shadow-[#1B6F63]/20 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );

  return (
    <ModalShell title={title} subtitle={subtitle} onClose={onClose} toolbar={toolbar} footer={footer} tall>
      {loading ? (
        <ul className="space-y-2" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li key={i} className="h-[4.5rem] animate-pulse rounded-2xl border border-[#DAD5C7] bg-[#EFEDE6]" />
          ))}
        </ul>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-[#E3C4BC] bg-[#F7EEEA] px-4 py-4 text-center text-sm text-[#B3453A]">
          <p className="leading-7">{error}</p>
          <button
            type="button"
            onClick={() => load(1)}
            className="mt-2 h-10 rounded-xl bg-white px-4 text-xs font-bold text-[#1E2A28] shadow-sm"
          >
            {t("billing.payment.tryAgain")}
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center">
          <Icon d={ICONS.search} className="mx-auto h-9 w-9 text-[#9BA69F]" />
          <p className="mt-3 text-sm font-bold text-[#1E2A28]">{t("product.picker.empty")}</p>
          <p className="mt-1 text-xs leading-6 text-[#65716B]">{t("product.picker.emptyHint")}</p>
        </div>
      ) : (
        <>
          <p className="mb-2 text-[11px] text-[#65716B]">{faNum(total)} products</p>
          <ul className="space-y-2">
            {items.map((p) => {
              const on = isPicked(p.id);
              const blocked = !on && atMax;

              return (
                <li key={p.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    disabled={blocked}
                    onClick={() => toggle(p)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-start transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B6F63] ${
                      on
                        ? "border-[#1B6F63] bg-[#DCEFEA]/60 ring-1 ring-[#1B6F63]/30"
                        : "border-[#DAD5C7] bg-white hover:border-[#1B6F63]/40 hover:bg-[#FBFAF6]"
                    } ${blocked ? "cursor-not-allowed opacity-45" : ""}`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        on ? "border-[#1B6F63] bg-[#1B6F63] text-white" : "border-[#C9C3B2] bg-white text-transparent"
                      }`}
                    >
                      <Icon d={ICONS.check} className="h-3.5 w-3.5" stroke={3} />
                    </span>
                    <ProductThumb src={p.image} className="h-14 w-14" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold leading-6 text-[#1E2A28]" style={clamp2}>
                        {p.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[#65716B]">{formatPrice(p.price, p.currency)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {page < lastPage && (
            <button
              type="button"
              onClick={() => load(page + 1)}
              disabled={loadingMore}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#DAD5C7] bg-white text-xs font-bold text-[#1E2A28] transition hover:bg-[#EFEDE6] disabled:opacity-60"
            >
              {loadingMore && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B6F63]/30 border-t-[#1B6F63]" />
              )}
              {t("product.picker.more")}
            </button>
          )}
        </>
      )}
    </ModalShell>
  );
};

export default ProductPickerModal;