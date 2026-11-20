import { Link } from 'react-router'
import { Logo } from '../../../components/brand/Logo'
import { ButtonLink } from '../../../components/ui/Button'
import { Bookshelf } from './Bookshelf'
import layout from './layout.module.css'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <header className={styles.hero}>
      <nav className={`${layout.container} ${styles.nav}`} aria-label="Principal">
        <Logo tone="light" />
        <ul className={styles.links}>
          <li className={styles.optional}>
            <a href="#como-funciona">Como funciona</a>
          </li>
          <li className={styles.optional}>
            <a href="#modos">Os três modos</a>
          </li>
          <li>
            <Link to="/entrar">Entrar</Link>
          </li>
        </ul>
      </nav>

      <div className={`${layout.container} ${styles.copy}`}>
        <h1 className={styles.headline}>Cada história tem uma trilha sonora.</h1>
        <p className={styles.sub}>
          Transforme seus livros favoritos em experiências musicais. Descubra a música que existe por trás de cada
          história.
        </p>
        <div className={styles.actions}>
          <ButtonLink to="/cadastro" surface="dark">
            Criar minha playlist
          </ButtonLink>
          <a className={styles.secondary} href="#como-funciona">
            Ver como funciona
          </a>
        </div>
      </div>

      <Bookshelf />
    </header>
  )
}
