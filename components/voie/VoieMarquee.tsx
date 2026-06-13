'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const LINE = '柔道 — JUDO BOUCHERVILLE — DEPUIS 1970 — '

/**
 * A giant outlined marquee between the school and the dark descent.
 * Its speed answers the visitor's scroll force — push harder, it runs faster.
 */
export default function VoieMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const track = trackRef.current
    if (!track) return

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 26,
      ease: 'none',
      repeat: -1,
    })

    let lastY = window.scrollY
    let boost = 0
    const tick = () => {
      const y = window.scrollY
      const v = Math.abs(y - lastY)
      lastY = y
      boost += (Math.min(v * 0.18, 7) - boost) * 0.08
      tween.timeScale(1 + boost)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, { scope: wrapRef })

  return (
    <div ref={wrapRef} className="overflow-hidden py-10 md:py-14 select-none" aria-hidden="true">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform w-max">
        {[0, 1].map(i => (
          <span
            key={i}
            className="font-heading leading-none tracking-tight pr-4"
            style={{
              fontSize: 'clamp(80px, 12vw, 190px)',
              color: 'transparent',
              WebkitTextStroke: '1.5px color-mix(in srgb, var(--voie-ink) 32%, transparent)',
            }}
          >
            {LINE}
          </span>
        ))}
      </div>
    </div>
  )
}
