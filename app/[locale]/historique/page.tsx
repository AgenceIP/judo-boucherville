import { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/shared/PageHero'
import { Medal } from '@/components/archive/Blocks'
import { palmares, totalPalmares as tot } from '@/data/club'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Historique du club' : 'Club history',
    description: locale === 'fr'
      ? 'Fondé le 1er mars 1970 par Marcel Bourelly : l’histoire, le palmarès et les athlètes internationaux du Club de Judo Boucherville.'
      : 'Founded on March 1, 1970 by Marcel Bourelly: the history, record and international athletes of Club de Judo Boucherville.',
  }
}

// Source : judoboucherville.com/html/Historique.php
const timeline: [string, string, string, string][] = [
  ['1er mars 1970', 'March 1, 1970', 'Marcel Bourelly fonde le club « Kowakan - Shukokaé », au centre commercial La Seigneurie.', 'Marcel Bourelly founds the “Kowakan - Shukokaé” club at the La Seigneurie shopping centre.'],
  ['1974', '1974', 'Le club quitte La Seigneurie et poursuit ses activités au sein du Service des loisirs de la municipalité, sous le nom de Club de Judo Boucherville.', 'The club leaves La Seigneurie and continues within the town’s recreation department as Club de Judo Boucherville.'],
  ['13 août 1979', 'August 13, 1979', 'Les membres du comité constituent la corporation « Club de Judo Boucherville Inc. », premier club au Québec en nombre de membres et en résultats sportifs.', 'The committee incorporates “Club de Judo Boucherville Inc.”, the leading club in Québec by membership and results.'],
  ['1988', '1988', 'Début du programme parascolaire dans les écoles primaires de Boucherville.', 'The after-school programme starts in Boucherville’s elementary schools.'],
  ['2001', '2001', 'Fayçal Bousbiat devient entraîneur du club.', 'Fayçal Bousbiat becomes the club’s coach.'],
  ['2004', '2004', 'Marcel Bourelly prend sa retraite; Fayçal Bousbiat devient directeur technique.', 'Marcel Bourelly retires; Fayçal Bousbiat becomes technical director.'],
  ['2008', '2008', 'Le club devient centre régional d’entraînement (CRD).', 'The club becomes a regional training centre (CRD).'],
  ['2015', '2015', 'Le club déménage au Centre multifonctionnel pour deux ans, le temps de construire le nouveau dojo.', 'The club moves to the Centre multifonctionnel for two years while the new dojo is built.'],
  ['9 septembre 2017', 'September 9, 2017', 'Inauguration du Dojo Marcel Bourelly, au Complexe aquatique Laurie-Ève-Cormier.', 'The Dojo Marcel Bourelly opens in the Complexe aquatique Laurie-Ève-Cormier.'],
]

