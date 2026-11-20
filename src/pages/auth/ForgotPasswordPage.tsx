import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { TextField } from '../../components/form/TextField'
import { Button } from '../../components/ui/Button'
import { useForgotPassword } from '../../features/auth/hooks'
import { AuthLayout } from './AuthLayout'
import { splitErrors } from './formErrors'
import styles from './forms.module.css'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const forgot = useForgotPassword()
  const { fields, general } = splitErrors(forgot.error)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    forgot.mutate(email)
  }

  return (
    <AuthLayout
      statement="Acontece com qualquer leitor."
      title="Redefinir senha"
      intro={forgot.isSuccess ? undefined : 'Informe o e-mail da sua conta. Enviaremos um link para criar uma nova senha.'}
      footer={
        <>
          Lembrou a senha? <Link to="/entrar">Entrar</Link>
        </>
      }
    >
      {forgot.isSuccess ? (
        <FormMessage tone="success">
          Se existir uma conta com <strong>{email}</strong>, enviamos um link para redefinir a senha. Ele vale por 30
          minutos. Confira também a caixa de spam.
        </FormMessage>
      ) : (
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
          <Button type="submit" disabled={forgot.isPending}>
            {forgot.isPending ? 'Enviando…' : 'Enviar link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
