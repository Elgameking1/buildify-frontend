import { cn } from '../../utils/classNames'

function Input({
  as,
  children,
  className = '',
  error,
  id,
  label,
  textarea = false,
  ...props
}) {
  const Component = as ?? (textarea ? 'textarea' : 'input')

  return (
    <div className="grid gap-2">
      {label ? (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      {Component === 'input' ? (
        <input
          id={id}
          className={cn('form-input', className)}
          {...props}
        />
      ) : (
        <Component
          id={id}
          className={cn('form-input', textarea ? 'min-h-32 resize-y' : '', className)}
          {...props}
        >
          {children}
        </Component>
      )}
      {error ? (
        <p className="text-sm font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  )
}

export default Input
