import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: true,
  role: 'client',
  user: {
    id: 'client-nana-adjei',
    name: 'Nana Adjei',
    email: 'nana@example.com',
    company: 'Adjei Developments',
  },
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true
      state.user = action.payload
      state.role = action.payload.role ?? state.role
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.role = null
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload }
    },
  },
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
