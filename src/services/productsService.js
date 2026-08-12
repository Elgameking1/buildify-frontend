import { adaptProduct } from './adapters'
import { api } from './api'

export const productsService = {
  /**
   * Browse the catalogue.
   *
   * Search, filter, sort and paging are all done by the backend. Passing them
   * through rather than filtering client-side is what keeps the listing correct
   * once there are more products than fit in a single response.
   */
  getProducts: async ({
    q,
    categoryId,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    size = 24,
  } = {}) => {
    const { data } = await api.get('/products', {
      params: {
        q: q || undefined,
        category_id: categoryId || undefined,
        min_price: minPrice ?? undefined,
        max_price: maxPrice ?? undefined,
        sort,
        page,
        size,
      },
    })
    return {
      items: data.items.map(adaptProduct),
      total: data.total,
      page: data.page,
      pages: data.pages,
    }
  },

  getProductById: async (productId) => {
    const { data } = await api.get(`/products/${productId}`)
    return adaptProduct(data)
  },

  getCategories: async () => {
    const { data } = await api.get('/categories')
    // The API returns a nested tree; the filter dropdown wants a flat list.
    const flatten = (nodes, depth = 0) =>
      nodes.flatMap((node) => [
        { id: node.id, name: node.name, slug: node.slug, depth },
        ...flatten(node.children ?? [], depth + 1),
      ])
    return flatten(data)
  },

  // --- Vendor dashboard ---------------------------------------------------

  getMyProducts: async ({ page = 1, size = 50 } = {}) => {
    const { data } = await api.get('/vendor/products', { params: { page, size } })
    return { items: data.items.map(adaptProduct), total: data.total }
  },

  createProduct: async (product) => {
    const { data } = await api.post('/products', product)
    return adaptProduct(data)
  },

  updateProduct: async (productId, product) => {
    const { data } = await api.patch(`/products/${productId}`, product)
    return adaptProduct(data)
  },

  archiveProduct: async (productId) => {
    const { data } = await api.delete(`/products/${productId}`)
    return adaptProduct(data)
  },
}
