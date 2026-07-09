import { request } from './client'

export const ordersApi = {
  list: () => request('/orders'),
  getById: (id) => request(`/orders/${id}`),
  create: (order) => request('/orders', { method: 'POST', body: JSON.stringify(order) }),
  update: (id, changes) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(changes) }),
  remove: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
  importMany: (orders) => request('/orders/import', { method: 'POST', body: JSON.stringify({ orders }) }),
  summary: () => request('/orders/summary'),
}

export { ApiError } from './client'
