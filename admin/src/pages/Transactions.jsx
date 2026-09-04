import { useEffect, useState } from 'react'
import { getTransactions } from '../api/axios'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const columns = [
  { key: 'id', label: 'Transaction ID' },
  { key: 'player', label: 'Player' },
  { key: 'operator', label: 'Operator' },
  { key: 'game', label: 'Game' },
  { key: 'type', label: 'Type' },
  {
    key: 'amount',
    label: 'Amount',
    render: (row) => `₹${row.amount?.toLocaleString('en-IN') ?? 0}`,
  },
  {
    key: 'win',
    label: 'Win',
    render: (row) => (row.win > 0 ? `₹${row.win.toLocaleString('en-IN')}` : '—'),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'time', label: 'Time' },
]

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await getTransactions()
        setTransactions(data.transactions || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  return (
    <>
      <PageHeader title="Transactions" description="Monitor all bets, wins, deposits and withdrawals" />
      <DataTable columns={columns} data={transactions} emptyMessage="No transactions recorded yet." />
    </>
  )
}

export default Transactions
