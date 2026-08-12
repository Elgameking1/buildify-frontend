import { api } from './api'

/**
 * Paystack payments.
 *
 * The flow is a redirect, not the inline popup: `initialize` returns a hosted
 * checkout URL and the browser leaves for it. That is a deliberate consequence
 * of the CSP this app ships - `script-src 'self'` blocks js.paystack.co, so the
 * popup would die in production only, which is the worst place to find out.
 *
 * Coming back, the callback page calls `verify`. That is not what decides the
 * outcome: the backend re-asks Paystack and also settles the same payment from
 * a signed webhook, so a customer who closes the tab mid-payment is still
 * credited.
 */
function adaptPayment(payment) {
  return {
    id: payment.id,
    orderId: payment.order_id,
    reference: payment.reference,
    amount: Number(payment.amount),
    currency: payment.currency,
    status: payment.status,
    channel: payment.channel,
    gatewayResponse: payment.gateway_response,
    paidAt: payment.paid_at,
    isSuccess: payment.status === 'SUCCESS',
  }
}

export const paymentsService = {
  /** Whether the server has Paystack keys, so the UI can hide the button. */
  getConfig: async () => {
    const { data } = await api.get('/payments/config')
    return {
      enabled: Boolean(data.enabled),
      currency: data.currency ?? 'GHS',
      channels: data.channels ?? [],
    }
  },

  /**
   * Start a payment. Returns the URL to send the browser to.
   *
   * `channels` narrows what Paystack offers - ['mobile_money'] lands the payer
   * straight on the MoMo tab instead of the default card form.
   */
  initialize: async ({ orderId, channels }) => {
    const { data } = await api.post(`/payments/orders/${orderId}/initialize`, {
      ...(channels?.length ? { channels } : {}),
    })
    return {
      reference: data.reference,
      authorizationUrl: data.authorization_url,
      amount: Number(data.amount),
      currency: data.currency,
    }
  },

  verify: async (reference) => {
    const { data } = await api.get(`/payments/verify/${reference}`)
    return adaptPayment(data)
  },
}
