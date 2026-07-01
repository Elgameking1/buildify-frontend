import { createSlice } from '@reduxjs/toolkit'
import { materials } from '../../constants/materialsData'

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: materials,
    selectedProductId: null,
    status: 'idle',
  },
  reducers: {
    setProducts(state, action) {
      state.items = action.payload
    },
    setSelectedProduct(state, action) {
      state.selectedProductId = action.payload
    },
    updateProductStock(state, action) {
      const product = state.items.find((item) => item.id === action.payload.id)

      if (product) {
        product.stock = action.payload.stock
      }
    },
  },
})

export const { setProducts, setSelectedProduct, updateProductStock } =
  productsSlice.actions
export default productsSlice.reducer
