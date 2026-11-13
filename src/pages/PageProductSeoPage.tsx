import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatMoney } from "../utils/priceUnit";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Crown,
  Loader2,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Layout from "../components/Layout";
// نکته: PAGE_PRODUCT_SEO_LIMITS و تایپ‌های جدید باید از barrel ../services/api هم export شوند
import { PAGE_PRODUCT_SEO_LIMITS, pageProductSeoService } from "../services/api";
import type {
  PageProductSeoDetail,
  PageProductSeoField,
  PageProductSeoItem,
  PageProductSeoPickerProduct,
  PageProductSeoResult,
  PageProductSeoStatus,
  PageProductSeoUpdateRequest,
} from "../services/api";
import { getLocale, t } from "../i18n";
import { tx } from "../i18n/rich";

/** سقف پیش‌فرض (پلن پولی). مقدار واقعی از بک‌اند (limits.max_selectable) می‌آید. */
const MAX_PRODUCTS = 100;
const POLL_MS = 4000;
/** تعداد درخواست هم‌زمان در «رفع ایراد گروهی» */
const BULK_CONCURRENCY = 3;
const LIMIT = PAGE_PRODUCT_SEO_LIMITS;

/** سقف فیلدهای جدید؛ باید با سقف‌های بک‌اند (ProductContentSanitizer) و پلاگین هماهنگ بماند. */
const EXTRA_LIMIT = {
  focus_keyword: 100,
  tag: 40,
  tags: 6,
  faq_items: 5,
  faq_question: 300,
  faq_answer: 1000,
  image_alt: 125,
} as const;

const FIELD_ORDER: PageProductSeoField[] = [
  "short_description",
  "description",
  "category_link",
  "attributes",
  "tags",
  "faq",
  "image_alts",
  "seo_title",
  "meta_description",
  "focus_keyword",
];

const FIELD_LABELS: Record<PageProductSeoField, string> = {
  get short_description() { return t("pps.fields.short_description"); },
  get description() { return t("pps.fields.description"); },
  get category_link() { return t("pps.fields.category_link"); },
  get attributes() { return t("pps.fields.attributes"); },
  get tags() { return t("pps.fields.tags"); },
  get faq() { return t("pps.fields.faq"); },
  get image_alts() { return t("pps.fields.image_alts"); },
  get seo_title() { return t("pps.fields.seo_title"); },
  get meta_description() { return t("pps.fields.meta_description"); },
  get focus_keyword() { return t("pps.fields.focus_keyword"); },
};

/** برچسب امن: اگر بک‌اند فیلد ناشناسی بفرستد، «undefined» نشان داده نمی‌شود. */
const labelOf = (f: string): string => (FIELD_LABELS as Record<string, string>)[f] ?? f;

const STATUS_META: Record<PageProductSeoStatus, { label: string; style: string }> = {
  pending: { get label() { return t("pps.status.pending"); }, style: "bg-gray-100 text-gray-500" },
  analyzing: { get label() { return t("pps.status.analyzing"); }, style: "bg-[#EDE3CF] text-[#B08D57]" },
  ready: { get label() { return t("pps.status.ready"); }, style: "bg-rose-50 text-rose-600" },
  skipped: { get label() { return t("pps.status.skipped"); }, style: "bg-gray-100 text-gray-500" },
  approved: { get label() { return t("pps.status.approved"); }, style: "bg-[#EDE3CF] text-[#B08D57]" },
  published: { get label() { return t("pps.status.published"); }, style: "bg-[#5B47FB] text-white" },
  failed: { get label() { return t("pps.status.failed"); }, style: "bg-rose-50 text-rose-600" },
};

const ATTR_SOURCE_LABELS: Record<string, string> = {
  get seller_data() { return t("pps.source.seller"); },
  get ai() { return t("pps.source.ai"); },
  get user() { return t("pps.source.user"); },
};

const ACTIVE: PageProductSeoStatus[] = ["pending", "analyzing", "approved"];
/** نتیجه هنوز منتشر نشده؛ باید با OPEN در PageProductSeoController یکی باشد */
const OPEN_STATUSES: PageProductSeoStatus[] = [...ACTIVE, "ready"];

/** محدودیت انتخاب محصول بر اساس پلن کاربر (خروجی `limits` در endpoint محصولات) */
interface PlanLimits {
  is_free: boolean;
  /** حداکثر تعداد محصولی که الان می‌شود انتخاب کرد */
  max_selectable: number;
  /** سهمیه‌ی کل پلن رایگان (فقط برای رایگان) */
  free_limit: number | null;
  /** تعداد مصرف‌شده از سهمیه (فقط برای رایگان) */
  used: number | null;
  /** تعداد باقی‌مانده از سهمیه (فقط برای رایگان) */
  remaining: number | null;
}

