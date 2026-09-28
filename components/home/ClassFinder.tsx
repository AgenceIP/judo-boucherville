'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { programmes } from '@/data/programmes'
import { matchesBirthYear, birthYears } from '@/lib/schedule'
import { inscription } from '@/data/club'
import RevealText from '@/components/ui/RevealText'
import Magnetic from '@/components/ui/Magnetic'
import { cn } from '@/lib/utils'

// Everything follows the season written in data/club.ts (« 2026-2027 » → 2026).
// Next season, update that line and the groups in data/programmes.ts: the year
// list and the matching follow on their own.
const SEASON = Number(inscription.saison.slice(0, 4))

// Programs with age groups the finder can match (sport-études has none)
const board = programmes.filter(p => p.groupes.length > 0)

// Youngest birth year any group accepts (2022 this season), down to 1940
const YOUNGEST = Math.max(...board.flatMap(p => p.groupes.map(g => birthYears(g.clientele, SEASON)?.max ?? -Infinity)))
const YEARS = Array.from({ length: YOUNGEST - 1940 + 1 }, (_, i) => YOUNGEST - i)

/**
 * The one interactive moment, on a full tatami-blue field: pick a birth year
 * and the mats of every class that fits flip over to yellow, then the cards
 * below say when, how much, and where to sign up.
 */
