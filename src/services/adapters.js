/**
 * Translate backend payloads into the shapes the UI already renders.
 *
 * The components were built against the fixtures in src/constants, which use
 * different names and richer display strings than the API returns (`supplier`
 * vs `vendor.business_name`, `"In Stock"` vs `stock_qty`, `"GH₵180/day"` vs
 * `base_rate`). Mapping here means the pages, cards and detail views did not
 * have to be rewritten around a new data model - and if the API changes, this
 * is the one file that moves.
 */

const UNIT_LABELS = {
  BAG: 'per 50kg bag',
  TON: 'per ton',
  PIECE: 'per piece',
  METRE: 'per metre',
  LITRE: 'per litre',
  BUNDLE: 'per bundle',
}

const AVAILABILITY_LABELS = {
  AVAILABLE: 'Available now',
  BUSY: 'Currently busy',
  UNAVAILABLE: 'Unavailable',
}

const LOW_STOCK_THRESHOLD = 20

function stockLabel(product) {
  if (product.status === 'OUT_OF_STOCK' || product.stock_qty === 0) {
    return 'Out of Stock'
  }
  if (product.stock_qty <= LOW_STOCK_THRESHOLD) {
    return 'Low Stock'
  }
  return 'In Stock'
}

/** Backend ProductRead -> the product shape ProductCard/MaterialDetails expect. */
export function adaptProduct(product) {
  if (!product) return null

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category?.name ?? 'Uncategorised',
    categoryId: product.category?.id ?? null,
    // The API sends DECIMAL as a string to avoid float drift; the UI formats
    // numbers, so convert once here rather than in every component.
    price: Number(product.price),
    unit: UNIT_LABELS[product.unit] ?? `per ${String(product.unit).toLowerCase()}`,
    rawUnit: product.unit,
    availability: stockLabel(product),
    supplier: product.vendor?.business_name ?? 'Unknown supplier',
    vendorId: product.vendor?.id ?? null,
    verifiedSupplier: Boolean(product.vendor?.is_verified),
    stock: product.stock_qty,
    delivery: product.vendor?.location
      ? `Pickup from ${product.vendor.location}`
      : 'Contact supplier for delivery',
    description: product.description,
    // Real image URLs only. This used to substitute caption strings ("Product
    // image coming soon") when a product had no images, which the detail page
    // then rendered as a heading - so once images did exist, it printed the URL
    // as text. An empty array lets the page draw its own placeholder instead.
    // `url` is null until R2 is configured, so those entries are dropped too.
    gallery: (product.images ?? [])
      .filter((image) => image.url)
      .sort((first, second) => first.sort_order - second.sort_order)
      .map((image) => image.url),
    status: product.status,
  }
}

/** Backend WorkerSummary (list view) -> the worker shape WorkerCard expects. */
export function adaptWorkerSummary(worker) {
  if (!worker) return null

  const skills = worker.skills ?? []

  return {
    id: worker.user_id,
    name: worker.full_name,
    role: worker.headline ?? skills[0] ?? 'Skilled worker',
    profession: skills[0] ?? 'General',
    rating: Number(worker.avg_rating ?? 0),
    ratingCount: worker.rating_count ?? 0,
    projects: `${worker.rating_count ?? 0} ${
      worker.rating_count === 1 ? 'review' : 'reviews'
    }`,
    location: [worker.city, worker.region].filter(Boolean).join(', ') || 'Ghana',
    availability: AVAILABILITY_LABELS[worker.availability_status] ?? 'Availability unknown',
    availabilityStatus: worker.availability_status,
    rate: worker.base_rate ? `GH₵${Number(worker.base_rate).toFixed(0)}/day` : null,
    experience: `${worker.years_experience ?? 0} years`,
    skills,
    photoUrl: worker.photo_url ?? null,
  }
}

/** Backend WorkerRead (detail view) + its reviews -> WorkerDetails shape. */
export function adaptWorkerDetail(worker, reviews = []) {
  if (!worker) return null

  const skills = (worker.skills ?? []).map((entry) => entry.skill?.name).filter(Boolean)

  return {
    id: worker.user?.id,
    name: worker.user?.full_name ?? 'Unknown worker',
    role: worker.headline ?? skills[0] ?? 'Skilled worker',
    profession: skills[0] ?? 'General',
    rating: Number(worker.avg_rating ?? 0),
    ratingCount: worker.rating_count ?? 0,
    projects: `${worker.rating_count ?? 0} ${
      worker.rating_count === 1 ? 'review' : 'reviews'
    }`,
    location: [worker.city, worker.region].filter(Boolean).join(', ') || 'Ghana',
    availability: AVAILABILITY_LABELS[worker.availability_status] ?? 'Availability unknown',
    availabilityStatus: worker.availability_status,
    rate: worker.base_rate ? `GH₵${Number(worker.base_rate).toFixed(0)}/day` : null,
    experience: `${worker.years_experience ?? 0} years`,
    bio: worker.bio ?? 'This worker has not added a bio yet.',
    skills,
    // The API has no "completed jobs" concept - the closest honest signal is
    // the jobs that produced reviews, so derive it rather than inventing data.
    completedJobs: reviews.map((review) => review.job_title).filter(Boolean),
    reviews: reviews.map(adaptReview),
    portfolio: worker.portfolio_urls ?? [],
  }
}

export function adaptReview(review) {
  return {
    id: String(review.id),
    name: review.client?.full_name ?? 'Client',
    rating: review.rating,
    comment: review.comment ?? '',
    jobTitle: review.job_title,
  }
}

/** Backend CartRead -> the {product, quantity} items the cart UI walks. */
export function adaptCart(cart) {
  if (!cart) return { id: null, items: [], subtotal: 0, totalQuantity: 0 }

  return {
    id: cart.id,
    subtotal: Number(cart.subtotal ?? 0),
    totalQuantity: cart.item_count ?? 0,
    items: (cart.items ?? []).map((item) => ({
      // The line id, needed to PATCH/DELETE this row - the backend keys cart
      // operations on the line, not on the product.
      lineId: item.id,
      productId: item.product.id,
      quantity: item.quantity,
      lineTotal: Number(item.line_total ?? 0),
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        unit: UNIT_LABELS[item.product.unit] ?? item.product.unit,
        stock: item.product.stock_qty,
        supplier: item.product.vendor_name,
        image: item.product.image_url,
        category: '',
        availability: item.product.stock_qty > 0 ? 'In Stock' : 'Out of Stock',
      },
    })),
  }
}

export function adaptOrder(order) {
  if (!order) return null
  return {
    id: order.id,
    reference: order.order_number,
    status: order.status,
    subtotal: Number(order.subtotal ?? 0),
    placedAt: order.placed_at,
    deliveryAddress: order.delivery_address,
    contactPhone: order.contact_phone,
    items: (order.items ?? []).map((item) => ({
      id: item.id,
      productId: item.product_id,
      name: item.product_name,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      lineTotal: Number(item.line_total),
      supplier: item.vendor_name,
      status: item.vendor_status,
    })),
  }
}

export function adaptUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    phone: user.phone ?? '',
    // The UI uses lower-case role names ('client'), the API uses 'CLIENT'.
    role: String(user.role ?? '').toLowerCase(),
    region: user.region ?? '',
    city: user.city ?? '',
  }
}

export function adaptJob(job) {
  if (!job) return null
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    status: job.status,
    budget: job.budget ? Number(job.budget) : null,
    client: job.client?.full_name,
    worker: job.worker?.full_name,
    workerId: job.worker?.id,
    createdAt: job.created_at,
    hasReview: job.has_review,
  }
}
