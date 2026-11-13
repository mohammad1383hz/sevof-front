// src/components/product-article/IdeaEditModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { productSeoIdeaService } from "../../services/api";
import { ICONS, Icon, ModalShell } from "./ModalShell";
import CategoryPicker from "./CategoryPicker";
import ProductPickerModal, {
  ProductThumb,
  clamp2,
  faNum,
  formatPrice,
  toPickerProduct,
} from "./ProductPickerModal";
import type { PickerCategory, PickerProduct } from "./ProductPickerModal";
import { t } from "../../i18n";

export interface EditableIdea {
  id: number | string;
  title: string;
  target_category_id?: number | null;
  target_url?: string | null;
  target_url_title?: string | null;
  products?: any[];
}

const MAX_PRODUCTS = 10; // باید با MAX_IDEA_PRODUCTS در کنترلر یکی باشد
const TITLE_MAX = 100;
const TITLE_SOFT = 60; // عنوان بلندتر در گوگل بریده می‌شود

const SectionLabel: React.FC<{ icon: string; title: string; hint?: React.ReactNode }> = ({ icon, title, hint }) => (
  <div className="mb-2 flex items-center justify-between gap-2">
    <h3 className="flex items-center gap-2 text-xs font-black text-[#0D0F23]">
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EFEDFF] text-[#4935E0]">
        <Icon d={icon} className="h-3.5 w-3.5" />
      </span>
      {title}
    </h3>
    {hint}
  </div>
);

