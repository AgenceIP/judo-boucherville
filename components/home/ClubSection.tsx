'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  { year: '1970', label: 'Fondation', desc: 'Marcel Bourelly fonde le club "Kowakan - Shukokaé" au centre La Seigneurie.' },
  { year: '1979', label: 'Incorporation', desc: 'Devient "Club de Judo Boucherville Inc." — 1er club au Québec en membres et résultats.' },
  { year: '2008', label: 'Centre régional', desc: 'Désigné Centre Régional de Développement (CRD) par Judo Québec.' },
  { year: '2017', label: 'Nouveau dojo', desc: 'Inauguration du Dojo Marcel Bourelly au Complexe aquatique Laurie-Ève Cormier.' },
  { year: '2026', label: 'Aujourd\'hui', desc: '245 membres, club AAA, et une tradition d\'excellence depuis 55 ans.' },
]

export default function ClubSection() {
  const t = useTranslations('home')
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to(imageRef.current, {
      yPercent: -15,
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
      x: -30,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.timeline-item',
        start: 'top 85%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-24 bg-bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: text + timeline */}
          <div>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-wider mb-6">
              {t('club_title')}
            </h2>
            <p className="text-muted leading-relaxed mb-10">
              Le Club de Judo Boucherville, fondé en 1970 par Marcel Bourelly, est aujourd&apos;hui le
              premier club de judo au Québec. Reconnu AAA par Judo Québec, il a formé plus de
              50 ceintures noires et des dizaines de champions provinciaux et nationaux.
            </p>

            <div className="relative pl-8 border-l border-white/10">
              {timeline.map((item) => (
                <div key={item.year} className="timeline-item mb-8 last:mb-0">
                  <div className="absolute -left-2 w-4 h-4 rounded-full bg-accent-blue border-2 border-bg-surface" />
                  <span className="font-heading text-accent-blue text-xl">{item.year}</span>
                  <p className="font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="text-muted text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image with parallax */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <div ref={imageRef} className="absolute inset-0 scale-110">
              <div className="w-full h-full bg-gradient-to-br from-bg-surface to-accent-blue/20 flex items-center justify-center">
                <span className="font-heading text-8xl text-accent-blue/20">DOJO</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
