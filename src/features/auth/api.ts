import { api, ApiError } from '../../lib/api/http'

export type CurrentUser = {
  id: string
  name: string
  email: string
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
  logout: () => api<void>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) => api<void>('/auth/password/forgot', { method: 'POST', body: { email } }),
  resetPassword: (token: string, password: string) =>
    api<void>('/auth/password/reset', { method: 'POST', body: { token, password } }),
}
