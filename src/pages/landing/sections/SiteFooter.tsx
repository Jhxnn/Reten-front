import { Link } from 'react-router'
import { Logo } from '../../../components/brand/Logo'
import layout from './layout.module.css'
import styles from './SiteFooter.module.css'

const CURRENT_YEAR = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${layout.container} ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo tone="light" />
          <p className={styles.tagline}>Cada história tem uma trilha sonora.</p>
        </div>

        <nav aria-label="Rodapé" className={styles.links}>
          <a href="#como-funciona">Como funciona</a>
          <a href="#modos">Os três modos</a>
          <Link to="/entrar">Entrar</Link>
          <Link to="/cadastro">Criar conta</Link>
        </nav>

        <div className={styles.colophon}>
          <p className={styles.colophonTitle}>Colofão</p>
          <p>Composto em Fraunces e Manrope.</p>
          <p>O Resten não é afiliado ao Spotify. Spotify é uma marca registrada da Spotify AB.</p>
        </div>
      </div>
      <div className={`${layout.container} ${styles.base}`}>
        <p>© {CURRENT_YEAR} Resten</p>
      </div>
    </footer>
  )
}
