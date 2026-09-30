import { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/shared/PageHero'
import CountdownTimer from '@/components/ui/CountdownTimer'
import Button from '@/components/ui/Button'
import { Medal } from '@/components/archive/Blocks'
import { club } from '@/data/club'
import { challenge as c, commanditaires, divisions, palmaresChallenge } from '@/data/challenge'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Challenge International',
    description: locale === 'fr'
      ? `Tournoi invitation par équipes depuis ${c.depuis} : divisions, pesée, bourses, règlements, résultats et commanditaires.`
      : `Invitational team tournament since ${c.depuis}: divisions, weigh-in, prize money, rules, results and sponsors.`,
  }
}

// Source : 27e-Challenge-Devis-Fra.pdf — [fr, en]
const reglements: [string, string][] = [
  ['Être membre en règle d’une association reconnue par la FIJ.', 'Be a member in good standing of an IJF-recognised federation.'],
  ['Les membres d’une équipe peuvent venir de clubs différents, mais seules les équipes dont tous les membres sont du même club sont admissibles au trophée perpétuel du Challenge.', 'Team members may come from different clubs, but only teams whose members all belong to the same club are eligible for the Challenge perpetual trophy.'],
  ['Aucun remplacement ni changement de catégorie après la pesée officielle.', 'No substitutions or category changes after the official weigh-in.'],
  ['En cas d’égalité au nombre de victoires, le nombre de points détermine l’équipe gagnante. En cas d’égalité aux victoires et aux points, une seule catégorie est tirée au sort parmi toutes les catégories (y compris celles où une équipe n’a pas d’athlète).', 'If teams are tied on wins, total points decide. If still tied, a single category is drawn from all categories (including those where a team has no athlete).'],
  ['Un judoka peut être inscrit dans deux divisions.', 'A judoka may enter two divisions.'],
  ['Le surclassement d’une seule catégorie de poids est accepté.', 'Moving up one weight category is allowed.'],
  ['U21 / Senior et Masters : un tirage au sort avant la rencontre détermine l’ordre des combattants; le tour suivant passe à la catégorie suivante.', 'U21 / Senior and Masters: a draw before each match sets the order of bouts; the next round moves to the next category.'],
  ['Une tolérance de poids maximale de +1 kg est acceptée.', 'A maximum weight tolerance of +1 kg is allowed.'],
  ['Masters : l’âge total de l’équipe doit atteindre 150 ans le jour de la compétition.', 'Masters: the team’s combined age must be at least 150 years on competition day.'],
  ['Le comité peut limiter le nombre d’équipes à 12 par division (premier inscrit, premier retenu) et refuser les inscriptions après la date limite.', 'The committee may cap each division at 12 teams (first come, first served) and refuse late entries.'],
  ['À la pesée, le responsable de l’équipe signe un formulaire de dégagement de responsabilité.', 'At weigh-in, the team leader signs a liability waiver.'],
]

const label = 'text-[.78rem] text-muted uppercase tracking-[.25em]'
const h2 = 'font-heading text-3xl md:text-4xl text-ink tracking-tight'

