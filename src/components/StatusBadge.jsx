const STYLES = {
  Delivered: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  'In Transit': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  Processing: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
  Returned: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',
  Cancelled: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  Paid: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  Refunded: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200',
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
  return <span className={`badge ${style}`}>{status}</span>
}
