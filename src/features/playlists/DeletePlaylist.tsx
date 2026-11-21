import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../lib/api/http'
import { useDeletePlaylist } from './api'
import styles from './DeletePlaylist.module.css'

/** Apaga a playlist do Resten com confirmação. A cópia já salva no Spotify continua na conta. */
export function DeletePlaylist({ playlistId, savedOnSpotify }: { playlistId: string; savedOnSpotify: boolean }) {
  const [confirming, setConfirming] = useState(false)
  const remove = useDeletePlaylist()
  const navigate = useNavigate()

  if (!confirming) {
    return (
      <button type="button" className={styles.trigger} onClick={() => setConfirming(true)}>
        <Trash2 size={15} strokeWidth={1.75} aria-hidden="true" /> Apagar esta playlist
      </button>
    )
  }

  return (
    <div className={styles.confirm} role="group" aria-labelledby="apagar-titulo">
      <p id="apagar-titulo" className={styles.question}>
        Apagar esta playlist do Resten?
      </p>
      <p className={styles.detail}>
        {savedOnSpotify
          ? 'Ela libera uma vaga na sua biblioteca. A cópia salva no Spotify continua na sua conta.'
          : 'Ela libera uma vaga na sua biblioteca. Não dá para desfazer.'}
      </p>
      {remove.error && (
        <FormMessage tone="error">
          {remove.error instanceof ApiError ? remove.error.message : 'Não foi possível apagar. Tente de novo.'}
        </FormMessage>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.danger}
          disabled={remove.isPending}
          onClick={() => remove.mutate(playlistId, { onSuccess: () => navigate('/biblioteca', { replace: true }) })}
        >
          {remove.isPending ? 'Apagando…' : 'Apagar'}
        </button>
        <Button variant="quiet" onClick={() => setConfirming(false)} disabled={remove.isPending}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
