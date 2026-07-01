import { useMemo, useState } from 'react'
import { FiSearch, FiSliders } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'

const materials = [
  {
    id: 'premium-portland-cement',
    name: 'Premium Portland Cement',
    category: 'Concrete',
    price: 14,
    unit: 'per 50kg bag',
    availability: 'In Stock',
    supplier: 'Accra Build Supply',
    delivery: 'Same-day dispatch',
  },
  {
    id: 'high-tensile-rebar-bundle',
    name: 'High-Tensile Rebar Bundle',
    category: 'Steel',
    price: 420,
    unit: 'per bundle',
    availability: 'In Stock',
    supplier: 'Tema Steel Works',
    delivery: 'Delivery in 2 days',
  },
  {
    id: 'ready-mix-concrete',
    name: 'Ready-Mix Concrete C25',
    category: 'Concrete',
    price: 135,
    unit: 'per cubic meter',
    availability: 'Preorder',
    supplier: 'Metro Concrete',
    delivery: 'Scheduled delivery',
  },
  {
    id: 'treated-timber-planks',
    name: 'Treated Timber Planks',
    category: 'Timber',
    price: 32,
    unit: 'per plank',
    availability: 'Low Stock',
    supplier: 'Kumasi Timber Yard',
    delivery: 'Delivery in 3 days',
  },
  {
    id: 'ceramic-floor-tiles',
    name: 'Matte Ceramic Floor Tiles',
    category: 'Finishes',
    price: 28,
    unit: 'per box',
    availability: 'In Stock',
    supplier: 'Urban Finishings',
    delivery: 'Pickup available',
  },
  {
    id: 'electrical-cable-roll',
    name: 'Copper Electrical Cable Roll',
    category: 'Electrical',
    price: 76,
    unit: 'per 100m roll',
    availability: 'In Stock',
    supplier: 'PowerLine Depot',
    delivery: 'Delivery in 24 hours',
  },
  {
    id: 'roofing-sheets',
    name: 'Aluzinc Roofing Sheets',
    category: 'Roofing',
    price: 58,
    unit: 'per sheet',
    availability: 'Low Stock',
    supplier: 'North Ridge Roofing',
    delivery: 'Delivery in 2 days',
  },
  {
    id: 'site-safety-kit',
    name: 'Complete Site Safety Kit',
    category: 'Safety',
    price: 89,
    unit: 'per kit',
    availability: 'In Stock',
    supplier: 'SafeBuild Ghana',
    delivery: 'Same-day dispatch',
  },
]

const priceRanges = [
  { label: 'All prices', value: 'all' },
  { label: 'Under GH₵50', value: 'under-50', min: 0, max: 50 },
  { label: 'GH₵50 - GH₵150', value: '50-150', min: 50, max: 150 },
  { label: 'Over GH₵150', value: 'over-150', min: 150 },
]

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
]

function Materials() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  const categories = useMemo(
    () => ['all', ...new Set(materials.map((material) => material.category))],
    [],
  )

  const availabilityOptions = useMemo(
    () => [
      'all',
      ...new Set(materials.map((material) => material.availability)),
    ],
    [],
  )

  const filteredMaterials = useMemo(() => {
    const selectedRange = priceRanges.find((range) => range.value === priceRange)
    const query = searchTerm.trim().toLowerCase()

    return materials
      .filter((material) => {
        const matchesSearch =
          !query ||
          material.name.toLowerCase().includes(query) ||
          material.category.toLowerCase().includes(query) ||
          material.supplier.toLowerCase().includes(query)
        const matchesCategory =
          category === 'all' || material.category === category
        const matchesAvailability =
          availability === 'all' || material.availability === availability
        const matchesPrice =
          !selectedRange ||
          selectedRange.value === 'all' ||
          ((selectedRange.min === undefined ||
            material.price >= selectedRange.min) &&
            (selectedRange.max === undefined ||
              material.price < selectedRange.max))

        return (
          matchesSearch &&
          matchesCategory &&
          matchesAvailability &&
          matchesPrice
        )
      })
      .sort((first, second) => {
        if (sortBy === 'price-asc') {
          return first.price - second.price
        }

        if (sortBy === 'price-desc') {
          return second.price - first.price
        }

        if (sortBy === 'name-asc') {
          return first.name.localeCompare(second.name)
        }

        return 0
      })
  }, [availability, category, priceRange, searchTerm, sortBy])

  return (
    <main>
      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Materials Marketplace
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Source trusted building materials for every stage of work.
            </h1>
            <p className="max-w-2xl leading-7 text-secondary-100">
              Search mock supplier listings, filter by project need, compare
              pricing, and check availability before moving to details.
            </p>
          </div>
          <div className="surface-panel grid gap-4 p-5 text-secondary sm:grid-cols-3">
            <div>
              <span className="text-2xl font-black">8</span>
              <p className="text-sm text-steel">Materials listed</p>
            </div>
            <div>
              <span className="text-2xl font-black">6</span>
              <p className="text-sm text-steel">Categories</p>
            </div>
            <div>
              <span className="text-2xl font-black">24h</span>
              <p className="text-sm text-steel">Fastest dispatch</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing">
        <SectionHeader
          eyebrow="Browse Materials"
          title="Filter, sort, and compare supplier-ready mock inventory."
          description="These listings are sample data that can later connect to live stock and supplier APIs."
        />

        <div className="surface-panel grid gap-4 p-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <label className="grid gap-2">
            <span className="form-label">Search</span>
            <span className="flex items-center gap-3 rounded-control border border-concrete bg-white px-3 py-2 text-steel focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                className="w-full bg-transparent text-secondary outline-none placeholder:text-steel"
                placeholder="Search by material, category, or supplier"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </span>
          </label>

          <label className="grid gap-2">
            <span className="form-label">Sort</span>
            <select
              className="form-input"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 lg:col-span-2">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
              <FiSliders aria-hidden="true" />
              Filters
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="form-label">Category</span>
                <select
                  className="form-input"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All categories' : option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="form-label">Price</span>
                <select
                  className="form-input"
                  value={priceRange}
                  onChange={(event) => setPriceRange(event.target.value)}
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="form-label">Availability</span>
                <select
                  className="form-input"
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value)}
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All availability' : option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-secondary">
            Showing {filteredMaterials.length} of {materials.length} materials
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setSearchTerm('')
              setCategory('all')
              setPriceRange('all')
              setAvailability('all')
              setSortBy('featured')
            }}
          >
            Reset filters
          </button>
        </div>

        {filteredMaterials.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <ProductCard key={material.id} product={material} />
            ))}
          </div>
        ) : (
          <div className="surface-panel grid gap-3 p-8 text-center">
            <h2 className="text-2xl font-black text-secondary">
              No materials found
            </h2>
            <p className="text-steel">
              Try changing the search term, category, price, or availability
              filters.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Materials
