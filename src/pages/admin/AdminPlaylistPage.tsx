import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { PageLoading } from '../../components/ui/PageLoading'
import { formatDateTime, statusName, useAdminPlaylist } from '../../features/admin/api'
import { modeName } from '../../features/playlists/modes'
import { ApiError } from '../../lib/api/http'
import styles from './Admin.module.css'

/** Uma playlist vista pelo administrador: dados, quem criou e as músicas com o motivo de cada uma. */
export function AdminPlaylistPage() {
  const { id = '' } = useParams()
  const detail = useAdminPlaylist(id)

  if (detail.isPending) return <PageLoading />
  if (detail.isError) {
    const notFound = detail.error instanceof ApiError && detail.error.status === 404
    return (
      <div className={styles.page}>
        <BackLink />
        <FormMessage tone="error">{notFound ? 'Playlist não encontrada.' : 'Não foi possível carregar a playlist.'}</FormMessage>
      </div>
    )
  }

  const { playlist, tracks } = detail.data

  return (
    <div className={styles.page}>
      <BackLink ownerId={playlist.ownerId} />

      <header className={styles.header}>
        <p className={styles.eyebrow}>
          <span className={styles.status} data-status={playlist.deletedAt ? 'DELETED' : playlist.status}>
            {statusName(playlist)}
          </span>
          {modeName(playlist.mode)}
        </p>
        <h1 className={styles.title}>{playlist.name ?? 'Sem nome'}</h1>
        <p className={styles.lede}>
          {playlist.bookTitle}
          {playlist.bookAuthors.length > 0 && <>, de {playlist.bookAuthors.join(', ')}</>}
        </p>
      </header>

      <dl className={styles.facts}>
        <div>
          <dt>Leitor</dt>
          <dd>
            {playlist.ownerName}
            <span className={styles.secondary}>{playlist.ownerEmail}</span>
          </dd>
        </div>
        <div>
          <dt>Criada</dt>
          <dd>{formatDateTime(playlist.createdAt)}</dd>
        </div>
        {playlist.deletedAt && (
          <div>
            <dt>Apagada</dt>
            <dd>{formatDateTime(playlist.deletedAt)}</dd>
          </div>
        )}
        <div>
          <dt>Spotify</dt>
          <dd>
            {detail.data.spotifyPlaylistUrl ? (
              <a href={detail.data.spotifyPlaylistUrl} target="_blank" rel="noreferrer" className={styles.primaryLink}>
                Abrir no Spotify <ExternalLink size={14} aria-hidden="true" />
              </a>
            ) : (
              'Não salva'
            )}
          </dd>
        </div>
      </dl>

      {(detail.data.userNotes || detail.data.description || detail.data.failureCode) && (
        <div className={styles.notes}>
          {detail.data.userNotes && (
            <p>
              <strong>O que o leitor contou:</strong> {detail.data.userNotes}
            </p>
          )}
          {detail.data.description && (
            <p>
              <strong>Descrição da IA:</strong> {detail.data.description}
            </p>
          )}
          {detail.data.failureCode && (
            <p>
              <strong>Motivo da falha:</strong> <code>{detail.data.failureCode}</code>
            </p>
          )}
        </div>
      )}

      <section className={styles.section} aria-labelledby="musicas">
        <h2 id="musicas" className={styles.sectionTitle}>
          {tracks.length} {tracks.length === 1 ? 'música' : 'músicas'}
        </h2>
        {tracks.length === 0 ? (
          <p className={styles.empty}>Nenhuma música verificada nesta playlist.</p>
        ) : (
          <ol className={styles.tracks}>
            {tracks.map((track) => (
              <li key={track.position} className={styles.track}>
                <span className={styles.trackPosition}>{track.position}</span>
                <div>
                  <a href={track.spotifyUrl} target="_blank" rel="noreferrer" className={styles.primaryLink}>
                    {track.name}
                  </a>
                  <span className={styles.secondary}>
                    {track.artists.join(', ')}
                    {track.album && <> · {track.album}</>}
                    {track.source === 'MANUAL' && <> · adicionada pelo leitor</>}
                  </span>
                  {track.reason && <p className={styles.reason}>{track.reason}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

function BackLink({ ownerId }: { ownerId?: string }) {
  return (
    <Link to={ownerId ? `/admin?usuario=${ownerId}` : '/admin'} className={styles.back}>
      <ArrowLeft size={16} aria-hidden="true" /> Administração
    </Link>
  )
}
