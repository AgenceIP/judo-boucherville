'use client'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import type Lenis from 'lenis'

const SEEN_KEY = 'voie-rei'

/**
 * The entry ritual: a black screen, the kanji 礼 (rei — the bow) bleeds in
 * like ink, "Tout commence par un salut." — then the curtain lifts onto the
 * white world. Once per session, skippable by click/scroll/key, skipped
 * entirely under reduced motion. Fires `voie:open` when the page is revealed.
 */
export default function EntryRitual() {
  const locale = useLocale()
  const [active, setActive] = useState<boolean | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const kanjiRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)

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
    tl.fromTo(kanjiRef.current,
      { opacity: 0, filter: 'blur(22px)', scale: 1.12 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.3, ease: 'power3.out' }
    )
      .from(lineRef.current, { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out' }, '-=0.55')
      .to({}, { duration: 0.55 }) // hold the bow
      .to([kanjiRef.current, lineRef.current], {
        yPercent: -160,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.in',
      })
      .to(overlay, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, '-=0.45')

    // Any intent skips straight to the reveal
    const skip = () => tl.totalProgress() < 0.7 && tl.totalProgress(0.7)
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
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center select-none"
      aria-hidden="true"
    >
      <span
        ref={kanjiRef}
        className="font-jp text-white leading-none"
        style={{ fontSize: 'clamp(140px, 28vw, 320px)' }}
      >
        礼
      </span>
      <p
        ref={lineRef}
        className="mt-8 text-white/50 text-sm md:text-base tracking-[.25em] uppercase"
      >
        {locale === 'en' ? 'Everything begins with a bow.' : 'Tout commence par un salut.'}
      </p>
    </div>
  )
}
