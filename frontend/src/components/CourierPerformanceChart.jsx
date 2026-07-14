import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { useOrders } from '../context/OrdersContext'

export default function CourierPerformanceChart() {
  const { stats } = useOrders()
  const { courierPerformance } = stats
  const hasData = courierPerformance.length > 0
  const best = hasData ? [...courierPerformance].sort((a, b) => b.onTime - a.onTime)[0] : null

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 h-full flex flex-col">
      <h3 className="font-semibold text-slate-800 text-sm">Courier Performance</h3>
      <p className="text-xs text-slate-400 mt-0.5">% of each courier's orders delivered successfully</p>
      <div className="flex-1 min-h-[180px] mt-2">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courierPerformance} barSize={28}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="courier" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                formatter={(value) => [`${value}%`, 'Delivered']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="onTime" fill="#2545e8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">No orders yet</div>
        )}
      </div>
      {best && (
        <p className="text-xs text-slate-400 text-center mt-2 border-t border-slate-100 pt-3">
          <span className="font-semibold text-slate-600">{best.courier}</span> leading with a {best.onTime}% delivery rate.
        </p>
      )}
    </div>
  )
}
