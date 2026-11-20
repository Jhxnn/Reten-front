import { Link } from 'react-router'
import styles from './Logo.module.css'

type LogoProps = {
  tone?: 'light' | 'dark'
}

/**
 * Marca do Reten: um disco parcialmente escondido atrás de uma lombada.
 * O livro vem na frente; a música é o que existe por trás dele.
 */
export function Logo({ tone = 'light' }: LogoProps) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[tone]}`} aria-label="Reten, página inicial">
      <LogoMark />
      <span className={styles.wordmark}>Reten</span>
    </Link>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={`${styles.mark} ${className ?? ''}`} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="19" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="19" cy="16" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <circle cx="19" cy="16" r="1.6" fill="currentColor" />
      <rect x="5" y="3" width="7" height="26" rx="0.6" className={styles.spine} />
      <rect x="6.6" y="7" width="3.8" height="0.9" className={styles.spineBand} />
      <rect x="6.6" y="23.6" width="3.8" height="0.9" className={styles.spineBand} />
    </svg>
  )
}
