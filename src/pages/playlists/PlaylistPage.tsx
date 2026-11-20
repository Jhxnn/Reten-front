import { useParams } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { ButtonLink } from '../../components/ui/Button'
import { PageLoading } from '../../components/ui/PageLoading'
import { usePlaylist } from '../../features/playlists/api'
import { GenerationProgress } from '../../features/playlists/GenerationProgress'
import { PlaylistView } from '../../features/playlists/PlaylistView'
import { ApiError } from '../../lib/api/http'
import styles from './PlaylistPage.module.css'

export function PlaylistPage() {
  const { id } = useParams()
  const playlist = usePlaylist(id)

  if (playlist.isPending) return <PageLoading />

  if (playlist.isError) {
    return (
      <div className={styles.message}>
        <FormMessage tone="error">
          {playlist.error instanceof ApiError ? playlist.error.message : 'Não foi possível carregar a playlist.'}
        </FormMessage>
        <ButtonLink to="/livros">Escolher um livro</ButtonLink>
      </div>
    )
  }

  const data = playlist.data
  if (data.status === 'GENERATING') return <GenerationProgress playlist={data} />

  if (data.status === 'FAILED') {
    return (
      <div className={styles.message}>
        <h1 className={styles.title}>A trilha não ficou pronta</h1>
        <FormMessage tone="error">{data.failure?.message}</FormMessage>
        <ButtonLink to={`/livros/${data.book.id}?modo=${data.mode}`}>Tentar de novo</ButtonLink>
      </div>
    )
  }

  return <PlaylistView playlist={data} />
}
