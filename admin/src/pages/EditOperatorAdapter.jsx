import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { getIntegration, parseIntegration, updateIntegration } from '../api/opa'
import IntegrationForm from '../components/IntegrationForm'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import {
  buildIntegrationPayload,
  integrationToForm,
} from '../utils/integrationForm'

function EditOperatorAdapter() {
  const { operatorId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        const { data } = await getIntegration(operatorId)
        setForm(integrationToForm(parseIntegration(data)))
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load operator adapter'
        )
      } finally {
        setFetching(false)
      }
    }
    fetchIntegration()
  }, [operatorId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const payload = buildIntegrationPayload({
        ...form,
        updatedBy: form.updatedBy || admin.email || admin.name || '',
      })
      await updateIntegration(operatorId, payload)
      setSuccess('Operator adapter updated successfully!')
      setTimeout(() => navigate('/operator-adapters'), 1200)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          (err instanceof SyntaxError ? 'Invalid JSON in metadata or custom headers' : 'Failed to update adapter')
      )
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <LoadingSpinner />
  if (!form) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
        {error || 'Operator adapter not found'}
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Edit Operator Adapter"
        description={`Update integration for ${operatorId}`}
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
        <IntegrationForm form={form} onChange={setForm} operatorIdReadOnly isEdit />

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
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}

export default EditOperatorAdapter
