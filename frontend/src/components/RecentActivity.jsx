import { CheckCircle2, CreditCard, Truck, RotateCcw, UploadCloud, Banknote } from 'lucide-react'
import { recentActivity } from '../data/mockData'

const ICONS = {
  delivered: { icon: CheckCircle2, color: 'text-emerald-500' },
  payment: { icon: CreditCard, color: 'text-blue-500' },
  dispatched: { icon: Truck, color: 'text-amber-500' },
  returned: { icon: RotateCcw, color: 'text-orange-500' },
  batch: { icon: UploadCloud, color: 'text-indigo-500' },
  refund: { icon: Banknote, color: 'text-rose-500' },
}

export default function RecentActivity() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 flex flex-col h-full">
      <h3 className="font-semibold text-slate-800 text-sm">Recent Activity</h3>

      <ol className="mt-4 space-y-4 flex-1 overflow-y-auto scrollbar-thin pr-1">
        {recentActivity.map((item, idx) => {
          const { icon: Icon, color } = ICONS[item.type]
          return (
            <li key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <Icon className={`h-4 w-4 ${color}`} strokeWidth={2.4} />
                {idx !== recentActivity.length - 1 && <span className="w-px flex-1 bg-slate-100 mt-1.5" />}
              </div>
              <div className="pb-1">
                <p className="text-sm font-semibold text-slate-800 leading-snug">{item.title}</p>
                <p className="text-xs text-slate-400 leading-snug">{item.detail}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{item.time}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <button className="mt-2 w-full rounded-lg bg-brand-600 text-white text-sm font-semibold py-2.5 hover:bg-brand-700 transition-colors">
        View Audit Log
      </button>
    </div>
  )
}
