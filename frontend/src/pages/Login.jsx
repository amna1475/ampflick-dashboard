import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Truck, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { currentUser, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Already logged in — skip the login page
  if (currentUser) {
    const redirectTo = location.state?.from || '/'
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to log in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="h-11 w-11 rounded-xl bg-brand-600 flex items-center justify-center shadow-card mb-3">
            <Truck className="h-5 w-5 text-white" strokeWidth={2.4} />
          </div>
          <p className="font-bold text-slate-900 text-lg">Ampflick</p>
          <p className="text-xs tracking-wide text-slate-400 font-medium">LOGISTICS OPS</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-6">
          <h1 className="text-lg font-bold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-400 mt-1 mb-5">Access is granted by your admin — there's no public sign-up.</p>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 mb-4">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                placeholder="you@ampflick.com"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Password</span>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-card disabled:opacity-70"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Remove this block once your team is used to the login flow */}
        <div className="mt-4 rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-600">First-time setup:</p>
          <p>Admin — alex@ampflick.com / admin123 (created via <code className="font-mono">npm run seed:admin</code>)</p>
          <p className="pt-1">Other users are created by an Admin from the Users page after logging in.</p>
        </div>
      </div>
    </div>
  )
}
