import { createBrowserRouter } from 'react-router'
import { LandingPage } from '../pages/landing/LandingPage'
import { UpcomingPage } from '../pages/upcoming/UpcomingPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  // Cadastro e login chegam na Fase 2. Até lá, a rota existe e diz isso claramente.
  { path: '/cadastro', element: <UpcomingPage title="Criar conta" /> },
  { path: '/entrar', element: <UpcomingPage title="Entrar" /> },
  { path: '*', element: <UpcomingPage title="Página não encontrada" notFound /> },
])
