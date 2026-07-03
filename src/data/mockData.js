// Centralized mock data. Swap these with real API calls / fetch hooks later.

export const kpiCards = [
  { id: 'total', label: 'Total Orders', value: '12,840', delta: '+12.5%', trend: 'up', icon: 'Package', tone: 'brand' },
  { id: 'delivered', label: 'Delivered', value: '10,502', delta: '+8.2%', trend: 'up', icon: 'Truck', tone: 'green' },
  { id: 'pending', label: 'Pending', value: '1,940', delta: '21 pending', trend: 'flat', icon: 'Clock', tone: 'amber' },
  { id: 'returned', label: 'Returned', value: '328', delta: '-2.1%', trend: 'down', icon: 'RotateCcw', tone: 'orange' },
  { id: 'cancelled', label: 'Cancelled', value: '70', delta: '-0.4%', trend: 'down', icon: 'XCircle', tone: 'red' },
  { id: 'revenue', label: 'Total Revenue (PKR)', value: '4.2M', delta: '+24%', trend: 'up', icon: 'Wallet', tone: 'indigo' },
  { id: 'received', label: 'Payments Received', value: '3.8M', delta: '+15.6%', trend: 'up', icon: 'CreditCard', tone: 'teal' },
  { id: 'pendingPay', label: 'Pending Payments', value: '402K', delta: 'Needs action', trend: 'flat', icon: 'AlertTriangle', tone: 'rose' },
]

export const statusDistribution = [
  { name: 'Delivered', value: 10502, color: '#2545e8' },
  { name: 'Pending', value: 1940, color: '#f59e0b' },
  { name: 'Returned', value: 328, color: '#fb923c' },
  { name: 'Cancelled', value: 70, color: '#ef4444' },
]

export const weeklyOrders = [
  { day: 'Mon', orders: 420 },
  { day: 'Tue', orders: 512 },
  { day: 'Wed', orders: 478 },
  { day: 'Thu', orders: 610 },
  { day: 'Fri', orders: 705 },
  { day: 'Sat', orders: 540 },
  { day: 'Sun', orders: 388 },
]

export const monthlyRevenue = [
  { month: 'Jul', revenue: 2.1 },
  { month: 'Aug', revenue: 2.6 },
  { month: 'Sep', revenue: 2.3 },
  { month: 'Oct', revenue: 3.4 },
  { month: 'Nov', revenue: 3.1 },
  { month: 'Dec', revenue: 4.2 },
]

export const courierPerformance = [
  { courier: 'TCS', onTime: 98, delayed: 2 },
  { courier: 'Leopard', onTime: 91, delayed: 9 },
  { courier: 'M&P', onTime: 86, delayed: 14 },
  { courier: 'Trax', onTime: 79, delayed: 21 },
]

export const paymentMethods = [
  { name: 'Easypaisa', value: 38, color: '#2545e8' },
  { name: 'JazzCash', value: 27, color: '#f59e0b' },
  { name: 'Bank Transfer', value: 20, color: '#10b981' },
  { name: 'Cash on Delivery', value: 15, color: '#a855f7' },
]

export const paymentOverview = {
  received: '3.8M',
  pending: '402K',
  refunded: '86K',
}

