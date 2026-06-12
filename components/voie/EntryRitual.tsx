'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type Lenis from 'lenis'

const SEEN_KEY = 'voie-rei'

/**
 * The punch-in. White screen, the club name slams in poster-huge, a cobalt
 * bar sweeps the frame, then the curtain lifts. About a second — fast like
 * a throw. Once per session, skippable, skipped under reduced motion.
 * Fires `voie:open` when the page is revealed.
 */
export default function EntryRitual() {
  const [active, setActive] = useState<boolean | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = sessionStorage.getItem(SEEN_KEY) === '1'
    if (reduced || seen) {
      setActive(false)
      window.dispatchEvent(new Event('voie:open'))
      return
    }
    setActive(true)
  }, [])

  useEffect(() => {
    if (!active) return
    const overlay = overlayRef.current
    if (!overlay) return

    const lenis = (window as Window & { __lenis?: Lenis }).__lenis
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'

    const finish = () => {
      sessionStorage.setItem(SEEN_KEY, '1')
      document.documentElement.style.overflow = ''
      lenis?.start()
      window.dispatchEvent(new Event('voie:open'))
      setActive(false)
    }

    const tl = gsap.timeline({ onComplete: finish })
    tl.from('.punch-word', {
      yPercent: 120,
      duration: 0.55,
      stagger: 0.09,
      ease: 'power4.out',
    })
      .fromTo(barRef.current,
        { xPercent: -101 },
        { xPercent: 101, duration: 0.55, ease: 'power3.inOut' },
        '-=0.25'
      )
      .to({}, { duration: 0.2 })
      .to(overlay, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' })

    const skip = () => tl.totalProgress() < 0.75 && tl.totalProgress(0.75)
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('touchstart', skip, { passive: true })
    window.addEventListener('keydown', skip)
    overlay.addEventListener('pointerdown', skip)

    return () => {
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
      window.removeEventListener('keydown', skip)
      overlay.removeEventListener('pointerdown', skip)
      tl.kill()
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
  }, [active])

  if (!active) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-[#F6F5F2] flex flex-col items-start justify-center px-8 md:px-16 lg:px-20 select-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="overflow-hidden">
        <p className="punch-word font-heading leading-[.92] text-[#0B0B0D]" style={{ fontSize: 'clamp(54px, 9.5vw, 150px)' }}>
          JUDO
        </p>
      </div>
      <div className="overflow-hidden">
        <p className="punch-word font-heading leading-[.92] text-[#0B0B0D]" style={{ fontSize: 'clamp(54px, 9.5vw, 150px)' }}>
          BOUCHERVILLE
        </p>
      </div>
      <div className="relative mt-6 h-[10px] w-full max-w-3xl overflow-hidden">
        <div ref={barRef} className="absolute inset-0 bg-[#1D3FFF]" />
      </div>
    </div>
  )
}
