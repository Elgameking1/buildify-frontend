import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
} from 'react-icons/fi'
import { materialImage } from '../constants/materialImages'
import { useCart } from '../hooks/useCart'
import { apiErrorMessage } from '../services/api'
import { ordersService } from '../services/ordersService'

function formatCedi(amount) {
  return `GH₵${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount)}`
}

function QuantityControl({ item, onDecrease, onIncrease }) {
  return (
    <div className="flex w-fit items-center overflow-hidden rounded-control border border-concrete">
      <button
        type="button"
        className="grid size-10 place-items-center text-secondary transition-colors hover:bg-secondary-50 disabled:opacity-40"
        disabled={item.quantity === 1}
        onClick={onDecrease}
      >
        <span className="sr-only">Decrease quantity</span>
        <FiMinus aria-hidden="true" />
      </button>
      <span className="grid size-10 place-items-center border-x border-concrete font-bold">
        {item.quantity}
      </span>
      <button
        type="button"
        className="grid size-10 place-items-center text-secondary transition-colors hover:bg-secondary-50 disabled:opacity-40"
        disabled={item.quantity >= item.product.stock}
        onClick={onIncrease}
      >
        <span className="sr-only">Increase quantity</span>
        <FiPlus aria-hidden="true" />
      </button>
    </div>
  )
}

