import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import {
  ChevronRight,
  ArrowUpDown,
  Search,
  Pencil,
  Trash2,
  Upload,
  Download,
  PlusCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { useOrders } from '../context/OrdersContext'
import { useToast } from '../context/ToastContext'
import { exportOrdersToCsv } from '../utils/exportCsv'
import StatusBadge from './StatusBadge'
import OrderFormModal from './OrderFormModal'

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
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function OrdersTable() {
  const {
    orders,
    loading,
    error,
    refresh,
    addOrder,
    updateOrder,
    deleteOrder,
    importOrders,
    addModalOpen,
    openAddOrder,
    closeAddOrder,
    filters,
  } = useOrders()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'desc' })
  const [expanded, setExpanded] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [importing, setImporting] = useState(false)

  // Demo (mock) orders keep their original order; real DB orders are sorted newest-first within their own section.
  const mockSection = orders.filter((o) => o.source === 'mock')
  const dbSection = [...orders.filter((o) => o.source === 'db')].sort((a, b) => new Date(b.date) - new Date(a.date))
  const allOrders = [...mockSection, ...dbSection]

  let rows = activeTab === 'All' ? allOrders : allOrders.filter((o) => o.status === activeTab)

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    rows = rows.filter(
      (o) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.city.toLowerCase().includes(q)
    )
  }

  // Shared Filters bar (status/courier/payment/city/customer name) applies on top
  if (filters.status !== 'All Status') {
    rows = rows.filter((o) => o.status === filters.status)
  }
  if (filters.courier !== 'All Couriers') {
    rows = rows.filter((o) => o.courier === filters.courier)
  }
  if (filters.payment !== 'All Payments') {
    rows = rows.filter((o) => o.payment === filters.payment)
  }
  if (filters.city !== 'All Cities') {
    rows = rows.filter((o) => o.city === filters.city)
  }
  if (filters.customerName.trim()) {
    const q = filters.customerName.trim().toLowerCase()
    rows = rows.filter((o) => o.customer.toLowerCase().includes(q))
  }

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

  async function handleDelete(order) {
    const note = order.source === 'mock' ? ' (this is demo data — it will reappear on refresh)' : ''
    if (!window.confirm(`Delete order ${order.id} for ${order.customer}?${note}`)) return
    try {
      await deleteOrder(order._key)
      showToast('Order deleted successfully.')
    } catch (err) {
      showToast(err.message || 'Failed to delete order.', 'error')
    }
  }

  function handleExportCsv() {
    const exported = exportOrdersToCsv(allOrders)
    if (!exported) {
      showToast('There are no orders to export yet.', 'error')
      return
    }
    showToast('Orders exported successfully.')
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const count = await importOrders(results.data)
          showToast(`Imported ${count} order${count === 1 ? '' : 's'} from ${file.name} into the database.`)
        } catch (err) {
          showToast(err.message || 'Failed to import CSV file.', 'error')
        } finally {
          setImporting(false)
        }
      },
      error: (err) => {
        setImporting(false)
        showToast(err.message || 'Failed to read CSV file.', 'error')
      },
    })
    e.target.value = ''
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Recent Orders</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {sortedRows.length} of {allOrders.length} orders {activeTab !== 'All' ? `· ${activeTab}` : ''}
            {' · '}
            {mockSection.length} demo, {dbSection.length} from database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search order, customer, city"
              className="rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 w-44"
            />
          </div>

          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          <button
            onClick={handleImportClick}
            disabled={importing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {importing ? 'Importing...' : 'Import CSV'}
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            onClick={openAddOrder}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 shadow-card"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add Order
          </button>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap ml-1"
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

      {/* Non-blocking status line for the live DB fetch — demo data above is never hidden by this */}
      {loading && (
        <div className="flex items-center gap-2 px-5 py-2 bg-slate-50 text-slate-500 text-xs font-medium border-b border-slate-100">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Fetching live orders from the database...
        </div>
      )}
      {!loading && error && (
        <div className="flex items-center gap-2 px-5 py-2 bg-amber-50 text-amber-700 text-xs font-medium border-b border-amber-100">
          <AlertTriangle className="h-3.5 w-3.5" />
          {error}
          <button onClick={refresh} className="font-semibold underline hover:no-underline">
            Try Again
          </button>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm min-w-[1020px]">
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
              <tr key={o._key} className="hover:bg-slate-50/70 transition-colors cursor-pointer" onClick={() => navigate(`/orders/${o._key}`)}>
                <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {o.id}
                    {o.source === 'mock' && (
                      <span className="rounded-full bg-slate-100 text-slate-400 text-[10px] font-semibold px-1.5 py-0.5">
                        Demo
                      </span>
                    )}
                  </div>
                </td>
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
                <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setEditingOrder(o)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                      title="Edit order"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(o)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                      title="Delete order"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/orders/${o._key}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600"
                      title="View order"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderFormModal
        open={addModalOpen}
        onClose={closeAddOrder}
        onSubmit={async (values) => {
          await addOrder(values)
          showToast('Order added to the database successfully.')
        }}
        title="Add New Order"
      />

      <OrderFormModal
        open={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSubmit={async (values) => {
          await updateOrder(editingOrder._key, values)
          showToast(
            editingOrder.source === 'mock'
              ? 'Demo order updated locally (not saved to the database).'
              : 'Order updated successfully.'
          )
        }}
        initialValues={editingOrder}
        title="Edit Order"
      />
    </div>
  )
}