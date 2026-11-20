import styles from './TypographicCover.module.css'

export type CoverTone = 'umber' | 'olive' | 'ink' | 'vellum'

type TypographicCoverProps = {
  title: string
  author: string
  tone?: CoverTone
  className?: string
}

/**
 * Capa tipográfica, no espírito das coleções de clássicos.
 * Usada em exemplos editoriais e como capa substituta quando um livro não tem imagem.
 * Os sulcos no rodapé são o único ornamento: a obra vira disco.
 */
export function TypographicCover({ title, author, tone = 'umber', className }: TypographicCoverProps) {
  return (
    <div className={`${styles.cover} ${styles[tone]} ${className ?? ''}`} role="img" aria-label={`Capa de ${title}, de ${author}`}>
      <div className={styles.frame}>
        <p className={styles.author}>{author}</p>
        <p className={styles.title}>{title}</p>
        <svg className={styles.grooves} viewBox="0 0 120 60" aria-hidden="true">
          {[56, 48, 40, 32, 24, 16].map((r) => (
            <circle key={r} cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="0.6" />
          ))}
          <circle cx="60" cy="60" r="5" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}
