import { cn } from '../../utils/classNames'

function Card({ as: Component = 'div', children, className = '', ...props }) {
  return (
    <Component className={cn('surface-panel', className)} {...props}>
      {children}
    </Component>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={cn('grid gap-2 p-5', className)}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={cn('p-5', className)}>{children}</div>
}

export default Card
