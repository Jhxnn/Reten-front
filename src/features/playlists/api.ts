import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api/http'

export type ListeningMode = 'THEMATIC' | 'VOCAL' | 'FOCUS'
export type PlaylistStatus = 'GENERATING' | 'READY' | 'FAILED'
/** VERIFIED: sugestões buscadas no Spotify. NOT_CONFIGURED/FAILED: sugestões seguem sem verificação. */
export type VerificationStatus = 'VERIFIED' | 'NOT_CONFIGURED' | 'FAILED'
export type MatchStatus = 'PENDING' | 'MATCHED' | 'NOT_FOUND' | 'DUPLICATE'

export type Atmosphere = {
  literaryGenre: string
  moods: string[]
  setting: string
  era: string
  themes: string[]
  emotionalIntensity: 'BAIXA' | 'MEDIA' | 'ALTA'
  universe: string
}

/** Sugestão da IA e o resultado da busca dela no Spotify. Não é uma faixa. */
export type Suggestion = {
  position: number
  title: string
  artist: string
  reason: string
  matchStatus: MatchStatus
}

/** Faixa que existe no Spotify. */
export type Track = {
  id: string
  position: number
  spotifyTrackId: string
  name: string
  artists: string[]
  album: string | null
  imageUrl: string | null
  durationMs: number | null
  spotifyUrl: string
  reason: string | null
  source: 'AI' | 'MANUAL'
}

export type CatalogTrack = {
  spotifyTrackId: string
  name: string
  artists: string[]
  album: string | null
  imageUrl: string | null
  durationMs: number | null
  spotifyUrl: string
}

export type Playlist = {
  id: string
  status: PlaylistStatus
  mode: ListeningMode
  book: { id: string; title: string; authors: string[]; coverUrl: string | null }
  userNotes: string | null
  name: string | null
  description: string | null
  musicalStyle: string | null
  atmosphere: Atmosphere | null
  verificationStatus: VerificationStatus | null
  tracks: Track[]
  suggestions: Suggestion[]
  spotify: {
    publishingAvailable: boolean
    playlistUrl: string | null
    savedAt: string | null
    hasUnsavedChanges: boolean
  }
  failure: { code: string; message: string } | null
  createdAt: string
}

export type Usage = {
  limit: number
  used: number
  remaining: number
  resetsAt: string | null
  aiConfigured: boolean
}

const usageKey = ['playlists', 'usage'] as const
const detailKey = (id: string | undefined) => ['playlists', 'detail', id] as const

export function useGenerationUsage() {
  return useQuery({ queryKey: usageKey, queryFn: () => api<Usage>('/playlists/usage') })
}

export function useGeneratePlaylist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { bookId: string; mode: ListeningMode; notes?: string }) =>
      api<Playlist>('/playlists', { method: 'POST', body: input }),
    onSuccess: (playlist) => {
      queryClient.setQueryData(detailKey(playlist.id), playlist)
      queryClient.invalidateQueries({ queryKey: usageKey })
      queryClient.invalidateQueries({ queryKey: ['library'] })
    },
  })
}

/** Enquanto a geração está em andamento, consulta o servidor a cada 2 segundos. */
export function usePlaylist(id: string | undefined) {
  return useQuery({
    queryKey: detailKey(id),
    queryFn: () => api<Playlist>(`/playlists/${id}`),
    enabled: Boolean(id),
    refetchInterval: (query) => (query.state.data?.status === 'GENERATING' ? 2000 : false),
  })
}

/** Toda edição devolve a playlist atualizada, que substitui o cache. */
function usePlaylistMutation<TInput>(id: string, request: (input: TInput) => Promise<Playlist>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: request,
    onSuccess: (playlist) => {
      queryClient.setQueryData(detailKey(id), playlist)
      queryClient.invalidateQueries({ queryKey: ['library'] })
    },
  })
}

export function useUpdatePlaylist(id: string) {
  return usePlaylistMutation(id, (input: { name: string; description: string | null }) =>
    api<Playlist>(`/playlists/${id}`, { method: 'PATCH', body: input }),
  )
}

export function useRemoveTrack(id: string) {
  return usePlaylistMutation(id, (trackId: string) =>
    api<Playlist>(`/playlists/${id}/tracks/${trackId}`, { method: 'DELETE' }),
  )
}

export function useAddTrack(id: string) {
  return usePlaylistMutation(id, (spotifyTrackId: string) =>
    api<Playlist>(`/playlists/${id}/tracks`, { method: 'POST', body: { spotifyTrackId } }),
  )
}

export function useReverify(id: string) {
  return usePlaylistMutation(id, () => api<Playlist>(`/playlists/${id}/verify`, { method: 'POST' }))
}

export function usePublishToSpotify(id: string) {
  return usePlaylistMutation(id, () => api<Playlist>(`/playlists/${id}/spotify`, { method: 'POST' }))
}

export function useReplacementSearch(id: string, query: string) {
  const text = query.trim()
  return useQuery({
    queryKey: ['playlists', 'replacements', id, text],
    queryFn: ({ signal }) =>
      api<CatalogTrack[]>(`/playlists/${id}/replacements?q=${encodeURIComponent(text)}`, { signal }),
    enabled: text.length >= 2,
    placeholderData: keepPreviousData,
  })
}

export function formatDuration(ms: number | null) {
  if (ms == null) return null
  const totalSeconds = Math.round(ms / 1000)
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`
}

export function formatTotalDuration(tracks: Track[]) {
  const minutes = Math.round(tracks.reduce((sum, t) => sum + (t.durationMs ?? 0), 0) / 60000)
  if (minutes < 60) return `${minutes} min`
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`
}
