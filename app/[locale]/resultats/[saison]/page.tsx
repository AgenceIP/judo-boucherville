import { notFound } from 'next/navigation'
import { resultats } from '@/data/archive'
import PageHero from '@/components/shared/PageHero'
import SeasonArchive from '@/components/archive/SeasonArchive'

type Props = { params: Promise<{ locale: string; saison?: string }> }

export function generateStaticParams() {
  return ['fr', 'en'].flatMap(locale => resultats.map(s => ({ locale, saison: s.saison })))
}

export async function generateMetadata({ params }: Props) {
  const { locale, saison } = await params
  const title = locale === 'fr' ? 'Résultats' : 'Results'
  return { title: saison ? `${title} ${saison}` : title }
}

// Also serves /resultats (latest season)
export default async function ResultatsPage({ params }: Props) {
  const { locale, saison } = await params
  const s = saison ? resultats.find(r => r.saison === saison) : resultats[0]
  if (!s) notFound()
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Résultats de compétition' : 'Competition Results'}
        subtitle={fr
          ? 'Toutes les médailles et performances du club, saison après saison.'
          : 'Every club medal and performance, season by season (archive in French).'}
      />
      <SeasonArchive base="resultats" saisons={resultats} saison={s} locale={locale} />
    </>
  )
}
