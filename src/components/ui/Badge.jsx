import { cn } from '../../utils/classNames'

const tones = {
  accent: 'bg-accent-50 text-accent',
  primary: 'bg-primary-50 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-emerald-50 text-emerald-700',
}

function Badge({ children, className = '', tone = 'primary' }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
