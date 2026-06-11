import { Metadata } from 'next'
import EntryRitual from '@/components/voie/EntryRitual'
import VoieConductor from '@/components/voie/VoieConductor'
import BeltRail from '@/components/voie/BeltRail'
import ChapterBlanc from '@/components/voie/ChapterBlanc'
import ChapterEcole from '@/components/voie/ChapterEcole'
import ChapterForce from '@/components/voie/ChapterForce'
import ChapterProjection from '@/components/voie/ChapterProjection'
import ChapterNoir from '@/components/voie/ChapterNoir'
import ChapterFinale from '@/components/voie/ChapterFinale'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr'
      ? 'Club de Judo Boucherville — Fondé en 1970, Club AAA'
      : 'Judo Boucherville Club — Founded in 1970, AAA Club',
    description: locale === 'fr'
      ? 'Club de Judo Boucherville. Judo, Aiki Ju-Jitsu, Jiu-Jitsu Brésilien. 490 chemin du Lac, Boucherville QC. Tél: (450) 655-1888.'
      : 'Judo Boucherville Club. Judo, Aiki Ju-Jitsu, Brazilian Jiu-Jitsu. 490 chemin du Lac, Boucherville QC. Tel: (450) 655-1888.',
  }
}

/**
 * La Voie — the homepage is the path from white belt to black belt.
 * The world literally darkens as you scroll; the belt rail grades your descent.
 */
export default function HomePage() {
  return (
    <>
      <EntryRitual />
      <VoieConductor />
      <BeltRail />
      <div id="voie-root">
        <ChapterBlanc />
        <ChapterEcole />
        <ChapterForce />
        <ChapterProjection />
        <ChapterNoir />
        <ChapterFinale />
      </div>
    </>
  )
}
