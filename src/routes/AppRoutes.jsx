import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useAuthBootstrap } from '../hooks/useAuthBootstrap'
import AppLayout from '../layouts/AppLayout'
import About from '../pages/About'
import Cart from '../pages/Cart'
import Contact from '../pages/Contact'
import Dashboard from '../pages/Dashboard'
import HireWorker from '../pages/HireWorker'
import Home from '../pages/Home'
import Login from '../pages/Login'
import MaterialDetails from '../pages/MaterialDetails'
import Materials from '../pages/Materials'
import NotFound from '../pages/NotFound'
import Notifications from '../pages/Notifications'
import Orders from '../pages/Orders'
import PaymentCallback from '../pages/PaymentCallback'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import VendorDashboard from '../pages/VendorDashboard'
import WorkerDashboard from '../pages/WorkerDashboard'
import WorkerDetails from '../pages/WorkerDetails'
import Workers from '../pages/Workers'
import ProtectedRoute from './ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return null
}

/**
 * Revalidate the stored session once the router is mounted.
 *
 * It lives in here rather than in App so it sits inside the same tree as the
 * pages that depend on the result.
 */
function SessionGuard() {
  useAuthBootstrap()
  return null
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SessionGuard />
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public: browsing the marketplace never requires an account. */}
          <Route index element={<Home />} />
          <Route path="materials" element={<Materials />} />
          <Route path="materials/:id" element={<MaterialDetails />} />
          <Route path="workers" element={<Workers />} />
          <Route path="workers/:id" element={<WorkerDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Signed in, any role. */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Buying and hiring are client-only, matching the API's role guards
              - a vendor reaching these would only collect 403s. */}
          <Route element={<ProtectedRoute roles={['client']} />}>
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            {/* Paystack returns the browser here. Client-only like the rest of
                buying, and the API re-checks ownership of the reference. */}
            <Route path="payment/callback" element={<PaymentCallback />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workers/:id/hire" element={<HireWorker />} />
          </Route>

          <Route element={<ProtectedRoute roles={['vendor']} />}>
            <Route path="vendor-dashboard" element={<VendorDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['worker']} />}>
            <Route path="worker-dashboard" element={<WorkerDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
