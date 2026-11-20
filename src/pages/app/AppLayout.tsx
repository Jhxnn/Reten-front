import { NavLink, Outlet } from 'react-router'
import { Logo } from '../../components/brand/Logo'
import { Button } from '../../components/ui/Button'
import { useCurrentUser, useLogout } from '../../features/auth/hooks'
import styles from './AppLayout.module.css'

/** Moldura da área logada. */
export function AppLayout() {
  const { data: user } = useCurrentUser()
  const logout = useLogout()

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
        <div className={styles.account}>
          {user && <span className={styles.name}>{user.name}</span>}
          <Button
            variant="quiet"
            onClick={async () => {
              // Encerra a sessão no servidor e recarrega em "/". O recarregamento descarta todo o estado
              // do cliente (cache de consultas do usuário anterior) e evita que o guard da rota protegida,
              // ao ver o usuário sumir, redirecione para /entrar antes de a navegação terminar.
              try {
                await logout.mutateAsync()
              } finally {
                window.location.replace('/')
              }
            }}
            disabled={logout.isPending}
          >
            Sair
          </Button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
