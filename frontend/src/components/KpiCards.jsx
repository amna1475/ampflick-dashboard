import {
  Package,
  Truck,
  Clock,
  RotateCcw,
  XCircle,
  Wallet,
  CreditCard,
  AlertTriangle,
} from 'lucide-react'
import { useOrders } from '../context/OrdersContext'

const TONE_STYLES = {
  brand: 'bg-brand-50 text-brand-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  teal: 'bg-teal-50 text-teal-600',
  rose: 'bg-rose-50 text-rose-600',
}

function formatMoney(amount) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`
  return String(amount)
}

export default function KpiCards() {
  const { stats } = useOrders()

  const cards = [
    { id: 'total', label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: Package, tone: 'brand' },
    { id: 'delivered', label: 'Delivered', value: stats.delivered.toLocaleString(), icon: Truck, tone: 'green' },
    { id: 'pending', label: 'Pending', value: stats.pending.toLocaleString(), icon: Clock, tone: 'amber' },
    { id: 'returned', label: 'Returned', value: stats.returned.toLocaleString(), icon: RotateCcw, tone: 'orange' },
    { id: 'cancelled', label: 'Cancelled', value: stats.cancelled.toLocaleString(), icon: XCircle, tone: 'red' },
    { id: 'revenue', label: 'Total Revenue (PKR)', value: formatMoney(stats.totalRevenue), icon: Wallet, tone: 'indigo' },
    { id: 'received', label: 'Payments Received', value: formatMoney(stats.paymentsReceived), icon: CreditCard, tone: 'teal' },
    { id: 'pendingPay', label: 'Pending Payments', value: formatMoney(stats.pendingPayments), icon: AlertTriangle, tone: 'rose' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 lg:p-5 hover:shadow-popover transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${TONE_STYLES[card.tone]}`}>
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="mt-3.5 text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}
