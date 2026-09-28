'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { programmes, type Categorie } from '@/data/programmes'
import { parseHoraire } from '@/lib/schedule'
import { inscription } from '@/data/club'
import { cn } from '@/lib/utils'
import RevealText from '@/components/ui/RevealText'

type Slot = { slug: string; titre: string; titreEn: string; categorie: Categorie; start: string; end: string; codes: string[] }

// One list per weekday, merged by program + time, sorted by start time
const WEEK: Slot[][] = Array.from({ length: 7 }, () => [])
for (const p of programmes) {
  if (p.slug === 'camp-de-jour') continue // summer only, not a weekly class
  for (const g of p.groupes) {
    for (const s of parseHoraire(g.horaire)) {
      const day = WEEK[s.day]
      const same = day.find(x => x.slug === p.slug && x.start === s.start && x.end === s.end)
      if (same) { if (!same.codes.includes(g.code)) same.codes.push(g.code) }
      else day.push({ slug: p.slug, titre: p.titre, titreEn: p.titreEn, categorie: p.categorie, start: s.start, end: s.end, codes: [g.code] })
    }
  }
}
const minutes = (h: string) => { const [a, b] = h.split('h').map(Number); return a * 60 + b }
WEEK.forEach(d => d.sort((a, b) => minutes(a.start) - minutes(b.start)))

const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const TONE: Record<Categorie, string> = {
  enfants: 'bg-accent/30 hover:bg-accent/55',
  adultes: 'bg-blue/10 hover:bg-blue/20',
  'arts-martiaux': 'bg-wood/30 hover:bg-wood/50',
}

const DOT: Record<Categorie, string> = { enfants: 'bg-accent', adultes: 'bg-blue', 'arts-martiaux': 'bg-wood' }

export default function WeekSchedule({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const [filter, setFilter] = useState<Categorie | 'tous'>('tous')
  const filters: [Categorie | 'tous', string][] = [
    ['tous', fr ? 'Tout' : 'All'],
    ['enfants', fr ? 'Enfants' : 'Kids'],
    ['adultes', fr ? 'Adultes' : 'Adults'],
    ['arts-martiaux', fr ? 'Arts martiaux' : 'Martial arts'],
  ]
  const days = fr ? DAYS_FR : DAYS_EN
  // Phones show one day at a time, opening on today
  const [day, setDay] = useState(0)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today is only known in the visitor's browser (server runs in UTC)
    setDay((new Date().getDay() + 6) % 7)
  }, [])

  return (
    <section id="horaire" className="scroll-mt-16 py-20 lg:py-32 bg-panel">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <RevealText as="h2" className="display text-[clamp(3rem,6.5vw,6rem)] text-ink">
              {fr ? 'La semaine au dojo' : 'A week at the dojo'}
            </RevealText>
            <p className="mt-4 text-[1.1rem] text-ink-2">{fr ? `Horaire ${inscription.saison}. Touchez un cours pour tous les détails.` : `Schedule ${inscription.saison}. Tap a class for all the details.`}</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={fr ? 'Filtrer' : 'Filter'}>
            {filters.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={cn(
                  'rounded-full px-4 py-2.5 text-[.92rem] font-semibold transition-[background-color,color,box-shadow] duration-300',
                  filter === key ? 'bg-ink text-panel' : 'bg-canvas text-ink-2 hover:text-ink shadow-[inset_0_0_0_1px_rgba(11,27,56,.15)]'
                )}
              >
                {key !== 'tous' && <span aria-hidden="true" className={cn('inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle', DOT[key])} />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Phone day tabs */}
        <div className="md:hidden mt-10 grid grid-cols-7 gap-1" role="tablist" aria-label={fr ? 'Jour' : 'Day'}>
          {days.map((name, d) => {
            const n = WEEK[d].filter(s => filter === 'tous' || s.categorie === filter).length
            return (
              <button
                key={name}
                role="tab"
                aria-selected={day === d}
                aria-controls={`jour-${d}`}
                onClick={() => setDay(d)}
                className={cn('flex flex-col items-center justify-center min-h-14 rounded-[4px] transition-colors duration-300', day === d ? 'bg-ink text-panel' : 'bg-canvas text-ink')}
              >
                <span className="display text-[1.15rem] leading-none">{name.slice(0, 3)}</span>
                <span className={cn('mt-1 text-[.72rem] tabular-nums', day === d ? 'text-accent' : 'text-ink-2')}>{n}</span>
              </button>
            )
          })}
        </div>

        <div className="cascade mt-4 md:mt-12 grid gap-3 md:grid-cols-7 md:gap-[3px] md:bg-ink/10 md:p-[3px] md:rounded-[6px]">
          {WEEK.map((slots, d) => {
            const visible = slots.filter(s => filter === 'tous' || s.categorie === filter)
            return (
              <div key={d} id={`jour-${d}`} role="tabpanel" style={{ '--i': d } as React.CSSProperties} className={cn('md:block md:bg-panel md:rounded-[3px] md:p-2 md:min-h-[22rem]', day === d ? 'block' : 'hidden')}>
                <h3 className="display text-[1.35rem] text-ink mb-2 md:text-center max-md:sr-only">{days[d]}</h3>
                {visible.length === 0 && <p className="text-[.95rem] md:text-[.85rem] text-ink-2 md:text-center md:mt-6">{fr ? 'Pas de cours ce jour-là.' : 'No class that day.'}</p>}
                <ul className="grid gap-1.5">
                  {visible.map(s => (
                    <li key={s.slug + s.start}>
                      <Link
                        href={`/${locale}/programmes/${s.slug}`}
                        className={cn('block rounded-[3px] px-4 py-3 md:px-2.5 md:py-2 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 active:scale-[.99]', TONE[s.categorie])}
                      >
                        <span className="block tabular-nums text-[1rem] md:text-[.78rem] font-semibold md:font-normal text-ink">{s.start}–{s.end}</span>
                        <span className="block text-[1.05rem] md:text-[.86rem] font-semibold leading-tight text-ink">{fr ? s.titre : s.titreEn}</span>
                        <span className="block tabular-nums text-[.85rem] md:text-[.7rem] text-ink-2 mt-0.5">{s.codes.join(' · ')}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <p className="mt-4 text-[.85rem] text-ink-2">
          {fr
            ? 'Parascolaire, auto-défense et prévention des chutes : un seul jour au choix. Camp de jour l’été.'
            : 'After-school, self-defence and fall prevention: pick one day. Day camp in summer.'}
        </p>
      </div>
    </section>
  )
}
