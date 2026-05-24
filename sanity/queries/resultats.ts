import { client } from '../client'

export type Resultat = {
  _id: string
  saison: string
  competition: string
  date: string
  athlete: string
  categorie: string
  medaille: 'or' | 'argent' | 'bronze'
}

export async function getAllResultats(): Promise<Resultat[]> {
  return client.fetch(
    `*[_type == "resultat"] | order(date desc) {
      _id, saison, competition, date, athlete, categorie, medaille
    }`
  )
}

export async function getSaisons(): Promise<string[]> {
  const results = await client.fetch<{ saison: string }[]>(
    `*[_type == "resultat"] { saison }`
  )
  return [...new Set(results.map(r => r.saison))].sort().reverse()
}