export default async function ChallengePage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'
  const aVenir = new Date(c.date) > new Date()
  const date = new Date(c.date).toLocaleDateString(fr ? 'fr-CA' : 'en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Montreal',
  })
  const pays = (fr ? c.pays : c.paysEn).join(' · ')

  return (
    <>
      <PageHero
        title="Challenge International Judo Boucherville"
        subtitle={fr
          ? `Un tournoi invitation par équipes unique au monde. ${c.edition}e édition, ${date}.`
          : `A one-of-a-kind invitational team tournament. ${c.edition}th edition, ${date}.`}
        tag={fr ? 'Tournoi international' : 'International tournament'}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* Intro + key facts */}
        <section className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16">
          <div className="space-y-5 text-ink/80 leading-relaxed">
            <p className="font-heading text-2xl md:text-3xl text-ink leading-snug">
              {fr
                ? 'Une compétition par équipes qui rassemble tous les judokas d’un club autour d’un but commun.'
                : 'A team competition that rallies every judoka in a club around a common goal.'}
            </p>
            <p>
              {fr
                ? 'Le Challenge s’adresse à la plupart des catégories d’âge et de poids que l’on trouve dans un dojo. Les victoires de toutes les équipes d’un même club s’additionnent pour décerner la plus importante récompense : le trophée du Challenge. Sa renommée n’est plus à faire : la participation, la qualité de l’arbitrage et du judo présenté en ont fait le succès.'
                : 'The Challenge covers most of the age and weight categories found in any dojo. Wins from every team of the same club add up toward the top award: the Challenge trophy. Its reputation is well established: strong turnout, quality refereeing and high-level judo have made it a success.'}
            </p>
            <div>
              <p className={`${label} mb-2`}>{fr ? `Équipes participantes depuis ${c.depuis}` : `Participating teams since ${c.depuis}`}</p>
              <p className="text-ink">{pays}</p>
            </div>
            {aVenir && <div className="pt-4"><CountdownTimer targetDate={c.date} /></div>}
          </div>

          <aside className="border border-ink/10 p-6 self-start">
            <dl className="divide-y divide-ink/10">
              <div className="pb-4">
                <dt className={label}>{fr ? 'Date' : 'Date'}</dt>
                <dd className="text-ink mt-1 first-letter:uppercase">{date}</dd>
              </div>
              <div className="py-4">
                <dt className={label}>{fr ? 'Lieu et pesée' : 'Venue and weigh-in'}</dt>
                <dd className="text-sm text-ink/80 mt-1 leading-relaxed">{club.dojo}<br />{club.lieu}<br />{club.adresse}</dd>
              </div>
              <div className="py-4">
                <dt className={label}>{fr ? 'Inscription par équipe' : 'Entry fee per team'}</dt>
                <dd className="mt-1 text-sm">
                  {c.couts.map(([n, prix]) => (
                    <p key={n} className="flex justify-between"><span className="text-muted">{fr ? `Équipe de ${n}` : `Team of ${n}`}</span><span className="font-heading text-ink">{prix}</span></p>
                  ))}
                  <p className="text-[.85rem] text-muted mt-2">{fr ? `Payable à la pesée ou par virement à ${club.courriel}.` : `Payable at weigh-in or by e-transfer to ${club.courriel}.`}</p>
                </dd>
              </div>
              <div className="pt-4">
                <dt className={label}>{fr ? 'Date limite d’inscription' : 'Registration deadline'}</dt>
                <dd className="mt-1 text-sm space-y-1">
                  {c.limites.map(([pFr, pEn, dFr, dEn]) => (
                    <p key={pFr} className="flex justify-between gap-4"><span className="text-muted">{fr ? pFr : pEn}</span><span className="text-ink whitespace-nowrap">{fr ? dFr : dEn}</span></p>
                  ))}
                  <p className="text-[.85rem] text-muted pt-1">{fr ? 'Inscriptions en ligne seulement.' : 'Online registration only.'}</p>
                </dd>
              </div>
            </dl>
            <div className="flex flex-col gap-3 mt-6">
              {aVenir && <Button href={c.formulaire} external>{fr ? 'Inscrire une équipe' : 'Register a team'} ↗</Button>}
              <Button href={c.devis} external variant="outline" size="sm">{fr ? 'Devis et règlements (PDF)' : 'Invitation and rules (PDF, French)'}</Button>
              <Button href={c.programme} external variant="outline" size="sm">{fr ? `Programme ${new Date(c.date).getFullYear()} (PDF)` : `${new Date(c.date).getFullYear()} programme (PDF, French)`}</Button>
              <Button href={c.video} external variant="ghost" size="sm">{fr ? 'Voir la vidéo du Challenge' : 'Watch the Challenge video'} ↗</Button>
            </div>
          </aside>
        </section>

        {/* Divisions and weigh-in */}
        <section>
          <h2 className={`${h2} mb-2`}>{fr ? 'Divisions et horaire des pesées' : 'Divisions and weigh-in schedule'}</h2>
          <p className="text-sm text-muted mb-8">{fr ? 'Tous les participants doivent être membres en règle d’une fédération reconnue par la FIJ.' : 'All participants must be members in good standing of an IJF-recognised federation.'}</p>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left">
                  {(fr
                    ? ['Division', 'Hommes (kg)', 'Femmes (kg)', 'Né en', 'Grades', 'Pesée']
                    : ['Division', 'Men (kg)', 'Women (kg)', 'Born', 'Grades', 'Weigh-in']
                  ).map(h => <th key={h} className={`${label} font-normal pb-3 pr-4`}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {divisions.map(([div, m, f, neFr, neEn, gFr, gEn, pesee]) => (
                  <tr key={div} className="border-b border-ink/10 align-top">
                    <td className="font-heading text-ink py-4 pr-4 whitespace-nowrap">{div}</td>
                    <td className="text-ink/80 py-4 pr-4">{m}</td>
                    <td className="text-ink/80 py-4 pr-4">{f}</td>
                    <td className="text-muted py-4 pr-4">{fr ? neFr : neEn}</td>
                    <td className="text-muted py-4 pr-4">{fr ? gFr : gEn}</td>
                    <td className="text-ink py-4 whitespace-nowrap tabular-nums">{pesee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Prize money */}
        <section>
          <h2 className={`${h2} mb-8`}>{fr ? 'Bourses' : 'Prize money'}</h2>
          <div className="grid sm:grid-cols-3 border-t border-l border-ink/10">
            {c.bourses.map(([dFr, dEn, montant]) => (
              <div key={dFr} className="border-r border-b border-ink/10 p-8">
                <p className="font-heading text-royal text-5xl leading-none tabular-nums">{montant}</p>
                <p className={`${label} mt-3`}>{fr ? dFr : dEn}</p>
              </div>
            ))}
          </div>
          <p className="text-[.85rem] text-muted mt-4">
            {fr ? 'Remis à l’équipe gagnante de chaque division. Minimum 5 équipes par division.' : 'Awarded to the winning team in each division. Minimum 5 teams per division.'}
          </p>
        </section>

        {/* Points, awards, rules */}
        <section className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16">
          <div className="space-y-12">
            <div>
              <h2 className={`${h2} mb-6`}>{fr ? 'Le club vainqueur' : 'The winning club'}</h2>
              <dl className="border-t border-ink/10 text-sm">
                {([
                  [fr ? 'Par division représentée' : 'Per division entered', '1'],
                  [fr ? '1re équipe de la division' : '1st team in division', '7'],
                  [fr ? '2e équipe' : '2nd team', '5'],
                  [fr ? '3e équipe' : '3rd team', '3'],
                ] as const).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 border-b border-ink/10">
                    <dt className="text-ink/80">{k}</dt>
                    <dd className="font-heading text-ink tabular-nums">{v} pt{v !== '1' && 's'}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-[.85rem] text-muted mt-3 leading-relaxed">
                {fr
                  ? 'En cas d’égalité, le club ayant la meilleure moyenne (total des points / nombre d’équipes) l’emporte.'
                  : 'If two clubs are tied, the one with the best average (total points / number of teams) wins.'}
              </p>
            </div>
            <div>
              <h3 className={`${label} mb-4`}>{fr ? 'Récompenses' : 'Awards'}</h3>
              <ul className="space-y-3 text-sm text-ink/80 leading-relaxed">
                <li>{fr ? 'Trophée perpétuel du Challenge et trophée perpétuel par division, remis aux vainqueurs pour six mois (clubs du Québec seulement).' : 'Challenge perpetual trophy and perpetual division trophies, held by the winners for six months (Québec clubs only).'}</li>
                <li>{fr ? 'Plaque souvenir au club champion.' : 'Commemorative plaque for the champion club.'}</li>
                <li>{fr ? 'Médailles et cadeaux aux judokas des trois premières équipes de chaque division.' : 'Medals and gifts for judokas of the top three teams in each division.'}</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className={`${h2} mb-6`}>{fr ? 'Règlements' : 'Rules'}</h2>
            <ol className="border-t border-ink/10">
              {reglements.map(([rFr, rEn], i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] py-3 border-b border-ink/10 text-sm">
                  <span className="text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-ink/80 leading-relaxed">{fr ? rFr : rEn}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* International delegations */}
        <section className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 border-t border-ink/10 pt-12">
          <h2 className={h2}>{fr ? 'Délégations internationales' : 'International delegations'}</h2>
          <div className="space-y-4 text-ink/80 leading-relaxed">
            <p>
              {fr
                ? 'Pour les délégations de l’extérieur de l’Amérique du Nord, le club prend en charge l’hébergement de 10 athlètes (12 pour les U21 / Senior formant deux équipes) et de 2 accompagnateurs, du jeudi au lundi de la fin de semaine du tournoi.'
                : 'For delegations from outside North America, the club covers lodging for 10 athletes (12 for U21 / Senior forming two teams) and 2 coaches, from the Thursday to the Monday of tournament weekend.'}
            </p>
            <p className="text-sm text-muted">
              {fr
                ? 'L’hébergement est offert par ordre de réception des inscriptions, selon la capacité de nos familles bénévoles. Pour prolonger votre séjour au Québec, communiquez avec le comité organisateur.'
                : 'Lodging is offered in order of registration, subject to the capacity of our volunteer host families. To extend your stay in Québec, contact the organizing committee.'}
            </p>
          </div>
        </section>

        {/* Past results */}
        <section>
          <h2 className={`${h2} mb-2`}>{fr ? 'Palmarès de la Coupe Challenge' : 'Challenge Cup honour roll'}</h2>
          <p className="text-sm text-muted mb-8">{fr ? 'Classement des clubs; détail par division de 2010 à 2015.' : 'Club standings; division-by-division results from 2010 to 2015 (in French).'}</p>
          <div className="border-t border-ink/10">
            {palmaresChallenge.map(e => {
              const podium = (
                <ol className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  {e.coupe.map(([club, pts], i) => (
                    <li key={club} className={i === 0 ? 'text-ink' : 'text-muted'}>
                      <Medal kind={(['or', 'argent', 'bronze'] as const)[i]} locale={locale} />
                      {club}{pts !== undefined && <span className="text-muted tabular-nums"> · {pts} pts</span>}
                    </li>
                  ))}
                </ol>
              )
              const row = 'grid sm:grid-cols-[5rem_1fr_auto] items-baseline gap-2 sm:gap-6 py-5'
              if (!e.divisions) {
                return (
                  <div key={e.annee} className={`${row} border-b border-ink/10`}>
                    <span className="font-heading text-2xl text-ink">{e.annee}</span>
                    {podium}
                  </div>
                )
              }
              return (
                <details key={e.annee} className="group border-b border-ink/10">
                  <summary className={`${row} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
                    <span className="font-heading text-2xl text-ink">{e.annee}</span>
                    {podium}
                    <span className="text-[.85rem] text-muted group-open:text-royal">{fr ? 'Détails' : 'Details'} <span className="inline-block transition-transform group-open:rotate-45">+</span></span>
                  </summary>
                  <div className="overflow-x-auto -mx-4 px-4 pb-8">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className={`${label} font-normal pb-2 pr-4`}>Division</th>
                          {(['or', 'argent', 'bronze'] as const).map(m => (
                            <th key={m} className="pb-2 pr-4 font-normal"><Medal kind={m} locale={locale} /></th>
                          ))}
                          <th className={`${label} font-normal pb-2`}>{fr ? 'Meilleur athlète' : 'Best athlete'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {e.divisions.map((d, i) => (
                          <tr key={i} className="border-t border-ink/10 align-top">
                            <td className="text-ink py-2 pr-4 whitespace-nowrap">{d[0]}</td>
                            <td className="text-ink/80 py-2 pr-4">{d[1]}</td>
                            <td className="text-ink/80 py-2 pr-4">{d[2] || '·'}</td>
                            <td className="text-ink/80 py-2 pr-4">{d[3] || '·'}</td>
                            <td className="text-muted py-2">{d[4] || '·'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )
            })}
          </div>
        </section>

        {/* Sponsors */}
        <section>
          <h2 className={`${h2} mb-2`}>{fr ? 'Merci à nos commanditaires' : 'Thank you to our sponsors'}</h2>
          <p className="text-sm text-muted mb-8">{fr ? 'Leur soutien rend le Challenge possible, année après année.' : 'Their support makes the Challenge possible, year after year.'}</p>
          <ul className="grid grid-cols-3 lg:grid-cols-7 gap-px bg-panel border border-ink/10">
            {commanditaires.map(([fichier, nom]) => (
              <li key={fichier} className="bg-white p-5 aspect-[3/2]">
                <div className="relative h-full">
                  <Image src={`/images/challenge/${fichier}`} alt={nom} fill sizes="(min-width: 1024px) 200px, 45vw" className="object-contain" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="grid md:grid-cols-3 gap-10 border-t border-ink/10 pt-12 text-sm">
          <div>
            <h2 className={`${label} mb-3`}>{fr ? 'Organisation du tournoi' : 'Tournament organisation'}</h2>
            <p className="text-ink">{club.nom}</p>
            <p className="text-ink/80">{club.adresse}</p>
          </div>
          <div>
            <h2 className={`${label} mb-3`}>{fr ? 'Comité organisateur' : 'Organizing committee'}</h2>
            <p className="text-ink">{c.president}</p>
            <p className="text-muted">{fr ? 'Président du comité organisateur' : 'Chair of the organizing committee'}</p>
          </div>
          <div>
            <h2 className={`${label} mb-3`}>Contact</h2>
            <a href={`tel:${club.tel.replace(/\D/g, '')}`} className="block py-2.5 text-ink hover:text-royal transition-colors">{club.tel}</a>
            <a href={`mailto:${club.courriel}`} className="block py-2.5 text-ink hover:text-royal transition-colors">{club.courriel}</a>
          </div>
        </section>
      </div>
    </>
  )
}
