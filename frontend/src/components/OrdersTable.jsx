import { useMemo, useState } from 'react'
import { ChevronRight, ArrowUpDown, Search } from 'lucide-react'
import { recentOrders } from '../data/mockData'
import StatusBadge from './StatusBadge'

const TABS = ['All', 'Delivered', 'In Transit', 'Processing', 'Returned', 'Cancelled']
const COLLAPSED_COUNT = 5

const HEADERS = [
  { key: 'id', label: 'Order ID', sortable: false },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'city', label: 'City', sortable: false },
  { key: 'product', label: 'Product', sortable: false },
  { key: 'amount', label: 'Total', sortable: true },
  { key: 'courier', label: 'Courier', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'payment', label: 'Payment', sortable: false },
  { key: 'method', label: 'Method', sortable: false },
  { key: 'tracking', label: 'Tracking ID', sortable: false },
  { key: 'actions', label: '', sortable: false },
]

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function OrdersTable() {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'desc' })
  const [expanded, setExpanded] = useState(false)

  // Filter by status tab
  let rows = activeTab === 'All' ? recentOrders : recentOrders.filter((o) => o.status === activeTab)

  // Filter by search (order ID, customer name, or city)
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    rows = rows.filter(
      (o) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.city.toLowerCase().includes(q)
    )
  }

  // Sort — defaults to most recent first, since recentOrders is already recency-sorted
  const sortedRows = useMemo(() => {
    if (!sort.key) return rows
    const copy = [...rows]
    copy.sort((a, b) => {
      const va = a[sort.key]
      const vb = b[sort.key]
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return copy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort])

  const visibleRows = expanded ? sortedRows : sortedRows.slice(0, COLLAPSED_COUNT)

  function toggleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Recent Orders</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {sortedRows.length} of {recentOrders.length} orders {activeTab !== 'All' ? `· ${activeTab}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search order, customer, city"
              className="rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 w-48"
            />
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap"
          >
            {expanded ? 'Show Less' : 'View All'}
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1.5 px-5 py-3 border-b border-slate-100 overflow-x-auto scrollbar-thin">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-brand-600 text-white shadow-card'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="bg-slate-50 text-left">
              {HEADERS.map((h) => (
                <th key={h.label || 'actions'} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">
                  {h.sortable ? (
                    <button className="inline-flex items-center gap-1 hover:text-slate-600" onClick={() => toggleSort(h.key)}>
                      {h.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : (
                    h.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-sm text-slate-400">
                  No orders match your search or filter.
                </td>
              </tr>
            )}
            {visibleRows.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{o.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="font-medium text-slate-700">{o.customer}</p>
                  <p className="text-xs text-slate-400">{timeAgo(o.date)}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{o.city}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{o.product}</td>
                <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{o.total}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="rounded-md bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1">
                    {o.courier}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={o.payment} />
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{o.method}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-xs">{o.tracking}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    View <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
