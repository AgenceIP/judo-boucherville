'use client'
import { useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const BELTS = [
  { color: '#F2EFE7', fr: 'Blanche', en: 'White' },
  { color: '#E5C24A', fr: 'Jaune', en: 'Yellow' },
  { color: '#DE8A3A', fr: 'Orange', en: 'Orange' },
  { color: '#4E8F52', fr: 'Verte', en: 'Green' },
  { color: '#4169E1', fr: 'Bleue', en: 'Blue' },
  { color: '#7A4F2E', fr: 'Marron', en: 'Brown' },
  { color: '#1A1A1A', fr: 'Noire', en: 'Black' },
]

/**
 * The scroll progress indicator is a belt. It fills as you descend the page
 * and is promoted through the grades — white at the top, black at the bottom.
 */
export default function BeltRail() {
  const locale = useLocale()
  const fillRef = useRef<HTMLDivElement>(null)
  const [grade, setGrade] = useState(0)

  useGSAP(() => {
    const root = document.getElementById('voie-root')
    const fill = fillRef.current
    if (!root || !fill) return

    let current = 0
    ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const idx = Math.min(BELTS.length - 1, Math.floor(self.progress * BELTS.length))
        gsap.set(fill, { scaleY: self.progress })
        if (idx !== current) {
          current = idx
          setGrade(idx)
          gsap.to(fill, { backgroundColor: BELTS[idx].color, duration: 0.6, ease: 'power2.out' })
        }
      },
    })
  })

  const belt = BELTS[grade]

  return (
    <div className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-5 pointer-events-none">
      <span
        className="text-[9px] tracking-[.35em] uppercase [writing-mode:vertical-rl] transition-colors duration-500"
        style={{ color: 'var(--voie-ink-muted)' }}
      >
        {locale === 'en' ? `${belt.en} belt` : `Ceinture ${belt.fr.toLowerCase()}`}
      </span>
      <div className="relative h-[30vh] w-[3px]" style={{ background: 'var(--voie-hairline)' }}>
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top scale-y-0"
          style={{ backgroundColor: BELTS[0].color }}
        />
      </div>
    </div>
  )
}
