import { Search, Bell, Menu, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Topbar({ onMenuClick }) {
  const { currentUser } = useAuth()

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 backdrop-blur px-4 lg:px-6">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button className="lg:hidden text-slate-500" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tracking ID, order, or customer..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-xs text-slate-400">{currentUser.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}