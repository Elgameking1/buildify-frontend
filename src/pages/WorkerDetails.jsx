import { Link, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiMessageSquare,
  FiStar,
  FiUserCheck,
} from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { workersService } from '../services/workersService'

function WorkerDetails() {
  const { id } = useParams()

  const { data: worker, isLoading } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => workersService.getWorkerById(id),
    enabled: Boolean(id),
    retry: false,
  })

  if (isLoading) {
    return (
      <main className="page-container grid gap-6 section-spacing">
        <div className="surface-panel h-96 animate-pulse bg-concrete/40" />
      </main>
    )
  }

  if (!worker) {
    return (
      <main className="page-container grid gap-6 section-spacing">
        <Link to="/workers" className="btn w-fit">
          <FiArrowLeft aria-hidden="true" />
          Back to workers
        </Link>
        <div className="surface-panel grid gap-3 p-8 text-center">
          <h1 className="text-3xl font-black text-secondary">
            Worker not found
          </h1>
          <p className="text-steel">
            The worker profile you are looking for is not available.
          </p>
        </div>
      </main>
    )
  }

  const initials = worker.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <main className="w-full">
      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-6">
          <Link
            to="/workers"
            className="btn w-fit bg-white/10 text-white hover:bg-white/20"
          >
            <FiArrowLeft aria-hidden="true" />
            Back to workers
          </Link>

          <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-end">
            <div className="grid size-36 place-items-center rounded-panel border border-white/10 bg-white/10 text-5xl font-black text-primary md:size-44">
              {initials}
            </div>

            <div className="grid gap-4">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
                  {worker.profession}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  {worker.availability}
                </span>
              </div>
              <div className="grid gap-3">
                <h1 className="text-balance text-4xl font-black md:text-5xl">
                  {worker.name}
                </h1>
                <p className="text-xl font-semibold text-on-ink">
                  {worker.role}
                </p>
                <p className="max-w-3xl leading-7 text-on-ink">
                  {worker.bio}
                </p>
              </div>
            </div>

            <div className="surface-panel grid gap-2 p-5 text-secondary">
              <span className="text-3xl font-black">
                {worker.rate ?? 'On request'}
              </span>
              <span className="text-sm font-semibold text-steel">
                {worker.rate ? 'Day rate' : 'Day rate not published'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <aside className="grid gap-5 lg:sticky lg:top-24">
          <div className="surface-panel grid gap-5 p-6">
            <h2 className="text-2xl font-black text-secondary">
              Profile Snapshot
            </h2>

            <div className="grid gap-4 text-sm text-steel">
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="text-primary" aria-hidden="true" />
                {worker.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiStar className="text-primary" aria-hidden="true" />
                {worker.ratingCount > 0
                  ? `${worker.rating.toFixed(1)} average rating`
                  : 'Not yet rated'}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiBriefcase className="text-primary" aria-hidden="true" />
                {worker.projects}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiClock className="text-primary" aria-hidden="true" />
                {worker.experience} experience
              </span>
            </div>

            <Link
              to={`/workers/${worker.id}/hire`}
              className="btn-primary min-h-12"
            >
              <FiUserCheck aria-hidden="true" />
              Hire Worker
            </Link>
          </div>

          <div className="surface-panel grid gap-4 p-6">
            <h2 className="text-2xl font-black text-secondary">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {worker.skills.length > 0 ? (
                worker.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary-50 px-3 py-2 text-sm font-bold text-primary-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-steel">
                  This worker has not listed any skills yet.
                </span>
              )}
            </div>
          </div>
        </aside>

        <div className="grid gap-8">
          <section className="surface-panel grid gap-5 p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                <FiClock aria-hidden="true" />
              </div>
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                  Experience
                </span>
                <h2 className="text-2xl font-black text-secondary">
                  {worker.experience} of practical site work
                </h2>
              </div>
            </div>
            <p className="leading-7 text-steel">
              {worker.experience} on site, working mainly in{' '}
              {worker.profession.toLowerCase()}.{' '}
              {worker.ratingCount > 0
                ? `${worker.ratingCount} ${
                    worker.ratingCount === 1 ? 'client has' : 'clients have'
                  } rated the finished work.`
                : 'No completed jobs have been rated through the marketplace yet.'}
            </p>
          </section>

          <section className="surface-panel grid gap-5 p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                <FiCheckCircle aria-hidden="true" />
              </div>
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                  Completed Jobs
                </span>
                <h2 className="text-2xl font-black text-secondary">
                  Recent project history
                </h2>
              </div>
            </div>
            {/* Derived from the jobs that produced a review - the API has no
                separate "completed jobs" list, and inventing one would be the
                easiest number on the page to fake. */}
            {worker.completedJobs.length > 0 ? (
              <div className="grid gap-3">
                {worker.completedJobs.map((job) => (
                  <div
                    key={job}
                    className="flex items-start gap-3 rounded-control bg-secondary-50 p-4"
                  >
                    <FiCheckCircle
                      className="mt-1 shrink-0 text-primary-700"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-secondary">{job}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-control bg-secondary-50 p-4 text-steel">
                No reviewed jobs yet. Project history appears here once a client
                marks a job complete and rates it.
              </p>
            )}
          </section>

          <section className="grid gap-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                <FiMessageSquare aria-hidden="true" />
              </div>
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                  Reviews
                </span>
                <h2 className="text-2xl font-black text-secondary">
                  Feedback from completed jobs
                </h2>
              </div>
            </div>

            {worker.reviews.length === 0 ? (
              <p className="surface-panel p-6 text-steel">
                No reviews yet. Only a client whose job was completed can leave
                one, so this stays empty until then.
              </p>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              {worker.reviews.map((review) => (
                <article key={review.id} className="surface-panel grid gap-4 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-secondary">{review.name}</h3>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                        <FiStar aria-hidden="true" />
                        {review.rating} rating
                      </span>
                    </div>
                    <div className="grid size-11 place-items-center rounded-full bg-ink text-sm font-black text-white">
                      {review.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </div>
                  </div>
                  <p className="leading-7 text-steel">"{review.comment}"</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default WorkerDetails
