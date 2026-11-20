import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { ButtonLink } from '../../components/ui/Button'
import { useCurrentUser } from '../../features/auth/hooks'
import { useRecentBooks } from '../../features/books/api'
import { BookGrid } from '../../features/books/BookGrid'
import { spotifyOutcomeMessages } from '../../features/spotify/api'
import { SpotifyConnectionPanel } from '../../features/spotify/SpotifyConnectionPanel'
import styles from './HomePage.module.css'

function greeting(date: Date) {
  const hour = date.getHours()
  if (hour < 5) return 'Boa noite'
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function HomePage() {
  const { data: user } = useCurrentUser()
  const recent = useRecentBooks()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [now] = useState(() => new Date())
  const [outcome] = useState(() => {
    const status = params.get('spotify')
    const key = status === 'conectado' ? 'conectado' : params.get('motivo')
    return key ? spotifyOutcomeMessages[key] : undefined
  })

  // A mensagem do retorno do OAuth aparece uma vez; o endereço volta a ficar limpo.
  useEffect(() => {
    if (params.has('spotify')) setParams({}, { replace: true })
  }, [params, setParams])

  const firstName = user?.name.split(' ')[0]
  const recentBooks = recent.data?.slice(0, 6) ?? []

  return (
    <div className={styles.page}>
      {outcome && <FormMessage tone={outcome.tone}>{outcome.text}</FormMessage>}

      <header className={styles.intro}>
        <h1 className={styles.greeting}>
          {greeting(now)}, {firstName}.
        </h1>
        <p className={styles.lead}>Escolha um livro e descubra a trilha sonora que existe por trás dele.</p>
        <ButtonLink to="/livros">Escolher um livro</ButtonLink>
      </header>

      {recentBooks.length > 0 && (
        <section className={styles.section} aria-labelledby="recentes">
          <h2 id="recentes" className={styles.sectionTitle}>
            Livros recentes
          </h2>
          <BookGrid
            actionLabel="Abrir"
            onSelect={(id) => navigate(`/livros/${id}`)}
            books={recentBooks.map((book) => ({
              key: book.id,
              title: book.title,
              authors: book.authors,
              coverUrl: book.coverUrl,
            }))}
          />
        </section>
      )}

      <SpotifyConnectionPanel />
    </div>
  )
}
