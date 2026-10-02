import { Bell, Calendar, LogOut, Menu, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import orengLogo from '../assets/orengelogo-.png'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/operators': 'Operators',
  '/operators/add': 'Add Operator',
  '/operator-adapters': 'Operator Adapters',
  '/operator-adapters/add': 'Add Operator Adapter',
  '/games': 'Games',
  '/games/add': 'Add Game',
  '/sessions': 'Sessions',
  '/sessions/stats': 'Session Stats',
  '/sessions/round-events': 'Round Events',
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
      : pathname.startsWith('/sessions/')
        ? 'Session Details'
        : pathname.startsWith('/games/') && pathname !== '/games/add'
          ? 'Game Details'
          : 'Dashboard')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-blue-900/50 bg-[#172554] flex items-center justify-between px-6 shrink-0 shadow-sm text-white relative z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <img
            src={orengLogo}
            alt="Oreng"
            className="h-10 sm:h-11 md:h-12 w-auto object-contain"
          />
        </div>

        {/* <div className="hidden md:block h-6 w-px bg-blue-800/80 mx-1" /> */}
        {/* <h1 className="text-lg font-semibold text-white tracking-tight">{title}</h1> */}
      </div>

      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#172554]" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-200 bg-white/10 border border-white/15 rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4 text-slate-300" />
          <span>
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-white/15">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-medium text-white shadow-xs">
            {admin.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-tight">
              {admin.name || 'Admin'}
            </p>
            <p className="text-xs text-slate-300">Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-300 hover:text-red-300 hover:bg-white/10 transition-colors"
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
