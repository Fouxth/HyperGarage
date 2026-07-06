import { clsx } from 'clsx'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary'
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-white/10 text-white': variant === 'default',
          'bg-success/15 text-success': variant === 'success',
          'bg-warning/15 text-warning': variant === 'warning',
          'bg-error/15 text-error': variant === 'error',
          'bg-info/15 text-info': variant === 'info',
          'bg-primary/15 text-primary': variant === 'primary',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
