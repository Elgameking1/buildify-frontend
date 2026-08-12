import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Toast from '../components/ui/Toast'

/**
 * The shell every page renders inside.
 *
 * Deliberately just a growing box. It used to be a `<main>` with its own
 * padding and `place-items-center`, which caused two problems: every page also
 * renders a `<main>`, so the document had nested landmarks and assistive
 * technology saw two "main" regions; and the horizontal padding stopped the
 * full-bleed dark page headers from reaching the viewport edge. Spacing is the
 * page's own business - each one uses `page-container` and `section-spacing`.
 */
function AppLayout() {
  return (
    <>
      <div className="app-shell flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
      <Toast />
    </>
  )
}

export default AppLayout
