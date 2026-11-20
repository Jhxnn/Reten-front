import { useState, type FormEvent } from 'react'
import { FormMessage } from '../../components/form/FormMessage'
import { TextField } from '../../components/form/TextField'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../lib/api/http'
import { useUpdatePlaylist, type Playlist } from './api'
import styles from './EditDetailsForm.module.css'

type EditDetailsFormProps = {
  playlist: Playlist
  onDone: () => void
}

export function EditDetailsForm({ playlist, onDone }: EditDetailsFormProps) {
  const [name, setName] = useState(playlist.name ?? '')
  const [description, setDescription] = useState(playlist.description ?? '')
  const update = useUpdatePlaylist(playlist.id)
  const fields = update.error instanceof ApiError ? update.error.fields : {}
  const general =
    update.error instanceof ApiError && update.error.code !== 'validation_failed' ? update.error.message : null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    update.mutate({ name, description: description.trim() || null }, { onSuccess: onDone })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {general && <FormMessage tone="error">{general}</FormMessage>}
      <TextField label="Nome da playlist" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} error={fields.name} />
      <div className={styles.field}>
        <label htmlFor="descricao-playlist" className={styles.label}>
          Descrição
        </label>
        <textarea
          id="descricao-playlist"
          className={styles.textarea}
          rows={3}
          maxLength={1000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className={styles.hint}>No Spotify, a descrição aparece encurtada para 300 caracteres.</p>
      </div>
      <div className={styles.actions}>
        <Button type="submit" disabled={update.isPending}>
          {update.isPending ? 'Salvando…' : 'Salvar alterações'}
        </Button>
        <Button type="button" variant="quiet" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
