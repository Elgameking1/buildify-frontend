import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiSliders,
  FiUsers,
} from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import WorkerCard from '../components/WorkerCard'
import {
  availabilityOptions,
  ratingOptions,
  workerSortOptions,
} from '../constants/catalogFilters'
import { workersService } from '../services/workersService'

const PAGE_SIZE = 12

/**
 * The worker directory.
 *
 * Skill, region, rating and availability are all parameters the search endpoint
 * accepts, so they are sent rather than applied to the page in hand - the same
 * reason the catalogue filters server-side. Region is a free-text field on the
 * profile, so its dropdown is built from the regions that have actually been
 * entered rather than a fixed list that would drift out of date.
 */
function Workers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [skill, setSkill] = useState('all')
  const [region, setRegion] = useState('all')
  const [rating, setRating] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedTerm(searchTerm), 350)
    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [debouncedTerm, skill, region, rating, availability, sortBy])

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: workersService.getSkills,
  })

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [
      'workers',
      debouncedTerm,
      skill,
      region,
      rating,
      availability,
      sortBy,
      page,
    ],
    queryFn: () =>
      workersService.getWorkers({
        q: debouncedTerm.trim() || undefined,
        skill: skill === 'all' ? undefined : skill,
        region: region === 'all' ? undefined : region,
        minRating: rating === 'all' ? undefined : Number(rating),
        availability: availability === 'all' ? undefined : availability,
        sort: sortBy,
        page,
        size: PAGE_SIZE,
      }),
    placeholderData: (previous) => previous,
  })

  const workers = useMemo(() => data?.items ?? [], [data])
  const total = data?.total ?? 0
  const pageCount = data?.pages ?? 0

  // Region options come from the results, so they only ever offer a value that
  // some profile actually carries. `region` stays selected across refetches
  // because it is part of the query key.
  const regionOptions = useMemo(() => {
    const found = new Set(
      workers
        .map((worker) => worker.location?.split(', ').at(-1))
        .filter(Boolean),
    )
    if (region !== 'all') found.add(region)
    return [...found].sort()
  }, [workers, region])

  const averageRating = useMemo(() => {
    const rated = workers.filter((worker) => worker.ratingCount > 0)
    if (rated.length === 0) return null
    const sum = rated.reduce((total, worker) => total + worker.rating, 0)
    return (sum / rated.length).toFixed(1)
  }, [workers])

  const hasFilters =
    Boolean(searchTerm) ||
    skill !== 'all' ||
    region !== 'all' ||
    rating !== 'all' ||
    availability !== 'all' ||
    sortBy !== 'rating'

  const resetFilters = () => {
    setSearchTerm('')
    setSkill('all')
    setRegion('all')
    setRating('all')
    setAvailability('all')
    setSortBy('rating')
  }

  return (
    <main className="w-full">
      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Skilled Workers
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Find trusted trade professionals for your next project.
            </h1>
            <p className="max-w-2xl leading-7 text-on-ink">
              Search worker profiles, compare ratings, and filter by trade,
              region or availability before sending a job request.
            </p>
          </div>

          <div className="surface-panel grid gap-4 p-5 text-secondary sm:grid-cols-3">
            <div>
              <span className="text-2xl font-black">{total}</span>
              <p className="text-sm text-steel">
                {hasFilters ? 'Matching workers' : 'Workers listed'}
              </p>
            </div>
            <div>
              <span className="text-2xl font-black">{skills?.length ?? '—'}</span>
              <p className="text-sm text-steel">Trades covered</p>
            </div>
            <div>
              <span className="text-2xl font-black">{averageRating ?? '—'}</span>
              <p className="text-sm text-steel">Average rating shown</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing">
        <SectionHeader
          eyebrow="Worker Directory"
          title="Search by trade, location, and proven project rating."
          description="Live worker profiles from the marketplace API."
        />

        <div className="surface-panel grid gap-4 p-4">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <label className="grid gap-2">
              <span className="form-label">Search</span>
              <span className="flex items-center gap-3 rounded-control border border-concrete bg-surface px-3 py-2 text-steel focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
                <FiSearch aria-hidden="true" />
                <input
                  type="search"
                  className="w-full bg-transparent text-secondary outline-none placeholder:text-steel"
                  placeholder="Search by name or headline"
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
                {workerSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
              <FiSliders aria-hidden="true" />
              Filters
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2">
                <span className="form-label">Trade</span>
                <select
                  className="form-input"
                  value={skill}
                  onChange={(event) => setSkill(event.target.value)}
                >
                  <option value="all">All trades</option>
                  {(skills ?? []).map((option) => (
                    <option key={option.id} value={option.slug}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="form-label">Region</span>
                <select
                  className="form-input"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                >
                  <option value="all">All regions</option>
                  {regionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="form-label">Rating</span>
                <select
                  className="form-input"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                >
                  {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
                    <option key={option.value} value={option.value}>
                      {option.label}
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
              ? 'Loading workers…'
              : total === 0
                ? 'No workers match these filters'
                : `Showing ${workers.length} of ${total} workers`}
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
                className="surface-panel h-64 animate-pulse bg-concrete/40"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="surface-panel grid gap-3 p-8 text-center">
            <h2 className="text-2xl font-black text-secondary">
              Could not load workers
            </h2>
            <p className="text-steel">
              {error?.message ?? 'The marketplace API is unreachable.'} Check that
              the backend is running on port 8000.
            </p>
          </div>
        ) : workers.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
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
          <div className="surface-panel grid gap-4 p-8 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-50 text-primary-700">
              <FiUsers size={28} aria-hidden="true" />
            </div>
            <div className="grid gap-2">
              <h2 className="text-2xl font-black text-secondary">
                No workers found
              </h2>
              <p className="text-steel">
                Try a different trade, region, rating or availability filter.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Workers
