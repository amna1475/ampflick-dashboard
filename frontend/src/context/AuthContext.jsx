import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { authApi } from '../api/authApi'
import { TOKEN_KEY } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // On page load/refresh, if a token is saved, ask the backend who it belongs to.
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        setInitializing(false)
        return
      }
      try {
        const user = await authApi.me()
        setCurrentUser(user)
      } catch (err) {
        // Token expired/invalid — clear it so the user is sent back to login
        localStorage.removeItem(TOKEN_KEY)
      } finally {
        setInitializing(false)
      }
    }
    restoreSession()
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user } = await authApi.login(email, password)
    localStorage.setItem(TOKEN_KEY, token)
    setCurrentUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  const isAdmin = currentUser?.role === 'Admin'
  // Everyone who's logged in can add/edit orders — only Admins can delete.
  const canWrite = !!currentUser
  const canDelete = isAdmin

  const value = useMemo(
    () => ({ currentUser, initializing, login, logout, isAdmin, canWrite, canDelete }),
    [currentUser, initializing, login, logout, isAdmin, canWrite, canDelete]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
