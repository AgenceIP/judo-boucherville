// Legacy content imported from judoboucherville.com by scripts/import-legacy.mjs
import actualitesJson from './archive/actualites.json'
import resultatsJson from './archive/resultats.json'
import journauxJson from './archive/journaux.json'
import athletesJson from './archive/athletes.json'

export type Block =
  | { t: 'h' | 'p'; text: string }
  | { t: 'img'; src: string; w: number; h: number }
  | { t: 'a'; text: string; href: string }
  | { t: 'm'; o: number; a: number; b: number }
export type Entree = { date?: string; lieu?: string; titre?: string; blocks: Block[] }
export type Saison = { saison: string; entrees: Entree[] }
export type Photo = { src: string; w: number; h: number }
export type Personne = {
  nom: string
  naissance?: string
  debut?: string
  grade?: string
  etudes?: string
  judoinside?: string
  faits?: string[]
  objCourt?: string[]
  objLong?: string[]
  saisons?: { saison: string; victoires?: number; defaites?: number; resultats: string[] }[]
}
export type Athlete = { slug: string; nom: string; photos: Photo[]; personnes: Personne[] }
export type Journal = { titre: string; thumb: string | null; pdf: string }

export const actualites = actualitesJson as Saison[]
export const resultats = resultatsJson as Saison[]
export const journaux = journauxJson as { periode: string; numeros: Journal[] }[]
export const equipes = athletesJson.equipes as Record<string, { nom: string; slug: string | null }[]>
export const athletes = athletesJson.athletes as Athlete[]

export const getAthlete = (slug: string) => athletes.find(a => a.slug === slug) ?? null

export function medailles(s: Saison) {
  const text = s.entrees.flatMap(e => e.blocks).map(b => ('text' in b ? b.text : '')).join(' ')
  const count = (tok: string) => text.split(`⟨${tok}⟩`).length - 1
  return { or: count('or'), argent: count('argent'), bronze: count('bronze') }
}
