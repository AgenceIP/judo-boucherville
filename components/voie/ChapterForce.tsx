'use client'
import { useRef } from 'react'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import RevealText from '@/components/ui/RevealText'

gsap.registerPlugin(ScrollTrigger)

/** Chapter 03 — Strength. Dusk falls; the numbers speak. */
export default function ChapterForce() {
  const locale = useLocale()
  const en = locale === 'en'
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    { value: 174, suffix: '', label: en ? 'Medals at provincial & national championships' : 'Médailles aux championnats provinciaux & nationaux', desc: '2002–2024' },
    { value: 55, suffix: '+', label: en ? 'Years of excellence' : "Années d'excellence", desc: en ? 'Founded in 1970 by Marcel Bourelly' : 'Fondé en 1970 par Marcel Bourelly' },
    { value: 2, suffix: '', label: en ? 'Olympians trained at the club' : 'Olympiens formés au club', desc: en ? 'Olympic Games' : 'Jeux olympiques' },
    { value: 245, suffix: '', label: en ? 'Active members in 2026' : 'Membres actifs en 2026', desc: en ? 'Judokas, black belts and competitors' : 'Judokas, ceintures noires et compétiteurs' },
  ]

  useGSAP(() => {
    gsap.from('.force-line', {
      scaleX: 0,
      transformOrigin: 'left center',
      stagger: 0.12,
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
    gsap.from('.force-row', {
      opacity: 0,
      x: -24,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      data-voie-bg="#222A47"
      data-voie-ink="#F2F4FB"
      data-voie-muted="#97A2C0"
      data-voie-hairline="rgba(242,244,251,0.14)"
      data-voie-aurora="1"
      className="py-28 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <p className="text-[10px] tracking-[.4em] uppercase mb-6" style={{ color: 'var(--voie-ink-muted)' }}>
          <span className="font-jp text-xs mr-3 opacity-60">三</span>
          {en ? 'Chapter 03 · Strength' : 'Chapitre 03 · La force'}
        </p>
        <RevealText
          as="h2"
          className="voie-title font-heading text-[clamp(52px,9vw,120px)] leading-[.9] tracking-tight"
          style={{ color: 'var(--voie-ink)' }}
        >
          {en ? 'STRENGTH IN NUMBERS' : 'LA FORCE DU NOMBRE'}
        </RevealText>
      </div>

      <div>
        {stats.map((stat, i) => (
          <div key={i} className="relative group">
            <div className="force-line absolute top-0 inset-x-0 h-px" style={{ background: 'var(--voie-hairline)' }} />
            <div className="force-row">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-8 md:py-10 flex items-center gap-8 md:gap-12">
                <span
                  className="font-heading text-royal glow-royal leading-none shrink-0 tabular-nums"
                  style={{ fontSize: 'clamp(64px, 8vw, 130px)', width: 'clamp(120px, 18vw, 280px)', textAlign: 'right' }}
                >
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>
                <div className="border-l pl-8 md:pl-12 transition-colors duration-300" style={{ borderColor: 'var(--voie-hairline)' }}>
                  <p className="font-heading text-xl sm:text-2xl md:text-3xl uppercase tracking-wider leading-tight" style={{ color: 'var(--voie-ink)' }}>
                    {stat.label}
                  </p>
                  <p className="text-sm mt-1.5" style={{ color: 'var(--voie-ink-muted)' }}>{stat.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="force-line h-px" style={{ background: 'var(--voie-hairline)' }} />
      </div>
    </section>
  )
}
