import { adaptJob } from './adapters'
import { api } from './api'

/**
 * Job requests: the hiring half of the marketplace.
 *
 * The backend enforces who may make each transition - only the worker can
 * accept, decline or start; only the client can complete or cancel - so the UI
 * can offer the buttons optimistically and let a 403/409 explain any refusal.
 */
export const jobsService = {
  hireWorker: async ({ workerId, title, description, location, budget, startDate, skillId }) => {
    const { data } = await api.post('/jobs', {
      worker_id: workerId,
      title,
      description,
      location,
      budget: budget || undefined,
      preferred_start_date: startDate || undefined,
      skill_id: skillId || undefined,
    })
    return adaptJob(data)
  },

  /** `role` is 'sent' for the client dashboard, 'received' for the worker's. */
  getJobs: async ({ role = 'any', status, page = 1, size = 20 } = {}) => {
    const { data } = await api.get('/jobs', {
      params: { role, status_filter: status || undefined, page, size },
    })
    return { items: data.items.map(adaptJob), total: data.total }
  },

  getJob: async (jobId) => {
    const { data } = await api.get(`/jobs/${jobId}`)
    return adaptJob(data)
  },

  updateStatus: async (jobId, status) => {
    const { data } = await api.patch(`/jobs/${jobId}/status`, { status })
    return adaptJob(data)
  },

  leaveReview: async (jobId, { rating, comment }) => {
    const { data } = await api.post(`/jobs/${jobId}/review`, { rating, comment })
    return data
  },
}
