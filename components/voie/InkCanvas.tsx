'use client'
import { useEffect, useRef } from 'react'
import { createInkFluid, type InkFluid } from '@/lib/inkFluid'

type Props = {
  /** RGB 0..1 — defaults to black ink for the paper world */
  color?: [number, number, number]
  /** Cap on ink opacity — lower for the luminous vapor variant */
  maxAlpha?: number
  /** Drop a few splats on arrival (homepage opening) */
  drops?: boolean
  className?: string
}

/**
 * The living layer. A WebGL fluid canvas where the visitor's cursor is a
 * brush — black ink on the paper world, luminous royal vapor on the night
 * pages. Pauses offscreen; absent under reduced motion or without WebGL2.
 */
export default function InkCanvas({
  color = [0.075, 0.066, 0.058],
  maxAlpha = 1,
  drops = false,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let fluid: InkFluid | null = null
    try {
      fluid = createInkFluid(canvas, { inkColor: color, maxAlpha })
    } catch {
      fluid = null
    }
    if (!fluid) return

    const dropTimeouts: ReturnType<typeof setTimeout>[] = []

    if (drops) {
      const fall = () => {
        const spots: [number, number][] = [[0.22, 0.32], [0.68, 0.55], [0.4, 0.72]]
        spots.forEach(([x, y], i) => {
          dropTimeouts.push(setTimeout(() => {
            const a = Math.random() * Math.PI * 2
            fluid?.splat(x, y, Math.cos(a) * 220, Math.sin(a) * 220, 0.9)
          }, 350 + i * 420))
        })
      }
      window.addEventListener('voie:open', fall, { once: true })
      dropTimeouts.push(setTimeout(fall, 1800))
    }

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

    const observer = new IntersectionObserver(([entry]) => {
      fluid?.setPaused(!entry.isIntersecting)
    }, { threshold: 0 })
    observer.observe(canvas)

    return () => {
      window.removeEventListener('pointermove', onMove)
      dropTimeouts.forEach(clearTimeout)
      observer.disconnect()
      fluid?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className ?? 'absolute inset-0 h-full w-full'}
      aria-hidden="true"
    />
  )
}
