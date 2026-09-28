'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const VALUES_FR = ['Politesse', 'Courage', 'Sincérité', 'Honneur', 'Modestie', 'Respect', 'Contrôle de soi', 'Amitié']
const VALUES_EN = ['Courtesy', 'Courage', 'Sincerity', 'Honour', 'Modesty', 'Respect', 'Self-control', 'Friendship']

/**
 * The eight values painted on the dojo walls, running as one band.
 * Its speed answers the visitor's scroll: push harder, it runs faster,
 * and it runs backward while you scroll back up.
 */
export default function ValuesMarquee({ locale }: { locale: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const values = locale === 'fr' ? VALUES_FR : VALUES_EN

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.to(trackRef.current, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
    tween.totalTime(tween.duration() * 500) // far from zero, so scrolling up can run it backward

    let lastY = window.scrollY, speed = 1
    const tick = () => {
      const y = window.scrollY
      const v = y - lastY
      lastY = y
      const target = (v < 0 ? -1 : 1) * (1 + Math.min(Math.abs(v) * 0.22, 8))
      speed += (target - speed) * 0.08
      tween.timeScale(speed)
    }
    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); tween.kill() }
  }, { scope: wrapRef })

  const run = (key: number) => (
    <span key={key} className="flex items-center shrink-0" aria-hidden={key > 0}>
      {values.map(v => (
        <span key={v} className="flex items-center">
          <span className="display text-[clamp(3.2rem,8vw,6rem)] text-ink px-[.35em] whitespace-nowrap">{v}</span>
          <span className="font-jp text-[clamp(1.6rem,3vw,2.4rem)] text-blue" aria-hidden="true">礼</span>
        </span>
      ))}
    </span>
  )

  return (
    <div ref={wrapRef} className="overflow-hidden bg-accent py-6 md:py-8 select-none" role="region" aria-label={locale === 'fr' ? 'Le code moral du judo' : 'The moral code of judo'}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map(run)}
      </div>
    </div>
  )
}
