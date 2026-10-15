import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { entitiesApi, productsApi } from "../api";
import { ProductCard } from "../components/ProductCard";
import type { ProductFilters } from "../types";
import styles from "./CatalogPage.module.css";

export function CatalogPage() {
  const [draft, setDraft] = useState<ProductFilters>({ inStock: "true" });
  const [filters, setFilters] = useState<ProductFilters>({ inStock: "true" });
  const products = useQuery({ queryKey: ["products", filters], queryFn: () => productsApi.list(filters) });
  const brands = useQuery({ queryKey: ["brands"], queryFn: () => entitiesApi.list("brands") });
  const categories = useQuery({ queryKey: ["categories"], queryFn: () => entitiesApi.list("categories") });

  function submit(event: FormEvent) { event.preventDefault(); setFilters(draft); }
  function reset() { const empty = {}; setDraft(empty); setFilters(empty); }
  function selectCategory(categoryId?: number) {
    const next = { ...draft, categoryId: categoryId ? String(categoryId) : undefined };
    setDraft(next);
    setFilters(next);
  }

  return (
    <>
      <section className={styles.intro}>
        <span className="eyebrow">Комфорт в любую погоду</span>
        <h1>Найдём идеальный<br />климат для дома</h1>
        <p>Подберите модель под площадь, задачи и бюджет — без лишней сложности.</p>
      </section>

      <form className={styles.filters} onSubmit={submit}>
        <label className={styles.search}><span>Поиск</span><div className={styles.searchField}><span aria-hidden="true">⌕</span><input value={draft.search ?? ""} onChange={(e) => setDraft({ ...draft, search: e.target.value })} placeholder="Найти кондиционер" /></div></label>
        <label>Производитель<select value={draft.brandId ?? ""} onChange={(e) => setDraft({ ...draft, brandId: e.target.value })}><option value="">Все</option>{brands.data?.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <label>Категория<select value={draft.categoryId ?? ""} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}><option value="">Все</option>{categories.data?.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <label>Цена до<input type="number" min="0" value={draft.maxPrice ?? ""} onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value })} placeholder="₽" /></label>
        <label className={styles.checkbox}><input type="checkbox" checked={draft.inStock === "true"} onChange={(e) => setDraft({ ...draft, inStock: e.target.checked ? undefined : "true" })} /> Только в наличии</label>
        <div className={styles.actions}><button className="button" type="submit">Применить</button><button className="button buttonSecondary" type="button" onClick={reset}>Сбросить</button></div>
      </form>

      <section className={styles.promo}>
        <div><span>Свежесть для дома</span><p>Инверторные модели<br />со скидкой до 15%</p></div>
        <div className={styles.airConditioner} aria-hidden="true"><i /><b /></div>
      </section>

      <div className={styles.categories} aria-label="Быстрый выбор категории">
        <button className={!draft.categoryId ? styles.activeChip : ""} type="button" onClick={() => selectCategory()}>Все</button>
        {categories.data?.map((category) => <button className={draft.categoryId === String(category.id) ? styles.activeChip : ""} type="button" key={category.id} onClick={() => selectCategory(category.id)}>{category.name}</button>)}
      </div>

      <div className={styles.sectionHeading}><div><span className="eyebrow">Каталог</span><h2>Популярные модели</h2></div><span>{products.data?.length ?? "—"} товаров</span></div>

      {products.isPending && <div className="status">Загружаем каталог…</div>}
      {products.isError && <div className="status error">Не удалось загрузить каталог: {products.error.message}</div>}
      {products.data?.length === 0 && <div className="status">По выбранным условиям ничего не найдено.</div>}
      <section className={styles.grid}>{products.data?.map((product, index) => <ProductCard key={product.id} product={product} tone={index % 3} />)}</section>
    </>
  );
}
