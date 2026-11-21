import { Check } from 'lucide-react'
import { passwordRules } from './passwordRules'
import styles from './PasswordRequirements.module.css'

/**
 * Lista do que a senha precisa ter, marcada conforme a pessoa digita.
 * Depois de uma tentativa de envio, o que falta fica em destaque.
 */
export function PasswordRequirements({ value, showMissing }: { value: string; showMissing: boolean }) {
  return (
    <ul className={styles.list} aria-label="A senha precisa ter">
      {passwordRules.map((rule) => {
        const met = rule.test(value)
        const state = met ? 'met' : showMissing ? 'missing' : 'pending'
        return (
          <li key={rule.id} className={styles.item} data-state={state}>
            <span className={styles.mark} aria-hidden="true">
              {met && <Check size={12} strokeWidth={3} />}
            </span>
            {rule.label}
            <span className="visually-hidden">{met ? ' (atendido)' : ' (falta)'}</span>
          </li>
        )
      })}
    </ul>
  )
}
