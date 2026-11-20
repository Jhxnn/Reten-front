import { useRef, useState, type KeyboardEvent } from 'react'
import { TypographicCover } from '../../../components/book/TypographicCover'
import { demoBook, listeningModes, type ListeningModeId } from '../content'
import layout from './layout.module.css'
import styles from './ListeningModes.module.css'

export function ListeningModes() {
  const [activeId, setActiveId] = useState<ListeningModeId>('thematic')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const active = listeningModes.find((mode) => mode.id === activeId) ?? listeningModes[0]

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = listeningModes.length - 1
    const next =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (next === null) return
    event.preventDefault()
    setActiveId(listeningModes[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="modos" className={styles.section} aria-labelledby="modos-titulo">
      <div className={layout.container}>
        <h2 id="modos-titulo" className={layout.sectionTitle}>
          Um livro, três maneiras de ouvir.
        </h2>

        <div className={styles.layout}>
          <aside className={styles.book}>
            <TypographicCover title={demoBook.title} author={demoBook.author} tone={demoBook.tone} className={styles.cover} />
            <div className={styles.atmosphere}>
              <p className={styles.atmosphereLabel}>Atmosfera identificada</p>
              <ul className={styles.atmosphereList}>
                {demoBook.atmosphere.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className={styles.record}>
            <div role="tablist" aria-label="Modos musicais" className={styles.tabs}>
              {listeningModes.map((mode, index) => {
                const selected = mode.id === activeId
                return (
                  <button
                    key={mode.id}
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    role="tab"
                    id={`tab-${mode.id}`}
                    aria-selected={selected}
                    aria-controls={`painel-${mode.id}`}
                    tabIndex={selected ? 0 : -1}
                    className={styles.tab}
                    onClick={() => setActiveId(mode.id)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  >
                    <span className={styles.side}>{mode.side}</span>
                    <span className={styles.modeName}>{mode.name}</span>
                  </button>
                )
              })}
            </div>

            <div role="tabpanel" id={`painel-${active.id}`} aria-labelledby={`tab-${active.id}`} className={styles.panel}>
              <div className={styles.panelHead}>
                <h3 className={styles.playlistName}>{active.playlistName}</h3>
                <p className={styles.summary}>{active.summary}</p>
              </div>

              <ol className={styles.tracks}>
                {active.tracks.map((track, index) => (
                  <li key={track.title} className={styles.track}>
                    <span className={styles.trackNumber}>{index + 1}</span>
                    <div className={styles.trackMain}>
                      <p className={styles.trackTitle}>{track.title}</p>
                      <p className={styles.trackArtist}>{track.artist}</p>
                    </div>
                    <p className={styles.trackReason}>{track.reason}</p>
                  </li>
                ))}
              </ol>

              <p className={styles.note}>
                Exemplo editorial, montado à mão pela equipe do Reten. No app, a inteligência artificial sugere as
                músicas e cada faixa é confirmada no catálogo do Spotify antes de entrar na sua playlist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
