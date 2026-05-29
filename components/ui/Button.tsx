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
  primary: 'bg-foreground text-bg-base hover:bg-accent-blue hover:text-black',
  outline: 'border border-foreground/50 text-foreground hover:border-foreground hover:bg-foreground hover:text-bg-base',
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
    'inline-flex items-center justify-center font-heading tracking-widest uppercase transition-all duration-200 cursor-pointer',
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
