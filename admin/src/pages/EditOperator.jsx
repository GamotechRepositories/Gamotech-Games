import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { getGames, getOperatorById, updateOperator } from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'

const operatorToForm = (operator) => ({
  operatorId: operator.operatorId || '',
  name: operator.name || '',
  slug: operator.slug || '',
  companyName: operator.companyName || '',
  ownerName: operator.ownerName || '',
  email: operator.email || '',
  phone: operator.phone || '',
  website: operator.website || '',
  logo: operator.logo || '',
  status: operator.status || 'ACTIVE',
  currency: operator.currency || 'INR',
  timezone: operator.timezone || 'Asia/Kolkata',
  language: operator.language || 'en',
  commissionType: operator.commissionType || 'PERCENTAGE',
  commissionValue: operator.commissionValue ?? 0,
  sessionTimeout: operator.sessionTimeout ?? 3600,
  maxConcurrentPlayers: operator.maxConcurrentPlayers ?? 1000,
  isDemoEnabled: operator.isDemoEnabled ?? false,
  maintenanceMode: operator.maintenanceMode ?? false,
  notes: operator.notes || '',
  enabledGames:
    operator.enabledGames?.map((game) =>
      typeof game === 'string' ? game : game._id
    ) || [],
})

const buildPayload = (form) => {
  const { operatorId, ...rest } = form
  return {
    ...rest,
    commissionValue: Number(form.commissionValue),
    sessionTimeout: Number(form.sessionTimeout),
    maxConcurrentPlayers: Number(form.maxConcurrentPlayers),
  }
}

function EditOperator() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [credentials, setCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    apiSecretPath: '',
  })
  const [games, setGames] = useState([])
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operatorRes, gamesRes] = await Promise.all([
          getOperatorById(id),
          getGames(),
        ])
        setForm(operatorToForm(operatorRes.data.operator))
        setCredentials({
          apiKey: operatorRes.data.operator.apiKey || '',
          apiSecret: operatorRes.data.operator.apiSecret || '',
          apiSecretPath: operatorRes.data.operator.apiSecretPath || '',
        })
        setGames(gamesRes.data.games || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load operator')
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setError('')
  }

  const handleGameToggle = (gameId) => {
    setForm((prev) => ({
      ...prev,
      enabledGames: prev.enabledGames.includes(gameId)
        ? prev.enabledGames.filter((gid) => gid !== gameId)
        : [...prev.enabledGames, gameId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await updateOperator(id, buildPayload(form))
      setSuccess('Operator updated successfully!')
      setTimeout(() => navigate('/operators'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update operator')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
  const readOnlyClass =
    'w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-500 cursor-not-allowed'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  if (fetching) return <LoadingSpinner />
  if (!form) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
        {error || 'Operator not found'}
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Edit Operator"
        description="Update operator details and integration settings"
        action={
          <Link
            to="/operators"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Operators
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Operator Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Operator ID</label>
              <input
                type="text"
                value={form.operatorId || 'Will be generated on save'}
                readOnly
                className={readOnlyClass}
              />
              <p className="text-xs text-slate-400 mt-1">
                {form.operatorId
                  ? 'Auto-generated from operator name'
                  : 'Missing ID will be generated when you save'}
              </p>
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-3">
              <label className={labelClass}>Website</label>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>API Key</label>
              <input
                type="text"
                value={credentials.apiKey || '—'}
                readOnly
                className={readOnlyClass}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>AWS Secret Path</label>
              <input
                type="text"
                value={credentials.apiSecretPath || '—'}
                readOnly
                className={readOnlyClass}
              />
              <p className="text-xs text-slate-400 mt-1">
                Microservices use this path to fetch the API secret from AWS Secrets Manager
              </p>
            </div>
            <div className="lg:col-span-3">
              <label className={labelClass}>API Secret</label>
              <input
                type="text"
                value={credentials.apiSecret || '—'}
                readOnly
                className={readOnlyClass}
              />
              <p className="text-xs text-slate-400 mt-1">Value stored in AWS at the path above</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className={inputClass}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Timezone</label>
              <select name="timezone" value={form.timezone} onChange={handleChange} className={inputClass}>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Language</label>
              <select name="language" value={form.language} onChange={handleChange} className={inputClass}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Commission & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Commission Type</label>
              <select
                name="commissionType"
                value={form.commissionType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Commission Value</label>
              <input
                type="number"
                name="commissionValue"
                value={form.commissionValue}
                onChange={handleChange}
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Session Timeout (sec)</label>
              <input
                type="number"
                name="sessionTimeout"
                value={form.sessionTimeout}
                onChange={handleChange}
                min="60"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max Concurrent Players</label>
              <input
                type="number"
                name="maxConcurrentPlayers"
                value={form.maxConcurrentPlayers}
                onChange={handleChange}
                min="1"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isDemoEnabled"
                checked={form.isDemoEnabled}
                onChange={handleChange}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Enable Demo Mode
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={form.maintenanceMode}
                onChange={handleChange}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Maintenance Mode
            </label>
          </div>
        </div>

        {games.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Enabled Games</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {games.map((game) => (
                <label
                  key={game._id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    form.enabledGames.includes(game._id)
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.enabledGames.includes(game._id)}
                    onChange={() => handleGameToggle(game._id)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{game.name}</p>
                    <p className="text-xs text-slate-500">{game.code}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className={labelClass}>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional notes about this operator..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            to="/operators"
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

export default EditOperator
