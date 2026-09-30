import { sanityFetch } from '@/lib/sanity/client'
import * as Q from './queries'
import {
  buildCalendrier, buildEquipes, clean, groupSaisons, toAthlete, toChallenge, toClub, toConseil, toHistorique,
  toInstructeur, toPhotosSite, toTelechargements,
  type ArticleRow, type AthleteRow, type ChallengeRow, type ClubRow, type ConseilRow, type EquipeRow, type EvenementRow,
  type HistoriqueRow, type InstructeurRow, type PhotosSiteRow, type TelechargementsRow,
} from './transform'
import type { Periode, Programme } from './types'

export * from './types'
export { medailles } from './transform'

/** Singletons are required: a missing one fails the build, and Vercel keeps the previous deployment online. */
async function unique<T>(query: string, nom: string) {
  const r = await sanityFetch<T | null>(query)
  if (!r) throw new Error(`Sanity : la fiche « ${nom} » est introuvable`)
  return r
}

export const getClub = async () => toClub(await unique<ClubRow>(Q.CLUB, 'Club'))
export const getProgrammes = async () => clean(await sanityFetch<Programme[]>(Q.PROGRAMMES))
export const getProgramme = async (slug: string) => clean(await sanityFetch<Programme | null>(Q.PROGRAMME, { slug }))
export const getInstructeurs = async () => (await sanityFetch<InstructeurRow[]>(Q.INSTRUCTEURS)).map(toInstructeur)
export const getInstructeur = async (slug: string) => {
  const r = await sanityFetch<InstructeurRow | null>(Q.INSTRUCTEUR, { slug })
  return r && toInstructeur(r)
}
export const getCalendrier = async () => buildCalendrier(clean(await sanityFetch<EvenementRow[]>(Q.EVENEMENTS)))
export const getCeintures = async () => {
  const ceintures = await sanityFetch<{ annee: number; noms: string[] }[]>(Q.CEINTURES)
  return { ceintures, total: ceintures.reduce((n, y) => n + y.noms.length, 0) }
}
export const getChallenge = async () => toChallenge(await unique<ChallengeRow>(Q.CHALLENGE, 'Challenge'))
export const getEquipes = async () => buildEquipes(await sanityFetch<EquipeRow[]>(Q.EQUIPES))
export const getAthleteSlugs = () => sanityFetch<string[]>(Q.ATHLETE_SLUGS)
export const getAthlete = async (slug: string) => {
  const r = await sanityFetch<AthleteRow | null>(Q.ATHLETE, { slug })
  return r && toAthlete(r)
}
export type Archive = 'actualite' | 'resultat'
export const getSaisons = async (type: Archive) => (await sanityFetch<string[]>(Q.SAISONS, { type })).sort().reverse()
export const getSaison = async (type: Archive, saison: string) =>
  groupSaisons(await sanityFetch<ArticleRow[]>(Q.SAISON, { type, saison }))[0] ?? null
export const getJournaux = async () => clean(await sanityFetch<Periode[]>(Q.JOURNAUX))
export const getConseil = async () => toConseil(await unique<ConseilRow>(Q.CONSEIL, 'Conseil'))
export const getHistorique = async () => toHistorique(await unique<HistoriqueRow>(Q.HISTORIQUE, 'Historique'))
export const getTelechargements = async () => toTelechargements(await unique<TelechargementsRow>(Q.TELECHARGEMENTS, 'Téléchargements'))
export const getPhotosSite = async () => toPhotosSite(await unique<PhotosSiteRow>(Q.PHOTOS_SITE, 'Photos du site'))
