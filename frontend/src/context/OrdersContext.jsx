import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { recentOrders as mockOrdersRaw } from '../data/mockData'
import { ordersApi } from '../api/ordersApi'

const OrdersContext = createContext(null)

const EDITABLE_FIELDS = ['customer', 'email', 'city', 'product', 'amount', 'courier', 'status', 'payment', 'method', 'tracking']

function sanitizePayload(input) {
  const payload = {}
  for (const key of EDITABLE_FIELDS) {
    if (input[key] !== undefined) payload[key] = input[key]
  }
  return payload
}

// Demo orders from mockData.js — always shown, never touch the database.
// _key is prefixed with "mock-" so we can tell them apart from real DB orders at a glance.
function mapMockOrder(o) {
  return { ...o, _key: `mock-${String(o.id).replace('#', '')}`, source: 'mock' }
}

// Real orders fetched from / saved to MongoDB via the backend API.
function mapDbOrder(doc) {
  const amount = Number(doc.amount) || 0
  return {
    _key: doc._id,
    id: doc.orderNumber || doc._id,
    customer: doc.customer,
    email: doc.email || '',
    city: doc.city || '',
    product: doc.product || '',
    amount,
    total: `Rs ${amount.toLocaleString()}`,
    courier: doc.courier,
    status: doc.status,
    payment: doc.payment,
    method: doc.method,
    tracking: doc.tracking || '—',
    date: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt,
    source: 'db',
  }
}

const DEFAULT_FILTERS = {
  status: 'All Status',
  courier: 'All Couriers',
  payment: 'All Payments',
  city: 'All Cities',
  customerName: '',
}

export function OrdersProvider({ children }) {
  const initialMockOrders = useMemo(() => mockOrdersRaw.map(mapMockOrder), [])

  // Demo orders are shown immediately; real DB orders load in afterwards and
  // always sit right after the demo section, so mock data never disappears
  // just because the API is slow (or unreachable).
  const [orders, setOrders] = useState(initialMockOrders)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Shared "Add Order" modal state — lets any page (Dashboard header, Orders table, etc.)
  // open the same Add Order form instead of each needing its own local state.
  const [addModalOpen, setAddModalOpen] = useState(false)
  const openAddOrder = useCallback(() => setAddModalOpen(true), [])
  const closeAddOrder = useCallback(() => setAddModalOpen(false), [])

  // Shared filter bar state — set by the Filters component, read by OrdersTable.
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const docs = await ordersApi.list()
      const dbMapped = docs.map(mapDbOrder)
      setOrders((prev) => {
        const mockOnly = prev.filter((o) => o.source === 'mock')
        return [...mockOnly, ...dbMapped]
      })
    } catch (err) {
      setError(err.message || 'Could not load live orders from the server. Showing demo data only.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Always goes to the real database, regardless of what's currently displayed.
  const addOrder = useCallback(async (order) => {
    const created = await ordersApi.create({
      ...sanitizePayload(order),
      amount: Number(order.amount) || 0,
    })
    const mapped = mapDbOrder(created)
    setOrders((prev) => {
      const mockOnly = prev.filter((o) => o.source === 'mock')
      const dbOnly = prev.filter((o) => o.source === 'db')
      return [...mockOnly, mapped, ...dbOnly] // newest real order appears right after the demo section
    })
    return mapped
  }, [])

  // Mock orders update locally only (nothing to persist them to).
  // Real orders go through the API and update the database.
  const updateOrder = useCallback(async (key, changes) => {
    if (key.startsWith('mock-')) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o._key !== key) return o
          const merged = { ...o, ...sanitizePayload(changes) }
          if (changes.amount !== undefined) {
            merged.amount = Number(changes.amount) || 0
            merged.total = `Rs ${merged.amount.toLocaleString()}`
          }
          return merged
        })
      )
      return
    }

    const payload = sanitizePayload(changes)
    if (changes.amount !== undefined) payload.amount = Number(changes.amount) || 0
    const updated = await ordersApi.update(key, payload)
    const mapped = mapDbOrder(updated)
    setOrders((prev) => prev.map((o) => (o._key === key ? mapped : o)))
    return mapped
  }, [])

  // Mock orders are removed from the current screen only — refreshing the
  // page brings them back, since they were never actually stored anywhere.
  // Real orders are deleted from the database for good.
  const deleteOrder = useCallback(async (key) => {
    if (key.startsWith('mock-')) {
      setOrders((prev) => prev.filter((o) => o._key !== key))
      return
    }
    await ordersApi.remove(key)
    setOrders((prev) => prev.filter((o) => o._key !== key))
  }, [])

  // CSV import always creates real, permanent orders in the database.
  const importOrders = useCallback(
    async (rows) => {
      const mapped = rows
        .filter((r) => r && (r.customer || r.Customer || r.name))
        .map((r) => ({
          customer: r.customer ?? r.Customer ?? r.name ?? 'Unknown',
          email: r.email ?? r.Email ?? '',
          city: r.city ?? r.City ?? '',
          product: r.product ?? r.Product ?? '',
          amount: Number(r.amount ?? r.Amount ?? r.total ?? r.Total ?? 0),
          courier: r.courier ?? r.Courier ?? 'TCS',
          status: r.status ?? r.Status ?? 'Processing',
          payment: r.payment ?? r.Payment ?? 'Pending',
          method: r.method ?? r.Method ?? 'COD',
          tracking: r.tracking ?? r.Tracking ?? '—',
        }))
      if (mapped.length === 0) return 0
      const result = await ordersApi.importMany(mapped)
      await refresh()
      return result.count ?? mapped.length
    },
    [refresh]
  )

  const getOrderById = useCallback((key) => orders.find((o) => o._key === key), [orders])

  const value = useMemo(
    () => ({
      orders,
      loading,
      error,
      refresh,
      addOrder,
      updateOrder,
      deleteOrder,
      importOrders,
      getOrderById,
      addModalOpen,
      openAddOrder,
      closeAddOrder,
      filters,
      setFilter,
      resetFilters,
    }),
    [
      orders,
      loading,
      error,
      refresh,
      addOrder,
      updateOrder,
      deleteOrder,
      importOrders,
      getOrderById,
      addModalOpen,
      openAddOrder,
      closeAddOrder,
      filters,
      setFilter,
      resetFilters,
    ]
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within an OrdersProvider')
  return ctx
}