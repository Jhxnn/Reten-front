import { Link } from 'react-router'
import styles from './Logo.module.css'

type LogoProps = {
  /** Cor da marca: "light" sobre fundos escuros, "dark" segue a cor do texto (acompanha o tema). */
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

/** Marca do Reten: um livro aberto de onde sobe uma nota musical simples. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={`${styles.mark} ${className ?? ''}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M15.2 27.5C11.6 24.4 6.9 23.4 1.5 24.2L4.6 14.6C8.9 13.9 12.9 15.6 15.2 19Z" fill="currentColor" />
      <path d="M16.8 27.5C20.4 24.4 25.1 23.4 30.5 24.2L27.4 14.6C23.1 13.9 19.1 15.6 16.8 19Z" fill="currentColor" />
      <circle cx="13.6" cy="13.4" r="2.6" fill="currentColor" />
      <rect x="15.1" y="3.2" width="1.5" height="10.4" rx="0.75" fill="currentColor" />
      <path d="M16.6 3.9L20.6 7.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
