import { client } from '../client'

export type Programme = {
  _id: string
  titre: string
  titreEn: string
  slug: { current: string }
  categorie: 'enfants' | 'adultes' | 'arts-martiaux'
  description: unknown[]
  descriptionEn: unknown[]
  horaires: { jours: string; heures: string; lieu: string }[]
  tarif: string
  instructeurs: { nom: string; grade: string; slug: { current: string } }[]
  image: { asset: { _ref: string } }
  ordre: number
}

export async function getAllProgrammes(): Promise<Programme[]> {
  return client.fetch(
    `*[_type == "programme"] | order(ordre asc) {
      _id, titre, titreEn, slug, categorie, description, descriptionEn,
      horaires, tarif, ordre, image,
      instructeurs[]->{ nom, grade, slug }
    }`
  )
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  return client.fetch(
    `*[_type == "programme" && slug.current == $slug][0] {
      _id, titre, titreEn, slug, categorie, description, descriptionEn,
      horaires, tarif, image,
      instructeurs[]->{ nom, grade, slug, photo, bio }
    }`,
    { slug }
  )
}
