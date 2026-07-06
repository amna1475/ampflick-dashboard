import { Download, PlusCircle, Package, Truck, Clock, RotateCcw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Filters from '../components/Filters'
import OrdersTable from '../components/OrdersTable'
import { recentOrders } from '../data/mockData'

const SUMMARY = [
  { label: 'Total Orders', value: recentOrders.length, icon: Package, tone: 'bg-brand-50 text-brand-600' },
  { label: 'Delivered', value: recentOrders.filter((o) => o.status === 'Delivered').length, icon: Truck, tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'In Progress', value: recentOrders.filter((o) => ['In Transit', 'Processing'].includes(o.status)).length, icon: Clock, tone: 'bg-amber-50 text-amber-600' },
  { label: 'Returned/Cancelled', value: recentOrders.filter((o) => ['Returned', 'Cancelled'].includes(o.status)).length, icon: RotateCcw, tone: 'bg-orange-50 text-orange-600' },
]

export default function Orders() {
  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Track, filter, and manage every order across all hubs."
        actions={
          <>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-card">
              <PlusCircle className="h-4 w-4" />
              Add Order
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-slate-100 shadow-card p-4 lg:p-5 flex items-center gap-3.5">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${s.tone}`}>
              <s.icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Filters />

      <OrdersTable />
    </>
  )
}
