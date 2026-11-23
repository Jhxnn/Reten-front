import { api, ApiError } from '../../lib/api/http'

export type CurrentUser = {
  id: string
  name: string
  email: string
  /** Falso até o leitor digitar o código enviado por e-mail; até lá o app fica bloqueado. */
  emailVerified: boolean
  /** Enxerga a área de administração. */
  admin: boolean
}

export type RegisterInput = { name: string; email: string; password: string }
export type LoginInput = { email: string; password: string }

export const authApi = {
  /** Retorna null quando não há sessão, em vez de lançar erro. */
  async me(): Promise<CurrentUser | null> {
    try {
      return await api<CurrentUser>('/auth/me')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null
      throw error
    }
  },
  register: (input: RegisterInput) => api<CurrentUser>('/auth/register', { method: 'POST', body: input }),
  login: (input: LoginInput) => api<CurrentUser>('/auth/login', { method: 'POST', body: input }),
  verifyEmail: (code: string) => api<CurrentUser>('/auth/email/verify', { method: 'POST', body: { code } }),
  resendCode: () => api<void>('/auth/email/resend', { method: 'POST' }),
  changeEmail: (email: string) => api<CurrentUser>('/auth/email', { method: 'PUT', body: { email } }),
  logout: () => api<void>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) => api<void>('/auth/password/forgot', { method: 'POST', body: { email } }),
  resetPassword: (token: string, password: string) =>
    api<void>('/auth/password/reset', { method: 'POST', body: { token, password } }),
}
