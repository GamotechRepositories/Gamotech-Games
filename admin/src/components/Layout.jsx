import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header — takes full width at the top */}
      <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />

      {/* Body area under the header */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — docked below Header on desktop, slide-out drawer on mobile */}
        <div
          className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-64 h-[calc(100vh-4rem)] lg:h-full transform transition-transform duration-200 ease-in-out lg:translate-x-0 shrink-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main content area */}
        <main className="flex-1 min-w-0 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
