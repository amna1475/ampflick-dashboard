import { Download } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import PaymentOverview from '../components/PaymentOverview'
import StatusBadge from '../components/StatusBadge'
import { useOrders } from '../context/OrdersContext'

export default function Payments() {
  const { orders } = useOrders()
  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date))
  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Reconcile payments received, pending, and refunded across all orders."
       
      />

      <PaymentOverview />

      <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Transactions</h3>
          <p className="text-xs text-slate-400 mt-0.5">{recentOrders.length} payment records</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 text-left">
                {['Order ID', 'Customer', 'Amount', 'Method', 'Payment Status', 'Order Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((o) => (
                <tr key={o._key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{o.id}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{o.customer}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{o.total}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{o.method}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={o.payment} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}