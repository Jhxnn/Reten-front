import { FormMessage } from '../../components/form/FormMessage'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../lib/api/http'
import { startSpotifyAuthorization, useDisconnectSpotify, useSpotifyConnection } from './api'
import styles from './SpotifyConnectionPanel.module.css'

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

export function SpotifyConnectionPanel() {
  const connection = useSpotifyConnection()
  const disconnect = useDisconnectSpotify()

  return (
    <section className={styles.panel} aria-labelledby="spotify-titulo">
      <div className={styles.head}>
        <h2 id="spotify-titulo" className={styles.title}>
          Spotify
        </h2>
        {connection.data?.connected && <span className={styles.status}>Conectado</span>}
      </div>

      {connection.isPending && <p className={styles.text}>Verificando conexão…</p>}

      {connection.isError && (
        <FormMessage tone="error">
          {connection.error instanceof ApiError ? connection.error.message : 'Não foi possível verificar a conexão.'}
        </FormMessage>
      )}

      {connection.data && !connection.data.configured && (
        <p className={styles.text}>
          A integração com o Spotify ainda não foi configurada neste ambiente. Quando estiver, você poderá conectar
          sua conta aqui.
        </p>
      )}

      {connection.data?.configured && !connection.data.connected && (
        <>
          <p className={styles.text}>
            Conecte sua conta para salvar as playlists do Resten direto na sua biblioteca. Você pode gerar e ver
            playlists sem conectar.
          </p>
          <p className={styles.note}>
            Durante o beta, o Spotify só libera contas autorizadas manualmente. Se a sua ainda não estiver, avisamos
            ao conectar.
          </p>
          <Button onClick={startSpotifyAuthorization}>Conectar Spotify</Button>
        </>
      )}

      {connection.data?.connected && (
        <>
          <p className={styles.text}>
            Conectado como <strong>{connection.data.displayName ?? 'sua conta'}</strong>
            {connection.data.connectedAt && <> desde {dateFormat.format(new Date(connection.data.connectedAt))}</>}.
          </p>
          <Button variant="quiet" onClick={() => disconnect.mutate()} disabled={disconnect.isPending}>
            {disconnect.isPending ? 'Desconectando…' : 'Desconectar'}
          </Button>
        </>
      )}
    </section>
  )
}
