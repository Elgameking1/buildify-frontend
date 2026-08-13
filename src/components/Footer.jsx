import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

const columns = [
  {
    id: 'marketplace',
    title: 'Marketplace',
    links: [
      { label: 'Browse materials', to: '/materials' },
      { label: 'Find workers', to: '/workers' },
      { label: 'Create an account', to: '/register' },
      { label: 'Sign in', to: '/login' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

// Kept in step with the Contact page - one place to change if it ever moves.
const contactDetails = [
  { id: 'email', icon: FiMail, text: 'amoakolin@gmail.com' },
  { id: 'phone', icon: FiPhone, text: '+233 591927991' },
  { id: 'address', icon: FiMapPin, text: 'Accra, Ghana' },
]

function Footer() {
  return (
    <footer className="border-t border-concrete bg-ink text-white">
      <div className="page-container grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="grid content-start gap-4">
          <Link to="/" className="flex w-fit items-center">
            {/* The footer is bg-ink (#1f2937) and the brand green is
                #023522 - the full-colour lockup is unreadable against it, so
                this surface gets the variant whose ink is white. */}
            <img
              src="/images/buildify-logo-light.png"
              alt="Buildify"
              width="479"
              height="160"
              className="h-10 w-auto"
            />
          </Link>
          <p className="max-w-sm text-sm leading-6 text-on-ink">
            Construction materials and skilled workers in one place. Payment and
            delivery are arranged directly between buyer and seller.
          </p>
          <div className="construction-stripe h-2 w-32 rounded-full" />
        </div>

        {columns.map((column) => (
          <div key={column.id} className="grid content-start gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {column.title}
            </h2>
            <ul className="grid gap-2 text-sm">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-on-ink transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="grid content-start gap-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Get in touch
          </h2>
          <ul className="grid gap-3 text-sm text-on-ink">
            {contactDetails.map((detail) => {
              const Icon = detail.icon

              return (
                <li key={detail.id} className="inline-flex items-center gap-2">
                  <Icon className="shrink-0 text-primary" aria-hidden="true" />
                  {detail.text}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-container flex flex-col gap-2 py-5 text-sm text-on-ink sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Buildify. Construction materials and
            skilled workers.
          </p>
          <p>Built for the Ghanaian construction sector.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
