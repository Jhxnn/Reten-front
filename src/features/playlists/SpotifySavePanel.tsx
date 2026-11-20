import { ExternalLink } from 'lucide-react'
import { FormMessage } from '../../components/form/FormMessage'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../lib/api/http'
import { usePublishToSpotify, type Playlist } from './api'
import styles from './SpotifySavePanel.module.css'

const savedAtFormat = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const CONNECT_CODES = new Set(['spotify_not_connected', 'spotify_reauthorization_required'])

/** Salvar (ou atualizar) a playlist na conta Spotify, com cada caminho explicado. */
export function SpotifySavePanel({ playlist }: { playlist: Playlist }) {
  const publish = usePublishToSpotify(playlist.id)
  const { spotify } = playlist
  const error = publish.error instanceof ApiError ? publish.error : null
  const needsConnection = error && CONNECT_CODES.has(error.code)
  const connectUrl = `/api/spotify/authorize?voltar=${encodeURIComponent(`/playlists/${playlist.id}`)}`

  if (!spotify.publishingAvailable) {
    return (
      <div className={styles.panel}>
        <p className={styles.note}>
          A integração com o Spotify ainda não foi configurada neste ambiente, então salvar na sua conta está
          indisponível.
        </p>
      </div>
    )
  }

  const saved = Boolean(spotify.playlistUrl)
  const label = publish.isPending
    ? saved
      ? 'Atualizando…'
      : 'Salvando…'
    : saved
      ? 'Atualizar no Spotify'
      : 'Salvar no Spotify'

  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        {(!saved || spotify.hasUnsavedChanges) && (
          <Button onClick={() => publish.mutate(undefined)} disabled={publish.isPending || playlist.tracks.length === 0}>
            {label}
          </Button>
        )}
        {saved && spotify.playlistUrl && (
          <a className={styles.open} href={spotify.playlistUrl} target="_blank" rel="noreferrer">
            Abrir no Spotify <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
          </a>
        )}
      </div>

      {saved && spotify.savedAt && (
        <p className={styles.note}>
          {spotify.hasUnsavedChanges
            ? 'Você editou a playlist depois de salvar. Atualize para levar as mudanças ao Spotify.'
            : `Salva na sua conta em ${savedAtFormat.format(new Date(spotify.savedAt))}, como playlist privada.`}
        </p>
      )}
      {!saved && !error && (
        <p className={styles.note}>A playlist é criada como privada na sua conta. Você pode torná-la pública no Spotify.</p>
      )}

      {needsConnection && (
        <FormMessage tone="info">
          {error.message}{' '}
          <a className={styles.connect} href={connectUrl}>
            Conectar Spotify
          </a>
        </FormMessage>
      )}
      {error && !needsConnection && <FormMessage tone="error">{error.message}</FormMessage>}
      {publish.error && !error && <FormMessage tone="error">Não foi possível salvar agora. Tente de novo.</FormMessage>}
    </div>
  )
}
