import {
  BarChart3,
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  Gamepad2,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  Wallet,
  Webhook,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navSections = [
  {
    items: [{ label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' }],
  },
  {
    title: 'Management',
    items: [
      { label: 'Operators', icon: Building2, to: '/operators' },
      { label: 'Games', icon: Gamepad2, to: '/games' },
      { label: 'Players', icon: Users, to: '/players' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Transactions', icon: CreditCard, to: '/transactions' },
      { label: 'Wallet', icon: Wallet, to: '/wallet' },
      { label: 'Revenue', icon: BarChart3, to: '/revenue' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Analytics', icon: BarChart3, to: '/analytics' },
      { label: 'API Logs', icon: Webhook, to: '/api-logs' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Admin Users', icon: Shield, to: '/admin-users' },
      { label: 'Platform Settings', icon: Settings, to: '/platform-settings' },
    ],
  },
]

function Sidebar({ onNavigate }) {
  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-tight">Game Provider</p>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-4">
            {section.title && (
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-3 mb-2">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 m-3 rounded-xl bg-indigo-50 border border-indigo-100">
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-900">Need Help?</p>
            <p className="text-xs text-slate-500 mt-1">Check our documentation</p>
            <button className="flex items-center gap-1 text-xs text-indigo-600 mt-2 hover:text-indigo-700 font-medium">
              View Docs <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
