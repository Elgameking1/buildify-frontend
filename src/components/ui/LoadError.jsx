import { FiRefreshCw, FiWifiOff } from 'react-icons/fi'
import { apiErrorMessage } from '../../services/api'

/**
 * What a page shows when its data would not load.
 *
 * Three things, in the order a stuck user needs them: that the problem is
 * ours and temporary, roughly what went wrong, and a way to try again without
 * hunting for the reload button.
 *
 * What it deliberately does not show is diagnostic detail. These pages used to
 * print axios's raw `error.message` followed by "Check that the backend is
 * running on port 8000" - an instruction aimed at whoever was developing the
 * app, shown to a customer who has no backend, no port, and no idea what
 * either is. `apiErrorMessage` already translates the common failures into
 * plain language, so that is what gets shown.
 */
function LoadError({
  title = 'Something went wrong',
  error,
  onRetry,
  isRetrying = false,
}) {
  return (
    <div className="surface-panel grid justify-items-center gap-4 p-8 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-primary-50 text-primary-700">
        <FiWifiOff aria-hidden="true" className="size-6" />
      </span>

      <div className="grid gap-2">
        <h2 className="text-2xl font-black text-secondary">{title}</h2>
        <p className="max-w-md text-sm leading-6 text-steel">
          {apiErrorMessage(
            error,
            'We are having trouble loading this right now. Please try again in a few moments.',
          )}
        </p>
      </div>

      {onRetry ? (
        <button
          type="button"
          className="btn-primary"
          onClick={onRetry}
          disabled={isRetrying}
        >
          <FiRefreshCw
            aria-hidden="true"
            className={isRetrying ? 'animate-spin' : ''}
          />
          {isRetrying ? 'Retrying…' : 'Try again'}
        </button>
      ) : null}
    </div>
  )
}

export default LoadError
