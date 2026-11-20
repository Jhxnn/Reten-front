import { Outlet, useNavigate } from 'react-router'
import { Logo } from '../../components/brand/Logo'
import { Button } from '../../components/ui/Button'
import { useCurrentUser, useLogout } from '../../features/auth/hooks'
import styles from './AppLayout.module.css'

/** Moldura da área logada. */
export function AppLayout() {
  const { data: user } = useCurrentUser()
  const logout = useLogout()
  const navigate = useNavigate()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Logo tone="dark" />
        <div className={styles.account}>
          {user && <span className={styles.name}>{user.name}</span>}
          <Button
            variant="quiet"
            onClick={() => {
              // Sai da área protegida antes de limpar o usuário, senão o guard mandaria para /entrar.
              navigate('/', { replace: true })
              logout.mutate()
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
