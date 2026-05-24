'use client'
import { useTranslations, useLocale } from 'next-intl'
import InstructorCard from '@/components/ui/InstructorCard'
import Button from '@/components/ui/Button'

const instructors = [
  { nom: 'Fayçal Bousbiat', grade: '7e dan', role: 'Directeur technique', disciplines: ['judo', 'kata'], slug: 'faycal-bousbiat' },
  { nom: 'Daniel De Angelis', grade: '7e dan', role: 'Professeur', disciplines: ['judo', 'kata'], slug: 'daniel-de-angelis' },
  { nom: 'Donald Ferland', grade: '6e dan', role: 'Professeur', disciplines: ['judo', 'kata'], slug: 'donald-ferland' },
  { nom: 'Sylvain Yargeau', grade: '4e dan', role: 'Professeur Aiki Ju-Jitsu', disciplines: ['aiki-jujitsu'], slug: 'sylvain-yargeau' },
]

export default function TeamSection() {
  const t = useTranslations('home')
  const locale = useLocale()

  return (
    <section className="py-24 bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wider">
            {t('team_title')}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {instructors.map(i => (
            <InstructorCard key={i.slug} {...i} />
          ))}
        </div>
        <div className="text-center">
          <Button href={`/${locale}/equipe`} variant="outline">
            Voir toute l&apos;équipe
          </Button>
        </div>
      </div>
    </section>
  )
}
