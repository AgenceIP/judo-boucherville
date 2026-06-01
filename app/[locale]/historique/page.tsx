'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageHero from '@/components/shared/PageHero'

gsap.registerPlugin(ScrollTrigger)

const timelineEvents = [
  { year: '1970', title: 'Fondation du club', description: 'Marcel Bourelly fonde le "Kowakan - Shukokaé" au centre commercial La Seigneurie. Le judo fait son entrée à Boucherville.' },
  { year: '1974', title: 'Transition municipale', description: 'Le club ferme ses portes au centre La Seigneurie et continue ses activités sous les Services des loisirs de la municipalité.' },
  { year: '1979', title: 'Incorporation officielle', description: 'Le 13 août 1979, le club est officiellement incorporé sous le nom "Club de Judo Boucherville Inc." et devient le premier club au Québec en nombre de membres et en résultats sportifs.' },
  { year: '1988', title: 'Programme parascolaire', description: 'Lancement du programme parascolaire dans les écoles de Boucherville — un programme qui en est aujourd\'hui à sa 38e saison.' },
  { year: '1995', title: 'Premier sport-études judo au Canada', description: "Programme sport-études en partenariat avec l'École secondaire De Mortagne — le premier programme de ce genre au Canada." },
  { year: '2001', title: 'Fayçal Bousbiat — directeur technique', description: 'Fayçal Bousbiat devient entraîneur-chef en 2001, puis directeur technique en 2004.' },
  { year: '2008', title: 'Centre Régional de Développement', description: 'Le club obtient le statut de Centre Régional de Développement (CRD) de Judo Québec.' },
  { year: '2017', title: 'Dojo Marcel Bourelly', description: 'Le 9 septembre 2017, inauguration du Dojo Marcel Bourelly au Complexe aquatique Laurie-Ève Cormier, 490 chemin du Lac. Une installation de classe mondiale en hommage au fondateur.' },
  { year: '2026', title: "55 ans d'excellence", description: '245 membres, club reconnu AAA par Judo Québec, 126 ceintures noires, 2 olympiens, et une tradition ininterrompue depuis 1970.' },
]

export default function HistoriquePage() {
  const timelineRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const items = timelineRef.current?.querySelectorAll('.history-item')
    if (!items?.length) return
    gsap.from(items, {
      opacity: 0,
      x: -20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: timelineRef.current, start: 'top 80%' },
    })
  }, { scope: timelineRef })

  return (
    <>
      <PageHero
        title="Historique du club"
        subtitle="Plus de 55 ans de tradition, d'excellence et de passion pour le judo."
      />

      {/* Founder */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            <div>
              <p className="text-[10px] text-muted uppercase tracking-[.25em] mb-3">Fondateur</p>
              <h2 className="font-heading text-4xl text-white tracking-tight mb-1">Marcel Bourelly</h2>
              <p className="text-royal text-sm">Ceinture noire 7e dan</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted leading-relaxed">
                Fondateur du club en 1970, ex-compétiteur et entraîneur provincial et national jusqu&apos;en 1983.
                Marcel Bourelly a été intronisé au Temple de la renommée de Judo Québec à titre de
                pionnier-bâtisseur et de directeur technique ayant formé plus de 50 ceintures noires.
                Le dojo porte son nom en son honneur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div ref={timelineRef} className="relative pl-8 border-l border-white/[0.06]">
            {timelineEvents.map(event => (
              <div key={event.year} className="history-item mb-10 last:mb-0 relative">
                <div className="absolute -left-[37px] w-2.5 h-2.5 bg-royal border-2 border-bg-surface mt-1.5" />
                <span className="font-heading text-royal text-3xl leading-none">{event.year}</span>
                <h3 className="font-heading text-lg text-white mt-1 mb-2 tracking-wide">{event.title}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-2xl">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
