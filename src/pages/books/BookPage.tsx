import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { BookCover } from '../../components/book/BookCover'
import { FormMessage } from '../../components/form/FormMessage'
import { PageLoading } from '../../components/ui/PageLoading'
import { useBook } from '../../features/books/api'
import { BookDetails } from '../../features/books/BookDetails'
import { ApiError } from '../../lib/api/http'
import styles from './BookPage.module.css'

/** Livro escolhido: resumo da obra. A Fase 4 adiciona aqui a escolha do estilo musical. */
export function BookPage() {
  const { id } = useParams()
  const book = useBook(id)

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
          descriptionNote={data.catalogId.startsWith('openlibrary:') && data.description ? 'Sinopse do Open Library, muitas vezes em inglês.' : undefined}
        />
      </article>

      <section className={styles.next} aria-labelledby="proximo-passo">
        <h2 id="proximo-passo" className={styles.nextTitle}>
          Como você quer ouvir este livro?
        </h2>
        <p className={styles.nextText}>
          A escolha entre trilha temática, músicas com voz e modo concentração, e a geração da playlist, chegam na
          próxima etapa do Reten.
        </p>
      </section>
    </div>
  )
}
