import { useState } from 'react'
import {
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiStar,
  FiToggleLeft,
  FiToggleRight,
  FiTrendingUp,
  FiUserCheck,
} from 'react-icons/fi'

const dashboardStats = [
  {
    id: 'pending',
    label: 'Pending Jobs',
    value: '4',
    note: 'Awaiting response',
    icon: FiClock,
  },
  {
    id: 'accepted',
    label: 'Accepted Jobs',
    value: '3',
    note: 'Scheduled this week',
    icon: FiUserCheck,
  },
  {
    id: 'completed',
    label: 'Completed Jobs',
    value: '112',
    note: '+6 this month',
    icon: FiCheckCircle,
  },
  {
    id: 'rating',
    label: 'Average Rating',
    value: '4.9',
    note: 'Based on 48 reviews',
    icon: FiStar,
  },
]

const pendingJobs = [
  {
    id: 'JOB-501',
    title: 'Boundary wall masonry',
    client: 'Adjei Developments',
    location: 'East Legon, Accra',
    date: 'Jul 5, 2026',
    budget: 'GH₵1,800',
  },
  {
    id: 'JOB-502',
    title: 'Retail shop plastering',
    client: 'Urban Retail Group',
    location: 'Osu, Accra',
    date: 'Jul 7, 2026',
    budget: 'GH₵1,250',
  },
]

const acceptedJobs = [
  {
    id: 'JOB-493',
    title: 'Apartment blockwork phase 2',
    client: 'North Ridge Contractors',
    location: 'Spintex, Accra',
    date: 'Jul 2, 2026',
    status: 'Starts tomorrow',
  },
  {
    id: 'JOB-491',
    title: 'Concrete repair and patching',
    client: 'Tema Site Works',
    location: 'Tema Community 12',
    date: 'Jul 4, 2026',
    status: 'Materials confirmed',
  },
  {
    id: 'JOB-489',
    title: 'Gatehouse wall construction',
    client: 'Oakview Estates',
    location: 'Amasaman',
    date: 'Jul 8, 2026',
    status: 'Site visit booked',
  },
]

const completedJobs = [
  {
    id: 'JOB-472',
    title: 'Warehouse partition blockwork',
    client: 'Metro Logistics',
    completed: 'Jun 28, 2026',
    rating: 5,
  },
  {
    id: 'JOB-468',
    title: 'Residential plastering finish',
    client: 'Esi Coleman',
    completed: 'Jun 24, 2026',
    rating: 4.8,
  },
  {
    id: 'JOB-461',
    title: 'Foundation block setting',
    client: 'Greenline Homes',
    completed: 'Jun 18, 2026',
    rating: 4.9,
  },
]

const ratingBreakdown = [
  { label: '5 stars', value: '78%' },
  { label: '4 stars', value: '18%' },
  { label: '3 stars', value: '4%' },
]

