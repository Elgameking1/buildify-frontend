import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiCheckCircle, FiLock, FiMail } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { apiErrorMessage } from '../services/api'
import { authService } from '../services/authService'

const emailSchema = z.object({
  email: z.email('Enter a valid email address'),
})

// Mirrors the server's minimum so a too-short password is caught before a
// round trip. The server re-checks - including the strength rules this cannot
// express - and stays the authority.
const passwordSchema = z
  .object({
    password: z.string().min(10, 'Use at least 10 characters'),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  })

/**
 * Reset a password in two steps on one page.
 *
 * Step one confirms the address belongs to an account; step two sets the new
 * password. No emailed link and no one-time code, as specified.
 *
 * The reset token the server returns from step one is held in component state
 * only - never persisted. It expires in ten minutes and is single-use, so it
 * is not worth keeping and should not outlive the tab.
 */
function ForgotPassword() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirm: '' },
  })

  const onVerifyEmail = async ({ email }) => {
    try {
      const { resetToken } = await authService.verifyEmail(email)
      setSession({ email, resetToken })
    } catch (error) {
      toast.error(
        apiErrorMessage(error, 'We could not find an account for that email.'),
        { id: 'auth-error' },
      )
    }
  }

  const onSetPassword = async ({ password }) => {
    try {
      await authService.resetPassword({ token: session.resetToken, password })
      toast.success('Password updated. Please sign in.')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(
        apiErrorMessage(error, 'Could not update your password. Please start again.'),
        { id: 'auth-error' },
      )
    }
  }

  return (
    <main className="page-container grid w-full place-items-center section-spacing">
      <div className="surface-panel grid w-full max-w-md gap-6 p-8">
        <div className="grid gap-2">
          <span className="grid size-12 place-items-center rounded-full bg-primary-50 text-primary-700">
            {session ? (
              <FiLock aria-hidden="true" className="size-6" />
            ) : (
              <FiMail aria-hidden="true" className="size-6" />
            )}
          </span>
          <h1 className="text-2xl font-black text-secondary">
            {session ? 'Choose a new password' : 'Reset your password'}
          </h1>
          <p className="text-sm leading-6 text-steel">
            {session
              ? 'Setting a new password signs you out on every other device.'
              : 'Enter the email address on your account to get started.'}
          </p>
        </div>

        {session ? (
          <form className="grid gap-4" onSubmit={passwordForm.handleSubmit(onSetPassword)}>
            <p className="flex items-center gap-2 rounded-control bg-accent-50 px-3 py-2 text-sm font-semibold text-accent">
              <FiCheckCircle aria-hidden="true" className="shrink-0" />
              {session.email}
            </p>

            <label className="grid gap-1">
              <span className="form-label">New password</span>
              <input
                className="form-input"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register('password')}
              />
              {passwordForm.formState.errors.password ? (
                <span className="text-xs font-semibold text-primary-700">
                  {passwordForm.formState.errors.password.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-1">
              <span className="form-label">Confirm new password</span>
              <input
                className="form-input"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register('confirm')}
              />
              {passwordForm.formState.errors.confirm ? (
                <span className="text-xs font-semibold text-primary-700">
                  {passwordForm.formState.errors.confirm.message}
                </span>
              ) : null}
            </label>

            <button
              type="submit"
              className="btn-primary min-h-12"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting ? 'Updating…' : 'Update password'}
            </button>

            <button
              type="button"
              className="text-sm font-semibold text-steel hover:text-secondary"
              onClick={() => setSession(null)}
            >
              Use a different email
            </button>
          </form>
        ) : (
          <form className="grid gap-4" onSubmit={emailForm.handleSubmit(onVerifyEmail)}>
            <label className="grid gap-1">
              <span className="form-label">Email address</span>
              <input
                className="form-input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...emailForm.register('email')}
              />
              {emailForm.formState.errors.email ? (
                <span className="text-xs font-semibold text-primary-700">
                  {emailForm.formState.errors.email.message}
                </span>
              ) : null}
            </label>

            <button
              type="submit"
              className="btn-primary min-h-12"
              disabled={emailForm.formState.isSubmitting}
            >
              {emailForm.formState.isSubmitting ? 'Checking…' : 'Continue'}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              <FiArrowLeft aria-hidden="true" />
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </main>
  )
}

export default ForgotPassword
