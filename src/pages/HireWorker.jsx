import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import { z } from 'zod'
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiSend,
  FiStar,
} from 'react-icons/fi'
import { workers } from '../constants/workersData'

const hireWorkerSchema = z.object({
  jobTitle: z.string().min(3, 'Job title must be at least 3 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters'),
  address: z.string().min(8, 'Address must be at least 8 characters'),
  date: z.string().min(1, 'Choose a preferred date'),
  budget: z
    .string()
    .refine(
      (value) => value === '' || Number(value) > 0,
      'Budget must be a positive amount',
    )
    .optional(),
})

function HireWorker() {
  const { id } = useParams()
  const worker = workers.find((item) => item.id === id)
  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(hireWorkerSchema),
    defaultValues: {
      jobTitle: '',
      description: '',
      address: '',
      date: '',
      budget: '',
    },
  })

  const onSubmit = () => {
    toast.success(`Hire request prepared for ${worker.name}`)
    reset()
  }

  if (!worker) {
    return (
      <main className="page-container grid gap-6 section-spacing">
        <Link to="/workers" className="btn w-fit">
          <FiArrowLeft aria-hidden="true" />
          Back to workers
        </Link>
        <div className="surface-panel grid gap-3 p-8 text-center">
          <h1 className="text-3xl font-black text-secondary">
            Worker not found
          </h1>
          <p className="text-steel">
            The mock worker you want to hire is not available.
          </p>
        </div>
      </main>
    )
  }

  const initials = worker.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <main className="w-full">
      <section className="page-container grid gap-8 section-spacing lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <aside className="grid gap-5 lg:sticky lg:top-24">
          <Link to={`/workers/${worker.id}`} className="btn w-fit">
            <FiArrowLeft aria-hidden="true" />
            Back to profile
          </Link>

          <div className="surface-panel overflow-hidden">
            <div className="bg-secondary p-6 text-white">
              <div className="grid gap-5">
                <div className="grid size-28 place-items-center rounded-panel border border-white/10 bg-white/10 text-4xl font-black text-primary">
                  {initials}
                </div>
                <div className="grid gap-2">
                  <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-secondary-900">
                    {worker.profession}
                  </span>
                  <h1 className="text-3xl font-black">{worker.name}</h1>
                  <p className="text-secondary-100">{worker.role}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6 text-sm text-steel">
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="text-primary" aria-hidden="true" />
                {worker.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiStar className="text-primary" aria-hidden="true" />
                {worker.rating} rating
              </span>
              <span className="inline-flex items-center gap-2">
                <FiBriefcase className="text-primary" aria-hidden="true" />
                {worker.rate}
              </span>
              <p className="leading-7">{worker.bio}</p>
            </div>
          </div>
        </aside>

        <section className="surface-panel p-6 sm:p-8">
          <div className="mb-8 grid gap-2">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
              Hire Worker
            </p>
            <h2 className="text-balance text-3xl font-black text-secondary md:text-4xl">
              Send a mock job request to {worker.name}.
            </h2>
            <p className="text-steel">
              This form validates on the frontend only. No backend request is
              sent.
            </p>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <label className="form-label" htmlFor="jobTitle">
                Job title
              </label>
              <input
                id="jobTitle"
                type="text"
                className="form-input"
                placeholder="e.g. Bathroom plumbing installation"
                {...register('jobTitle')}
              />
              {errors.jobTitle ? (
                <p className="text-sm font-semibold text-red-600">
                  {errors.jobTitle.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="form-input min-h-36 resize-y"
                placeholder="Describe the job scope, materials, timeline, and site requirements."
                {...register('description')}
              />
              {errors.description ? (
                <p className="text-sm font-semibold text-red-600">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="form-label" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  className="form-input"
                  placeholder="Project site address"
                  {...register('address')}
                />
                {errors.address ? (
                  <p className="text-sm font-semibold text-red-600">
                    {errors.address.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <label className="form-label" htmlFor="date">
                  Date
                </label>
                <span className="flex items-center gap-3 rounded-control border border-concrete bg-white px-3 py-2 text-steel focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
                  <FiCalendar aria-hidden="true" />
                  <input
                    id="date"
                    type="date"
                    min={today}
                    className="w-full bg-transparent text-secondary outline-none"
                    {...register('date')}
                  />
                </span>
                {errors.date ? (
                  <p className="text-sm font-semibold text-red-600">
                    {errors.date.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="form-label" htmlFor="budget">
                Budget <span className="font-normal text-steel">(optional)</span>
              </label>
              <input
                id="budget"
                type="number"
                min="1"
                step="1"
                className="form-input"
                placeholder="Budget in Ghana cedis"
                {...register('budget')}
              />
              {errors.budget ? (
                <p className="text-sm font-semibold text-red-600">
                  {errors.budget.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              className="btn-primary min-h-12"
              disabled={isSubmitting}
            >
              <FiSend aria-hidden="true" />
              Submit Hire Request
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

export default HireWorker
