import { Link } from 'react-router-dom'
import { FiPackage, FiTruck } from 'react-icons/fi'
import { materialImage } from '../constants/materialImages'

function ProductCard({ product }) {
  const price =
    typeof product.price === 'number'
      ? `GH₵${new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 0,
        }).format(product.price)}`
      : product.price

  const availabilityTone =
    product.availability === 'Low Stock'
      ? 'bg-primary-50 text-primary-700'
      : product.availability === 'Preorder'
        ? 'bg-secondary-100 text-secondary-700'
        : 'bg-accent-50 text-accent'

  return (
    <article className="surface-panel overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      <img
        src={materialImage(product)}
        alt={product.name}
        className="h-40 w-full bg-secondary object-cover"
        loading="lazy"
      />
      <div className="grid gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent">
            {product.category}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              product.availability ? availabilityTone : 'text-primary-700'
            }`}
          >
            {product.availability ?? product.badge}
          </span>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-bold text-secondary">{product.name}</h3>
          <p className="text-sm text-steel">{product.unit}</p>
          {product.supplier || product.delivery ? (
            <div className="grid gap-2 text-sm text-steel">
              {product.supplier ? (
                <span className="inline-flex items-center gap-2">
                  <FiPackage className="text-primary" aria-hidden="true" />
                  {product.supplier}
                </span>
              ) : null}
              {product.delivery ? (
                <span className="inline-flex items-center gap-2">
                  <FiTruck className="text-primary" aria-hidden="true" />
                  {product.delivery}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-secondary">{price}</span>
          <Link to={`/materials/${product.id}`} className="btn-secondary">
            View
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
