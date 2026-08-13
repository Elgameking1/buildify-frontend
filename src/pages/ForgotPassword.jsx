import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiMail } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { apiErrorMessage } from '../services/api'
import { authService } from '../services/authService'

const schema = z.object({
  email: z.email('Enter a valid email address'),
})

/**
 * Request a password reset link.
 *
 * The confirmation deliberately does not say whether the address is
 * registered. The backend answers identically either way, and a page that
 * said "no account found" would undo that - it would let anyone check which
 * email addresses have accounts here, one guess at a time.
 *
 * When the server has no mail provider it hands the reset link back directly.
 * That is a demo affordance, not the normal path, and it is labelled as one so
 * nobody mistakes it for something a real user would ever see.
 */
function ForgotPassword() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async ({ email }) => {
    try {
      const { detail, resetToken } = await authService.forgotPassword(email)
      setSent({ detail, resetToken })
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not start a password reset.'), {
        id: 'auth-error',
      })
    }
  }

  return (
    <main className="page-container grid w-full place-items-center section-spacing">
      <div className="surface-panel grid w-full max-w-md gap-6 p-8">
        <div className="grid gap-2">
          <span className="grid size-12 place-items-center rounded-full bg-primary-50 text-primary-700">
            <FiMail aria-hidden="true" className="size-6" />
          </span>
          <h1 className="text-2xl font-black text-secondary">
            Reset your password
          </h1>
          <p className="text-sm leading-6 text-steel">
            Enter the email address on your account and we will send a link to
            set a new password.
          </p>
        </div>

        {sent ? (
          <div className="grid gap-4">
            <p className="rounded-control bg-accent-50 p-4 text-sm leading-6 text-accent">
              {sent.detail}
            </p>

            {sent.resetToken ? (
              <div className="grid gap-2 rounded-control border border-primary bg-primary-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary-700">
                  Demo mode — no mail provider configured
                </p>
                <p className="text-xs leading-5 text-secondary">
                  This link would normally arrive by email. It is shown here
                  only because this server has no mailer.
                </p>
                <button
                  type="button"
                  className="btn-primary mt-1"
                  onClick={() =>
                    navigate(`/reset-password?token=${encodeURIComponent(sent.resetToken)}`)
                  }
                >
                  Continue to set a new password
                </button>
              </div>
            ) : null}

            <Link to="/login" className="btn-secondary">
              <FiArrowLeft aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="grid gap-1">
              <span className="form-label">Email address</span>
              <input
                className="form-input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email ? (
                <span className="text-xs font-semibold text-primary-700">
                  {errors.email.message}
                </span>
              ) : null}
            </label>

            <button
              type="submit"
              className="btn-primary min-h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </button>

            <Link
              to="/login"
              className="text-center text-sm font-semibold text-accent hover:underline"
            >
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </main>
  )
}

export default ForgotPassword
