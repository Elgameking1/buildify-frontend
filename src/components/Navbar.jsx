import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  FiBell,
  FiClipboard,
  FiLogOut,
  FiMenu,
  FiShoppingCart,
  FiUser,
  FiX,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ui/ThemeToggle'
import { useCart } from '../hooks/useCart'
import { authService } from '../services/authService'
import { notificationsService } from '../services/notificationsService'
import { logout as logoutAction } from '../store/slices/authSlice'

const navigationLinks = [
  { label: 'Home', to: '/' },
  { label: 'Materials', to: '/materials' },
  { label: 'Workers', to: '/workers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

// Dashboards are role-specific, so which ones appear depends on who is signed
// in rather than being shown to everyone at once.
const DASHBOARDS = {
  vendor: { label: 'Vendor', to: '/vendor-dashboard' },
  worker: { label: 'Worker', to: '/worker-dashboard' },
  client: { label: 'Dashboard', to: '/dashboard' },
  admin: { label: 'Dashboard', to: '/dashboard' },
}

// Only a client has a cart and an order history; offering either to a vendor
// links them straight at a 403.
const CART_ROLES = new Set(['client', 'admin'])

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, role } = useSelector((state) => state.auth)
  const { totalQuantity } = useCart()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Cheap enough to poll: the endpoint is a single indexed COUNT.
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: notificationsService.getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  })

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = async () => {
    await authService.logout()
    dispatch(logoutAction())
    // Clear the cache too, or the next user would briefly see this one's cart.
    queryClient.clear()
    closeMenu()
    toast.success('Signed out')
    navigate('/', { replace: true })
  }

  const dashboard = role ? DASHBOARDS[role] : null
  const showCart = !isAuthenticated || CART_ROLES.has(role)

  const accountLinks = isAuthenticated
    ? [
        ...(showCart
          ? [
              { label: 'Cart', to: '/cart', icon: FiShoppingCart },
              { label: 'Orders', to: '/orders', icon: FiClipboard },
            ]
          : []),
        ...(dashboard ? [dashboard] : []),
        { label: 'Profile', to: '/profile', icon: FiUser },
      ]
    : [
        { label: 'Cart', to: '/cart', icon: FiShoppingCart },
        { label: 'Login', to: '/login', icon: FiUser },
        { label: 'Register', to: '/register' },
      ]

  return (
    <header className="sticky top-0 z-50 border-b border-concrete bg-surface/95 backdrop-blur">
      <nav className="page-container flex min-h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center text-secondary"
          aria-label="Buildify home"
          onClick={closeMenu}
        >
          {/* The lockup already contains the wordmark, so it replaces both the
              badge and the text that used to sit here. `alt` is empty on
              purpose: the Link above carries the accessible name, and a
              non-empty alt would make a screen reader announce it twice.
              width/height are the intrinsic pixels - with `h-9 w-auto` they
              only serve to reserve the right box before the image loads, so
              the nav does not reflow. */}
          <img
            src="/images/buildify-logo.png"
            alt=""
            width="479"
            height="160"
            className="h-9 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <div className="flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Link key={link.to} to={link.to} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {accountLinks.map((link) => {
              const Icon = link.icon

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={link.label === 'Register' ? 'btn-primary' : 'nav-link'}
                >
                  {Icon ? <Icon aria-hidden="true" /> : null}
                  {link.label}
                  {link.label === 'Cart' && totalQuantity > 0 ? (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-black text-on-primary">
                      {totalQuantity}
                    </span>
                  ) : null}
                </Link>
              )
            })}

            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="nav-link relative"
                  aria-label={
                    unreadCount > 0
                      ? `Notifications, ${unreadCount} unread`
                      : 'Notifications'
                  }
                >
                  <FiBell aria-hidden="true" />
                  {unreadCount > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-black text-on-primary">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : null}
                </Link>
                <button type="button" className="nav-link" onClick={handleLogout}>
                  <FiLogOut aria-hidden="true" />
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary px-3 lg:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-concrete bg-surface lg:hidden">
          <div className="page-container grid gap-3 py-4">
            {isAuthenticated && user ? (
              <p className="px-1 text-sm font-bold text-steel">
                Signed in as {user.name}
              </p>
            ) : null}

            {[
              ...navigationLinks,
              ...accountLinks,
              ...(isAuthenticated
                ? [{ label: 'Notifications', to: '/notifications', icon: FiBell }]
                : []),
            ].map((link) => {
              const Icon = link.icon

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="mobile-nav-link"
                  onClick={closeMenu}
                >
                  {Icon ? <Icon aria-hidden="true" /> : null}
                  {link.label}
                  {link.label === 'Notifications' && unreadCount > 0 ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-black text-on-primary">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              )
            })}

            {/* The desktop toggle is icon-only, which works beside other
                icons; in the drawer everything else is a labelled row, so it
                gets a label to match rather than sitting there unexplained. */}
            <div className="flex items-center justify-between rounded-control px-3 py-2">
              <span className="text-base font-semibold text-secondary">
                Appearance
              </span>
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                className="mobile-nav-link text-left"
                onClick={handleLogout}
              >
                <FiLogOut aria-hidden="true" />
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
