import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cityOptions, courierOptions, statusOptions, paymentStatusOptions } from '../data/mockData'
import { useOrders } from '../context/OrdersContext'

function Select({ label, options, value, onChange }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

const DEFAULTS = {
  status: 'All Status',
  courier: 'All Couriers',
  payment: 'All Payments',
  city: 'All Cities',
  customerName: '',
}

export default function Filters() {
  const { filters, setFilter, resetFilters } = useOrders()

  const isActive =
    filters.status !== DEFAULTS.status ||
    filters.courier !== DEFAULTS.courier ||
    filters.payment !== DEFAULTS.payment ||
    filters.city !== DEFAULTS.city ||
    filters.customerName.trim() !== ''

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 flex flex-wrap items-center gap-2.5">
      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold pr-1.5">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
      </div>

      <Select label="Order status" options={statusOptions} value={filters.status} onChange={(v) => setFilter('status', v)} />
      <Select label="Courier company" options={courierOptions} value={filters.courier} onChange={(v) => setFilter('courier', v)} />
      <Select label="Payment status" options={paymentStatusOptions} value={filters.payment} onChange={(v) => setFilter('payment', v)} />
      <Select label="City" options={cityOptions} value={filters.city} onChange={(v) => setFilter('city', v)} />

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          value={filters.customerName}
          onChange={(e) => setFilter('customerName', e.target.value)}
          type="text"
          placeholder="Customer name"
          className="rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 w-40"
        />
      </div>

      {isActive && (
        <button
          onClick={resetFilters}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600"
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  )
}