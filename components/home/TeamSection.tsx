'use client'
import { useTranslations, useLocale } from 'next-intl'
import InstructorCard from '@/components/ui/InstructorCard'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

const instructors = [
  { nom: 'Fayçal Bousbiat', grade: '7e dan', role: 'Directeur technique', disciplines: ['judo', 'kata'], slug: 'faycal-bousbiat' },
  { nom: 'Daniel De Angelis', grade: '7e dan', role: 'Professeur', disciplines: ['judo', 'kata'], slug: 'daniel-de-angelis' },
  { nom: 'Jacques Coté', grade: '6e dan', role: 'Professeur', disciplines: ['judo'], slug: 'jacques-cote' },
  { nom: 'Éric De Rome', grade: '5e dan', role: 'Professeur', disciplines: ['judo'], slug: 'eric-de-rome' },
]

export default function TeamSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const titleRef = useReveal<HTMLDivElement>()

  return (
    <section className="py-28 md:py-36 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="flex items-end justify-between mb-0 gap-6">
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('team_title')}
          </h2>
          <Link
            href={`/${locale}/equipe`}
            className="text-[11px] tracking-[.25em] uppercase text-muted hover:text-white transition-colors pb-2 shrink-0"
          >
            {t('team_cta')} →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
          {instructors.map(i => (
            <InstructorCard key={i.slug} {...i} />
          ))}
        </div>

      </div>
    </section>
  )
}
