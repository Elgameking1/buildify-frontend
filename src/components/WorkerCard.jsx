import { Link } from 'react-router-dom'
import { FiClock, FiMapPin, FiStar } from 'react-icons/fi'

function WorkerCard({ worker }) {
  return (
    <article className="surface-panel grid gap-5 p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="grid size-14 place-items-center rounded-full bg-primary text-lg font-black text-secondary-900">
          {worker.name
            .split(' ')
            .map((part) => part[0])
            .join('')}
        </div>
        <div>
          <h3 className="font-bold text-secondary">{worker.name}</h3>
          <p className="text-sm text-steel">{worker.role}</p>
        </div>
      </div>
      <div className="grid gap-3 text-sm text-steel">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <FiStar className="text-primary" aria-hidden="true" />
            {worker.rating} rating
          </span>
          <span>{worker.projects}</span>
        </div>
        <span className="inline-flex items-center gap-2">
          <FiMapPin aria-hidden="true" />
          {worker.location}
        </span>
        {worker.availability ? (
          <span className="inline-flex items-center gap-2">
            <FiClock aria-hidden="true" />
            {worker.availability}
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3">
        {worker.rate ? (
          <span className="font-black text-secondary">{worker.rate}</span>
        ) : null}
        <Link to={`/workers/${worker.id}`} className="btn-accent">
        View Profile
        </Link>
      </div>
    </article>
  )
}

export default WorkerCard
