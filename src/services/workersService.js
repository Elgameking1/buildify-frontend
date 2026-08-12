import { adaptWorkerDetail, adaptWorkerSummary } from './adapters'
import { api } from './api'

export const workersService = {
  /** Objective 5: find workers by skill, location and rating. */
  getWorkers: async ({
    q,
    skill,
    region,
    city,
    minRating,
    availability,
    sort = 'rating',
    page = 1,
    size = 24,
  } = {}) => {
    const { data } = await api.get('/workers', {
      params: {
        q: q || undefined,
        skill: skill || undefined,
        region: region || undefined,
        city: city || undefined,
        min_rating: minRating ?? undefined,
        availability: availability || undefined,
        sort,
        page,
        size,
      },
    })
    return {
      items: data.items.map(adaptWorkerSummary),
      total: data.total,
      page: data.page,
      pages: data.pages,
    }
  },

  /**
   * A worker's public profile.
   *
   * Profile and reviews are separate endpoints, fetched together because the
   * detail page renders both and the reviews are also what the adapter uses to
   * derive the "completed jobs" list.
   */
  getWorkerById: async (workerId) => {
    const [profile, reviews] = await Promise.all([
      api.get(`/workers/${workerId}`),
      api.get(`/workers/${workerId}/reviews`, { params: { size: 20 } }),
    ])
    return adaptWorkerDetail(profile.data, reviews.data.items ?? [])
  },

  getSkills: async () => {
    const { data } = await api.get('/skills')
    return data
  },

  // --- Worker's own profile ----------------------------------------------

  getMyProfile: async () => {
    const { data } = await api.get('/workers/me')
    return adaptWorkerDetail(data, [])
  },

  updateMyProfile: async (payload) => {
    const { data } = await api.patch('/workers/me', payload)
    return adaptWorkerDetail(data, [])
  },

  updateAvailability: async (availabilityStatus) => {
    const { data } = await api.patch('/workers/me', {
      availability_status: availabilityStatus,
    })
    return adaptWorkerDetail(data, [])
  },

  setSkills: async (skills) => {
    const { data } = await api.put('/workers/me/skills', { skills })
    return adaptWorkerDetail(data, [])
  },
}
