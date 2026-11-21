import layout from './layout.module.css'
import styles from './HowItWorks.module.css'

const chapters = [
  {
    numeral: 'I',
    title: 'Escolha o livro',
    text: 'Pesquise por título, autor ou ISBN. O Resten lê a sinopse e os dados da obra, nunca o texto do livro.',
  },
  {
    numeral: 'II',
    title: 'Escolha como ouvir',
    text: 'Trilha temática, músicas com voz ou modo concentração. A inteligência artificial interpreta o clima, a época e os sentimentos da história.',
  },
  {
    numeral: 'III',
    title: 'Revise e leve ao Spotify',
    text: 'Cada faixa é conferida no catálogo do Spotify antes de aparecer. Remova, troque e salve a playlist na sua conta.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className={styles.section} aria-labelledby="como-funciona-titulo">
      <div className={layout.container}>
        <h2 id="como-funciona-titulo" className={layout.sectionTitle}>
          Do livro à playlist em três capítulos.
        </h2>
        <ol className={styles.chapters}>
          {chapters.map((chapter) => (
            <li key={chapter.numeral} className={styles.chapter}>
              <span className={styles.numeral} aria-hidden="true">
                {chapter.numeral}
              </span>
              <h3 className={styles.title}>{chapter.title}</h3>
              <p className={styles.text}>{chapter.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
