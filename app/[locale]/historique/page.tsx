'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageHero from '@/components/shared/PageHero'

gsap.registerPlugin(ScrollTrigger)

const timelineEvents = [
  { year: '1970', title: 'Fondation du club', description: 'Marcel Bourelly fonde le "Kowakan - Shukokaé" au centre commercial La Seigneurie. Le judo fait son entrée à Boucherville.', icon: '🥋' },
  { year: '1974', title: 'Transition municipale', description: 'Le club ferme ses portes au centre La Seigneurie et continue ses activités sous les Services des loisirs de la municipalité.', icon: '🏛️' },
  { year: '1979', title: 'Incorporation officielle', description: 'Le 13 août 1979, le club est officiellement incorporé sous le nom "Club de Judo Boucherville Inc." et devient le premier club au Québec en nombre de membres et en résultats sportifs.', icon: '📜' },
  { year: '2001', title: 'Fayçal Bousbiat — entraîneur-chef', description: 'Fayçal Bousbiat prend les rênes comme entraîneur-chef, puis devient directeur technique en 2004.', icon: '👊' },
  { year: '2008', title: 'Centre Régional de Développement', description: 'Le club obtient le statut de Centre Régional de Développement (CRD) de Judo Québec, renforçant son rôle dans le développement du judo au Québec.', icon: '⭐' },
  { year: '2015', title: 'Nouveau emplacement', description: 'Le club déménage au Centre multifonctionnel de Boucherville.', icon: '🏠' },
  { year: '2017', title: 'Inauguration du Dojo Marcel Bourelly', description: 'Le 9 septembre 2017, inauguration du Dojo Marcel Bourelly au sein du Complexe aquatique Laurie-Ève Cormier, 490 chemin du Lac. Un hommage au fondateur et une installation de classe mondiale.', icon: '🏟️' },
  { year: '2026', title: "Club AAA, 55 ans d'excellence", description: '245 membres, club reconnu AAA par Judo Québec, des dizaines de champions provinciaux et nationaux. La tradition continue.', icon: '🏆' },
]

export default function HistoriquePage() {
  const timelineRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.history-item', {
      opacity: 0,
      x: (i: number) => i % 2 === 0 ? -50 : 50,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: timelineRef })

  return (
    <>
      <PageHero
        title="Historique du club"
        subtitle="Plus de 55 ans de tradition, d'excellence et de passion pour le judo."
      />

      {/* Founder section */}
      <section className="py-16 bg-bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-full bg-accent-blue/20 flex items-center justify-center shrink-0">
              <span className="font-heading text-5xl text-accent-blue">MB</span>
            </div>
            <div>
              <span className="text-xs text-accent-blue uppercase tracking-widest">Fondateur</span>
              <h2 className="font-heading text-3xl text-foreground tracking-wider mt-1">Marcel Bourelly</h2>
              <p className="text-accent-blue text-sm mb-3">Ceinture noire 7e dan</p>
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
      <section className="py-24 bg-bg-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl text-foreground tracking-wider text-center mb-16">
            Les grandes dates
          </h2>

          <div ref={timelineRef} className="relative">
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

            {timelineEvents.map((event, i) => (
              <div
                key={event.year}
                className={`history-item flex gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`bg-bg-surface border border-white/5 rounded-2xl p-6 inline-block max-w-md ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>
                    <span className="text-2xl block mb-2">{event.icon}</span>
                    <span className="font-heading text-2xl text-accent-blue">{event.year}</span>
                    <h3 className="font-heading text-lg text-foreground mt-1 mb-2 tracking-wide">{event.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{event.description}</p>
                  </div>
                </div>

                <div className="hidden md:flex items-start justify-center w-6 shrink-0 pt-6">
                  <div className="w-3 h-3 rounded-full bg-accent-blue" />
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Presidents */}
      <section className="py-24 bg-bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl text-foreground tracking-wider text-center mb-12">
            Présidents du club
          </h2>
          <p className="text-muted text-center">
            La liste complète des présidents est gérée dans le CMS Sanity.
            Ajoutez les présidents via le Studio à /studio.
          </p>
        </div>
      </section>
    </>
  )
}
