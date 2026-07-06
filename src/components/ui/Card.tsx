import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  padding?: boolean
}

export default function Card({ children, className, hover, glass, padding = true }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border',
        glass ? 'glass' : 'bg-card',
        hover && 'hover:bg-card-hover hover:border-border-light transition-all duration-200',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}
