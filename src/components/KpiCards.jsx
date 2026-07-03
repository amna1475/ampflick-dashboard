import {
  Package,
  Truck,
  Clock,
  RotateCcw,
  XCircle,
  Wallet,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { kpiCards } from '../data/mockData'

const ICONS = { Package, Truck, Clock, RotateCcw, XCircle, Wallet, CreditCard, AlertTriangle }

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

const TREND_STYLES = {
  up: 'text-emerald-600 bg-emerald-50',
  down: 'text-red-600 bg-red-50',
  flat: 'text-amber-600 bg-amber-50',
}

export default function KpiCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((card) => {
        const Icon = ICONS[card.icon]
        return (
          <div
            key={card.id}
            className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 lg:p-5 hover:shadow-popover transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${TONE_STYLES[card.tone]}`}>
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <span
                className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${TREND_STYLES[card.trend]}`}
              >
                {card.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                {card.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                {card.delta}
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
