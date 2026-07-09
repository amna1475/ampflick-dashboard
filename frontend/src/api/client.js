// Shared low-level request function used by every *Api.js file.
// Handles: base URL, JSON headers, attaching the auth token, and error parsing.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const TOKEN_KEY = 'ampflick_auth_token'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
