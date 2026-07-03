import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Truck,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Orders', icon: ShoppingCart },
  { label: 'Payments', icon: Wallet },
  { label: 'Customers', icon: Users },
  { label: 'Reports', icon: BarChart3 },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-card">
              <Truck className="h-5 w-5 text-white" strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-900 text-[15px]">Ampflick</p>
              <p className="text-[11px] tracking-wide text-slate-400 font-medium">LOGISTICS OPS</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600 text-white shadow-card'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {label}
            </a>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings className="h-[18px] w-[18px]" strokeWidth={2} />
            Settings
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <HelpCircle className="h-[18px] w-[18px]" strokeWidth={2} />
            Help
          </a>
        </div>
      </aside>
    </>
  )
}
