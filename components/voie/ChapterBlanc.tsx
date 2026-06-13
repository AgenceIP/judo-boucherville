'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Magnetic from '@/components/ui/Magnetic'
import InkCanvas from '@/components/voie/InkCanvas'
import { createLetterPhysics, type LetterPhysics } from '@/lib/letterPhysics'

gsap.registerPlugin(ScrollTrigger)

/**
 * Chapter 01 — White belt. A paper-white world, almost empty:
 * everyone starts here. Intro plays once the entry ritual lifts.
 */
export default function ChapterBlanc() {
  const locale = useLocale()
  const en = locale === 'en'
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [randoriReady, setRandoriReady] = useState(false)

  const lines = en ? ['EVERYONE', 'STARTS HERE.'] : ['TOUT LE MONDE', 'COMMENCE ICI.']

  useEffect(() => {
    const fire = () => setOpen(true)
    window.addEventListener('voie:open', fire, { once: true })
    const fallback = setTimeout(fire, 4500)
    return () => {
      window.removeEventListener('voie:open', fire)
      clearTimeout(fallback)
    }
  }, [])

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.set('.blanc-line', { yPercent: 108 })
    gsap.set('.blanc-fade', { opacity: 0, y: 18 })
    // yPercent -50 replaces the Tailwind centering transform that GSAP overrides
    gsap.set('.blanc-kanji', { opacity: 0, scale: 1.04, yPercent: -50 })

    // The ghost ideogram drifts as the page begins to move — depth in the paper
    gsap.to('.blanc-kanji', {
      yPercent: -64,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, { scope: sectionRef })

  useGSAP(() => {
    if (!open) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tl = gsap.timeline({ onComplete: () => setRandoriReady(true) })
    tl.to('.blanc-line', { yPercent: 0, stagger: 0.14, duration: 1.3, ease: 'power4.out' })
      .to('.blanc-kanji', { opacity: 0.07, scale: 1, duration: 1.6, ease: 'power3.out' }, '-=1.0')
      .to('.blanc-fade', { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' }, '-=1.1')
  }, { scope: sectionRef, dependencies: [open] })

  // Randori mode — once the kata settles, the letters become throwable.
  // They tumble, breakfall on the tatami, and the dojo restores the order.
  useEffect(() => {
    if (!randoriReady) return
    const section = sectionRef.current
    if (!section) return

    // Free the letters from their reveal masks so they can fly
    section.querySelectorAll<HTMLElement>('.blanc-mask').forEach(m => {
      m.style.overflow = 'visible'
    })

    const letters = Array.from(section.querySelectorAll<HTMLElement>('[data-randori]'))
    let physics: LetterPhysics | null = null
    try {
      physics = createLetterPhysics(section, letters, {
        onImpact: (intensity) =>
          window.dispatchEvent(new CustomEvent('dojo:impact', { detail: { intensity } })),
      })
    } catch {
      physics = null
    }
    return () => physics?.destroy()
  }, [randoriReady])

  return (
    <section
      ref={sectionRef}
      data-voie-bg="#FBFAF7"
      data-voie-ink="#0E0E10"
      data-voie-muted="#5F6470"
      data-voie-hairline="rgba(14,14,16,0.12)"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden px-8 md:px-16 lg:px-20"
    >
      {/* Holographic tatami — the floor of the future dojo */}
      <div className="holo-grid" aria-hidden="true" />
      {/* Ghost kanji 始 — beginning */}
      <span
        className="blanc-kanji font-jp absolute -right-[4vw] top-1/2 -translate-y-1/2 leading-none select-none pointer-events-none"
        style={{ fontSize: '46vw', color: 'var(--voie-ink)', opacity: 0.05 }}
        aria-hidden="true"
      >
        始
      </span>

      {/* The living paper — the cursor is a brush of royal current */}
      <InkCanvas drops color={[0.12, 0.23, 0.8]} maxAlpha={0.92} />

      <div className="relative max-w-7xl">
        <p
          className="blanc-fade text-[10px] tracking-[.4em] uppercase mb-8"
          style={{ color: 'var(--voie-ink-muted)' }}
        >
          <span className="font-jp text-xs mr-3 opacity-60">一</span>
          {en ? 'Chapter 01 · White belt' : 'Chapitre 01 · Ceinture blanche'}
        </p>

        <h1
          className="voie-title font-heading leading-[.88] tracking-tight mb-8 select-none"
          style={{ fontSize: 'clamp(64px, 12vw, 168px)', color: 'var(--voie-ink)' }}
        >
          {lines.map(line => (
            <span key={line} className="blanc-mask block overflow-hidden">
              <span className="blanc-line block whitespace-pre">
                {line.split('').map((ch, i) =>
                  ch === ' ' ? (
                    <span key={i}> </span>
                  ) : (
                    <span key={i} data-randori className="inline-block">
                      {ch}
                    </span>
                  )
                )}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="blanc-fade italic text-lg md:text-2xl max-w-xl leading-relaxed mb-4"
          style={{ color: 'var(--voie-ink-muted)' }}
        >
          {en
            ? 'White belt. First bow. First step onto the tatami. Since 1970, every champion of this club has started exactly here.'
            : 'Ceinture blanche. Premier salut. Premier pas sur le tatami. Depuis 1970, chaque champion du club a commencé exactement ici.'}
        </p>

        {/* The randori invitation */}
        <p
          className="text-[10px] tracking-[.3em] uppercase mb-10 transition-opacity duration-700"
          style={{ color: 'var(--voie-ink-muted)', opacity: randoriReady ? 0.75 : 0 }}
        >
          {en
            ? 'Grab a letter — try a throw. The dojo will tidy up.'
            : 'Attrape une lettre — essaie une projection. Le dojo rangera.'}
        </p>

        <div className="blanc-fade">
          <Magnetic>
            <Link
              href={`/${locale}/inscription`}
              className="btn-wipe inline-flex font-heading tracking-widest uppercase text-sm bg-royal text-white px-8 py-4 hover:text-black"
            >
              {en ? 'Start judo' : 'Commencer le judo'}
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="blanc-fade absolute bottom-8 left-8 md:left-16 lg:left-20 flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[.35em] uppercase [writing-mode:vertical-rl]" style={{ color: 'var(--voie-ink-muted)' }}>
          {en ? 'Follow the way' : 'Suivre la voie'}
        </span>
        <span className="block w-px h-10 animate-scroll-cue" style={{ background: 'var(--voie-ink-muted)' }} />
      </div>
    </section>
  )
}
