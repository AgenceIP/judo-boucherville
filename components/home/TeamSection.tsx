'use client'
import { useTranslations, useLocale } from 'next-intl'
import InstructorCard from '@/components/ui/InstructorCard'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

const instructors = [
  { nom: 'Fayçal Bousbiat', grade: '7e dan', role: 'Directeur technique', disciplines: ['judo', 'kata'], slug: 'faycal-bousbiat' },
  { nom: 'Daniel De Angelis', grade: '7e dan', role: 'Professeur', disciplines: ['judo', 'kata'], slug: 'daniel-de-angelis' },
  { nom: 'Donald Ferland', grade: '6e dan', role: 'Professeur', disciplines: ['judo', 'kata'], slug: 'donald-ferland' },
  { nom: 'Sylvain Yargeau', grade: '4e dan', role: 'Professeur Aiki Ju-Jitsu', disciplines: ['aiki-jujitsu'], slug: 'sylvain-yargeau' },
]

export default function TeamSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const titleRef = useReveal<HTMLDivElement>()
  const gridRef = useReveal<HTMLDivElement>()

  return (
    <section className="py-28 md:py-36 bg-bg-base">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="mb-14">
          <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-4">Corps enseignant</p>
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('team_title')}
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12 reveal-stagger">
          {instructors.map(i => (
            <InstructorCard key={i.slug} {...i} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/equipe`}
            className="inline-flex font-heading tracking-widest uppercase text-[13px] border border-white/20 text-muted px-8 py-3 hover:border-gold hover:text-gold transition-all duration-200"
          >
            Voir toute l&apos;équipe
          </Link>
        </div>
      </div>
    </section>
  )
}