export const orders = [
  {
    id: '#10248',
    customer: 'Zainab Malik',
    email: 'z.malik@email.com',
    city: 'Lahore',
    product: 'Wireless Earbuds',
    total: 'Rs 4,500',
    amount: 4500,
    courier: 'TCS',
    status: 'Delivered',
    payment: 'Paid',
    method: 'Easypaisa',
    tracking: 'TCS-88213',
    date: '2026-07-03T09:58:00',
  },
  {
    id: '#10249',
    customer: 'Hamza Ahmed',
    email: 'hamza.a@outlook.com',
    city: 'Karachi',
    product: 'Leather Wallet',
    total: 'Rs 2,100',
    amount: 2100,
    courier: 'Leopard',
    status: 'In Transit',
    payment: 'Pending',
    method: 'COD',
    tracking: 'LPR-55931',
    date: '2026-07-03T09:15:00',
  },
  {
    id: '#10250',
    customer: 'Saira Khan',
    email: 'saira.k@gmail.com',
    city: 'Islamabad',
    product: 'Skincare Bundle',
    total: 'Rs 6,900',
    amount: 6900,
    courier: 'M&P',
    status: 'Processing',
    payment: 'Paid',
    method: 'JazzCash',
    tracking: 'MNP-10294',
    date: '2026-07-03T07:40:00',
  },
  {
    id: '#10251',
    customer: 'Usman Ali',
    email: 'usman.ali@work.pk',
    city: 'Faisalabad',
    product: 'Running Shoes (Size Mismatch)',
    total: 'Rs 5,200',
    amount: 5200,
    courier: 'TCS',
    status: 'Returned',
    payment: 'Refunded',
    method: 'Bank Transfer',
    tracking: 'TCS-88477',
    date: '2026-07-02T22:10:00',
  },
  {
    id: '#10252',
    customer: 'Ayesha Raza',
    email: 'ayesha.raza@email.com',
    city: 'Multan',
    product: 'Kitchen Blender',
    total: 'Rs 8,300',
    amount: 8300,
    courier: 'Trax',
    status: 'Cancelled',
    payment: 'Refunded',
    method: 'COD',
    tracking: 'TRX-30021',
    date: '2026-07-02T18:05:00',
  },
  {
    id: '#10253',
    customer: 'Bilal Chaudhry',
    email: 'bilal.c@email.com',
    city: 'Lahore',
    product: 'Bluetooth Speaker',
    total: 'Rs 3,750',
    amount: 3750,
    courier: 'Leopard',
    status: 'Delivered',
    payment: 'Paid',
    method: 'Easypaisa',
    tracking: 'LPR-55988',
    date: '2026-07-02T14:22:00',
  },
  {
    id: '#10254',
    customer: 'Mahnoor Fatima',
    email: 'mahnoor.f@email.com',
    city: 'Karachi',
    product: 'Yoga Mat',
    total: 'Rs 1,890',
    amount: 1890,
    courier: 'M&P',
    status: 'Processing',
    payment: 'Pending',
    method: 'JazzCash',
    tracking: 'MNP-10301',
    date: '2026-07-02T11:48:00',
  },
  {
    id: '#10255',
    customer: 'Ahsan Tariq',
    email: 'ahsan.tariq@email.com',
    city: 'Islamabad',
    product: 'Office Chair',
    total: 'Rs 14,200',
    amount: 14200,
    courier: 'Trax',
    status: 'In Transit',
    payment: 'Paid',
    method: 'Bank Transfer',
    tracking: 'TRX-30055',
    date: '2026-07-01T16:30:00',
  },
]

/** Recency-ordered list, most recent first — the source for the "Recent Orders" widget. */
export const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date))

export const recentActivity = [
  { id: 1, type: 'delivered', title: 'Order #10248 Delivered', detail: 'Recipient: Zainab Malik, Lahore', time: '2 mins ago' },
  { id: 2, type: 'payment', title: 'Payment Confirmed', detail: 'Order #10250 - PKR 21,900', time: '45 mins ago' },
  { id: 3, type: 'dispatched', title: 'Courier Dispatched', detail: '#10248 picked up by Leopard', time: '2 hours ago' },
  { id: 4, type: 'returned', title: 'Return Initiated', detail: '#10192 - Size Mismatch', time: '5 hours ago' },
  { id: 5, type: 'batch', title: 'New Batch Import', detail: '240 orders uploaded via CSV', time: 'Yesterday' },
  { id: 6, type: 'refund', title: 'Payment Refunded', detail: 'Order #10252 - PKR 8,300', time: 'Yesterday' },
]

export const cityOptions = ['All Cities', 'Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan']
export const courierOptions = ['All Couriers', 'TCS', 'Leopard', 'M&P', 'Trax']
export const statusOptions = ['All Status', 'Delivered', 'In Transit', 'Processing', 'Returned', 'Cancelled']
export const paymentStatusOptions = ['All Payments', 'Paid', 'Pending', 'Refunded']
