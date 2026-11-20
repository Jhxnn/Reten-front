import { BookCover } from '../../components/book/BookCover'
import styles from './BookGrid.module.css'

type GridBook = {
  key: string
  title: string
  authors: string[]
  coverUrl: string | null
  meta?: string | null
}

type BookGridProps = {
  books: GridBook[]
  onSelect: (key: string) => void
  /** Rótulo acessível de cada botão, ex.: "Ver detalhes de". */
  actionLabel: string
}

/** Livros como numa estante de capas: a capa é o elemento principal, sem moldura de card. */
export function BookGrid({ books, onSelect, actionLabel }: BookGridProps) {
  return (
    <ul className={styles.grid}>
      {books.map((book) => (
        <li key={book.key}>
          <button
            type="button"
            className={styles.item}
            onClick={() => onSelect(book.key)}
            aria-label={`${actionLabel} ${book.title}`}
          >
            <BookCover title={book.title} authors={book.authors} coverUrl={book.coverUrl} className={styles.cover} />
            <span className={styles.title}>{book.title}</span>
            <span className={styles.author}>{book.authors.join(', ') || 'Autor desconhecido'}</span>
            {book.meta && <span className={styles.meta}>{book.meta}</span>}
          </button>
        </li>
      ))}
    </ul>
  )
}
