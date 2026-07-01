import { api } from './api'

export const productsService = {
  createProduct: async (product) => {
    const { data } = await api.post('/products', product)
    return data
  },
  getProductById: async (productId) => {
    const { data } = await api.get(`/products/${productId}`)
    return data
  },
  getProducts: async () => {
    const { data } = await api.get('/products')
    return data
  },
  updateProduct: async (productId, product) => {
    const { data } = await api.patch(`/products/${productId}`, product)
    return data
  },
}
