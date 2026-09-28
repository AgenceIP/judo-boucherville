import Link from 'next/link'
import { calendrier, calendrierJudoQuebec } from '@/data/evenements'
import { inscription } from '@/data/club'
import PageHero from '@/components/shared/PageHero'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Calendrier' : 'Calendar' }
}

export default async function CalendrierPage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Calendrier' : 'Calendar'}
        subtitle={fr
          ? `Début des cours, stages, tournois et camps de la saison ${inscription.saison}.`
          : `Class start dates, clinics, tournaments and camps for the ${inscription.saison} season.`}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-[1fr_320px] gap-16">
        <div>
          {calendrier.map(m => (
            <section key={m.mois} className="grid md:grid-cols-[160px_1fr] gap-4 md:gap-10 border-t border-ink/10 py-10">
              <h2 className="font-heading text-xl text-ink">{fr ? m.mois : m.moisEn}</h2>
              <ul>
                {m.evenements.map(e => {
                  const inner = (
                    <>
                      <span className="text-royal tabular-nums w-14 shrink-0">{e.jour}</span>
                      <span className="flex-1">
                        <span className="text-ink">{e.titre}</span>
                        {e.lieu && <span className="block text-xs text-muted mt-0.5">{e.lieu}</span>}
                      </span>
                      {e.lien && <span className="text-xs text-muted shrink-0">{e.lien.startsWith('/') ? '→' : 'Infos ↗'}</span>}
                    </>
                  )
                  const cls = 'flex gap-4 py-3 border-b border-ink/[0.07] text-sm'
                  return (
                    <li key={e.jour + e.titre}>
                      {!e.lien ? <div className={cls}>{inner}</div>
                        : e.lien.startsWith('/') ? <Link href={`/${locale}${e.lien}`} className={`${cls} hover:bg-panel`}>{inner}</Link>
                        : <a href={e.lien} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-panel`}>{inner}</a>}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <aside className="space-y-10 lg:sticky lg:top-28 self-start">
          <div>
            <h2 className="text-[10px] text-muted uppercase tracking-[.25em] border-b border-ink/10 pb-3">
              {fr ? 'Début des cours' : 'Classes start'}
            </h2>
            <dl className="text-sm">
              {inscription.debutCours.map(([c, cEn, d, dEn]) => (
                <div key={c} className="flex justify-between gap-4 py-2.5 border-b border-ink/[0.07]">
                  <dt className="text-muted">{fr ? c : cEn}</dt>
                  <dd className="text-ink text-right">{fr ? d : dEn}</dd>
                </div>
              ))}
            </dl>
          </div>
          <a href={calendrierJudoQuebec} target="_blank" rel="noopener noreferrer" className="block text-sm text-accent-blue hover:underline">
            {fr ? 'Calendrier complet de Judo Québec 2026-2027 (PDF) ↗' : 'Full Judo Québec 2026-2027 calendar (PDF) ↗'}
          </a>
        </aside>
      </div>
    </>
  )
}
