import { useEffect, useState } from 'react'
import {
  Activity,
  Building2,
  DollarSign,
  Gamepad2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { getDashboardStats } from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import TopGamesChart from '../components/TopGamesChart'
import RecentTransactions from '../components/RecentTransactions'
import LiveActivity from '../components/LiveActivity'

const formatCurrency = (n) => {
  if (n >= 1000000) return `₹${(n / 1000000).toFixed(1)}M`
  return `₹${n.toLocaleString('en-IN')}`
}

const formatNumber = (n) => n.toLocaleString('en-IN')

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: response } = await getDashboardStats()
        setData(response)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
        {error}
      </div>
    )
  }

  const stats = data.stats

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <StatCard title="Total Operators" value={formatNumber(stats.totalOperators)} trend={stats.trends.totalOperators} icon={Building2} color="#6366f1" />
        <StatCard title="Total Games" value={formatNumber(stats.totalGames)} trend={stats.trends.totalGames} icon={Gamepad2} color="#8b5cf6" />
        <StatCard title="Total Players" value={formatNumber(stats.totalPlayers)} trend={stats.trends.totalPlayers} icon={Users} color="#3b82f6" />
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend={stats.trends.totalRevenue} icon={DollarSign} color="#22c55e" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard compact title="Bets Today" value={formatCurrency(stats.betsToday)} trend={stats.trends.betsToday} icon={TrendingUp} color="#6366f1" />
        <StatCard compact title="Wins Today" value={formatCurrency(stats.winsToday)} trend={stats.trends.winsToday} icon={DollarSign} color="#22c55e" />
        <StatCard compact title="Active Sessions" value={formatNumber(stats.activeSessions)} trend={stats.trends.activeSessions} icon={Activity} color="#f59e0b" />
        <StatCard
          compact
          title="API Calls"
          value={stats.apiCalls >= 1000000 ? `${(stats.apiCalls / 1000000).toFixed(1)}M` : formatNumber(stats.apiCalls)}
          trend={stats.trends.apiCalls}
          icon={Zap}
          color="#ec4899"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2">
          <RevenueChart data={data.revenueChart} />
        </div>
        <TopGamesChart games={data.topGames} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
        <LiveActivity activities={data.liveActivity} />
      </div>
    </>
  )
}

export default Dashboard
