import { createBrowserRouter } from 'react-router'
import { RedirectIfAuthenticated, RequireAuth } from '../features/auth/guards'
import { AppLayout } from '../pages/app/AppLayout'
import { HomePage } from '../pages/app/HomePage'
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
    ],
  },

  { path: '*', element: <UpcomingPage title="Página não encontrada" notFound /> },
])
