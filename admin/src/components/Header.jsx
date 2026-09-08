import { Bell, Calendar, LogOut, Menu, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/operators': 'Operators',
  '/operators/add': 'Add Operator',
  '/operator-adapters': 'Operator Adapters',
  '/operator-adapters/add': 'Add Operator Adapter',
  '/games': 'Games',
  '/games/add': 'Add Game',
  '/players': 'Players',
  '/transactions': 'Transactions',
  '/wallet': 'Wallet',
  '/revenue': 'Revenue',
  '/analytics': 'Analytics',
  '/api-logs': 'API Logs',
  '/admin-users': 'Admin Users',
  '/platform-settings': 'Platform Settings',
}

function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const admin = JSON.parse(localStorage.getItem('admin') || '{}')
  const title =
    pageTitles[pathname] ||
    (pathname.endsWith('/edit')
      ? pathname.startsWith('/operator-adapters')
        ? 'Edit Operator Adapter'
        : pathname.startsWith('/operators')
          ? 'Edit Operator'
          : 'Edit Game'
      : pathname.startsWith('/games/') && pathname !== '/games/add'
        ? 'Game Details'
        : 'Dashboard')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            /
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium text-white">
            {admin.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {admin.name || 'Admin'}
            </p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
