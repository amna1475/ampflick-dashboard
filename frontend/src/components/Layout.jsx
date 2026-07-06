import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 lg:px-6 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
          <Outlet />

          <footer className="text-center text-xs text-slate-300 pt-4 pb-2">
            Ampflick Operations Portal — internal use only
          </footer>
        </main>
      </div>
    </div>
  )
}
