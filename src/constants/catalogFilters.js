/**
 * Filter and sort options for the catalogue.
 *
 * These are interface configuration, not data: the price bands are the ones the
 * dropdown offers, and each sort value is a `sort` the API actually accepts
 * (see the Literal on GET /products). Anything describing real products comes
 * from the API.
 */

export const priceRanges = [
  { label: 'All prices', value: 'all' },
  { label: 'Under GH₵50', value: 'under-50', min: 0, max: 50 },
  { label: 'GH₵50 - GH₵150', value: '50-150', min: 50, max: 150 },
  { label: 'Over GH₵150', value: 'over-150', min: 150 },
]

// `value` is sent straight through as the API's `sort` parameter. Inventing a
// value here that the backend does not list is a 422 on every request, which is
// exactly what "Name: A to Z" used to do by sending `name_asc`.
export const sortOptions = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A to Z', value: 'name' },
]

export const workerSortOptions = [
  { label: 'Highest rated', value: 'rating' },
  { label: 'Most experienced', value: 'experience' },
  { label: 'Lowest day rate', value: 'rate_asc' },
  { label: 'Newest profiles', value: 'newest' },
]

export const ratingOptions = [
  { label: 'All ratings', value: 'all' },
  { label: '3+ stars', value: '3' },
  { label: '4+ stars', value: '4' },
  { label: '4.5+ stars', value: '4.5' },
]

export const availabilityOptions = [
  { label: 'Any availability', value: 'all' },
  { label: 'Available now', value: 'AVAILABLE' },
  { label: 'Currently busy', value: 'BUSY' },
  { label: 'Unavailable', value: 'UNAVAILABLE' },
]
