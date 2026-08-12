import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FiAlertCircle, FiArrowRight, FiCheckCircle, FiLoader, FiXCircle } from 'react-icons/fi'
import { Link, useSearchParams } from 'react-router-dom'
import { apiErrorMessage } from '../services/api'
import { paymentsService } from '../services/paymentsService'

const cedi = (amount, currency = 'GHS') =>
  `${currency === 'GHS' ? 'GH₵' : `${currency} `}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
  }).format(amount ?? 0)}`

/**
 * Where Paystack returns the browser after checkout.
 *
 * The reference in the URL is only a pointer: this page asks the backend to
 * settle it, and the backend re-verifies against Paystack rather than
 * believing anything that arrived through the address bar.
 *
 * This is also not the only path to a settled payment. Paystack posts a signed
 * webhook to the API, which settles the very same reference, so a customer who
 * closes the tab on the Paystack page is still credited. That is why a failure
 * here is phrased as "we could not confirm yet" rather than "your payment
 * failed" - the money may well have arrived.
 */

const OUTCOMES = {
  SUCCESS: {
    Icon: FiCheckCircle,
    tone: 'bg-accent-50 text-accent',
    title: 'Payment successful',
    body: 'Your vendors have been notified and can begin preparing your order.',
  },
  FAILED: {
    Icon: FiXCircle,
    tone: 'bg-secondary-100 text-secondary-700',
    title: 'Payment did not go through',
    body: 'Nothing has been charged. You can try again from your orders.',
  },
  ABANDONED: {
    Icon: FiAlertCircle,
    tone: 'bg-primary-50 text-primary-700',
    title: 'Payment not completed',
    body: 'The checkout was closed before it finished. Your order is still waiting.',
  },
  PENDING: {
    Icon: FiLoader,
    tone: 'bg-primary-50 text-primary-700',
    title: 'Payment still processing',
    body: 'Paystack has not settled this yet. Refresh your orders in a moment.',
  },
}

function PaymentCallback() {
  const [params] = useSearchParams()
  const queryClient = useQueryClient()
  // Paystack uses `reference`; `trxref` carries the same value on some
  // integrations, so both are accepted rather than failing on the alias.
  const reference = params.get('reference') || params.get('trxref')

  const {
    data: payment,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['payment', reference],
    queryFn: () => paymentsService.verify(reference),
    enabled: Boolean(reference),
    retry: 1,
  })

  // The order list and the notification badge both change the moment a payment
  // settles, and this page is the only place that knows it happened.
  useEffect(() => {
    if (payment?.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
    }
  }, [payment?.isSuccess, queryClient])

  if (!reference) {
    return (
      <Shell>
        <Outcome
          {...OUTCOMES.FAILED}
          title="No payment reference"
          body="This page is the return address for a Paystack checkout, and there is nothing to confirm without a reference."
        />
      </Shell>
    )
  }

  if (isPending) {
    return (
      <Shell>
        <div className="grid justify-items-center gap-4 py-10 text-center">
          <FiLoader aria-hidden="true" className="size-10 animate-spin text-primary" />
          <p className="text-base font-semibold text-secondary">
            Confirming your payment…
          </p>
          <p className="max-w-md text-sm leading-6 text-steel">
            We are checking with Paystack directly. This usually takes a second or two.
          </p>
        </div>
      </Shell>
    )
  }

  if (isError) {
    return (
      <Shell>
        <Outcome
          {...OUTCOMES.PENDING}
          title="We could not confirm this yet"
          body={apiErrorMessage(
            error,
            'Your payment may still have gone through — check your orders shortly before trying again.',
          )}
        />
      </Shell>
    )
  }

  const outcome = OUTCOMES[payment.status] ?? OUTCOMES.PENDING

  return (
    <Shell>
      <Outcome {...outcome} />

      <dl className="grid gap-3 rounded-panel border border-concrete bg-surface p-5 text-sm">
        <Row label="Amount" value={cedi(payment.amount, payment.currency)} />
        <Row
          label="Method"
          value={
            payment.channel === 'mobile_money'
              ? 'Mobile money'
              : payment.channel === 'card'
                ? 'Card'
                : '—'
          }
        />
        <Row label="Reference" value={payment.reference} mono />
        {payment.gatewayResponse ? (
          <Row label="Provider response" value={payment.gatewayResponse} />
        ) : null}
      </dl>

      <div className="flex flex-wrap gap-3">
        <Link to="/orders" className="btn-primary min-h-11">
          View my orders
          <FiArrowRight aria-hidden="true" />
        </Link>
        <Link to="/materials" className="btn-secondary min-h-11">
          Keep shopping
        </Link>
      </div>
    </Shell>
  )
}

function Shell({ children }) {
  return (
    <section className="page-container page-padding">
      <div className="mx-auto grid max-w-xl gap-6">{children}</div>
    </section>
  )
}

function Outcome({ Icon, tone, title, body }) {
  return (
    <div className="grid justify-items-center gap-3 text-center">
      <span className={`grid size-14 place-items-center rounded-full ${tone}`}>
        <Icon aria-hidden="true" className="size-7" />
      </span>
      <h1 className="text-2xl font-black text-secondary">{title}</h1>
      <p className="max-w-md text-sm leading-6 text-steel">{body}</p>
    </div>
  )
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="font-semibold text-steel">{label}</dt>
      <dd className={`text-right font-bold text-secondary ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </dd>
    </div>
  )
}

export default PaymentCallback
