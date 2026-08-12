import { adaptUser } from './adapters'
import { api } from './api'
import { tokenStore } from './tokenStore'

// The register form offers 'Client' | 'Vendor' | 'Worker'; the API expects the
// upper-case enum.
function toApiRole(role) {
  return String(role ?? 'client').toUpperCase()
}

export const authService = {
  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password })
    tokenStore.save(data)
    return adaptUser(data.user)
  },

  register: async ({ email, password, name, role, businessName, headline }) => {
    const payload = {
      email,
      password,
      full_name: name,
      role: toApiRole(role),
    }
    // Only sent for the role that requires it - the API rejects a vendor
    // registration that has no business name.
    if (payload.role === 'VENDOR') {
      payload.business_name = businessName || name
    }
    if (payload.role === 'WORKER' && headline) {
      payload.headline = headline
    }

    const { data } = await api.post('/auth/register', payload)
    tokenStore.save(data)
    return adaptUser(data.user)
  },

  logout: async () => {
    const refreshToken = tokenStore.getRefreshToken()
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refresh_token: refreshToken })
      }
    } finally {
      // Clear locally even if the call fails - the user asked to be signed
      // out, and a network error should not leave them looking signed in.
      tokenStore.clear()
    }
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/users/me')
    return adaptUser(data)
  },

  isAuthenticated: () => Boolean(tokenStore.getAccessToken()),
}
