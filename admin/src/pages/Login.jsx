import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { loginAdmin } from '../api/axios'
import orengLogo from '../assets/orengelogo-.png'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await loginAdmin(form.email, form.password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('admin', JSON.stringify(data.admin))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#172554] px-4 py-8 relative overflow-hidden select-none">
      {/* Subtle ambient lighting depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(30,58,138,0.5),transparent_70%),radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(249,115,22,0.1),transparent_60%)]" />

      <div className="relative w-full max-w-[420px]">
        <form
          onSubmit={handleSubmit}
          className="bg-[#172554]/95 border border-blue-800/60 rounded-2xl p-7 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          {/* Brand Logo centered inside form */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={orengLogo}
              alt="Oreng"
              className="h-11 sm:h-12 w-auto object-contain mx-auto mb-2.5 drop-shadow-md"
            />
            <p className="text-xs text-blue-200/70">
              Sign in to your admin account to continue
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/60" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@gamotech.com"
                  required
                  className="w-full bg-white/10 border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-blue-200/50 focus:outline-none focus:bg-white/15 focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white/10 border border-white/15 rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder:text-blue-200/50 focus:outline-none focus:bg-white/15 focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/60 hover:text-white p-1 rounded-md transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:from-orange-700 active:to-amber-700 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-blue-200/50 text-xs mt-5">
          Oreng Game Systems Studio &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

export default Login
