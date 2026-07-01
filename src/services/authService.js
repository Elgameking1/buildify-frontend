import { api } from './api'

export const authService = {
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },
  logout: async () => {
    const { data } = await api.post('/auth/logout')
    return data
  },
}
