import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiShoppingBag,
  FiSlash,
} from 'react-icons/fi'
import { apiErrorMessage } from '../services/api'
import { ordersService } from '../services/ordersService'

const cedi = (amount) =>
  `GH₵${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount ?? 0)}`

const longDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

const titleCase = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^./, (character) => character.toUpperCase())

// Order status -> badge colours, using the same palette as the rest of the app.
const ORDER_TONES = {
  PENDING: 'bg-primary-50 text-primary-700',
  CONFIRMED: 'bg-accent-50 text-accent',
  FULFILLED: 'bg-accent-50 text-accent',
  CANCELLED: 'bg-secondary-100 text-secondary-700',
}

// A line can only be cancelled while no vendor has dispatched anything.
const CANCELLABLE = new Set(['PENDING', 'CONFIRMED'])

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        ORDER_TONES[status] ?? 'bg-secondary-100 text-secondary-700'
      }`}
    >
      {titleCase(status)}
    </span>
  )
}

/**
 * The buyer's order history.
 *
 * Each row expands into the individual lines, because an order can span several
 * vendors and each of them advances their own lines independently - the order
 * says "confirmed" while one vendor is still to acknowledge theirs, and the
 * only honest way to show that is per line.
 */
function Orders() {
  const queryClient = useQueryClient()
  const [expandedId, setExpandedId] = useState(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersService.getMyOrders({ size: 50 }),
  })

  const orders = useMemo(() => data?.items ?? [], [data])

  const cancel = useMutation({
    mutationFn: (orderId) => ordersService.cancelOrder(orderId),
    onSuccess: () => {
      // Cancelling restocks every line, so the catalogue is stale too.
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Order cancelled and stock returned')
    },
    onError: (error) =>
      toast.error(apiErrorMessage(error, 'Could not cancel that order.')),
  })

  const totals = useMemo(() => {
    const live = orders.filter((order) => order.status !== 'CANCELLED')
    return {
      count: orders.length,
      open: orders.filter((order) => CANCELLABLE.has(order.status)).length,
      spend: live.reduce((sum, order) => sum + order.subtotal, 0),
    }
  }, [orders])

  return (
    <main className="w-full">
      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Orders
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Every order you have placed.
            </h1>
            <p className="max-w-2xl leading-7 text-secondary-100">
              Expand an order to see each vendor's progress on their own lines,
              and cancel while nothing has been dispatched yet.
            </p>
          </div>

          <div className="surface-panel grid gap-4 p-5 text-secondary sm:grid-cols-3">
            <div>
              <span className="text-2xl font-black">{totals.count}</span>
              <p className="text-sm text-steel">Orders placed</p>
            </div>
            <div>
              <span className="text-2xl font-black">{totals.open}</span>
              <p className="text-sm text-steel">Still open</p>
            </div>
            <div>
              <span className="text-2xl font-black">{cedi(totals.spend)}</span>
              <p className="text-sm text-steel">Total spend</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-6 section-spacing">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="surface-panel h-32 animate-pulse bg-concrete/40"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="surface-panel grid gap-3 p-8 text-center">
            <h2 className="text-2xl font-black text-secondary">
              Could not load your orders
            </h2>
            <p className="text-steel">
              {apiErrorMessage(error, 'The marketplace API is unreachable.')}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="surface-panel grid gap-5 p-8 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-50 text-primary-700">
              <FiShoppingBag size={28} aria-hidden="true" />
            </div>
            <div className="grid gap-2">
              <h2 className="text-3xl font-black text-secondary">
                No orders yet
              </h2>
              <p className="text-steel">
                Once you check out, your orders and their fulfilment status
                appear here.
              </p>
            </div>
            <Link to="/materials" className="btn-primary mx-auto w-fit">
              Browse materials
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const isExpanded = expandedId === order.id

              return (
                <article key={order.id} className="surface-panel overflow-hidden">
                  <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-black text-secondary">
                          {order.reference}
                        </h2>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="grid gap-2 text-sm text-steel sm:grid-cols-2">
                        <span className="inline-flex items-center gap-2">
                          <FiPackage className="text-primary" aria-hidden="true" />
                          {order.items.length}{' '}
                          {order.items.length === 1 ? 'line' : 'lines'} ·{' '}
                          {longDate(order.placedAt)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <FiMapPin className="text-primary" aria-hidden="true" />
                          {order.deliveryAddress}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                      <span className="text-3xl font-black text-secondary">
                        {cedi(order.subtotal)}
                      </span>
                      <button
                        type="button"
                        className="btn-secondary"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : order.id)
                        }
                      >
                        {isExpanded ? (
                          <FiChevronUp aria-hidden="true" />
                        ) : (
                          <FiChevronDown aria-hidden="true" />
                        )}
                        {isExpanded ? 'Hide' : 'Details'}
                      </button>
                      {CANCELLABLE.has(order.status) ? (
                        <button
                          type="button"
                          className="btn text-steel hover:text-secondary"
                          disabled={cancel.isPending}
                          onClick={() => cancel.mutate(order.id)}
                        >
                          <FiSlash aria-hidden="true" />
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="border-t border-concrete bg-secondary-50 p-5">
                      <div className="grid gap-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="grid gap-3 rounded-panel border border-concrete bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                          >
                            <div className="grid gap-1">
                              <p className="font-bold text-secondary">
                                {item.name}
                              </p>
                              <p className="text-sm text-steel">
                                {item.supplier} · {item.quantity} ×{' '}
                                {cedi(item.unitPrice)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-4 sm:justify-end">
                              <StatusBadge status={item.status} />
                              <span className="text-lg font-black text-secondary">
                                {cedi(item.lineTotal)}
                              </span>
                            </div>
                          </div>
                        ))}

                        <div className="grid gap-2 pt-2 text-sm text-steel">
                          <span className="inline-flex items-center gap-2">
                            <FiPhone className="text-primary" aria-hidden="true" />
                            Contact on file: {order.contactPhone}
                          </span>
                          <p>
                            Payment and delivery are arranged directly with each
                            vendor.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default Orders
