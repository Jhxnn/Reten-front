import { Logo } from '../../components/brand/Logo'
import { ButtonLink } from '../../components/ui/Button'
import styles from './UpcomingPage.module.css'

type UpcomingPageProps = {
  title: string
  notFound?: boolean
}

/**
 * Página honesta para rotas que ainda não existem.
 * Cadastro e login são construídos na Fase 2 — até lá, nada aqui finge funcionar.
 */
export function UpcomingPage({ title, notFound = false }: UpcomingPageProps) {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Logo tone="dark" />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>
          {notFound
            ? 'Não encontramos esta página. Verifique o endereço ou volte para o início.'
            : 'Esta parte do Reten ainda está em construção e chega na próxima etapa do desenvolvimento.'}
        </p>
        <ButtonLink to="/" surface="paper">
          Voltar para o início
        </ButtonLink>
      </div>
    </div>
  )
}
