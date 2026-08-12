import { adaptOrder } from './adapters'
import { api } from './api'

export const ordersService = {
  /**
   * Checkout.
   *
   * The backend turns the cart into an order inside one transaction: stock is
   * verified and decremented under a row lock, prices are frozen onto the
   * order lines, and the cart is emptied. A 409 here means the stock ran out
   * between browsing and checking out.
   */
  placeOrder: async ({ deliveryAddress, contactPhone, notes }) => {
    const { data } = await api.post('/orders', {
      delivery_address: deliveryAddress,
      contact_phone: contactPhone,
      notes: notes || undefined,
    })
    return adaptOrder(data)
  },

  getMyOrders: async ({ page = 1, size = 20 } = {}) => {
    const { data } = await api.get('/orders', { params: { page, size } })
    return { items: data.items.map(adaptOrder), total: data.total }
  },

  getOrder: async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`)
    return adaptOrder(data)
  },

  cancelOrder: async (orderId) => {
    const { data } = await api.post(`/orders/${orderId}/cancel`)
    return adaptOrder(data)
  },

  // --- Vendor fulfilment queue -------------------------------------------

  getVendorQueue: async ({ page = 1, size = 50 } = {}) => {
    const { data } = await api.get('/vendor/orders', { params: { page, size } })
    return {
      total: data.total,
      items: (data.items ?? []).map((line) => ({
        id: line.id,
        orderId: line.order_id,
        reference: line.order_number,
        placedAt: line.placed_at,
        orderStatus: line.order_status,
        productName: line.product_name,
        quantity: line.quantity,
        unitPrice: Number(line.unit_price),
        lineTotal: Number(line.line_total),
        status: line.vendor_status,
        clientName: line.client_name,
        clientPhone: line.client_phone,
        deliveryAddress: line.delivery_address,
      })),
    }
  },

  updateLineStatus: async (lineId, vendorStatus) => {
    const { data } = await api.patch(`/vendor/orders/items/${lineId}`, {
      vendor_status: vendorStatus,
    })
    return data
  },
}
