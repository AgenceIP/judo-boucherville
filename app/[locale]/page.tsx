import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import ProgrammesSection from '@/components/home/ProgrammesSection'
import ClubSection from '@/components/home/ClubSection'
import TeamSection from '@/components/home/TeamSection'
import AchievementsSection from '@/components/home/AchievementsSection'
import ChallengeSection from '@/components/home/ChallengeSection'
import NewsSection from '@/components/home/NewsSection'
import CtaSection from '@/components/home/CtaSection'

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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProgrammesSection />
      <ClubSection />
      <TeamSection />
      <AchievementsSection />
      <ChallengeSection />
      <NewsSection />
      <CtaSection />
    </>
  )
}
