import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import productsReducer from './slices/productsSlice'
import workersReducer from './slices/workersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    workers: workersReducer,
  },
})
