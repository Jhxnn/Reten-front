import type { ReactNode } from 'react'
import { Navigate, useLocation, useSearchParams } from 'react-router'
import { PageLoading } from '../../components/ui/PageLoading'
import { useCurrentUser } from './hooks'
import { safeReturnPath } from './returnPath'

/** Rotas que exigem sessão. Sem sessão, vai para o login e volta depois. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: user, isPending } = useCurrentUser()
  const location = useLocation()

  if (isPending) return <PageLoading />
  if (!user) {
    const back = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/entrar?voltar=${back}`} replace />
  }
  return children
}

/**
 * Páginas de login/cadastro: quem já tem sessão segue para o destino pedido (?voltar=) ou o início.
 * Também é este guard que redireciona logo após o login, quando o usuário entra no cache.
 */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { data: user, isPending } = useCurrentUser()
  const [params] = useSearchParams()
  if (isPending) return <PageLoading />
  if (user) return <Navigate to={safeReturnPath(params.get('voltar'))} replace />
  return children
}
