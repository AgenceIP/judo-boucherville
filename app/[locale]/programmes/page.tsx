import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getAllProgrammes } from '@/data/programmes'
import PageHero from '@/components/shared/PageHero'
import ProgrammeCard from '@/components/ui/ProgrammeCard'

export const metadata: Metadata = { title: 'Programmes' }

const categoryLabels = {
  enfants: 'Jeunes',
  adultes: 'Adultes',
  'arts-martiaux': 'Arts martiaux',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map(cat => (
          grouped[cat].length > 0 && (
            <div key={cat}>
              <h2 className="font-heading text-2xl text-muted tracking-widest uppercase mb-8 border-b border-white/5 pb-4">
                {categoryLabels[cat]}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[cat].map(prog => (
                  <ProgrammeCard
                    key={prog.id}
                    titre={locale === 'fr' ? prog.titre : (prog.titreEn || prog.titre)}
                    description={locale === 'fr' ? prog.description : (prog.descriptionEn || prog.description)}
                    horaire={prog.horaires[0] ? `${prog.horaires[0].jours} ${prog.horaires[0].heures}` : ''}
                    slug={prog.slug}
                    categorie={prog.categorie}
                    icon={prog.icon}
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
