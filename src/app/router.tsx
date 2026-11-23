import { createBrowserRouter } from 'react-router'
import { RedirectIfAuthenticated, RequireAdmin, RequireAuth, RequireUnverified } from '../features/auth/guards'
import { AdminPage } from '../pages/admin/AdminPage'
import { AdminPlaylistPage } from '../pages/admin/AdminPlaylistPage'
import { AppLayout } from '../pages/app/AppLayout'
import { HomePage } from '../pages/app/HomePage'
import { ConfirmEmailPage } from '../pages/auth/ConfirmEmailPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'
import { SignInPage } from '../pages/auth/SignInPage'
import { SignUpPage } from '../pages/auth/SignUpPage'
import { BookPage } from '../pages/books/BookPage'
import { BookSearchPage } from '../pages/books/BookSearchPage'
import { LibraryPage } from '../pages/library/LibraryPage'
import { PlaylistPage } from '../pages/playlists/PlaylistPage'
import { LandingPage } from '../pages/landing/LandingPage'
import { UpcomingPage } from '../pages/upcoming/UpcomingPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },

  // Conta
  { path: '/entrar', element: <RedirectIfAuthenticated><SignInPage /></RedirectIfAuthenticated> },
  { path: '/cadastro', element: <RedirectIfAuthenticated><SignUpPage /></RedirectIfAuthenticated> },
  { path: '/confirmar-email', element: <RequireUnverified><ConfirmEmailPage /></RequireUnverified> },
  { path: '/esqueci-a-senha', element: <ForgotPasswordPage /> },
  { path: '/redefinir-senha', element: <ResetPasswordPage /> },

  // Área logada
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/inicio', element: <HomePage /> },
      { path: '/livros', element: <BookSearchPage /> },
      { path: '/livros/:id', element: <BookPage /> },
      { path: '/playlists/:id', element: <PlaylistPage /> },
      { path: '/biblioteca', element: <LibraryPage /> },
      { path: '/admin', element: <RequireAdmin><AdminPage /></RequireAdmin> },
      { path: '/admin/playlists/:id', element: <RequireAdmin><AdminPlaylistPage /></RequireAdmin> },
    ],
  },

  { path: '*', element: <UpcomingPage title="Página não encontrada" notFound /> },
])
