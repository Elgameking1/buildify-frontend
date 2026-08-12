import toast from 'react-hot-toast'

export const notify = {
  error: (message) => toast.error(message),
  success: (message) => toast.success(message),
  // Returns an id so the caller can take it back down again; a loading toast
  // has no timeout of its own and would otherwise stay on screen forever.
  loading: (message) => toast.loading(message),
  dismiss: (id) => toast.dismiss(id),
}
