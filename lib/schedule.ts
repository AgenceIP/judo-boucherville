// Reads the free-text schedules and age groups in data/programmes.ts, so the
// class finder and the weekly grid never drift from the source data.

export type Seance = { day: number; start: string; end: string }

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

/** "Lundi et vendredi 18h00 à 19h00, samedi 14h30 à 16h30" → one entry per day. */
export function parseHoraire(horaire: string): Seance[] {
  const out: Seance[] = []
  let pending: number[] = []
  const re = /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)|(\d{1,2}h\d{2})\s*à\s*(\d{1,2}h\d{2})/gi
  for (const m of horaire.matchAll(re)) {
    if (m[1]) pending.push(DAYS.indexOf(m[1].toLowerCase()))
    else {
      for (const day of pending) out.push({ day, start: m[2], end: m[3] })
      pending = []
    }
  }
  return out
}

export type YearRange = { min: number; max: number }

/** Birth-year range for a group's clientele line, for the given season start year. */
export function birthYears(clientele: string, season: number): YearRange | null {
  const plus = clientele.match(/(\d+)\s*ans\s*et\s*plus/i)
  if (plus) return { min: -Infinity, max: season - Number(plus[1]) }

  const ages = clientele.match(/(\d+)\s*à\s*(\d+)\s*ans/i)
  if (ages) return { min: season - Number(ages[2]), max: season - Number(ages[1]) }

  // Québec primary school: 3e année ≈ 8 ans … 5e année ≈ 11 ans
  const grades = [...clientele.matchAll(/(\d)e/g)].map(m => Number(m[1]))
  if (/année/i.test(clientele) && grades.length) {
    return { min: season - (Math.max(...grades) + 6), max: season - (Math.min(...grades) + 5) }
  }

  const years = [...clientele.matchAll(/\b(19|20)\d{2}\b/g)].map(m => Number(m[0]))
  if (!years.length) return null
  if (/et avant/i.test(clientele)) return { min: -Infinity, max: Math.max(...years) }
  return { min: Math.min(...years), max: Math.max(...years) }
}

export function matchesBirthYear(clientele: string, year: number, season: number): boolean {
  const r = birthYears(clientele, season)
  return !!r && year >= r.min && year <= r.max
}
