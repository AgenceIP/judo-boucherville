import { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Conseil d’administration' : 'Board of Directors' }
}

// Source : judoboucherville.com/html/Conseil.php
const membres: [string, string, string, string][] = [
  ['Président', 'President', 'Frédéric Bourque', 'frederic.bourque@judoboucherville.com'],
  ['Vice-président', 'Vice-president', 'Olivier Bry', 'olivier.bry@videotron.ca'],
  ['Secrétaire', 'Secretary', 'Alain Dessureault', 'alaindessureault@hotmail.com'],
  ['Trésorier', 'Treasurer', 'Maxime Bellemare', 'tresorier@judoboucherville.com'],
  ['Responsable d’éthique', 'Ethics officer', 'Alain Dessureault', 'alaindessureault@hotmail.com'],
  ['Communication', 'Communications', 'Stéphanie Trépanier', 'stepht2018@outlook.com'],
  ['Administrateur', 'Director', 'Alexandre Thomas', 'al3xthomas@gmail.com'],
  ['Directeur technique', 'Technical director', 'Fayçal Bousbiat', 'info@judoboucherville.com'],
]

// Source : judoboucherville.com/html/Presidents.php
const presidents: [string, string][] = [
  ['1971–1972', 'Jean Tessier'],
  ['1972–1974', 'Pierre Morency'],
  ['1974–1975', 'Marcel Laurin'],
  ['1975–1977', 'Serge Salvetti'],
  ['1977–1979', 'Steven Zoni'],
  ['1979–1981', 'Pierre Langevin'],
  ['1981–1982', 'Yolande Larouche'],
  ['1982–1986', 'Jacques Demers'],
  ['1986–1987', 'Normand DeCarufel'],
  ['1987–1991', 'Pierre Michel'],
  ['1991–1992', 'François Goyette'],
  ['1992–1993', 'Claude Lemay'],
  ['1993–1994', 'Carole Chamberlan'],
  ['1994–1999', 'Daniel Michelin'],
  ['1999–2000', 'René Scotto'],
  ['2000–2001', 'Richard Perrault'],
  ['2001–2003', 'Jacques Mantion'],
  ['2003–2005', 'Pierre Berthiaume'],
  ['2005–2011', 'Éric Derome'],
  ['2011–2012', 'Karl Légaré'],
  ['2012–2016', 'Frédéric Bourque'],
  ['2016–2018', 'Olivier Bry'],
  ['2018–', 'Frédéric Bourque'],
]

const label = 'text-[.78rem] text-muted uppercase tracking-[.25em]'

export default async function ConseilPage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Conseil d’administration' : 'Board of Directors'}
        subtitle={fr
          ? 'Les membres élus qui assurent la gouvernance du Club de Judo Boucherville.'
          : 'The elected members who govern Club de Judo Boucherville.'}
        tag="Club"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-[1.4fr_1fr] gap-16">
        <section>
          <h2 className={`${label} mb-4`}>{fr ? 'Membres du conseil' : 'Board members'}</h2>
          <dl className="border-t border-ink/10">
            {membres.map(([rFr, rEn, nom, courriel]) => (
              <div key={rFr} className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-8 py-5 border-b border-ink/10">
                <dt className="text-[.8rem] text-royal tracking-[.2em] uppercase pt-1">{fr ? rFr : rEn}</dt>
                <dd>
                  <p className="font-heading text-xl text-ink">{nom}</p>
                  <a href={`mailto:${courriel}`} className="text-sm text-muted hover:text-royal transition-colors break-all">{courriel}</a>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className={`${label} mb-4`}>{fr ? 'Les présidents du club' : 'Past presidents'}</h2>
          <ol className="border-t border-ink/10">
            {presidents.map(([annees, nom]) => (
              <li key={annees} className="flex justify-between gap-6 py-2.5 border-b border-ink/10 text-sm">
                <span className="text-ink">{nom}</span>
                <span className="text-muted tabular-nums">{annees}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
