'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { useTranslations } from 'next-intl'
import { useReveal } from '@/hooks/useReveal'

gsap.registerPlugin(ScrollTrigger)

const achievements = [
  { label: 'Or — provinciaux U15-U16', value: 37, emoji: '🥇' },
  { label: 'Argent — provinciaux U15-U16', value: 23, emoji: '🥈' },
  { label: 'Bronze — provinciaux U15-U16', value: 24, emoji: '🥉' },
  { label: 'Médailles — canadiens 2023', value: 16, emoji: '🏅' },
]

const highlights = [
  { title: 'Championnats du monde Kata', desc: 'Jérôme Lajoie & Jacob St-Jean — 8e place à Cancún 2018' },
  { title: 'Premier club sport-études au Canada', desc: "Programme sport-études à l'École secondaire De Mortagne" },
  { title: 'Temple de la renommée', desc: 'Marcel Bourelly intronisé au Temple de la renommée de Judo Québec' },
]

export default function AchievementsSection() {
  const t = useTranslations('home')
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useReveal<HTMLDivElement>()

  useGSAP(() => {
    gsap.from('.achievement-item', {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
    gsap.from('.highlight-item', {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.highlight-item', start: 'top 85%' },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-28 md:py-36 bg-transparent border-y border-gold/[0.12]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="mb-16">
          <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-4">Palmarès</p>
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-gold leading-[.9] tracking-tight">
            {t('achievements_title')}
          </h2>
          <p className="text-muted mt-4 text-sm tracking-wider">2002–2024 · Championnats provinciaux et nationaux</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {achievements.map(a => (
            <div key={a.label} className="achievement-item text-center">
              <span className="text-4xl block mb-3">{a.emoji}</span>
              <div className="font-heading text-gold" style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1 }}>
                <AnimatedCounter end={a.value} />
              </div>
              <p className="text-muted text-xs mt-3 leading-relaxed max-w-[140px] mx-auto">{a.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {highlights.map(item => (
            <div key={item.title} className="highlight-item border border-gold/[0.12] bg-gold/[0.03] p-6">
              <h3 className="font-heading text-base text-gold mb-2 tracking-wider">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
