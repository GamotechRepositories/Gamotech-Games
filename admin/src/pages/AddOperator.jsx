import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { createOperator, getGames, getOperators } from '../api/axios'
import PageHeader from '../components/PageHeader'
import { suggestOperatorId } from '../utils/operatorId'

const initialForm = {
  operatorId: '',
  name: '',
  slug: '',
  companyName: '',
  ownerName: '',
  email: '',
  phone: '',
  website: '',
  logo: '',
  status: 'ACTIVE',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  language: 'en',
  commissionType: 'PERCENTAGE',
  commissionValue: 0,
  sessionTimeout: 3600,
  maxConcurrentPlayers: 1000,
  isDemoEnabled: false,
  maintenanceMode: false,
  notes: '',
  enabledGames: [],
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function AddOperator() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [games, setGames] = useState([])
  const [existingOperatorIds, setExistingOperatorIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, operatorsRes] = await Promise.all([getGames(), getOperators()])
        setGames(gamesRes.data.games || [])
        setExistingOperatorIds(
          (operatorsRes.data.operators || [])
            .map((op) => op.operatorId)
            .filter(Boolean)
        )
      } catch {
        setGames([])
        setExistingOperatorIds([])
      }
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }
      if (name === 'name') {
        next.operatorId = value ? suggestOperatorId(value, existingOperatorIds) : ''
      }
      return next
    })
    setError('')
  }

  const handleNameBlur = () => {
    setForm((prev) => {
      if (!prev.name) return prev
      const updates = {}
      if (!prev.slug) updates.slug = slugify(prev.name)
      updates.operatorId = suggestOperatorId(prev.name, existingOperatorIds)
      return { ...prev, ...updates }
    })
  }

  const handleGameToggle = (gameId) => {
    setForm((prev) => ({
      ...prev,
      enabledGames: prev.enabledGames.includes(gameId)
        ? prev.enabledGames.filter((id) => id !== gameId)
        : [...prev.enabledGames, gameId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        ...form,
        operatorId: form.operatorId || suggestOperatorId(form.name, existingOperatorIds),
        commissionValue: Number(form.commissionValue),
        sessionTimeout: Number(form.sessionTimeout),
        maxConcurrentPlayers: Number(form.maxConcurrentPlayers),
      }

      await createOperator(payload)
      setSuccess('Operator created successfully!')
      setTimeout(() => navigate('/operators'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create operator')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
  const readOnlyClass =
    'w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-500 cursor-not-allowed'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  return (
    <>
      <PageHeader
        title="Add Operator"
        description="Create a new casino operator and configure their integration"
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
                onBlur={handleNameBlur}
                required
                placeholder="Royal Gaming"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Operator ID</label>
              <input
                type="text"
                name="operatorId"
                value={form.operatorId}
                readOnly
                placeholder="Auto-generated from name"
                className={readOnlyClass}
              />
              <p className="text-xs text-slate-400 mt-1">
                Generated from name, e.g. ROYAL-GAMING-001
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
                placeholder="royal-gaming"
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
                placeholder="Royal Gaming Pvt Ltd"
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
                placeholder="John Doe"
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
                placeholder="admin@royalgaming.com"
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
                placeholder="+91 9876543210"
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
                placeholder="https://royalgaming.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>API Key</label>
              <input
                type="text"
                readOnly
                value=""
                placeholder="Auto-generated on save"
                className={readOnlyClass}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>AWS Secret Path</label>
              <input
                type="text"
                readOnly
                value={
                  form.operatorId ? `gamotech/operators/${form.operatorId}` : ''
                }
                placeholder="Auto-generated from operator ID"
                className={readOnlyClass}
              />
              <p className="text-xs text-slate-400 mt-1">
                Stored in MongoDB; secret value saved in AWS at this path
              </p>
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
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Operator
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}

export default AddOperator
