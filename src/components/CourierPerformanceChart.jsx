import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { courierPerformance } from '../data/mockData'

const best = [...courierPerformance].sort((a, b) => b.onTime - a.onTime)[0]

export default function CourierPerformanceChart() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 h-full flex flex-col">
      <h3 className="font-semibold text-slate-800 text-sm">Courier Performance</h3>
      <p className="text-xs text-slate-400 mt-0.5">On-time delivery rate by courier</p>
      <div className="flex-1 min-h-[180px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={courierPerformance} barSize={28}>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="courier" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              formatter={(value) => [`${value}%`, 'On-time']}
              contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
            />
            <Bar dataKey="onTime" fill="#2545e8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2 border-t border-slate-100 pt-3">
        <span className="font-semibold text-slate-600">{best.courier}</span> maintaining {best.onTime}% on-time delivery rate.
      </p>
    </div>
  )
}
