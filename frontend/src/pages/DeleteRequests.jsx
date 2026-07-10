import { Check, X, Loader2, AlertTriangle, Inbox } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useDeleteRequests } from '../context/DeleteRequestsContext'
import { useToast } from '../context/ToastContext'

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function DeleteRequests() {
  const { requests, loading, error, refresh, approveRequest, rejectRequest } = useDeleteRequests()
  const { showToast } = useToast()

  async function handleApprove(request) {
    if (!window.confirm(`Approve deletion of order ${request.orderNumber}? This can't be undone.`)) return
    try {
      await approveRequest(request._id)
      showToast(`Order ${request.orderNumber} deleted.`)
    } catch (err) {
      showToast(err.message || 'Failed to approve this request.', 'error')
    }
  }

  async function handleReject(request) {
    try {
      await rejectRequest(request._id)
      showToast(`Request for ${request.orderNumber} rejected — order was not deleted.`)
    } catch (err) {
      showToast(err.message || 'Failed to reject this request.', 'error')
    }
  }

  return (
    <>
      <PageHeader
        title="Delete Requests"
        subtitle="Orders that other users have asked to delete — review and approve or reject each one."
      />

      <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Pending Approval</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading ? 'Loading...' : `${requests.length} request${requests.length === 1 ? '' : 's'} waiting`}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading requests...
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center px-6">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <p className="text-sm font-semibold text-slate-700">Couldn't load requests</p>
            <p className="text-xs text-slate-400 max-w-sm">{error}</p>
            <button onClick={refresh} className="mt-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center px-6">
            <Inbox className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No pending requests</p>
            <p className="text-xs text-slate-400">You're all caught up — nothing needs approval right now.</p>
          </div>
        )}

        {!loading && !error && requests.length > 0 && (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {['Order', 'Customer', 'Requested By', 'Reason', 'When', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.orderNumber}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.orderCustomer}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.requestedByName}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[220px] truncate">{r.reason || '—'}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{timeAgo(r.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(r)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-2.5 py-1.5 text-xs font-semibold"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve Delete
                        </button>
                        <button
                          onClick={() => handleReject(r)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 px-2.5 py-1.5 text-xs font-semibold"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