/** متن HTML تولیدشده را بدون تگ نمایش می‌دهیم. */
const plain = (html?: string | null): string =>
  (html ?? "")
    .replace(/<\/(p|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();

const oneLine = (s?: string | null): string => plain(s).replace(/\s+/g, " ").trim();

/** Proposed description as safe HTML (with the category link); links open in a new tab. */
const safeDescriptionHtml = (html?: string | null): string =>
  DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS: ["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "b", "i", "br", "a"],
    ALLOWED_ATTR: ["href"],
  }).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');

const fa = (n: number): string => n.toLocaleString(getLocale());

/* ───────── تبدیل HTML توضیحات ↔ متن ساده‌ی قابل ویرایش ─────────
 * قالب متن: پاراگراف‌ها با خط خالی جدا می‌شوند، «## عنوان» = h2، «### عنوان» = h3،
 * «- مورد» = لیست، «1. مورد» = لیست شماره‌دار.
 * اگر کاربر دست به توضیحات نزند، HTML اصلی بدون تغییر می‌ماند. */

const collapse = (s: string | null | undefined): string => (s ?? "").replace(/\s+/g, " ").trim();

const htmlToText = (html?: string | null): string => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out: string[] = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = collapse(node.textContent);
      if (t) out.push(t);
      return;
    }
    if (!(node instanceof HTMLElement)) return;

    const tag = node.tagName.toLowerCase();

    if (tag === "ul") {
      out.push(Array.from(node.children).map((li) => `- ${collapse(li.textContent)}`).join("\n"));
    } else if (tag === "ol") {
      out.push(Array.from(node.children).map((li, i) => `${i + 1}. ${collapse(li.textContent)}`).join("\n"));
    } else if (/^h[1-6]$/.test(tag)) {
      const t = collapse(node.textContent);
      // h3 و پایین‌تر به «###» می‌روند تا ساختار تیترها با یک بار ویرایش عوض نشود
      if (t) out.push(`${tag === "h2" || tag === "h1" ? "##" : "###"} ${t}`);
    } else {
      const t = collapse(node.textContent);
      if (t) out.push(t);
    }
  });

  return out.join("\n\n");
};

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const textToHtml = (text: string): string => {
  const html: string[] = [];
  let para: string[] = [];
  let list: { tag: "ul" | "ol"; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) html.push(`<p>${para.map(esc).join("<br>")}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) html.push(`<${list.tag}>${list.items.map((i) => `<li>${esc(i)}</li>`).join("")}</${list.tag}>`);
    list = null;
  };

  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();

    if (!line) {
      flushPara();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    const bullet = line.match(/^[-•]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);

    if (heading) {
      flushPara();
      flushList();
      const tag = heading[1].length === 2 ? "h2" : "h3";
      html.push(`<${tag}>${esc(heading[2])}</${tag}>`);
    } else if (bullet || numbered) {
      flushPara();
      const tag = bullet ? "ul" : "ol";
      if (list && list.tag !== tag) flushList();
      if (!list) list = { tag, items: [] };
      list.items.push((bullet ?? numbered)![1]);
    } else {
      flushList();
      para.push(line);
    }
  }

  flushPara();
  flushList();
  return html.join("");
};

/** تگ‌ها در یک input با جداکننده‌ی «،» ویرایش می‌شوند. */
const parseTags = (s: string): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const part of s.split(/[،,;\n]+/)) {
    const v = part.replace(/^[#\s]+/, "").trim();
    const key = v.toLowerCase();
    if (v && !seen.has(key)) {
      seen.add(key);
      out.push(v);
    }
  }

  return out;
};

/* ───────── پیش‌نویس ویرایش ───────── */

interface AttrRow {
  name: string;
  value: string;
}

interface FaqRow {
  question: string;
  answer: string;
}

interface AltRow {
  id: number;
  alt: string;
}

interface Draft {
  short_description: string;
  description: string;
  seo_title: string;
  meta_description: string;
  focus_keyword: string;
  /** با «،» از هم جدا می‌شوند */
  tags: string;
  attributes: AttrRow[];
  faq: FaqRow[];
  image_alts: AltRow[];
}

type TextField = "short_description" | "description" | "seo_title" | "meta_description" | "focus_keyword";

const TEXT_LIMIT: Record<TextField, number> = {
  short_description: LIMIT.short_description,
  description: LIMIT.description,
  seo_title: LIMIT.seo_title,
  meta_description: LIMIT.meta_description,
  focus_keyword: EXTRA_LIMIT.focus_keyword,
};

const toDraft = (p: PageProductSeoResult): Draft => ({
  short_description: oneLine(p.short_description),
  description: htmlToText(p.description),
  seo_title: oneLine(p.seo_title),
  meta_description: oneLine(p.meta_description),
  focus_keyword: oneLine(p.focus_keyword),
  tags: (p.tags ?? []).join(", "),
  attributes: (p.attributes ?? []).map((a) => ({ name: a.name, value: a.value })),
  faq: (p.faq ?? []).map((r) => ({ question: oneLine(r.question), answer: oneLine(r.answer) })),
  image_alts: (p.image_alts ?? []).map((r) => ({ id: r.id, alt: oneLine(r.alt) })),
});

/** آیا این فیلد در پیش‌نمایش قابل انتخاب است؟ (فیلدهای لیستی فقط اگر حداقل یک مورد داشته باشند) */
const isFieldSelectable = (d: PageProductSeoDetail | null, f: PageProductSeoField): boolean => {
  const p = d?.proposed;
  if (!p) return false;

  switch (f) {
    case "attributes":
      return Boolean(p.attributes?.length);
    case "tags":
      return Boolean(p.tags?.length);
    case "faq":
      return Boolean(p.faq?.length);
    case "image_alts":
      return Boolean(p.image_alts?.length);
    default:
      return Boolean(p[f]);
  }
};

interface BulkFailure {
  name: string;
  message: string;
}

interface BulkResult {
  ok: number;
  failures: BulkFailure[];
}

const PageProductSeoPage: React.FC = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<PageProductSeoPickerProduct[]>([]);
  const [productsPage, setProductsPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [productsLoading, setProductsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [starting, setStarting] = useState(false);

  /** محدودیت پلن — از بک‌اند می‌آید؛ تا قبل از اولین پاسخ null است. */
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const maxSelectable = limits ? limits.max_selectable : MAX_PRODUCTS;
  /** نسخه‌ی همیشه‌به‌روز سقف انتخاب، برای استفاده داخل callbackها بدون stale شدن */
  const maxSelectableRef = useRef(maxSelectable);
  maxSelectableRef.current = maxSelectable;

  /** شماره‌ی آخرین درخواست محصولات؛ پاسخ‌های قدیمی (race / دوبار کلیک) نادیده گرفته می‌شوند. */
  const requestSeq = useRef(0);
  /** اگر کاربر «انتخاب همه» را زده باشد، محصولاتی که با «نمایش بیشتر» می‌آیند هم خودکار انتخاب می‌شوند. */
  const selectAllRef = useRef(false);

  const [items, setItems] = useState<PageProductSeoItem[]>([]);
  const [listLoading, setListLoading] = useState(true);

  /* انتخاب گروهی نتایج برای «رفع ایراد در سایت» */
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);

  const [detail, setDetail] = useState<PageProductSeoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [picked, setPicked] = useState<Set<PageProductSeoField>>(new Set());
  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  /* ویرایش دستی */
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState<Set<PageProductSeoField>>(new Set());
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    if (!siteId) return;
    const response = await pageProductSeoService.list(siteId);
    if (!response.success) {
      setError(response.message || t("pps.errors.results"));
    } else {
      setItems(response.data?.data ?? []);
    }
    setListLoading(false);
  }, [siteId]);

  const loadProducts = useCallback(
    async (page: number) => {
      if (!siteId) return;
      const seq = ++requestSeq.current;
      setProductsLoading(true);
      const response = await pageProductSeoService.products(siteId, { search, page });

      // درخواست جدیدتری ارسال شده؛ این پاسخ قدیمی است
      if (seq !== requestSeq.current) return;

      if (!response.success) {
        setError(response.message || t("pps.errors.products"));
      } else {
        const rows = response.data?.data ?? [];

        // محدودیت پلن (اگر بک‌اند فرستاده باشد). مقدار را با ref هم هم‌زمان می‌کنیم
        // تا انتخاب خودکارِ پایین با سقفِ جدید حساب شود.
        const lim = (response.data as { limits?: PlanLimits } | undefined)?.limits;
        if (lim) {
          setLimits(lim);
          maxSelectableRef.current = lim.max_selectable;
        }

        setProducts((prev) => {
          if (page === 1) return rows;
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...rows.filter((r) => !seen.has(r.id))];
        });

        if (page > 1 && selectAllRef.current) {
          setSelected((prev) => {
            const next = new Set(prev);
            for (const r of rows) {
              if (next.size >= maxSelectableRef.current) break;
              if (!inListRef.current.has(r.id)) next.add(r.id);
            }
            return next;
          });
        }

        setProductsPage(page);
        setLastPage(response.data?.meta?.last_page ?? 1);
      }
      setProductsLoading(false);
    },
    [siteId, search]
  );

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    const t = setTimeout(() => loadProducts(1), 350);
    return () => clearTimeout(t);
  }, [loadProducts]);

  const hasActive = items.some((i) => ACTIVE.includes(i.status));

  /** محصولاتی که نتیجه‌ی منتشرنشده در فهرست دارند؛ دوباره انتخاب نمی‌شوند تا کار قبلی و کریدیت هدر نرود */
  const inListIds = useMemo(
    () => new Set(items.filter((i) => OPEN_STATUSES.includes(i.status) && i.product.id != null).map((i) => i.product.id as number)),
    [items]
  );
  const inListRef = useRef(inListIds);
  inListRef.current = inListIds;

  useEffect(() => {
    if (!hasActive) return;
    const t = setInterval(loadList, POLL_MS);
    return () => clearInterval(t);
  }, [hasActive, loadList]);

  const stats = useMemo(
    () => ({
      total: items.length,
      ready: items.filter((i) => i.status === "ready").length,
      published: items.filter((i) => i.status === "published").length,
      failed: items.filter((i) => i.status === "failed").length,
    }),
    [items]
  );

  const canApprove = detail?.status === "ready" || detail?.status === "approved";

  /* ───────── انتخاب محصولات ───────── */

  const isFree = limits?.is_free === true;
  const limitReached = selected.size >= maxSelectable;
  /** پلن رایگان و سهمیه کاملاً تمام شده — دیگر هیچ محصولی قابل انتخاب نیست */
  const quotaExhausted = isFree && maxSelectable === 0;

  const goToPlans = () => navigate("/subscription");

  const selectable = useMemo(() => products.filter((p) => !inListIds.has(p.id)), [products, inListIds]);

  const allVisibleSelected = useMemo(
    () => selectable.length > 0 && selectable.every((p) => selected.has(p.id)),
    [selectable, selected]
  );

  const toggleProduct = (id: number) => {
    if (inListIds.has(id)) return;
    if (selected.has(id)) selectAllRef.current = false;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < maxSelectableRef.current) next.add(id);
      return next;
    });
  };

  /** همه‌ی محصولات لودشده را انتخاب می‌کند (حداکثر سقف پلن)؛ اگر همه انتخاب بودند، لغو می‌کند. */
  const toggleAllProducts = () => {
    const selecting = !allVisibleSelected;
    selectAllRef.current = selecting;
    setSelected((prev) => {
      const next = new Set(prev);
      if (!selecting) {
        products.forEach((p) => next.delete(p.id));
      } else {
        for (const p of selectable) {
          if (next.size >= maxSelectableRef.current) break;
          next.add(p.id);
        }
      }
      return next;
    });
  };

  const clearSelection = () => {
    selectAllRef.current = false;
    setSelected(new Set());
  };

  const onSearchChange = (value: string) => {
    selectAllRef.current = false;
    setSearch(value);
  };

  const start = async () => {
    if (!siteId || selected.size === 0) return;
    setStarting(true);
    setError(null);
    setNotice(null);
    const response = await pageProductSeoService.start(siteId, {
      product_ids: Array.from(selected).filter((id) => !inListIds.has(id)),
    });
    setStarting(false);
    if (!response.success) {
      setError(response.message || t("pps.errors.start"));
      // ممکن است سهمیه عوض شده باشد؛ وضعیت را تازه می‌کنیم
      loadProducts(1);
      return;
    }
    selectAllRef.current = false;
    setSelected(new Set());
    if (response.data?.already_open) setNotice(response.data.message);
    await loadList();
    // سهمیه‌ی مصرف‌شده‌ی پلن رایگان تازه شود
    loadProducts(1);
  };

  /* ───────── انتخاب گروهی نتایج (رفع ایراد در سایت) ───────── */

  const readyItems = useMemo(() => items.filter((i) => i.status === "ready"), [items]);

  // مواردی که دیگر «دارای ایراد» نیستند از انتخاب حذف می‌شوند
  useEffect(() => {
    const readyIds = new Set(readyItems.map((i) => i.id));
    setBulkSelected((prev) => {
      const next = new Set(Array.from(prev).filter((id) => readyIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [readyItems]);

  const allReadySelected = readyItems.length > 0 && readyItems.every((i) => bulkSelected.has(i.id));

  const toggleReady = (id: string) =>
    setBulkSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAllReady = () =>
    setBulkSelected(allReadySelected ? new Set() : new Set(readyItems.map((i) => i.id)));

  /** برای هر مورد انتخاب‌شده: پیش‌نمایش را می‌گیرد و همه‌ی فیلدهای قابل‌ارسال را تأیید می‌کند. */
  const runBulk = async () => {
    if (!siteId || bulkSelected.size === 0 || bulkRunning) return;

    const ids = Array.from(bulkSelected);
    const nameOf = (id: string) => items.find((i) => i.id === id)?.product.name ?? t("product.body.product");

    setBulkConfirm(false);
    setBulkRunning(true);
    setBulkResult(null);
    setError(null);
    setBulkProgress({ done: 0, total: ids.length });

    const failures: BulkFailure[] = [];
    const okIds: string[] = [];
    let done = 0;
    let cursor = 0;

    const worker = async () => {
      while (cursor < ids.length) {
        const id = ids[cursor++];
        try {
          const shown = await pageProductSeoService.show(siteId, id);
          const d = shown.data?.data;

          if (!shown.success || !d) {
            failures.push({ name: nameOf(id), message: shown.message || t("pps.errors.preview") });
          } else {
            const fields = FIELD_ORDER.filter((f) => isFieldSelectable(d, f));
            if (fields.length === 0) {
              failures.push({ name: nameOf(id), message: t("pps.errors.noFields") });
            } else {
              const res = await pageProductSeoService.approve(siteId, id, { fields });
              if (res.success) okIds.push(id);
              else failures.push({ name: nameOf(id), message: res.message || t("analyze.idea.errors.save") });
            }
          }
        } catch {
          failures.push({ name: nameOf(id), message: t("product.errors.serverShort") });
        }
        done += 1;
        setBulkProgress({ done, total: ids.length });
      }
    };

    await Promise.all(Array.from({ length: Math.min(BULK_CONCURRENCY, ids.length) }, worker));

    setBulkResult({ ok: okIds.length, failures });
    setBulkSelected((prev) => {
      const next = new Set(prev);
      okIds.forEach((id) => next.delete(id));
      return next;
    });
    setBulkRunning(false);
    await loadList();
  };

  /* ───────── پیش‌نمایش، ویرایش و انتخاب فیلدها (تکی) ───────── */

  const openDetail = async (id: string) => {
    if (!siteId) return;
    setDetailLoading(true);
    setDetail(null);
    setApproveError(null);
    setEditError(null);
    setEditing(new Set());
    setDraft(null);
    const response = await pageProductSeoService.show(siteId, id);
    setDetailLoading(false);
    if (!response.success || !response.data?.data) {
      setError(response.message || t("pps.errors.preview"));
      return;
    }
    const d = response.data.data;
    setDetail(d);
    setDraft(d.proposed ? toDraft(d.proposed) : null);
    setPicked(new Set(FIELD_ORDER.filter((f) => isFieldSelectable(d, f))));
  };

  /** پیش‌نویسِ مبنا (همان چیزی که الان در سرور ذخیره است) برای تشخیص تغییرات ذخیره‌نشده */
  const initialDraft = useMemo(
    () => (detail?.proposed ? toDraft(detail.proposed) : null),
    [detail]
  );

  const isDirty = useCallback(
    (f: PageProductSeoField): boolean => {
      // لینک دسته ویرایش‌شدنی نیست
      if (!draft || !initialDraft || f === "category_link") return false;
      return JSON.stringify(draft[f]) !== JSON.stringify(initialDraft[f]);
    },
    [draft, initialDraft]
  );

  const dirtyFields = useMemo(() => FIELD_ORDER.filter(isDirty), [isDirty]);

  /** آدرس تصاویر محصول (اگر بک‌اند در detail.current.images فرستاده باشد) برای نمایش بندانگشتی alt */
  const imageSrcOf = useCallback(
    (id: number): string | null => {
      const images = (detail?.current as unknown as { images?: { id: number | null; src: string }[] } | undefined)
        ?.images;
      return images?.find((i) => i.id === id)?.src || null;
    },
    [detail]
  );

  const closeDetail = () => {
    if (dirtyFields.length > 0 && !window.confirm(t("pps.confirmDiscard"))) {
      return;
    }
    setDetail(null);
    setDraft(null);
    setEditing(new Set());
    setEditError(null);
  };

  const selectableFields = useMemo(
    () => FIELD_ORDER.filter((f) => isFieldSelectable(detail, f)),
    [detail]
  );

  const allPicked = selectableFields.length > 0 && selectableFields.every((f) => picked.has(f));

  const togglePicked = (field: PageProductSeoField) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });

  const toggleAllPicked = () =>
    setPicked(allPicked ? new Set() : new Set(selectableFields));

  const setTextDraft = (field: TextField | "tags", value: string) =>
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));

  const setAttrDraft = (index: number, patch: Partial<AttrRow>) =>
    setDraft((prev) =>
      prev
        ? { ...prev, attributes: prev.attributes.map((r, i) => (i === index ? { ...r, ...patch } : r)) }
        : prev
    );

  const addAttrRow = () =>
    setDraft((prev) => (prev ? { ...prev, attributes: [...prev.attributes, { name: "", value: "" }] } : prev));

  const removeAttrRow = (index: number) =>
    setDraft((prev) => (prev ? { ...prev, attributes: prev.attributes.filter((_, i) => i !== index) } : prev));

  const setFaqDraft = (index: number, patch: Partial<FaqRow>) =>
    setDraft((prev) =>
      prev ? { ...prev, faq: prev.faq.map((r, i) => (i === index ? { ...r, ...patch } : r)) } : prev
    );

  const addFaqRow = () =>
    setDraft((prev) => (prev ? { ...prev, faq: [...prev.faq, { question: "", answer: "" }] } : prev));

  const removeFaqRow = (index: number) =>
    setDraft((prev) => (prev ? { ...prev, faq: prev.faq.filter((_, i) => i !== index) } : prev));

  const setAltDraft = (index: number, alt: string) =>
    setDraft((prev) =>
      prev ? { ...prev, image_alts: prev.image_alts.map((r, i) => (i === index ? { ...r, alt } : r)) } : prev
    );

  const startEdit = (field: PageProductSeoField) => {
    setEditError(null);
    setEditing((prev) => new Set(prev).add(field));
    setPicked((prev) => new Set(prev).add(field));
  };

  const cancelEdit = (field: PageProductSeoField) => {
    if (initialDraft && field !== "category_link") {
      setDraft((prev) => (prev ? { ...prev, [field]: initialDraft[field] } : prev));
    }
    setEditing((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  };

  /** نتیجه‌ی ذخیره‌شده‌ی سرور را در state می‌نشاند و پیش‌نویسِ همان فیلدها را با آن هم‌گام می‌کند. */
  const applyProposed = (proposed: PageProductSeoResult, fields: PageProductSeoField[]) => {
    const fresh = toDraft(proposed);
    setDetail((prev) => (prev ? { ...prev, proposed } : prev));
    setDraft((prev) => {
      if (!prev) return prev;
      const merged = { ...prev };
      for (const f of fields) if (f !== "category_link") Object.assign(merged, { [f]: fresh[f] });
      return merged;
    });
    setEditing((prev) => {
      const next = new Set(prev);
      fields.forEach((f) => next.delete(f));
      return next;
    });
  };

  /** ذخیره‌ی ویرایش‌ها در سرور. اگر موفق (یا بدون تغییر) بود، جزئیات به‌روز را برمی‌گرداند. */
  const saveEdits = async (): Promise<PageProductSeoDetail | null> => {
    if (!siteId || !detail || !draft) return null;
    if (dirtyFields.length === 0) return detail;

    const payload: Record<string, unknown> = {};

    for (const f of dirtyFields) {
      if (f === "category_link") continue;
      if (f === "attributes") {
        const rows = draft.attributes
          .map((r) => ({ name: r.name.trim(), value: r.value.trim() }))
          .filter((r) => r.name || r.value);
        if (rows.some((r) => !r.name || !r.value)) {
          setEditError(t("pps.validation.attr"));
          return null;
        }
        payload.attributes = rows;
      } else if (f === "tags") {
        const tags = parseTags(draft.tags);
        if (tags.length === 0) {
          setEditError(t("pps.validation.empty", { field: labelOf(f) }));
          return null;
        }
        if (tags.length > EXTRA_LIMIT.tags) {
          setEditError(t("pps.validation.tagsMax", { max: EXTRA_LIMIT.tags }));
          return null;
        }
        if (tags.some((t) => t.length > EXTRA_LIMIT.tag)) {
          setEditError(t("pps.validation.tagLength", { max: EXTRA_LIMIT.tag }));
          return null;
        }
        payload.tags = tags;
      } else if (f === "faq") {
        const rows = draft.faq
          .map((r) => ({ question: r.question.trim(), answer: r.answer.trim() }))
          .filter((r) => r.question || r.answer);
        if (rows.length === 0) {
          setEditError(t("pps.validation.empty", { field: labelOf(f) }));
          return null;
        }
        if (rows.some((r) => !r.question || !r.answer)) {
          setEditError(t("pps.validation.faq"));
          return null;
        }
        if (rows.some((r) => r.question.length > EXTRA_LIMIT.faq_question || r.answer.length > EXTRA_LIMIT.faq_answer)) {
          setEditError(
            t("pps.validation.faqLength", { q: EXTRA_LIMIT.faq_question, a: EXTRA_LIMIT.faq_answer })
          );
          return null;
        }
        payload.faq = rows;
      } else if (f === "image_alts") {
        const rows = draft.image_alts.map((r) => ({ id: r.id, alt: r.alt.trim() }));
        if (rows.some((r) => !r.alt)) {
          setEditError(t("pps.validation.altEmpty"));
          return null;
        }
        if (rows.some((r) => r.alt.length > EXTRA_LIMIT.image_alt)) {
          setEditError(t("pps.validation.altLength", { max: EXTRA_LIMIT.image_alt }));
          return null;
        }
        payload.image_alts = rows;
      } else if (f === "description") {
        const html = textToHtml(draft.description);
        if (!html) {
          setEditError(t("pps.validation.empty", { field: labelOf(f) }));
          return null;
        }
        payload.description = html;
      } else {
        const v = draft[f].replace(/\s+/g, f === "focus_keyword" ? " " : "$&").trim();
        if (!v) {
          setEditError(t("pps.validation.empty", { field: labelOf(f) }));
          return null;
        }
        if (v.length > TEXT_LIMIT[f]) {
          setEditError(t("pps.validation.maxLength", { field: labelOf(f), max: TEXT_LIMIT[f] }));
          return null;
        }
        payload[f] = v;
      }
    }

    setSaving(true);
    setEditError(null);
    const res = await pageProductSeoService.update(siteId, detail.id, payload as PageProductSeoUpdateRequest);
    setSaving(false);

    const proposed = res.data?.data?.proposed;
    if (!res.success || !proposed) {
      setEditError(res.message || t("analyze.idea.errors.save"));
      return null;
    }

    applyProposed(proposed, dirtyFields);
    return { ...detail, proposed };
  };

  /** برگرداندن یک فیلد به مقدار اولیه‌ی هوش مصنوعی */
  const revertField = async (field: PageProductSeoField) => {
    if (!siteId || !detail) return;
    setSaving(true);
    setEditError(null);
    const res = await pageProductSeoService.update(siteId, detail.id, { revert: [field] });
    setSaving(false);

    const proposed = res.data?.data?.proposed;
    if (!res.success || !proposed) {
      setEditError(res.message || t("pps.errors.restore"));
      return;
    }
    applyProposed(proposed, [field]);
  };

  const approve = async () => {
    if (!siteId || !detail || picked.size === 0) return;
    setApproveError(null);

    // ویرایش‌های ذخیره‌نشده اول ذخیره می‌شوند
    const saved = await saveEdits();
    if (!saved) return;

    const fields = FIELD_ORDER.filter((f) => picked.has(f) && isFieldSelectable(saved, f));
    if (fields.length === 0) {
      setApproveError(t("pps.errors.noneSelected"));
      return;
    }

    setApproving(true);
    const response = await pageProductSeoService.approve(siteId, detail.id, { fields });
    setApproving(false);
    if (!response.success) {
      setApproveError(response.message || t("pps.errors.submit"));
      return;
    }
    setDetail(null);
    setDraft(null);
    setEditing(new Set());
    await loadList();
  };

  /* ───────── نمایش و ویرایش هر فیلد ───────── */

  const inputCls =
    "min-w-0 text-base sm:text-sm rounded-lg border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5B47FB]/30";

  const renderEditor = (field: PageProductSeoField): React.ReactNode => {
    if (!draft || field === "category_link") return null;

    if (field === "attributes") {
      return (
        <div className="space-y-2">
          {draft.attributes.length === 0 && <div className="text-xs text-gray-400">{t("pps.noAttributes")}</div>}
          {draft.attributes.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={row.name}
                maxLength={LIMIT.attribute_name}
                onChange={(e) => setAttrDraft(i, { name: e.target.value })}
                placeholder={t("pps.attrName")}
                aria-label={t("pps.attrNameAria")}
                className={`${inputCls} w-2/5`}
              />
              <input
                type="text"
                value={row.value}
                maxLength={LIMIT.attribute_value}
                onChange={(e) => setAttrDraft(i, { value: e.target.value })}
                placeholder={t("pps.attrValue")}
                aria-label={t("pps.attrValueAria")}
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeAttrRow(i)}
                aria-label={t("pps.removeAttr")}
                className="shrink-0 p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {draft.attributes.length < LIMIT.attributes && (
            <button
              type="button"
              onClick={addAttrRow}
              className="flex items-center gap-1.5 text-xs font-black text-[#5B47FB] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("pps.addAttr")}
            </button>
          )}
        </div>
      );
    }

    if (field === "tags") {
      const count = parseTags(draft.tags).length;
      return (
        <div className="space-y-1.5">
          <input
            type="text"
            value={draft.tags}
            onChange={(e) => setTextDraft("tags", e.target.value)}
            placeholder={t("pps.tagsPlaceholder")}
            aria-label={labelOf(field)}
            className={`${inputCls} w-full`}
          />
          <div className="flex items-start justify-between gap-3 text-[11px] text-gray-400">
            <span className="leading-5">{t("pps.tagsHint")}</span>
            <span className={`whitespace-nowrap ${count > EXTRA_LIMIT.tags ? "text-rose-500 font-bold" : ""}`}>
              {fa(count)} / {fa(EXTRA_LIMIT.tags)}
            </span>
          </div>
        </div>
      );
    }

    if (field === "faq") {
      return (
        <div className="space-y-3">
          {draft.faq.length === 0 && <div className="text-xs text-gray-400">{t("common.empty.nothingYet")}</div>}
          {draft.faq.map((row, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-2.5 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.question}
                  maxLength={EXTRA_LIMIT.faq_question}
                  onChange={(e) => setFaqDraft(i, { question: e.target.value })}
                  placeholder={t("article.faq.question")}
                  aria-label={t("article.faq.question")}
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeFaqRow(i)}
                  aria-label={t("pps.removeQuestion")}
                  className="shrink-0 p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={row.answer}
                maxLength={EXTRA_LIMIT.faq_answer}
                onChange={(e) => setFaqDraft(i, { answer: e.target.value })}
                rows={3}
                placeholder={t("article.faq.answer")}
                aria-label={t("article.faq.answer")}
                className={`${inputCls} w-full leading-7`}
              />
            </div>
          ))}
          {draft.faq.length < EXTRA_LIMIT.faq_items && (
            <button
              type="button"
              onClick={addFaqRow}
              className="flex items-center gap-1.5 text-xs font-black text-[#5B47FB] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("pps.addQuestion")}
            </button>
          )}
        </div>
      );
    }

    if (field === "image_alts") {
      return (
        <div className="space-y-2">
          {draft.image_alts.map((row, i) => {
            const src = imageSrcOf(row.id);
            return (
              <div key={row.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                  {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-300" />}
                </div>
                <input
                  type="text"
                  value={row.alt}
                  maxLength={EXTRA_LIMIT.image_alt}
                  onChange={(e) => setAltDraft(i, e.target.value)}
                  aria-label={t("pps.altAria", { index: i + 1 })}
                  className={`${inputCls} flex-1`}
                />
              </div>
            );
          })}
          <div className="text-[11px] text-gray-400 leading-5">
            {t("pps.altHint")}
          </div>
        </div>
      );
    }

    // فیلدهای متنی
    return (
      <div className="space-y-1.5">
        <textarea
          value={draft[field]}
          maxLength={TEXT_LIMIT[field]}
          onChange={(e) => setTextDraft(field, e.target.value)}
          rows={field === "description" ? 12 : field === "short_description" ? 4 : field === "focus_keyword" ? 1 : 3}
          aria-label={labelOf(field)}
          className={`${inputCls} w-full leading-7`}
        />
        <div className="flex items-start justify-between gap-3 text-[11px] text-gray-400">
          <span className="leading-5">
            {field === "description"
              ? t("pps.formatHint")
              : ""}
          </span>
          <span className="whitespace-nowrap">
            {fa(draft[field].length)} / {fa(TEXT_LIMIT[field])}
          </span>
        </div>
      </div>
    );
  };

  const renderView = (field: PageProductSeoField, proposed: PageProductSeoResult, hasCurrent: boolean): React.ReactNode => {
    if (field === "attributes") {
      const attrs = proposed.attributes ?? [];
      return (
        <ul className="space-y-2">
          {attrs.length === 0 && <li className="text-xs text-gray-400">{t("pps.noAttributes")}</li>}
          {attrs.map((a, i) => (
            <li
              key={`${a.name}-${i}`}
              className="flex flex-col gap-1.5 rounded-lg bg-[#EFEDFF]/50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
            >
              <div className="text-sm min-w-0 break-words">
                <span className="font-bold text-gray-900">{a.name}</span>
                <span className="text-gray-600"> · {a.value}</span>
              </div>
              <span className="text-[11px] font-bold text-gray-500 sm:whitespace-nowrap">
                {ATTR_SOURCE_LABELS[a.source] ?? ATTR_SOURCE_LABELS.ai}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    if (field === "tags") {
      return (
        <div className="flex flex-wrap gap-2">
          {(proposed.tags ?? []).map((t) => (
            <span key={t} className="text-xs font-bold bg-[#EFEDFF]/70 text-[#5B47FB] rounded-full px-3 py-1 break-words">
              {t}
            </span>
          ))}
        </div>
      );
    }

    if (field === "category_link" && proposed.category_link) {
      const { name, url } = proposed.category_link;
      return (
        <div className="rounded-lg bg-[#EFEDFF]/50 p-3 text-sm text-gray-800 leading-7 break-words">
          {tx("growth.pps.categoryLink", {
            link: (
              <a href={url} target="_blank" rel="noopener noreferrer" className="font-black text-[#5B47FB] underline">
                {name}
              </a>
            ),
          })}
        </div>
      );
    }

    if (field === "faq") {
      return (
        <ul className="space-y-2">
          {(proposed.faq ?? []).map((r, i) => (
            <li key={i} className="rounded-lg bg-[#EFEDFF]/50 px-3 py-2.5">
              <div className="text-sm font-bold text-gray-900 break-words">{r.question}</div>
              <p className="text-sm text-gray-700 leading-7 mt-1 break-words">{r.answer}</p>
            </li>
          ))}
        </ul>
      );
    }

    if (field === "image_alts") {
      return (
        <ul className="space-y-2">
          {(proposed.image_alts ?? []).map((r) => {
            const src = imageSrcOf(r.id);
            return (
              <li key={r.id} className="flex items-center gap-3 rounded-lg bg-[#EFEDFF]/50 px-3 py-2">
                <div className="w-12 h-12 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0">
                  {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-300" />}
                </div>
                <span className="text-sm text-gray-800 break-words min-w-0">{r.alt}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    if (field === "description") {
      return (
        <div className="rounded-lg bg-[#EFEDFF]/50 p-3">
          {hasCurrent && <div className="text-[11px] font-black text-[#5B47FB] mb-1.5">{t("growth.pps.proposed")}</div>}
          <div
            className="text-sm text-gray-800 leading-7 break-words [&_p]:mb-2 [&_h2]:font-black [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:font-bold [&_h3]:mt-2 [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5 [&_a]:font-black [&_a]:text-[#5B47FB] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: safeDescriptionHtml(proposed.description) }}
          />
        </div>
      );
    }

    return (
      <div className="rounded-lg bg-[#EFEDFF]/50 p-3">
        {hasCurrent && <div className="text-[11px] font-black text-[#5B47FB] mb-1.5">{t("pps.suggested")}</div>}
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-7 break-words">
          {plain(proposed[field] as string)}
        </p>
      </div>
    );
  };

  return (
    <Layout activeView="info" onChangeView={() => {}} siteId={siteId}>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* هدر */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EFEDFF] text-[#5B47FB] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black text-gray-900">{t("pps.title")}</h1>
            <p className="text-sm text-gray-500 mt-1 leading-6">
              {t("pps.subtitle")}
            </p>
          </div>
        </div>

        {/* محدودیت پلن رایگان + دعوت به ارتقا */}
        {isFree && limits && (
          <div
            role="status"
            className={`flex flex-col gap-3 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
              quotaExhausted ? "border-rose-200 bg-rose-50" : "border-[#B08D57]/30 bg-[#EDE3CF]/50"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  quotaExhausted ? "bg-rose-100 text-rose-600" : "bg-[#B08D57]/15 text-[#B08D57]"
                }`}
              >
                <Crown className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-black ${quotaExhausted ? "text-rose-700" : "text-gray-900"}`}>
                  {quotaExhausted
                    ? t("pps.quota.exhausted")
                    : t("pps.quota.freePlan", { count: limits.free_limit ?? 0 })}
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-6">
                  {t("pps.quota.used", { used: limits.used ?? 0, total: limits.free_limit ?? 0 })}
                  {!quotaExhausted && ` · ${t("pps.quota.remaining", { count: limits.remaining ?? 0 })}`}
                  {". "}
                  {t("pps.quota.upgrade", { count: MAX_PRODUCTS })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={goToPlans}
              className="flex w-full sm:w-auto items-center justify-center gap-2 text-xs font-black text-white bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#9B5CFF] hover:from-[#4935E0] hover:to-[#8A4BF0] rounded-lg px-4 py-2.5 whitespace-nowrap transition-colors"
            >
              <Crown className="w-3.5 h-3.5" />
              {t("dashboard.agent.locked.cta")}
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            <span className="min-w-0 break-words">{error}</span>
            <button type="button" onClick={() => setError(null)} aria-label={t("common.actions.close")} className="shrink-0 mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {notice && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-[#5B47FB]/20 bg-[#EFEDFF] px-4 py-3 text-sm text-[#5B47FB]">
            <span className="min-w-0 break-words">{notice}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label={t("growth.preview.close")} className="shrink-0 mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* آمار */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: t("pps.stats.total"), value: stats.total, style: "text-gray-900" },
              { label: t("pps.stats.issues"), value: stats.ready, style: "text-rose-600" },
              { label: t("dashboard.publishStatus.published"), value: stats.published, style: "text-[#5B47FB]" },
              { label: t("dashboard.publishStatus.failed"), value: stats.failed, style: "text-rose-600" },
            ].filter((s) => s.value > 0).map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <div className={`text-2xl font-black ${s.style}`}>{fa(s.value)}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* نتایج */}
        {(listLoading || items.length > 0) && (
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-black text-gray-900">{t("pps.results")}</h2>
              {hasActive && (
                <span className="flex items-center gap-1.5 text-xs text-[#B08D57] font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t("pps.processing")}
                </span>
              )}
            </div>

            {/* نوار انتخاب گروهی */}
            {!listLoading && readyItems.length > 0 && (
              <div className="flex flex-col gap-3 px-4 sm:px-5 py-3 border-b border-gray-100 bg-[#EFEDFF]/30 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allReadySelected}
                    onChange={toggleAllReady}
                    disabled={bulkRunning}
                    className="w-5 h-5 sm:w-4 sm:h-4 accent-[#5B47FB]"
                  />
                  <span className="text-sm font-black text-gray-900">{t("pps.selectAllIssues")}</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {fa(bulkSelected.size)} of {fa(readyItems.length)}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setBulkConfirm(true)}
                  disabled={bulkSelected.size === 0 || bulkRunning}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 text-xs font-black text-white bg-[#5B47FB] rounded-lg px-4 py-2.5 hover:bg-[#4935E0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {bulkRunning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {t("pps.bulk.sending", { done: bulkProgress.done, total: bulkProgress.total })}
                    </>
                  ) : (
                    <>{t("pps.bulk.fixSelected")}{bulkSelected.size > 0 && ` (${fa(bulkSelected.size)})`}</>
                  )}
                </button>
              </div>
            )}

            {/* خلاصه‌ی نتیجه‌ی رفع ایراد گروهی */}
            {bulkResult && (
              <div
                role="status"
                className={`mx-4 sm:mx-5 mt-3 rounded-xl border px-4 py-3 text-sm ${
                  bulkResult.failures.length > 0
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-[#5B47FB]/20 bg-[#EFEDFF] text-[#5B47FB]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-black leading-6">
                    {t("pps.bulk.done", { count: bulkResult.ok })}
                    {bulkResult.failures.length > 0 && ` · ${t("pps.bulk.failed", { count: bulkResult.failures.length })}`}
                  </div>
                  <button type="button" onClick={() => setBulkResult(null)} aria-label={t("common.actions.close")} className="shrink-0 mt-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {bulkResult.failures.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs list-disc ps-4 break-words">
                    {bulkResult.failures.slice(0, 5).map((f, idx) => (
                      <li key={idx}>
                        <span className="font-bold">{f.name}</span>:  {f.message}
                      </li>
                    ))}
                    {bulkResult.failures.length > 5 && (
                      <li>{t("pps.bulk.more", { count: bulkResult.failures.length - 5 })}</li>
                    )}
                  </ul>
                )}
              </div>
            )}

            {listLoading ? (
              <div className="p-8 flex justify-center text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {items.map((item) => {
                  const meta = STATUS_META[item.status];
                  const message = item.error || item.publish_error;
                  // روی محصول منتشرشده، publish_error هشدار «فیلد ذخیره‌نشده» است، نه خطا
                  const messageStyle = item.status === "published" ? "text-amber-700" : "text-rose-600";
                  const issues = item.missing_fields ?? [];
                  const isReady = item.status === "ready";
                  const hasAction = isReady || item.status === "approved" || item.status === "published";
                  return (
                    <li key={item.id} className="flex items-start gap-3 px-4 sm:px-5 py-3.5 sm:items-center">
                      {readyItems.length > 0 && (
                        <span className="w-5 sm:w-4 shrink-0 flex justify-center pt-0.5 sm:pt-0">
                          {isReady && (
                            <input
                              type="checkbox"
                              checked={bulkSelected.has(item.id)}
                              onChange={() => toggleReady(item.id)}
                              disabled={bulkRunning}
                              aria-label={t("pps.selectProduct", { name: item.product.name ?? t("product.body.product") })}
                              className="w-5 h-5 sm:w-4 sm:h-4 accent-[#5B47FB] cursor-pointer"
                            />
                          )}
                        </span>
                      )}

                      <div className="min-w-0 flex-1 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                            <span className="text-sm font-bold text-gray-900 truncate max-w-full">
                              {item.product.name ?? t("pps.deletedProduct")}
                            </span>
                            {issues.length > 0 && (
                              <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-black bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                                <AlertTriangle className="w-3 h-3" />
                                {fa(issues.length)} issues
                              </span>
                            )}
                          </div>
                          {issues.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {issues.map((f) => (
                                <span key={f} className="text-[10px] font-bold bg-rose-50 text-rose-600 rounded-md px-2 py-0.5">
                                  {t("pps.notFound", { field: labelOf(f) })}
                                </span>
                              ))}
                            </div>
                          )}
                          {message && <div className={`text-xs mt-1 break-words ${messageStyle}`}>{message}</div>}
                        </div>

                        {(!isReady || hasAction) && (
                          <div className="flex items-center justify-between gap-2 sm:justify-end sm:shrink-0">
                            {!isReady && (
                              <span className={`text-[11px] font-black rounded-full px-2.5 py-1 whitespace-nowrap ${meta.style}`}>
                                {meta.label}
                              </span>
                            )}
                            {hasAction && (
                              <button
                                type="button"
                                onClick={() => openDetail(item.id)}
                                disabled={bulkRunning}
                                className="text-xs font-black text-[#5B47FB] border border-[#5B47FB]/30 bg-[#EFEDFF] rounded-lg px-3 py-2 sm:py-1.5 hover:bg-[#DDD8FF] transition-colors whitespace-nowrap disabled:opacity-40"
                              >
                                {isReady ? t("pps.review") : t("dashboard.view")}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {/* انتخاب محصول */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 px-4 sm:px-5 py-4 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-black text-gray-900">{t("product.seo.manual")}</h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center justify-between gap-3 sm:justify-start">
                <span className={`text-xs ${limitReached ? "text-amber-700 font-bold" : "text-gray-500"}`}>
                  {fa(selected.size)} of {fa(maxSelectable)} selected
                  {limitReached && " (maximum)"}
                </span>
                {selected.size > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    {t("pps.clearSelection")}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={start}
                disabled={selected.size === 0 || starting || quotaExhausted}
                className="flex w-full sm:w-auto items-center justify-center gap-2 text-xs font-black text-white bg-[#5B47FB] rounded-lg px-4 py-2.5 sm:py-2 hover:bg-[#4935E0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {starting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {t("pps.start")}
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-5 pt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t("product.picker.searchPlaceholder")}
                className="w-full text-base sm:text-sm rounded-lg border border-gray-200 bg-white ps-9 pe-3 py-2 text-start focus:outline-none focus:ring-2 focus:ring-[#5B47FB]/30 focus:border-[#5B47FB]/40"
              />
            </div>

            {/* انتخاب همه */}
            <button
              type="button"
              onClick={toggleAllProducts}
              disabled={selectable.length === 0 || quotaExhausted}
              aria-pressed={allVisibleSelected}
              className={`flex items-center justify-center gap-2 text-xs font-black rounded-lg border px-4 py-2.5 whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                allVisibleSelected
                  ? "border-[#5B47FB] bg-[#EFEDFF] text-[#5B47FB]"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#5B47FB]/40"
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  allVisibleSelected ? "bg-[#5B47FB] border-[#5B47FB] text-white" : "border-gray-300 bg-white"
                }`}
              >
                {allVisibleSelected && <Check className="w-3 h-3" strokeWidth={3} />}
              </span>
              {allVisibleSelected ? t("pps.deselectAll") : t("pps.selectAll")}
            </button>
          </div>

          {/* پیام سقف انتخاب */}
          {limitReached && !allVisibleSelected && (
            <div className="px-4 sm:px-5 pt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-amber-700">
              {isFree ? (
                <>
                  <span>
                    {quotaExhausted
                      ? t("pps.quota.selectionsUsed")
                      : t("pps.quota.selectMore", { count: maxSelectable })}
                  </span>
                  <button type="button" onClick={goToPlans} className="font-black text-[#5B47FB] hover:underline">
                    {t("pps.quota.upgradeMore")}
                  </button>
                </>
              ) : (
                <span>{t("pps.quota.perBatch", { count: maxSelectable })}</span>
              )}
            </div>
          )}

          <div className="p-4 sm:p-5">
            {products.length === 0 && !productsLoading ? (
              <div className="text-center text-sm text-gray-400 py-8">
                {search ? t("dashboard.noResults") : t("pps.noProducts")}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((p) => {
                  const inList = inListIds.has(p.id);
                  const on = !inList && selected.has(p.id);
                  const locked = inList || (!on && limitReached);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => toggleProduct(p.id)}
                      disabled={inList}
                      aria-pressed={on}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-start transition-colors ${
                        on ? "border-[#5B47FB] bg-[#EFEDFF]/60" : "border-gray-100 bg-white hover:border-[#5B47FB]/30"
                      } ${locked ? "opacity-60" : ""}`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                        {p.image ? (
                          <img src={p.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-gray-900 truncate">{p.name}</div>
                        {p.price !== null && (
                          <div className="text-xs text-gray-500 mt-0.5">{formatMoney(p.price, p.currency) ?? fa(p.price)}</div>
                        )}
                        {inList && <div className="text-[11px] font-bold text-[#5B47FB] mt-0.5">{t("growth.pps.inList")}</div>}
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          on ? "bg-[#5B47FB] border-[#5B47FB] text-white" : "border-gray-300"
                        }`}
                      >
                        {on && <CheckCircle2 className="w-4 h-4" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {productsLoading && (
              <div className="py-4 flex justify-center text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}

            {!productsLoading && productsPage < lastPage && (
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => loadProducts(productsPage + 1)}
                  className="w-full sm:w-auto text-xs font-black text-[#5B47FB] border border-[#5B47FB]/30 bg-[#EFEDFF] rounded-lg px-4 py-2.5 hover:bg-[#DDD8FF] transition-colors"
                >
                  {t("pps.showMore")}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* تأیید رفع ایراد گروهی */}
      {bulkConfirm && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-end sm:items-center justify-center sm:p-4"
        >
          <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white shadow-xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4">
            <h3 className="text-base font-black text-gray-900">{t("pps.bulk.confirmTitle")}</h3>
            <p className="text-sm text-gray-600 leading-7">
              {t("pps.bulk.confirmBody", { count: bulkSelected.size })}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setBulkConfirm(false)}
                className="w-full sm:w-auto text-sm font-black text-gray-600 border border-gray-200 rounded-lg px-5 py-3 sm:py-2.5 hover:bg-gray-50 transition-colors"
              >
                {t("common.actions.cancel")}
              </button>
              <button
                type="button"
                onClick={runBulk}
                className="w-full sm:w-auto text-sm font-black text-white bg-[#5B47FB] rounded-lg px-5 py-3 sm:py-2.5 hover:bg-[#4935E0] transition-colors"
              >
                {t("pps.bulk.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* پیش‌نمایش، ویرایش و تأیید */}
      {(detail || detailLoading) && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-4"
        >
          <div className="w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-xl">
            {detailLoading || !detail ? (
              <div className="p-12 flex justify-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <>
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 sm:px-6 py-4 border-b border-gray-100">
                  <h3 className="text-base font-black text-gray-900">{t("pps.preview")}</h3>
                  <button type="button" onClick={closeDetail} aria-label={t("common.actions.close")} className="p-1 -m-1">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 space-y-5">
                  {detail.missing_fields && detail.missing_fields.length > 0 && (
                    <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                      <div className="text-xs font-black text-rose-600 mb-2">{t("pps.issuesFound")}</div>
                      <div className="flex flex-wrap gap-2">
                        {detail.missing_fields.map((f) => (
                          <span key={f} className="text-[11px] font-bold bg-white text-rose-600 rounded-full px-2.5 py-1">
                            {t("pps.missing", { field: labelOf(f) })}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {canApprove && (
                    <div className="flex gap-3 rounded-xl border border-[#5B47FB]/20 bg-[#EFEDFF]/40 px-4 py-3">
                      <Sparkles className="w-5 h-5 text-[#5B47FB] shrink-0" />
                      <p className="text-sm text-gray-700 leading-6">
                        {t("pps.aiNotice")}
                      </p>
                    </div>
                  )}

                  {detail.proposed && detail.proposed.needs_seller_input.length > 0 && (
                    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div className="text-sm text-amber-800 min-w-0">
                        <div className="font-black mb-1">{t("pps.sellerInput")}</div>
                        <ul className="list-disc ps-4 space-y-0.5 break-words">
                          {detail.proposed.needs_seller_input.map((n) => (
                            <li key={n}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {detail.proposed?.unproven_numbers && detail.proposed.unproven_numbers.length > 0 && (
                    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div className="text-sm text-amber-800 min-w-0">
                        <div className="font-black mb-1">{t("pps.verifyNumbers")}</div>
                        <p className="leading-6 break-words">
                          {t("pps.verifyNumbersBody")}{" "}
                          {detail.proposed.unproven_numbers.map((n, i) => (
                            <span key={n} dir="ltr" className="font-black inline-block">
                              {n}
                              {i < detail.proposed!.unproven_numbers!.length - 1 ? "," : ""}{" "}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* انتخاب همه‌ی فیلدها */}
                  {canApprove && selectableFields.length > 1 && (
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-[#5B47FB]/20 bg-[#EFEDFF]/40 px-4 py-3 cursor-pointer">
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={allPicked}
                          onChange={toggleAllPicked}
                          className="w-5 h-5 sm:w-4 sm:h-4 accent-[#5B47FB]"
                        />
                        <span className="text-sm font-black text-gray-900">{t("pps.selectAllFields")}</span>
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {fa(picked.size)} of {fa(selectableFields.length)}
                      </span>
                    </label>
                  )}

                  {FIELD_ORDER.filter((f) => isFieldSelectable(detail, f) || editing.has(f)).map((field) => {
                    const proposed = detail.proposed!;
                    const disabled = !canApprove || !isFieldSelectable(detail, field);
                    const isEditing = editing.has(field);
                    const wasEdited = Boolean(proposed.edited_fields?.includes(field));
                    const current =
                      field === "short_description" || field === "description"
                        ? plain(detail.current[field])
                        : "";

                    return (
                      <div key={field} className="rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-50">
                          <label className="flex items-center gap-3 cursor-pointer min-w-0">
                            <input
                              type="checkbox"
                              checked={picked.has(field)}
                              disabled={disabled}
                              onChange={() => togglePicked(field)}
                              className="w-5 h-5 sm:w-4 sm:h-4 accent-[#5B47FB]"
                            />
                            <span className="text-sm font-black text-gray-900">{labelOf(field)}</span>
                            {wasEdited && (
                              <span className="shrink-0 text-[10px] font-black bg-[#EDE3CF] text-[#B08D57] rounded-full px-2 py-0.5">
                                {t("pps.edited")}
                              </span>
                            )}
                            {isDirty(field) && (
                              <span className="shrink-0 text-[10px] font-black bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                                {t("pps.unsaved")}
                              </span>
                            )}
                          </label>

                          {canApprove && field !== "category_link" && (
                            <div className="flex items-center gap-2 shrink-0">
                              {wasEdited && !isEditing && (
                                <button
                                  type="button"
                                  onClick={() => revertField(field)}
                                  disabled={saving || approving}
                                  className="flex items-center gap-1 text-[11px] font-black text-gray-500 hover:text-gray-800 disabled:opacity-40"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  {t("pps.restore")}
                                </button>
                              )}
                              {isEditing ? (
                                <button
                                  type="button"
                                  onClick={() => cancelEdit(field)}
                                  className="text-[11px] font-black text-gray-500 hover:text-gray-800"
                                >
                                  {t("pps.cancelEdit")}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEdit(field)}
                                  className="flex items-center gap-1 text-[11px] font-black text-[#5B47FB] border border-[#5B47FB]/30 bg-[#EFEDFF] rounded-md px-2.5 py-1.5 hover:bg-[#DDD8FF] transition-colors"
                                >
                                  <Pencil className="w-3 h-3" />
                                  {t("analyze.idea.editShort")}
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className={`p-3 sm:p-4 grid gap-3 ${current ? "md:grid-cols-2" : ""}`}>
                          {current && (
                            <div className="rounded-lg bg-gray-50 p-3">
                              <div className="text-[11px] font-black text-gray-400 mb-1.5">{t("pps.current")}</div>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-7 break-words">{current}</p>
                            </div>
                          )}

                          {isEditing && draft ? renderEditor(field) : renderView(field, proposed, Boolean(current))}
                        </div>
                      </div>
                    );
                  })}

                  {detail.error && (
                    <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 break-words">
                      {detail.error}
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white px-4 sm:px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-gray-100 space-y-3">
                  {(approveError || editError || detail.publish_error) &&
                    (() => {
                      // روی محصول منتشرشده، publish_error هشدار «فیلد ذخیره‌نشده» است، نه خطا
                      const warn = detail.status === "published" && !approveError && !editError;
                      return (
                        <div
                          role="alert"
                          className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${
                            warn
                              ? "border-amber-200 bg-amber-50 text-amber-800"
                              : "border-rose-200 bg-rose-50 text-rose-600"
                          }`}
                        >
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <span className="min-w-0 break-words">{approveError || editError || detail.publish_error}</span>
                        </div>
                      );
                    })()}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-gray-500 leading-5">
                      {dirtyFields.length > 0
                        ? t("pps.unsavedHint")
                        : t("pps.approvedOnly")}
                    </span>
                    {canApprove ? (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {dirtyFields.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              void saveEdits();
                            }}
                            disabled={saving || approving}
                            className="flex w-full sm:w-auto items-center justify-center gap-2 text-sm font-black text-[#5B47FB] border border-[#5B47FB]/30 bg-[#EFEDFF] rounded-lg px-5 py-3 sm:py-2.5 hover:bg-[#DDD8FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {t("pps.saveEdits", { count: dirtyFields.length })}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={approve}
                          disabled={picked.size === 0 || approving || saving}
                          className="flex w-full sm:w-auto items-center justify-center gap-2 text-sm font-black text-white bg-[#5B47FB] rounded-lg px-5 py-3 sm:py-2.5 hover:bg-[#4935E0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          {approving && <Loader2 className="w-4 h-4 animate-spin" />}
                          {t("pps.fixOnSite")}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-[#5B47FB]">
                        {STATUS_META[detail.status].label}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PageProductSeoPage;
