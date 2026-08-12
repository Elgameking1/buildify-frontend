import { Link, useLocation } from 'react-router-dom'
import { FiArrowLeft, FiCompass, FiPackage, FiUsers } from 'react-icons/fi'

/**
 * Catch-all route.
 *
 * Without this, an unknown path rendered the layout around nothing at all,
 * which looks like a broken page rather than a wrong address.
 */
function NotFound() {
  const { pathname } = useLocation()

  return (
    <main className="page-container grid gap-8 section-spacing">
      <div className="surface-panel grid gap-6 p-8 text-center sm:p-12">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-50 text-primary-700">
          <FiCompass size={28} aria-hidden="true" />
        </div>

        <div className="grid gap-3">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            404
          </span>
          <h1 className="text-balance text-4xl font-black text-secondary md:text-5xl">
            That page is not on the marketplace.
          </h1>
          <p className="mx-auto max-w-xl leading-7 text-steel">
            Nothing is served at{' '}
            <code className="rounded-control bg-secondary-50 px-2 py-1 text-sm font-semibold text-secondary">
              {pathname}
            </code>
            . It may have been a listing that was archived, or simply a mistyped
            address.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary min-h-12">
            <FiArrowLeft aria-hidden="true" />
            Back to home
          </Link>
          <Link to="/materials" className="btn-secondary min-h-12">
            <FiPackage aria-hidden="true" />
            Browse materials
          </Link>
          <Link to="/workers" className="btn-accent min-h-12">
            <FiUsers aria-hidden="true" />
            Find workers
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound
