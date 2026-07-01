import axios from 'axios'
import { materials } from '../constants/materialsData'
import { workers } from '../constants/workersData'

const mockDelay = 250

const mockRoutes = {
  '/auth/me': {
    id: 'client-nana-adjei',
    name: 'Nana Adjei',
    email: 'nana@example.com',
    role: 'client',
  },
  '/cart': {
    items: [
      { productId: 'premium-portland-cement', quantity: 12 },
      { productId: 'treated-timber-planks', quantity: 6 },
    ],
  },
  '/products': materials,
  '/workers': workers,
}

function parsePayload(data) {
  if (!data) {
    return null
  }

  if (typeof data === 'string') {
    return JSON.parse(data)
  }

  return data
}

function getMockResponse(config) {
  const url = config.url?.replace(/^\/mock-api/, '') ?? ''
  const method = config.method?.toUpperCase() ?? 'GET'
  const productMatch = url.match(/^\/products\/(.+)$/)
  const workerMatch = url.match(/^\/workers\/(.+)$/)

  if (method !== 'GET') {
    return {
      data: {
        ok: true,
        message: 'Mock mutation accepted',
        payload: parsePayload(config.data),
      },
      status: 200,
    }
  }

  if (productMatch) {
    return {
      data: materials.find((product) => product.id === productMatch[1]) ?? null,
      status: 200,
    }
  }

  if (workerMatch) {
    return {
      data: workers.find((worker) => worker.id === workerMatch[1]) ?? null,
      status: 200,
    }
  }

  return {
    data: mockRoutes[url] ?? { ok: true, message: 'Mock API response' },
    status: 200,
  }
}

export const api = axios.create({
  adapter: (config) =>
    new Promise((resolve) => {
      window.setTimeout(() => {
        const response = getMockResponse(config)

        resolve({
          ...response,
          config,
          headers: {},
          statusText: 'OK',
        })
      }, mockDelay)
    }),
  baseURL: '/mock-api',
})
