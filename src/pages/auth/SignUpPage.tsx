import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { TextField } from '../../components/form/TextField'
import { Button } from '../../components/ui/Button'
import { useRegister } from '../../features/auth/hooks'
import { PasswordRequirements } from '../../features/auth/PasswordRequirements'
import { meetsPasswordRules } from '../../features/auth/passwordRules'
import { AuthLayout } from './AuthLayout'
import { splitErrors } from './formErrors'
import styles from './forms.module.css'

export function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [attempted, setAttempted] = useState(false)
  const register = useRegister()
  const navigate = useNavigate()
  const { fields, general } = splitErrors(register.error)

  const passwordOk = meetsPasswordRules(password)
  const mismatch = confirmation.length > 0 && confirmation !== password
  const confirmationError =
    mismatch || (attempted && !confirmation) ? (confirmation ? 'As duas senhas precisam ser iguais.' : 'Repita a senha.') : undefined

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setAttempted(true)
    // A senha é conferida aqui só para orientar; o servidor aplica a mesma regra.
    if (!passwordOk || confirmation !== password) return
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
          maxLength={72}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fields.password}
          aria-invalid={(attempted && !passwordOk) || fields.password ? true : undefined}
          below={<PasswordRequirements value={password} showMissing={attempted} />}
        />
        <TextField
          label="Confirme a senha"
          type="password"
          autoComplete="new-password"
          required
          maxLength={72}
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          error={confirmationError}
        />
        <Button type="submit" disabled={register.isPending}>
          {register.isPending ? 'Criando conta…' : 'Criar conta'}
        </Button>
      </form>
    </AuthLayout>
  )
}
