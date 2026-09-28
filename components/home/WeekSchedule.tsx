'use client'
import { useState } from 'react'
import Link from 'next/link'
import { programmes, type Categorie } from '@/data/programmes'
import { parseHoraire } from '@/lib/schedule'
import { cn } from '@/lib/utils'

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
  enfants: 'bg-accent/25 shadow-[inset_3px_0_0_var(--color-accent)]',
  adultes: 'bg-blue/10 shadow-[inset_3px_0_0_var(--color-blue)]',
  'arts-martiaux': 'bg-wood/25 shadow-[inset_3px_0_0_var(--color-wood)]',
}

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

  return (
    <section id="horaire" className="scroll-mt-20 py-20 lg:py-28 bg-panel">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-blue">{fr ? 'Horaire 2026-2027' : 'Schedule 2026-2027'}</p>
            <h2 className="mt-3 font-display font-extrabold uppercase text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[.88] text-ink">
              {fr ? 'La semaine au dojo' : 'A week at the dojo'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={fr ? 'Filtrer' : 'Filter'}>
            {filters.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={cn(
                  'rounded-full px-4 py-2 text-[.9rem] font-semibold transition-colors',
                  filter === key ? 'bg-ink text-panel' : 'bg-canvas text-ink-2 hover:text-ink shadow-[inset_0_0_0_1px_rgba(11,27,56,.15)]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-7 md:gap-[3px] md:bg-ink/10 md:p-[3px] md:rounded-[6px]">
          {WEEK.map((slots, d) => {
            const visible = slots.filter(s => filter === 'tous' || s.categorie === filter)
            return (
              <div key={d} className="md:bg-panel md:rounded-[3px] md:p-2 md:min-h-[22rem]">
                <h3 className="label text-ink mb-2 md:text-center">{days[d]}</h3>
                {visible.length === 0 && <p className="text-[.85rem] text-ink-2 md:text-center md:mt-6">·</p>}
                <ul className="grid gap-1.5">
                  {visible.map(s => (
                    <li key={s.slug + s.start}>
                      <Link
                        href={`/${locale}/programmes/${s.slug}`}
                        className={cn('block rounded-[3px] px-2.5 py-2 transition-transform duration-200 hover:-translate-y-px', TONE[s.categorie])}
                      >
                        <span className="block font-mono text-[.78rem] text-ink">{s.start}–{s.end}</span>
                        <span className="block text-[.86rem] font-semibold leading-tight text-ink">{fr ? s.titre : s.titreEn}</span>
                        <span className="block font-mono text-[.7rem] text-ink-2 mt-0.5">{s.codes.join(' · ')}</span>
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
