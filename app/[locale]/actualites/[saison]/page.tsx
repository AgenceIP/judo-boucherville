import { notFound } from 'next/navigation'
import { actualites } from '@/data/archive'
import PageHero from '@/components/shared/PageHero'
import SeasonArchive from '@/components/archive/SeasonArchive'

type Props = { params: Promise<{ locale: string; saison?: string }> }

export function generateStaticParams() {
  return ['fr', 'en'].flatMap(locale => actualites.map(s => ({ locale, saison: s.saison })))
}

export async function generateMetadata({ params }: Props) {
  const { locale, saison } = await params
  const title = locale === 'fr' ? 'Actualités' : 'News'
  return { title: saison ? `${title} ${saison}` : title }
}

// Also serves /actualites (latest season)
export default async function ActualitesPage({ params }: Props) {
  const { locale, saison } = await params
  const s = saison ? actualites.find(r => r.saison === saison) : actualites[0]
  if (!s) notFound()
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Actualités' : 'News'}
        subtitle={fr
          ? 'Nouvelles, sélections, grades et événements du club depuis 2008.'
          : 'Club news, selections, promotions and events since 2008 (archive in French).'}
      />
      <SeasonArchive base="actualites" saisons={actualites} saison={s} locale={locale} />
    </>
  )
}
