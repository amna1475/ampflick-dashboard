import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useOrders } from '../context/OrdersContext'

function formatMoney(amount) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`
  return String(amount)
}

export default function PaymentOverview() {
  const { stats } = useOrders()
  const { paymentsReceived, pendingPayments, refundedPayments, paymentMethodBreakdown } = stats

  const summary = [
    { label: 'Total Received', value: `Rs ${formatMoney(paymentsReceived)}`, tone: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pending Payments', value: `Rs ${formatMoney(pendingPayments)}`, tone: 'text-amber-600 bg-amber-50' },
    { label: 'Refunded', value: `Rs ${formatMoney(refundedPayments)}`, tone: 'text-rose-600 bg-rose-50' },
  ]

  const hasMethods = paymentMethodBreakdown.length > 0

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5">
      <h3 className="font-semibold text-slate-800 text-sm">Payment Overview</h3>
      <p className="text-xs text-slate-400 mt-0.5">Reconciliation across all payment channels</p>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {summary.map((s) => (
          <div key={s.label} className={`rounded-xl p-3 ${s.tone}`}>
            <p className="text-[11px] font-semibold opacity-80">{s.label}</p>
            <p className="text-lg font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {hasMethods ? (
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-5">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodBreakdown} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="90%" paddingAngle={2}>
                  {paymentMethodBreakdown.map((m) => (
                    <Cell key={m.name} fill={m.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 w-full space-y-2.5">
            {paymentMethodBreakdown.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  {m.name}
                </span>
                <span className="font-semibold text-slate-800">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-400 text-center">No payment data yet.</p>
      )}
    </div>
  )
}
