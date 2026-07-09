import { Routes, Route } from 'react-router-dom'
import { OrdersProvider } from './context/OrdersContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Payments from './pages/Payments'
import Customers from './pages/Customers'
import Reports from './pages/Reports'

export default function App() {
  return (
    <ToastProvider>
      <OrdersProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </OrdersProvider>
    </ToastProvider>
  )
}