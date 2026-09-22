import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { BarChart3, Eye, ListTree, Search } from 'lucide-react'
import { getGames, getOperators } from '../api/axios'
import { getSessions, parseSessionList, trackSession, parseSession } from '../api/sessions'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const STATUS_OPTIONS = ['', 'ACTIVE', 'INACTIVE', 'EXPIRED', 'CLOSED']

function Sessions() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [sessions, setSessions] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [operators, setOperators] = useState([])
  const [games, setGames] = useState([])

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 20)
  const [operatorId, setOperatorId] = useState(searchParams.get('operatorId') || '')
  const [gameCode, setGameCode] = useState(searchParams.get('gameCode') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')

  const [trackToken, setTrackToken] = useState('')
  const [tracking, setTracking] = useState(false)
  const [trackError, setTrackError] = useState('')

  const gameMap = useMemo(() => {
    const map = {}
    for (const game of games) {
      map[game.code] = game
      map[game._id] = game
    }
    return map
  }, [games])

  const resolveGameLabel = (session) => {
    const code = session.gameCode || session.game?.code
    const id = session.gameId || session.game?._id
    const game = gameMap[code] || gameMap[id]
    if (game) return `${game.name} (${game.code})`
    return code || id || '—'
  }

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit }
      if (operatorId) params.operatorId = operatorId
      if (status) params.status = status
      if (gameCode) params.gameCode = gameCode

      const { data } = await getSessions(params)
      const parsed = parseSessionList(data)
      setSessions(parsed.sessions)
      setTotal(parsed.total)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load sessions'
      )
      setSessions([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, operatorId, status, gameCode])

  useEffect(() => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (limit !== 20) params.set('limit', String(limit))
    if (operatorId) params.set('operatorId', operatorId)
    if (gameCode) params.set('gameCode', gameCode)
    if (status) params.set('status', status)
    setSearchParams(params, { replace: true })
    fetchSessions()
  }, [page, limit, operatorId, gameCode, status, fetchSessions, setSearchParams])

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [operatorsRes, gamesRes] = await Promise.all([
          getOperators(),
          getGames(),
        ])
        setOperators(operatorsRes.data.operators || [])
        setGames(gamesRes.data.games || [])
      } catch {
        setOperators([])
        setGames([])
      }
    }
    fetchFilters()
  }, [])

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!trackToken.trim()) return
    setTracking(true)
    setTrackError('')
    try {
      const { data } = await trackSession(trackToken.trim())
      const session = parseSession(data)
      const id = session._id || session.sessionId || session.id
      if (id) {
        navigate(`/sessions/${id}`)
      } else {
        setTrackError('Session found but no session ID returned')
      }
    } catch (err) {
      setTrackError(
        err.response?.data?.message ||
          err.message ||
          'Session not found for this token'
      )
    } finally {
      setTracking(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const columns = [
    {
      key: 'sessionId',
      label: 'Session',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900 font-mono text-xs">
            {row._id || row.sessionId || row.id || '—'}
          </p>
          {row.sessionToken && (
            <p className="text-xs text-slate-400 truncate max-w-[180px]">
              {row.sessionToken}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'operatorId',
      label: 'Operator',
      render: (row) => row.operatorId || row.operator?.operatorId || '—',
    },
    {
      key: 'game',
      label: 'Game',
      render: (row) => resolveGameLabel(row),
    },
    {
      key: 'player',
      label: 'Player',
      render: (row) =>
        row.playerId ||
        row.player?.id ||
        row.player?.playerId ||
        row.externalPlayerId ||
        '—',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleString('en-IN')
          : '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => {
        const id = row._id || row.sessionId || row.id
        if (!id) return '—'
        return (
          <Link
            to={`/sessions/${id}`}
            title="View details"
            className="inline-flex p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )
      },
    },
  ]

  return (
    <>
      <PageHeader
        title="Sessions"
        description="Monitor active game sessions from the session service"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          to="/sessions/stats"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-indigo-200 hover:text-indigo-700"
        >
          <BarChart3 className="w-4 h-4" />
          Session Stats
        </Link>
        <Link
          to="/sessions/round-events"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-indigo-200 hover:text-indigo-700"
        >
          <ListTree className="w-4 h-4" />
          Round Events
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
        <p className="text-sm font-medium text-slate-900 mb-2">Track by session token</p>
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={trackToken}
            onChange={(e) => setTrackToken(e.target.value)}
            placeholder="Paste session token..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={tracking || !trackToken.trim()}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            {tracking ? 'Tracking...' : 'Track'}
          </button>
        </form>
        {trackError && (
          <p className="text-sm text-red-600 mt-2">{trackError}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={operatorId}
          onChange={(e) => {
            setOperatorId(e.target.value)
            setPage(1)
          }}
          className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
        >
          <option value="">All operators</option>
          {operators.map((op) => (
            <option key={op._id} value={op.operatorId}>
              {op.operatorId} — {op.name}
            </option>
          ))}
        </select>

        <select
          value={gameCode}
          onChange={(e) => {
            setGameCode(e.target.value)
            setPage(1)
          }}
          className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 min-w-[180px]"
        >
          <option value="">All games</option>
          {games.map((game) => (
            <option key={game._id} value={game.code}>
              {game.name} ({game.code})
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s || 'all'} value={s}>
              {s || 'All statuses'}
            </option>
          ))}
        </select>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value))
            setPage(1)
          }}
          className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={sessions}
            emptyMessage="No sessions found for the selected filters."
          />

          <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
            <span>
              {total} session{total !== 1 ? 's' : ''} total
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Sessions
