import { client } from '../client'

export type Tournoi = {
  _id: string
  edition: string
  date: string
  lieu: string
  categories: string[]
  prix: { categorie: string; montant: string }[]
  description: unknown[] | null
  descriptionEn: unknown[] | null
  inscriptionUrl: string | null
}

export async function getNextTournoi(): Promise<Tournoi | null> {
  return client.fetch(
    `*[_type == "tournoi" && date > now()] | order(date asc)[0] {
      _id, edition, date, lieu, categories, prix, description, descriptionEn, inscriptionUrl
    }`
  )
}
