import { EQUIPES } from '@/sanity/equipes'
import { debutSaison, saisonCourante } from '@/lib/saison'
import {
  PHOTO_KEYS, type Athlete, type Bloc, type ChallengeData, type Club, type Conseil, type Division, type Equipes,
  type Historique, type Inscription, type Instructeur, type Ligne, type Mois, type Palmares, type Participation,
  type PhotosSite, type Saison, type Telechargement,
} from './types'

type Hotspot = { x: number; y: number }
type Vide = string | null | undefined

/** GROQ returns null for empty fields; the site's types use "absent". Drops null, undefined and '' at every level. */
export function clean<T>(v: T): T {
  if (Array.isArray(v)) return v.filter(x => x != null && x !== '').map(clean) as T
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).filter(([, x]) => x != null && x !== '').map(([k, x]) => [k, clean(x)])) as T
  }
  return v
}

/** Sanity's focal point (hotspot) becomes a CSS object-position, so a cropped photo keeps its subject in view. */
export function photo<T extends object>(img: T & { hotspot?: Hotspot }): Omit<T, 'hotspot'> & { pos?: string } {
  const { hotspot, ...p } = img
  return hotspot ? { ...p, pos: `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%` } : p
}

export type ClubRow = Club & {
  inscription: Omit<Inscription, 'debutCours'> & { debutCours: { programme: string; programmeEn: string; date: string; dateEn: string }[] }
  palmares: { championnat: string; championnatEn: string; or: number; argent: number; bronze: number }[]
}
export function toClub(r: ClubRow) {
  const { inscription: { debutCours, ...inscription }, palmares, ...club } = clean(r)
  const p: Palmares[] = palmares.map(x => [x.championnat, x.championnatEn, x.or, x.argent, x.bronze])
  return {
    club: club as Club,
    inscription: { ...inscription, debutCours: debutCours.map(d => [d.programme, d.programmeEn, d.date, d.dateEn]) } as Inscription,
    palmares: p,
    totalPalmares: p.reduce((t, [, , o, a, b]) => [t[0] + o, t[1] + a, t[2] + b], [0, 0, 0]),
  }
}

export type InstructeurRow = Omit<Instructeur, 'photo'> & { photo?: { src: string; w: number; h: number; hotspot?: Hotspot } }
export const toInstructeur = (r: InstructeurRow): Instructeur => {
  const { photo: p, ...i } = clean(r)
  return p ? { ...i, photo: photo(p) } : i
}

export type AthleteRow = Omit<Athlete, 'photos'> & { photos: { src: string; w: number; h: number; hotspot?: Hotspot }[] }
export const toAthlete = (r: AthleteRow): Athlete => {
  const a = clean(r)
  return { ...a, photos: a.photos.map(photo) }
}

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export type EvenementRow = { debut: string; fin?: string; titre: string; lieu?: string; lien?: string }
/** Events of the current season (and later), grouped by start month, in date order. */
export function buildCalendrier(rows: EvenementRow[], today = new Date()): Mois[] {
  const depuis = debutSaison(saisonCourante(today))
  const mois: Mois[] = []
  for (const { debut, fin, titre, lieu, lien } of rows) {
    if ((fin ?? debut) < depuis) continue
    const [a, m, j] = debut.split('-')
    const jour = !fin || fin === debut ? j
      : fin.slice(0, 7) === debut.slice(0, 7) ? `${j}-${fin.slice(8)}`
      : `${j}/${m}–${fin.slice(8)}/${fin.slice(5, 7)}`
    const nom = `${MOIS[+m - 1]} ${a}`
    let g = mois.at(-1)
    if (g?.mois !== nom) mois.push((g = { mois: nom, moisEn: `${MONTHS[+m - 1]} ${a}`, evenements: [] }))
    g.evenements.push(clean({ jour, titre, lieu, lien }))
  }
  return mois
}

export type EquipeRow = { nom: string; slug?: string | null; equipes?: string[] | null; aPage: boolean }
/** Team lists in the site's team order, names in French alphabetical order; a name links only if its page exists. */
export function buildEquipes(rows: EquipeRow[]): Equipes {
  const tri = [...rows].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  return Object.fromEntries(
    EQUIPES.map(([key]) => [key, tri.filter(r => r.equipes?.includes(key)).map(r => ({ nom: r.nom, slug: r.aPage && r.slug ? r.slug : null }))] as const)
      .filter(([, membres]) => membres.length),
  )
}

