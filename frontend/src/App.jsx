import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { OrdersProvider } from './context/OrdersContext'
import { UsersProvider } from './context/UsersContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Payments from './pages/Payments'
import Customers from './pages/Customers'
import Reports from './pages/Reports'
import Users from './pages/Users'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <OrdersProvider>
          <UsersProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Everything below requires being logged in */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/reports" element={<Reports />} />

                  {/* Admin-only: grant/revoke portal access */}
                  <Route element={<AdminRoute />}>
                    <Route path="/users" element={<Users />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </UsersProvider>
        </OrdersProvider>
      </AuthProvider>
    </ToastProvider>
  )
}