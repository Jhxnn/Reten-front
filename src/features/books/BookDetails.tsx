import { useId, useState } from 'react'
import { formatPublishedDate, type CatalogBook } from './api'
import styles from './BookDetails.module.css'

type BookDetailsProps = {
  book: CatalogBook
  /** Sinopse ainda carregando (busca não traz sinopse; ela vem dos detalhes). */
  descriptionPending?: boolean
  descriptionNote?: string
  collapsibleDescription?: boolean
}

/** Ficha do livro: título, autoria, dados de publicação, assuntos e sinopse. */
export function BookDetails({ book, descriptionPending, descriptionNote, collapsibleDescription }: BookDetailsProps) {
  const [expanded, setExpanded] = useState(false)
  const descriptionId = useId()
  // Sinopses longas ficam recolhidas para a escolha do modo musical aparecer logo abaixo.
  const canCollapse = Boolean(collapsibleDescription && book.description && book.description.length > 600)
  const collapsed = canCollapse && !expanded
  const facts = [
    { label: 'Publicação', value: formatPublishedDate(book.publishedDate) },
    { label: 'Páginas', value: book.pageCount ? String(book.pageCount) : null },
    { label: 'ISBN', value: book.isbn13 },
  ].filter((fact) => fact.value)

  return (
    <div className={styles.details}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{book.title}</h2>
        {book.subtitle && <p className={styles.subtitle}>{book.subtitle}</p>}
        <p className={styles.authors}>{book.authors.join(', ') || 'Autor desconhecido'}</p>
      </div>

      {facts.length > 0 && (
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {book.categories.length > 0 && (
        <div>
          <h3 className={styles.sectionLabel}>Assuntos</h3>
          <p className={styles.categories}>{book.categories.join(', ')}</p>
        </div>
      )}

      <div>
        <h3 className={styles.sectionLabel}>Sinopse</h3>
        {descriptionPending ? (
          <p className={styles.muted}>Carregando sinopse…</p>
        ) : book.description ? (
          <>
            <div
              id={descriptionId}
              className={`${styles.description} ${collapsed ? styles.collapsed : ''}`}
            >
              {book.description.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {canCollapse && (
              <button
                type="button"
                className={styles.toggle}
                aria-expanded={!collapsed}
                aria-controls={descriptionId}
                onClick={() => setExpanded((value) => !value)}
              >
                {collapsed ? 'Ler sinopse completa' : 'Mostrar menos'}
              </button>
            )}
            {descriptionNote && <p className={styles.note}>{descriptionNote}</p>}
          </>
        ) : (
          <p className={styles.muted}>
            O catálogo não tem sinopse para este livro. Você poderá descrever a história com suas palavras ao criar a
            trilha.
          </p>
        )}
      </div>
    </div>
  )
}
