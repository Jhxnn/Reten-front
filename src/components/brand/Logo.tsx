import { Link } from 'react-router'
import styles from './Logo.module.css'

type LogoProps = {
  tone?: 'light' | 'dark'
}

export function Logo({ tone = 'light' }: LogoProps) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[tone]}`} aria-label="Reten, página inicial">
      <LogoMark />
      <span className={styles.wordmark}>Reten</span>
    </Link>
  )
}

/**
 * Marca do Reten: três barras de alturas diferentes.
 * Lidas como livros numa prateleira ou como um equalizador — as duas coisas ao mesmo tempo.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={`${styles.mark} ${className ?? ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="10" y="3" width="4" height="18" rx="1" fill="currentColor" />
      <rect x="17" y="11" width="4" height="10" rx="1" className={styles.accent} />
    </svg>
  )
}
