import { useState } from 'react'
import { TypographicCover, type CoverTone } from './TypographicCover'
import styles from './BookCover.module.css'

type BookCoverProps = {
  title: string
  authors: string[]
  coverUrl: string | null
  className?: string
}

const tones: CoverTone[] = ['forest', 'ink', 'mint', 'sage']

function toneFor(title: string): CoverTone {
  let hash = 0
  for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return tones[Math.abs(hash) % tones.length]
}

/** Capa real quando existe; senão (ou se a imagem falhar), a capa tipográfica do Reten. */
export function BookCover({ title, authors, coverUrl, className }: BookCoverProps) {
  const [failed, setFailed] = useState(false)
  const author = authors[0] ?? 'Autor desconhecido'

  if (!coverUrl || failed) {
    return <TypographicCover title={title} author={author} tone={toneFor(title)} className={className} />
  }

  return (
    <div className={`${styles.frame} ${className ?? ''}`}>
      <img
        className={styles.image}
        src={coverUrl}
        alt={`Capa de ${title}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        onLoad={(event) => {
          // A Open Library devolve uma imagem 1×1 quando não tem capa para o id.
          if (event.currentTarget.naturalWidth <= 1) setFailed(true)
        }}
      />
    </div>
  )
}
