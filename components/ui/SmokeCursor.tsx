'use client'
import { useEffect, useRef, useState } from 'react'
import type { SmokeFluid } from '@/lib/smokeFluid'

/**
 * Black smoke trailing the mouse: a WebGL fluid fixed over the page that the
 * pointer stirs. Computers only; on touch screens, under reduced motion or
 * without WebGL2 nothing renders and the simulation is never downloaded.
 */
export default function SmokeCursor() {
  const [enabled, setEnabled] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check needs the browser
    if (mouse && !reduced) setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current!
    let fluid: SmokeFluid | null = null
    let gone = false
    let idle: ReturnType<typeof setTimeout> | undefined
    let lastX = -1
    let lastY = -1

    const onMove = (e: PointerEvent) => {
      if (!fluid || e.pointerType !== 'mouse') return
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      if (lastX >= 0) {
        const dx = (x - lastX) * 1400
        const dy = (y - lastY) * 1400
        const speed = Math.hypot(dx, dy)
        if (speed > 2) fluid.splat(x, y, dx, dy, Math.min(0.6, 0.18 + speed * 0.0015))
      }
      lastX = x
      lastY = y
      // Nothing left to draw a few seconds after the mouse stops: rest the GPU
      fluid.setPaused(false)
      clearTimeout(idle)
      idle = setTimeout(() => fluid?.setPaused(true), 4000)
    }
    const onLeave = () => { lastX = -1 }

    import('@/lib/smokeFluid').then(({ createSmokeFluid }) => {
      if (gone) return
      try {
        fluid = createSmokeFluid(canvas)
      } catch {
        fluid = null
      }
      if (!fluid) return
      fluid.setPaused(true)
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    })

    return () => {
      gone = true
      clearTimeout(idle)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      fluid?.destroy()
    }
  }, [enabled])

  if (!enabled) return null
  return <canvas ref={canvasRef} className="smoke" aria-hidden="true" />
}
