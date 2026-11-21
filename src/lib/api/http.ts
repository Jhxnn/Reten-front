/**
 * Cliente HTTP da API do Resten.
 * - Sempre mesma origem (/api), com o cookie de sessão HttpOnly enviado pelo navegador.
 * - CSRF no padrão SPA do Spring Security: lê o cookie XSRF-TOKEN e envia no cabeçalho X-XSRF-TOKEN.
 * - Erros da API (RFC 9457) viram ApiError com um `code` estável.
 */

export type FieldErrors = Record<string, string>

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields: FieldErrors

  constructor(status: number, code: string, message: string, fields: FieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

const CSRF_COOKIE = 'XSRF-TOKEN'
const CSRF_HEADER = 'X-XSRF-TOKEN'
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function readCookie(name: string): string | undefined {
  const entry = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`))
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined
}

async function csrfToken(): Promise<string | undefined> {
  const existing = readCookie(CSRF_COOKIE)
  if (existing) return existing
  // O token é rotacionado no login; quando o cookie some, pedimos um novo.
  await fetch('/api/auth/csrf', { credentials: 'same-origin' })
  return readCookie(CSRF_COOKIE)
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = await response.json()
    return new ApiError(
      response.status,
      body.code ?? 'unknown_error',
      body.detail ?? 'Algo deu errado. Tente novamente.',
      body.fields ?? {},
    )
  } catch {
    return new ApiError(response.status, 'unknown_error', 'Algo deu errado. Tente novamente.')
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

export async function api<T>(path: string, { method = 'GET', body, signal }: RequestOptions = {}): Promise<T> {
  const send = async () => {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    if (!SAFE_METHODS.has(method)) {
      const token = await csrfToken()
      if (token) headers[CSRF_HEADER] = token
    }
    return fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
      signal,
    })
  }

  let response = await send()
  // Token CSRF expirado ou rotacionado: busca um novo e tenta uma única vez.
  if (response.status === 403 && !SAFE_METHODS.has(method)) {
    document.cookie = `${CSRF_COOKIE}=; Max-Age=0; path=/`
    response = await send()
  }

  if (!response.ok) throw await toApiError(response)
  if (response.status === 204 || response.headers.get('Content-Length') === '0') return undefined as T
  return (await response.json()) as T
}
