'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'

/**
 * Site-wide jū — every .voie-title leans with the force of the visitor's
 * scroll, on every page. Re-collects targets after each navigation.
 */
export default function VelocitySkew() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let titles: HTMLElement[] = []
    const collect = setTimeout(() => {
      titles = gsap.utils.toArray<HTMLElement>('.voie-title')
    }, 600)

    let lastY = window.scrollY
    let skew = 0
    const tick = () => {
      if (!titles.length) return
      const y = window.scrollY
      const target = gsap.utils.clamp(-4, 4, (y - lastY) * 0.07)
      lastY = y
      skew += (target - skew) * 0.1
      if (Math.abs(skew) < 0.002) return
      for (const t of titles) gsap.set(t, { skewY: skew, transformOrigin: 'left center' })
    }
    gsap.ticker.add(tick)

    return () => {
      clearTimeout(collect)
      gsap.ticker.remove(tick)
      for (const t of titles) gsap.set(t, { skewY: 0 })
    }
  }, [pathname])

  return null
}
