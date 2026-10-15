import { Link } from "react-router-dom";
import type { Product } from "../types";
import styles from "./ProductCard.module.css";

const placeholder = "https://placehold.co/800x600/e7f2f4/1d5962?text=Climate+Store";

export function ProductCard({ product, tone = 0 }: { product: Product; tone?: number }) {
  return (
    <article className={styles.card}>
      <Link to={`/products/${product.id}`} className={`${styles.imageLink} ${styles[`tone${tone}`]}`}>
        <img src={product.imageUrl || placeholder} alt={product.name} />
        <span className={product.stockQuantity > 0 ? styles.inStock : styles.outStock}>
          {product.stockQuantity > 0 ? "В наличии" : "Нет в наличии"}
        </span>
      </Link>
      <div className={styles.body}>
        <p className={styles.meta}>{product.brandName} · {product.categoryName}</p>
        <h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2>
        <p className={styles.model}>{product.model} · до {product.recommendedArea} м²</p>
        <div className={styles.bottom}>
          <strong>{product.price.toLocaleString("ru-RU")} ₽</strong>
          <Link className={styles.details} to={`/products/${product.id}`} aria-label={`Подробнее о ${product.name}`}>→</Link>
        </div>
      </div>
    </article>
  );
}
