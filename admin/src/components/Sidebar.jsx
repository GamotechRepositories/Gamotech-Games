import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BadgeDollarSign,
  BarChart3,
  Building2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  Gamepad2,
  Layers,
  LayoutDashboard,
  Plug,
  Radio,
  Settings,
  Shield,
  SlidersHorizontal,
  Users,
  Wallet,
  Webhook,
} from 'lucide-react'

const navItems = [
  {
    type: 'single',
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
  },
  {
    type: 'accordion',
    id: 'management',
    label: 'Management',
    icon: Layers,
    children: [
      { label: 'Operators', icon: Building2, to: '/operators' },
      { label: 'Operator Adapters', icon: Plug, to: '/operator-adapters' },
      { label: 'Games', icon: Gamepad2, to: '/games' },
      { label: 'Sessions', icon: Radio, to: '/sessions' },
      { label: 'Session Stats', icon: BarChart3, to: '/sessions/stats' },
      { label: 'Round Events', icon: FileText, to: '/sessions/round-events' },
      { label: 'Players', icon: Users, to: '/players' },
    ],
  },
  {
    type: 'accordion',
    id: 'finance',
    label: 'Finance',
    icon: BadgeDollarSign,
    children: [
      { label: 'Transactions', icon: CreditCard, to: '/transactions' },
      { label: 'Wallet', icon: Wallet, to: '/wallet' },
      { label: 'Revenue', icon: BarChart3, to: '/revenue' },
    ],
  },
  {
    type: 'accordion',
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    children: [
      { label: 'Analytics', icon: BarChart3, to: '/analytics' },
      { label: 'API Logs', icon: Webhook, to: '/api-logs' },
    ],
  },
  {
    type: 'accordion',
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { label: 'Admin Users', icon: Shield, to: '/admin-users' },
      { label: 'Platform Settings', icon: SlidersHorizontal, to: '/platform-settings' },
    ],
  },
]

function isChildActive(childTo, currentPath) {
  if (childTo === '/dashboard') {
    return currentPath === '/dashboard'
  }
  if (childTo === '/sessions') {
    return (
      currentPath === '/sessions' ||
      (currentPath.startsWith('/sessions/') &&
        !currentPath.startsWith('/sessions/stats') &&
        !currentPath.startsWith('/sessions/round-events'))
    )
  }
  return currentPath === childTo || currentPath.startsWith(`${childTo}/`)
}

function isParentActive(group, currentPath) {
  return group.children?.some((child) => isChildActive(child.to, currentPath))
}

function Sidebar({ onNavigate }) {
  const location = useLocation()

  const [openSections, setOpenSections] = useState(() => {
    const initial = { management: true }
    navItems.forEach((item) => {
      if (item.type === 'accordion') {
        if (isParentActive(item, location.pathname)) {
          initial[item.id] = true
        }
      }
    })
    return initial
  })

  // Auto-expand accordion section when user navigates to any of its children
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.type === 'accordion' && isParentActive(item, location.pathname)) {
        setOpenSections((prev) => ({
          ...prev,
          [item.id]: true,
        }))
      }
    })
  }, [location.pathname])

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm select-none">
     
      {/* Navigation list */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          if (item.type === 'single') {
            const active = location.pathname === item.to
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            )
          }

          const isOpen = Boolean(openSections[item.id])
          const hasActive = isParentActive(item, location.pathname)

          return (
            <div key={item.id} className="mb-1">
              {/* Accordion Parent Header */}
              <button
                type="button"
                onClick={() => toggleSection(item.id)}
                aria-expanded={isOpen}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  hasActive
                    ? 'bg-indigo-50/70 text-indigo-950 font-semibold border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      hasActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {hasActive && !isOpen && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"
                      title="Active page inside"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-1.5 py-0.5 text-[8px] font-semibold rounded-md transition-colors ${
                      hasActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'
                    }`}
                  >
                    {item.children.length}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ease-in-out ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Children */}
              <div className={`accordion-wrapper ${isOpen ? 'open' : 'closed'}`}>
                <div className="accordion-inner">
                  <div className="ml-4 pl-3.5 my-1 space-y-0.5 border-l-2 border-slate-100">
                    {item.children.map((child) => {
                      const active = isChildActive(child.to, location.pathname)
                      return (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={onNavigate}
                          className={`group/child flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                            active
                              ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/80 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <child.icon
                            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              active
                                ? 'text-indigo-600'
                                : 'text-slate-400 group-hover/child:text-slate-600'
                            }`}
                          />
                          <span className="truncate">{child.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* Need Help Footer */}
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
