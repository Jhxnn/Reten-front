import { Eye, EyeOff } from 'lucide-react'
import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './TextField.module.css'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
  /** Conteúdo extra logo abaixo do campo (ex.: lista de requisitos da senha). */
  below?: ReactNode
}

/** Campo com rótulo, dica e erro. Campos de senha ganham um botão para mostrar o que foi digitado. */
export function TextField({ label, hint, error, below, id, className, type, ...input }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const describedBy = error ? `${inputId}-erro` : hint ? `${inputId}-dica` : undefined

  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={styles.control}>
        <input
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          className={`${styles.input} ${isPassword ? styles.withToggle : ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...input}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={revealed}
            aria-controls={inputId}
            title={revealed ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {revealed ? <EyeOff size={19} strokeWidth={1.75} aria-hidden="true" /> : <Eye size={19} strokeWidth={1.75} aria-hidden="true" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-erro`} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-dica`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {below}
    </div>
  )
}
