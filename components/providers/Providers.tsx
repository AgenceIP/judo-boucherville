'use client'
import { ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis
    // Handle for components that need to drive or pause the scroll
    // (entry ritual scroll-lock, drag-to-scrub on the pinned chapter)
    ;(window as Window & { __lenis?: Lenis }).__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
      delete (window as Window & { __lenis?: Lenis }).__lenis
    }
  }, [])

  // Reset scroll instantly on route change so transitions start from the top
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    ScrollTrigger.refresh()
  }, [pathname])

  return <>{children}</>
}
