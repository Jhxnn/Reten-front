import { atmosphereIndex } from '../content'
import layout from './layout.module.css'
import styles from './AtmosphereIndex.module.css'

/** Um sumário de livro, mas em vez do número da página, o clima da obra. */
export function AtmosphereIndex() {
  return (
    <section className={styles.section} aria-labelledby="climas-titulo">
      <div className={`${layout.container} ${styles.inner}`}>
        <div className={styles.intro}>
          <h2 id="climas-titulo" className={layout.sectionTitle}>
            Antes da música, o clima.
          </h2>
          <p className={styles.lead}>
            O Resten começa pela atmosfera de cada obra: a paisagem, a época, a intensidade das emoções. Só depois
            procura as faixas.
          </p>
        </div>

        <ul className={styles.index}>
          {atmosphereIndex.map((entry) => (
            <li key={entry.title} className={styles.entry}>
              <span className={styles.book}>
                <span className={styles.title}>{entry.title}</span>
                <span className={styles.author}>{entry.author}</span>
              </span>
              <span className={styles.leader} aria-hidden="true" />
              <span className={styles.mood}>{entry.mood}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
