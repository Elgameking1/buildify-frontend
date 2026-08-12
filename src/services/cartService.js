import { adaptCart } from './adapters'
import { api } from './api'

/**
 * The cart lives on the server, keyed to the signed-in client.
 *
 * Note the backend keys line operations on the *cart line id*, not the product
 * id - so every mutation here takes a lineId, which `adaptCart` surfaces on
 * each item.
 */
export const cartService = {
  getCart: async () => {
    const { data } = await api.get('/cart')
    return adaptCart(data)
  },

  addItem: async ({ productId, quantity = 1 }) => {
    const { data } = await api.post('/cart/items', {
      product_id: productId,
      quantity,
    })
    return adaptCart(data)
  },

  updateQuantity: async (lineId, quantity) => {
    const { data } = await api.patch(`/cart/items/${lineId}`, { quantity })
    return adaptCart(data)
  },

  removeItem: async (lineId) => {
    const { data } = await api.delete(`/cart/items/${lineId}`)
    return adaptCart(data)
  },

  clear: async () => {
    const { data } = await api.delete('/cart')
    return adaptCart(data)
  },
}
