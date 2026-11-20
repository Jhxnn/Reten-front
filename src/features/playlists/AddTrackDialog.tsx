import { Plus, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FormMessage } from '../../components/form/FormMessage'
import { PageLoading } from '../../components/ui/PageLoading'
import { ApiError } from '../../lib/api/http'
import { useDebouncedValue } from '../../lib/useDebouncedValue'
import { formatDuration, useAddTrack, useReplacementSearch } from './api'
import styles from './AddTrackDialog.module.css'

type AddTrackDialogProps = {
  playlistId: string
  open: boolean
  onClose: () => void
}

/** Busca no Spotify para substituir ou acrescentar músicas. Só faixas reais do catálogo aparecem. */
export function AddTrackDialog({ playlistId, open, onClose }: AddTrackDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [text, setText] = useState('')
  const query = useDebouncedValue(text, 400)
  const results = useReplacementSearch(playlistId, open ? query : '')
  const add = useAddTrack(playlistId)
  const [added, setAdded] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // autoFocus não é confiável com showModal(); o foco vai explicitamente para a busca.
      inputRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const error = add.error instanceof ApiError ? add.error.message : add.error ? 'Não foi possível adicionar.' : null
  const searchError =
    results.error instanceof ApiError ? results.error.message : results.error ? 'Não foi possível buscar agora.' : null

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="adicionar-titulo"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="adicionar-titulo" className={styles.title}>
            Adicionar música
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className={styles.search}>
          <Search size={18} strokeWidth={1.75} className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            placeholder="Nome da música ou artista"
            aria-label="Buscar no Spotify"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>

        <div className={styles.results} aria-live="polite">
          {query.trim().length >= 2 && results.isPending && <PageLoading />}
          {searchError && <FormMessage tone="error">{searchError}</FormMessage>}
          {error && <FormMessage tone="error">{error}</FormMessage>}
          {results.data && results.data.length === 0 && (
            <p className={styles.empty}>Nada encontrado no Spotify para “{query.trim()}”.</p>
          )}
          <ul className={styles.list}>
            {results.data?.map((track) => {
              const done = added.includes(track.spotifyTrackId)
              return (
                <li key={track.spotifyTrackId} className={styles.item}>
                  {track.imageUrl ? (
                    <img className={styles.art} src={track.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" />
                  ) : (
                    <span className={styles.art} aria-hidden="true" />
                  )}
                  <div className={styles.main}>
                    <p className={styles.name}>{track.name}</p>
                    <p className={styles.meta}>
                      {track.artists.join(', ')}
                      {track.durationMs ? ` — ${formatDuration(track.durationMs)}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.add}
                    disabled={done || add.isPending}
                    onClick={() =>
                      add.mutate(track.spotifyTrackId, {
                        onSuccess: () => setAdded((current) => [...current, track.spotifyTrackId]),
                      })
                    }
                  >
                    {done ? (
                      'Adicionada'
                    ) : (
                      <>
                        <Plus size={16} strokeWidth={2} aria-hidden="true" /> Adicionar
                      </>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </dialog>
  )
}