const IdeaEditModal: React.FC<{
  siteId: string;
  idea: EditableIdea;
  onClose: () => void;
  /** ایده‌ی به‌روزشده‌ی سرور (همان شکل index) */
  onSaved: (idea: any) => void;
}> = ({ siteId, idea, onClose, onSaved }) => {
  const [title, setTitle] = useState(idea.title ?? "");
  const [products, setProducts] = useState<PickerProduct[]>(() => (idea.products ?? []).map(toPickerProduct));
  const [targetId, setTargetId] = useState<number | null>(idea.target_category_id ?? null);
  const [categories, setCategories] = useState<PickerCategory[] | null>(null);
  const [categoriesError, setCategoriesError] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initial = useRef({
    title: (idea.title ?? "").trim(),
    ids: products.map((p) => p.id).join(","),
    target: idea.target_category_id ?? null,
  });

  useEffect(() => {
    let alive = true;
    productSeoIdeaService
      .categories(siteId)
      .then((res: any) => {
        if (!alive) return;
        if (res.success && res.data) setCategories(res.data.data ?? []);
        else setCategoriesError(true);
      })
      .catch(() => alive && setCategoriesError(true));
    return () => {
      alive = false;
    };
  }, [siteId]);

  const titleChanged = title.trim() !== initial.current.title;
  const productsChanged = products.map((p) => p.id).join(",") !== initial.current.ids;
  const targetChanged = targetId !== initial.current.target;
  const dirty = titleChanged || productsChanged || targetChanged;
  const valid = title.trim().length >= 3 && products.length >= 1 && products.length <= MAX_PRODUCTS;

  const categoriesLoading = categories === null && !categoriesError;
  const selectedCategory =
    targetId !== null && categories ? categories.find((c) => c.id === targetId) ?? null : null;
  const missing = targetId !== null && categories !== null && !selectedCategory;

  const save = async () => {
    if (!dirty || !valid || saving) return;
    setSaving(true);
    setError(null);

    // فقط فیلدهای تغییرکرده ارسال می‌شود (مقادیر قدیمی/نامعتبر خطا نمی‌دهند)
    const payload: Record<string, unknown> = {};
    if (titleChanged) payload.title = title.trim();
    if (productsChanged) payload.product_ids = products.map((p) => p.id);
    if (targetChanged) payload.target_category_id = targetId;

    try {
      const res: any = await productSeoIdeaService.updateIdea(siteId, idea.id, payload);
      if (res.success && res.data?.data) {
        onSaved(res.data.data);
      } else {
        setError(res.message || t("analyze.idea.errors.save"));
      }
    } catch {
      setError(t("product.errors.server"));
    } finally {
      setSaving(false);
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="h-11 rounded-2xl px-4 text-sm font-bold text-[#6C7193] transition hover:bg-[#F3F2FB] disabled:opacity-50"
      >
        {t("common.actions.cancel")}
      </button>
      <button
        type="button"
        onClick={save}
        disabled={!dirty || !valid || saving}
        className="inline-flex h-11 min-w-[8rem] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#5B47FB] to-[#4935E0] px-5 text-sm font-black text-white shadow-lg shadow-[#5B47FB]/20 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
        {t("analyze.idea.save")}
      </button>
    </div>
  );

  return (
    <>
      <ModalShell
        title={t("analyze.idea.edit")}
        subtitle={t("product.editIdea.subtitle")}
        onClose={saving ? () => {} : onClose}
        footer={footer}
      >
        <div className="space-y-6">
          {/* عنوان */}
          <section>
            <SectionLabel
              icon={ICONS.pencil}
              title={t("article.target.title")}
              hint={
                <span className={`text-[11px] ${title.length > TITLE_SOFT ? "text-[#B3453A]" : "text-[#6C7193]"}`}>
                  {faNum(title.length)} / {faNum(TITLE_MAX)}
                </span>
              }
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX}
              aria-label={t("article.target.title")}
              className="h-12 w-full rounded-2xl border border-[#E4E5F0] bg-white px-4 text-base font-bold text-[#0A0B1E] outline-none transition focus:border-[#5B47FB]/60 focus:ring-4 focus:ring-[#5B47FB]/10 sm:text-sm"
            />
            <p className="mt-1.5 text-[11px] leading-5 text-[#6C7193]">
              {t("product.editIdea.titleHint", { max: TITLE_SOFT })}
            </p>
          </section>

          {/* محصولات */}
          <section>
            <SectionLabel
              icon={ICONS.bag}
              title={t("product.editIdea.products")}
              hint={
                <span className="text-[11px] text-[#6C7193]">
                  {faNum(products.length)} of {faNum(MAX_PRODUCTS)}
                </span>
              }
            />

            {products.length === 0 ? (
              <p
                role="alert"
                className="rounded-2xl border border-dashed border-[#E3C4BC] bg-[#F7EEEA] px-4 py-5 text-center text-xs leading-6 text-[#B3453A]"
              >
                {t("product.editIdea.needProduct")}
              </p>
            ) : (
              <ul className="space-y-2">
                {products.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-[#E4E5F0] bg-white p-2.5">
                    <ProductThumb src={p.image} className="h-12 w-12" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold leading-6 text-[#0D0F23]" style={clamp2}>
                        {p.name}
                      </span>
                      <span className="block text-[11px] text-[#6C7193]">{formatPrice(p.price, p.currency)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setProducts((l) => l.filter((x) => x.id !== p.id))}
                      aria-label={t("product.editIdea.removeProduct", { name: p.name })}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#6C7193] transition hover:bg-[#F7EEEA] hover:text-[#B3453A]"
                    >
                      <Icon d={ICONS.x} className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#5B47FB]/50 bg-[#EFEDFF]/40 text-xs font-black text-[#4935E0] transition hover:bg-[#EFEDFF]"
            >
              <Icon d={ICONS.plus} className="h-4 w-4" stroke={2.2} />
              {t("product.editIdea.changeProducts")}
            </button>
          </section>

          {/* لینک داخلی */}
          <section>
            <SectionLabel icon={ICONS.link} title={t("product.editIdea.link")} />
            <p className="mb-2 text-[11px] leading-5 text-[#6C7193]">
              {t("product.editIdea.linkHint")}
            </p>

            {categoriesError ? (
              <p role="alert" className="rounded-2xl bg-[#F7EEEA] px-4 py-3 text-xs text-[#B3453A]">
                {t("product.editIdea.categoriesError")}
              </p>
            ) : (
              <>
                {missing && (
                  <p role="alert" className="mb-2 rounded-xl bg-[#FFF6E5] px-3 py-2 text-[11px] leading-5 text-[#8A5A00]">
                    {t("product.editIdea.missingCategory")}
                  </p>
                )}

                <CategoryPicker
                  mode="link"
                  categories={categories ?? []}
                  value={targetId ?? ""}
                  onChange={(id) => setTargetId(id === "" ? null : id)}
                  loading={categoriesLoading}
                />

                {/* آدرسی که مقاله به آن لینک می‌دهد */}
                {selectedCategory?.url ? (
                  <p dir="ltr" className="mt-1.5 truncate text-start text-[11px] text-[#9A9DB8]">
                    {selectedCategory.url.replace(/^https?:\/\//, "")}
                  </p>
                ) : targetId === null && idea.target_url && !targetChanged ? (
                  <p dir="ltr" className="mt-1.5 truncate text-start text-[11px] text-[#9A9DB8]">
                    {idea.target_url.replace(/^https?:\/\//, "")}
                  </p>
                ) : null}
              </>
            )}
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-[#E3C4BC] bg-[#F7EEEA] px-4 py-3 text-xs leading-6 text-[#B3453A]"
            >
              {error}
            </div>
          )}
        </div>
      </ModalShell>

      {pickerOpen && (
        <ProductPickerModal
          siteId={siteId}
          selected={products}
          max={MAX_PRODUCTS}
          title={t("product.editIdea.pickTitle")}
          subtitle={t("product.editIdea.pickSubtitle")}
          confirmLabel={t("product.editIdea.pickConfirm")}
          onClose={() => setPickerOpen(false)}
          onConfirm={(items) => {
            setProducts(items);
            setPickerOpen(false);
          }}
        />
      )}
    </>
  );
};

export default IdeaEditModal;