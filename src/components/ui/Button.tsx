import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20': variant === 'primary',
            'bg-card hover:bg-card-hover text-white border border-border': variant === 'secondary',
            'bg-transparent hover:bg-white/5 text-white border border-border hover:border-white/20': variant === 'outline',
            'bg-transparent hover:bg-white/5 text-muted-light hover:text-white': variant === 'ghost',
          },
          {
            'text-xs px-3 py-1.5 gap-1.5': size === 'sm',
            'text-sm px-4 py-2.5 gap-2': size === 'md',
            'text-base px-6 py-3 gap-2.5': size === 'lg',
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
export default Button
