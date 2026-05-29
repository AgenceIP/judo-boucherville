import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getAllResultats, getSaisons } from '@/data/resultats'
import PageHero from '@/components/shared/PageHero'
import ResultatsClient from '@/components/pages/ResultatsClient'

export const metadata: Metadata = { title: 'Résultats' }

export default async function ResultatsPage() {
  const locale = await getLocale()
  const resultats = getAllResultats()
  const saisons = getSaisons()

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Résultats de compétition' : 'Competition Results'}
        subtitle={locale === 'fr'
          ? 'Toutes les médailles et performances du club, saison après saison.'
          : 'All club medals and performances, season after season.'}
      />
      <ResultatsClient resultats={resultats} saisons={saisons} locale={locale} />
    </>
  )
}