function JobCard({ job, children }) {
  return (
    <article className="rounded-panel border border-concrete bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-700">
            {job.id}
          </span>
          <h3 className="mt-1 font-bold text-secondary">{job.title}</h3>
          <p className="text-sm text-steel">{job.client}</p>
        </div>
        {children}
      </div>
      <div className="grid gap-2 text-sm text-steel">
        {job.location ? (
          <span className="inline-flex items-center gap-2">
            <FiMapPin className="text-primary" aria-hidden="true" />
            {job.location}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-2">
          <FiCalendar className="text-primary" aria-hidden="true" />
          {job.date ?? job.completed}
        </span>
      </div>
    </article>
  )
}

function WorkerDashboard() {
  const [isAvailable, setIsAvailable] = useState(true)

  return (
    <main className="w-full">
      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Worker Dashboard
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Manage job requests, bookings, and performance.
            </h1>
            <p className="max-w-2xl leading-7 text-secondary-100">
              Mock worker workspace for tracking pending jobs, accepted work,
              completed jobs, ratings, and availability.
            </p>
          </div>

          <div className="surface-panel grid gap-4 p-5 text-secondary">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                Availability
              </span>
              <p className="text-2xl font-black">
                {isAvailable ? 'Available' : 'Unavailable'}
              </p>
            </div>
            <button
              type="button"
              className={isAvailable ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setIsAvailable((current) => !current)}
            >
              {isAvailable ? (
                <FiToggleRight aria-hidden="true" />
              ) : (
                <FiToggleLeft aria-hidden="true" />
              )}
              Toggle Availability
            </button>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon

            return (
              <article key={stat.id} className="surface-panel grid gap-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid gap-1">
                    <span className="text-sm font-semibold text-steel">
                      {stat.label}
                    </span>
                    <span className="text-3xl font-black text-secondary">
                      {stat.value}
                    </span>
                  </div>
                  <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                    <Icon aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-steel">{stat.note}</p>
              </article>
            )
          })}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-start">
          <div className="grid gap-8">
            <section className="surface-panel grid gap-5 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                    Pending Jobs
                  </span>
                  <h2 className="text-2xl font-black text-secondary">
                    New requests to review
                  </h2>
                </div>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700">
                  {pendingJobs.length} pending
                </span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {pendingJobs.map((job) => (
                  <JobCard key={job.id} job={job}>
                    <span className="font-black text-secondary">
                      {job.budget}
                    </span>
                  </JobCard>
                ))}
              </div>
            </section>

            <section className="surface-panel grid gap-5 p-5">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                  Accepted Jobs
                </span>
                <h2 className="text-2xl font-black text-secondary">
                  Confirmed work schedule
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {acceptedJobs.map((job) => (
                  <JobCard key={job.id} job={job}>
                    <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent">
                      {job.status}
                    </span>
                  </JobCard>
                ))}
              </div>
            </section>

            <section className="surface-panel overflow-hidden">
              <div className="border-b border-concrete p-5">
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                  Completed Jobs
                </span>
                <h2 className="text-2xl font-black text-secondary">
                  Recent finished work
                </h2>
              </div>

              <div className="hidden md:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-secondary-50 text-sm text-secondary">
                    <tr>
                      <th className="p-4 font-bold">Job</th>
                      <th className="p-4 font-bold">Client</th>
                      <th className="p-4 font-bold">Completed</th>
                      <th className="p-4 font-bold">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedJobs.map((job) => (
                      <tr key={job.id} className="border-t border-concrete">
                        <td className="p-4">
                          <p className="font-bold text-secondary">{job.title}</p>
                          <p className="text-sm text-steel">{job.id}</p>
                        </td>
                        <td className="p-4 text-sm font-semibold text-steel">
                          {job.client}
                        </td>
                        <td className="p-4 text-sm text-steel">
                          {job.completed}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-2 font-bold text-primary-700">
                            <FiStar aria-hidden="true" />
                            {job.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 md:hidden">
                {completedJobs.map((job) => (
                  <article
                    key={job.id}
                    className="rounded-panel bg-secondary-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-secondary">{job.title}</p>
                        <p className="text-sm text-steel">{job.client}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 font-bold text-primary-700">
                        <FiStar aria-hidden="true" />
                        {job.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-steel">{job.completed}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="grid gap-5">
            <section className="surface-panel grid gap-5 p-6">
              <div className="flex items-center gap-4">
                <div className="grid size-16 place-items-center rounded-full bg-primary text-xl font-black text-secondary-900">
                  DM
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">
                    Daniel Mensah
                  </h2>
                  <p className="text-sm font-semibold text-steel">
                    Masonry Specialist
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-steel">
                <span className="inline-flex items-center gap-2">
                  <FiMapPin className="text-primary" aria-hidden="true" />
                  Accra, Ghana
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiBriefcase className="text-primary" aria-hidden="true" />
                  128 projects
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiTrendingUp className="text-primary" aria-hidden="true" />
                  GH₵180/day
                </span>
              </div>
            </section>

            <section className="surface-panel grid gap-5 p-6">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                  Ratings
                </span>
                <h2 className="text-2xl font-black text-secondary">
                  Client feedback
                </h2>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-secondary">4.9</span>
                <span className="pb-2 text-sm font-semibold text-steel">
                  average rating
                </span>
              </div>

              <div className="grid gap-3">
                {ratingBreakdown.map((rating) => (
                  <div key={rating.label} className="grid gap-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-steel">{rating.label}</span>
                      <span className="text-secondary">{rating.value}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-secondary-100">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: rating.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default WorkerDashboard
