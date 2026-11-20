import type { CSSProperties } from 'react'
import { shelfTitles } from '../content'
import styles from './Bookshelf.module.css'

// Lombadas suficientes para preencher telas largas; o excesso é cortado pelo overflow.
const SPINE_COUNT = 84
const TITLE_EVERY = 5
// O hero é verde quase preto: as lombadas usam os tons mais claros da paleta para contrastar.
const tones = ['forest', 'moss', 'mint', 'sage', 'surface', 'forest'] as const

/** Pseudo-aleatório determinístico: a estante é sempre a mesma em todo render. */
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** Altura (0–1) de cada lombada: a soma de três senoides desenha uma onda sonora. */
function waveAt(i: number) {
  const v = 0.55 + 0.26 * Math.sin(i * 0.3) + 0.14 * Math.sin(i * 1.07 + 1.3) + 0.06 * Math.sin(i * 2.9)
  return Math.min(0.99, Math.max(0.24, v))
}

type Spine = {
  height: number
  width: number
  tone: (typeof tones)[number]
  title?: string
}

const spines: Spine[] = Array.from({ length: SPINE_COUNT }, (_, i) => {
  const titled = i % TITLE_EVERY === 2
  const title = titled ? shelfTitles[Math.floor(i / TITLE_EVERY) % shelfTitles.length] : undefined
  return {
    height: titled ? Math.max(waveAt(i), 0.86) : waveAt(i),
    width: titled ? 2.35 : 0.55 + noise(i + 1) * 1.05,
    tone: tones[Math.floor(noise(i + 7) * tones.length)],
    title,
  }
})

/**
 * A estante que toca: lombadas alinhadas cujas alturas formam uma onda sonora.
 * É o único momento de movimento automático da página — a estante "sobe" uma vez ao carregar.
 */
export function Bookshelf() {
  return (
    <div className={styles.shelf} aria-hidden="true">
      <div className={styles.row}>
        {spines.map((spine, i) => (
          <div
            key={i}
            className={`${styles.spine} ${styles[spine.tone]}`}
            style={{ '--h': spine.height, '--w': `${spine.width}rem`, '--i': i } as CSSProperties}
          >
            {spine.title && <span className={styles.title}>{spine.title}</span>}
          </div>
        ))}
      </div>
      <div className={styles.plank} />
    </div>
  )
}
