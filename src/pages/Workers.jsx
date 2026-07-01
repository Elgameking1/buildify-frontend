import { useMemo, useState } from 'react'
import { FiSearch, FiSliders, FiUsers } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import WorkerCard from '../components/WorkerCard'
import { workers } from '../constants/workersData'

const ratingOptions = [
  { label: 'All ratings', value: 'all' },
  { label: '4.5+ stars', value: '4.5' },
  { label: '4.7+ stars', value: '4.7' },
  { label: '4.8+ stars', value: '4.8' },
]

function Workers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [profession, setProfession] = useState('all')
  const [location, setLocation] = useState('all')
  const [rating, setRating] = useState('all')

  const professions = useMemo(
    () => ['all', ...new Set(workers.map((worker) => worker.profession))],
    [],
  )

  const locations = useMemo(
    () => ['all', ...new Set(workers.map((worker) => worker.location))],
    [],
  )

  const filteredWorkers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    const minimumRating = rating === 'all' ? 0 : Number(rating)

    return workers.filter((worker) => {
      const matchesSearch =
        !query ||
        worker.name.toLowerCase().includes(query) ||
        worker.role.toLowerCase().includes(query) ||
        worker.profession.toLowerCase().includes(query) ||
        worker.location.toLowerCase().includes(query)
      const matchesProfession =
        profession === 'all' || worker.profession === profession
      const matchesLocation = location === 'all' || worker.location === location
      const matchesRating = worker.rating >= minimumRating

      return (
        matchesSearch && matchesProfession && matchesLocation && matchesRating
      )
    })
  }, [location, profession, rating, searchTerm])

  return (
    <main className="w-full">
      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Skilled Workers
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Find trusted trade professionals for your next project.
            </h1>
            <p className="max-w-2xl leading-7 text-secondary-100">
              Search mock worker profiles, compare ratings, and filter by
              profession or location before requesting a profile.
            </p>
          </div>

          <div className="surface-panel grid gap-4 p-5 text-secondary sm:grid-cols-3">
            <div>
              <span className="text-2xl font-black">{workers.length}</span>
              <p className="text-sm text-steel">Workers listed</p>
            </div>
            <div>
              <span className="text-2xl font-black">
                {professions.length - 1}
              </span>
              <p className="text-sm text-steel">Professions</p>
            </div>
            <div>
              <span className="text-2xl font-black">4.7</span>
              <p className="text-sm text-steel">Average rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing">
        <SectionHeader
          eyebrow="Worker Directory"
          title="Search by trade, location, and proven project rating."
          description="These profiles use mock data and can later connect to verified worker accounts."
        />

        <div className="surface-panel grid gap-4 p-4">
          <label className="grid gap-2">
            <span className="form-label">Search</span>
            <span className="flex items-center gap-3 rounded-control border border-concrete bg-white px-3 py-2 text-steel focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                className="w-full bg-transparent text-secondary outline-none placeholder:text-steel"
                placeholder="Search by name, profession, role, or location"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </span>
          </label>

          <div className="grid gap-4">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
              <FiSliders aria-hidden="true" />
              Filters
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="form-label">Profession</span>
                <select
                  className="form-input"
                  value={profession}
                  onChange={(event) => setProfession(event.target.value)}
                >
                  {professions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All professions' : option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="form-label">Location</span>
                <select
                  className="form-input"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                >
                  {locations.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All locations' : option}
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
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-secondary">
            Showing {filteredWorkers.length} of {workers.length} workers
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setSearchTerm('')
              setProfession('all')
              setLocation('all')
              setRating('all')
            }}
          >
            Reset filters
          </button>
        </div>

        {filteredWorkers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
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
                Try changing the search term, profession, location, or rating
                filters.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Workers
