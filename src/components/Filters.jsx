import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { cityOptions, courierOptions, statusOptions, paymentStatusOptions } from '../data/mockData'

function Select({ label, options }) {
  return (
    <select
      aria-label={label}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
      defaultValue={options[0]}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

export default function Filters() {
  const [name, setName] = useState('')

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 flex flex-wrap items-center gap-2.5">
      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold pr-1.5">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
      </div>

      <input
        type="date"
        aria-label="Start date"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
      />
      <span className="text-slate-300 text-xs">to</span>
      <input
        type="date"
        aria-label="End date"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
      />

      <Select label="Order status" options={statusOptions} />
      <Select label="Courier company" options={courierOptions} />
      <Select label="Payment status" options={paymentStatusOptions} />
      <Select label="City" options={cityOptions} />

      <div className="relative ml-auto">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Customer name"
          className="rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 w-40"
        />
      </div>
    </div>
  )
}
