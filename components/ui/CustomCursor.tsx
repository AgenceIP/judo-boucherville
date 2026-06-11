'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLocale } from 'next-intl'

type CursorState = 'default' | 'link' | 'drag'

/**
 * Site-wide custom cursor: a tight dot and a lagging ring, both in
 * mix-blend-difference so they read on the white world and the black one.
 * Desktop fine-pointers only; never rendered for touch or reduced motion.
 */
export default function CustomCursor() {
  const locale = useLocale()
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<CursorState>('default')
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')
    return () => document.documentElement.classList.remove('has-custom-cursor')
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    gsap.set([dot, ring, label], { xPercent: -50, yPercent: -50, opacity: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    const labelX = gsap.quickTo(label, 'x', { duration: 0.45, ease: 'power3.out' })
    const labelY = gsap.quickTo(label, 'y', { duration: 0.45, ease: 'power3.out' })

    let seen = false
    const onMove = (e: PointerEvent) => {
      if (!seen) {
        seen = true
        gsap.set([dot, ring, label], { x: e.clientX, y: e.clientY })
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
      }
      dotX(e.clientX); dotY(e.clientY)
      ringX(e.clientX); ringY(e.clientY)
      labelX(e.clientX); labelY(e.clientY)
    }

    const interactive = (el: Element | null): CursorState => {
      if (!el || !(el instanceof Element)) return 'default'
      if (el.closest('[data-cursor="drag"]')) return 'drag'
      if (el.closest('a, button, [data-cursor="link"]')) return 'link'
      return 'default'
    }
    const onOver = (e: PointerEvent) => setState(interactive(e.target as Element))
    const onLeaveWindow = () => gsap.to([dot, ring, label], { opacity: 0, duration: 0.25 })
    const onEnterWindow = () => gsap.to([dot, ring], { opacity: 1, duration: 0.25 })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    document.documentElement.addEventListener('pointerenter', onEnterWindow)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      document.documentElement.removeEventListener('pointerenter', onEnterWindow)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !labelRef.current) return
    gsap.to(labelRef.current, { opacity: state === 'drag' ? 1 : 0, duration: 0.25 })
  }, [state, enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" data-state={state} />
      <div ref={labelRef} className="cursor-label">
        {locale === 'en' ? 'drag' : 'glisser'}
      </div>
    </>
  )
}
