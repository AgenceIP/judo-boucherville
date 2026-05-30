'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  { year: '1970', label: 'Fondation', desc: 'Marcel Bourelly fonde le club "Kowakan - Shukokaé" au centre La Seigneurie.' },
  { year: '1979', label: 'Incorporation', desc: 'Devient "Club de Judo Boucherville Inc." — 1er club au Québec en membres et résultats.' },
  { year: '2008', label: 'Centre régional', desc: 'Désigné Centre Régional de Développement (CRD) par Judo Québec.' },
  { year: '2017', label: 'Nouveau dojo', desc: 'Inauguration du Dojo Marcel Bourelly au Complexe aquatique Laurie-Ève Cormier.' },
  { year: '2026', label: "Aujourd'hui", desc: "245 membres, club AAA, et une tradition d'excellence depuis 55 ans." },
]

export default function ClubSection() {
  const t = useTranslations('home')
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useReveal<HTMLDivElement>()

  useGSAP(() => {
    gsap.to(imageRef.current, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    gsap.from('.timeline-item', {
      opacity: 0,
      x: -20,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.timeline-item',
        start: 'top 85%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-28 md:py-36 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Left */}
          <div>
            <div ref={titleRef} className="mb-10">
              <p className="text-royal text-[11px] tracking-[.4em] uppercase mb-4">Notre histoire</p>
              <h2 className="font-heading text-[clamp(48px,7vw,90px)] text-white leading-[.9] tracking-tight">
                {t('club_title')}
              </h2>
            </div>
            <p className="text-muted leading-relaxed mb-12 text-base max-w-lg">
              Le Club de Judo Boucherville, fondé en 1970 par Marcel Bourelly, est aujourd&apos;hui le
              premier club de judo au Québec. Reconnu AAA par Judo Québec, il a formé plus de
              50 ceintures noires et des dizaines de champions provinciaux et nationaux.
            </p>

            <div className="relative pl-8 border-l border-white/[0.08]">
              {timeline.map(item => (
                <div key={item.year} className="timeline-item mb-8 last:mb-0 relative">
                  <div className="absolute -left-[37px] w-3 h-3 rounded-full bg-royal border-2 border-bg-surface" />
                  <span className="font-heading text-royal text-2xl">{item.year}</span>
                  <p className="font-semibold text-white text-sm mt-0.5">{item.label}</p>
                  <p className="text-muted text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: dojo photo */}
          <div className="relative h-[520px] overflow-hidden">
            <div ref={imageRef} className="absolute inset-0 scale-110">
              <Image
                src="/images/scraped/Autre_dojo.jpg"
                alt="Dojo Marcel Bourelly — Club de Judo Boucherville"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/40 to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
