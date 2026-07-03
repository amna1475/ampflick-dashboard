import { PlusCircle, RefreshCcw, CreditCard, Download, LineChart } from 'lucide-react'

const ACTIONS = [
  { label: 'Add New Order', icon: PlusCircle, primary: true },
  { label: 'Update Order Status', icon: RefreshCcw },
  { label: 'Update Payment', icon: CreditCard },
  { label: 'Export Report', icon: Download },
  { label: 'View Analytics', icon: LineChart },
]

export default function QuickActions() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 flex flex-wrap gap-2.5">
      {ACTIONS.map(({ label, icon: Icon, primary }) => (
        <button
          key={label}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
            primary
              ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-card'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
          {label}
        </button>
      ))}
    </div>
  )
}
