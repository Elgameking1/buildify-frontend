import { FiStar } from 'react-icons/fi'
import { cn } from '../../utils/classNames'

function RatingStars({ className = '', max = 5, rating = 0, showValue = true }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-primary-700', className)}>
      {Array.from({ length: max }).map((_, index) => (
        <FiStar
          key={index}
          className={index < Math.round(rating) ? 'fill-primary text-primary' : 'text-concrete'}
          aria-hidden="true"
        />
      ))}
      {showValue ? (
        <span className="ml-1 text-sm font-bold text-secondary">{rating}</span>
      ) : null}
    </span>
  )
}

export default RatingStars
