import { createSlice } from '@reduxjs/toolkit'
import { tokenStore } from '../../services/tokenStore'

/**
 * Auth state, rehydrated from localStorage on boot.
 *
 * This used to start with a hard-coded signed-in "Nana Adjei". The initial
 * state is now whatever the token store holds, so a page refresh keeps you
 * signed in and a first visit correctly shows you as signed out.
 */
const storedUser = tokenStore.getUser()

const initialState = {
  isAuthenticated: Boolean(tokenStore.getAccessToken()),
  role: storedUser?.role ?? null,
  user: storedUser,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true
      state.user = action.payload
      state.role = action.payload?.role ?? null
      state.status = 'succeeded'
      state.error = null
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.role = null
      state.status = 'idle'
      state.error = null
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload }
    },
    setAuthError(state, action) {
      state.error = action.payload
      state.status = action.payload ? 'failed' : state.status
    },
  },
})

export const { login, logout, updateProfile, setAuthError } = authSlice.actions
export default authSlice.reducer
