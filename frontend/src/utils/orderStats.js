// All numbers here are derived live from the actual orders list — nothing
// hardcoded. As orders are added/edited/deleted (or new ones arrive via
// polling), these recompute automatically.

const STATUS_COLORS = {
  Delivered: '#2545e8',
  Pending: '#f59e0b',
  Returned: '#fb923c',
  Cancelled: '#ef4444',
}

export function computeOrderStats(orders) {
  const totalOrders = orders.length
  const delivered = orders.filter((o) => o.status === 'Delivered').length
  const pending = orders.filter((o) => ['Processing', 'In Transit'].includes(o.status)).length
  const returned = orders.filter((o) => o.status === 'Returned').length
  const cancelled = orders.filter((o) => o.status === 'Cancelled').length

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0)
  const paymentsReceived = orders.filter((o) => o.payment === 'Paid').reduce((sum, o) => sum + (o.amount || 0), 0)
  const pendingPayments = orders.filter((o) => o.payment === 'Pending').reduce((sum, o) => sum + (o.amount || 0), 0)
  const refundedPayments = orders.filter((o) => o.payment === 'Refunded').reduce((sum, o) => sum + (o.amount || 0), 0)

  const statusDistribution = [
    { name: 'Delivered', value: delivered, color: STATUS_COLORS.Delivered },
    { name: 'Pending', value: pending, color: STATUS_COLORS.Pending },
    { name: 'Returned', value: returned, color: STATUS_COLORS.Returned },
    { name: 'Cancelled', value: cancelled, color: STATUS_COLORS.Cancelled },
  ]

  // Courier performance — % of that courier's orders which ended up Delivered.
  const courierGroups = {}
  orders.forEach((o) => {
    if (!o.courier) return
    if (!courierGroups[o.courier]) courierGroups[o.courier] = { total: 0, delivered: 0 }
    courierGroups[o.courier].total += 1
    if (o.status === 'Delivered') courierGroups[o.courier].delivered += 1
  })
  const courierPerformance = Object.entries(courierGroups).map(([courier, g]) => {
    const onTime = g.total ? Math.round((g.delivered / g.total) * 100) : 0
    return { courier, onTime, delayed: 100 - onTime }
  })

  // Monthly revenue — grouped chronologically by calendar month.
  // Monthly revenue — sirf Delivered orders, grouped by the month they
  // were actually delivered in (deliveredAt). Purane orders jinke paas
  // deliveredAt nahi hai unke liye o.date par fallback karta hai.
  const monthBuckets = {}
  orders.forEach((o) => {
    if (o.status !== 'Delivered') return // sirf actual generated revenue count ho

    const d = new Date(o.deliveredAt || o.date)
    if (Number.isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!monthBuckets[key]) monthBuckets[key] = { sortDate: new Date(d.getFullYear(), d.getMonth(), 1), revenue: 0 }
    monthBuckets[key].revenue += o.amount || 0
  })

  const monthlyRevenue = Object.values(monthBuckets)
  .sort((a, b) => a.sortDate - b.sortDate)
  .slice(-6)
  .map((b) => ({
    month: b.sortDate.toLocaleString('en-US', { month: 'short' }),
    revenue: Number((b.revenue / 1_000_000).toFixed(2)), // chart bar/line height ke liye (millions)
    revenueRaw: b.revenue, // ← NEW: tooltip mein exact amount dikhane ke liye
  }))

  // Weekly orders — count per day for the last 7 days (including today).
  const dayBuckets = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    dayBuckets.push({ dateKey: d.toDateString(), day: d.toLocaleDateString('en-US', { weekday: 'short' }), orders: 0 })
  }
  orders.forEach((o) => {
    const d = new Date(o.date)
    const key = d.toDateString()
    const bucket = dayBuckets.find((b) => b.dateKey === key)
    if (bucket) bucket.orders += 1
  })
  const weeklyOrders = dayBuckets.map(({ day, orders: count }) => ({ day, orders: count }))

  // Payment method breakdown — % share of order count per method.
  const methodColors = {
    Easypaisa: '#2545e8',
    JazzCash: '#f59e0b',
    'Bank Transfer': '#10b981',
    COD: '#a855f7',
  }
  const methodCounts = {}
  orders.forEach((o) => {
    if (!o.method) return
    methodCounts[o.method] = (methodCounts[o.method] || 0) + 1
  })
  const paymentMethodBreakdown = Object.entries(methodCounts).map(([name, count]) => ({
    name,
    value: totalOrders ? Math.round((count / totalOrders) * 100) : 0,
    color: methodColors[name] || '#94a3b8',
  }))

  return {
    totalOrders,
    delivered,
    pending,
    returned,
    cancelled,
    totalRevenue,
    paymentsReceived,
    pendingPayments,
    refundedPayments,
    statusDistribution,
    courierPerformance,
    monthlyRevenue,
    weeklyOrders,
    paymentMethodBreakdown,
  }
}
