import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { PageLoading } from '../../components/ui/PageLoading'
import { useCurrentUser } from './hooks'

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

/** Páginas de login/cadastro: quem já tem sessão vai direto para o início. */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { data: user, isPending } = useCurrentUser()
  if (isPending) return <PageLoading />
  if (user) return <Navigate to="/inicio" replace />
  return children
}
