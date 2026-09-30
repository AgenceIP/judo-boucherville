import { notFound } from 'next/navigation'
import { getSaison, getSaisons } from '@/lib/content'
import PageHero from '@/components/shared/PageHero'
import SeasonArchive from '@/components/archive/SeasonArchive'

type Props = { params: Promise<{ locale: string; saison?: string }> }

export async function generateStaticParams() {
  const saisons = await getSaisons('resultat')
  return ['fr', 'en'].flatMap(locale => saisons.map(saison => ({ locale, saison })))
}

export async function generateMetadata({ params }: Props) {
  const { locale, saison } = await params
  const title = locale === 'fr' ? 'Résultats' : 'Results'
  return { title: saison ? `${title} ${saison}` : title }
}

// Also serves /resultats (latest season)
export default async function ResultatsPage({ params }: Props) {
  const { locale, saison } = await params
  const saisons = await getSaisons('resultat')
  const s = await getSaison('resultat', saison ?? saisons[0] ?? '')
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
      <SeasonArchive base="resultats" saisons={saisons} saison={s} locale={locale} />
    </>
  )
}
