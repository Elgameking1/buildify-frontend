import { cn } from '../../utils/classNames'

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-600 focus-visible:outline-primary',
  // ink-hover, not secondary-700: that token is a text colour that inverts, so
  // hovering would have lightened the button behind its own white label.
  secondary: 'bg-ink text-white hover:bg-ink-hover focus-visible:outline-secondary',
  // accent-600 rather than accent, matching .btn-accent - `accent` brightens in
  // dark mode for use as a text colour and would fail contrast under white.
  accent: 'bg-accent-600 text-white hover:bg-accent-700 focus-visible:outline-accent',
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
