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
import { useQuery } from '@tanstack/react-query'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import {
  materialImageCredit,
  materialImages,
} from '../constants/materialImages'
import { useCart } from '../hooks/useCart'
import { productsService } from '../services/productsService'

function formatCedi(amount) {
  return `GH₵${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount)}`
}

function MaterialDetails() {
  const { id } = useParams()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem, isPending } = useCart()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getProductById(id),
    enabled: Boolean(id),
    retry: false,
  })

  // "Related" is the rest of the same category, fetched once the product is
  // known so we have a category id to filter on.
  const { data: related } = useQuery({
    queryKey: ['product-related', product?.categoryId, product?.id],
    queryFn: () =>
      productsService.getProducts({ categoryId: product.categoryId, size: 4 }),
    enabled: Boolean(product?.categoryId),
  })

  const relatedProducts = useMemo(
    () => (related?.items ?? []).filter((item) => item.id !== product?.id).slice(0, 3),
    [related, product],
  )

  if (isLoading) {
    return (
      <main className="page-container grid gap-6 section-spacing">
        <div className="surface-panel h-96 animate-pulse bg-concrete/40" />
      </main>
    )
  }

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
            This listing may have been archived by the vendor, or the link may be
            out of date.
          </p>
        </div>
      </main>
    )
  }

  // The vendor's uploads if there are any, otherwise a library photo of the
  // material - see src/constants/materialImages.js.
  const gallery = materialImages(product)
  const selectedImage = gallery[selectedImageIndex] ?? gallery[0]
  const credit = materialImageCredit(selectedImage)
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
              <img
                src={selectedImage}
                alt={product.name}
                className="h-96 w-full bg-ink object-cover"
                loading="lazy"
              />
              {credit ? (
                // Not the vendor's stock, and the licences these photos carry
                // require the credit - so say both, quietly.
                <p className="border-t border-concrete px-4 py-2 text-xs text-steel">
                  Library photo of this material, not the vendor's stock ·{' '}
                  <a
                    href={credit.source}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline hover:text-secondary"
                  >
                    {credit.title}
                  </a>{' '}
                  by {credit.author},{' '}
                  {credit.licenseUrl ? (
                    <a
                      href={credit.licenseUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline hover:text-secondary"
                    >
                      {credit.license}
                    </a>
                  ) : (
                    credit.license
                  )}
                </p>
              ) : null}
            </div>

            {gallery.length > 1 ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={`overflow-hidden rounded-panel border transition-colors ${
                      selectedImageIndex === index
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-concrete hover:border-primary'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <span className="sr-only">
                      Show image {index + 1} of {gallery.length}
                    </span>
                    <img
                      src={image}
                      alt=""
                      className="h-24 w-full bg-ink object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            ) : null}
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

            {/* Confirmation comes from the cart itself, which is the only side
                that knows whether the line was actually accepted - the button
                used to claim success even when the request was refused. */}
            <button
              type="button"
              className="btn-primary min-h-12"
              disabled={product.stock === 0 || isPending}
              onClick={() => addItem(product, quantity)}
            >
              <FiShoppingCart aria-hidden="true" />
              {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
            </button>
          </article>
        </div>
      </section>

      <section className="bg-secondary-50 section-spacing">
        <div className="page-container grid gap-10">
          <SectionHeader
            eyebrow="Related Products"
            title="Keep comparing materials for the same project."
            description="Other listings in the same category."
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
