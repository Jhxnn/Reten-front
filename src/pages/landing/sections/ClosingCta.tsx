import { ButtonLink } from '../../../components/ui/Button'
import layout from './layout.module.css'
import styles from './ClosingCta.module.css'

export function ClosingCta() {
  return (
    <section className={styles.section} aria-labelledby="cta-titulo">
      <div className={`${layout.container} ${styles.inner}`}>
        <h2 id="cta-titulo" className={styles.title}>
          Qual livro está na sua mesa de cabeceira?
        </h2>
        <div className={styles.side}>
          <p className={styles.text}>Crie uma conta e gere a primeira trilha sonora para ele.</p>
          <ButtonLink to="/cadastro" surface="dark">
            Criar minha playlist
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
