import { useEffect, useState } from 'react'
import { BookCover } from '../../components/book/BookCover'
import type { Playlist } from './api'
import { modeName } from './modes'
import styles from './GenerationProgress.module.css'

const stages = [
  'Analisando a atmosfera do livro',
  'Interpretando os sentimentos da história',
  'Encontrando músicas compatíveis',
  'Preparando sua playlist',
]
const STAGE_MS = 7000
const BAR_COUNT = 28

/**
 * Espera da geração como parte do universo do Resten: o livro à esquerda e, ao lado,
 * uma estante-equalizador que pulsa enquanto a IA trabalha.
 * As etapas avançam com o tempo e param na última até o servidor responder.
 */
export function GenerationProgress({ playlist }: { playlist: Playlist }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), STAGE_MS)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className={styles.wrap} aria-live="polite" aria-busy="true">
      <BookCover
        title={playlist.book.title}
        authors={playlist.book.authors}
        coverUrl={playlist.book.coverUrl}
        className={styles.cover}
      />

      <div className={styles.body}>
        <p className={styles.context}>
          {modeName(playlist.mode)} para <em>{playlist.book.title}</em>
        </p>

        <div className={styles.bars} aria-hidden="true">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <span key={i} style={{ animationDelay: `${(i * 97) % 900}ms`, animationDuration: `${900 + ((i * 53) % 700)}ms` }} />
          ))}
        </div>

        <ol className={styles.stages}>
          {stages.map((text, index) => (
            <li
              key={text}
              className={styles.stage}
              data-state={index < stage ? 'done' : index === stage ? 'current' : 'next'}
              aria-current={index === stage ? 'step' : undefined}
            >
              {text}
            </li>
          ))}
        </ol>

        <p className={styles.hint}>Costuma levar entre 20 segundos e 1 minuto. Você pode deixar esta página aberta.</p>
      </div>
    </section>
  )
}
