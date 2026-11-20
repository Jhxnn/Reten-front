import { Pencil, Plus, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { BookCover } from '../../components/book/BookCover'
import { FormMessage } from '../../components/form/FormMessage'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../lib/api/http'
import { spotifyOutcomeMessages } from '../spotify/api'
import { formatTotalDuration, useRemoveTrack, useReverify, type Atmosphere, type Playlist } from './api'
import { AddTrackDialog } from './AddTrackDialog'
import { EditDetailsForm } from './EditDetailsForm'
import { modeName } from './modes'
import { SpotifySavePanel } from './SpotifySavePanel'
import { TrackList } from './TrackList'
import styles from './PlaylistView.module.css'

const intensityLabels: Record<Atmosphere['emotionalIntensity'], string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
}

/** Playlist pronta: faixas confirmadas no Spotify, edição, substituições e salvamento na conta. */
export function PlaylistView({ playlist }: { playlist: Playlist }) {
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState(false)
  const remove = useRemoveTrack(playlist.id)
  const reverify = useReverify(playlist.id)
  const outcome = useSpotifyReturnMessage()

  const verified = playlist.verificationStatus === 'VERIFIED'
  const notFound = playlist.suggestions.filter((s) => s.matchStatus === 'NOT_FOUND')

  return (
    <div className={styles.page}>
      {outcome && <FormMessage tone={outcome.tone}>{outcome.text}</FormMessage>}

      <header className={styles.header}>
        <BookCover
          title={playlist.book.title}
          authors={playlist.book.authors}
          coverUrl={playlist.book.coverUrl}
          className={styles.cover}
        />
        <div className={styles.headline}>
          <p className={styles.mode}>{modeName(playlist.mode)}</p>
          {editing ? (
            <EditDetailsForm playlist={playlist} onDone={() => setEditing(false)} />
          ) : (
            <>
              <h1 className={styles.name}>{playlist.name}</h1>
              <p className={styles.book}>
                A partir de{' '}
                <Link to={`/livros/${playlist.book.id}`} className={styles.bookLink}>
                  {playlist.book.title}
                </Link>
                {playlist.book.authors.length > 0 && <>, de {playlist.book.authors.join(', ')}</>}
              </p>
              {playlist.description && <p className={styles.description}>{playlist.description}</p>}
              <p className={styles.stats}>
                {verified
                  ? `${playlist.tracks.length} músicas, ${formatTotalDuration(playlist.tracks)}`
                  : `${playlist.suggestions.length} sugestões`}
                {playlist.musicalStyle && <> — {playlist.musicalStyle}</>}
              </p>
              {verified && (
                <button type="button" className={styles.textButton} onClick={() => setEditing(true)}>
                  <Pencil size={15} strokeWidth={1.75} aria-hidden="true" /> Editar nome e descrição
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {verified && <SpotifySavePanel playlist={playlist} />}

      {verified ? (
        <section className={styles.section} aria-labelledby="faixas">
          <div className={styles.sectionHead}>
            <h2 id="faixas" className={styles.sectionTitle}>
              Músicas
            </h2>
            {/* Adicionar depende da busca no Spotify; sem integração configurada, a opção não aparece. */}
            {playlist.spotify.publishingAvailable && (
              <Button variant="quiet" onClick={() => setAdding(true)}>
                <Plus size={16} strokeWidth={2} aria-hidden="true" /> Adicionar música
              </Button>
            )}
          </div>
          {remove.error && (
            <FormMessage tone="error">
              {remove.error instanceof ApiError ? remove.error.message : 'Não foi possível remover.'}
            </FormMessage>
          )}
          {playlist.tracks.length > 0 ? (
            <TrackList
              tracks={playlist.tracks}
              onRemove={(trackId) => remove.mutate(trackId)}
              removingId={remove.isPending ? remove.variables : null}
            />
          ) : (
            <p className={styles.muted}>
              Nenhuma música na playlist.
              {playlist.spotify.publishingAvailable && ' Use “Adicionar música” para buscar no Spotify.'}
            </p>
          )}
          <p className={styles.attribution}>Músicas, capas de álbum e links fornecidos pelo Spotify.</p>
          <AddTrackDialog playlistId={playlist.id} open={adding} onClose={() => setAdding(false)} />
        </section>
      ) : (
        <UnverifiedSuggestions playlist={playlist} onRetry={() => reverify.mutate(undefined)} retrying={reverify.isPending} />
      )}

      {verified && notFound.length > 0 && (
        <section className={styles.section} aria-labelledby="nao-encontradas">
          <h2 id="nao-encontradas" className={styles.sectionTitleSmall}>
            Sugeridas pela IA, mas não encontradas no Spotify
          </h2>
          <p className={styles.muted}>
            Estas músicas ficaram de fora porque não achamos uma gravação correspondente no catálogo.
          </p>
          <ul className={styles.notFound}>
            {notFound.map((s) => (
              <li key={s.position}>
                <span className={styles.notFoundTitle}>{s.title}</span> <span className={styles.muted}>{s.artist}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {playlist.atmosphere && <AtmosphereSection atmosphere={playlist.atmosphere} />}
    </div>
  )
}

function UnverifiedSuggestions({
  playlist,
  onRetry,
  retrying,
}: {
  playlist: Playlist
  onRetry: () => void
  retrying: boolean
}) {
  // A playlist pode ter sido gerada antes de o Spotify ser configurado; se agora está disponível, dá para verificar.
  const spotifyNowAvailable = playlist.spotify.publishingAvailable
  const failed = playlist.verificationStatus === 'FAILED'
  const message = failed
    ? 'Não conseguimos confirmar estas músicas no Spotify agora. Elas ainda não são faixas verificadas.'
    : spotifyNowAvailable
      ? 'Esta playlist foi gerada antes de o Spotify estar configurado. Verifique as músicas agora: só as encontradas no catálogo entram na playlist.'
      : 'A integração com o Spotify não está configurada neste ambiente, então estas músicas não foram confirmadas no catálogo.'

  return (
    <section className={styles.section} aria-labelledby="sugestoes">
      <div className={styles.suggestionsHead}>
        <h2 id="sugestoes" className={styles.sectionTitle}>
          Sugestões da IA
        </h2>
        <p className={styles.unverified}>{message}</p>
        {(failed || spotifyNowAvailable) && (
          <Button variant="quiet" onClick={onRetry} disabled={retrying}>
            <RefreshCw size={15} strokeWidth={1.75} aria-hidden="true" />{' '}
            {retrying ? 'Verificando…' : failed ? 'Verificar no Spotify de novo' : 'Verificar no Spotify'}
          </Button>
        )}
      </div>
      <ol className={styles.list}>
        {playlist.suggestions.map((suggestion) => (
          <li key={suggestion.position} className={styles.item}>
            <span className={styles.position}>{suggestion.position}</span>
            <div>
              <p className={styles.title}>{suggestion.title}</p>
              <p className={styles.artist}>{suggestion.artist}</p>
            </div>
            <p className={styles.reason}>{suggestion.reason}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function AtmosphereSection({ atmosphere }: { atmosphere: Atmosphere }) {
  const facts = [
    { label: 'Gênero literário', value: atmosphere.literaryGenre },
    { label: 'Ambientação', value: atmosphere.setting },
    { label: 'Época', value: atmosphere.era },
    { label: 'Intensidade emocional', value: intensityLabels[atmosphere.emotionalIntensity] },
  ]
  return (
    <section className={styles.atmosphere} aria-labelledby="atmosfera">
      <h2 id="atmosfera" className={styles.sectionTitle}>
        Atmosfera identificada
      </h2>
      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.words}>
        {atmosphere.moods.length > 0 && (
          <p>
            <span className={styles.wordsLabel}>Sentimentos</span> {atmosphere.moods.join(', ')}
          </p>
        )}
        {atmosphere.themes.length > 0 && (
          <p>
            <span className={styles.wordsLabel}>Temas</span> {atmosphere.themes.join(', ')}
          </p>
        )}
      </div>
      <p className={styles.universe}>{atmosphere.universe}</p>
    </section>
  )
}

/** Mensagem do retorno do OAuth (?spotify=...) quando a pessoa conectou a conta a partir desta playlist. */
function useSpotifyReturnMessage() {
  const [params, setParams] = useSearchParams()
  const [outcome] = useState(() => {
    const status = params.get('spotify')
    const key = status === 'conectado' ? 'conectado' : params.get('motivo')
    return key ? spotifyOutcomeMessages[key] : undefined
  })
  useEffect(() => {
    if (params.has('spotify')) setParams({}, { replace: true })
  }, [params, setParams])
  if (outcome?.tone === 'success') {
    return { ...outcome, text: 'Spotify conectado. Agora é só salvar a playlist na sua conta.' }
  }
  return outcome
}
