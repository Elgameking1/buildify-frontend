import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addItem as addCartItem,
  clearLastAdded,
  removeItem as removeCartItem,
  updateQuantity as updateCartQuantity,
} from '../store/slices/cartSlice'
import { CartContext } from './cartContextValue'

export function CartProvider({ children }) {
  const dispatch = useDispatch()
  const { items, lastAddedId } = useSelector((state) => state.cart)

  useEffect(() => {
    if (!lastAddedId) {
      return undefined
    }

    const timeout = window.setTimeout(() => dispatch(clearLastAdded()), 1400)

    return () => window.clearTimeout(timeout)
  }, [dispatch, lastAddedId])

  const addItem = useCallback(
    (product, quantity = 1) => {
      dispatch(addCartItem({ product, quantity }))
    },
    [dispatch],
  )

  const updateQuantity = useCallback(
    (productId, quantity) => {
      dispatch(updateCartQuantity({ productId, quantity }))
    },
    [dispatch],
  )

  const removeItem = useCallback(
    (productId) => {
      dispatch(removeCartItem(productId))
    },
    [dispatch],
  )

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    [items],
  )

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      addItem,
      items,
      lastAddedId,
      removeItem,
      subtotal,
      totalQuantity,
      updateQuantity,
    }),
    [
      addItem,
      items,
      lastAddedId,
      removeItem,
      subtotal,
      totalQuantity,
      updateQuantity,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
