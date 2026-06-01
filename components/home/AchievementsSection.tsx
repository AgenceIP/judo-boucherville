'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { useTranslations } from 'next-intl'
import { useReveal } from '@/hooks/useReveal'

gsap.registerPlugin(ScrollTrigger)

const medals = [
  { value: 84, label: "Médailles d'or", sub: 'Provinciaux & Nationaux 2002–2025' },
  { value: 51, label: "Médailles d'argent", sub: 'Provinciaux & Nationaux 2002–2025' },
  { value: 39, label: 'Médailles de bronze', sub: 'Provinciaux & Nationaux 2002–2025' },
]

const highlights = [
  { title: 'Championnats du monde Kata', desc: 'Jérôme Lajoie & Jacob St-Jean — 8e place à Cancún 2018' },
  { title: 'Premier sport-études judo au Canada', desc: "Programme en partenariat avec l'École secondaire De Mortagne depuis 1995" },
  { title: 'Temple de la renommée', desc: 'Marcel Bourelly intronisé au Temple de la renommée de Judo Québec' },
]

export default function AchievementsSection() {
  const t = useTranslations('home')
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useReveal<HTMLDivElement>()

  useGSAP(() => {
    gsap.from('.medal-row', {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-28 md:py-36 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="mb-16">
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-royal leading-[.9] tracking-tight">
            {t('achievements_title')}
          </h2>
          <p className="text-muted mt-4 text-sm tracking-wider">2002–2025 · Championnats provinciaux et nationaux</p>
        </div>

        <div className="mb-20">
          {medals.map(m => (
            <div
              key={m.label}
              className="medal-row border-t border-white/[0.06] group hover:border-royal/30 transition-colors duration-300"
            >
              <div className="py-7 flex items-center gap-8 md:gap-16">
                <span
                  className="font-heading text-royal leading-none shrink-0 tabular-nums"
                  style={{ fontSize: 'clamp(52px, 6vw, 96px)', width: 'clamp(80px, 12vw, 180px)', textAlign: 'right' }}
                >
                  <AnimatedCounter end={m.value} />
                </span>
                <div className="border-l border-white/[0.08] pl-8 group-hover:border-royal/20 transition-colors duration-300">
                  <p className="font-heading text-xl md:text-2xl text-white tracking-wider">{m.label}</p>
                  <p className="text-muted text-sm mt-1">{m.sub}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-white/[0.06]" />
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/[0.04]">
          {highlights.map(item => (
            <div key={item.title} className="bg-bg-surface p-8">
              <h3 className="font-heading text-base text-white mb-3 tracking-wider leading-snug">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
