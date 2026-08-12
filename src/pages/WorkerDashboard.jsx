import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
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
} from 'react-icons/fi'
import { apiErrorMessage } from '../services/api'
import { jobsService } from '../services/jobsService'
import { workersService } from '../services/workersService'

const shortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-'

const cedi = (amount) =>
  amount == null
    ? 'Budget not set'
    : `GH₵${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`

const TRANSITION_MESSAGES = {
  ACCEPTED: 'Job accepted',
  DECLINED: 'Job declined',
  IN_PROGRESS: 'Job started',
}

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
  const queryClient = useQueryClient()

  // The backend scopes this to the signed-in worker, so there is nothing to
  // filter for privacy on this side.
  const { data: jobData } = useQuery({
    queryKey: ['worker-jobs'],
    queryFn: () => jobsService.getJobs({ role: 'received', size: 50 }),
  })

  const { data: profile } = useQuery({
    queryKey: ['worker-me'],
    queryFn: workersService.getMyProfile,
  })

  const jobs = useMemo(() => jobData?.items ?? [], [jobData])

  const { pendingJobs, acceptedJobs, completedJobs } = useMemo(() => {
    const toRow = (job) => ({
      id: `JOB-${job.id}`,
      title: job.title,
      client: job.client ?? 'Client',
      location: job.location,
      date: shortDate(job.createdAt),
      completed: shortDate(job.createdAt),
      budget: cedi(job.budget),
      // Whether *this* job was reviewed. It used to show the worker's overall
      // average on every row, which read as a per-job score it never was.
      hasReview: job.hasReview,
      status: job.status,
    })

    return {
      pendingJobs: jobs.filter((job) => job.status === 'PENDING').map(toRow),
      acceptedJobs: jobs
        .filter((job) => job.status === 'ACCEPTED' || job.status === 'IN_PROGRESS')
        .map(toRow),
      completedJobs: jobs.filter((job) => job.status === 'COMPLETED').map(toRow),
    }
    // `profile` is no longer read in here - the rows carry each job's own
    // review flag rather than the worker's overall average.
  }, [jobs])

  const dashboardStats = [
    {
      id: 'pending',
      label: 'Pending Requests',
      value: String(pendingJobs.length),
      note: 'Awaiting your response',
      icon: FiClock,
    },
    {
      id: 'active',
      label: 'Active Jobs',
      value: String(acceptedJobs.length),
      note: 'Accepted or in progress',
      icon: FiBriefcase,
    },
    {
      id: 'completed',
      label: 'Completed Jobs',
      value: String(completedJobs.length),
      note: 'Marked complete by clients',
      icon: FiCheckCircle,
    },
    {
      id: 'rating',
      label: 'Average Rating',
      value: profile?.rating ? Number(profile.rating).toFixed(1) : '-',
      note: `${profile?.ratingCount ?? 0} reviews`,
      icon: FiStar,
    },
  ]

  const averageRating = Number(profile?.rating ?? 0)
  const ratingCount = profile?.ratingCount ?? 0
  const skillCount = profile?.skills?.length ?? 0

  const initials = (profile?.name ?? '?')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Each metric carries its own scale, so the bar beside it means something:
  // a rating out of 5, reviews against a first-ten milestone, skills against
  // the number of trades the platform recognises.
  const ratingBreakdown = [
    {
      label: 'Average rating',
      display: ratingCount > 0 ? averageRating.toFixed(2) : '—',
      percent: Math.min(100, (averageRating / 5) * 100),
    },
    {
      label: 'Reviews received',
      display: String(ratingCount),
      percent: Math.min(100, ratingCount * 10),
    },
    {
      label: 'Skills listed',
      display: String(skillCount),
      percent: Math.min(100, skillCount * 25),
    },
  ]

  // The toggle used to be local state only, so it reverted on refresh. Seed it
  // from the saved profile instead, then persist every change.
  useEffect(() => {
    if (profile?.availabilityStatus) {
      setIsAvailable(profile.availabilityStatus === 'AVAILABLE')
    }
  }, [profile])

  const transition = useMutation({
    mutationFn: ({ jobId, status }) => jobsService.updateStatus(jobId, status),
    onSuccess: (_job, variables) => {
      queryClient.invalidateQueries({ queryKey: ['worker-jobs'] })
      toast.success(TRANSITION_MESSAGES[variables.status] ?? 'Job updated')
    },
    // A 409 means the state machine refused the move; a 403 means the wrong
    // party attempted it. Both come back with a readable message.
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update the job.')),
  })

  const availability = useMutation({
    mutationFn: (status) => workersService.updateAvailability(status),
    onSuccess: (updated) => {
      queryClient.setQueryData(['worker-me'], updated)
      toast.success(`Marked ${updated.availability.toLowerCase()}`)
    },
    onError: (error) => {
      setIsAvailable((current) => !current) // put the switch back
      toast.error(apiErrorMessage(error, 'Could not update availability.'))
    },
  })

  const toggleAvailability = () => {
    const next = !isAvailable
    setIsAvailable(next)
    availability.mutate(next ? 'AVAILABLE' : 'UNAVAILABLE')
  }

  // `jobId` strips the "JOB-" prefix the rows display.
  const act = (rowId, status) =>
    transition.mutate({ jobId: String(rowId).replace('JOB-', ''), status })

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
              Your workspace for tracking pending jobs, accepted work,
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
              onClick={toggleAvailability}
              disabled={availability.isPending}
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
                {pendingJobs.length === 0 ? (
                  <p className="text-steel">No new requests right now.</p>
                ) : null}
                {pendingJobs.map((job) => (
                  <JobCard key={job.id} job={job}>
                    <div className="grid justify-items-end gap-2">
                      <span className="font-black text-secondary">
                        {job.budget}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn-primary px-3 py-1 text-sm"
                          disabled={transition.isPending}
                          onClick={() => act(job.id, 'ACCEPTED')}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="btn-secondary px-3 py-1 text-sm"
                          disabled={transition.isPending}
                          onClick={() => act(job.id, 'DECLINED')}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
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
                {acceptedJobs.length === 0 ? (
                  <p className="text-steel">No confirmed work yet.</p>
                ) : null}
                {acceptedJobs.map((job) => (
                  <JobCard key={job.id} job={job}>
                    <div className="grid justify-items-end gap-2">
                      <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent">
                        {job.status.replace('_', ' ')}
                      </span>
                      {/* Only the worker may start a job; completion is the
                          client's call, so no "complete" button here. */}
                      {job.status === 'ACCEPTED' ? (
                        <button
                          type="button"
                          className="btn-primary px-3 py-1 text-sm"
                          disabled={transition.isPending}
                          onClick={() => act(job.id, 'IN_PROGRESS')}
                        >
                          Start job
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-steel">
                          Awaiting client sign-off
                        </span>
                      )}
                    </div>
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
                      <th className="p-4 font-bold">Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedJobs.length === 0 ? (
                      <tr className="border-t border-concrete">
                        <td className="p-4 text-steel" colSpan={4}>
                          No completed jobs yet. A job appears here once the
                          client marks it complete.
                        </td>
                      </tr>
                    ) : null}
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
                          {job.hasReview ? (
                            <span className="inline-flex items-center gap-2 font-bold text-primary-700">
                              <FiStar aria-hidden="true" />
                              Reviewed
                            </span>
                          ) : (
                            <span className="text-sm text-steel">
                              Awaiting review
                            </span>
                          )}
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
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                        <FiStar aria-hidden="true" />
                        {job.hasReview ? 'Reviewed' : 'Awaiting review'}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-steel">{job.completed}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="grid gap-5">
            {/* This panel used to be a hard-coded "Daniel Mensah, Masonry
                Specialist, 128 projects, GH₵180/day" regardless of who was
                signed in. It is the signed-in worker's own profile now. */}
            <section className="surface-panel grid gap-5 p-6">
              <div className="flex items-center gap-4">
                <div className="grid size-16 place-items-center rounded-full bg-primary text-xl font-black text-secondary-900">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">
                    {profile?.name ?? 'Your profile'}
                  </h2>
                  <p className="text-sm font-semibold text-steel">
                    {profile?.role ?? 'Skilled worker'}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-steel">
                <span className="inline-flex items-center gap-2">
                  <FiMapPin className="text-primary" aria-hidden="true" />
                  {profile?.location ?? 'No location set'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiBriefcase className="text-primary" aria-hidden="true" />
                  {completedJobs.length}{' '}
                  {completedJobs.length === 1 ? 'completed job' : 'completed jobs'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiTrendingUp className="text-primary" aria-hidden="true" />
                  {profile?.rate ?? 'Day rate not set'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(profile?.skills ?? []).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <Link to="/profile" className="btn-secondary w-fit">
                Edit profile
              </Link>
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
                <span className="text-5xl font-black text-secondary">
                  {ratingCount > 0 ? averageRating.toFixed(1) : '—'}
                </span>
                <span className="pb-2 text-sm font-semibold text-steel">
                  {ratingCount > 0
                    ? `from ${ratingCount} ${ratingCount === 1 ? 'review' : 'reviews'}`
                    : 'not yet rated'}
                </span>
              </div>

              {/* Bars are a fraction of a known maximum. They previously took
                  their width straight from the value - style={{width: '5.00'}}
                  is not a length, so none of them rendered. */}
              <div className="grid gap-3">
                {ratingBreakdown.map((metric) => (
                  <div key={metric.label} className="grid gap-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-steel">{metric.label}</span>
                      <span className="text-secondary">{metric.display}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-secondary-100">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${metric.percent}%` }}
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
