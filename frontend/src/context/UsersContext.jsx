import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { usersApi } from '../api/usersApi'
import { useAuth } from './AuthContext'

const UsersContext = createContext(null)

function mapUser(doc) {
  return {
    id: doc._id || doc.id,
    name: doc.name,
    email: doc.email,
    role: doc.role,
    status: 'Active',
    createdAt: doc.createdAt,
  }
}

export function UsersProvider({ children }) {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const docs = await usersApi.list()
      setUsers(docs.map(mapUser))
    } catch (err) {
      setError(err.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Only fetch the user list if the current viewer is actually an Admin
  // (non-admins can't call this endpoint anyway, so don't bother trying).
  useEffect(() => {
    if (isAdmin) refresh()
  }, [isAdmin, refresh])

  const addUser = useCallback(async (user) => {
    const created = await usersApi.create(user)
    const mapped = mapUser(created)
    setUsers((prev) => [...prev, mapped])
    return mapped
  }, [])

  const updateUserRole = useCallback(async (id, role) => {
    const updated = await usersApi.updateRole(id, role)
    setUsers((prev) => prev.map((u) => (u.id === id ? mapUser(updated) : u)))
    return updated
  }, [])

  const removeUser = useCallback(async (id) => {
    await usersApi.remove(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const adminCount = users.filter((u) => u.role === 'Admin').length

  const value = useMemo(
    () => ({ users, loading, error, refresh, addUser, updateUserRole, removeUser, adminCount }),
    [users, loading, error, refresh, addUser, updateUserRole, removeUser, adminCount]
  )

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}

export function useUsers() {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within a UsersProvider')
  return ctx
}
