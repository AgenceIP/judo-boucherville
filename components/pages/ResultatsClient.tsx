'use client'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Resultat } from '@/data/resultats'

type Props = {
  resultats: Resultat[]
  saisons: string[]
  locale: string
}

const medalLabel = { or: 'Or', argent: 'Argent', bronze: 'Bronze' }
const medalDot = {
  or: 'bg-yellow-400',
  argent: 'bg-gray-300',
  bronze: 'bg-orange-400',
}

export default function ResultatsClient({ resultats, saisons, locale }: Props) {
  const [activeSaison, setActiveSaison] = useState<string>('all')
  const [activeCompetition, setActiveCompetition] = useState<string>('all')

  const competitions = useMemo(() => {
    const filtered = activeSaison === 'all' ? resultats : resultats.filter(r => r.saison === activeSaison)
    return [...new Set(filtered.map(r => r.competition))]
  }, [resultats, activeSaison])

  const filtered = useMemo(() => {
    return resultats.filter(r => {
      const matchSaison = activeSaison === 'all' || r.saison === activeSaison
      const matchComp = activeCompetition === 'all' || r.competition === activeCompetition
      return matchSaison && matchComp
    })
  }, [resultats, activeSaison, activeCompetition])

  const counts = useMemo(() => ({
    or: filtered.filter(r => r.medaille === 'or').length,
    argent: filtered.filter(r => r.medaille === 'argent').length,
    bronze: filtered.filter(r => r.medaille === 'bronze').length,
  }), [filtered])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-12 border-b border-foreground/15 pb-8">
        <div>
          <label htmlFor="filter-saison" className="text-[10px] text-muted uppercase tracking-[.25em] block mb-2">Saison</label>
          <select
            id="filter-saison"
            value={activeSaison}
            onChange={e => { setActiveSaison(e.target.value); setActiveCompetition('all') }}
            className="bg-bg-surface border border-foreground/15 text-foreground text-sm px-3 py-2 outline-none focus:border-royal appearance-none pr-8"
          >
            <option value="all">Toutes les saisons</option>
            {saisons.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-competition" className="text-[10px] text-muted uppercase tracking-[.25em] block mb-2">Compétition</label>
          <select
            id="filter-competition"
            value={activeCompetition}
            onChange={e => setActiveCompetition(e.target.value)}
            className="bg-bg-surface border border-foreground/15 text-foreground text-sm px-3 py-2 outline-none focus:border-royal appearance-none pr-8"
          >
            <option value="all">Toutes</option>
            {competitions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Medal counts — horizontal stat rows */}
      <div className="mb-12">
        {(['or', 'argent', 'bronze'] as const).map(key => (
          <div key={key} className="border-t border-foreground/15 group">
            <div className="py-5 flex items-center gap-8">
              <span
                className="font-heading text-royal leading-none shrink-0 tabular-nums text-right"
                style={{ fontSize: 'clamp(40px,5vw,72px)', width: 'clamp(60px,10vw,120px)' }}
              >
                {counts[key]}
              </span>
              <div className="flex items-center gap-3 border-l border-foreground/15 pl-8">
                <span className={cn('w-2 h-2 shrink-0', medalDot[key])} />
                <span className="font-heading text-lg md:text-xl text-foreground tracking-wider uppercase">
                  {medalLabel[key]}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div className="border-t border-foreground/15" />
      </div>

      {/* Results list */}
      {filtered.length === 0 ? (
        <p className="text-muted py-12">Aucun résultat pour le moment.</p>
      ) : (
        <div>
          {filtered.map(r => (
            <div
              key={r.id}
              className="border-t border-foreground/15 py-4 flex items-center gap-4 group hover:border-royal/30 transition-colors duration-200"
            >
              <span className={cn('w-1.5 h-1.5 shrink-0', medalDot[r.medaille])} />
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium truncate">{r.athlete}</p>
                <p className="text-muted text-xs mt-0.5">{r.categorie}</p>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-muted text-sm">{r.competition}</p>
                <p className="text-muted text-xs">{r.saison}</p>
              </div>
              <span className="text-[10px] text-muted uppercase tracking-[.2em] shrink-0 w-14 text-right">
                {medalLabel[r.medaille]}
              </span>
            </div>
          ))}
          <div className="border-t border-foreground/15" />
        </div>
      )}
    </div>
  )
}
