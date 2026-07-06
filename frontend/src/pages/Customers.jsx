import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { customers } from '../data/mockData'

function timeAgo(dateStr) {
  const days = Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

export default function Customers() {
  const [search, setSearch] = useState('')

  const rows = search.trim()
    ? customers.filter(
        (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
      )
    : customers

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Everyone who has placed an order, ranked by lifetime spend."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 lg:p-5 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Customers</p>
            <p className="text-xl font-bold text-slate-900">{customers.length}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 lg:p-5">
          <p className="text-xs text-slate-400">Avg. Orders / Customer</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {(customers.reduce((s, c) => s + c.orderCount, 0) / customers.length).toFixed(1)}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 lg:p-5">
          <p className="text-xs text-slate-400">Top Customer Spend</p>
          <p className="text-xl font-bold text-slate-900 mt-1">Rs {customers[0]?.totalSpent.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">All Customers</h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search name or city"
              className="rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 w-48"
            />
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 text-left">
                {['Customer', 'City', 'Orders', 'Total Spent', 'Last Order'].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                    No customers match your search.
                  </td>
                </tr>
              )}
              {rows.map((c) => (
                <tr key={c.email} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-medium text-slate-700">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.city}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.orderCount}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">Rs {c.totalSpent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{timeAgo(c.lastOrderDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
