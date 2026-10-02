import { useEffect, useState } from 'react'
import { Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight, CreditCard } from 'lucide-react'
import { getWallet } from '../api/axios'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import StatCard from '../components/StatCard'

const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`

const summaryConfig = [
  { key: 'totalBalance', label: 'Total Balance', icon: WalletIcon, color: '#6366f1' },
  { key: 'depositsToday', label: 'Deposits Today', icon: ArrowDownLeft, color: '#059669' },
  { key: 'withdrawalsToday', label: 'Withdrawals Today', icon: ArrowUpRight, color: '#dc2626' },
  { key: 'pendingRequests', label: 'Pending Requests', icon: CreditCard, color: '#d97706', isCount: true },
]

const columns = [
  { key: 'id', label: 'Wallet ID', render: (row) => row.id?.slice(-8) || '—' },
  { key: 'operator', label: 'Operator' },
  {
    key: 'balance',
    label: 'Total Balance',
    render: (row) => formatCurrency(row.balance),
  },
  {
    key: 'locked',
    label: 'Locked',
    render: (row) => formatCurrency(row.locked),
  },
  {
    key: 'available',
    label: 'Available',
    render: (row) => formatCurrency(row.available),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
]

function Wallet() {
  const [summary, setSummary] = useState(null)
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await getWallet()
        setSummary(data.summary)
        setWallets(data.wallets || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load wallet data')
      } finally {
        setLoading(false)
      }
    }
    fetchWallet()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  return (
    <>
      <PageHeader title="Wallet" description="Operator wallet balances and fund management" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {summaryConfig.map((item) => (
          <StatCard
            key={item.key}
            title={item.label}
            value={item.isCount ? (summary?.[item.key] ?? 0) : formatCurrency(summary?.[item.key] ?? 0)}
            trend={summary?.trends?.[item.key]}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>

      <DataTable columns={columns} data={wallets} emptyMessage="No operator wallets found. Add operators to get started." />
    </>
  )
}

export default Wallet
