import type { ReactNode } from 'react'
import styles from './FormMessage.module.css'

type FormMessageProps = {
  tone: 'error' | 'success' | 'info'
  children: ReactNode
}

export function FormMessage({ tone, children }: FormMessageProps) {
  return (
    <div className={`${styles.message} ${styles[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
