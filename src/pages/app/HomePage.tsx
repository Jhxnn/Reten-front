import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { useCurrentUser } from '../../features/auth/hooks'
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

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>
        {greeting(now)}, {firstName}.
      </h1>
      <p className={styles.lead}>
        A busca de livros e a criação de playlists chegam nas próximas etapas. Por enquanto, você já pode deixar sua
        conta Spotify conectada.
      </p>

      {outcome && <FormMessage tone={outcome.tone}>{outcome.text}</FormMessage>}

      <SpotifyConnectionPanel />
    </div>
  )
}
