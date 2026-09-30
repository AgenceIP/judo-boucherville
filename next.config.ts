import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Old judoboucherville.com pages (/html/*.php) → new French routes, so bookmarks and search results survive the move
const legacy: Record<string, string> = {
  Parents: '/programmes/parents-enfants', Initiation: '/programmes/judo-enfants',
  EnfantAvance: '/programmes/judo-enfants-avances', EnfantCompetition: '/programmes/judo-enfants-competition',
  Competition: '/programmes/judo-competition', SportEtude: '/programmes/sport-etudes', Adultes: '/programmes/judo-adultes',
  Aiki: '/programmes/aiki-jujitsu', Jiujitsubresilien: '/programmes/jiu-jitsu-bresilien',
  AutoDefense: '/programmes/autodefense-femmes', PPCC: '/programmes/prevention-chutes',
  Parascolaire: '/programmes/parascolaire', campete: '/programmes/camp-de-jour',
  Inscription: '/inscription', Historique: '/historique', Construction: '/historique', Conseil: '/conseil',
  Presidents: '/conseil', Ceintures: '/ceintures-noires', Professeurs: '/equipe', Joindre: '/contact',
  Telechargement: '/telechargements', Resultats: '/resultats', Archiveactualite: '/actualites', Journaux: '/journaux',
}
// Athlete profile pages → /athletes/<slug> ('' = profile no longer exists, go to the list)
const athletes: Record<string, string> = {
  Adri: 'adriana-portuondo-isasi', Alex: 'alexandre-emond', Amira: 'amira-bousbiat',
  Ana: 'ana-laura-portuondo-isasi', Ariane: 'ariane-bonin', Arnaud: 'arnaud-p-valois',
  Ashkan: 'ashkan-khahan-zamora', Audrey: 'audrey-dion', Benjamin: 'benjamin-brodeur',
  Catherine: 'catherine-toshkov', Charline: 'charline-bourque', Diem: 'diem-tselios',
  DonaldDaniel: 'donald-ferland-et-daniel-de-angelis', EdoCha: 'edouard-chasse', Edouard: 'edouard-paiement',
  EriLud: 'eric-de-rome-et-ludovic-durrieu', Fred: 'frederic-bourque', Gab: 'gabriel-juteau',
  Gerardo: 'gerardo-andrade', Gibril: 'gibril-zouaoui', Guillaume: 'guillaume-perrault',
  HugAnt: 'hugo-levacher-et-antoine-desgranges', Hugo: 'hugo-levacher', Ines: 'ines-da-costa',
  Jacob: 'jacob-st-jean', JacobV: 'jacob-valois', Jeremy: 'jeremy-blain', Jerome: 'jerome-lajoie',
  JeromeJacob: 'jerome-lajoie-et-jacob-st-jean', Julien: 'julien-maurice', Laurie: 'laurie-monette',
  Leanne: 'leanne-dussault', Leo: 'leo-morin', Luca: 'luca-nephtali', Ludovic: 'ludovic-durrieu',
  Maika: 'maika-nephtali', Marie: 'marie-michele-girard', Mathis: 'mathis-guertin', Melody: 'melody-grenier',
  Meloize: 'meloize-perkinson', NoahB: 'noah-beauregrad', OlivierB: 'olivier-bry', OlivierL: 'olivier-legault',
  Patrick: 'patrick-gagne', PatrickB: 'patrick-berteau', Philip: 'philip-dion', Samia: 'samia-boussarhane',
  Sofiane: 'sofiane-bousbiat', TriBou: 'tristan-bourque', TriLap: 'tristan-lapointe',
  Victor: 'victor-lanthier', Vincent: 'vincent-roberge-poitras', William: 'william-lamontagne',
  Zachary: 'zachary-camonfour', Zander: 'zander-tselios', Henri: '',
}
const resultats = ['2010-2011', '2011-2012', '2012-2013', '2013-2014', '2014-2015', '2015-2016', '2016-2017', '2017-2018', '2018-2019', '2019-2020', '2021-2022', '2022-2023', '2023-2024', '2024-2025']
const actualites = ['2008-2009', '2009-2010', '2010-2011', '2011-2012', '2012-2013', '2013-2014', '2014-2015', '2015-2016', '2016-2017', '2017-2018', '2018-2019', '2019-2020', '2020-2021', '2022-2023', '2023-2024']

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
  async redirects() {
    const r = (source: string, destination: string) => ({ source, destination: `/fr${destination}`, permanent: true })
    return [
      r('/index.html', ''),
      r('/chall', '/challenge'),
      ...Object.entries(legacy).map(([php, to]) => r(`/html/${php}.php`, to)),
      ...Object.entries(athletes).map(([php, slug]) => r(`/html/${php}.php`, slug ? `/athletes/${slug}` : '/athletes')),
      r('/html/:p(Equipe[^/]*\\.php)', '/athletes'),
      // Season pages that were never migrated (empty or decade indexes) fall through to the list
      ...resultats.map(s => r(`/html/resultats${s}.php`, `/resultats/${s}`)),
      r('/html/:p(resultats[^/]*\\.php)', '/resultats'),
      ...actualites.map(s => r(`/html/actualite${s}.php`, `/actualites/${s}`)),
      r('/html/:p(actualite[^/]*\\.php)', '/actualites'),
      r('/html/:p(Journaux[^/]*\\.php)', '/journaux'),
      r('/html/:p([^/]*\\.php)', ''),
    ]
  },
}

export default withNextIntl(nextConfig)
