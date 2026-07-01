import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiMinus,
  FiPackage,
  FiPlus,
  FiShoppingCart,
  FiTruck,
} from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { materials } from '../constants/materialsData'
import { useCart } from '../hooks/useCart'

function formatCedi(amount) {
  return `GH₵${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount)}`
}

function MaterialDetails() {
  const { id } = useParams()
  const product = materials.find((material) => material.id === id)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cartMessage, setCartMessage] = useState('')
  const { addItem } = useCart()

  const relatedProducts = useMemo(() => {
    if (!product) {
      return []
    }

    const sameCategory = materials.filter(
      (material) =>
        material.category === product.category && material.id !== product.id,
    )
    const fallback = materials.filter((material) => material.id !== product.id)

    return (sameCategory.length > 0 ? sameCategory : fallback).slice(0, 3)
  }, [product])

  if (!product) {
    return (
      <main className="page-container grid gap-6 section-spacing">
        <Link to="/materials" className="btn w-fit">
          <FiArrowLeft aria-hidden="true" />
          Back to materials
        </Link>
        <div className="surface-panel grid gap-3 p-8 text-center">
          <h1 className="text-3xl font-black text-secondary">
            Product not found
          </h1>
          <p className="text-steel">
            The mock product you are looking for is not available.
          </p>
        </div>
      </main>
    )
  }

  const selectedImage = product.gallery[selectedImageIndex]
  const canIncreaseQuantity = quantity < product.stock

  return (
    <main>
      <section className="page-container grid gap-8 section-spacing">
        <Link to="/materials" className="btn w-fit">
          <FiArrowLeft aria-hidden="true" />
          Back to materials
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="grid gap-4">
            <div className="surface-panel overflow-hidden">
              <div className="grid min-h-96 place-items-center bg-secondary p-8 text-center text-white">
                <div className="grid gap-5">
                  <div className="mx-auto size-32 rounded-panel border border-white/10 bg-white/10 p-4">
                    <div className="construction-stripe h-full rounded-control" />
                  </div>
                  <div className="grid gap-2">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                      {product.category}
                    </span>
                    <h2 className="text-3xl font-black">{selectedImage}</h2>
                    <p className="text-secondary-100">{product.name}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {product.gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`rounded-panel border p-3 text-left transition-colors ${
                    selectedImageIndex === index
                      ? 'border-primary bg-primary-50 text-secondary'
                      : 'border-concrete bg-white text-steel hover:border-primary'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <span className="block h-16 rounded-control bg-secondary p-2">
                    <span className="construction-stripe block h-full rounded-control" />
                  </span>
                  <span className="mt-3 block text-sm font-bold">{image}</span>
                </button>
              ))}
            </div>
          </div>

          <article className="surface-panel grid gap-6 p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent">
                {product.category}
              </span>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                {product.availability}
              </span>
            </div>

            <div className="grid gap-3">
              <h1 className="text-balance text-4xl font-black text-secondary md:text-5xl">
                {product.name}
              </h1>
              <p className="leading-7 text-steel">{product.description}</p>
            </div>

            <div className="flex flex-col gap-2 border-y border-concrete py-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-steel">{product.unit}</p>
                <p className="text-4xl font-black text-secondary">
                  {formatCedi(product.price)}
                </p>
              </div>
              <p className="font-bold text-secondary">
                {product.stock} units in stock
              </p>
            </div>

            <div className="grid gap-3 text-sm text-steel">
              <span className="inline-flex items-center gap-2">
                <FiPackage className="text-primary" aria-hidden="true" />
                Vendor: {product.supplier}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiTruck className="text-primary" aria-hidden="true" />
                {product.delivery}
              </span>
            </div>

            <div className="grid gap-3">
              <span className="form-label">Quantity</span>
              <div className="flex w-fit items-center overflow-hidden rounded-control border border-concrete">
                <button
                  type="button"
                  className="grid size-11 place-items-center text-secondary transition-colors hover:bg-secondary-50 disabled:opacity-40"
                  disabled={quantity === 1}
                  onClick={() =>
                    setQuantity((currentQuantity) =>
                      Math.max(1, currentQuantity - 1),
                    )
                  }
                >
                  <span className="sr-only">Decrease quantity</span>
                  <FiMinus aria-hidden="true" />
                </button>
                <span className="grid size-11 place-items-center border-x border-concrete font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="grid size-11 place-items-center text-secondary transition-colors hover:bg-secondary-50 disabled:opacity-40"
                  disabled={!canIncreaseQuantity}
                  onClick={() =>
                    setQuantity((currentQuantity) =>
                      Math.min(product.stock, currentQuantity + 1),
                    )
                  }
                >
                  <span className="sr-only">Increase quantity</span>
                  <FiPlus aria-hidden="true" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary min-h-12"
              onClick={() => {
                addItem(product, quantity)
                setCartMessage(`${quantity} ${product.name} added to cart.`)
              }}
            >
              <FiShoppingCart aria-hidden="true" />
              Add to Cart
            </button>

            {cartMessage ? (
              <p className="rounded-control bg-accent-50 px-4 py-3 text-sm font-semibold text-accent">
                {cartMessage}
              </p>
            ) : null}
          </article>
        </div>
      </section>

      <section className="bg-secondary-50 section-spacing">
        <div className="page-container grid gap-10">
          <SectionHeader
            eyebrow="Related Products"
            title="Keep comparing materials for the same project."
            description="Mock recommendations based on category first, then other available materials."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default MaterialDetails
