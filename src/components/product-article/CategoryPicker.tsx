// src/components/product-article/CategoryPicker.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ICONS, Icon } from "./ModalShell";
import type { PickerCategory } from "./ProductPickerModal";
import { getLocale, t } from "../../i18n";

const toFa = (n: number) => n.toLocaleString(getLocale());

const ICON_CHEVRON_DOWN = "M19.5 8.25l-7.5 7.5-7.5-7.5";
const ICON_CHEVRON_LEFT = "M15.75 19.5L8.25 12l7.5-7.5";

/** یکسان‌سازی برای جستجو: ی/ک عربی، نیم‌فاصله، حروف بزرگ و کوچک */
const norm = (s: string) =>
  s
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\s]+/g, " ")
    .trim()
    .toLowerCase();

/** متن‌ها و رفتار هر حالت */
const MODES = {
  filter: {
    get prefix() { return t("product.category.filterPrefix"); },
    get allLabel() { return t("product.category.all"); },
    hideEmpty: true,
    showAllCount: true,
    get note() { return t("product.category.filterNote"); },
  },
  link: {
    get prefix() { return t("product.category.linkPrefix"); },
    get allLabel() { return t("product.category.home"); },
    hideEmpty: false,
    showAllCount: false,
    get note() { return t("product.category.linkNote"); },
  },
} as const;

interface TreeNode {
  cat: PickerCategory;
  /** تعداد محصول موجود این دسته + همه‌ی زیردسته‌هایش */
  total: number;
  children: TreeNode[];
}

interface Row {
  id: number | "";
  node: TreeNode | null;
  depth: number;
}

interface Layout {
  mobile: boolean;
  top?: number;
  left?: number;
  width?: number;
  maxHeight?: number;
}

const byTotalThenName = (a: TreeNode, b: TreeNode) =>
  b.total - a.total || a.cat.name.localeCompare(b.cat.name, getLocale());

/** درخت دسته‌ها. با hideEmpty، دسته‌ی بدون محصول موجود (خودش و زیردسته‌هایش) حذف می‌شود. */
function buildTree(categories: PickerCategory[], hideEmpty: boolean): TreeNode[] {
  const ids = new Set(categories.map((c) => c.id));
  const kids = new Map<number | null, PickerCategory[]>();

  for (const c of categories) {
    const key = c.parent_id !== null && c.parent_id !== c.id && ids.has(c.parent_id) ? c.parent_id : null;
    const list = kids.get(key);
    if (list) list.push(c);
    else kids.set(key, [c]);
  }

  const seen = new Set<number>(); // محافظ در برابر حلقه در داده

  const make = (c: PickerCategory): TreeNode | null => {
    if (seen.has(c.id)) return null;
    seen.add(c.id);

    const children = (kids.get(c.id) ?? []).map(make).filter((n): n is TreeNode => n !== null);
    const total = c.products_count + children.reduce((sum, n) => sum + n.total, 0);

    if (hideEmpty && total <= 0) return null;

    children.sort(byTotalThenName);
    return { cat: c, total, children };
  };

  const roots = (kids.get(null) ?? []).map(make).filter((n): n is TreeNode => n !== null);
  roots.sort(byTotalThenName);

  return roots;
}

function collectAll(nodes: TreeNode[], out: TreeNode[] = []): TreeNode[] {
  for (const n of nodes) {
    out.push(n);
    collectAll(n.children, out);
  }
  return out;
}

const parentPathOf = (path: string) => (path.includes(" › ") ? path.slice(0, path.lastIndexOf(" › ")) : "");

interface Props {
  categories: PickerCategory[];
  /** "" یعنی گزینه‌ی اول (همه‌ی دسته‌ها / صفحه‌ی اصلی) */
  value: number | "";
  onChange: (id: number | "") => void;
  loading?: boolean;
  /** filter = فیلتر محصولات؛ link = انتخاب مقصد لینک داخلی */
  mode?: "filter" | "link";
}

