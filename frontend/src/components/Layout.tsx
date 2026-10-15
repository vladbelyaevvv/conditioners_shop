import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <NavLink className={styles.logo} to="/">
          <span className={styles.logoMark} aria-hidden="true">❄</span>
          <span>Climate Store</span>
        </NavLink>
        <nav className={styles.nav} aria-label="Основная навигация">
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/admin">Управление</NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
