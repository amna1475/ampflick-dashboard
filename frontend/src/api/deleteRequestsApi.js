import { request } from './client'

export const deleteRequestsApi = {
  create: (orderId, reason) => request('/delete-requests', { method: 'POST', body: JSON.stringify({ orderId, reason }) }),
  list: (status) => request(`/delete-requests${status ? `?status=${status}` : ''}`),
  approve: (id) => request(`/delete-requests/${id}/approve`, { method: 'PUT' }),
  reject: (id) => request(`/delete-requests/${id}/reject`, { method: 'PUT' }),
}
