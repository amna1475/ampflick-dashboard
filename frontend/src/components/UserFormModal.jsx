import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import Modal from './Modal'
import { roleOptions } from '../data/roles'

const EMPTY = { name: '', email: '', password: '', role: 'User' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form, existingEmails) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_RE.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  } else if (existingEmails.includes(form.email.trim().toLowerCase())) {
    errors.email = 'A user with this email already has access.'
  }
  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }
  return errors
}

const inputClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 bg-red-50 focus:ring-red-500/30 focus:border-red-400'
      : 'border-slate-200 bg-slate-50 focus:ring-brand-500/30 focus:border-brand-400'
  }`

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  )
}

export default function UserFormModal({ open, onClose, onSubmit, existingEmails = [] }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleClose() {
    if (submitting) return
    setForm(EMPTY)
    setErrors({})
    setFormError('')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate(form, existingEmails.map((e) => e.toLowerCase()))
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    setFormError('')
    try {
      await onSubmit(form)
      setForm(EMPTY)
      onClose()
    } catch (err) {
      setFormError(err?.message || 'Something went wrong while granting access. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Grant Portal Access">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <Field label="Full Name *" error={errors.name}>
          <input className={inputClass(!!errors.name)} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>

        <Field label="Email *" error={errors.email}>
          <input
            className={inputClass(!!errors.email)}
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>

        <Field label="Temporary Password *" error={errors.password}>
          <input
            className={inputClass(!!errors.password)}
            type="text"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="At least 6 characters"
          />
        </Field>

        <Field label="Role">
          <select className={inputClass(false)} value={form.role} onChange={(e) => set('role', e.target.value)}>
            {roleOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>

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
            {submitting ? 'Granting Access...' : 'Grant Access'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
