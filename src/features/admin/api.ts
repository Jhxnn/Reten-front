import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api/http'
import type { ListeningMode, PlaylistStatus } from '../playlists/api'

/** Números do topo. "Ativos" = acessaram nos últimos 7 dias. */
export type AdminOverview = {
  users: number
  verifiedUsers: number
  activeLast7Days: number
  spotifyConnected: number
  playlists: number
  playlistsLast7Days: number
  deletedPlaylists: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  admin: boolean
  emailVerified: boolean
  spotifyConnected: boolean
  createdAt: string
  lastSeenAt: string | null
  playlists: number
}

export type AdminPlaylist = {
  id: string
  name: string | null
  mode: ListeningMode
  status: PlaylistStatus
  tracks: number
  savedOnSpotify: boolean
  createdAt: string
  deletedAt: string | null
  ownerId: string
  ownerName: string
  ownerEmail: string
  bookTitle: string
  bookAuthors: string[]
}

export type AdminTrack = {
  position: number
  name: string
  artists: string[]
  album: string | null
  spotifyUrl: string
  reason: string | null
  source: 'AI' | 'MANUAL'
}

export type AdminPlaylistDetail = {
  playlist: AdminPlaylist
  description: string | null
  userNotes: string | null
  failureCode: string | null
  spotifyPlaylistUrl: string | null
  tracks: AdminTrack[]
}

// staleTime 0: a área serve para acompanhar o uso, então sempre recarrega ao abrir.
export function useAdminOverview() {
  return useQuery({ queryKey: ['admin', 'overview'], queryFn: () => api<AdminOverview>('/admin/overview'), staleTime: 0 })
}

export function useAdminUsers() {
  return useQuery({ queryKey: ['admin', 'users'], queryFn: () => api<AdminUser[]>('/admin/users'), staleTime: 0 })
}

export function useAdminPlaylists(userId: string | null) {
  return useQuery({
    queryKey: ['admin', 'playlists', userId ?? 'all'],
    queryFn: () => api<AdminPlaylist[]>(`/admin/playlists${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`),
    staleTime: 0,
  })
}

export function useAdminPlaylist(id: string) {
  return useQuery({
    queryKey: ['admin', 'playlist', id],
    queryFn: () => api<AdminPlaylistDetail>(`/admin/playlists/${encodeURIComponent(id)}`),
    staleTime: 0,
  })
}

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

export function formatDateTime(value: string | null) {
  return value ? dateTime.format(new Date(value)) : '—'
}

export function formatDate(value: string) {
  return dateOnly.format(new Date(value))
}

const statusNames: Record<PlaylistStatus, string> = { READY: 'Pronta', GENERATING: 'Gerando', FAILED: 'Falhou' }

export function statusName(playlist: Pick<AdminPlaylist, 'status' | 'deletedAt'>) {
  return playlist.deletedAt ? 'Apagada' : statusNames[playlist.status]
}
