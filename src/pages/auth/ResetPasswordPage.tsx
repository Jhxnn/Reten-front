import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { TextField } from '../../components/form/TextField'
import { Button, ButtonLink } from '../../components/ui/Button'
import { useResetPassword } from '../../features/auth/hooks'
import { PasswordRequirements } from '../../features/auth/PasswordRequirements'
import { meetsPasswordRules } from '../../features/auth/passwordRules'
import { AuthLayout } from './AuthLayout'
import { splitErrors } from './formErrors'
import styles from './forms.module.css'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [mismatch, setMismatch] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const reset = useResetPassword()
  const { fields, general } = splitErrors(reset.error)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setAttempted(true)
    if (!meetsPasswordRules(password)) return
    if (password !== confirmation) {
      setMismatch(true)
      return
    }
    setMismatch(false)
    if (token) reset.mutate({ token, password })
  }

  if (!token) {
    return (
      <AuthLayout statement="Acontece com qualquer leitor." title="Link incompleto">
        <FormMessage tone="error">
          Este endereço não tem o código de redefinição. Abra o link exatamente como chegou no e-mail ou peça um novo.
        </FormMessage>
        <ButtonLink to="/esqueci-a-senha">Pedir novo link</ButtonLink>
      </AuthLayout>
    )
  }

  if (reset.isSuccess) {
    return (
      <AuthLayout statement="Tudo certo de novo." title="Senha alterada">
        <FormMessage tone="success">
          Sua nova senha já está valendo. Por segurança, encerramos as sessões abertas em outros aparelhos.
        </FormMessage>
        <ButtonLink to="/entrar">Entrar</ButtonLink>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      statement="Acontece com qualquer leitor."
      title="Crie uma nova senha"
      footer={
        <>
          O link expirou? <Link to="/esqueci-a-senha">Pedir outro</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {general && <FormMessage tone="error">{general}</FormMessage>}
        <TextField
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          required
          maxLength={72}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fields.password}
          below={<PasswordRequirements value={password} showMissing={attempted} />}
        />
        <TextField
          label="Repita a nova senha"
          type="password"
          autoComplete="new-password"
          required
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          error={mismatch ? 'As duas senhas precisam ser iguais.' : undefined}
        />
        <Button type="submit" disabled={reset.isPending}>
          {reset.isPending ? 'Salvando…' : 'Salvar nova senha'}
        </Button>
      </form>
    </AuthLayout>
  )
}
