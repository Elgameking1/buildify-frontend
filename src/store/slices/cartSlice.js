import { createSlice } from '@reduxjs/toolkit'
import { materials } from '../../constants/materialsData'

const initialItems = [
  { productId: 'premium-portland-cement', quantity: 12 },
  { productId: 'treated-timber-planks', quantity: 6 },
]

function hydrateItems(items) {
  return items
    .map((item) => {
      const product = materials.find((material) => material.id === item.productId)

      return product ? { ...item, product } : null
    })
    .filter(Boolean)
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: hydrateItems(initialItems),
    lastAddedId: null,
  },
  reducers: {
    addItem(state, action) {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find((item) => item.product.id === product.id)

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + quantity,
          product.stock,
        )
      } else {
        state.items.push({
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stock),
        })
      }

      state.lastAddedId = product.id
    },
    clearLastAdded(state) {
      state.lastAddedId = null
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload
      const item = state.items.find((cartItem) => cartItem.product.id === productId)

      if (item) {
        item.quantity = Math.min(Math.max(quantity, 1), item.product.stock)
      }
    },
  },
})

export const { addItem, clearLastAdded, removeItem, updateQuantity } =
  cartSlice.actions
export default cartSlice.reducer
