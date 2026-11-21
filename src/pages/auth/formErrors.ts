import { ApiError, type FieldErrors } from '../../lib/api/http'

/** Separa erros de campo (mostrados sob cada input) do erro geral do formulário. */
export function splitErrors(error: unknown): { fields: FieldErrors; general?: string } {
  if (!error) return { fields: {} }
  if (error instanceof ApiError) {
    if (error.code === 'validation_failed') return { fields: error.fields }
    return { fields: {}, general: error.message }
  }
  return { fields: {}, general: 'Não foi possível falar com o Resten. Verifique sua conexão e tente novamente.' }
}