const CategoryPicker: React.FC<Props> = ({ categories, value, onChange, loading = false, mode = "filter" }) => {
  const cfg = MODES[mode];

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [active, setActive] = useState(0);
  const [layout, setLayout] = useState<Layout | null>(null);

  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollNext = useRef(false);
  const uid = useRef("cp" + Math.random().toString(36).slice(2, 7)).current;

  const byId = useMemo(() => new Map<number, PickerCategory>(categories.map((c) => [c.id, c])), [categories]);
  const tree = useMemo(() => buildTree(categories, cfg.hideEmpty), [categories, cfg.hideEmpty]);
  const allNodes = useMemo(() => collectAll(tree), [tree]);
  const totalAll = useMemo(() => tree.reduce((s, n) => s + n.total, 0), [tree]);

  const q = norm(query);

  const rows = useMemo<Row[]>(() => {
    // حالت جستجو: لیست تخت، با مسیر کامل
    if (q) {
      const words = q.split(" ");
      const matches = allNodes.filter((n) => {
        const p = norm(n.cat.path);
        return words.every((w) => p.includes(w));
      });
      const rank = (n: TreeNode) => (norm(n.cat.name).includes(q) ? 0 : 1);
      matches.sort((a, b) => rank(a) - rank(b) || b.total - a.total);
      return matches.map((n) => ({ id: n.cat.id, node: n, depth: 0 }));
    }

    // حالت درخت
    const out: Row[] = [{ id: "", node: null, depth: 0 }];
    const walk = (nodes: TreeNode[], depth: number) => {
      for (const n of nodes) {
        out.push({ id: n.cat.id, node: n, depth });
        if (n.children.length > 0 && expanded.has(n.cat.id)) walk(n.children, depth + 1);
      }
    };
    walk(tree, 0);
    return out;
  }, [q, allNodes, tree, expanded]);

  const sel = value === "" ? null : byId.get(value) ?? null;

  // در حالت لینک، «صفحه‌ی اصلی» همیشه قابل انتخاب است حتی اگر دسته‌ای نباشد
  const disabled = loading || (mode === "filter" && tree.length === 0);
  const label = loading
    ? t("common.status.loading")
    : sel
      ? sel.name
      : mode === "filter" && tree.length === 0
        ? t("product.category.none")
        : cfg.allLabel;

  const computeLayout = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw < 640) {
      setLayout({ mobile: true });
      return;
    }

    const r = el.getBoundingClientRect();
    const width = Math.min(Math.max(r.width, 340), vw - 16);
    const left = Math.min(Math.max(r.left, 8), vw - width - 8);
    const top = r.bottom + 6;

    setLayout({
      mobile: false,
      top,
      left,
      width,
      maxHeight: Math.min(440, Math.max(220, vh - top - 12)),
    });
  }, []);

  const openPanel = () => {
    computeLayout();
    setQuery("");

    // مسیر دسته‌ی انتخاب‌شده را باز کن تا دیده شود
    const exp = new Set<number>();
    let cur = sel;
    let guard = 0;
    while (cur && cur.parent_id && guard++ < 10) {
      exp.add(cur.parent_id);
      cur = byId.get(cur.parent_id) ?? null;
    }
    setExpanded(exp);

    scrollNext.current = true;
    setOpen(true);
  };

  const closePanel = () => {
    setOpen(false);
    btnRef.current?.focus();
  };

  const choose = (id: number | "") => {
    onChange(id);
    closePanel();
  };

  const toggleExpand = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // هنگام باز شدن/تغییر جستجو، ردیف فعال = دسته‌ی انتخاب‌شده (یا اولین ردیف)
  useEffect(() => {
    if (!open) return;
    const i = rows.findIndex((r) => r.id === value);
    setActive(i >= 0 ? i : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, q]);

  // فقط روی دسکتاپ فوکوس خودکار (روی موبایل کیبورد نپرد)
  useEffect(() => {
    if (open && layout && !layout.mobile) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ردیف فعال همیشه در دید باشد (فقط وقتی با کیبورد یا هنگام باز شدن عوض شده)
  useEffect(() => {
    if (!open || !scrollNext.current) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
    scrollNext.current = false;
  }, [active, open]);

  // تغییر اندازه‌ی پنجره + Escape (قبل از اینکه مودال اصلی ببندد)
  useEffect(() => {
    if (!open) return;

    const onResize = () => computeLayout();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.preventDefault();
        closePanel();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, computeLayout]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      scrollNext.current = true;
      setActive((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      scrollNext.current = true;
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = rows[active];
      if (r) choose(r.id);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const mobile = !!layout?.mobile;

  const panel =
    open && layout
      ? createPortal(
          <div className="fixed inset-0 z-[200]" onClick={(e) => e.stopPropagation()}>
            <div
              className={`absolute inset-0 ${mobile ? "bg-black/35" : ""}`}
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <div
              role="dialog"
              aria-label={t("product.category.select")}
              className={
                mobile
                  ? "absolute inset-x-0 bottom-0 flex max-h-[80vh] flex-col rounded-t-3xl border border-[#E4E5F0] bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl"
                  : "absolute flex flex-col overflow-hidden rounded-2xl border border-[#E4E5F0] bg-white shadow-2xl"
              }
              style={
                mobile
                  ? undefined
                  : { top: layout.top, left: layout.left, width: layout.width, maxHeight: layout.maxHeight }
              }
            >
              {mobile && (
                <div className="flex items-center justify-between px-4 pt-3">
                  <p className="text-sm font-black text-[#0D0F23]">{t("product.category.select")}</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t("common.actions.close")}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#6C7193] hover:bg-[#F3F2FB]"
                  >
                    <Icon d={ICONS.x} className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* جستجوی دسته */}
              <div className="shrink-0 border-b border-[#F3F2FB] p-2.5">
                <label className="relative block">
                  <span className="sr-only">{t("product.category.search")}</span>
                  <Icon
                    d={ICONS.search}
                    className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9DB8]"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="search"
                    enterKeyHint="done"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    placeholder={t("product.category.searchPlaceholder")}
                    role="combobox"
                    aria-expanded
                    aria-controls={`${uid}-list`}
                    aria-activedescendant={`${uid}-opt-${active}`}
                    className="h-10 w-full rounded-xl border border-[#E4E5F0] bg-[#FAFAFE] pe-9 ps-9 text-base text-[#0A0B1E] outline-none transition placeholder:text-[#9A9DB8] focus:border-[#5B47FB]/60 focus:ring-4 focus:ring-[#5B47FB]/10 sm:text-sm"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      aria-label={t("product.clearSearch")}
                      className="absolute end-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#6C7193] hover:bg-[#F3F2FB]"
                    >
                      <Icon d={ICONS.x} className="h-3.5 w-3.5" />
                    </button>
                  )}
                </label>
                {q && <p className="mt-1.5 px-1 text-[11px] text-[#6C7193]">{toFa(rows.length)} results</p>}
              </div>

              {/* لیست */}
              <div ref={listRef} id={`${uid}-list`} role="listbox" className="min-h-0 flex-1 overflow-y-auto p-1.5">
                {rows.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm font-bold text-[#0D0F23]">{t("product.category.empty")}</p>
                    <p className="mt-1 text-xs text-[#6C7193]">{t("product.category.emptyHint")}</p>
                  </div>
                ) : (
                  rows.map((r, i) => {
                    const node = r.node;
                    const isSel = r.id === value;
                    const isActive = i === active;
                    const hasKids = !q && !!node && node.children.length > 0;
                    const isOpen = !!node && expanded.has(node.cat.id);
                    const name = node ? node.cat.name : cfg.allLabel;
                    const count = node ? node.total : cfg.showAllCount ? totalAll : 0;
                    const sub = q && node ? parentPathOf(node.cat.path) : "";

                    return (
                      <div
                        key={r.id === "" ? "all" : r.id}
                        className={`flex items-center rounded-xl transition-colors ${
                          isSel ? "bg-[#EFEDFF]/70" : isActive ? "bg-[#F3F2FB]" : ""
                        }`}
                        style={{ paddingInlineStart: q ? 4 : r.depth * 16 + 4 }}
                        onMouseMove={() => {
                          if (!isActive) setActive(i);
                        }}
                      >
                        {hasKids ? (
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={isOpen ? t("product.category.collapse") : t("product.category.expand")}
                            aria-expanded={isOpen}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(node!.cat.id);
                            }}
                            className="flex h-9 w-8 shrink-0 items-center justify-center rounded-lg text-[#6C7193] hover:bg-white"
                          >
                            <Icon d={isOpen ? ICON_CHEVRON_DOWN : ICON_CHEVRON_LEFT} className="h-4 w-4" stroke={2.2} />
                          </button>
                        ) : (
                          <span className="w-8 shrink-0" aria-hidden />
                        )}

                        <button
                          type="button"
                          tabIndex={-1}
                          role="option"
                          id={`${uid}-opt-${i}`}
                          data-idx={i}
                          aria-selected={isSel}
                          onClick={() => choose(r.id)}
                          className="flex min-w-0 flex-1 items-center gap-2 py-2 pe-2.5 text-start"
                        >
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[13px] leading-6 ${
                                isSel ? "font-black text-[#4935E0]" : "font-bold text-[#0D0F23]"
                              }`}
                            >
                              {name}
                            </span>
                            {sub && <span className="block truncate text-[11px] leading-5 text-[#6C7193]">{sub}</span>}
                          </span>
                          {count > 0 && <span className="shrink-0 text-[11px] text-[#6C7193]">{toFa(count)}</span>}
                          {isSel && <Icon d={ICONS.check} className="h-4 w-4 shrink-0 text-[#5B47FB]" stroke={2.6} />}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <p className="shrink-0 border-t border-[#F3F2FB] px-3 py-2 text-[11px] leading-5 text-[#6C7193]">
                {cfg.note}
              </p>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          onClick={() => (open ? setOpen(false) : openPanel())}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`${cfg.prefix} ${label}`}
          title={sel ? sel.path : undefined}
          className={`flex h-11 w-full items-center gap-1.5 rounded-2xl border ps-3 text-start text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[#5B47FB]/10 disabled:cursor-not-allowed disabled:opacity-60 ${
            sel ? "border-[#5B47FB]/60 bg-[#EFEDFF]/40 pe-10" : "border-[#E4E5F0] bg-white pe-9"
          } ${open ? "border-[#5B47FB]/60 ring-4 ring-[#5B47FB]/10" : ""}`}
        >
          <span className="shrink-0 text-xs text-[#6C7193]">{cfg.prefix}</span>
          <span className={`min-w-0 flex-1 truncate ${sel ? "font-black text-[#4935E0]" : "font-bold text-[#0D0F23]"}`}>
            {label}
          </span>
        </button>

        {sel ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={mode === "filter" ? t("product.category.removeFilter") : t("product.category.backHome")}
            className="absolute end-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#4935E0] hover:bg-white/80"
          >
            <Icon d={ICONS.x} className="h-4 w-4" stroke={2.2} />
          </button>
        ) : (
          <Icon
            d={ICON_CHEVRON_DOWN}
            className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6C7193]"
            stroke={2.2}
          />
        )}
      </div>

      {panel}
    </>
  );
};

export default CategoryPicker;