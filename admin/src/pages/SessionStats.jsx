import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BarChart3, Users } from 'lucide-react'
import { getGames, getOperators } from '../api/axios'
import {
  formatCurrency,
  getStatsByGame,
  getStatsByOperator,
} from '../api/sessions'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import SessionReportFilters from '../components/SessionReportFilters'

const MODES = [
  { id: 'operator', label: 'By Operator' },
  { id: 'game', label: 'By Game' },
]

function SummaryCard({ label, value, tone = 'default' }) {
  const toneClass =
    tone === 'win'
      ? 'text-emerald-600'
      : tone === 'loss'
        ? 'text-red-600'
        : 'text-slate-900'

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  )
}

function SessionStats() {
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'game' ? 'game' : 'operator'

  const [operators, setOperators] = useState([])
  const [games, setGames] = useState([])
  const [summary, setSummary] = useState(null)
  const [byPlayer, setByPlayer] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  const [operatorId, setOperatorId] = useState(searchParams.get('operatorId') || '')
  const [gameCode, setGameCode] = useState(searchParams.get('gameCode') || '')
  const [from, setFrom] = useState(searchParams.get('from') || '')
  const [to, setTo] = useState(searchParams.get('to') || '')

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
    const params = {}
    if (mode === 'operator') {
      if (operatorId) params.operatorId = operatorId
      if (gameCode) params.gameCode = gameCode
    } else {
      if (gameCode) params.gameCode = gameCode
      if (operatorId) params.operatorId = operatorId
    }
    if (from) params.from = new Date(from).toISOString()
    if (to) params.to = new Date(to).toISOString()
    return params
  }, [mode, operatorId, gameCode, from, to])

  const fetchStats = useCallback(async () => {
    const params = buildParams()
    if (mode === 'operator' && !params.operatorId) {
      setError('Select an operator to load stats.')
      setLoaded(false)
      return
    }
    if (mode === 'game' && !params.gameCode) {
      setError('Select a game to load stats.')
      setLoaded(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const { data } =
        mode === 'operator'
          ? await getStatsByOperator(params)
          : await getStatsByGame(params)

      setSummary(data.summary || null)
      setByPlayer(Array.isArray(data.byPlayer) ? data.byPlayer : [])
      setLoaded(true)

      const nextParams = new URLSearchParams({ mode })
      if (operatorId) nextParams.set('operatorId', operatorId)
      if (gameCode) nextParams.set('gameCode', gameCode)
      if (from) nextParams.set('from', from)
      if (to) nextParams.set('to', to)
      setSearchParams(nextParams, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load session stats')
      setSummary(null)
      setByPlayer([])
      setLoaded(false)
    } finally {
      setLoading(false)
    }
  }, [buildParams, mode, operatorId, gameCode, from, to, setSearchParams])

  useEffect(() => {
    const hasRequired =
      (mode === 'operator' && operatorId) || (mode === 'game' && gameCode)
    if (hasRequired) {
      fetchStats()
    }
  }, [mode])

  const playerColumns = useMemo(
    () => [
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
      { key: 'totalRounds', label: 'Rounds' },
      { key: 'wins', label: 'Wins', render: (row) => <span className="text-emerald-600 font-medium">{row.wins ?? 0}</span> },
      { key: 'losses', label: 'Losses', render: (row) => <span className="text-red-600 font-medium">{row.losses ?? 0}</span> },
      { key: 'draws', label: 'Draws' },
      { key: 'totalBet', label: 'Total Bet', render: (row) => formatCurrency(row.totalBet) },
      { key: 'totalPayout', label: 'Total Payout', render: (row) => formatCurrency(row.totalPayout) },
      {
        key: 'netPayout',
        label: 'Net Payout',
        render: (row) => {
          const value = Number(row.netPayout ?? 0)
          const className =
            value > 0 ? 'text-emerald-600 font-semibold' : value < 0 ? 'text-red-600 font-semibold' : 'text-slate-700'
          return <span className={className}>{formatCurrency(value)}</span>
        },
      },
    ],
    []
  )

  const netOverall = (summary?.totalPayout ?? 0) - (summary?.totalBet ?? 0)

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
        title="Session Stats"
        description="Win/loss breakdown by operator or game"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
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
          to="/sessions/round-events"
          className="ml-auto inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
        >
          View Round Events
        </Link>
      </div>

      <SessionReportFilters
        operators={operators}
        games={games}
        showOperator
        showGame
        operatorId={operatorId}
        gameCode={gameCode}
        from={from}
        to={to}
        onOperatorChange={setOperatorId}
        onGameChange={setGameCode}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubmit={fetchStats}
        loading={loading}
      />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading && !loaded ? (
        <LoadingSpinner />
      ) : loaded && summary ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <SummaryCard label="Total Rounds" value={summary.totalRounds ?? 0} />
            <SummaryCard label="Wins" value={summary.wins ?? 0} tone="win" />
            <SummaryCard label="Losses" value={summary.losses ?? 0} tone="loss" />
            <SummaryCard
              label="Net (Payout − Bet)"
              value={formatCurrency(netOverall)}
              tone={netOverall > 0 ? 'win' : netOverall < 0 ? 'loss' : 'default'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard label="Total Bet" value={formatCurrency(summary.totalBet)} />
            <SummaryCard label="Total Payout" value={formatCurrency(summary.totalPayout)} />
            <SummaryCard label="Draws / Unknown" value={`${summary.draws ?? 0} / ${summary.unknown ?? 0}`} />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Per-Player Breakdown</h3>
            </div>
            <DataTable
              columns={playerColumns}
              data={byPlayer}
              emptyMessage="No player stats for the selected filters."
            />
          </div>
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p>Select {mode === 'operator' ? 'an operator' : 'a game'} and apply filters to view stats.</p>
        </div>
      )}
    </>
  )
}

export default SessionStats
