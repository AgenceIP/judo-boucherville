import Link from 'next/link'
import { medailles, type Saison } from '@/data/archive'
import Blocks, { Medal } from './Blocks'

type Props = { base: 'resultats' | 'actualites'; saisons: Saison[]; saison: Saison; locale: string }

/** One season of the legacy archive, with links to every other season */
export default function SeasonArchive({ base, saisons, saison, locale }: Props) {
  const m = medailles(saison)
  const fr = locale === 'fr'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <nav aria-label={fr ? 'Saisons' : 'Seasons'} className="flex flex-wrap gap-2 mb-14 text-[.95rem] tabular-nums">
        {saisons.map(s => (
          <Link
            key={s.saison}
            href={`/${locale}/${base}/${s.saison}`}
            aria-current={s.saison === saison.saison ? 'page' : undefined}
            className={`inline-flex items-center min-h-11 px-4 rounded-full transition-colors ${s.saison === saison.saison ? 'bg-ink text-panel' : 'bg-panel text-ink-2 hover:text-ink shadow-[inset_0_0_0_1px_rgba(11,27,56,.15)]'}`}
          >
            {s.saison}
          </Link>
        ))}
      </nav>

      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-6">
        <h2 className="font-heading text-3xl md:text-4xl text-ink tabular-nums">{saison.saison}</h2>
        {m.or + m.argent + m.bronze > 0 && (
          <p className="text-sm text-muted tabular-nums">
            <Medal kind="or" locale={locale} />{m.or}
            <Medal kind="argent" locale={locale} />{m.argent}
            <Medal kind="bronze" locale={locale} />{m.bronze}
          </p>
        )}
      </header>

      {saison.entrees.map((e, i) => (
        <article key={i} className="grid md:grid-cols-[200px_1fr] gap-3 md:gap-10 border-b border-ink/10 py-10">
          <div className="space-y-1">
            {e.date && <p className="text-[.78rem] uppercase tracking-[.25em] text-royal tabular-nums">{e.date}</p>}
            {e.titre && e.lieu && <p className="text-[.85rem] text-muted">{e.lieu}</p>}
          </div>
          <div className="min-w-0">
            {(e.titre ?? e.lieu) && (
              <h3 className="font-heading text-xl text-ink leading-tight mb-4">{e.titre ?? e.lieu}</h3>
            )}
            <Blocks blocks={e.blocks} locale={locale} alt={e.titre ?? e.lieu ?? saison.saison} />
          </div>
        </article>
      ))}
    </div>
  )
}
