import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus } from 'lucide-react'
import { getOperators } from '../api/axios'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

function Operators() {
  const [operators, setOperators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const { data } = await getOperators()
        setOperators(data.operators || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load operators')
      } finally {
        setLoading(false)
      }
    }
    fetchOperators()
  }, [])

  const columns = [
    {
      key: 'name',
      label: 'Operator',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400">{row.slug}</p>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'companyName', label: 'Company', render: (row) => row.companyName || '—' },
    { key: 'currency', label: 'Currency' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'enabledGames',
      label: 'Games',
      render: (row) => row.enabledGames?.length || 0,
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/operators/${row._id}/edit`}
            title="Edit"
            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ]

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  return (
    <>
      <PageHeader
        title="Operators"
        description="Manage casino operators and their game integrations"
        action={
          <Link
            to="/operators/add"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Operator
          </Link>
        }
      />
      <DataTable columns={columns} data={operators} emptyMessage="No operators found. Add your first operator." />
    </>
  )
}

export default Operators
