import { useEffect, useState } from 'react'
import { getApiLogs } from '../api/axios'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'

const columns = [
  { key: 'id', label: 'Log ID' },
  {
    key: 'method',
    label: 'Method',
    render: (row) => (
      <span className={`font-mono text-xs font-semibold ${row.method === 'GET' ? 'text-blue-600' : 'text-amber-600'}`}>
        {row.method}
      </span>
    ),
  },
  {
    key: 'endpoint',
    label: 'Endpoint',
    render: (row) => <span className="font-mono text-xs text-slate-600">{row.endpoint}</span>,
  },
  { key: 'operator', label: 'Operator' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'responseTime', label: 'Response Time' },
  { key: 'time', label: 'Time' },
]

function ApiLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await getApiLogs()
        setLogs(data.logs || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load API logs')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  return (
    <>
      <PageHeader title="API Logs" description="Monitor API requests, responses and errors" />
      <DataTable columns={columns} data={logs} emptyMessage="No API logs recorded yet." />
    </>
  )
}

export default ApiLogs
