import type { ReactNode } from 'react'
import { Logo } from '../../components/brand/Logo'
import styles from './AuthLayout.module.css'

type AuthLayoutProps = {
  /** Frase do painel escuro — muda conforme a página. */
  statement: string
  title: string
  intro?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

/** Moldura das páginas de conta: painel da marca à esquerda, formulário à direita. */
export function AuthLayout({ statement, title, intro, children, footer }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <aside className={styles.panel}>
        <Logo tone="light" />
        <p className={styles.statement}>{statement}</p>
        <div className={styles.bars} aria-hidden="true">
          {[0.42, 0.7, 0.55, 0.92, 0.64, 0.38, 0.8, 0.5, 0.72, 0.3, 0.6, 0.85].map((h, i) => (
            <span key={i} style={{ height: `${h * 100}%` }} />
          ))}
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.form}>
          <h1 className={styles.title}>{title}</h1>
          {intro && <div className={styles.intro}>{intro}</div>}
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </main>
    </div>
  )
}
