import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { PageLoading } from '../../components/ui/PageLoading'
import { sourceLabels, useBookSearch, useRecentBooks, type CatalogBook, type SearchField } from '../../features/books/api'
import { BookGrid } from '../../features/books/BookGrid'
import { BookPreviewDialog } from '../../features/books/BookPreviewDialog'
import { ApiError } from '../../lib/api/http'
import { useDebouncedValue } from '../../lib/useDebouncedValue'
import styles from './BookSearchPage.module.css'

const fields: { value: SearchField; label: string; placeholder: string }[] = [
  { value: 'all', label: 'Tudo', placeholder: 'Título, autor ou ISBN' },
  { value: 'title', label: 'Título', placeholder: 'Ex.: O Nome do Vento' },
  { value: 'author', label: 'Autor', placeholder: 'Ex.: Clarice Lispector' },
  { value: 'isbn', label: 'ISBN', placeholder: 'Ex.: 978-65-5565-185-0' },
]

export function BookSearchPage() {
  const [params, setParams] = useSearchParams()
  const [text, setText] = useState(params.get('q') ?? '')
  const field = (fields.find((f) => f.value === params.get('por'))?.value ?? 'all') as SearchField
  const query = useDebouncedValue(text, 400)
  const search = useBookSearch(query, field)
  const recent = useRecentBooks()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<CatalogBook | null>(null)

  const searching = query.trim().length >= 2
  const results = search.data?.results ?? []

  function updateParams(next: { q?: string; por?: SearchField }) {
    const q = next.q ?? text
    const por = next.por ?? field
    setParams(
      {
        ...(q.trim() ? { q: q.trim() } : {}),
        ...(por !== 'all' ? { por } : {}),
      },
      { replace: true },
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Qual livro vamos ouvir?</h1>

      <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="busca-livro" className="visually-hidden">
          Buscar livro
        </label>
        <Search className={styles.icon} size={22} strokeWidth={1.75} aria-hidden="true" />
        <input
          id="busca-livro"
          className={styles.input}
          type="search"
          autoComplete="off"
          autoFocus
          placeholder={fields.find((f) => f.value === field)?.placeholder}
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            updateParams({ q: event.target.value })
          }}
        />
      </form>

      <div className={styles.fields} role="radiogroup" aria-label="Buscar por">
        {fields.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={field === option.value}
            className={styles.field}
            onClick={() => updateParams({ por: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section className={styles.results} aria-live="polite" aria-busy={search.isFetching}>
        {!searching && (
          <>
            {recent.data && recent.data.length > 0 ? (
              <>
                <h2 className={styles.sectionTitle}>Usados recentemente</h2>
                <BookGrid
                  actionLabel="Abrir"
                  onSelect={(id) => navigate(`/livros/${id}`)}
                  books={recent.data.map((book) => ({
                    key: book.id,
                    title: book.title,
                    authors: book.authors,
                    coverUrl: book.coverUrl,
                  }))}
                />
              </>
            ) : (
              <p className={styles.hint}>
                Pesquise pelo título, pelo nome de quem escreveu ou pelo ISBN que aparece no verso do livro.
              </p>
            )}
          </>
        )}

        {searching && search.isPending && <PageLoading />}

        {searching && search.isError && (
          <FormMessage tone="error">
            {search.error instanceof ApiError ? search.error.message : 'Não foi possível buscar agora.'}
          </FormMessage>
        )}

        {searching && search.isSuccess && results.length === 0 && (
          <p className={styles.hint}>
            Nenhum livro encontrado para “{query.trim()}”. Tente outra grafia, só o sobrenome do autor ou o ISBN.
          </p>
        )}

        {searching && results.length > 0 && (
          <>
            <BookGrid
              actionLabel="Ver detalhes de"
              onSelect={(catalogId) => setPreview(results.find((book) => book.catalogId === catalogId) ?? null)}
              books={results.map((book) => ({
                key: book.catalogId,
                title: book.title,
                authors: book.authors,
                coverUrl: book.coverUrl,
                meta: book.publishedDate?.slice(0, 4),
              }))}
            />
            {search.data && (
              <p className={styles.attribution}>Dados de livros: {sourceLabels[search.data.source]}</p>
            )}
          </>
        )}
      </section>

      <BookPreviewDialog book={preview} source={search.data?.source ?? 'openlibrary'} onClose={() => setPreview(null)} />
    </div>
  )
}
