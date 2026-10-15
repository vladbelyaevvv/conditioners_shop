import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productsApi } from "../api";
import styles from "./ProductPage.module.css";

export function ProductPage() {
  const id = Number(useParams().id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const product = useQuery({ queryKey: ["product", id], queryFn: () => productsApi.get(id), enabled: Number.isInteger(id) });
  if (product.isPending) return <div className="status">Загрузка…</div>;
  if (product.isError) return <div className="status error">Товар не найден.</div>;
  const p = product.data;
  function toggleFavorite(next: boolean) {
    setIsFavorite(next);
    setShowNotice(true);
  }
  return (
    <div>
      <Link className={styles.back} to="/"><span aria-hidden="true">←</span> Вернуться в каталог</Link>
      <article className={styles.product}>
        <div className={styles.image}><img src={p.imageUrl || "https://placehold.co/900x700/e7f2f4/1d5962?text=Climate+Store"} alt={p.name} /></div>
        <div className={styles.info}>
          <div className={styles.topline}><span className="eyebrow">{p.brandName} · {p.categoryName}</span><button className={`${styles.favorite} ${isFavorite ? styles.favoriteActive : ""}`} type="button" onClick={() => toggleFavorite(!isFavorite)} aria-pressed={isFavorite} aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}>{isFavorite ? "♥" : "♡"}</button></div>
          <h1>{p.name}</h1><p className={styles.model}>Модель {p.model}</p>
          <p className={styles.description}>{p.description}</p>
          <dl><div><dt>Рекомендуемая площадь</dt><dd>до {p.recommendedArea} м²</dd></div><div><dt>Мощность охлаждения</dt><dd>{p.coolingCapacityKw} кВт</dd></div><div><dt>Класс энергоэффективности</dt><dd>{p.energyClass}</dd></div></dl>
          <div className={styles.purchase}><strong>{p.price.toLocaleString("ru-RU")} ₽</strong><span className={p.stockQuantity ? styles.available : styles.unavailable}>{p.stockQuantity ? `В наличии: ${p.stockQuantity} шт.` : "Нет в наличии"}</span></div>
          <div className={styles.actions}><button className="button" type="button">Подобрать установку</button><button className="button buttonSecondary" type="button" onClick={() => toggleFavorite(!isFavorite)}>{isFavorite ? "В избранном" : "В избранное"}</button></div>
        </div>
      </article>
      {showNotice && <div className={styles.notice} role="status"><span>{isFavorite ? `${p.name} сохранён в избранное` : "Удалено из избранного"}</span>{isFavorite && <button type="button" onClick={() => toggleFavorite(false)}>Отменить</button>}<button className={styles.close} type="button" onClick={() => setShowNotice(false)} aria-label="Закрыть уведомление">×</button></div>}
    </div>
  );
}
