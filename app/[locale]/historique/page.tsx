import { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/shared/PageHero'
import { Medal } from '@/components/archive/Medal'
import { getClub, getHistorique } from '@/lib/content'

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

const label = 'text-[.78rem] text-muted uppercase tracking-[.25em]'
const h2 = 'font-heading text-3xl md:text-4xl text-ink tracking-tight'

export default async function HistoriquePage({ params }: Props) {
  const { locale } = await params
  const [{ timeline, international, ancienDojo, inauguration }, { palmares, totalPalmares: tot }] = await Promise.all([getHistorique(), getClub()])
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Historique du club' : 'Club history'}
        subtitle={fr ? 'Depuis le 1er mars 1970. Plus de cinquante ans sur le tatami.' : 'Since March 1, 1970. More than fifty years on the tatami.'}
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
          <div className="space-y-4 text-ink/80 leading-relaxed">
            <p>
              {fr
                ? 'Directeur technique du club, ex-compétiteur, entraîneur provincial et national jusqu’en 1983, Marcel Bourelly a su pendant toutes ces années diriger et motiver ses élèves. Leurs résultats aux compétitions provinciales, nationales et internationales, et leur implication dans les différentes sphères du judo, en sont la preuve. Membre du Temple de la renommée de Judo Québec, il a aujourd’hui donné son nom au dojo.'
                : 'Technical director, former competitor, and provincial and national coach until 1983, Marcel Bourelly led and motivated his students for decades. Their provincial, national and international results, and their involvement across the judo world, are the proof. A Judo Québec Hall of Fame member, he has given his name to the dojo.'}
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className={`${h2} mb-10`}>{fr ? 'Les grandes dates' : 'Milestones'}</h2>
          <ol className="border-t border-ink/10">
            {timeline.map(([dFr, dEn, tFr, tEn]) => (
              <li key={dFr} className="grid md:grid-cols-[200px_1fr] gap-2 md:gap-10 py-6 border-b border-ink/10">
                <span className="font-heading text-royal text-xl tabular-nums">{fr ? dFr : dEn}</span>
                <p className="text-ink/80 text-sm leading-relaxed max-w-2xl">{fr ? tFr : tEn}</p>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-3 gap-2 mt-10">
            {ancienDojo.map(src => (
              <Image key={src} src={src} alt={fr ? 'L’ancien dojo' : 'The former dojo'} width={3060} height={2033} sizes="(min-width: 1152px) 380px, 33vw" className="w-full h-auto" />
            ))}
          </div>
          <p className="text-[.85rem] text-muted mt-3">{fr ? 'L’ancien dojo, 2009.' : 'The former dojo, 2009.'}</p>
        </section>

        {/* Dojo Marcel Bourelly */}
        <section>
          <h2 className={`${h2} mb-4`}>Dojo Marcel Bourelly</h2>
          <p className="text-ink/80 leading-relaxed max-w-3xl mb-8">
            {fr
              ? 'Inauguré le 9 septembre 2017 au Complexe aquatique Laurie-Ève-Cormier, 490, chemin du Lac.'
              : 'Opened on September 9, 2017 in the Complexe aquatique Laurie-Ève-Cormier, 490 chemin du Lac.'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {inauguration.map(src => (
              <div key={src} className="relative aspect-square bg-panel overflow-hidden">
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
          <table className="w-full text-sm border-t border-ink/10">
            <thead className="sr-only">
              <tr><th>{fr ? 'Championnat' : 'Championship'}</th><th>{fr ? 'Or' : 'Gold'}</th><th>{fr ? 'Argent' : 'Silver'}</th><th>Bronze</th></tr>
            </thead>
            <tbody>
              {palmares.map(([cFr, cEn, o, s, b]) => (
                <tr key={cFr} className="border-b border-ink/10">
                  <td className="py-4 pr-4 text-ink">{fr ? cFr : cEn}</td>
                  {([['or', o], ['argent', s], ['bronze', b]] as const).map(([k, n]) => (
                    <td key={k} className="py-4 pl-3 text-right tabular-nums whitespace-nowrap text-ink/80 w-16">
                      <Medal kind={k} locale={locale} />{n}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[.85rem] text-muted mt-3">
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
                <ul className="border-t border-ink/10">
                  {rows.map(([annee, nom, lieu, rang], i) => (
                    <li key={i} className="grid grid-cols-[48px_1fr_auto] gap-3 py-2.5 border-b border-ink/10 text-sm">
                      <span className="text-royal tabular-nums">{annee}</span>
                      <span className="text-ink min-w-0">{nom} <span className="text-muted">· {lieu}</span></span>
                      <span className="text-muted tabular-nums">{rang}</span>
                    </li>
                  ))}
                </ul>
                {tFr.endsWith('vétéran') && (
                  <p className="text-sm text-ink/80 leading-relaxed mt-3">
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
        <section className="border-t border-ink/10 pt-12 max-w-3xl">
          <p className="text-ink/80 leading-relaxed">
            {fr
              ? 'Axé principalement autour d’une activité de masse, de divertissement et d’outil de développement social, le Club de Judo Boucherville voit également le judo comme un sport de compétition permettant aux athlètes de haut niveau de s’exprimer pleinement. Alors, si la saine activité vous intéresse, venez découvrir le judo avec nous.'
              : 'Built mainly around mass participation, recreation and social development, Club de Judo Boucherville also sees judo as a competitive sport where high-level athletes can fully express themselves. If healthy activity interests you, come discover judo with us.'}
          </p>
        </section>
      </div>
    </>
  )
}
