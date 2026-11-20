import styles from './PageLoading.module.css'

/** Carregamento discreto de página: as três barras da marca pulsando como um equalizador. */
export function PageLoading() {
  return (
    <div className={styles.wrap} role="status">
      <span className={styles.bars} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="visually-hidden">Carregando</span>
    </div>
  )
}
