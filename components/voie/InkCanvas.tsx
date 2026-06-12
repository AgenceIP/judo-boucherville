'use client'
import { useEffect, useRef } from 'react'
import { createInkFluid, type InkFluid } from '@/lib/inkFluid'

/**
 * The living paper. A WebGL ink-fluid layer where the visitor's cursor is a
 * brush — movement leaves black ink that swirls and bleeds away. A few ink
 * drops fall on arrival so the paper breathes even before the first gesture.
 * Disabled under reduced motion or when WebGL2 float targets are missing.
 */
export default function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let fluid: InkFluid | null = null
    try {
      fluid = createInkFluid(canvas)
    } catch {
      fluid = null
    }
    if (!fluid) return

    const dropTimeouts: ReturnType<typeof setTimeout>[] = []

    // Opening drops — ink falling on the paper as the curtain lifts
    const drops = () => {
      const spots: [number, number][] = [[0.22, 0.32], [0.68, 0.55], [0.4, 0.72]]
      spots.forEach(([x, y], i) => {
        dropTimeouts.push(setTimeout(() => {
          const a = Math.random() * Math.PI * 2
          fluid?.splat(x, y, Math.cos(a) * 220, Math.sin(a) * 220, 0.9)
        }, 350 + i * 420))
      })
    }
    const onOpen = () => drops()
    window.addEventListener('voie:open', onOpen, { once: true })
    // If the ritual already ran this session, the event may have fired before mount
    const fallback = setTimeout(drops, 1800)

    let lastX = -1
    let lastY = -1
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) return
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      if (x < 0 || x > 1 || y < 0 || y > 1) { lastX = -1; return }
      if (lastX >= 0) {
        const dx = (x - lastX) * 1400
        const dy = (y - lastY) * 1400
        const speed = Math.hypot(dx, dy)
        if (speed > 4) {
          fluid?.splat(x, y, dx, dy, Math.min(0.55, 0.08 + speed * 0.0014))
        }
      }
      lastX = x
      lastY = y
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // Only simulate while the paper is on screen
    const observer = new IntersectionObserver(([entry]) => {
      fluid?.setPaused(!entry.isIntersecting)
    }, { threshold: 0 })
    observer.observe(canvas)

    return () => {
      window.removeEventListener('voie:open', onOpen)
      window.removeEventListener('pointermove', onMove)
      dropTimeouts.forEach(clearTimeout)
      clearTimeout(fallback)
      observer.disconnect()
      fluid?.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
