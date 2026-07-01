import { Link } from 'react-router-dom'

function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm font-semibold text-steel">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${item.to ?? index}`} className="flex items-center gap-2">
              {isLast || !item.to ? (
                <span className="text-secondary">{item.label}</span>
              ) : (
                <Link to={item.to} className="hover:text-primary-700">
                  {item.label}
                </Link>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
