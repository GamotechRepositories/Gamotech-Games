import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { createIntegration } from '../api/opa'
import { getOperators } from '../api/axios'
import IntegrationForm from '../components/IntegrationForm'
import PageHeader from '../components/PageHeader'
import {
  buildIntegrationPayload,
  initialIntegrationForm,
} from '../utils/integrationForm'

function AddOperatorAdapter() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialIntegrationForm)
  const [operators, setOperators] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const { data } = await getOperators()
        setOperators(data.operators || [])
      } catch {
        setOperators([])
      }
    }
    fetchOperators()
  }, [])

  useEffect(() => {
    if (!form.operatorId || form.name) return
    const selected = operators.find((op) => op.operatorId === form.operatorId)
    if (selected) {
      setForm((prev) => ({
        ...prev,
        name: selected.name,
        adapter: prev.adapter || 'generic-rest',
      }))
    }
  }, [form.operatorId, form.name, operators])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const payload = buildIntegrationPayload({
        ...form,
        createdBy: form.createdBy || admin.email || admin.name || '',
      })
      await createIntegration(payload)
      setSuccess('Operator adapter created successfully!')
      setTimeout(() => navigate('/operator-adapters'), 1200)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          (err instanceof SyntaxError ? 'Invalid JSON in metadata or custom headers' : 'Failed to create adapter')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Add Operator Adapter"
        description="Create a new operator integration on OPA"
        action={
          <Link
            to="/operator-adapters"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Adapters
          </Link>
        }
      />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <IntegrationForm form={form} onChange={setForm} operators={operators} />

        <div className="flex items-center justify-end gap-3 mt-6">
          <Link
            to="/operator-adapters"
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Adapter
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}

export default AddOperatorAdapter
