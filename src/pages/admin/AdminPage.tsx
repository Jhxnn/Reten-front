import { Link, useSearchParams } from 'react-router'
import { FormMessage } from '../../components/form/FormMessage'
import { PageLoading } from '../../components/ui/PageLoading'
import {
  formatDate,
  formatDateTime,
  statusName,
  useAdminOverview,
  useAdminPlaylists,
  useAdminUsers,
  useConfirmUserEmail,
  type AdminOverview,
  type AdminUser,
} from '../../features/admin/api'
import { ApiError } from '../../lib/api/http'
import { modeName } from '../../features/playlists/modes'
import styles from './Admin.module.css'

/** Visão do administrador: quem usou o Resten e todas as playlists criadas (só leitura). */
export function AdminPage() {
  const [params, setParams] = useSearchParams()
  const selectedUserId = params.get('usuario')
  const overview = useAdminOverview()
  const users = useAdminUsers()
  const playlists = useAdminPlaylists(selectedUserId)
  const selectedUser = users.data?.find((user) => user.id === selectedUserId)

  function filterBy(userId: string | null) {
    setParams(userId ? { usuario: userId } : {}, { replace: true })
    if (userId) document.getElementById('playlists')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (overview.isPending || users.isPending) return <PageLoading />
  if (overview.isError || users.isError) {
    return <FormMessage tone="error">Não foi possível carregar a administração. Tente recarregar a página.</FormMessage>
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Administração</h1>
        <p className={styles.lede}>Quem usou o Resten e as playlists criadas. Daqui você também pode confirmar o e-mail de quem não recebeu o código.</p>
      </header>

      <Stats overview={overview.data} />

      <section className={styles.section} aria-labelledby="usuarios">
        <h2 id="usuarios" className={styles.sectionTitle}>
          Quem usou
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Leitor</th>
                <th scope="col">Último acesso</th>
                <th scope="col">Cadastro</th>
                <th scope="col">E-mail</th>
                <th scope="col">Spotify</th>
                <th scope="col" className={styles.number}>
                  Playlists
                </th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user) => (
                <tr key={user.id} aria-selected={user.id === selectedUserId || undefined}>
                  <td>
                    <span className={styles.primary}>
                      {user.name}
                      {user.admin && <span className={styles.tag}>admin</span>}
                    </span>
                    <span className={styles.secondary}>{user.email}</span>
                  </td>
                  <td>{formatDateTime(user.lastSeenAt)}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <EmailStatus user={user} />
                  </td>
                  <td>
                    <span className={user.spotifyConnected ? styles.ok : styles.muted}>
                      {user.spotifyConnected ? 'Conectado' : '—'}
                    </span>
                  </td>
                  <td className={styles.number}>
                    {user.playlists > 0 ? (
                      <button
                        type="button"
                        className={styles.countLink}
                        onClick={() => filterBy(user.id)}
                        aria-label={`Ver as ${user.playlists} playlists de ${user.name}`}
                      >
                        {user.playlists}
                      </button>
                    ) : (
                      <span className={styles.muted}>0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="playlists" className={styles.section} aria-labelledby="playlists-titulo">
        <div className={styles.sectionHead}>
          <h2 id="playlists-titulo" className={styles.sectionTitle}>
            Playlists
          </h2>
          {selectedUserId && (
            <p className={styles.filter}>
              De <strong>{selectedUser?.name ?? 'um leitor'}</strong>
              <button type="button" className={styles.clear} onClick={() => filterBy(null)}>
                Ver todas
              </button>
            </p>
          )}
        </div>

        {playlists.isPending ? (
          <PageLoading />
        ) : playlists.isError ? (
          <FormMessage tone="error">Não foi possível carregar as playlists.</FormMessage>
        ) : playlists.data.length === 0 ? (
          <p className={styles.empty}>Nenhuma playlist criada ainda.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Playlist</th>
                  <th scope="col">Leitor</th>
                  <th scope="col">Modo</th>
                  <th scope="col" className={styles.number}>
                    Músicas
                  </th>
                  <th scope="col">Situação</th>
                  <th scope="col">Criada</th>
                </tr>
              </thead>
              <tbody>
                {playlists.data.map((playlist) => (
                  <tr key={playlist.id} data-deleted={playlist.deletedAt ? true : undefined}>
                    <td>
                      <Link to={`/admin/playlists/${playlist.id}`} className={styles.primaryLink}>
                        {playlist.name ?? 'Sem nome'}
                      </Link>
                      <span className={styles.secondary}>{playlist.bookTitle}</span>
                    </td>
                    <td>
                      <button type="button" className={styles.ownerLink} onClick={() => filterBy(playlist.ownerId)}>
                        {playlist.ownerName}
                      </button>
                    </td>
                    <td>{modeName(playlist.mode)}</td>
                    <td className={styles.number}>{playlist.tracks}</td>
                    <td>
                      <span className={styles.status} data-status={playlist.deletedAt ? 'DELETED' : playlist.status}>
                        {statusName(playlist)}
                      </span>
                      {playlist.savedOnSpotify && <span className={styles.secondary}>Salva no Spotify</span>}
                    </td>
                    <td>{formatDateTime(playlist.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

/** "Confirmado", ou "Pendente" com o botão que libera a conta sem o código. */
function EmailStatus({ user }: { user: AdminUser }) {
  const confirm = useConfirmUserEmail()
  if (user.emailVerified) return <span className={styles.ok}>Confirmado</span>
  return (
    <span className={styles.pending}>
      <span className={styles.muted}>Pendente</span>
      <button
        type="button"
        className={styles.confirm}
        disabled={confirm.isPending}
        onClick={() => confirm.mutate(user.id)}
        aria-label={`Confirmar o e-mail de ${user.name}`}
      >
        {confirm.isPending ? 'Confirmando…' : 'Confirmar'}
      </button>
      {confirm.isError && (
        <span className={styles.rowError} role="alert">
          {confirm.error instanceof ApiError ? confirm.error.message : 'Não deu certo. Tente de novo.'}
        </span>
      )}
    </span>
  )
}

function Stats({ overview }: { overview: AdminOverview }) {
  const items = [
    { label: 'Leitores', value: overview.users, note: `${overview.verifiedUsers} com e-mail confirmado` },
    { label: 'Ativos em 7 dias', value: overview.activeLast7Days, note: 'Acessaram na última semana' },
    { label: 'Com Spotify', value: overview.spotifyConnected, note: 'Contas conectadas' },
    {
      label: 'Playlists',
      value: overview.playlists,
      note: `${overview.playlistsLast7Days} na última semana · ${overview.deletedPlaylists} apagadas`,
    },
  ]
  return (
    <dl className={styles.stats}>
      {items.map((item) => (
        <div key={item.label} className={styles.stat}>
          <dt className={styles.statLabel}>{item.label}</dt>
          <dd className={styles.statValue}>{item.value}</dd>
          <dd className={styles.statNote}>{item.note}</dd>
        </div>
      ))}
    </dl>
  )
}
