import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api/http'

export type SpotifyConnection = {
  /** false quando o servidor não tem credenciais da Spotify configuradas. */
  configured: boolean
  connected: boolean
  displayName: string | null
  connectedAt: string | null
}

const connectionKey = ['spotify', 'connection'] as const

export function useSpotifyConnection() {
  return useQuery({
    queryKey: connectionKey,
    queryFn: () => api<SpotifyConnection>('/spotify/connection'),
  })
}

export function useDisconnectSpotify() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api<void>('/spotify/connection', { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: connectionKey }),
  })
}

/** O OAuth é uma navegação completa do navegador: o backend redireciona para a Spotify e de volta. */
export function startSpotifyAuthorization() {
  window.location.assign('/api/spotify/authorize')
}

/** Mensagens para o resultado do retorno do OAuth (?spotify=...&motivo=...). */
export const spotifyOutcomeMessages: Record<string, { tone: 'success' | 'error'; text: string }> = {
  conectado: { tone: 'success', text: 'Spotify conectado. Suas playlists poderão ser salvas direto na sua conta.' },
  nao_configurado: {
    tone: 'error',
    text: 'A integração com o Spotify ainda não foi configurada neste ambiente.',
  },
  cancelado: { tone: 'error', text: 'A conexão com o Spotify foi cancelada. Você pode tentar de novo quando quiser.' },
  estado_invalido: {
    tone: 'error',
    text: 'Não conseguimos confirmar o retorno do Spotify. Por segurança, comece a conexão de novo.',
  },
  nao_autorizado: {
    tone: 'error',
    text: 'Sua conta Spotify ainda não está liberada. Durante o beta, a Spotify só permite contas autorizadas manualmente pelo Resten.',
  },
  indisponivel: { tone: 'error', text: 'O Spotify não respondeu agora. Tente conectar novamente em instantes.' },
  sessao_expirada: { tone: 'error', text: 'Sua sessão expirou durante a conexão. Entre de novo e tente outra vez.' },
}
