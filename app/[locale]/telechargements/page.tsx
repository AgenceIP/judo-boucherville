import PageHero from '@/components/shared/PageHero'
import { telechargements as groupes } from '@/data/pages'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Téléchargements' : 'Downloads' }
}

export default async function TelechargementsPage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Téléchargements' : 'Downloads'}
        subtitle={fr
          ? 'Programmes techniques par ceinture, outils de compétition et règlements du club.'
          : 'Belt syllabi, competition tools and club bylaws (documents in French).'}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        {groupes.map(g => (
          <section key={g.titre[0]}>
            <h2 className="text-[.78rem] text-muted uppercase tracking-[.25em] border-b border-ink/10 pb-3">{g.titre[fr ? 0 : 1]}</h2>
            <ul>
              {g.docs.map(d => (
                <li key={d.href}>
                  <a href={d.href} target="_blank" rel="noopener noreferrer" className="group flex justify-between gap-6 border-b border-ink/10 py-4 text-ink hover:text-royal transition-colors">
                    {d.titre}
                    <span className="text-[.85rem] text-muted group-hover:text-royal shrink-0">{d.href.endsWith('.pdf') ? 'PDF ↗' : '↗'}</span>
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
