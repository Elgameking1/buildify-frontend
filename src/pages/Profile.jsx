import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { apiErrorMessage } from '../services/api'
import { usersService } from '../services/usersService'
import { updateProfile } from '../store/slices/authSlice'

const EMPTY = { name: '', phone: '', region: '', city: '' }

function Profile() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [draft, setDraft] = useState(EMPTY)

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: usersService.getMe,
    enabled: isAuthenticated,
  })

  // Seed the form once the account has loaded, and again if it is refetched.
  useEffect(() => {
    if (me) {
      setDraft({
        name: me.name ?? '',
        phone: me.phone ?? '',
        region: me.region ?? '',
        city: me.city ?? '',
      })
    }
  }, [me])

  const save = useMutation({
    mutationFn: () => usersService.updateMe(draft),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      // Keep the navbar and dashboards in step with the new details.
      dispatch(updateProfile(updated))
      toast.success('Profile updated')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not save your profile.')),
  })

  if (!isAuthenticated) {
    return (
      <main className="page-container grid gap-6 section-spacing">
        <div className="surface-panel grid gap-3 p-8 text-center">
          <h1 className="text-3xl font-black text-secondary">You are signed out</h1>
          <p className="text-steel">Sign in to view and edit your profile.</p>
          <Link to="/login" className="btn-primary mx-auto w-fit">
            Go to login
          </Link>
        </div>
      </main>
    )
  }

  if (isLoading || !me) {
    return (
      <main className="page-container grid gap-6 section-spacing">
        <div className="surface-panel h-80 animate-pulse bg-concrete/40" />
      </main>
    )
  }

  const initials = (me.name || '?')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <main className="w-full">
      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-4">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Account
          </span>
          <h1 className="text-balance text-4xl font-black md:text-5xl">
            Your marketplace profile.
          </h1>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <aside className="surface-panel grid gap-5 p-6">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full bg-primary text-xl font-black text-on-primary">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary">{me.name}</h2>
              <p className="text-sm capitalize text-steel">{me.role} account</p>
            </div>
          </div>

          <div className="grid gap-3 border-t border-concrete pt-5 text-sm text-steel">
            <span className="inline-flex items-center gap-2">
              <FiMail className="text-primary" aria-hidden="true" />
              {me.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <FiPhone className="text-primary" aria-hidden="true" />
              {me.phone || 'No phone number'}
            </span>
            <span className="inline-flex items-center gap-2">
              <FiMapPin className="text-primary" aria-hidden="true" />
              {[me.city, me.region].filter(Boolean).join(', ') || 'No location set'}
            </span>
          </div>

          {me.vendorProfile ? (
            <div className="grid gap-2 border-t border-concrete pt-5">
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                Vendor
              </span>
              <p className="font-bold text-secondary">
                {me.vendorProfile.businessName}
              </p>
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                  me.vendorProfile.isVerified
                    ? 'bg-accent-50 text-accent'
                    : 'bg-secondary-100 text-secondary-700'
                }`}
              >
                <FiCheckCircle aria-hidden="true" />
                {me.vendorProfile.isVerified ? 'Verified vendor' : 'Not yet verified'}
              </span>
              <Link to="/vendor-dashboard" className="btn-secondary mt-2 w-fit">
                Vendor dashboard
              </Link>
            </div>
          ) : null}

          {me.workerProfile ? (
            <div className="grid gap-2 border-t border-concrete pt-5">
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                Worker
              </span>
              <p className="font-bold text-secondary">
                {me.workerProfile.headline || 'No headline set'}
              </p>
              <p className="text-sm text-steel">
                {Number(me.workerProfile.rating).toFixed(1)} rating from{' '}
                {me.workerProfile.ratingCount} reviews
              </p>
              <Link to="/worker-dashboard" className="btn-secondary mt-2 w-fit">
                Worker dashboard
              </Link>
            </div>
          ) : null}
        </aside>

        <section className="surface-panel grid gap-5 p-6 sm:p-8">
          <div className="grid gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
              Edit details
            </span>
            <h2 className="text-2xl font-black text-secondary">
              Keep your contact information current
            </h2>
            <p className="text-steel">
              Vendors and workers use these details to reach you about orders and
              jobs.
            </p>
          </div>

          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              save.mutate()
            }}
          >
            <label className="grid gap-2 sm:col-span-2">
              <span className="form-label">Full name</span>
              <span className="flex items-center gap-3 rounded-control border border-concrete bg-surface px-3 py-2 focus-within:border-accent">
                <FiUser className="text-steel" aria-hidden="true" />
                <input
                  className="w-full bg-transparent text-secondary outline-none"
                  required
                  minLength={2}
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                />
              </span>
            </label>

            <label className="grid gap-2">
              <span className="form-label">Phone</span>
              <input
                className="form-input"
                placeholder="0244000000"
                value={draft.phone}
                onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
              />
            </label>

            <label className="grid gap-2">
              <span className="form-label">Email</span>
              {/* Read-only: changing an email is an identity change and the API
                  has no verification flow for it. */}
              <input className="form-input" value={me.email} disabled readOnly />
            </label>

            <label className="grid gap-2">
              <span className="form-label">Region</span>
              <input
                className="form-input"
                placeholder="Greater Accra"
                value={draft.region}
                onChange={(event) => setDraft({ ...draft, region: event.target.value })}
              />
            </label>

            <label className="grid gap-2">
              <span className="form-label">City</span>
              <input
                className="form-input"
                placeholder="Accra"
                value={draft.city}
                onChange={(event) => setDraft({ ...draft, city: event.target.value })}
              />
            </label>

            <button
              type="submit"
              className="btn-primary min-h-12 sm:col-span-2"
              disabled={save.isPending}
            >
              {save.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

export default Profile
