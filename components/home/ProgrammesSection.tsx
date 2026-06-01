'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import ProgrammeCard from '@/components/ui/ProgrammeCard'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/useReveal'

const programmesData = [
  { titre: 'Judo compétition', description: "Athletes aiming for provincial, national and international excellence.", horaire: 'Lun–Ven 18h–19h', slug: 'judo-competition', categorie: 'adultes' as const },
  { titre: 'Judo enfants', description: 'Initiation, développement moteur et socialisation pour les jeunes judokas.', horaire: 'Sam 10h15–12h30', slug: 'judo-enfants', categorie: 'enfants' as const },
  { titre: 'Judo adultes', description: 'Techniques, compétition ou mise en forme — tous niveaux.', horaire: 'Lun/Mer 19h–21h', slug: 'judo-adultes', categorie: 'adultes' as const },
  { titre: 'Parents / Enfants', description: 'Découvrir le judo en famille dans un esprit de partage.', horaire: 'Sam 9h–10h', slug: 'parents-enfants', categorie: 'enfants' as const },
  { titre: 'Aiki Ju-Jitsu', description: 'Projections, contrôles articulaires, percussions — un art martial complet.', horaire: 'Mar/Jeu 20h–21h30', slug: 'aiki-jujitsu', categorie: 'arts-martiaux' as const },
  { titre: 'Jiu-Jitsu Brésilien', description: 'Principes du BJJ debout et au sol. Dès 15 ans.', horaire: 'Mar/Jeu 19h45–21h', slug: 'jiu-jitsu-bresilien', categorie: 'arts-martiaux' as const },
  { titre: 'Sport-études', description: "Programme élite en partenariat avec l'École secondaire De Mortagne.", horaire: 'Selon école', slug: 'sport-etudes', categorie: 'adultes' as const },
  { titre: 'Camp de jour', description: 'Techniques et discipline pour les jeunes judokas cet été.', horaire: 'Été', slug: 'camp-de-jour', categorie: 'enfants' as const },
]

const filters = ['all', 'enfants', 'adultes', 'arts-martiaux'] as const

export default function ProgrammesSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [active, setActive] = useState<typeof filters[number]>('all')
  const titleRef = useReveal<HTMLDivElement>()

  const filtered = active === 'all' ? programmesData : programmesData.filter(p => p.categorie === active)

  return (
    <section className="py-28 md:py-36 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('programmes_title')}
          </h2>

          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={cn(
                  'px-4 py-1.5 text-[10px] tracking-[.2em] uppercase font-medium transition-colors duration-200',
                  active === f
                    ? 'bg-royal text-white'
                    : 'border border-white/10 text-muted hover:text-white hover:border-white/30'
                )}
              >
                {f === 'all' ? t('programmes_filter_all')
                  : f === 'enfants' ? t('programmes_filter_children')
                  : f === 'adultes' ? t('programmes_filter_adults')
                  : t('programmes_filter_martial')}
              </button>
            ))}
          </div>
        </div>

        <div>
          {filtered.map(prog => (
            <ProgrammeCard key={prog.slug} {...prog} />
          ))}
          <div className="border-t border-white/[0.06]" />
        </div>

        <div className="mt-10">
          <Link
            href={`/${locale}/programmes`}
            className="text-[11px] tracking-[.25em] uppercase text-muted hover:text-white transition-colors"
          >
            Voir tous les programmes →
          </Link>
        </div>
      </div>
    </section>
  )
}
