import { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import { getConseil } from '@/lib/content'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Conseil d’administration' : 'Board of Directors' }
}

const label = 'text-[.78rem] text-muted uppercase tracking-[.25em]'

export default async function ConseilPage({ params }: Props) {
  const { locale } = await params
  const { membres, presidents } = await getConseil()
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
                  {courriel && <a href={`mailto:${courriel}`} className="text-sm text-muted hover:text-royal transition-colors break-all">{courriel}</a>}
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
