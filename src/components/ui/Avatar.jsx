import { cn } from '../../utils/classNames'

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Avatar({ className = '', name, src, size = 'md' }) {
  const sizes = {
    sm: 'size-10 text-sm',
    md: 'size-14 text-base',
    lg: 'size-20 text-2xl',
  }

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary font-black text-secondary-900',
        sizes[size],
        className,
      )}
    >
      {src ? <img src={src} alt={name} className="size-full object-cover" /> : getInitials(name)}
    </div>
  )
}

export default Avatar
