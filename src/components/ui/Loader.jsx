import { cn } from '../../utils/classNames'

function Loader({ className = '', label = 'Loading' }) {
  return (
    <div className={cn('inline-flex items-center gap-3 text-sm font-bold text-secondary', className)}>
      <span className="size-5 animate-spin rounded-full border-2 border-concrete border-t-primary" />
      {label}
    </div>
  )
}

export default Loader
