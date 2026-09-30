import { Metadata } from 'next'
import TourHero from '@/components/home/TourHero'
import ClassFinder from '@/components/home/ClassFinder'
import WeekSchedule from '@/components/home/WeekSchedule'
import ValuesMarquee from '@/components/home/ValuesMarquee'
import { Steps, Dojo, Palmares, Faq, FindUs } from '@/components/home/Sections'
import { getClub, getPhotosSite, getProgrammes, type Club } from '@/lib/content'

const jsonLd = (club: Club) => ({
  '@context': 'https://schema.org',
  '@type': 'SportsClub',
  name: club.nom,
  url: club.site,
  logo: `${club.site}/images/brand/cjb-logo.png`,
  image: `${club.site}/hero/tour-ending.jpg`,
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
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { inscription } = await getClub()
  const fr = locale === 'fr'
  return {
    title: { absolute: fr ? 'Club de Judo Boucherville · Cours de judo dès 4 ans' : 'Club de Judo Boucherville · Judo classes from age 4' },
    description: fr
      ? `Judo, jiu-jitsu brésilien, aiki ju-jitsu et auto-défense à Boucherville. Dès 4 ans, sans âge limite. Horaire, tarifs et inscription ${inscription.saison}. 490, chemin du Lac. 450 655-1888.`
      : `Judo, Brazilian jiu-jitsu, aiki ju-jitsu and self-defence in Boucherville. From age 4, no upper limit. Schedule, fees and registration ${inscription.saison}. 490 chemin du Lac. 450 655-1888.`,
    alternates: { canonical: `/${locale}`, languages: { fr: '/fr', en: '/en' } },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const fr = locale === 'fr'
  const [{ club, inscription }, programmes, photos] = await Promise.all([getClub(), getProgrammes(), getPhotosSite()])
  const copy = fr
    ? {
        place: 'Dojo Marcel Bourelly · Boucherville',
        title: ['Club de Judo', 'Boucherville'] as [string, string],
        since: 'Depuis 1970. Club reconnu AAA par Judo Québec.',
        season: `Saison ${inscription.saison}`,
        hajime: 'Hajime.',
        hajimeSub: 'Le mot qui lance chaque combat. Votre premier cours commence ici.',
        find: 'Trouver mon cours',
        register: `Inscription ${inscription.saison}`,
        skip: 'Passer la visite ↓',
        loading: 'Visite du dojo',
      }
    : {
        place: 'Dojo Marcel Bourelly · Boucherville',
        title: ['Club de Judo', 'Boucherville'] as [string, string],
        since: 'Since 1970. An AAA club recognized by Judo Québec.',
        season: `Season ${inscription.saison}`,
        hajime: 'Hajime.',
        hajimeSub: 'The word that starts every match. Your first class starts here.',
        find: 'Find my class',
        register: `Register ${inscription.saison}`,
        skip: 'Skip the tour ↓',
        loading: 'Dojo tour',
      }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(club)) }} />
      <TourHero locale={locale} copy={copy} endingPhone={photos.murCjb.src} />
      <ClassFinder locale={locale} programmes={programmes} saison={inscription.saison} />
      <ValuesMarquee locale={locale} />
      <WeekSchedule locale={locale} programmes={programmes} saison={inscription.saison} />
      <Steps locale={locale} />
      <Dojo locale={locale} />
      <Palmares locale={locale} />
      <Faq locale={locale} />
      <FindUs locale={locale} />
    </>
  )
}
