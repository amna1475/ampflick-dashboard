import { useState } from 'react'
import { Download, PlusCircle } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import KpiCards from './components/KpiCards'
import StatusPieChart from './components/StatusPieChart'
import CourierPerformanceChart from './components/CourierPerformanceChart'
import RevenueLineChart from './components/RevenueLineChart'
import WeeklyOrdersChart from './components/WeeklyOrdersChart'
import Filters from './components/Filters'
import OrdersTable from './components/OrdersTable'
import PaymentOverview from './components/PaymentOverview'
import RecentActivity from './components/RecentActivity'
import QuickActions from './components/QuickActions'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 lg:px-6 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Page header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations Overview</h1>
              <p className="text-sm text-slate-400 mt-0.5">Real-time logistics and payment synchronization across all hubs.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-card">
                <PlusCircle className="h-4 w-4" />
                Add Order
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <KpiCards />

          {/* Order status analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <StatusPieChart />
            <CourierPerformanceChart />
            <RevenueLineChart />
          </div>

          {/* Filters */}
          <Filters />

          {/* Recent Orders (with quick logic: search + status filter + sort) + Recent Activity, side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
            <div className="xl:col-span-2">
              <OrdersTable />
            </div>
            <RecentActivity />
          </div>

          <WeeklyOrdersChart />

          {/* Payment overview + quick actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
            <div className="xl:col-span-2">
              <QuickActions />
            </div>
            <PaymentOverview />
          </div>

          <footer className="text-center text-xs text-slate-300 pt-4 pb-2">
            Ampflick Operations Portal — internal use only
          </footer>
        </main>
      </div>
    </div>
  )
}
