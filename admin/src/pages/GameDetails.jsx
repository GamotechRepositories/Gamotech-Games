import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getGameById } from '../api/axios'
import GameImage from '../components/GameImage'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-slate-900 break-words">{value ?? '—'}</p>
    </div>
  )
}

function GameDetails() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { data } = await getGameById(id)
        setGame(data.game)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load game details')
      } finally {
        setLoading(false)
      }
    }
    fetchGame()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
    )
  }
  if (!game) return null

  const imageUrl = game.thumbnail || game.banner || game.icon

  return (
    <>
      <div className="mb-6">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Link>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={game.name}
                  className="w-full md:w-48 h-48 object-cover rounded-2xl border border-slate-200 bg-slate-100"
                />
              ) : (
                <GameImage game={game} size="lg" className="w-48 h-48 !rounded-2xl" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{game.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{game.code} · {game.slug}</p>
                </div>
                <StatusBadge status={game.status} />
              </div>
              {game.description && (
                <p className="text-sm text-slate-600 mb-4">{game.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {game.isFeatured && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                    Featured
                  </span>
                )}
                {game.isDemoAvailable && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Demo Available
                  </span>
                )}
                {game.maintenanceMode && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                    Maintenance
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Game Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Category" value={game.category} />
            <DetailItem label="Version" value={game.version} />
            <DetailItem label="Min Bet" value={`₹${game.minBet?.toLocaleString('en-IN')}`} />
            <DetailItem label="Max Bet" value={`₹${game.maxBet?.toLocaleString('en-IN')}`} />
            <DetailItem label="RTP" value={game.rtp ? `${game.rtp}%` : '—'} />
            <DetailItem label="Sort Order" value={game.sortOrder} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Localization</h3>
          <div className="space-y-4">
            <DetailItem
              label="Supported Currencies"
              value={game.supportedCurrencies?.length ? game.supportedCurrencies.join(', ') : '—'}
            />
            <DetailItem
              label="Supported Languages"
              value={game.supportedLanguages?.length ? game.supportedLanguages.join(', ') : '—'}
            />
            <DetailItem
              label="Tags"
              value={game.tags?.length ? game.tags.join(', ') : '—'}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900 mb-4">URLs</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Launch URL</p>
                <p className="text-sm text-slate-900 break-all">{game.launchUrl}</p>
              </div>
              {game.launchUrl && (
                <a
                  href={game.launchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 p-2 rounded-lg hover:bg-white text-indigo-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            {game.demoUrl && (
              <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Demo URL</p>
                  <p className="text-sm text-slate-900 break-all">{game.demoUrl}</p>
                </div>
                <a
                  href={game.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 p-2 rounded-lg hover:bg-white text-indigo-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {(game.thumbnail || game.banner || game.icon) && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {game.thumbnail && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Thumbnail</p>
                  <img src={game.thumbnail} alt="Thumbnail" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                </div>
              )}
              {game.banner && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Banner</p>
                  <img src={game.banner} alt="Banner" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                </div>
              )}
              {game.icon && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Icon</p>
                  <img src={game.icon} alt="Icon" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default GameDetails
