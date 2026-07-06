import { Download, PlusCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import KpiCards from '../components/KpiCards'
import StatusPieChart from '../components/StatusPieChart'
import CourierPerformanceChart from '../components/CourierPerformanceChart'
import RevenueLineChart from '../components/RevenueLineChart'
import WeeklyOrdersChart from '../components/WeeklyOrdersChart'
import Filters from '../components/Filters'
import OrdersTable from '../components/OrdersTable'
import PaymentOverview from '../components/PaymentOverview'
import RecentActivity from '../components/RecentActivity'
import QuickActions from '../components/QuickActions'

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Operations Overview"
        subtitle="Real-time logistics and payment synchronization across all hubs."
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

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <StatusPieChart />
        <CourierPerformanceChart />
        <RevenueLineChart />
      </div>

      <Filters />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        <div className="xl:col-span-2">
          <OrdersTable />
        </div>
        <RecentActivity />
      </div>

      <WeeklyOrdersChart />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        <div className="xl:col-span-2">
          <QuickActions />
        </div>
        <PaymentOverview />
      </div>
    </>
  )
}
