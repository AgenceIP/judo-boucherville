'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 174, suffix: '', label: 'Médailles aux championnats provinciaux & nationaux', desc: '2002–2024' },
  { value: 55,  suffix: '+', label: "Années d'excellence", desc: 'Fondé en 1970 par Marcel Bourelly' },
  { value: 2,   suffix: '', label: 'Olympiens formés au club', desc: 'Jeux olympiques' },
  { value: 245, suffix: '', label: 'Membres actifs en 2026', desc: 'Judokas, ceintures noires et compétiteurs' },
]

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    // Hairlines draw from the left, then each row slides in
    gsap.from('.stat-line', {
      scaleX: 0,
      transformOrigin: 'left center',
      stagger: 0.12,
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
    gsap.from('.stat-row', {
      opacity: 0,
      x: -24,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-transparent">
      {stats.map((stat, i) => (
        <div key={i} className="relative group">
          <div className="stat-line absolute top-0 inset-x-0 h-px bg-white/[0.08]" />
          <div className="stat-row">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-8 md:py-10 flex items-center gap-8 md:gap-12">
              <span
                className="font-heading text-royal leading-none shrink-0 tabular-nums"
                style={{ fontSize: 'clamp(64px, 8vw, 130px)', width: 'clamp(120px, 18vw, 280px)', textAlign: 'right' }}
              >
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </span>
              <div className="border-l border-white/[0.08] pl-8 md:pl-12 group-hover:border-royal/30 transition-colors duration-300">
                <p className="font-heading text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
                <p className="text-muted text-sm mt-1.5">{stat.desc}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="stat-line h-px bg-white/[0.08]" />
    </section>
  )
}
