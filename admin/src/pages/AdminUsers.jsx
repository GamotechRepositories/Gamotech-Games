import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { getAdmins } from '../api/axios'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'

function AdminUsers() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data } = await getAdmins()
        setAdmins(data.admins || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin users')
      } finally {
        setLoading(false)
      }
    }
    fetchAdmins()
  }, [])

  const columns = [
    {
      key: 'name',
      label: 'Admin',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">
            {row.name?.charAt(0)?.toUpperCase()}
          </div>
          <p className="font-medium text-slate-900">{row.name}</p>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN'),
    },
  ]

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  return (
    <>
      <PageHeader
        title="Admin Users"
        description="Manage admin accounts and access permissions"
        action={
          <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        }
      />
      <DataTable columns={columns} data={admins} emptyMessage="No admin users found." />
    </>
  )
}

export default AdminUsers
