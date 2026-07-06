import { Download } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusPieChart from '../components/StatusPieChart'
import CourierPerformanceChart from '../components/CourierPerformanceChart'
import RevenueLineChart from '../components/RevenueLineChart'
import WeeklyOrdersChart from '../components/WeeklyOrdersChart'
import PaymentOverview from '../components/PaymentOverview'

export default function Reports() {
  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Analytics across orders, deliveries, couriers, and revenue."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-card">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <StatusPieChart />
        <CourierPerformanceChart />
        <RevenueLineChart />
      </div>

      <WeeklyOrdersChart />

      <PaymentOverview />
    </>
  )
}
