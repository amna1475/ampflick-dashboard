import { useState } from 'react'
import { AlertCircle, Loader2, Send } from 'lucide-react'
import Modal from './Modal'

export default function RequestDeleteModal({ open, onClose, onSubmit, orderLabel }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleClose() {
    if (submitting) return
    setReason('')
    setError('')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(reason)
      setReason('')
      onClose()
    } catch (err) {
      setError(err?.message || 'Failed to submit the request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Request Deletion">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">
          You don't have permission to delete orders directly. This will send a request to an Admin for{' '}
          <span className="font-semibold text-slate-700">{orderLabel}</span> — it will only be deleted once approved.
        </p>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <label className="block">
          <span className="text-xs font-semibold text-slate-500">Reason (optional)</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Duplicate order, customer cancelled, entered by mistake..."
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none"
          />
        </label>

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
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
