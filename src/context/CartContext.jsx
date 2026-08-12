import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { apiErrorMessage } from '../services/api'
import { cartService } from '../services/cartService'
import { CartContext } from './cartContextValue'

/**
 * The cart now lives on the server.
 *
 * The context API is unchanged - `addItem(product, qty)`,
 * `updateQuantity(productId, qty)`, `removeItem(productId)`, plus `items`,
 * `subtotal`, `totalQuantity` and `lastAddedId` - so Cart.jsx and
 * MaterialDetails.jsx did not need rewriting. Internally every call now hits
 * /cart and the query cache is the single source of truth.
 *
 * Two details worth knowing:
 *  - the backend keys line operations on the cart *line* id, not the product
 *    id, so the product id callers pass is resolved to a line id here;
 *  - the cart requires a signed-in CLIENT, so for guests this falls back to an
 *    empty cart rather than firing requests that are bound to 401/403.
 */
export function CartProvider({ children }) {
  const queryClient = useQueryClient()
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const [lastAddedId, setLastAddedId] = useState(null)

  // Only a CLIENT has a cart; a vendor or worker browsing the store should not
  // trigger errors on every page load.
  const canUseCart = isAuthenticated && (role === 'client' || role === 'admin')

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: canUseCart,
    staleTime: 0,
  })

  const items = useMemo(
    () => (canUseCart ? (cart?.items ?? []) : []),
    [cart, canUseCart],
  )

  useEffect(() => {
    if (!lastAddedId) return undefined
    const timeout = window.setTimeout(() => setLastAddedId(null), 1400)
    return () => window.clearTimeout(timeout)
  }, [lastAddedId])

  const onError = useCallback((error) => {
    toast.error(apiErrorMessage(error, 'Could not update your cart.'))
  }, [])

  const writeCart = useCallback(
    (updated) => queryClient.setQueryData(['cart'], updated),
    [queryClient],
  )

  const addMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: writeCart,
    onError,
  })

  const updateMutation = useMutation({
    mutationFn: ({ lineId, quantity }) => cartService.updateQuantity(lineId, quantity),
    onSuccess: writeCart,
    onError,
  })

  const removeMutation = useMutation({
    mutationFn: (lineId) => cartService.removeItem(lineId),
    onSuccess: writeCart,
    onError,
  })

  const lineIdFor = useCallback(
    (productId) => items.find((item) => item.productId === productId)?.lineId,
    [items],
  )

  const addItem = useCallback(
    (product, quantity = 1) => {
      if (!isAuthenticated) {
        toast.error('Sign in to add items to your cart.')
        return
      }
      if (!canUseCart) {
        toast.error('Only client accounts can place orders.')
        return
      }
      addMutation.mutate(
        { productId: product.id, quantity },
        {
          onSuccess: () => {
            setLastAddedId(product.id)
            // Confirmed only once the server has accepted the line - it can
            // still refuse on stock, and saying "added" before then would be a
            // lie the cart page then contradicts.
            toast.success(
              `${quantity} × ${product.name} added to cart`,
            )
          },
        },
      )
    },
    [addMutation, canUseCart, isAuthenticated],
  )

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const lineId = lineIdFor(productId)
      if (!lineId) return
      updateMutation.mutate({ lineId, quantity: Math.max(1, quantity) })
    },
    [lineIdFor, updateMutation],
  )

  const removeItem = useCallback(
    (productId) => {
      const lineId = lineIdFor(productId)
      if (!lineId) return
      removeMutation.mutate(lineId)
    },
    [lineIdFor, removeMutation],
  )

  // Trust the server's totals rather than recomputing from the line items - it
  // is the side that owns pricing.
  const subtotal = canUseCart ? (cart?.subtotal ?? 0) : 0
  const totalQuantity = canUseCart ? (cart?.totalQuantity ?? 0) : 0

  const value = useMemo(
    () => ({
      addItem,
      items,
      lastAddedId,
      removeItem,
      subtotal,
      totalQuantity,
      updateQuantity,
      isPending:
        addMutation.isPending || updateMutation.isPending || removeMutation.isPending,
    }),
    [
      addItem,
      items,
      lastAddedId,
      removeItem,
      subtotal,
      totalQuantity,
      updateQuantity,
      addMutation.isPending,
      updateMutation.isPending,
      removeMutation.isPending,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
