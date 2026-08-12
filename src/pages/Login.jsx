import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { apiErrorMessage } from '../services/api'
import { authService } from '../services/authService'
import { login as loginAction } from '../store/slices/authSlice'

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const user = await authService.login(values)
      dispatch(loginAction(user))
      // Drop anything cached for the previous session (a guest's empty cart,
      // for instance) so the new user does not see it.
      queryClient.clear()
      reset()
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`)
      // Return them to whatever they were trying to reach, if anything.
      navigate(location.state?.from ?? '/', { replace: true })
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not sign you in.'))
    }
  }

  return (
    <main className="page-container grid w-full items-center gap-10 section-spacing lg:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden rounded-panel bg-ink p-8 text-white shadow-construction lg:grid lg:min-h-[520px] lg:content-between">
        <div className="grid gap-4">
          <span className="w-fit rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary">
            Welcome back
          </span>
          <h1 className="text-balance text-4xl font-black">
            Sign in to manage orders, workers, and site supplies.
          </h1>
          <p className="leading-7 text-on-ink">
            Access your construction marketplace account from one secure place.
          </p>
        </div>
        <div className="construction-stripe h-4 rounded-full" />
      </div>

      <div className="surface-panel mx-auto w-full max-w-xl p-6 sm:p-8">
        <div className="mb-8 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Login
          </p>
          <h2 className="text-3xl font-black text-secondary">Welcome back</h2>
          <p className="text-steel">Enter your account details to continue.</p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-sm font-semibold text-red-600">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <button type="submit" className="btn-primary min-h-12" disabled={isSubmitting}>
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-steel">
          No account yet?{' '}
          <Link to="/register" className="font-bold text-accent">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Login
