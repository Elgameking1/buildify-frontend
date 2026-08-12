import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * Gate a branch of the route tree behind sign-in and, optionally, a role.
 *
 * This is a usability guard, not the security boundary - every endpoint behind
 * these pages re-checks the caller server-side, because anything decided in the
 * browser can be edited in the browser. What it buys is that a signed-out
 * visitor lands on the login form instead of a dashboard firing a wall of 401s,
 * and that a vendor is sent to their own dashboard rather than an empty client
 * one.
 */

// Where a signed-in account belongs when it reaches a page meant for a
// different role. Sending everyone to /dashboard instead would loop: that page
// is itself client-only, so a vendor would bounce between the two forever.
const HOME_FOR_ROLE = {
  client: '/dashboard',
  vendor: '/vendor-dashboard',
  worker: '/worker-dashboard',
  admin: '/dashboard',
}

function ProtectedRoute({ roles }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    // `from` is what Login uses to return the user to where they were headed.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // ADMIN is deliberately admitted everywhere, mirroring `require_role` on the
  // backend, which treats it as the support account.
  if (roles && role !== 'admin' && !roles.includes(role)) {
    const home = HOME_FOR_ROLE[role] ?? '/'
    return <Navigate to={home === location.pathname ? '/' : home} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
