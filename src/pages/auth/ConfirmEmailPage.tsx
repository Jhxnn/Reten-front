import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { FormMessage } from '../../components/form/FormMessage'
import { TextField } from '../../components/form/TextField'
import { Button } from '../../components/ui/Button'
import { useChangeEmail, useCurrentUser, useLogout, useResendCode, useVerifyEmail } from '../../features/auth/hooks'
import { ApiError } from '../../lib/api/http'
import { AuthLayout } from './AuthLayout'
import { splitErrors } from './formErrors'
import styles from './ConfirmEmailPage.module.css'

/** Espera entre envios; o servidor aplica a mesma regra e responde 429 se for antes. */
const RESEND_SECONDS = 60

/** Pede o código de 6 dígitos enviado no cadastro. Até confirmar, é a única tela da área logada. */
export function ConfirmEmailPage() {
  // Confere a cada 10 s: se um administrador confirmar o e-mail, o guard libera o app sozinho.
  const { data: user } = useCurrentUser({ pollEveryMs: 10_000 })
  const [code, setCode] = useState('')
  const [changing, setChanging] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [waitUntil, setWaitUntil] = useState(() => Date.now() + RESEND_SECONDS * 1000)
  const secondsLeft = useCountdown(waitUntil)
  const verify = useVerifyEmail()
  const resend = useResendCode()
  const logout = useLogout()
  const codeId = useId()
  const lastSubmitted = useRef<string | null>(null)

  function submit(value: string) {
    if (value.length !== 6 || verify.isPending) return
    lastSubmitted.current = value
    setNotice(null)
    // Sucesso: o usuário em cache passa a ter emailVerified e o guard leva ao destino.
    verify.mutate(value)
  }

  function handleChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    setCode(digits)
    // Ao completar os 6 dígitos (digitados ou colados), confere sozinho — só uma vez por código.
    if (digits.length === 6 && digits !== lastSubmitted.current) submit(digits)
  }

  function handleResend() {
    setNotice(null)
    resend.mutate(undefined, {
      onSuccess: () => {
        setWaitUntil(Date.now() + RESEND_SECONDS * 1000)
        setCode('')
        lastSubmitted.current = null
        verify.reset()
        setNotice('Enviamos um novo código. O anterior deixou de valer.')
      },
    })
  }

  const verifyError = verify.error instanceof ApiError ? verify.error : null
  const codeExpired = verifyError?.code === 'verification_code_expired'
  const resendError = resend.error instanceof ApiError ? resend.error.message : resend.error ? 'Não foi possível reenviar.' : null

  return (
    <AuthLayout
      statement="Falta só confirmar que este e-mail é seu."
      title="Confirme seu e-mail"
      intro={
        <>
          Enviamos um código de 6 números para <strong className={styles.email}>{user?.email}</strong>. Ele vale por 15
          minutos. Se não aparecer, olhe também a caixa de spam.
        </>
      }
      footer={
        <button
          type="button"
          className={styles.textButton}
          disabled={logout.isPending}
          onClick={async () => {
            try {
              await logout.mutateAsync()
            } finally {
              window.location.replace('/')
            }
          }}
        >
          Sair
        </button>
      }
    >
      {changing ? (
        <ChangeEmailForm
          current={user?.email ?? ''}
          onDone={(message) => {
            setChanging(false)
            setCode('')
            lastSubmitted.current = null
            verify.reset()
            resend.reset()
            setWaitUntil(Date.now() + RESEND_SECONDS * 1000)
            setNotice(message)
          }}
          onCancel={() => setChanging(false)}
        />
      ) : (
        <form
          className={styles.form}
          onSubmit={(event: FormEvent) => {
            event.preventDefault()
            submit(code)
          }}
          noValidate
        >
          {notice && <FormMessage tone="success">{notice}</FormMessage>}

          <div className={styles.codeField}>
            <label htmlFor={codeId} className={styles.label}>
              Código
            </label>
            <input
              id={codeId}
              className={styles.code}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              placeholder="000000"
              autoFocus
              value={code}
              onChange={(event) => handleChange(event.target.value)}
              aria-invalid={verifyError ? true : undefined}
              aria-describedby={verifyError ? `${codeId}-erro` : undefined}
            />
            {verifyError && (
              <p id={`${codeId}-erro`} className={styles.error} role="alert">
                {verifyError.code === 'validation_failed' ? 'O código tem 6 números.' : verifyError.message}
              </p>
            )}
            {verify.error && !verifyError && (
              <p className={styles.error} role="alert">
                Não foi possível conferir o código. Tente de novo.
              </p>
            )}
          </div>

          <Button type="submit" disabled={code.length !== 6 || verify.isPending}>
            {verify.isPending ? 'Conferindo…' : 'Confirmar'}
          </Button>

          <div className={styles.links}>
            <button
              type="button"
              className={`${styles.textButton} ${codeExpired ? styles.emphasis : ''}`}
              onClick={handleResend}
              disabled={secondsLeft > 0 || resend.isPending}
            >
              {resend.isPending
                ? 'Enviando…'
                : secondsLeft > 0
                  ? `Reenviar código em ${secondsLeft}s`
                  : 'Reenviar código'}
            </button>
            <button type="button" className={styles.textButton} onClick={() => setChanging(true)}>
              Trocar e-mail
            </button>
          </div>
          {resendError && <FormMessage tone="error">{resendError}</FormMessage>}
        </form>
      )}
    </AuthLayout>
  )
}

function ChangeEmailForm({
  current,
  onDone,
  onCancel,
}: {
  current: string
  onDone: (message: string) => void
  onCancel: () => void
}) {
  const [email, setEmail] = useState(current)
  const change = useChangeEmail()
  const { fields, general } = splitErrors(change.error)

  return (
    <form
      className={styles.form}
      onSubmit={(event: FormEvent) => {
        event.preventDefault()
        change.mutate(email.trim(), { onSuccess: (user) => onDone(`Enviamos um código para ${user.email}.`) })
      }}
      noValidate
    >
      {general && <FormMessage tone="error">{general}</FormMessage>}
      <TextField
        label="Novo e-mail"
        type="email"
        autoComplete="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fields.email}
      />
      <Button type="submit" disabled={change.isPending || !email.trim()}>
        {change.isPending ? 'Enviando código…' : 'Enviar código para este e-mail'}
      </Button>
      <button type="button" className={styles.textButton} onClick={onCancel}>
        Cancelar
      </button>
    </form>
  )
}

function useCountdown(until: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (until <= Date.now()) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [until])
  return Math.max(0, Math.ceil((until - now) / 1000))
}