function Cart() {
  const {
    items,
    lastAddedId,
    removeItem,
    subtotal,
    totalQuantity,
    updateQuantity,
  } = useCart()

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  const checkout = useMutation({
    mutationFn: ordersService.placeOrder,
    onSuccess: (order) => {
      // Checkout empties the cart server-side, so refetch rather than guess.
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(`Order ${order.reference} placed`)
      // Straight to the order history, where the new order and each vendor's
      // progress on it are visible.
      navigate('/orders')
    },
    onError: (error) => {
      // A 409 here is the backend refusing to oversell - the stock ran out
      // between browsing and checking out.
      toast.error(apiErrorMessage(error, 'Could not place your order.'))
    },
  })

  const handleCheckout = (event) => {
    event.preventDefault()
    checkout.mutate({ deliveryAddress, contactPhone })
  }

  const isPlacingOrder = checkout.isPending
  // There is no delivery fee to show. This used to add a flat GH₵25 "estimated
  // delivery" to the total, which no part of the system charges - the order the
  // backend creates is the subtotal, and delivery is settled with each vendor
  // directly. A total the invoice disagrees with is worse than no total.
  const orderTotal = subtotal

  const getItemClassName = (productId) =>
    `surface-panel p-4 transition-all duration-300 ${
      lastAddedId === productId
        ? 'animate-pulse border-primary ring-2 ring-primary/30'
        : ''
    }`

  return (
    <main className="w-full">
      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-4">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Shopping Cart
          </span>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3">
              <h1 className="text-balance text-4xl font-black md:text-5xl">
                Review your material order.
              </h1>
              <p className="max-w-2xl leading-7 text-secondary-100">
                Adjust quantities, remove products, and confirm the subtotal
                before placing your order. Stock is re-checked at checkout.
              </p>
            </div>
            <div className="surface-panel grid gap-1 p-5 text-secondary">
              <span className="text-3xl font-black">{totalQuantity}</span>
              <span className="text-sm font-semibold text-steel">
                Items selected
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing lg:grid-cols-[1fr_22rem] lg:items-start">
        {items.length > 0 ? (
          <div className="grid gap-5">
            {lastAddedId ? (
              <div className="surface-panel flex items-center gap-3 border-primary bg-primary-50 p-4 text-sm font-semibold text-secondary">
                <FiShoppingBag className="text-primary-700" aria-hidden="true" />
                Product added to cart.
              </div>
            ) : null}

            <div className="hidden overflow-hidden rounded-panel border border-concrete bg-white shadow-construction md:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-secondary-50 text-sm text-secondary">
                  <tr>
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold">Quantity</th>
                    <th className="p-4 font-bold">Total</th>
                    <th className="p-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.product.id}
                      className={`border-t border-concrete transition-all duration-300 ${
                        lastAddedId === item.product.id
                          ? 'animate-pulse bg-primary-50'
                          : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={materialImage(item.product)}
                            alt=""
                            className="size-16 shrink-0 rounded-control bg-secondary object-cover"
                            loading="lazy"
                          />
                          <div>
                            <Link
                              to={`/materials/${item.product.id}`}
                              className="font-bold text-secondary hover:text-primary-700"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-steel">
                              {item.product.supplier}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-secondary">
                        {formatCedi(item.product.price)}
                      </td>
                      <td className="p-4">
                        <QuantityControl
                          item={item}
                          onDecrease={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          onIncrease={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        />
                      </td>
                      <td className="p-4 font-black text-secondary">
                        {formatCedi(item.product.price * item.quantity)}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          className="btn text-steel hover:text-secondary"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <FiTrash2 aria-hidden="true" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {items.map((item) => (
                <article
                  key={item.product.id}
                  className={getItemClassName(item.product.id)}
                >
                  <div className="grid gap-4">
                    <div className="flex gap-4">
                      <img
                        src={materialImage(item.product)}
                        alt=""
                        className="size-20 shrink-0 rounded-control bg-secondary object-cover"
                        loading="lazy"
                      />
                      <div className="grid gap-1">
                        <Link
                          to={`/materials/${item.product.id}`}
                          className="font-bold text-secondary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-steel">
                          {item.product.supplier}
                        </p>
                        <p className="text-sm font-bold text-primary-700">
                          {formatCedi(item.product.price)} {item.product.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <QuantityControl
                        item={item}
                        onDecrease={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        onIncrease={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      />
                      <span className="text-xl font-black text-secondary">
                        {formatCedi(item.product.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn w-full text-steel hover:text-secondary"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <FiTrash2 aria-hidden="true" />
                      Remove product
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="surface-panel grid gap-5 p-8 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-50 text-primary-700">
              <FiShoppingBag size={28} aria-hidden="true" />
            </div>
            <div className="grid gap-2">
              <h2 className="text-3xl font-black text-secondary">
                Your cart is empty
              </h2>
              <p className="text-steel">
                Add materials from the catalogue to start an order.
              </p>
            </div>
            <Link to="/materials" className="btn-primary mx-auto">
              Browse materials
            </Link>
          </div>
        )}

        <aside className="surface-panel sticky top-24 grid gap-5 p-6">
          <div className="grid gap-2">
            <h2 className="text-2xl font-black text-secondary">
              Order Summary
            </h2>
            <p className="text-sm text-steel">
              Delivery is arranged directly with each supplier.
            </p>
          </div>

          <div className="grid gap-3 border-y border-concrete py-5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-steel">Subtotal</span>
              <span className="font-bold text-secondary">
                {formatCedi(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-steel">
                <FiTruck aria-hidden="true" />
                Delivery
              </span>
              <span className="font-semibold text-steel">
                Quoted by each vendor
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-lg font-bold text-secondary">Total</span>
            <span className="text-3xl font-black text-secondary">
              {formatCedi(orderTotal)}
            </span>
          </div>

          <form className="grid gap-3" onSubmit={handleCheckout}>
            <label className="grid gap-1">
              <span className="form-label">Delivery address</span>
              <input
                className="form-input"
                required
                minLength={5}
                placeholder="12 Independence Avenue, Accra"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="form-label">Contact phone</span>
              <input
                className="form-input"
                required
                minLength={7}
                placeholder="0244000000"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
              />
            </label>
            <button
              type="submit"
              className="btn-primary min-h-12"
              disabled={isPlacingOrder || items.length === 0}
            >
              {isPlacingOrder ? 'Placing order…' : 'Place Order'}
            </button>
          </form>
          <Link to="/materials" className="btn-secondary">
            Add more materials
          </Link>
        </aside>
      </section>
    </main>
  )
}

export default Cart
