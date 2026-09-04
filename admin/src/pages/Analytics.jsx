import { useEffect, useState } from 'react'
import { Users, Activity, Gamepad2, TrendingUp } from 'lucide-react'
import { getAnalytics } from '../api/axios'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'

const formatNumber = (n) => n.toLocaleString('en-IN')

function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: response } = await getAnalytics()
        setData(response)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  const stats = data.stats

  return (
    <>
      <PageHeader title="Analytics" description="Platform performance metrics and user insights" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Daily Active Users" value={formatNumber(stats.dailyActiveUsers)} trend={stats.trends.dailyActiveUsers} icon={Users} color="#6366f1" />
        <StatCard title="Sessions Today" value={formatNumber(stats.sessionsToday)} trend={stats.trends.sessionsToday} icon={Activity} color="#3b82f6" />
        <StatCard title="Games Played" value={formatNumber(stats.gamesPlayed)} trend={stats.trends.gamesPlayed} icon={Gamepad2} color="#8b5cf6" />
        <StatCard title="Growth Rate" value={`${stats.growthRate}%`} trend={stats.trends.growthRate} icon={TrendingUp} color="#22c55e" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Key Metrics</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {data.metrics.map((item) => (
            <div key={item.metric} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50">
              <span className="text-sm text-slate-700">{item.metric}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                {item.change !== '—' && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {item.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Analytics
