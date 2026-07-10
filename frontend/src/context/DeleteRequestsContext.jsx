import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { deleteRequestsApi } from '../api/deleteRequestsApi'
import { useAuth } from './AuthContext'

const DeleteRequestsContext = createContext(null)

export function DeleteRequestsProvider({ children }) {
  const { isAdmin, currentUser } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const docs = await deleteRequestsApi.list('Pending')
      setRequests(docs)
    } catch (err) {
      setError(err.message || 'Failed to load delete requests.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Only Admins can view the request queue — no point fetching otherwise.
  useEffect(() => {
    if (isAdmin && currentUser) refresh()
  }, [isAdmin, currentUser, refresh])

  // Available to any logged-in user — submits a request instead of deleting directly.
  const requestDeletion = useCallback(async (orderId, reason) => {
    return deleteRequestsApi.create(orderId, reason)
  }, [])

  const approveRequest = useCallback(async (id) => {
    await deleteRequestsApi.approve(id)
    setRequests((prev) => prev.filter((r) => r._id !== id))
  }, [])

  const rejectRequest = useCallback(async (id) => {
    await deleteRequestsApi.reject(id)
    setRequests((prev) => prev.filter((r) => r._id !== id))
  }, [])

  const pendingCount = requests.length

  const value = useMemo(
    () => ({ requests, loading, error, refresh, requestDeletion, approveRequest, rejectRequest, pendingCount }),
    [requests, loading, error, refresh, requestDeletion, approveRequest, rejectRequest, pendingCount]
  )

  return <DeleteRequestsContext.Provider value={value}>{children}</DeleteRequestsContext.Provider>
}

export function useDeleteRequests() {
  const ctx = useContext(DeleteRequestsContext)
  if (!ctx) throw new Error('useDeleteRequests must be used within a DeleteRequestsProvider')
  return ctx
}
