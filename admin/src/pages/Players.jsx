import { useEffect, useState } from 'react'
import { getPlayers } from '../api/axios'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const columns = [
  {
    key: 'name',
    label: 'Player',
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">
          {row.name?.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400">{row.id}</p>
        </div>
      </div>
    ),
  },
  { key: 'operator', label: 'Operator' },
  { key: 'game', label: 'Last Game' },
  {
    key: 'balance',
    label: 'Balance',
    render: (row) => `₹${row.balance?.toLocaleString('en-IN') ?? 0}`,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'joined', label: 'Joined' },
]

function Players() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data } = await getPlayers()
        setPlayers(data.players || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load players')
      } finally {
        setLoading(false)
      }
    }
    fetchPlayers()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  return (
    <>
      <PageHeader title="Players" description="View and manage registered players across all operators" />
      <DataTable columns={columns} data={players} emptyMessage="No players registered yet." />
    </>
  )
}

export default Players
