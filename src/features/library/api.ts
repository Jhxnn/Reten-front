import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api/http'
import type { ListeningMode, PlaylistStatus, VerificationStatus } from '../playlists/api'

type BookSummary = { id: string; title: string; authors: string[]; coverUrl: string | null }

export type PlaylistSummary = {
  id: string
  name: string | null
  mode: ListeningMode
  status: PlaylistStatus
  verificationStatus: VerificationStatus | null
  trackCount: number
  book: BookSummary
  spotifyUrl: string | null
  createdAt: string
}

export type LibraryBook = {
  book: BookSummary
  publishedDate: string | null
  lastSelectedAt: string | null
  playlists: PlaylistSummary[]
}

export type Library = {
  bookCount: number
  playlistCount: number
  books: LibraryBook[]
}

export function useLibrary() {
  // staleTime 0: gerações terminam em segundo plano, então a estante sempre recarrega ao abrir.
  return useQuery({ queryKey: ['library', 'all'], queryFn: () => api<Library>('/library'), staleTime: 0 })
}

/** Playlists do usuário (opcionalmente só de um livro), mais recentes primeiro. */
export function usePlaylistSummaries(options: { bookId?: string; limit?: number } = {}) {
  const params = new URLSearchParams()
  if (options.bookId) params.set('bookId', options.bookId)
  if (options.limit) params.set('limit', String(options.limit))
  return useQuery({
    queryKey: ['library', 'playlists', options.bookId ?? 'all', options.limit ?? 50],
    queryFn: () => api<PlaylistSummary[]>(`/playlists?${params.toString()}`),
    staleTime: 0,
  })
}
