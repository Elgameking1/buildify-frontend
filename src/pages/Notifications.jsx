import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
  FiAlertCircle,
  FiBell,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiPackage,
  FiStar,
  FiTruck,
} from 'react-icons/fi'
import { apiErrorMessage } from '../services/api'
import { notificationsService } from '../services/notificationsService'

// Backend NotificationType -> the icon and the page worth linking to. The keys
// mirror app/core/enums.py exactly; anything unrecognised falls back below
// rather than rendering a blank card.
const KINDS = {
  ORDER_PLACED: { icon: FiPackage, label: 'Order', to: '/vendor-dashboard' },
  ORDER_ITEM_UPDATED: { icon: FiTruck, label: 'Fulfilment', to: '/orders' },
  JOB_REQUEST_RECEIVED: {
    icon: FiBriefcase,
    label: 'Job request',
    to: '/worker-dashboard',
  },
  JOB_ACCEPTED: { icon: FiCheckCircle, label: 'Job', to: '/dashboard' },
  JOB_DECLINED: { icon: FiCheckCircle, label: 'Job', to: '/dashboard' },
  JOB_IN_PROGRESS: { icon: FiBriefcase, label: 'Job', to: '/dashboard' },
  JOB_COMPLETED: { icon: FiCheckCircle, label: 'Job', to: '/dashboard' },
  JOB_CANCELLED: { icon: FiCheckCircle, label: 'Job', to: '/dashboard' },
  REVIEW_RECEIVED: { icon: FiStar, label: 'Review', to: '/worker-dashboard' },
  // Raised for both sides of a payment: the buyer sees their receipt, each
  // vendor on the order sees their cue to start fulfilling.
  PAYMENT_RECEIVED: { icon: FiCreditCard, label: 'Payment', to: '/orders' },
  PAYMENT_FAILED: { icon: FiAlertCircle, label: 'Payment', to: '/orders' },
}

const DEFAULT_KIND = { icon: FiBell, label: 'Update', to: null }

const relativeTime = (value) => {
  if (!value) return ''
  const then = new Date(value).getTime()
  const minutes = Math.round((Date.now() - then) / 60000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`
  if (minutes < 60 * 24 * 7) return `${Math.round(minutes / (60 * 24))}d ago`

  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * The notification feed.
 *
 * Everything shown here was written by the backend inside the transaction that
 * caused it, so a notification cannot exist for an order that rolled back.
 */
function Notifications() {
  const queryClient = useQueryClient()
  const [unreadOnly, setUnreadOnly] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: () => notificationsService.getNotifications({ unreadOnly, size: 50 }),
  })

  const notifications = useMemo(() => data?.items ?? [], [data])
  const unreadCount = notifications.filter((item) => !item.isRead).length

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
    // The navbar badge reads its own query.
    queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
  }

  const markRead = useMutation({
    mutationFn: (id) => notificationsService.markRead(id),
    onSuccess: invalidate,
    onError: (error) =>
      toast.error(apiErrorMessage(error, 'Could not mark that as read.')),
  })

  const markAll = useMutation({
    mutationFn: notificationsService.markAllRead,
    onSuccess: (updated) => {
      invalidate()
      toast.success(
        updated ? `${updated} marked as read` : 'Nothing left to mark',
      )
    },
    onError: (error) =>
      toast.error(apiErrorMessage(error, 'Could not update your notifications.')),
  })

  return (
    <main className="w-full">
      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Notifications
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Everything that changed while you were away.
            </h1>
            <p className="max-w-2xl leading-7 text-on-ink">
              Orders, job requests and rating updates, newest first.
            </p>
          </div>

          <div className="surface-panel grid gap-1 p-5 text-secondary">
            <span className="text-3xl font-black">{unreadCount}</span>
            <span className="text-sm font-semibold text-steel">
              Unread {unreadOnly ? 'shown' : 'on this page'}
            </span>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-6 section-spacing">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              className={unreadOnly ? 'btn' : 'btn-primary'}
              onClick={() => setUnreadOnly(false)}
            >
              All
            </button>
            <button
              type="button"
              className={unreadOnly ? 'btn-primary' : 'btn'}
              onClick={() => setUnreadOnly(true)}
            >
              Unread only
            </button>
          </div>
          <button
            type="button"
            className="btn-secondary"
            disabled={markAll.isPending || unreadCount === 0}
            onClick={() => markAll.mutate()}
          >
            <FiCheck aria-hidden="true" />
            Mark all as read
          </button>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="surface-panel h-24 animate-pulse bg-concrete/40"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="surface-panel grid gap-3 p-8 text-center">
            <h2 className="text-2xl font-black text-secondary">
              Could not load notifications
            </h2>
            <p className="text-steel">
              {apiErrorMessage(error, 'The marketplace API is unreachable.')}
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="surface-panel grid gap-5 p-8 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-50 text-primary-700">
              <FiBell size={28} aria-hidden="true" />
            </div>
            <div className="grid gap-2">
              <h2 className="text-3xl font-black text-secondary">
                {unreadOnly ? 'Nothing unread' : 'No notifications yet'}
              </h2>
              <p className="text-steel">
                Placing an order or sending a job request is what starts this
                feed.
              </p>
            </div>
            <Link to="/materials" className="btn-primary mx-auto w-fit">
              Browse materials
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {notifications.map((notification) => {
              const kind = KINDS[notification.type] ?? DEFAULT_KIND
              const Icon = kind.icon

              return (
                <article
                  key={notification.id}
                  className={`surface-panel grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center ${
                    notification.isRead ? '' : 'border-primary bg-primary-50/40'
                  }`}
                >
                  <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                    <Icon aria-hidden="true" />
                  </div>

                  <div className="grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-700">
                        {kind.label}
                      </span>
                      <span className="text-xs text-steel">
                        {relativeTime(notification.createdAt)}
                      </span>
                      {notification.isRead ? null : (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-black text-on-primary">
                          New
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-secondary">
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {kind.to ? (
                      <Link to={kind.to} className="btn-secondary px-3 py-1 text-sm">
                        Open
                      </Link>
                    ) : null}
                    {notification.isRead ? null : (
                      <button
                        type="button"
                        className="btn px-3 py-1 text-sm text-steel hover:text-secondary"
                        disabled={markRead.isPending}
                        onClick={() => markRead.mutate(notification.id)}
                      >
                        <FiCheck aria-hidden="true" />
                        Read
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default Notifications
