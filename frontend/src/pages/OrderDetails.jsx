import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, PackageSearch, Pencil, Trash2, Info } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import OrderFormModal from '../components/OrderFormModal'
import { useOrders } from '../context/OrdersContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right">{value || '—'}</span>
    </div>
  )
}

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, loading, updateOrder, deleteOrder } = useOrders()
  const { showToast } = useToast()
  const { canWrite, canDelete } = useAuth()
  const [editOpen, setEditOpen] = useState(false)

  const order = orders.find((o) => o._key === id)

  // A "mock-" id is always available immediately, so only real DB ids ever hit the loading state.
  let status
  if (order) status = 'ready'
  else if (loading && !id.startsWith('mock-')) status = 'loading'
  else status = 'not-found'

  async function handleUpdate(values) {
    if (!canWrite) return
    try {
      await updateOrder(id, values)
      showToast(
        order.source === 'mock'
          ? 'Demo order updated locally (not saved to the database).'
          : 'Order updated successfully.'
      )
      setEditOpen(false)
    } catch (err) {
      showToast(err.message || 'Failed to update order.', 'error')
    }
  }

  async function handleDelete() {
    if (!canDelete) return
    const note = order.source === 'mock' ? ' (this is demo data — it will reappear on refresh)' : ''
    if (!window.confirm(`Delete order ${order.id}?${note}`)) return
    try {
      await deleteOrder(id)
      showToast('Order deleted successfully.')
      navigate('/orders')
    } catch (err) {
      showToast(err.message || 'Failed to delete order.', 'error')
    }
  }

  return (
    <>
      <PageHeader
        title="Order Details"
        subtitle={order ? `Order ${order.id}` : 'Loading order information...'}
        actions={
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        }
      />

      {status === 'loading' && (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading order...</p>
        </div>
      )}

      {status === 'not-found' && (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-16 flex flex-col items-center justify-center gap-3 text-center">
          <PackageSearch className="h-10 w-10 text-slate-300" />
          <p className="text-base font-semibold text-slate-700">Order Not Found</p>
          <p className="text-sm text-slate-400 max-w-sm">
            We couldn't find an order with ID <span className="font-mono">{id}</span>. It may have been deleted, or the link is incorrect.
          </p>
          <Link to="/orders" className="mt-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
            Go back to Orders
          </Link>
        </div>
      )}

      {status === 'ready' && order && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 space-y-5">
            {order.source === 'mock' && (
              <div className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs px-3.5 py-2.5">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>This is demo data for preview purposes — it isn't stored in the database. Edits/deletes here are local only and reset on refresh.</span>
              </div>
            )}

            <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 text-sm">Order Summary</h3>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <StatusBadge status={order.payment} />
                </div>
              </div>
              <Row label="Order Number" value={order.id} />
              <Row label="Product" value={order.product} />
              <Row label="Amount" value={`Rs ${Number(order.amount).toLocaleString()}`} />
              <Row label="Tracking ID" value={order.tracking} />
              <Row label="Courier" value={order.courier} />
              <Row label="Payment Method" value={order.method} />
              <Row label="Placed On" value={order.date ? new Date(order.date).toLocaleString() : '—'} />
              {order.source === 'db' && (
                <Row label="Last Updated" value={order.updatedAt ? new Date(order.updatedAt).toLocaleString() : '—'} />
              )}
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-3">Customer</h3>
              <Row label="Name" value={order.customer} />
              <Row label="Email" value={order.email} />
              <Row label="City" value={order.city} />
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 space-y-2.5">
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Actions</h3>
            {canWrite && (
              <button
                onClick={() => setEditOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-card"
              >
                <Pencil className="h-4 w-4" />
                Edit Order
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Delete Order
              </button>
            )}
            {!canDelete && (
              <p className="text-xs text-slate-400">Only Admins can delete orders.</p>
            )}
          </div>
        </div>
      )}

      {order && canWrite && (
        <OrderFormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleUpdate}
          initialValues={{
            customer: order.customer,
            email: order.email,
            city: order.city,
            product: order.product,
            amount: order.amount,
            courier: order.courier,
            status: order.status,
            payment: order.payment,
            method: order.method,
            tracking: order.tracking,
          }}
          title="Edit Order"
        />
      )}
    </>
  )
}
