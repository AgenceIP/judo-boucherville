import Image from 'next/image'
import { journaux } from '@/data/archive'
import PageHero from '@/components/shared/PageHero'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Revue de presse' : 'Press archive' }
}

export default async function JournauxPage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Revue de presse' : 'Press Archive'}
        subtitle={fr
          ? 'Plus de cinquante ans du club dans les journaux locaux, de 1970 à aujourd’hui.'
          : 'Over fifty years of the club in the local papers, from 1970 to today.'}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav aria-label={fr ? 'Périodes' : 'Periods'} className="flex flex-wrap gap-2 mb-14 text-[.95rem] tabular-nums">
          {journaux.map(j => (
            <a key={j.periode} href={`#p-${j.periode}`} className="inline-flex items-center min-h-11 px-3 rounded-full bg-panel text-ink-2 hover:text-ink tabular-nums shadow-[inset_0_0_0_1px_rgba(11,27,56,.15)] transition-colors">{j.periode}</a>
          ))}
        </nav>
        {journaux.map(j => (
          <section key={j.periode} id={`p-${j.periode}`} className="scroll-mt-28 border-t border-ink/10 py-10">
            <h2 className="font-heading text-2xl text-ink mb-6 tabular-nums">{j.periode}</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {j.numeros.map(n => (
                <li key={n.pdf}>
                  <a href={n.pdf} target="_blank" rel="noopener noreferrer" className="group block">
                    <div className="relative aspect-[3/4] bg-panel overflow-hidden mb-2">
                      {n.thumb && (
                        <Image src={n.thumb} alt={n.titre} fill sizes="(min-width: 1024px) 160px, 45vw" className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-[.85rem] text-muted group-hover:text-ink transition-colors leading-snug">{n.titre} ↗</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
