import { ArrowLeft } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router'
import { usePlaylistSummaries } from '../../features/library/api'
import { PlaylistDisc } from '../../features/library/PlaylistDisc'
import { GenerateSection } from '../../features/playlists/GenerateSection'
import { listeningModes } from '../../features/playlists/modes'
import { BookCover } from '../../components/book/BookCover'
import { FormMessage } from '../../components/form/FormMessage'
import { PageLoading } from '../../components/ui/PageLoading'
import { useBook } from '../../features/books/api'
import { BookDetails } from '../../features/books/BookDetails'
import { ApiError } from '../../lib/api/http'
import styles from './BookPage.module.css'

/** Livro escolhido: resumo da obra e escolha de como ouvi-lo. */
export function BookPage() {
  const { id } = useParams()
  const book = useBook(id)
  // ?modo=VOCAL pré-seleciona o modo (usado em "tentar de novo" e "outra versão").
  const [params] = useSearchParams()
  const modeParam = listeningModes.find((m) => m.id === params.get('modo'))?.id
  const existing = usePlaylistSummaries({ bookId: id })

  if (book.isPending) return <PageLoading />

  if (book.isError) {
    return (
      <div className={styles.page}>
        <FormMessage tone="error">
          {book.error instanceof ApiError && book.error.status === 404
            ? 'Este livro não está no Reten. Pesquise e escolha de novo.'
            : 'Não foi possível carregar o livro.'}
        </FormMessage>
        <Link to="/livros" className={styles.back}>
          <ArrowLeft size={16} aria-hidden="true" /> Buscar livros
        </Link>
      </div>
    )
  }

  const data = book.data
  return (
    <div className={styles.page}>
      <Link to="/livros" className={styles.back}>
        <ArrowLeft size={16} aria-hidden="true" /> Escolher outro livro
      </Link>

      <article className={styles.layout}>
        <BookCover title={data.title} authors={data.authors} coverUrl={data.coverUrl} className={styles.cover} />
        <BookDetails
          book={data}
          collapsibleDescription
          descriptionNote={data.catalogId.startsWith('openlibrary:') && data.description ? 'Sinopse do Open Library, muitas vezes em inglês.' : undefined}
        />
      </article>

      {existing.data && existing.data.length > 0 && (
        <section className={styles.existing} aria-labelledby="trilhas-do-livro">
          <h2 id="trilhas-do-livro" className={styles.existingTitle}>
            Trilhas que você já criou para este livro
          </h2>
          <ul className={styles.discs}>
            {existing.data.map((playlist) => (
              <li key={playlist.id}>
                <PlaylistDisc playlist={playlist} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <GenerateSection bookId={data.id} initialMode={modeParam} />
    </div>
  )
}