// [année, athlète(s), lieu, résultat]
type Participation = [number, string, string, string?]
const international: [string, string, Participation[]][] = [
  ['Jeux olympiques', 'Olympic Games', [
    [1992, 'Pascale Mainville', 'Barcelone'],
    [2012, 'Alexandre Emond', 'Londres'],
    [2012, 'Donald Ferland (arbitre)', 'Londres'],
  ]],
  ['Championnat du monde senior', 'Senior World Championships', [
    [1991, 'Pascale Mainville', 'Barcelone'],
    [1993, 'Dominique Pilon', 'Hamilton'],
    [2009, 'Alexandre Emond', 'Rotterdam'],
    [2010, 'Alexandre Emond', 'Tokyo', '9e'],
    [2010, 'Guillaume Perrault', 'Tokyo'],
    [2011, 'Alexandre Emond', 'Paris'],
    [2011, 'Guillaume Perrault', 'Paris'],
    [2013, 'Alexandre Emond', 'Rio de Janeiro'],
    [2013, 'Patrick Gagné', 'Rio de Janeiro'],
    [2014, 'Patrick Gagné', 'Chelyabinsk'],
    [2017, 'Analaura Portuondo-Isasi', 'Budapest'],
    [2019, 'Jacob Valois', 'Tokyo'],
    [2024, 'Analaura Portuondo-Isasi', 'Abu Dhabi'],
  ]],
  ['Championnat du monde junior', 'Junior World Championships', [
    [1990, 'Pascale Mainville', 'Dijon', '3e'],
    [1994, 'Gabriel Senécal', 'Le Caire'],
    [2000, 'Isabelle Pearson', 'Nabeul'],
    [2006, 'Guillaume Perrault', 'Saint-Domingue', '9e'],
    [2006, 'Jean-Philippe Gagnon', 'Saint-Domingue'],
    [2009, 'Maxime Gagnon', 'Paris'],
    [2010, 'Patrick Gagné', 'Agadir', '5e'],
    [2011, 'Michael Fortin-Demers', 'Afrique du Sud', '5e'],
    [2013, 'Analaura Portuondo-Isasi', 'Ljubljana', '5e'],
    [2014, 'Analaura Portuondo-Isasi', 'Miami', '3e'],
    [2017, 'Gabriel Juteau', 'Zagreb'],
    [2017, 'Jacob Valois', 'Zagreb'],
    [2017, 'Adriana Portuondo-Isasi', 'Zagreb'],
    [2018, 'Jacob Valois', 'Nassau'],
    [2024, 'Catherine Toshkov', 'Douchanbé'],
  ]],
  ['Championnat du monde cadet', 'Cadet World Championships', [
    [2011, 'Josiane Gagné', 'Kiev'],
    [2011, 'Analaura Portuondo-Isasi', 'Kiev'],
    [2013, 'Gabriel Juteau', 'Miami'],
    [2013, 'Analaura Portuondo-Isasi', 'Miami'],
    [2013, 'Adriana Portuondo-Isasi', 'Miami'],
    [2015, 'Jacob Valois', 'Sarajevo'],
    [2023, 'Mélody Grenier', 'Zagreb'],
    [2023, 'Charline Bourque', 'Zagreb'],
    [2023, 'Vincent Roberge-Poitras', 'Zagreb'],
    [2024, 'Mélody Grenier', 'Lima'],
    [2024, 'Charline Bourque', 'Lima'],
    [2024, 'Tristan Bourque', 'Lima'],
  ]],
  ['Championnat du monde universitaire', 'World University Championships', [
    [1991, 'Éric De Rome', 'Bruxelles'],
    [2004, 'Isabelle Pearson', 'Moscou'],
    [2006, 'Isabelle Pearson', 'Suwon'],
  ]],
  ['Championnat du monde vétéran', 'Veterans World Championships', [
    [2018, 'Frédéric Bourque', 'Cancún', '9e'],
    [2019, 'Gerardo Andrade', 'Marrakech', '5e'],
  ]],
  ['Championnat du monde de kata', 'Kata World Championships', [
    [2008, 'Donald Ferland et Daniel De Angelis', 'Paris', '5e'],
    [2008, 'Jacques Mantion et Yves Pearson', 'Paris'],
    [2009, 'Donald Ferland et Daniel De Angelis', 'Malte', '9e'],
    [2012, 'Donald Ferland et Daniel De Angelis', 'Pordenone'],
    [2018, 'Jérôme Lajoie et Jacob St-Jean', 'Cancún', '8e'],
  ]],
]

const ancienDojo = ['ADojo1', 'ADojo2', 'ADojo3'].map(n => `/images/scraped/Autre_${n}.jpg`)
const inauguration = [
  'Entrainement_Inauguration8', 'Logo_PlaqueInauguration', 'Entrainement_Inauguration7', 'Entrainement_Inauguration3',
  'Entrainement_Inauguration6', 'Entrainement_Inauguration2', 'Entrainement_Inauguration5', 'Autre_dojo1',
].map(n => `/images/scraped/${n}.jpg`)

const label = 'text-[10px] text-muted uppercase tracking-[.25em]'
const h2 = 'font-heading text-3xl md:text-4xl text-white tracking-tight'

