import { cn } from '../../utils/classNames'

const variants = {
  primary: 'bg-primary text-secondary-900 hover:bg-primary-600 focus-visible:outline-primary',
  secondary: 'bg-secondary text-white hover:bg-secondary-700 focus-visible:outline-secondary',
  accent: 'bg-accent text-white hover:bg-accent-700 focus-visible:outline-accent',
  ghost: 'bg-transparent text-secondary hover:bg-secondary-50 focus-visible:outline-secondary',
}

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

function Button({
  as: Component = 'button',
  children,
  className = '',
  isLoading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      type={Component === 'button' ? type : undefined}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </Component>
  )
}

export default Button
