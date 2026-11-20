import { ChevronDown, LogOut, Moon } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useLogout } from '../../features/auth/hooks'
import { useTheme } from '../../features/theme/theme'
import styles from './UserMenu.module.css'

/** Nome do leitor que abre um menu com o modo escuro e a saída. */
export function UserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const { theme, toggle } = useTheme()
  const logout = useLogout()

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div ref={root} className={styles.root}>
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Conta de ${name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.initial} aria-hidden="true">
          {initial}
        </span>
        <span className={styles.name}>{name}</span>
        <ChevronDown size={16} aria-hidden="true" className={styles.chevron} />
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <p className={styles.who}>{name}</p>
        <button type="button" role="switch" aria-checked={theme === 'dark'} className={styles.item} onClick={toggle}>
          <Moon size={17} aria-hidden="true" />
          <span>Modo escuro</span>
          <span className={styles.switch} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.item}
          disabled={logout.isPending}
          onClick={async () => {
            // Encerra a sessão no servidor e recarrega em "/". O recarregamento descarta todo o estado
            // do cliente (cache de consultas do usuário anterior) e evita que o guard da rota protegida,
            // ao ver o usuário sumir, redirecione para /entrar antes de a navegação terminar.
            try {
              await logout.mutateAsync()
            } finally {
              window.location.replace('/')
            }
          }}
        >
          <LogOut size={17} aria-hidden="true" />
          <span>{logout.isPending ? 'Saindo…' : 'Sair'}</span>
        </button>
      </div>
    </div>
  )
}
