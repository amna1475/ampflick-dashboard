// Centralized API layer — every backend call goes through here.
// Swap API_BASE_URL (via .env: VITE_API_URL) if your backend runs somewhere else.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (err) {
    // Network failure — backend unreachable, CORS issue, etc.
    throw new ApiError('Could not reach the server. Is the backend running?', 0)
  }

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`
    throw new ApiError(message, response.status)
  }

  return data
}

export const ordersApi = {
  list: () => request('/orders'),
  getById: (id) => request(`/orders/${id}`),
  create: (order) => request('/orders', { method: 'POST', body: JSON.stringify(order) }),
  update: (id, changes) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(changes) }),
  remove: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
  importMany: (orders) => request('/orders/import', { method: 'POST', body: JSON.stringify({ orders }) }),
  summary: () => request('/orders/summary'),
}

export { ApiError }