'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Magnetic from '@/components/ui/Magnetic'
import InkCanvas from '@/components/voie/InkCanvas'
import { createLetterPhysics, type LetterPhysics } from '@/lib/letterPhysics'

gsap.registerPlugin(ScrollTrigger)

/**
 * Chapter 01 — White belt. A poster: huge type, one photo block, one CTA.
 * The title letters stay throwable (randori) and the cursor still inks
 * cobalt into the paper.
 */
export default function ChapterBlanc() {
  const locale = useLocale()
  const en = locale === 'en'
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [randoriReady, setRandoriReady] = useState(false)

  const lines = en ? ['EVERYONE', 'STARTS', 'HERE.'] : ['TOUT LE MONDE', 'COMMENCE', 'ICI.']

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
    gsap.set('.blanc-photo', { clipPath: 'inset(0% 0% 100% 0%)' })

    // The photo drifts slower than the page — poster depth
    gsap.to('.blanc-photo', {
      yPercent: 12,
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
    tl.to('.blanc-line', { yPercent: 0, stagger: 0.1, duration: 1.1, ease: 'power4.out' })
      .to('.blanc-photo', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'power4.inOut' }, '-=0.8')
      .to('.blanc-fade', { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.7')
  }, { scope: sectionRef, dependencies: [open] })

  // Randori mode — once the kata settles, the letters become throwable.
  useEffect(() => {
    if (!randoriReady) return
    const section = sectionRef.current
    if (!section) return

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
      data-voie-bg="#F6F5F2"
      data-voie-ink="#0B0B0D"
      data-voie-muted="#5A5A60"
      data-voie-hairline="rgba(11,11,13,0.14)"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden px-8 md:px-16 lg:px-20 py-32"
    >
      {/* The cursor inks cobalt into the paper */}
      <InkCanvas drops color={[0.11, 0.25, 1.0]} maxAlpha={0.55} />

      {/* Photo block — poster panel */}
      <div className="blanc-photo absolute right-8 md:right-16 lg:right-20 top-1/2 -translate-y-1/2 w-[34vw] max-w-md aspect-[3/4] hidden lg:block border-4 border-[var(--voie-ink)] overflow-hidden">
        <Image
          src="/images/voie/competition.jpg"
          alt={en ? 'Judo throw in competition' : 'Projection de judo en compétition'}
          fill
          sizes="34vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="relative max-w-7xl">
        <p className="blanc-fade font-heading text-sm md:text-base mb-6 text-royal">
          01 — {en ? 'White belt' : 'Ceinture blanche'}
        </p>

        <h1
          className="voie-title font-heading leading-[.92] mb-8 select-none"
          style={{ fontSize: 'clamp(44px, 7.6vw, 122px)', color: 'var(--voie-ink)' }}
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
          className="blanc-fade text-base md:text-lg font-medium max-w-md leading-snug mb-4"
          style={{ color: 'var(--voie-ink-muted)' }}
        >
          {en
            ? 'White belt. First bow. First step onto the tatami. Since 1970, every champion of this club has started exactly here.'
            : 'Ceinture blanche. Premier salut. Premier pas sur le tatami. Depuis 1970, chaque champion du club a commencé exactement ici.'}
        </p>

        {/* The randori invitation */}
        <p
          className="text-[10px] tracking-[.25em] uppercase font-semibold mb-10 transition-opacity duration-700"
          style={{ color: 'var(--voie-ink-muted)', opacity: randoriReady ? 0.8 : 0 }}
        >
          {en
            ? 'Grab a letter — try a throw. The dojo will tidy up.'
            : 'Attrape une lettre — essaie une projection. Le dojo rangera.'}
        </p>

        <div className="blanc-fade">
          <Magnetic>
            <Link
              href={`/${locale}/inscription`}
              className="btn-wipe inline-flex font-heading text-sm md:text-base bg-royal text-white px-9 py-5 hover:text-white"
              style={{ ['--wipe-bg' as string]: '#0B0B0D' }}
            >
              {en ? 'Start judo' : 'Commencer le judo'}
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="blanc-fade absolute bottom-8 left-8 md:left-16 lg:left-20 flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[.3em] uppercase font-semibold [writing-mode:vertical-rl]" style={{ color: 'var(--voie-ink-muted)' }}>
          {en ? 'Follow the way' : 'Suivre la voie'}
        </span>
        <span className="block w-[3px] h-10 animate-scroll-cue bg-royal" />
      </div>
    </section>
  )
}
