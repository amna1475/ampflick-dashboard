import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { weeklyOrders } from '../data/mockData'

export default function WeeklyOrdersChart() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5">
      <h3 className="font-semibold text-slate-800 text-sm">Weekly Orders</h3>
      <p className="text-xs text-slate-400 mt-0.5">Orders placed per day, this week</p>
      <div className="h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyOrders} barSize={26}>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              formatter={(value) => [value, 'Orders']}
              contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
            />
            <Bar dataKey="orders" fill="#598af9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
