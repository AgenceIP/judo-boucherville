import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { athletes, getAthlete, type Personne } from '@/data/archive'
import PageHero from '@/components/shared/PageHero'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return ['fr', 'en'].flatMap(locale => athletes.map(a => ({ locale, slug: a.slug })))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return { title: getAthlete(slug)?.nom }
}

function List({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null
  return (
    <div>
      <h3 className="text-[10px] text-muted uppercase tracking-[.25em] mb-3">{label}</h3>
      <ul className="space-y-1.5 text-sm text-white/80 leading-relaxed">
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  )
}

function Fiche({ p, fr }: { p: Personne; fr: boolean }) {
  const infos = [
    [fr ? 'Naissance' : 'Born', p.naissance],
    [fr ? 'Débuts au judo' : 'Started judo', p.debut],
    ['Grade', p.grade],
    [fr ? 'Études' : 'School', p.etudes],
  ].filter(([, v]) => v)

  return (
    <section className="space-y-10">
      <h2 className="font-heading text-2xl text-white">{p.nom}</h2>
      {infos.length > 0 && (
        <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-3 text-sm">
          {infos.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-white/[0.06] pb-2">
              <dt className="text-muted">{k}</dt><dd className="text-white text-right">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      <List label={fr ? 'Faits saillants' : 'Highlights'} items={p.faits} />
      {p.judoinside && (
        <a href={p.judoinside} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-accent-blue hover:underline">
          {fr ? 'Tous les résultats sur JudoInside' : 'All results on JudoInside'} ↗
        </a>
      )}
      <List label={fr ? 'Objectifs à court terme' : 'Short-term goals'} items={p.objCourt} />
      <List label={fr ? 'Objectifs à long terme' : 'Long-term goals'} items={p.objLong} />
      {p.saisons?.map(s => (
        <div key={s.saison} className="border-t border-white/[0.06] pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h3 className="font-heading text-lg text-white tabular-nums">{s.saison}</h3>
            {s.victoires != null && (
              <p className="text-xs text-muted tabular-nums">
                {s.victoires} {fr ? 'victoires' : 'wins'} · {s.defaites ?? 0} {fr ? 'défaites' : 'losses'}
              </p>
            )}
          </div>
          <ul className="space-y-1 text-sm text-white/80">
            {s.resultats.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      ))}
    </section>
  )
}

export default async function AthletePage({ params }: Props) {
  const { slug, locale } = await params
  const a = getAthlete(slug)
  if (!a) notFound()
  const fr = locale === 'fr'

  return (
    <>
      <PageHero title={a.nom} tag={fr ? 'Athlète' : 'Athlete'} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {a.photos.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {a.photos.map(ph => (
              <Image key={ph.src} src={ph.src} width={ph.w} height={ph.h} alt={a.nom} className="h-48 w-auto object-cover" />
            ))}
          </div>
        )}
        {a.personnes.map(p => <Fiche key={p.nom} p={p} fr={fr} />)}
        <Link href={`/${locale}/athletes`} className="inline-block text-sm text-muted hover:text-white transition-colors">
          ← {fr ? 'Tous les athlètes' : 'All athletes'}
        </Link>
      </div>
    </>
  )
}
