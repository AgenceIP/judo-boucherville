'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { useTranslations } from 'next-intl'

gsap.registerPlugin(ScrollTrigger)

const achievements = [
  { label: 'Médailles d\'or — provinciaux U15-U16', value: 37, medaille: '🥇' },
  { label: 'Médailles d\'argent — provinciaux U15-U16', value: 23, medaille: '🥈' },
  { label: 'Médailles de bronze — provinciaux U15-U16', value: 24, medaille: '🥉' },
  { label: 'Médailles — Championnats canadiens 2023', value: 16, medaille: '🏅' },
]

export default function AchievementsSection() {
  const t = useTranslations('home')
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.achievement-item', {
      opacity: 0, y: 30, stagger: 0.1, duration: 0.6,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-[#1a1200] to-bg-base border-y border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gold tracking-wider">
            {t('achievements_title')}
          </h2>
          <p className="text-muted mt-4">2002–2024 · Championnats provinciaux et nationaux</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {achievements.map(a => (
            <div key={a.label} className="achievement-item text-center">
              <span className="text-4xl block mb-3">{a.medaille}</span>
              <div className="font-heading text-5xl text-gold">
                <AnimatedCounter end={a.value} />
              </div>
              <p className="text-muted text-xs mt-2 leading-relaxed">{a.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Championnats du monde Kata', desc: 'Jérôme Lajoie & Jacob St-Jean — 8e place à Cancún 2018' },
            { title: 'Premier club sport-études', desc: 'Premier club au Canada avec un programme sport-études à l\'École secondaire De Mortagne' },
            { title: 'Temple de la renommée', desc: 'Marcel Bourelly intronisé au Temple de la renommée de Judo Québec' },
          ].map(item => (
            <div key={item.title} className="bg-white/5 border border-gold/10 rounded-xl p-5">
              <h3 className="font-heading text-base text-gold mb-2">{item.title}</h3>
              <p className="text-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
