import { Link } from 'react-router'
import { BookCover } from '../../components/book/BookCover'
import type { Atmosphere, Playlist } from './api'
import { modeName } from './modes'
import styles from './PlaylistView.module.css'

const intensityLabels: Record<Atmosphere['emotionalIntensity'], string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
}

/** Resultado da geração: a experiência musical proposta e as sugestões da IA, ainda não verificadas. */
export function PlaylistView({ playlist }: { playlist: Playlist }) {
  const atmosphere = playlist.atmosphere
  const facts = atmosphere
    ? [
        { label: 'Gênero literário', value: atmosphere.literaryGenre },
        { label: 'Ambientação', value: atmosphere.setting },
        { label: 'Época', value: atmosphere.era },
        { label: 'Intensidade emocional', value: intensityLabels[atmosphere.emotionalIntensity] },
      ]
    : []

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <BookCover
          title={playlist.book.title}
          authors={playlist.book.authors}
          coverUrl={playlist.book.coverUrl}
          className={styles.cover}
        />
        <div className={styles.headline}>
          <p className={styles.mode}>{modeName(playlist.mode)}</p>
          <h1 className={styles.name}>{playlist.name}</h1>
          <p className={styles.book}>
            A partir de{' '}
            <Link to={`/livros/${playlist.book.id}`} className={styles.bookLink}>
              {playlist.book.title}
            </Link>
            {playlist.book.authors.length > 0 && <>, de {playlist.book.authors.join(', ')}</>}
          </p>
          <p className={styles.description}>{playlist.description}</p>
          {playlist.musicalStyle && <p className={styles.style}>{playlist.musicalStyle}</p>}
        </div>
      </header>

      {atmosphere && (
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
      )}

      <section className={styles.suggestions} aria-labelledby="sugestoes">
        <div className={styles.suggestionsHead}>
          <h2 id="sugestoes" className={styles.sectionTitle}>
            Sugestões da IA
          </h2>
          <p className={styles.unverified}>
            Estas músicas ainda não foram confirmadas no Spotify. Na próxima etapa, cada uma é procurada no catálogo e só
            as encontradas entram na playlist.
          </p>
        </div>
        <ol className={styles.list}>
          {playlist.suggestions.map((suggestion) => (
            <li key={suggestion.position} className={styles.item}>
              <span className={styles.position}>{suggestion.position}</span>
              <div className={styles.track}>
                <p className={styles.title}>{suggestion.title}</p>
                <p className={styles.artist}>{suggestion.artist}</p>
              </div>
              <p className={styles.reason}>{suggestion.reason}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
