import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { TextField } from '../../components/form/TextField'
import { Button } from '../../components/ui/Button'
import { useRegister } from '../../features/auth/hooks'
import { AuthLayout } from './AuthLayout'
import { splitErrors } from './formErrors'
import styles from './forms.module.css'

export function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const register = useRegister()
  const navigate = useNavigate()
  const { fields, general } = splitErrors(register.error)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    register.mutate({ name, email, password }, { onSuccess: () => navigate('/inicio', { replace: true }) })
  }

  return (
    <AuthLayout
      statement="Cada livro que você ama tem um som esperando."
      title="Criar conta"
      intro="Leva menos de um minuto. Você conecta o Spotify depois, quando quiser salvar uma playlist."
      footer={
        <>
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {general && <FormMessage tone="error">{general}</FormMessage>}
        <TextField
          label="Nome"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fields.name}
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          hint="Pelo menos 8 caracteres."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fields.password}
        />
        <Button type="submit" disabled={register.isPending}>
          {register.isPending ? 'Criando conta…' : 'Criar conta'}
        </Button>
      </form>
    </AuthLayout>
  )
}
