import { Link } from 'react-router'
import { MARK_PATH, MARK_VIEWBOX } from './markPath'
import styles from './Logo.module.css'

type LogoProps = {
  /** Cor da marca: "light" sobre fundos escuros, "dark" segue a cor do texto (acompanha o tema). */
  tone?: 'light' | 'dark'
}

/** A marca leva à página inicial. O nome do produto fica no aria-label. */
export function Logo({ tone = 'light' }: LogoProps) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[tone]}`} aria-label="Resten, página inicial">
      <LogoMark />
    </Link>
  )
}

/** Marca do Resten: um livro aberto cujas páginas são barras de som. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={`${styles.mark} ${className ?? ''}`} viewBox={MARK_VIEWBOX} fill="currentColor" aria-hidden="true">
      <path d={MARK_PATH} fillRule="evenodd" />
    </svg>
  )
}
