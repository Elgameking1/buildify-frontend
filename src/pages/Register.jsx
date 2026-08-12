import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { apiErrorMessage } from '../services/api'
import { authService } from '../services/authService'
import { login as loginAction } from '../store/slices/authSlice'

const roles = ['Client', 'Vendor', 'Worker']

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  // Mirrors the backend policy, so the user is told before the request is sent
  // rather than after a 422 comes back.
  password: z.string().min(10, 'Password must be at least 10 characters'),
  role: z.enum(roles, 'Choose a role'),
  businessName: z.string().optional(),
})

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
      businessName: '',
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (values) => {
    try {
      const user = await authService.register(values)
      dispatch(loginAction(user))
      queryClient.clear()
      reset()
      toast.success(`Account created. Welcome, ${user.name.split(' ')[0]}`)
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not create your account.'))
    }
  }

  return (
    <main className="page-container grid w-full items-center gap-10 section-spacing lg:grid-cols-[1.1fr_0.9fr]">
      <div className="surface-panel mx-auto w-full max-w-2xl p-6 sm:p-8">
        <div className="mb-8 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Register
          </p>
          <h1 className="text-3xl font-black text-secondary">
            Create your marketplace account
          </h1>
          <p className="text-steel">
            Join as a client, vendor, or worker.
          </p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Your full name"
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-sm font-semibold text-red-600">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-sm font-semibold text-red-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Create a password"
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-sm font-semibold text-red-600">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label className="form-label" htmlFor="role">
              Role
            </label>
            <select id="role" className="form-input" {...register('role')}>
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role ? (
              <p className="text-sm font-semibold text-red-600">
                {errors.role.message}
              </p>
            ) : null}
          </div>

          {/* Required by the API for vendor accounts, so it is only asked for
              when that role is chosen. */}
          {selectedRole === 'Vendor' ? (
            <div className="grid gap-2">
              <label className="form-label" htmlFor="businessName">
                Business name
              </label>
              <input
                id="businessName"
                type="text"
                className="form-input"
                placeholder="e.g. Mensah Building Supplies"
                {...register('businessName')}
              />
            </div>
          ) : null}

          <button type="submit" className="btn-primary min-h-12" disabled={isSubmitting}>
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-steel">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-accent">
            Login
          </Link>
        </p>
      </div>

      <div className="hidden rounded-panel bg-secondary p-8 text-white shadow-construction lg:grid lg:min-h-[560px] lg:content-between">
        <div className="grid gap-4">
          <span className="w-fit rounded-full bg-primary px-4 py-2 text-sm font-bold text-secondary-900">
            Join the network
          </span>
          <h2 className="text-balance text-4xl font-black">
            One account for buying, selling, or offering skilled labor.
          </h2>
          <p className="leading-7 text-secondary-100">
            Your role decides which dashboard you get: an order history, a
            product catalogue, or a queue of job requests.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {roles.map((role) => (
            <div key={role} className="rounded-control bg-white/10 p-4 text-center">
              <span className="font-bold text-primary">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Register
