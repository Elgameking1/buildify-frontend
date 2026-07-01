import { api } from './api'

export const workersService = {
  getWorkerById: async (workerId) => {
    const { data } = await api.get(`/workers/${workerId}`)
    return data
  },
  getWorkers: async () => {
    const { data } = await api.get('/workers')
    return data
  },
  hireWorker: async (workerId, jobRequest) => {
    const { data } = await api.post(`/workers/${workerId}/hire`, jobRequest)
    return data
  },
  updateAvailability: async (workerId, availability) => {
    const { data } = await api.patch(`/workers/${workerId}/availability`, {
      availability,
    })
    return data
  },
}
