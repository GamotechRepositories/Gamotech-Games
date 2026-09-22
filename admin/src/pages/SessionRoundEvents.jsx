import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, ListTree } from 'lucide-react'
import { getGames, getOperators } from '../api/axios'
import {
  formatCurrency,
  getRoundEventsByGame,
  getRoundEventsByOperator,
  parseRoundEventList,
} from '../api/sessions'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import SessionReportFilters from '../components/SessionReportFilters'
import StatusBadge from '../components/StatusBadge'

const MODES = [
  { id: 'operator', label: 'By Operator' },
  { id: 'game', label: 'By Game' },
]

function PayloadPreview({ payload }) {
  const [open, setOpen] = useState(false)
  if (!payload) return '—'

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
      >
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {open ? 'Hide' : 'View'}
      </button>
      {open && (
        <pre className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-auto max-h-32">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </div>
  )
}

function SessionRoundEvents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'game' ? 'game' : 'operator'

  const [operators, setOperators] = useState([])
  const [games, setGames] = useState([])
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  const [operatorId, setOperatorId] = useState(searchParams.get('operatorId') || '')
  const [gameCode, setGameCode] = useState(searchParams.get('gameCode') || '')
  const [from, setFrom] = useState(searchParams.get('from') || '')
  const [to, setTo] = useState(searchParams.get('to') || '')
  const [result, setResult] = useState(searchParams.get('result') || '')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 20)

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [operatorsRes, gamesRes] = await Promise.all([
          getOperators(),
          getGames({ status: 'ACTIVE' }),
        ])
        setOperators(operatorsRes.data?.operators || operatorsRes.data || [])
        setGames(gamesRes.data?.games || gamesRes.data || [])
      } catch {
        setOperators([])
        setGames([])
      }
    }
    loadOptions()
  }, [])

  const buildParams = useCallback(() => {
    const params = { page, limit }
    if (mode === 'operator') {
      if (operatorId) params.operatorId = operatorId
    } else if (gameCode) {
      params.gameCode = gameCode
    }
    if (mode === 'operator' && gameCode) params.gameCode = gameCode
    if (mode === 'game' && operatorId) params.operatorId = operatorId
    if (from) params.from = new Date(from).toISOString()
    if (to) params.to = new Date(to).toISOString()
    if (result) params.result = result
    return params
  }, [mode, operatorId, gameCode, from, to, result, page, limit])

  const fetchEvents = useCallback(async () => {
    const params = buildParams()
    if (mode === 'operator' && !params.operatorId) {
      setError('Select an operator to load round events.')
      setLoaded(false)
      return
    }
    if (mode === 'game' && !params.gameCode) {
      setError('Select a game to load round events.')
      setLoaded(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const { data } =
        mode === 'operator'
          ? await getRoundEventsByOperator(params)
          : await getRoundEventsByGame(params)

      const parsed = parseRoundEventList(data)
      setEvents(parsed.events)
      setPagination(parsed.pagination)
      setLoaded(true)

      const nextParams = new URLSearchParams({ mode })
      if (operatorId) nextParams.set('operatorId', operatorId)
      if (gameCode) nextParams.set('gameCode', gameCode)
      if (from) nextParams.set('from', from)
      if (to) nextParams.set('to', to)
      if (result) nextParams.set('result', result)
      if (page > 1) nextParams.set('page', String(page))
      if (limit !== 20) nextParams.set('limit', String(limit))
      setSearchParams(nextParams, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load round events')
      setEvents([])
      setLoaded(false)
    } finally {
      setLoading(false)
    }
  }, [buildParams, mode, operatorId, gameCode, from, to, result, page, limit, setSearchParams])

  useEffect(() => {
    const hasRequired =
      (mode === 'operator' && operatorId) || (mode === 'game' && gameCode)
    if (hasRequired) {
      fetchEvents()
    }
  }, [mode, page, limit])

  const columns = useMemo(
    () => [
      {
        key: 'createdAt',
        label: 'Time',
        render: (row) =>
          row.createdAt ? new Date(row.createdAt).toLocaleString('en-IN') : '—',
      },
      {
        key: 'playerUsername',
        label: 'Player',
        render: (row) => (
          <div>
            <p className="font-medium text-slate-900">{row.playerUsername || '—'}</p>
            <p className="text-xs text-slate-400 font-mono">{row.playerId || '—'}</p>
          </div>
        ),
      },
      { key: 'gameCode', label: 'Game' },
      { key: 'operatorId', label: 'Operator' },
      {
        key: 'result',
        label: 'Result',
        render: (row) => <StatusBadge status={row.result || 'UNKNOWN'} />,
      },
      {
        key: 'betAmount',
        label: 'Bet',
        render: (row) => formatCurrency(row.betAmount, row.currency || 'INR'),
      },
      {
        key: 'payout',
        label: 'Payout',
        render: (row) => formatCurrency(row.payout, row.currency || 'INR'),
      },
      { key: 'roundId', label: 'Round ID', className: 'font-mono text-xs' },
      {
        key: 'sessionId',
        label: 'Session',
        render: (row) =>
          row.sessionId ? (
            <Link to={`/sessions/${row.sessionId}`} className="text-indigo-600 hover:underline font-mono text-xs">
              {row.sessionId}
            </Link>
          ) : (
            '—'
          ),
      },
      {
        key: 'payload',
        label: 'Payload',
        render: (row) => <PayloadPreview payload={row.payload} />,
      },
    ],
    []
  )

  const totalPages = Math.max(1, pagination.totalPages || 1)

  return (
    <>
      <Link
        to="/sessions"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sessions
      </Link>

      <PageHeader
        title="Round Events"
        description="Detailed ROUND_ENDED events with win/loss results"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setPage(1)
              setSearchParams({ mode: item.id })
              setLoaded(false)
              setError('')
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium border transition-colors ${
              mode === item.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'
            }`}
          >
            {item.label}
          </button>
        ))}
        <Link
          to="/sessions/stats"
          className="ml-auto inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
        >
          View Session Stats
        </Link>
      </div>

      <SessionReportFilters
        operators={operators}
        games={games}
        showOperator
        showGame
        showResult
        operatorId={operatorId}
        gameCode={gameCode}
        from={from}
        to={to}
        result={result}
        onOperatorChange={setOperatorId}
        onGameChange={setGameCode}
        onFromChange={setFrom}
        onToChange={setTo}
        onResultChange={setResult}
        onSubmit={() => {
          setPage(1)
          fetchEvents()
        }}
        loading={loading}
      />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading && !loaded ? (
        <LoadingSpinner />
      ) : loaded ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ListTree className="w-4 h-4" />
              {pagination.total} event{pagination.total === 1 ? '' : 's'}
            </div>
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

          <DataTable
            columns={columns}
            data={events}
            emptyMessage="No round events found for the selected filters."
          />

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-500">
                Page {pagination.page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((value) => value - 1)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((value) => value + 1)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <ListTree className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p>Select {mode === 'operator' ? 'an operator' : 'a game'} and apply filters to view round events.</p>
        </div>
      )}
    </>
  )
}

export default SessionRoundEvents
