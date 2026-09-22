import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { getSessionById, parseSessionDetail } from '../api/sessions'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-slate-900 break-all">{value ?? '—'}</p>
    </div>
  )
}

function PayloadCell({ payload }) {
  const [open, setOpen] = useState(false)

  if (!payload || typeof payload !== 'object') {
    return <span className="text-slate-500">—</span>
  }

  const preview = JSON.stringify(payload)
  const short = preview.length > 60 ? `${preview.slice(0, 60)}…` : preview

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
      >
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {open ? 'Hide payload' : 'View payload'}
      </button>
      {!open && (
        <p className="mt-1 text-xs text-slate-500 font-mono break-all">{short}</p>
      )}
      {open && (
        <pre className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-auto text-slate-700 max-h-48">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </div>
  )
}

function SessionDetails() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await getSessionById(sessionId)
        const parsed = parseSessionDetail(data)
        setSession(parsed.session)
        setEvents(parsed.events)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load session details'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [sessionId])

  const eventColumns = useMemo(
    () => [
      {
        key: 'createdAt',
        label: 'Time',
        render: (row) =>
          row.createdAt
            ? new Date(row.createdAt).toLocaleString('en-IN')
            : '—',
      },
      {
        key: 'event',
        label: 'Event',
        render: (row) => (
          <span className="inline-flex px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
            {row.event || '—'}
          </span>
        ),
      },
      {
        key: 'eventId',
        label: 'Event ID',
        className: 'font-mono text-xs',
        render: (row) => row.eventId || '—',
      },
      {
        key: 'payload',
        label: 'Payload',
        render: (row) => <PayloadCell payload={row.payload} />,
      },
    ],
    []
  )

  if (loading) return <LoadingSpinner />
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
    )
  }
  if (!session) return null

  const gameCode = session.gameCode || session.game?.code
  const gameQuery = gameCode ? `?gameCode=${encodeURIComponent(gameCode)}` : ''

  return (
    <>
      <Link
        to={`/sessions${gameQuery}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sessions
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Session Details</h2>
            <p className="text-sm text-slate-500 font-mono mt-1">
              {session._id || session.sessionId || sessionId}
            </p>
          </div>
          <StatusBadge status={session.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DetailItem label="Operator ID" value={session.operatorId} />
          <DetailItem label="Game Code" value={gameCode} />
          <DetailItem label="Game ID" value={session.gameId || session.game?._id} />
          <DetailItem
            label="Player ID"
            value={
              session.playerId ||
              session.externalPlayerId ||
              session.player?.playerId
            }
          />
          <DetailItem
            label="Player Username"
            value={session.playerUsername || session.player?.username}
          />
          <DetailItem label="Session Token" value={session.sessionToken} />
          <DetailItem label="Currency" value={session.currency} />
          <DetailItem label="Last Event ID" value={session.lastEventId} />
          <DetailItem
            label="Created"
            value={
              session.createdAt
                ? new Date(session.createdAt).toLocaleString('en-IN')
                : null
            }
          />
          <DetailItem
            label="Updated"
            value={
              session.updatedAt
                ? new Date(session.updatedAt).toLocaleString('en-IN')
                : null
            }
          />
          <DetailItem
            label="Expires"
            value={
              session.expiresAt
                ? new Date(session.expiresAt).toLocaleString('en-IN')
                : null
            }
          />
        </div>

        {session.gameContext && Object.keys(session.gameContext).length > 0 && (
          <div className="border-t border-slate-200 pt-4 mb-4">
            <p className="text-sm font-semibold text-slate-900 mb-2">Game Context</p>
            <pre className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-auto text-slate-700">
              {JSON.stringify(session.gameContext, null, 2)}
            </pre>
          </div>
        )}

        {session.metadata && Object.keys(session.metadata).length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-900 mb-2">Metadata</p>
            <pre className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-auto text-slate-700">
              {JSON.stringify(session.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Session Events</h3>
            <p className="text-sm text-slate-500">
              Lifecycle events returned from the session detail API
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {events.length} event{events.length === 1 ? '' : 's'}
          </span>
        </div>

        <DataTable
          columns={eventColumns}
          data={events}
          emptyMessage="No session events recorded for this session yet."
        />
      </div>
    </>
  )
}

export default SessionDetails
