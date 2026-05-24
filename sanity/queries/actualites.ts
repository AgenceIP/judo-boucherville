import { client } from '../client'

export type Actualite = {
  _id: string
  titre: string
  titreEn: string
  slug: { current: string }
  date: string
  image: { asset: { _ref: string } }
  extrait: string
  extraitEn: string
  contenu: unknown[]
  contenuEn: unknown[]
}

export async function getLatestActualites(count: number = 3): Promise<Actualite[]> {
  return client.fetch(
    `*[_type == "actualite"] | order(date desc)[0..$count] {
      _id, titre, titreEn, slug, date, image, extrait, extraitEn
    }`,
    { count: count - 1 }
  )
}

export async function getAllActualites(): Promise<Actualite[]> {
  return client.fetch(
    `*[_type == "actualite"] | order(date desc) {
      _id, titre, titreEn, slug, date, image, extrait, extraitEn
    }`
  )
}
