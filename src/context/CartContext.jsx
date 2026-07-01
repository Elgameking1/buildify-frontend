import { useCallback, useEffect, useMemo, useState } from 'react'
import { materials } from '../constants/materialsData'
import { CartContext } from './cartContextValue'

const initialCartItems = [
  { productId: 'premium-portland-cement', quantity: 12 },
  { productId: 'treated-timber-planks', quantity: 6 },
]

function hydrateCartItems(items) {
  return items
    .map((item) => {
      const product = materials.find((material) => material.id === item.productId)

      return product ? { ...item, product } : null
    })
    .filter(Boolean)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => hydrateCartItems(initialCartItems))
  const [lastAddedId, setLastAddedId] = useState(null)

  useEffect(() => {
    if (!lastAddedId) {
      return undefined
    }

    const timeout = window.setTimeout(() => setLastAddedId(null), 1400)

    return () => window.clearTimeout(timeout)
  }, [lastAddedId])

  const addItem = useCallback((product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        )
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stock),
        },
      ]
    })
    setLastAddedId(product.id)
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.min(Math.max(quantity, 1), item.product.stock),
            }
          : item,
      ),
    )
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    )
  }, [])

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
