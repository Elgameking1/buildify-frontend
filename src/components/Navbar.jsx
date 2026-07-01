import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi'

const navigationLinks = [
  { label: 'Home', to: '/' },
  { label: 'Materials', to: '/materials' },
  { label: 'Workers', to: '/workers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const accountLinks = [
  { label: 'Cart', to: '/cart', icon: FiShoppingCart },
  { label: 'Login', to: '/login', icon: FiUser },
  { label: 'Register', to: '/register' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-concrete bg-surface/95 backdrop-blur">
      <nav className="page-container flex min-h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 text-secondary"
          aria-label="Online Marketplace home"
          onClick={closeMenu}
        >
          <span className="grid size-10 place-items-center rounded-control bg-primary font-black text-secondary-900">
            OM
          </span>
          <span className="text-base font-bold tracking-wide">
            Online Marketplace
          </span>
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
                </Link>
              )
            })}
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
            {[...navigationLinks, ...accountLinks].map((link) => {
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
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
