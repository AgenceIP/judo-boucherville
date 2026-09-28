'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Site-wide cursor: a tight dot and a lagging ring in difference blend, so it
 * reads on white, blue and navy. The ring opens over anything clickable.
 * Fine pointers only; never rendered for touch or reduced motion.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check needs the browser
    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')
    return () => document.documentElement.classList.remove('has-custom-cursor')
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current!
    const ring = ringRef.current!
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    let seen = false
    let state = ''
    const onMove = (e: PointerEvent) => {
      if (!seen) {
        seen = true
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
      }
      dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY)
    }
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null
      const next = t?.closest?.('a, button, select, summary, label, [data-cursor="link"]') ? 'link' : 'default'
      if (next !== state) { state = next; ring.dataset.state = next }
    }
    const hide = () => gsap.to([dot, ring], { opacity: 0, duration: 0.25 })
    const show = () => seen && gsap.to([dot, ring], { opacity: 1, duration: 0.25 })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    document.documentElement.addEventListener('pointerenter', show)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.documentElement.removeEventListener('pointerenter', show)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