export type ArticleRow = { saison: string; tri: number; date?: string | null; lieu?: string | null; titre?: string | null; contenu: Bloc[] }
/** One entry per document → the site's « one list per season », newest season and newest entry first. */
export function groupSaisons(rows: ArticleRow[]): Saison[] {
  return [...new Set(rows.map(r => r.saison))].sort().reverse().map(saison => ({
    saison,
    entrees: rows.filter(r => r.saison === saison).sort((a, b) => b.tri - a.tri)
      .map(({ date, lieu, titre, contenu }) => ({ ...clean({ date, lieu, titre }), contenu }) as Saison['entrees'][number]),
  }))
}

/** Medals inserted in the text with the « Médaille » button (the tally block is a summary, not counted). */
export function medailles(s: Saison) {
  const n = { or: 0, argent: 0, bronze: 0 }
  for (const e of s.entrees) for (const b of e.contenu) if (b._type === 'block') for (const c of b.children) if (c._type === 'medaille') n[c.kind]++
  return n
}

export type ChallengeRow = Omit<ChallengeData['challenge'], 'couts' | 'bourses' | 'limites'> & {
  couts: { athletes: string; prix: string }[]
  bourses: { division: string; divisionEn: string; montant: string }[]
  limites: { pour: string; pourEn: string; date: string; dateEn: string }[]
  divisions: { division: string; hommes: Vide; femmes: Vide; nes: Vide; nesEn: Vide; grades: Vide; gradesEn: Vide; pesee: Vide }[]
  commanditaires: { logo: string; nom: string }[]
  palmares: { annee: number; coupe: { club: string; points?: number | null }[]; divisions: { division: string; or: Vide; argent: Vide; bronze: Vide; meilleur: Vide }[] }[]
}
const c = (s: Vide) => s ?? ''
export function toChallenge(r: ChallengeRow): ChallengeData {
  const { couts, bourses, limites, divisions, commanditaires, palmares, ...challenge } = r
  return {
    challenge: {
      ...clean(challenge),
      couts: couts.map(x => [x.athletes, x.prix]),
      bourses: bourses.map(x => [x.division, x.divisionEn, x.montant]),
      limites: limites.map(x => [x.pour, x.pourEn, x.date, x.dateEn]),
    },
    divisions: divisions.map(d => [d.division, c(d.hommes), c(d.femmes), c(d.nes), c(d.nesEn), c(d.grades), c(d.gradesEn), c(d.pesee)] as Division),
    commanditaires: commanditaires.map(x => [x.logo, x.nom]),
    palmaresChallenge: palmares.map(e => ({
      annee: e.annee,
      coupe: e.coupe.map(x => (x.points == null ? [x.club] : [x.club, x.points]) as [string, number?]),
      ...(e.divisions.length > 0 && { divisions: e.divisions.map(d => [d.division, c(d.or), c(d.argent), c(d.bronze), c(d.meilleur)] as Ligne) }),
    })),
  }
}

export type ConseilRow = { membres: { role: string; roleEn: string; nom: string; courriel?: string | null }[]; presidents: { mandat: string; nom: string }[] }
export const toConseil = (r: ConseilRow): Conseil => ({
  membres: r.membres.map(m => [m.role, m.roleEn, m.nom, m.courriel ?? '']),
  presidents: r.presidents.map(p => [p.mandat, p.nom]),
})

export type HistoriqueRow = {
  timeline: { date: string; dateEn: string; texte: string; texteEn: string }[]
  international: { titre: string; titreEn: string; participations: { annee: number; athletes: string; lieu: string; resultat?: string | null }[] }[]
  ancienDojo: string[]; inauguration: string[]
}
export const toHistorique = (r: HistoriqueRow): Historique => ({
  timeline: r.timeline.map(t => [t.date, t.dateEn, t.texte, t.texteEn]),
  international: r.international.map(i => [i.titre, i.titreEn, i.participations.map(p =>
    (p.resultat ? [p.annee, p.athletes, p.lieu, p.resultat] : [p.annee, p.athletes, p.lieu]) as Participation)]),
  ancienDojo: r.ancienDojo,
  inauguration: r.inauguration,
})

export type TelechargementsRow = { groupes: { titre: string; titreEn: string; docs: { titre: string; href: string }[] }[] }
export const toTelechargements = (r: TelechargementsRow): Telechargement[] =>
  clean(r).groupes.map(g => ({ titre: [g.titre, g.titreEn], docs: g.docs }))

export type PhotosSiteRow = Record<string, { src: string; w: number; h: number; hotspot?: Hotspot; alt: string; altEn: string }>
export const toPhotosSite = (r: PhotosSiteRow) =>
  Object.fromEntries(PHOTO_KEYS.map(k => [k, photo(clean(r[k]))])) as PhotosSite
