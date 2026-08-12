import axios from 'axios'
import { notify } from '../components/ui/toastUtils'
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
 * of inactivity, and the next request has to wait for it to boot again - 30 to
 * 60 seconds.  The previous 15s timeout aborted every one of those, so the
 * first visitor after a quiet spell simply could not log in.  A generous
 * timeout is the only thing that makes that request survivable.
 *
 * The cost is that a genuinely dead backend now takes a minute to report
 * itself, which is what the notice below is for: it distinguishes "still
 * waiting on purpose" from "nothing is happening", so the wait is legible
 * rather than looking like a hang.
 */
const REQUEST_TIMEOUT_MS = 60000
const WAKE_NOTICE_AFTER_MS = 8000

let inFlight = 0
let wakeTimer = null
let wakeToastId = null

function clearWakeNotice() {
  if (wakeTimer !== null) {
    clearTimeout(wakeTimer)
    wakeTimer = null
  }
  if (wakeToastId !== null) {
    notify.dismiss(wakeToastId)
    wakeToastId = null
  }
}

function requestStarted() {
  inFlight += 1
  // One notice for the whole burst, not one per request: a page load fires
  // several calls at once and they are all waiting on the same cold container.
  if (wakeTimer === null && wakeToastId === null) {
    wakeTimer = setTimeout(() => {
      wakeTimer = null
      if (inFlight > 0) {
        wakeToastId = notify.loading('Waking the server up. This can take up to a minute.')
      }
    }, WAKE_NOTICE_AFTER_MS)
  }
}

function requestSettled() {
  inFlight = Math.max(0, inFlight - 1)
  if (inFlight === 0) clearWakeNotice()
}

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: REQUEST_TIMEOUT_MS,
})

// --- Request: attach the bearer token ------------------------------------

api.interceptors.request.use((config) => {
  requestStarted()
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
  (response) => {
    requestSettled()
    return response
  },
  async (error) => {
    // Settled before the retry below re-enters the request interceptor, so the
    // in-flight count stays balanced across a refresh-and-replay.
    requestSettled()
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
  const data = error?.response?.data
  if (!data) return error?.message ?? fallback
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((item) => item.message).join(', ')
  }
  return fallback
}
