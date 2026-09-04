import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { createGame } from '../api/axios'
import PageHeader from '../components/PageHeader'

const initialForm = {
  name: '',
  slug: '',
  code: '',
  description: '',
  category: 'OTHER',
  thumbnail: '',
  banner: '',
  icon: '',
  version: '1.0.0',
  launchUrl: '',
  demoUrl: '',
  status: 'ACTIVE',
  supportedCurrencies: 'INR',
  supportedLanguages: 'en',
  minBet: 1,
  maxBet: 100000,
  rtp: 0,
  maintenanceMode: false,
  isDemoAvailable: true,
  isFeatured: false,
  sortOrder: 0,
  tags: '',
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const toCode = (value) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 10)

function AddGame() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setError('')
  }

  const handleNameBlur = () => {
    setForm((prev) => {
      const updates = { ...prev }
      if (!prev.slug && prev.name) updates.slug = slugify(prev.name)
      if (!prev.code && prev.name) updates.code = toCode(prev.name)
      return updates
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        ...form,
        minBet: Number(form.minBet),
        maxBet: Number(form.maxBet),
        rtp: Number(form.rtp),
        sortOrder: Number(form.sortOrder),
        supportedCurrencies: form.supportedCurrencies
          ? form.supportedCurrencies.split(',').map((c) => c.trim().toUpperCase()).filter(Boolean)
          : [],
        supportedLanguages: form.supportedLanguages
          ? form.supportedLanguages.split(',').map((l) => l.trim().toLowerCase()).filter(Boolean)
          : [],
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      }

      await createGame(payload)
      setSuccess('Game created successfully!')
      setTimeout(() => navigate('/games'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create game')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  return (
    <>
      <PageHeader
        title="Add Game"
        description="Add a new game to your platform catalog"
        action={
          <Link
            to="/games"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Game Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleNameBlur}
                required
                placeholder="Teen Patti"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="teen-patti"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Game Code *</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                placeholder="TP001"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option value="CARD">Card</option>
                <option value="BOARD">Board</option>
                <option value="CASUAL">Casual</option>
                <option value="SLOT">Slot</option>
                <option value="LIVE">Live</option>
                <option value="TABLE">Table</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Version</label>
              <input
                type="text"
                name="version"
                value={form.version}
                onChange={handleChange}
                placeholder="1.0.0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the game..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Launch URLs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Launch URL *</label>
              <input
                type="url"
                name="launchUrl"
                value={form.launchUrl}
                onChange={handleChange}
                required
                placeholder="https://games.example.com/launch/teen-patti"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Demo URL</label>
              <input
                type="url"
                name="demoUrl"
                value={form.demoUrl}
                onChange={handleChange}
                placeholder="https://games.example.com/demo/teen-patti"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://cdn.example.com/thumb.jpg"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Banner URL</label>
              <input
                type="url"
                name="banner"
                value={form.banner}
                onChange={handleChange}
                placeholder="https://cdn.example.com/banner.jpg"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Icon URL</label>
              <input
                type="url"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="https://cdn.example.com/icon.png"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Betting & Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Min Bet (₹)</label>
              <input
                type="number"
                name="minBet"
                value={form.minBet}
                onChange={handleChange}
                min="1"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max Bet (₹)</label>
              <input
                type="number"
                name="maxBet"
                value={form.maxBet}
                onChange={handleChange}
                min="1"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>RTP (%)</label>
              <input
                type="number"
                name="rtp"
                value={form.rtp}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Supported Currencies</label>
              <input
                type="text"
                name="supportedCurrencies"
                value={form.supportedCurrencies}
                onChange={handleChange}
                placeholder="INR, USD"
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">Comma-separated</p>
            </div>
            <div>
              <label className={labelClass}>Supported Languages</label>
              <input
                type="text"
                name="supportedLanguages"
                value={form.supportedLanguages}
                onChange={handleChange}
                placeholder="en, hi"
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">Comma-separated</p>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Tags</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="popular, card, multiplayer"
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">Comma-separated</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isDemoAvailable"
                checked={form.isDemoAvailable}
                onChange={handleChange}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Demo Available
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Featured Game
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

        <div className="flex items-center justify-end gap-3">
          <Link
            to="/games"
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
                Create Game
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}

export default AddGame
