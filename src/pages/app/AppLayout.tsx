import { NavLink, Outlet } from 'react-router'
import { Logo } from '../../components/brand/Logo'
import { useCurrentUser } from '../../features/auth/hooks'
import styles from './AppLayout.module.css'
import { UserMenu } from './UserMenu'

/** Moldura da área logada. */
export function AppLayout() {
  const { data: user } = useCurrentUser()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Logo tone="dark" />
          <nav aria-label="Área do leitor" className={styles.nav}>
            <NavLink to="/inicio" className={styles.navLink}>
              Início
            </NavLink>
            <NavLink to="/livros" className={styles.navLink}>
              Livros
            </NavLink>
            <NavLink to="/biblioteca" className={styles.navLink}>
              Biblioteca
            </NavLink>
          </nav>
        </div>
        <div className={styles.account}>{user && <UserMenu name={user.name} />}</div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
