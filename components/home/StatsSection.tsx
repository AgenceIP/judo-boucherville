'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '174', label: "Médailles d'or", desc: 'Championnats provinciaux, nationaux et internationaux' },
  { value: '2', label: 'Olympiens', desc: 'Athlètes des Jeux olympiques formés au club' },
  { value: '55+', label: "Années d'excellence", desc: 'De tradition et de discipline depuis 1970' },
  { value: '245', label: 'Membres', desc: 'Judokas actifs au club en 2026' },
]

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.stat-row', {
      opacity: 0,
      x: -30,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-bg-light">
      {stats.map((stat, i) => (
        <div key={i} className="stat-row border-t border-black/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-7 md:py-9 flex items-center">
            <span className="font-heading text-[clamp(64px,8vw,148px)] text-black leading-none shrink-0 w-[110px] sm:w-[180px] md:w-[240px] lg:w-[290px] text-right pr-8 md:pr-12 tabular-nums">
              {stat.value}
            </span>
            <div className="flex-1 border-l border-black/12 pl-8 md:pl-12">
              <p className="font-heading text-xl sm:text-2xl md:text-3xl text-black uppercase tracking-wider leading-tight">
                {stat.label}
              </p>
              <p className="text-black/45 text-sm mt-1">{stat.desc}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="border-t border-black/10" />
    </section>
  )
}
