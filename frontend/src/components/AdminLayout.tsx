import { NavLink, Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  return (
    <div>
      <div className={styles.heading}>
        <div><span className="eyebrow">Административный раздел</span><h1>Управление каталогом</h1></div>
      </div>
      <nav className={styles.tabs} aria-label="Разделы администрирования">
        <NavLink to="products">Кондиционеры</NavLink>
        <NavLink to="brands">Производители</NavLink>
        <NavLink to="categories">Категории</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
