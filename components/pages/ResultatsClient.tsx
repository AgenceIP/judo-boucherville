'use client'
import { useState, useMemo } from 'react'
import { cn, formatDate } from '@/lib/utils'
import type { Resultat } from '@/sanity/queries/resultats'

type Props = {
  resultats: Resultat[]
  saisons: string[]
  locale: string
}

const medalConfig = {
  or: { label: 'Or', emoji: '🥇', className: 'border-yellow-400/30 bg-yellow-400/5 text-yellow-400' },
  argent: { label: 'Argent', emoji: '🥈', className: 'border-gray-400/30 bg-gray-400/5 text-gray-300' },
  bronze: { label: 'Bronze', emoji: '🥉', className: 'border-orange-400/30 bg-orange-400/5 text-orange-400' },
}

export default function ResultatsClient({ resultats, saisons, locale }: Props) {
  const [activeSaison, setActiveSaison] = useState<string>('all')
  const [activeCompetition, setActiveCompetition] = useState<string>('all')

  const competitions = useMemo(() => {
    const filtered = activeSaison === 'all' ? resultats : resultats.filter(r => r.saison === activeSaison)
    return ['all', ...new Set(filtered.map(r => r.competition))]
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
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label htmlFor="filter-saison" className="text-xs text-muted uppercase tracking-wider block mb-2">Saison</label>
          <select
            id="filter-saison"
            value={activeSaison}
            onChange={e => { setActiveSaison(e.target.value); setActiveCompetition('all') }}
            className="bg-bg-surface border border-white/10 text-foreground text-sm rounded-lg px-3 py-2 focus:border-accent-blue outline-none"
          >
            <option value="all">Toutes les saisons</option>
            {saisons.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-competition" className="text-xs text-muted uppercase tracking-wider block mb-2">Compétition</label>
          <select
            id="filter-competition"
            value={activeCompetition}
            onChange={e => setActiveCompetition(e.target.value)}
            className="bg-bg-surface border border-white/10 text-foreground text-sm rounded-lg px-3 py-2 focus:border-accent-blue outline-none"
          >
            <option value="all">Toutes</option>
            {competitions.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {(Object.keys(medalConfig) as Array<keyof typeof medalConfig>).map(key => (
          <div key={key} className={cn('border rounded-xl p-4 text-center', medalConfig[key].className)}>
            <span className="text-2xl block">{medalConfig[key].emoji}</span>
            <span className="font-heading text-3xl block">{counts[key]}</span>
            <span className="text-xs uppercase tracking-wider">{medalConfig[key].label}</span>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted text-center py-12">Aucun résultat trouvé.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const config = medalConfig[r.medaille as keyof typeof medalConfig]
            if (!config) return null
            return (
            <div
              key={r._id}
              className={cn('flex items-center gap-4 p-4 rounded-xl border', config.className)}
            >
              <span className="text-2xl shrink-0">{config.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{r.athlete}</p>
                <p className="text-sm text-muted">{r.competition} · {r.categorie}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted">{r.saison}</p>
                {r.date && <p className="text-xs text-muted">{formatDate(r.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>}
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
