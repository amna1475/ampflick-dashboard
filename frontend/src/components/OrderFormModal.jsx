import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import Modal from './Modal'

const COURIERS = ['TCS', 'Leopard', 'M&P', 'Trax']
const STATUSES = ['Processing', 'In Transit', 'Delivered', 'Returned', 'Cancelled']
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Refunded']
const METHODS = ['Easypaisa', 'JazzCash', 'Bank Transfer', 'COD']

const EMPTY = {
  customer: '',
  email: '',
  city: '',
  product: '',
  amount: '',
  courier: COURIERS[0],
  status: STATUSES[0],
  payment: PAYMENT_STATUSES[0],
  method: METHODS[0],
  tracking: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}
  if (!form.customer || !form.customer.trim()) {
    errors.customer = 'Customer name is required.'
  }
  if (form.amount === '' || form.amount === null || form.amount === undefined) {
    errors.amount = 'Amount is required.'
  } else if (Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
    errors.amount = 'Amount must be a positive number.'
  }
  if (form.email && !EMAIL_RE.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }
  return errors
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  )
}

const inputClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 bg-red-50 focus:ring-red-500/30 focus:border-red-400'
      : 'border-slate-200 bg-slate-50 focus:ring-brand-500/30 focus:border-brand-400'
  }`

export default function OrderFormModal({ open, onClose, onSubmit, initialValues, title }) {
  const [form, setForm] = useState(initialValues || EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Re-sync form when a different order is opened for editing, or the modal re-opens for Add
  const [lastInitial, setLastInitial] = useState(initialValues)
  if (initialValues !== lastInitial) {
    setLastInitial(initialValues)
    setForm(initialValues || EMPTY)
    setErrors({})
    setFormError('')
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleClose() {
    if (submitting) return // don't allow closing mid-submit
    setForm(EMPTY)
    setErrors({})
    setFormError('')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    setFormError('')
    try {
      await onSubmit(form)
      setForm(EMPTY)
      setErrors({})
      onClose()
    } catch (err) {
      setFormError(err?.message || 'Something went wrong while saving this order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={title || 'Add New Order'}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Customer Name *" error={errors.customer}>
            <input
              className={inputClass(!!errors.customer)}
              value={form.customer}
              onChange={(e) => set('customer', e.target.value)}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              className={inputClass(!!errors.email)}
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="City">
            <input className={inputClass(false)} value={form.city} onChange={(e) => set('city', e.target.value)} />
          </Field>
          <Field label="Product">
            <input className={inputClass(false)} value={form.product} onChange={(e) => set('product', e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (PKR) *" error={errors.amount}>
            <input
              className={inputClass(!!errors.amount)}
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
            />
          </Field>
          <Field label="Tracking ID">
            <input className={inputClass(false)} value={form.tracking} onChange={(e) => set('tracking', e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Courier">
            <select className={inputClass(false)} value={form.courier} onChange={(e) => set('courier', e.target.value)}>
              {COURIERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Order Status">
            <select className={inputClass(false)} value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Payment Status">
            <select className={inputClass(false)} value={form.payment} onChange={(e) => set('payment', e.target.value)}>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Payment Method">
            <select className={inputClass(false)} value={form.method} onChange={(e) => set('method', e.target.value)}>
              {METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 shadow-card disabled:opacity-70"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Saving...' : title === 'Edit Order' ? 'Save Changes' : 'Add Order'}
          </button>
        </div>
      </form>
    </Modal>
  )
}