export default function ClassFinder({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const [year, setYear] = useState<number | null>(null)

  const matches = useMemo(() => {
    if (year === null) return []
    return board
      .map(p => ({ p, groupes: p.groupes.filter(g => matchesBirthYear(g.clientele, year, SEASON)) }))
      .filter(m => m.groupes.length > 0)
  }, [year])
  const lit = new Set(matches.map(m => m.p.slug))

  return (
    <section id="trouver" className="on-dark scroll-mt-16 bg-blue text-panel py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <RevealText as="h2" className="display text-[clamp(3.2rem,7vw,6rem)] text-panel">
              {fr ? 'Trouver mon cours' : 'Find my class'}
            </RevealText>
            <p className="mt-6 text-[1.15rem] leading-relaxed text-panel/85 max-w-[36ch]">
              {fr
                ? `Saison ${inscription.saison}. Choisissez l’année de naissance : les cours qui vous conviennent se retournent.`
                : `Season ${inscription.saison}. Choose the year of birth: the classes that fit flip over.`}
            </p>
            <label className="mt-9 block max-w-xs">
              <span className="text-[.95rem] font-semibold text-panel">{fr ? 'Année de naissance' : 'Year of birth'}</span>
              <select
                className="mt-2 block w-full rounded-[4px] bg-panel px-4 py-4 text-[1.1rem] font-semibold text-ink shadow-[0_0_0_3px_rgba(242,183,5,0)] transition-shadow duration-300 focus-visible:shadow-[0_0_0_3px_var(--color-accent)] focus-visible:outline-none"
                value={year ?? ''}
                onChange={e => setYear(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">{fr ? 'Choisir une année…' : 'Choose a year…'}</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <p className="mt-4 text-[.95rem] text-panel/80" aria-live="polite">
              {year === null
                ? (fr ? `${programmes.length} programmes, du lundi au dimanche.` : `${programmes.length} programs, Monday to Sunday.`)
                : matches.length === 0
                  ? (fr ? 'Aucun cours pour cette année. Appelez-nous au 450 655-1888.' : 'No class for this year. Call us at 450 655-1888.')
                  : (fr ? `${matches.length} programme${matches.length > 1 ? 's' : ''} pour vous.` : `${matches.length} program${matches.length > 1 ? 's' : ''} for you.`)}
            </p>
          </div>

          <div>
            {/* The tatami board: one mat per program, lit mats flip to yellow */}
            <ul className="cascade grid grid-cols-2 sm:grid-cols-3 gap-[4px] p-[4px] bg-blue-deep rounded-[6px]" aria-label={fr ? 'Programmes' : 'Programs'}>
              {board.map((p, i) => {
                const on = lit.has(p.slug)
                const face = 'absolute inset-0 flex flex-col justify-between rounded-[3px] p-3 [backface-visibility:hidden]'
                return (
                  <li key={p.slug} style={{ '--i': i } as React.CSSProperties} className="[perspective:900px]">
                    <a
                      href={on ? `#cours-${p.slug}` : `/${locale}/programmes/${p.slug}`}
                      aria-label={`${fr ? p.titre : p.titreEn} · ${p.horaire}`}
                      className="group block relative min-h-[88px] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] [transform-style:preserve-3d]"
                      style={{ transform: on ? 'rotateX(180deg)' : 'none', transitionDelay: `${i * 55}ms` }}
                    >
                      <span className={cn(face, 'bg-[#0f4a9e] text-[#e6ecf6] transition-colors group-hover:bg-[#1656b3]')} aria-hidden="true">
                        <span className="text-[.92rem] font-semibold leading-tight">{fr ? p.titre : p.titreEn}</span>
                        <span className="text-[.74rem] tabular-nums text-[#b9c7e0]">{p.horaire}</span>
                      </span>
                      <span className={cn(face, 'bg-accent text-ink [transform:rotateX(180deg)]')} aria-hidden="true">
                        <span className="text-[.92rem] font-semibold leading-tight">{fr ? p.titre : p.titreEn}</span>
                        <span className="text-[.74rem] tabular-nums">{p.horaire}</span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>

            {matches.length > 0 && (
              <div key={year} className="mt-8 grid gap-4">
                {matches.map(({ p, groupes }, i) => (
                  <article
                    key={p.slug}
                    id={`cours-${p.slug}`}
                    className="rise scroll-mt-24 rounded-[6px] bg-panel text-ink p-5 sm:p-7"
                    style={{ '--i': i } as React.CSSProperties}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="display text-[2rem]">{fr ? p.titre : p.titreEn}</h3>
                      {p.cours && <span className="text-[.9rem] font-semibold text-blue">{p.cours}</span>}
                    </div>
                    <p className="mt-2 text-ink-2">{fr ? p.resume : p.resumeEn}</p>
                    <dl className="mt-5 grid gap-2">
                      {groupes.map(g => (
                        <div key={g.code} className="grid sm:grid-cols-[7rem_1fr] gap-x-4 border-t border-ink/10 pt-2.5">
                          <dt className="tabular-nums text-[.9rem] font-semibold text-blue">{g.code}</dt>
                          <dd>
                            <span className="font-semibold">{g.horaire}</span>
                            <span className="block text-[.92rem] text-ink-2">{g.clientele}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {p.tarifs.length > 0 && (
                      <ul className="mt-5 grid gap-1.5">
                        {p.tarifs.map(t => (
                          <li key={t.periode} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[3px] bg-canvas px-3.5 py-2.5">
                            <span className="text-[.95rem] text-ink-2">{t.periode}</span>
                            <span className="display text-[1.6rem] leading-none">{t.prix[t.prix.length - 1]}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Magnetic strength={0.2}>
                        {p.formulaire ? (
                          <a href={p.formulaire} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            {fr ? 'S’inscrire' : 'Register'} <ArrowRight size={16} aria-hidden="true" className="arr" />
                          </a>
                        ) : (
                          <Link href={`/${locale}/inscription`} className="btn btn-primary">{fr ? 'S’inscrire' : 'Register'}</Link>
                        )}
                      </Magnetic>
                      <Link href={`/${locale}/programmes/${p.slug}`} className="btn btn-ghost">{fr ? 'Tous les détails' : 'All details'}</Link>
                    </div>
                  </article>
                ))}
                <p className="text-[.9rem] text-panel/75">
                  {fr
                    ? 'Tarifs réguliers de la saison. Les horaires peuvent changer selon le nombre d’inscriptions.'
                    : 'Regular season fees. Schedules may change depending on registrations.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
