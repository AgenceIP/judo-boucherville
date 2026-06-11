'use client'
import { type ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

/**
 * Client wrapper so server components can opt their content
 * into the IntersectionObserver fade-up reveal.
 */
export default function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
