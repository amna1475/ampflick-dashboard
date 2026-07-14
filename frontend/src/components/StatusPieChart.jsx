import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useOrders } from '../context/OrdersContext'

export default function StatusPieChart() {
  const { stats } = useOrders()
  const { statusDistribution, totalOrders, delivered } = stats

  const successRate = totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0
  const hasData = totalOrders > 0

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 h-full flex flex-col">
      <h3 className="font-semibold text-slate-800 text-sm">Order Status Distribution</h3>
      <div className="relative flex-1 min-h-[200px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius="68%"
                outerRadius="90%"
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
              >
                {statusDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value.toLocaleString()} orders`, name]}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">No orders yet</div>
        )}
        {hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900">{successRate}%</span>
            <span className="text-xs text-slate-400 font-medium">Success</span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1.5">
        {statusDistribution.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-500">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
            <span className="font-semibold text-slate-700">{d.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
