import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-concrete bg-secondary text-white">
      <div className="page-container flex flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="font-bold text-primary">
          Online Marketplace
        </Link>
        <p className="text-secondary-100">
          Construction materials and skilled workers in one place.
        </p>
      </div>
    </footer>
  )
}

export default Footer
