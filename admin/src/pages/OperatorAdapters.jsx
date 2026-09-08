import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import {
  deleteIntegration,
  getIntegrations,
  parseIntegrationList,
} from '../api/opa'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

function OperatorAdapters() {
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [environmentFilter, setEnvironmentFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const fetchIntegrations = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (environmentFilter) params.environment = environmentFilter
      const { data } = await getIntegrations(params)
      setIntegrations(parseIntegrationList(data))
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load operator adapters'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntegrations()
  }, [statusFilter, environmentFilter])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteIntegration(deleteTarget.operatorId)
      setIntegrations((prev) =>
        prev.filter((item) => item.operatorId !== deleteTarget.operatorId)
      )
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          err.message ||
          'Failed to delete operator adapter'
      )
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'operatorId',
      label: 'Operator ID',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.operatorId}</p>
          <p className="text-xs text-slate-400">{row.adapter}</p>
        </div>
      ),
    },
    { key: 'name', label: 'Name' },
    {
      key: 'environment',
      label: 'Environment',
      render: (row) => (
        <span className="text-xs font-medium uppercase text-slate-600">{row.environment}</span>
      ),
    },
    {
      key: 'transport',
      label: 'Transport',
      render: (row) => row.transport?.type || '—',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/operator-adapters/${encodeURIComponent(row.operatorId)}/edit`}
            title="Edit"
            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            type="button"
            title="Delete"
            onClick={() => setDeleteTarget(row)}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  if (loading) return <LoadingSpinner />

  return (
    <>
      <PageHeader
        title="Operator Adapters"
        description="Manage operator integration adapters via OPA service"
        action={
          <Link
            to="/operator-adapters/add"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Adapter
          </Link>
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
        <select
          value={environmentFilter}
          onChange={(e) => setEnvironmentFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
        >
          <option value="">All environments</option>
          <option value="SANDBOX">Sandbox</option>
          <option value="PRODUCTION">Production</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {deleteError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {deleteError}
        </div>
      )}

      <DataTable
        columns={columns}
        data={integrations}
        emptyMessage="No operator adapters found. Create your first adapter."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Operator Adapter"
        message={
          deleteTarget
            ? `Delete adapter for "${deleteTarget.operatorId}"? This cannot be undone.`
            : ''
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteTarget(null)
          setDeleteError('')
        }}
      />
    </>
  )
}

export default OperatorAdapters
