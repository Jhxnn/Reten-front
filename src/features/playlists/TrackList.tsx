import { ExternalLink, X } from 'lucide-react'
import { formatDuration, type Track } from './api'
import styles from './TrackList.module.css'

type TrackListProps = {
  tracks: Track[]
  onRemove?: (trackId: string) => void
  removingId?: string | null
}

/** Faixas confirmadas no Spotify, cada uma com o motivo da escolha e o link para ouvir lá. */
export function TrackList({ tracks, onRemove, removingId }: TrackListProps) {
  return (
    <ol className={styles.list}>
      {tracks.map((track) => (
        <li key={track.id} className={styles.row} data-removing={removingId === track.id || undefined}>
          <span className={styles.position}>{track.position}</span>
          {track.imageUrl ? (
            <img className={styles.art} src={track.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" />
          ) : (
            <span className={styles.art} aria-hidden="true" />
          )}
          <div className={styles.main}>
            <p className={styles.title}>{track.name}</p>
            <p className={styles.meta}>
              {track.artists.join(', ')}
              {track.album && <span className={styles.album}> — {track.album}</span>}
            </p>
            {track.reason ? (
              <p className={styles.reason}>{track.reason}</p>
            ) : track.source === 'MANUAL' ? (
              <p className={styles.reason}>Escolhida por você.</p>
            ) : null}
          </div>
          <span className={styles.duration}>{formatDuration(track.durationMs)}</span>
          <div className={styles.actions}>
            <a
              className={styles.icon}
              href={track.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ouvir ${track.name} no Spotify`}
              title="Ouvir no Spotify"
            >
              <ExternalLink size={18} strokeWidth={1.75} />
            </a>
            {onRemove && (
              <button
                type="button"
                className={styles.icon}
                onClick={() => onRemove(track.id)}
                disabled={removingId === track.id}
                aria-label={`Remover ${track.name}`}
                title="Remover da playlist"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
