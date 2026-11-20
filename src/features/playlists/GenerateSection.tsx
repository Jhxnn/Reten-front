import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../lib/api/http'
import { useGeneratePlaylist, useGenerationUsage, type ListeningMode } from './api'
import { listeningModes } from './modes'
import styles from './GenerateSection.module.css'

const MAX_NOTES = 500
const timeFormat = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

type GenerateSectionProps = {
  bookId: string
  initialMode?: ListeningMode
}

/** Escolha do modo musical + impressões opcionais do leitor + disparo da geração. */
export function GenerateSection({ bookId, initialMode = 'THEMATIC' }: GenerateSectionProps) {
  const [mode, setMode] = useState<ListeningMode>(initialMode)
  const [notes, setNotes] = useState('')
  const usage = useGenerationUsage()
  const generate = useGeneratePlaylist()
  const navigate = useNavigate()
  const notesId = useId()

  const aiMissing = usage.data && !usage.data.aiConfigured
  const limitReached = usage.data && usage.data.remaining === 0
  const error =
    generate.error instanceof ApiError
      ? generate.error.code === 'validation_failed'
        ? generate.error.fields.notes ?? generate.error.message
        : generate.error.message
      : generate.error
        ? 'Não foi possível começar a geração. Tente de novo.'
        : null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    generate.mutate(
      { bookId, mode, notes: notes.trim() || undefined },
      { onSuccess: (playlist) => navigate(`/playlists/${playlist.id}`) },
    )
  }

  return (
    <section className={styles.section} aria-labelledby="gerar-titulo">
      <h2 id="gerar-titulo" className={styles.title}>
        Como você quer ouvir este livro?
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset className={styles.modes}>
          <legend className="visually-hidden">Modo musical</legend>
          {listeningModes.map((option) => (
            <label key={option.id} className={styles.mode} data-selected={mode === option.id}>
              <input
                type="radio"
                name="modo"
                value={option.id}
                checked={mode === option.id}
                onChange={() => setMode(option.id)}
                className="visually-hidden"
              />
              <span className={styles.groove} aria-hidden="true" />
              <span className={styles.side}>{option.side}</span>
              <span className={styles.modeName}>{option.name}</span>
              <span className={styles.summary}>{option.summary}</span>
            </label>
          ))}
        </fieldset>

        <div className={styles.notes}>
          <label htmlFor={notesId} className={styles.notesLabel}>
            O que este livro despertou em você? <span className={styles.optional}>Opcional</span>
          </label>
          <textarea
            id={notesId}
            className={styles.textarea}
            rows={3}
            maxLength={MAX_NOTES}
            placeholder="Ex.: a solidão do personagem, a chuva constante, o final que me deixou sem ar…"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <p className={styles.counter}>
            {notes.length}/{MAX_NOTES}
          </p>
        </div>

        {aiMissing && (
          <FormMessage tone="info">
            A inteligência artificial ainda não foi configurada neste ambiente, então a geração está indisponível.
          </FormMessage>
        )}
        {!aiMissing && limitReached && usage.data?.resetsAt && (
          <FormMessage tone="info">
            Você usou as {usage.data.limit} gerações das últimas 24 horas. A próxima libera às{' '}
            {timeFormat.format(new Date(usage.data.resetsAt))}.
          </FormMessage>
        )}
        {error && <FormMessage tone="error">{error}</FormMessage>}

        <div className={styles.actions}>
          <Button type="submit" disabled={generate.isPending || Boolean(aiMissing) || Boolean(limitReached)}>
            {generate.isPending ? 'Começando…' : 'Gerar trilha sonora'}
          </Button>
          {usage.data && usage.data.aiConfigured && (
            <p className={styles.usage}>
              {usage.data.remaining} de {usage.data.limit} gerações disponíveis nas próximas 24 horas
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