export default async function HistoriquePage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Historique du club' : 'Club history'}
        subtitle={fr ? 'Depuis le 1er mars 1970 — plus de cinquante ans sur le tatami.' : 'Since March 1, 1970 — more than fifty years on the tatami.'}
        tag="1970"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* Founder */}
        <section className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16">
          <div>
            <p className={`${label} mb-3`}>{fr ? 'Fondateur' : 'Founder'}</p>
            <h2 className={h2}>Marcel Bourelly</h2>
            <p className="text-royal text-sm mt-1">{fr ? 'Ceinture noire 7e dan' : '7th dan black belt'}</p>
          </div>
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              {fr
                ? 'Directeur technique du club, ex-compétiteur, entraîneur provincial et national jusqu’en 1983, Marcel Bourelly a su pendant toutes ces années diriger et motiver ses élèves. Leurs résultats aux compétitions provinciales, nationales et internationales, et leur implication dans les différentes sphères du judo, en sont la preuve. Membre du Temple de la renommée de Judo Québec, il a aujourd’hui donné son nom au dojo.'
                : 'Technical director, former competitor, and provincial and national coach until 1983, Marcel Bourelly led and motivated his students for decades. Their provincial, national and international results — and their involvement across the judo world — are the proof. A Judo Québec Hall of Fame member, he has given his name to the dojo.'}
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className={`${h2} mb-10`}>{fr ? 'Les grandes dates' : 'Milestones'}</h2>
          <ol className="border-t border-white/[0.06]">
            {timeline.map(([dFr, dEn, tFr, tEn]) => (
              <li key={dFr} className="grid md:grid-cols-[200px_1fr] gap-2 md:gap-10 py-6 border-b border-white/[0.06]">
                <span className="font-heading text-royal text-xl tabular-nums">{fr ? dFr : dEn}</span>
                <p className="text-white/80 text-sm leading-relaxed max-w-2xl">{fr ? tFr : tEn}</p>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-3 gap-2 mt-10">
            {ancienDojo.map(src => (
              <Image key={src} src={src} alt={fr ? 'L’ancien dojo' : 'The former dojo'} width={3060} height={2033} sizes="(min-width: 1152px) 380px, 33vw" className="w-full h-auto" />
            ))}
          </div>
          <p className="text-xs text-muted mt-3">{fr ? 'L’ancien dojo, 2009.' : 'The former dojo, 2009.'}</p>
        </section>

        {/* Dojo Marcel Bourelly */}
        <section>
          <h2 className={`${h2} mb-4`}>Dojo Marcel Bourelly</h2>
          <p className="text-white/80 leading-relaxed max-w-3xl mb-8">
            {fr
              ? 'Inauguré le 9 septembre 2017 au Complexe aquatique Laurie-Ève-Cormier, 490, chemin du Lac.'
              : 'Opened on September 9, 2017 in the Complexe aquatique Laurie-Ève-Cormier, 490 chemin du Lac.'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {inauguration.map(src => (
              <div key={src} className="relative aspect-square bg-white/[0.03] overflow-hidden">
                <Image src={src} alt={fr ? 'Inauguration du Dojo Marcel Bourelly' : 'Opening of the Dojo Marcel Bourelly'} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Record 2002-2024 */}
        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
            <h2 className={h2}>{fr ? 'Palmarès 2002–2024' : 'Record 2002–2024'}</h2>
            <p className="text-sm text-muted tabular-nums">
              <Medal kind="or" locale={locale} />{tot[0]}
              <Medal kind="argent" locale={locale} />{tot[1]}
              <Medal kind="bronze" locale={locale} />{tot[2]}
            </p>
          </div>
          <table className="w-full text-sm border-t border-white/[0.06]">
            <thead className="sr-only">
              <tr><th>{fr ? 'Championnat' : 'Championship'}</th><th>{fr ? 'Or' : 'Gold'}</th><th>{fr ? 'Argent' : 'Silver'}</th><th>Bronze</th></tr>
            </thead>
            <tbody>
              {palmares.map(([cFr, cEn, o, s, b]) => (
                <tr key={cFr} className="border-b border-white/[0.06]">
                  <td className="py-4 pr-4 text-white">{fr ? cFr : cEn}</td>
                  {([['or', o], ['argent', s], ['bronze', b]] as const).map(([k, n]) => (
                    <td key={k} className="py-4 pl-3 text-right tabular-nums whitespace-nowrap text-white/80 w-16">
                      <Medal kind={k} locale={locale} />{n}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted mt-3">
            {fr ? 'Plusieurs athlètes ont aussi été médaillés aux Championnats canadiens de kata.' : 'Several athletes also medalled at the Canadian Kata Championships.'}
          </p>
        </section>

        {/* International */}
        <section>
          <h2 className={`${h2} mb-10`}>{fr ? 'Sur la scène internationale' : 'On the international stage'}</h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {international.map(([tFr, tEn, rows]) => (
              <div key={tFr}>
                <h3 className={`${label} mb-3`}>{fr ? tFr : tEn}</h3>
                <ul className="border-t border-white/[0.06]">
                  {rows.map(([annee, nom, lieu, rang], i) => (
                    <li key={i} className="grid grid-cols-[48px_1fr_auto] gap-3 py-2.5 border-b border-white/[0.06] text-sm">
                      <span className="text-royal tabular-nums">{annee}</span>
                      <span className="text-white min-w-0">{nom} <span className="text-muted">· {lieu}</span></span>
                      <span className="text-muted tabular-nums">{rang}</span>
                    </li>
                  ))}
                </ul>
                {tFr.endsWith('vétéran') && (
                  <p className="text-sm text-white/80 leading-relaxed mt-3">
                    {fr
                      ? 'Jacques Côté : neuf participations, huit podiums, champion du monde en 2006 et en 2010.'
                      : 'Jacques Côté: nine appearances, eight podiums, world champion in 2006 and 2010.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="border-t border-white/[0.06] pt-12 max-w-3xl">
          <p className="text-white/80 leading-relaxed">
            {fr
              ? 'Axé principalement autour d’une activité de masse, de divertissement et d’outil de développement social, le Club de Judo Boucherville voit également le judo comme un sport de compétition permettant aux athlètes de haut niveau de s’exprimer pleinement. Alors, si la saine activité vous intéresse, venez découvrir le judo avec nous.'
              : 'Built mainly around mass participation, recreation and social development, Club de Judo Boucherville also sees judo as a competitive sport where high-level athletes can fully express themselves. If healthy activity interests you, come discover judo with us.'}
          </p>
        </section>
      </div>
    </>
  )
}
