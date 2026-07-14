import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Truck, RotateCcw, XCircle, PackagePlus } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'

const STATUS_ICON = {
  Delivered: { icon: CheckCircle2, color: 'text-emerald-500' },
  'In Transit': { icon: Truck, color: 'text-blue-500' },
  Processing: { icon: PackagePlus, color: 'text-amber-500' },
  Returned: { icon: RotateCcw, color: 'text-orange-500' },
  Cancelled: { icon: XCircle, color: 'text-red-500' },
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

const MAX_ITEMS = 6

export default function RecentActivity() {
  const { orders } = useOrders()
  const navigate = useNavigate()

  const recent = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, MAX_ITEMS)

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 flex flex-col h-full">
      <h3 className="font-semibold text-slate-800 text-sm">Recent Activity</h3>

      {recent.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400 flex-1">No orders yet.</p>
      ) : (
        <ol className="mt-4 space-y-4 flex-1 overflow-y-auto scrollbar-thin pr-1">
          {recent.map((o, idx) => {
            const { icon: Icon, color } = STATUS_ICON[o.status] || STATUS_ICON.Processing
            return (
              <li key={o._key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <Icon className={`h-4 w-4 ${color}`} strokeWidth={2.4} />
                  {idx !== recent.length - 1 && <span className="w-px flex-1 bg-slate-100 mt-1.5" />}
                </div>
                <div className="pb-1">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    Order {o.id} — {o.status}
                  </p>
                  <p className="text-xs text-slate-400 leading-snug">
                    {o.customer}, {o.city || 'Unknown city'}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{timeAgo(o.date)}</p>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <button
        onClick={() => navigate('/orders')}
        className="mt-2 w-full rounded-lg bg-brand-600 text-white text-sm font-semibold py-2.5 hover:bg-brand-700 transition-colors"
      >
        View All Orders
      </button>
    </div>
  )
}
