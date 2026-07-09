import { Search, Bell, Menu, Settings } from 'lucide-react'

export default function Topbar({ onMenuClick }) {
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

      <div className="flex items-center gap-1 sm:gap-4">
        {/* <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50">
          <Settings className="h-[18px] w-[18px]" />
        </button>
        <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button> */}
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <img
            src="https://i.pravatar.cc/64?img=12"
            alt="Asjad Haroon"
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">Alex Thompson</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
