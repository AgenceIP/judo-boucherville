import Link from 'next/link'
import { equipes, getAthlete } from '@/data/archive'
import PageHero from '@/components/shared/PageHero'

const LABELS: Record<string, [string, string]> = {
  canada: ['Équipe du Canada', 'Team Canada'],
  quebec: ['Équipe du Québec', 'Team Québec'],
  'sport-etudes': ['Sport-études', 'Sport-études'],
  u10: ['U10', 'U10'],
  u12: ['U12', 'U12'],
  u14: ['U14', 'U14'],
  u16: ['U16', 'U16'],
  u18: ['U18', 'U18'],
  u21: ['U21', 'U21'],
  senior: ['Senior', 'Senior'],
  master: ['Master', 'Masters'],
  kata: ['Kata', 'Kata'],
  anciens: ['Anciens athlètes', 'Alumni'],
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Athlètes' : 'Athletes' }
}

export default async function AthletesPage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Nos athlètes' : 'Our Athletes'}
        subtitle={fr
          ? 'L’équipe de compétition du club, des U10 aux masters, et ceux qui ont marqué son histoire.'
          : 'The club’s competition team, from U10 to masters, and those who shaped its history.'}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
        {Object.entries(equipes).map(([key, membres]) => (
          <section key={key}>
            <h2 className="text-[10px] text-muted uppercase tracking-[.25em] border-b border-white/[0.06] pb-3 mb-3">
              {LABELS[key]?.[fr ? 0 : 1] ?? key}
            </h2>
            <ul className="space-y-1.5">
              {membres.map(m => (
                <li key={m.nom}>
                  {m.slug && getAthlete(m.slug)
                    ? <Link href={`/${locale}/athletes/${m.slug}`} className="text-white hover:text-royal transition-colors">{m.nom} <span className="text-muted">→</span></Link>
                    : <span className="text-white/70">{m.nom}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
