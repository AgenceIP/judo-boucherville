'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { programmes } from '@/data/programmes'
import { matchesBirthYear } from '@/lib/schedule'
import { cn } from '@/lib/utils'

const SEASON = 2026
const YEARS = Array.from({ length: SEASON - 4 - 1940 + 1 }, (_, i) => SEASON - 4 - i)

// Programs with age groups the finder can match (sport-études has none)
const board = programmes.filter(p => p.groupes.length > 0)

/**
 * The one interactive moment: pick a birth year and the mats of every class
 * that fits light up, then the cards below say when, how much, and where to sign up.
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
    <section id="trouver" className="scroll-mt-20 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label text-blue">{fr ? 'Saison 2026-2027' : 'Season 2026-2027'}</p>
            <h2 className="mt-3 font-display font-extrabold uppercase text-[clamp(2.8rem,6vw,5rem)] leading-[.88] text-ink">
              {fr ? 'Trouver mon cours' : 'Find my class'}
            </h2>
            <p className="mt-4 text-[1.1rem] text-ink-2 max-w-[38ch]">
              {fr
                ? 'Choisissez l’année de naissance. Les cours qui vous conviennent s’allument.'
                : 'Choose the year of birth. The classes that fit light up.'}
            </p>
            <label className="mt-8 block">
              <span className="label text-ink">{fr ? 'Année de naissance' : 'Year of birth'}</span>
              <select
                className="mt-2 block w-full max-w-xs rounded-[4px] bg-panel px-4 py-3.5 text-[1.05rem] font-semibold text-ink shadow-[inset_0_0_0_1.5px_rgba(11,27,56,.3)] focus-visible:shadow-[inset_0_0_0_2px_var(--color-blue)]"
                value={year ?? ''}
                onChange={e => setYear(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">{fr ? 'Choisir une année…' : 'Choose a year…'}</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <p className="mt-4 text-[.9rem] text-ink-2" aria-live="polite">
              {year === null
                ? (fr ? `${programmes.length} programmes, du lundi au dimanche.` : `${programmes.length} programs, Monday to Sunday.`)
                : matches.length === 0
                  ? (fr ? 'Aucun cours pour cette année. Appelez-nous au 450 655-1888.' : 'No class for this year. Call us at 450 655-1888.')
                  : (fr ? `${matches.length} programme${matches.length > 1 ? 's' : ''} pour vous.` : `${matches.length} program${matches.length > 1 ? 's' : ''} for you.`)}
            </p>
          </div>

          {/* The tatami board: one mat per program */}
          <div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-[3px] p-[3px] bg-blue rounded-[6px]" aria-label={fr ? 'Programmes' : 'Programs'}>
              {board.map((p, i) => {
                const on = lit.has(p.slug)
                return (
                  <li key={p.slug}>
                    <a
                      href={on ? `#cours-${p.slug}` : `/${locale}/programmes/${p.slug}`}
                      className={cn(
                        'relative flex h-full min-h-[76px] flex-col justify-between rounded-[3px] p-3 transition-[background-color,color,transform] duration-500',
                        on ? 'bg-accent text-ink' : 'bg-[#123f86] text-[#dfe6f3] hover:bg-[#164b9c]'
                      )}
                      style={{ transitionDelay: on ? `${i * 45}ms` : '0ms' }}
                    >
                      <span className="text-[.92rem] font-semibold leading-tight">{fr ? p.titre : p.titreEn}</span>
                      <span className={cn('label mt-2', on ? 'text-ink' : 'text-[#b7c4dc]')}>{p.horaire}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

            {matches.length > 0 && (
              <div className="mt-8 grid gap-4">
                {matches.map(({ p, groupes }) => (
                  <article key={p.slug} id={`cours-${p.slug}`} className="scroll-mt-24 rounded-[6px] bg-panel p-5 sm:p-6 shadow-[0_0_0_1px_rgba(11,27,56,.1)]">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-display font-extrabold uppercase text-[1.9rem] leading-none text-ink">{fr ? p.titre : p.titreEn}</h3>
                      <span className="label text-blue">{p.cours ?? ''}</span>
                    </div>
                    <p className="mt-2 text-ink-2">{fr ? p.resume : p.resumeEn}</p>
                    <dl className="mt-4 grid gap-2">
                      {groupes.map(g => (
                        <div key={g.code} className="grid sm:grid-cols-[7rem_1fr] gap-x-4 border-t border-ink/10 pt-2">
                          <dt className="font-mono text-[.85rem] text-blue">{g.code}</dt>
                          <dd className="text-ink">
                            <span className="font-semibold">{g.horaire}</span>
                            <span className="block text-[.9rem] text-ink-2">{g.clientele}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {p.tarifs.length > 0 && (
                      <ul className="mt-4 grid gap-1 text-[.95rem]">
                        {p.tarifs.map(t => (
                          <li key={t.periode} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[3px] bg-canvas px-3 py-2">
                            <span className="text-ink-2">{t.periode}</span>
                            <span className="font-display font-bold text-[1.35rem] leading-none text-ink">{t.prix[t.prix.length - 1]}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-5 flex flex-wrap gap-3">
                      {p.formulaire ? (
                        <a href={p.formulaire} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                          {fr ? 'S’inscrire' : 'Register'} <ArrowRight size={16} aria-hidden="true" />
                        </a>
                      ) : (
                        <Link href={`/${locale}/inscription`} className="btn btn-primary">{fr ? 'S’inscrire' : 'Register'}</Link>
                      )}
                      <Link href={`/${locale}/programmes/${p.slug}`} className="btn btn-ghost">{fr ? 'Tous les détails' : 'All details'}</Link>
                    </div>
                  </article>
                ))}
                <p className="text-[.85rem] text-ink-2">
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
