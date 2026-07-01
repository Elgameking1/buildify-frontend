function ProductCard({ product }) {
  return (
    <article className="surface-panel overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      <div className="h-36 bg-secondary p-4">
        <div className="h-full rounded-control border border-white/10 bg-white/10">
          <div className="construction-stripe h-3 rounded-t-control" />
        </div>
      </div>
      <div className="grid gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent">
            {product.category}
          </span>
          <span className="text-xs font-bold text-primary-700">{product.badge}</span>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-bold text-secondary">{product.name}</h3>
          <p className="text-sm text-steel">{product.unit}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-secondary">{product.price}</span>
          <button type="button" className="btn-secondary">
            View
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
