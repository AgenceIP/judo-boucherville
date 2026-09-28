import { Metadata } from 'next'
import EntryRitual from '@/components/voie/EntryRitual'
import VoieConductor from '@/components/voie/VoieConductor'
import BeltRail from '@/components/voie/BeltRail'
import ChapterBlanc from '@/components/voie/ChapterBlanc'
import ChapterEcole from '@/components/voie/ChapterEcole'
import VoieMarquee from '@/components/voie/VoieMarquee'
import ChapterForce from '@/components/voie/ChapterForce'
import ChapterProjection from '@/components/voie/ChapterProjection'
import ChapterNoir from '@/components/voie/ChapterNoir'
import ChapterFinale from '@/components/voie/ChapterFinale'
import { club } from '@/data/club'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsClub',
  name: club.nom,
  url: club.site,
  logo: `${club.site}/images/logo-cjb-improved.png`,
  telephone: '+1-450-655-1888',
  email: club.courriel,
  foundingDate: '1970-03-01',
  sport: ['Judo', 'Aiki Ju-Jitsu', 'Brazilian Jiu-Jitsu'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '490, chemin du Lac',
    addressLocality: 'Boucherville',
    addressRegion: 'QC',
    postalCode: 'J4B 6X3',
    addressCountry: 'CA',
  },
  sameAs: [club.facebook, club.instagram, club.youtube, club.tiktok, club.twitter],
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr'
      ? 'Club de Judo Boucherville — Fondé en 1970, Club AAA'
      : 'Judo Boucherville Club — Founded in 1970, AAA Club',
    description: locale === 'fr'
      ? 'Club de Judo Boucherville. Judo, Aiki Ju-Jitsu, Jiu-Jitsu Brésilien. 490 chemin du Lac, Boucherville QC. Tél. : 450 655-1888.'
      : 'Judo Boucherville Club. Judo, Aiki Ju-Jitsu, Brazilian Jiu-Jitsu. 490 chemin du Lac, Boucherville QC. Tel: 450 655-1888.',
  }
}

/**
 * La Voie — the homepage is the path from white belt to black belt.
 * The world literally darkens as you scroll; the belt rail grades your descent.
 */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EntryRitual />
      <VoieConductor />
      <BeltRail />
      <div id="voie-root">
        <ChapterBlanc />
        <ChapterEcole />
        <VoieMarquee />
        <ChapterForce />
        <ChapterProjection />
        <ChapterNoir />
        <ChapterFinale />
      </div>
    </>
  )
}
