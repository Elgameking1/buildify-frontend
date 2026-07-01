import toast from 'react-hot-toast'

export const notify = {
  error: (message) => toast.error(message),
  success: (message) => toast.success(message),
}
