import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Building2, Gamepad2 } from 'lucide-react'
import { getRevenue } from '../api/axios'
import PageHeader from '../components/PageHeader'
import RevenueChart from '../components/RevenueChart'
import TopGamesChart from '../components/TopGamesChart'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'

const formatCurrency = (n) => {
  if (n >= 1000000) return `₹${(n / 1000000).toFixed(1)}M`
  return `₹${n.toLocaleString('en-IN')}`
}

function Revenue() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const { data: response } = await getRevenue()
        setData(response)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load revenue data')
      } finally {
        setLoading(false)
      }
    }
    fetchRevenue()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  const stats = data.stats

  return (
    <>
      <PageHeader title="Revenue" description="Track revenue performance across operators and games" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend={stats.trends.totalRevenue} icon={DollarSign} color="#22c55e" />
        <StatCard title="Monthly Growth" value={`${stats.monthlyGrowth}%`} trend={stats.trends.monthlyGrowth} icon={TrendingUp} color="#6366f1" />
        <StatCard title="Operator Revenue" value={formatCurrency(stats.operatorRevenue)} trend={stats.trends.operatorRevenue} icon={Building2} color="#3b82f6" />
        <StatCard title="Game Revenue" value={formatCurrency(stats.gameRevenue)} trend={stats.trends.gameRevenue} icon={Gamepad2} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={data.revenueChart} />
        </div>
        <TopGamesChart games={data.topGames} />
      </div>
    </>
  )
}

export default Revenue
