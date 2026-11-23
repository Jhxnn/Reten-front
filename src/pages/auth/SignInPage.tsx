import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { TextField } from '../../components/form/TextField'
import { Button } from '../../components/ui/Button'
import { safeReturnPath } from '../../features/auth/returnPath'
import { useLogin } from '../../features/auth/hooks'
import { AuthLayout } from './AuthLayout'
import { splitErrors } from './formErrors'
import styles from './forms.module.css'

export function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const login = useLogin()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { fields, general } = splitErrors(login.error)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    login.mutate({ email, password, rememberMe }, { onSuccess: () => navigate(safeReturnPath(params.get('voltar')), { replace: true }) })
  }

  return (
    <AuthLayout
      statement="Sua estante está esperando por você."
      title="Entrar"
      footer={
        <>
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {general && <FormMessage tone="error">{general}</FormMessage>}
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fields.email}
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fields.password}
        />
        <div className={styles.options}>
          <label className={styles.check}>
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Manter conectado
          </label>
          <Link to="/esqueci-a-senha" className={styles.optionLink}>
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" disabled={login.isPending}>
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
