import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi'
import { apiErrorMessage } from '../services/api'
import { jobsService } from '../services/jobsService'
import { ordersService } from '../services/ordersService'

const cedi = (amount) =>
  `GH₵${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount ?? 0)}`

const shortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-'

const titleCase = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^./, (character) => character.toUpperCase())

function Dashboard() {
  const { user } = useSelector((state) => state.auth)

  const { data: orderData } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersService.getMyOrders({ size: 20 }),
  })

  const { data: jobData } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobsService.getJobs({ role: 'sent', size: 20 }),
  })

  const orders = useMemo(() => orderData?.items ?? [], [orderData])
  const jobs = useMemo(() => jobData?.items ?? [], [jobData])

  const recentOrders = useMemo(
    () =>
      orders.slice(0, 5).map((order) => ({
        id: order.reference,
        product:
          order.items.length === 1
            ? order.items[0].name
            : `${order.items.length} items`,
        vendor: order.items[0]?.supplier ?? '-',
        status: titleCase(order.status),
        total: cedi(order.subtotal),
        date: shortDate(order.placedAt),
      })),
    [orders],
  )

  const recentHires = useMemo(
    () =>
      jobs.slice(0, 5).map((job) => ({
        id: `JOB-${job.id}`,
        jobId: job.id,
        worker: job.worker ?? 'Worker',
        role: job.title,
        status: titleCase(job.status),
        rawStatus: job.status,
        hasReview: job.hasReview,
        date: shortDate(job.createdAt),
      })),
    [jobs],
  )

  const overviewCards = useMemo(() => {
    const active = orders.filter(
      (order) => order.status === 'PENDING' || order.status === 'CONFIRMED',
    ).length
    const spend = orders
      .filter((order) => order.status !== 'CANCELLED')
      .reduce((total, order) => total + order.subtotal, 0)
    const openJobs = jobs.filter(
      (job) => !['COMPLETED', 'CANCELLED', 'DECLINED'].includes(job.status),
    ).length
    const completed =
      orders.filter((order) => order.status === 'FULFILLED').length +
      jobs.filter((job) => job.status === 'COMPLETED').length

    return [
      {
        id: 'orders',
        label: 'Active Orders',
        value: String(active),
        note: `${orders.length} placed in total`,
        icon: FiShoppingCart,
      },
      {
        id: 'hires',
        label: 'Worker Hires',
        value: String(openJobs),
        note: `${jobs.length} requests sent`,
        icon: FiBriefcase,
      },
      {
        id: 'spend',
        label: 'Total Spend',
        value: cedi(spend),
        note: 'Excludes cancelled orders',
        icon: FiTrendingUp,
      },
      {
        id: 'completed',
        label: 'Completed',
        value: String(completed),
        note: 'Across materials and labour',
        icon: FiCheckCircle,
      },
    ]
  }, [orders, jobs])

  const queryClient = useQueryClient()
  const [reviewFor, setReviewFor] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const complete = useMutation({
    mutationFn: (jobId) => jobsService.updateStatus(jobId, 'COMPLETED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
      toast.success('Job marked complete - you can now leave a review')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not complete the job.')),
  })

  const review = useMutation({
    mutationFn: ({ jobId, ...body }) => jobsService.leaveReview(jobId, body),
    onSuccess: () => {
      // The worker's rating is recalculated server-side, so refresh anything
      // that shows it.
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['workers'] })
      setReviewFor(null)
      setComment('')
      setRating(5)
      toast.success('Thanks for the review')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not save your review.')),
  })

  const profileSummary = {
    name: user?.name ?? 'Client',
    role: 'Client Account',
    location: [user?.city, user?.region].filter(Boolean).join(', ') || 'No location set',
    email: user?.email ?? '—',
    phone: user?.phone || 'No phone number',
  }

  const initials = (profileSummary.name || '?')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Which contact fields are filled in - the same four the profile form edits.
  const profileFields = [user?.name, user?.email, user?.phone, user?.city]
  const completion = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100,
  )

  // Real, actionable items: jobs the client has to move on, plus an unfinished
  // profile. The list used to be three hard-coded sentences.
  const nextSteps = [
    ...recentHires
      .filter((hire) => hire.rawStatus === 'IN_PROGRESS')
      .map((hire) => `Mark "${hire.role}" complete once ${hire.worker} has finished`),
    ...recentHires
      .filter((hire) => hire.rawStatus === 'COMPLETED' && !hire.hasReview)
      .map((hire) => `Rate ${hire.worker} for "${hire.role}"`),
    ...(completion < 100
      ? ['Finish your profile so vendors can reach you about orders']
      : []),
  ]

  const actionsNeeded = nextSteps.length

  return (
    <main className="w-full">
      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Client Dashboard
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Track your materials, worker hires, and project activity.
            </h1>
            <p className="max-w-2xl leading-7 text-secondary-100">
              Your orders, hires and the actions waiting on you.
            </p>
          </div>
          {/* Counted from the jobs actually loaded, not a fixed "3 updates". */}
          <div className="surface-panel grid gap-1 p-5 text-secondary">
            <span className="text-3xl font-black">{actionsNeeded}</span>
            <span className="text-sm font-semibold text-steel">
              {actionsNeeded === 1 ? 'Item needs you' : 'Items need you'}
            </span>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => {
            const Icon = card.icon

            return (
              <article key={card.id} className="surface-panel grid gap-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid gap-1">
                    <span className="text-sm font-semibold text-steel">
                      {card.label}
                    </span>
                    <span className="text-3xl font-black text-secondary">
                      {card.value}
                    </span>
                  </div>
                  <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                    <Icon aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-steel">{card.note}</p>
              </article>
            )
          })}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-start">
          <div className="grid gap-8">
            <section className="surface-panel overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-concrete p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                    Recent Orders
                  </span>
                  <h2 className="text-2xl font-black text-secondary">
                    Material purchases
                  </h2>
                </div>
                <Link to="/orders" className="btn-secondary">
                  All Orders
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="grid gap-3 p-8 text-center">
                  <p className="font-bold text-secondary">No orders yet</p>
                  <p className="text-sm text-steel">
                    Materials you order appear here with their fulfilment status.
                  </p>
                  <Link to="/materials" className="btn-primary mx-auto w-fit">
                    Browse materials
                  </Link>
                </div>
              ) : null}

              <div className={recentOrders.length ? 'hidden md:block' : 'hidden'}>
                <table className="w-full border-collapse text-left">
                  <thead className="bg-secondary-50 text-sm text-secondary">
                    <tr>
                      <th className="p-4 font-bold">Order</th>
                      <th className="p-4 font-bold">Product</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Total</th>
                      <th className="p-4 font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-concrete">
                        <td className="p-4 font-bold text-secondary">
                          {order.id}
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-secondary">
                              {order.product}
                            </p>
                            <p className="text-sm text-steel">{order.vendor}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 font-black text-secondary">
                          {order.total}
                        </td>
                        <td className="p-4 text-sm text-steel">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 md:hidden">
                {recentOrders.map((order) => (
                  <article key={order.id} className="rounded-panel bg-secondary-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-secondary">{order.product}</p>
                        <p className="text-sm text-steel">{order.vendor}</p>
                      </div>
                      <span className="font-black text-secondary">
                        {order.total}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                      <span className="font-bold text-primary-700">
                        {order.status}
                      </span>
                      <span className="text-steel">{order.date}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="surface-panel grid gap-5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                    Recent Hires
                  </span>
                  <h2 className="text-2xl font-black text-secondary">
                    Worker bookings
                  </h2>
                </div>
                <Link to="/workers" className="btn-accent">
                  Find Workers
                </Link>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {recentHires.length === 0 ? (
                  <p className="text-steel lg:col-span-3">
                    No hire requests yet. Find a worker and send one to get
                    started.
                  </p>
                ) : null}
                {recentHires.map((hire) => (
                  <article
                    key={hire.id}
                    className="rounded-panel border border-concrete bg-white p-4"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-full bg-primary text-sm font-black text-secondary-900">
                        {hire.worker
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary">
                          {hire.worker}
                        </h3>
                        <p className="text-sm text-steel">{hire.role}</p>
                      </div>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <span className="inline-flex items-center gap-2 font-semibold text-primary-700">
                        <FiClock aria-hidden="true" />
                        {hire.status}
                      </span>
                      <span className="text-steel">{hire.date}</span>
                    </div>

                    {/* Only the client may complete or review a job - the
                        backend enforces it, and the UI mirrors it. */}
                    {hire.rawStatus === 'IN_PROGRESS' ? (
                      <button
                        type="button"
                        className="btn-primary mt-4 w-full px-3 py-2 text-sm"
                        disabled={complete.isPending}
                        onClick={() => complete.mutate(hire.jobId)}
                      >
                        Mark complete
                      </button>
                    ) : null}

                    {hire.rawStatus === 'COMPLETED' && !hire.hasReview ? (
                      reviewFor === hire.jobId ? (
                        <form
                          className="mt-4 grid gap-2"
                          onSubmit={(event) => {
                            event.preventDefault()
                            review.mutate({ jobId: hire.jobId, rating, comment })
                          }}
                        >
                          <select
                            className="form-input"
                            value={rating}
                            onChange={(event) => setRating(Number(event.target.value))}
                          >
                            {[5, 4, 3, 2, 1].map((value) => (
                              <option key={value} value={value}>
                                {value} star{value === 1 ? '' : 's'}
                              </option>
                            ))}
                          </select>
                          <textarea
                            className="form-input min-h-20 resize-y"
                            placeholder="How did the work go?"
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="btn-primary px-3 py-2 text-sm"
                              disabled={review.isPending}
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn-secondary px-3 py-2 text-sm"
                              onClick={() => setReviewFor(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          type="button"
                          className="btn-secondary mt-4 w-full px-3 py-2 text-sm"
                          onClick={() => setReviewFor(hire.jobId)}
                        >
                          Leave a review
                        </button>
                      )
                    ) : null}

                    {hire.hasReview ? (
                      <p className="mt-4 text-sm font-semibold text-accent">
                        Review submitted
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="grid gap-5">
            <section className="surface-panel grid gap-5 p-6">
              <div className="flex items-center gap-4">
                <div className="grid size-16 place-items-center rounded-full bg-primary text-xl font-black text-secondary-900">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">
                    {profileSummary.name}
                  </h2>
                  <p className="text-sm font-semibold text-steel">
                    {profileSummary.role}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-steel">
                <span className="inline-flex items-center gap-2">
                  <FiUser className="text-primary" aria-hidden="true" />
                  {profileSummary.email}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiPackage className="text-primary" aria-hidden="true" />
                  {profileSummary.location}
                </span>
                <span>{profileSummary.phone}</span>
              </div>

              {/* The bar and the percentage are the same number now - it used
                  to print a dash beside a hard-coded 82% fill. */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-steel">Profile completion</span>
                  <span className="text-secondary">{completion}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-secondary-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>

              <Link to="/profile" className="btn-primary">
                View Profile
              </Link>
            </section>

            <section className="surface-panel grid gap-4 p-6">
              <h2 className="text-xl font-black text-secondary">Next Steps</h2>
              <div className="grid gap-3">
                {nextSteps.length > 0 ? (
                  nextSteps.map((task) => (
                    <div
                      key={task}
                      className="flex items-start gap-3 rounded-control bg-secondary-50 p-3"
                    >
                      <FiCheckCircle
                        className="mt-1 shrink-0 text-primary-700"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-semibold text-secondary">
                        {task}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-steel">
                    Nothing needs your attention right now.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
