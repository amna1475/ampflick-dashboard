import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { useOrders } from '../context/OrdersContext'

export default function RevenueLineChart() {
  const { stats } = useOrders()
  const { monthlyRevenue } = stats
  const hasEnoughData = monthlyRevenue.length >= 2

  const growth = hasEnoughData
    ? (
        ((monthlyRevenue.at(-1).revenue - monthlyRevenue.at(-2).revenue) / (monthlyRevenue.at(-2).revenue || 1)) *
        100
      ).toFixed(0)
    : null

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-sm">Monthly Revenue</h3>
        {growth !== null && (
          <span className={`text-xs font-semibold ${growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {growth >= 0 ? '↗' : '↘'} {Math.abs(growth)}% vs last month
          </span>
        )}
      </div>
      <div className="flex-1 min-h-[200px] mt-2">
        {monthlyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ left: -20, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2545e8" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2545e8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Tooltip
                formatter={(value, name, props) => [`Rs ${props.payload.revenueRaw.toLocaleString('en-PK')}`, 'Revenue']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2545e8"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                dot={{ r: 3, fill: '#2545e8', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">No orders yet</div>
        )}
      </div>
    </div>
  )
}