import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, type CurrentUser, type LoginInput, type RegisterInput } from './api'

export const currentUserKey = ['auth', 'me'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserKey,
    queryFn: authApi.me,
    staleTime: 5 * 60_000,
  })
}

function useSetCurrentUser() {
  const queryClient = useQueryClient()
  return (user: CurrentUser | null) => {
    // Ao trocar de usuário, nada do anterior pode sobrar em cache.
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== currentUserKey[0] })
    queryClient.setQueryData(currentUserKey, user)
  }
}

export function useLogin() {
  const setUser = useSetCurrentUser()
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: setUser,
  })
}

export function useRegister() {
  const setUser = useSetCurrentUser()
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: setUser,
  })
}

export function useLogout() {
  const setUser = useSetCurrentUser()
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => setUser(null),
  })
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => authApi.forgotPassword(email) })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => authApi.resetPassword(token, password),
  })
}
