import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiAlertCircle, FiLock } from 'react-icons/fi'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { apiErrorMessage } from '../services/api'
import { authService } from '../services/authService'

// Mirrors the server's policy so the user hears about a too-short password
// before a round trip. The server re-checks - including the strength rules
// this cannot express - and remains the authority.
const schema = z
  .object({
    password: z.string().min(10, 'Use at least 10 characters'),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  })

/**
 * Set a new password from a reset link.
 *
 * The token arrives in the query string. It is single-use and expires, and
 * consuming it revokes every session the account had - so anyone signed in
 * with the old password, including whoever prompted the reset, is signed out.
 */
function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  })

  const onSubmit = async ({ password }) => {
    try {
      await authService.resetPassword({ token, password })
      toast.success('Password updated. Please sign in.')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(
        apiErrorMessage(error, 'That reset link is invalid or has expired.'),
        { id: 'auth-error' },
      )
    }
  }

  if (!token) {
    return (
      <main className="page-container grid w-full place-items-center section-spacing">
        <div className="surface-panel grid w-full max-w-md gap-4 p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-50 text-primary-700">
            <FiAlertCircle aria-hidden="true" className="size-6" />
          </span>
          <h1 className="text-2xl font-black text-secondary">
            No reset link found
          </h1>
          <p className="text-sm leading-6 text-steel">
            This page needs the link from your password reset email. Request a
            new one if yours has expired.
          </p>
          <Link to="/forgot-password" className="btn-primary mx-auto w-fit">
            Request a reset link
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-container grid w-full place-items-center section-spacing">
      <div className="surface-panel grid w-full max-w-md gap-6 p-8">
        <div className="grid gap-2">
          <span className="grid size-12 place-items-center rounded-full bg-primary-50 text-primary-700">
            <FiLock aria-hidden="true" className="size-6" />
          </span>
          <h1 className="text-2xl font-black text-secondary">
            Choose a new password
          </h1>
          <p className="text-sm leading-6 text-steel">
            Setting a new password signs you out everywhere else.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="grid gap-1">
            <span className="form-label">New password</span>
            <input
              className="form-input"
              type="password"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password ? (
              <span className="text-xs font-semibold text-primary-700">
                {errors.password.message}
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="form-label">Confirm new password</span>
            <input
              className="form-input"
              type="password"
              autoComplete="new-password"
              {...register('confirm')}
            />
            {errors.confirm ? (
              <span className="text-xs font-semibold text-primary-700">
                {errors.confirm.message}
              </span>
            ) : null}
          </label>

          <button
            type="submit"
            className="btn-primary min-h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default ResetPassword
