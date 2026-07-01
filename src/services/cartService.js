import { api } from './api'

export const cartService = {
  addItem: async (item) => {
    const { data } = await api.post('/cart/items', item)
    return data
  },
  getCart: async () => {
    const { data } = await api.get('/cart')
    return data
  },
  removeItem: async (productId) => {
    const { data } = await api.delete(`/cart/items/${productId}`)
    return data
  },
  updateQuantity: async (productId, quantity) => {
    const { data } = await api.patch(`/cart/items/${productId}`, { quantity })
    return data
  },
}
