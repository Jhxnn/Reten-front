import { Link } from 'react-router'
import { BookCover } from '../../components/book/BookCover'
import { FormMessage } from '../../components/form/FormMessage'
import { ButtonLink } from '../../components/ui/Button'
import { PageLoading } from '../../components/ui/PageLoading'
import { useLibrary } from '../../features/library/api'
import { PlaylistDisc } from '../../features/library/PlaylistDisc'
import styles from './LibraryPage.module.css'

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`
}

/** A estante pessoal: cada livro numa prateleira, com as trilhas criadas a partir dele. */
export function LibraryPage() {
  const library = useLibrary()

  if (library.isPending) return <PageLoading />
  if (library.isError) return <FormMessage tone="error">Não foi possível carregar sua biblioteca.</FormMessage>

  const { books, bookCount, playlistCount } = library.data

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Minha biblioteca</h1>
        {bookCount > 0 && (
          <p className={styles.counts}>
            {plural(bookCount, 'livro', 'livros')} e {plural(playlistCount, 'trilha sonora', 'trilhas sonoras')}
          </p>
        )}
      </header>

      {books.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            Sua estante ainda está vazia. Escolha um livro e ele aparece aqui, com cada trilha que você criar para ele.
          </p>
          <ButtonLink to="/livros">Escolher um livro</ButtonLink>
        </div>
      ) : (
        <ul className={styles.shelves}>
          {books.map((entry) => (
            <li key={entry.book.id} className={styles.shelf}>
              <Link to={`/livros/${entry.book.id}`} className={styles.coverLink} aria-label={`Abrir ${entry.book.title}`}>
                <BookCover title={entry.book.title} authors={entry.book.authors} coverUrl={entry.book.coverUrl} />
              </Link>
              <div className={styles.content}>
                <div className={styles.bookHead}>
                  <div>
                    <h2 className={styles.bookTitle}>
                      <Link to={`/livros/${entry.book.id}`}>{entry.book.title}</Link>
                    </h2>
                    <p className={styles.author}>{entry.book.authors.join(', ') || 'Autor desconhecido'}</p>
                  </div>
                  <Link to={`/livros/${entry.book.id}`} className={styles.newTrack}>
                    {entry.playlists.length === 0 ? 'Criar a primeira trilha' : 'Gerar outra trilha'}
                  </Link>
                </div>
                {entry.playlists.length > 0 ? (
                  <ul className={styles.discs}>
                    {entry.playlists.map((playlist) => (
                      <li key={playlist.id}>
                        <PlaylistDisc playlist={playlist} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noTracks}>Nenhuma trilha ainda para este livro.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
