import axios from 'axios'
import { tokenStore } from './tokenStore'

/**
 * HTTP client for the FastAPI backend.
 *
 * One axios instance for the whole app: the bearer token is attached in one
 * place, and an expired access token is refreshed in one place, so no service
 * module has to think about either.
 */

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

/**
 * Long enough to survive a cold start.
 *
 * The API is hosted on a free tier that stops the container after 15 minutes
 * of inactivity, and the next request waits 30-60 seconds for it to boot. The
 * original 15s timeout aborted every one of those, so the first visitor after
 * a quiet spell could not sign in at all.
 *
 * Nothing is shown while that wait happens - pages carry their own loading
 * state, and a failure explains itself through `apiErrorMessage` below.
 */
const REQUEST_TIMEOUT_MS = 60000

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: REQUEST_TIMEOUT_MS,
})

// --- Request: attach the bearer token ------------------------------------

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Response: refresh once on an expired session ------------------------

// Endpoints that must never trigger a refresh attempt, or a failed login would
// recurse: refresh -> 401 -> refresh -> ...
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

// Codes the backend returns when the session is gone for good. Refreshing is
// pointless for these - the user has to sign in again.
const UNRECOVERABLE = new Set(['session_revoked', 'session_invalid', 'refresh_invalid'])

let refreshPromise = null

function isAuthPath(url = '') {
  return AUTH_PATHS.some((path) => url.includes(path))
}

async function refreshAccessToken() {
  const refreshToken = tokenStore.getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token')

  // A bare axios call, not `api`: going back through the interceptor would
  // attach the dead access token and risk another refresh cycle.
  const { data } = await axios.post(
    `${baseURL}/auth/refresh`,
    { refresh_token: refreshToken },
    // Bare axios defaults to no timeout at all, so this one call would hang
    // indefinitely against an unreachable backend while every other request
    // gives up at REQUEST_TIMEOUT_MS.
    { headers: { 'Content-Type': 'application/json' }, timeout: REQUEST_TIMEOUT_MS },
  )
  tokenStore.save(data)
  return data.access_token
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    if (!response || response.status !== 401 || !config || config._retried) {
      return Promise.reject(error)
    }
    if (isAuthPath(config.url)) {
      return Promise.reject(error)
    }
    if (UNRECOVERABLE.has(response.data?.code)) {
      tokenStore.clear()
      return Promise.reject(error)
    }

    try {
      // Share one in-flight refresh across concurrent 401s. The backend rotates
      // refresh tokens, so firing several refreshes at once would have each one
      // invalidate the others.
      refreshPromise = refreshPromise ?? refreshAccessToken()
      const token = await refreshPromise
      refreshPromise = null

      config._retried = true
      config.headers.Authorization = `Bearer ${token}`
      return api(config)
    } catch (refreshError) {
      refreshPromise = null
      tokenStore.clear()
      return Promise.reject(refreshError)
    }
  },
)

/** Pull a readable message out of the backend's {detail, code} envelope. */
export function apiErrorMessage(error, fallback = 'Something went wrong.') {
  // No response at all means the request never reached the API: a timeout, a
  // dropped connection, or a server still booting. Axios describes those as
  // "Network Error" or "timeout of 60000ms exceeded", which reads like a bug
  // in the page rather than a server that is not answering yet - and on a free
  // tier that sleeps, "not answering yet" is the common case.
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED' || /timeout/i.test(error?.message ?? '')) {
      return 'The server took too long to respond. It may still be starting up - please try again in a moment.'
    }
    return 'Cannot reach the server right now. It may be starting up, or your connection dropped - please try again in a moment.'
  }

  // 502/503/504 from a proxy in front of a cold or crashed container. The body
  // is the host's HTML error page, not our JSON envelope.
  if ([502, 503, 504].includes(error.response.status)) {
    return 'The server is temporarily unavailable - it may be starting up. Please try again in a moment.'
  }

  const data = error.response.data
  if (!data) return fallback
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((item) => item.message).join(', ')
  }
  return fallback
}
