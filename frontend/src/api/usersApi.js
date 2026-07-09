import { request } from './client'

export const usersApi = {
  list: () => request('/users'),
  create: (user) => request('/users', { method: 'POST', body: JSON.stringify(user) }),
  updateRole: (id, role) => request(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  remove: (id) => request(`/users/${id}`, { method: 'DELETE' }),
}
