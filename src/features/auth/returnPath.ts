/** Só aceita caminhos internos, para o parâmetro ?voltar= não virar um redirecionamento aberto. */
export function safeReturnPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/inicio'
  return value
}
