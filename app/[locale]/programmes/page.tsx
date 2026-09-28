import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getAllProgrammes } from '@/data/programmes'
import PageHero from '@/components/shared/PageHero'
import ProgrammeCard from '@/components/ui/ProgrammeCard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Programmes' : 'Programs',
    description: locale === 'fr'
      ? 'Judo parents-enfants, jeunes, compétition et sport-études, adultes, Aiki Ju-Jitsu, Jiu-Jitsu brésilien, autodéfense, 50 ans et plus et camp d’été : horaires, âges et tarifs.'
      : 'Parent-child, youth, competitive and sport-studies judo, adults, Aiki Ju-Jitsu, Brazilian Jiu-Jitsu, self-defence, 50+ and summer camp: schedules, ages and fees.',
  }
}

const categoryLabels = {
  enfants: { fr: 'Jeunes', en: 'Youth' },
  adultes: { fr: 'Adultes', en: 'Adults' },
  'arts-martiaux': { fr: 'Arts martiaux', en: 'Martial arts' },
}

export default async function ProgrammesPage() {
  const locale = await getLocale()
  const programmes = getAllProgrammes()

  const grouped = {
    enfants: programmes.filter(p => p.categorie === 'enfants'),
    adultes: programmes.filter(p => p.categorie === 'adultes'),
    'arts-martiaux': programmes.filter(p => p.categorie === 'arts-martiaux'),
  }

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Nos programmes' : 'Our Programs'}
        subtitle={locale === 'fr'
          ? 'Judo, Aiki Ju-Jitsu, Jiu-Jitsu Brésilien — pour tous les âges et tous les niveaux.'
          : 'Judo, Aiki Ju-Jitsu, Brazilian Jiu-Jitsu — for all ages and levels.'}
      />

      <div className="reveal-hidden revealed max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map(cat => (
          grouped[cat].length > 0 && (
            <div key={cat}>
              <h2 className="font-heading text-2xl text-muted tracking-widest uppercase mb-8 border-b border-white/5 pb-4">
                {categoryLabels[cat][locale === 'fr' ? 'fr' : 'en']}
              </h2>
              <div className="border-b border-white/[0.06]">
                {grouped[cat].map(prog => (
                  <ProgrammeCard
                    key={prog.slug}
                    titre={locale === 'fr' ? prog.titre : prog.titreEn}
                    description={locale === 'fr' ? prog.resume : prog.resumeEn}
                    horaire={prog.horaire}
                    slug={prog.slug}
                    categorie={prog.categorie}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </>
  )
}
