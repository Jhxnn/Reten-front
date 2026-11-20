import { useId, type InputHTMLAttributes } from 'react'
import styles from './TextField.module.css'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}

export function TextField({ label, hint, error, id, className, ...input }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-erro` : hint ? `${inputId}-dica` : undefined

  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...input}
      />
      {error ? (
        <p id={`${inputId}-erro`} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-dica`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
