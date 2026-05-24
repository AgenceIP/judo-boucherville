import { cn } from '@/lib/utils'
import Link from 'next/link'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

const variants = {
  primary: 'bg-accent-blue text-white hover:bg-accent-glow animate-glow-pulse',
  outline: 'border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white',
  ghost: 'text-foreground hover:text-accent-blue',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  children, variant = 'primary', size = 'md',
  href, className, onClick, type = 'button', disabled,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-lg font-body font-semibold transition-all duration-200 cursor-pointer',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
