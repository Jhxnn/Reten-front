import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router'
import { listeningModes, modeName } from '../playlists/modes'
import type { PlaylistSummary } from './api'
import styles from './PlaylistDisc.module.css'

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })

function statusText(playlist: PlaylistSummary) {
  if (playlist.status === 'GENERATING') return 'Gerando agora'
  if (playlist.status === 'FAILED') return 'Não ficou pronta'
  if (playlist.verificationStatus !== 'VERIFIED') return 'Sugestões não verificadas'
  return playlist.trackCount === 1 ? '1 música' : `${playlist.trackCount} músicas`
}

/** Uma trilha como um disco na estante: o lado (A/B/C) indica o modo musical. */
export function PlaylistDisc({ playlist, showBook = false }: { playlist: PlaylistSummary; showBook?: boolean }) {
  const side = listeningModes.find((m) => m.id === playlist.mode)?.side.replace('Lado ', '') ?? '?'

  return (
    <div className={styles.disc} data-mode={playlist.mode} data-status={playlist.status}>
      <span className={styles.record} aria-hidden="true">
        <span className={styles.label}>{side}</span>
      </span>
      <div className={styles.body}>
        <Link to={`/playlists/${playlist.id}`} className={styles.name}>
          {playlist.name ??
            (playlist.status === 'GENERATING'
              ? 'Trilha em geração'
              : playlist.status === 'FAILED'
                ? 'Geração interrompida'
                : 'Trilha sem nome')}
        </Link>
        {showBook && <p className={styles.book}>{playlist.book.title}</p>}
        <p className={styles.meta}>
          {modeName(playlist.mode)}, {dateFormat.format(new Date(playlist.createdAt))}
        </p>
        <p className={styles.status}>{statusText(playlist)}</p>
      </div>
      {playlist.spotifyUrl && (
        <a
          className={styles.spotify}
          href={playlist.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir ${playlist.name ?? 'trilha'} no Spotify`}
          title="Abrir no Spotify"
        >
          <ExternalLink size={16} strokeWidth={1.75} />
        </a>
      )}
    </div>
  )
}
