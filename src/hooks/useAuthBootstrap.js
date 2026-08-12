import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authService } from '../services/authService'
import { tokenStore } from '../services/tokenStore'
import { login as loginAction, logout as logoutAction } from '../store/slices/authSlice'

/**
 * Re-check the stored session against the API once, on boot.
 *
 * Auth state is rehydrated from localStorage, which is a claim by the client
 * about itself - the token may have expired, been revoked by a logout
 * elsewhere, or belong to an account that has since been deactivated. Until it
 * has been shown to a server, "signed in" is a guess.
 *
 * Asking `/users/me` settles it: the answer also refreshes the cached user, so
 * a role or name changed on another device is picked up here rather than
 * lingering until the next sign-in. The 401 path is handled by the axios
 * interceptor, which attempts a refresh first and only then gives up.
 */
export function useAuthBootstrap() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || !tokenStore.getAccessToken()) return

    let cancelled = false

    authService
      .getCurrentUser()
      .then((user) => {
        if (cancelled) return
        // Persist the fresh copy so the next boot starts from it too.
        tokenStore.save({ user })
        dispatch(loginAction(user))
      })
      .catch(() => {
        if (cancelled) return
        // The session is gone for good - the interceptor has already tried to
        // refresh it. Drop the local state rather than showing a signed-in
        // shell that cannot load anything.
        tokenStore.clear()
        dispatch(logoutAction())
      })

    return () => {
      cancelled = true
    }
    // Runs once per sign-in transition, not on every render.
  }, [dispatch, isAuthenticated])
}
