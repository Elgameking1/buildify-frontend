import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiSearch, FiSliders } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { priceRanges, sortOptions } from '../constants/catalogFilters'
import { productsService } from '../services/productsService'

const PAGE_SIZE = 12

/**
 * The catalogue.
 *
 * Every filter is applied by the API. That matters for more than tidiness: the
 * page only ever holds one page of results, so filtering here would silently
 * mean "of the twelve products you happen to be looking at" - and the counts
 * beside it would be wrong in a way nobody notices until the catalogue grows.
 */
function Materials() {
  const [searchParams, setSearchParams] = useSearchParams()

  // The hero search box hands its term over as ?q=, so a search is linkable
  // and survives a reload.
  const initialQuery = searchParams.get('q') ?? ''
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery)
  const [categoryId, setCategoryId] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)

  // Typing shouldn't fire a request per keystroke.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedTerm(searchTerm), 350)
    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  // Keep the URL in step, without stacking a history entry per character.
  useEffect(() => {
    setSearchParams(debouncedTerm ? { q: debouncedTerm } : {}, { replace: true })
  }, [debouncedTerm, setSearchParams])

  // Any change to the filters invalidates the page number.
  useEffect(() => {
    setPage(1)
  }, [debouncedTerm, categoryId, priceRange, sortBy])

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productsService.getCategories,
  })

  const selectedRange = priceRanges.find((range) => range.value === priceRange)

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['products', debouncedTerm, categoryId, priceRange, sortBy, page],
    queryFn: () =>
      productsService.getProducts({
        q: debouncedTerm.trim() || undefined,
        categoryId: categoryId === 'all' ? undefined : Number(categoryId),
        minPrice: selectedRange?.min,
        maxPrice: selectedRange?.max,
        // A keyword search is ranked by relevance unless the user has asked
        // for a specific order.
        sort: debouncedTerm.trim() && sortBy === 'newest' ? 'relevance' : sortBy,
        page,
        size: PAGE_SIZE,
      }),
    placeholderData: (previous) => previous,
  })

  const materials = useMemo(() => data?.items ?? [], [data])
  const total = data?.total ?? 0
  const pageCount = data?.pages ?? 0

  const resetFilters = () => {
    setSearchTerm('')
    setCategoryId('all')
    setPriceRange('all')
    setSortBy('newest')
  }

  const hasFilters =
    Boolean(searchTerm) ||
    categoryId !== 'all' ||
    priceRange !== 'all' ||
    sortBy !== 'newest'

  return (
    <main className="w-full">
      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Materials Marketplace
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Source trusted building materials for every stage of work.
            </h1>
            <p className="max-w-2xl leading-7 text-on-ink">
              Search live supplier listings, filter by project need, compare
              pricing, and check availability before moving to details.
            </p>
          </div>
          <div className="surface-panel grid gap-4 p-5 text-secondary sm:grid-cols-3">
            <div>
              <span className="text-2xl font-black">{total}</span>
              <p className="text-sm text-steel">
                {hasFilters ? 'Matching listings' : 'Materials listed'}
              </p>
            </div>
            <div>
              <span className="text-2xl font-black">
                {categories?.length ?? '—'}
              </span>
              <p className="text-sm text-steel">Categories</p>
            </div>
            <div>
              <span className="text-2xl font-black">{pageCount || '—'}</span>
              <p className="text-sm text-steel">Pages of results</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing">
        <SectionHeader
          eyebrow="Browse Materials"
          title="Filter, sort, and compare supplier-ready inventory."
          description="Live supplier inventory from the marketplace API."
        />

        <div className="surface-panel grid gap-4 p-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <label className="grid gap-2">
            <span className="form-label">Search</span>
            <span className="flex items-center gap-3 rounded-control border border-concrete bg-surface px-3 py-2 text-steel focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                className="w-full bg-transparent text-secondary outline-none placeholder:text-steel"
                placeholder="Search by material name or description"
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
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="form-label">Category</span>
                <select
                  className="form-input"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  <option value="all">All categories</option>
                  {(categories ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {' '.repeat(category.depth * 2)}
                      {category.name}
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
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-secondary">
            {isLoading
              ? 'Loading materials…'
              : total === 0
                ? 'No materials match these filters'
                : `Showing ${materials.length} of ${total} materials`}
            {isFetching && !isLoading ? ' · updating…' : ''}
          </p>
          <button
            type="button"
            className="btn"
            disabled={!hasFilters}
            onClick={resetFilters}
          >
            Reset filters
          </button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="surface-panel h-72 animate-pulse bg-concrete/40"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="surface-panel grid gap-3 p-8 text-center">
            <h2 className="text-2xl font-black text-secondary">
              Could not load materials
            </h2>
            <p className="text-steel">
              {error?.message ?? 'The marketplace API is unreachable.'} Check that
              the backend is running on port 8000.
            </p>
          </div>
        ) : materials.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <ProductCard key={material.id} product={material} />
              ))}
            </div>

            {pageCount > 1 ? (
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <FiChevronLeft aria-hidden="true" />
                  Previous
                </button>
                <span className="text-sm font-bold text-secondary">
                  Page {page} of {pageCount}
                </span>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={page >= pageCount}
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                >
                  Next
                  <FiChevronRight aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="surface-panel grid gap-3 p-8 text-center">
            <h2 className="text-2xl font-black text-secondary">
              No materials found
            </h2>
            <p className="text-steel">
              Try a different search term, category, or price range.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Materials
