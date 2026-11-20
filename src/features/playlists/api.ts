import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api/http'

export type ListeningMode = 'THEMATIC' | 'VOCAL' | 'FOCUS'
export type PlaylistStatus = 'GENERATING' | 'READY' | 'FAILED'

export type Atmosphere = {
  literaryGenre: string
  moods: string[]
  setting: string
  era: string
  themes: string[]
  emotionalIntensity: 'BAIXA' | 'MEDIA' | 'ALTA'
  universe: string
}

/** Sugestão da IA. `verified` só fica true depois da confirmação no Spotify (próxima etapa). */
export type Suggestion = {
  position: number
  title: string
  artist: string
  reason: string
  verified: boolean
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
  suggestions: Suggestion[]
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

export function useGenerationUsage() {
  return useQuery({ queryKey: usageKey, queryFn: () => api<Usage>('/playlists/usage') })
}

export function useGeneratePlaylist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { bookId: string; mode: ListeningMode; notes?: string }) =>
      api<Playlist>('/playlists', { method: 'POST', body: input }),
    onSuccess: (playlist) => {
      queryClient.setQueryData(['playlists', 'detail', playlist.id], playlist)
      queryClient.invalidateQueries({ queryKey: usageKey })
    },
  })
}

/** Enquanto a geração está em andamento, consulta o servidor a cada 2 segundos. */
export function usePlaylist(id: string | undefined) {
  return useQuery({
    queryKey: ['playlists', 'detail', id],
    queryFn: () => api<Playlist>(`/playlists/${id}`),
    enabled: Boolean(id),
    refetchInterval: (query) => (query.state.data?.status === 'GENERATING' ? 2000 : false),
  })
}
