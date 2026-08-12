import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

/**
 * Redux holds one thing: who is signed in.
 *
 * Everything else that used to live here is gone for a reason. The cart is
 * server-side and cached by react-query, so a second copy in Redux would only
 * be a source of drift. The products and workers slices held filter state that
 * no component ever read - the pages own their own filters, which is where
 * page-local state belongs.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
