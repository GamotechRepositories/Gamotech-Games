import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getSessionById, parseSession } from '../api/sessions'
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

function SessionDetails() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await getSessionById(sessionId)
        setSession(parseSession(data))
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

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
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
          <DetailItem label="Session Token" value={session.sessionToken} />
          <DetailItem label="Currency" value={session.currency} />
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

        {session.metadata && Object.keys(session.metadata).length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-900 mb-2">Metadata</p>
            <pre className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-auto text-slate-700">
              {JSON.stringify(session.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  )
}

export default SessionDetails
