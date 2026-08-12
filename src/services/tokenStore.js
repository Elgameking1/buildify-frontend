/**
 * Where the JWT pair lives.
 *
 * localStorage is used because the backend returns tokens in the response body
 * rather than as httpOnly cookies. That is a deliberate trade-off, not an
 * oversight: it keeps the API stateless and CSRF-free, at the cost of being
 * readable by any XSS on this origin. Everything that touches storage goes
 * through this module so there is one place to change if that ever moves to
 * cookies.
 */

const ACCESS_KEY = 'marketplace.accessToken'
const REFRESH_KEY = 'marketplace.refreshToken'
const USER_KEY = 'marketplace.user'

export const tokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      // A corrupted entry must not wedge the whole app on boot.
      localStorage.removeItem(USER_KEY)
      return null
    }
  },

  save: ({ access_token: accessToken, refresh_token: refreshToken, user }) => {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
