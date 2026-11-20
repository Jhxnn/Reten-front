import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { BookCover } from '../../components/book/BookCover'
import { FormMessage } from '../../components/form/FormMessage'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../lib/api/http'
import { useCatalogBook, useSelectBook, type CatalogBook, type CatalogSource } from './api'
import { BookDetails } from './BookDetails'
import styles from './BookPreviewDialog.module.css'

type BookPreviewDialogProps = {
  /** Livro clicado na busca (já mostra título/capa enquanto os detalhes carregam). */
  book: CatalogBook | null
  source: CatalogSource
  onClose: () => void
}

/** Painel lateral (gaveta inferior no celular) com os detalhes antes de escolher o livro. */
export function BookPreviewDialog({ book, source, onClose }: BookPreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const details = useCatalogBook(book?.catalogId ?? null)
  const select = useSelectBook()
  const navigate = useNavigate()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (book && !dialog.open) dialog.showModal()
    if (!book && dialog.open) dialog.close()
  }, [book])

  const shown = details.data ?? book

  function choose() {
    if (!book) return
    select.mutate(book.catalogId, { onSuccess: (saved) => navigate(`/livros/${saved.id}`) })
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="livro-preview-titulo"
      onClose={onClose}
      onClick={(event) => {
        // Clique no fundo escurecido fecha.
        if (event.target === dialogRef.current) onClose()
      }}
    >
      {shown && (
        <div className={styles.inner}>
          <div className={styles.top}>
            <span id="livro-preview-titulo" className="visually-hidden">
              {shown.title}
            </span>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
              <X size={20} strokeWidth={1.75} />
            </button>
          </div>

          <div className={styles.body}>
            <BookCover title={shown.title} authors={shown.authors} coverUrl={shown.coverUrl} className={styles.cover} />
            <BookDetails
              book={shown}
              descriptionPending={details.isPending}
              descriptionUnavailable={details.isError}
              descriptionNote={source === 'openlibrary' && shown.description ? 'Sinopse do Open Library, muitas vezes em inglês.' : undefined}
            />
          </div>

          <div className={styles.actions}>
            {details.isError && (
              <FormMessage tone="error">
                {details.error instanceof ApiError ? details.error.message : 'Não foi possível carregar os detalhes.'}
              </FormMessage>
            )}
            {select.isError && (
              <FormMessage tone="error">
                {select.error instanceof ApiError ? select.error.message : 'Não foi possível escolher este livro.'}
              </FormMessage>
            )}
            <Button onClick={choose} disabled={select.isPending}>
              {select.isPending ? 'Guardando…' : 'Escolher este livro'}
            </Button>
          </div>
        </div>
      )}
    </dialog>
  )
}
