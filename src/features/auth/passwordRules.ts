/**
 * Regra de senha nova (cadastro e redefinição). Espelha StrongPassword no backend, que é quem decide:
 * aqui ela só orienta enquanto a pessoa digita.
 */
export const passwordRules = [
  { id: 'length', label: 'Pelo menos 8 caracteres', test: (value: string) => value.length >= 8 },
  { id: 'upper', label: 'Uma letra maiúscula', test: (value: string) => /\p{Lu}/u.test(value) },
  {
    id: 'special',
    label: 'Um caractere especial (ex.: ! @ # -)',
    test: (value: string) => /[^\p{L}\p{N}\s]/u.test(value),
  },
] as const

export function meetsPasswordRules(value: string) {
  return value.length <= 72 && passwordRules.every((rule) => rule.test(value))
}
