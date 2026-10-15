import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { productsApi } from "../../api";
import styles from "./Admin.module.css";

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const products = useQuery({ queryKey: ["products", {}], queryFn: () => productsApi.list() });
  const remove = useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  function removeProduct(id: number, name: string) {
    if (window.confirm(`Удалить «${name}»?`)) remove.mutate(id);
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeading}><div><h2>Кондиционеры</h2><p>{products.data?.length ?? 0} позиций в каталоге</p></div><Link className="button" to="new">Добавить кондиционер</Link></div>
      {products.isPending && <div className="status">Загрузка…</div>}
      {products.isError && <div className="status error">{products.error.message}</div>}
      {remove.isError && <div className="status error">{remove.error.message}</div>}
      <div className={styles.tableWrap}>
        <table><thead><tr><th>Название</th><th>Производитель</th><th>Цена</th><th>Остаток</th><th aria-label="Действия" /></tr></thead>
          <tbody>{products.data?.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.model}</small></td><td>{product.brandName}</td><td>{product.price.toLocaleString("ru-RU")} ₽</td><td>{product.stockQuantity} шт.</td><td><div className={styles.rowActions}><Link className="button buttonSmall buttonSecondary" to={`${product.id}/edit`}>Изменить</Link><button className="button buttonSmall buttonDanger" disabled={remove.isPending} onClick={() => removeProduct(product.id, product.name)}>Удалить</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
