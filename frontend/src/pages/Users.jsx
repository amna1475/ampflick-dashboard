import { useState } from 'react'
import { UserPlus, Trash2, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import UserFormModal from '../components/UserFormModal'
import { useUsers } from '../context/UsersContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { roleOptions } from '../data/roles'

const ROLE_STYLES = {
  Admin: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200',
  User: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
}

export default function Users() {
  const { users, loading, error, refresh, addUser, updateUserRole, removeUser } = useUsers()
  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const [addOpen, setAddOpen] = useState(false)

  async function handleAdd(values) {
    await addUser(values)
    showToast(`Access granted to ${values.name}.`)
  }

  async function handleRoleChange(user, newRole) {
    if (newRole === user.role) return
    try {
      await updateUserRole(user.id, newRole)
      showToast(`${user.name}'s role updated to ${newRole}.`)
    } catch (err) {
      showToast(err.message || "Couldn't update this user's role.", 'error')
    }
  }

  async function handleRemove(user) {
    if (user.id === currentUser.id) {
      showToast("You can't remove your own access.", 'error')
      return
    }
    if (!window.confirm(`Revoke portal access for ${user.name}? They won't be able to log in anymore.`)) return
    try {
      await removeUser(user.id)
      showToast(`Access revoked for ${user.name}.`)
    } catch (err) {
      showToast(err.message || "Couldn't remove this user.", 'error')
    }
  }

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage who has access to the Ampflick portal and what they can do."
        actions={
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-card"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        }
      />

      <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Portal Access</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading ? 'Loading...' : `${users.length} user${users.length === 1 ? '' : 's'} with access`}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading users...
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center px-6">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <p className="text-sm font-semibold text-slate-700">Couldn't load users</p>
            <p className="text-xs text-slate-400 max-w-sm">{error}</p>
            <button onClick={refresh} className="mt-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {['Name', 'Email', 'Role', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-700">{u.name}</p>
                        {u.id === currentUser.id && (
                          <span className="rounded-full bg-slate-100 text-slate-400 text-[10px] font-semibold px-1.5 py-0.5">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        className={`rounded-full text-xs font-semibold px-2.5 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${ROLE_STYLES[u.role]}`}
                      >
                        {roleOptions.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleRemove(u)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                        title="Revoke access"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        existingEmails={users.map((u) => u.email)}
      />
    </>
  )
}
