import { client } from '../client'

export type Instructeur = {
  _id: string
  nom: string
  slug: { current: string }
  photo: { asset: { _ref: string } }
  grade: string
  disciplines: string[]
  role: string
  bio: unknown[]
  bioEn: unknown[]
  competitions: string[]
  ordre: number
}

export async function getAllInstructeurs(): Promise<Instructeur[]> {
  return client.fetch(
    `*[_type == "instructeur"] | order(ordre asc) {
      _id, nom, slug, photo, grade, disciplines, role, bio, bioEn, competitions, ordre
    }`
  )
}

export async function getInstructeurBySlug(slug: string): Promise<Instructeur | null> {
  return client.fetch(
    `*[_type == "instructeur" && slug.current == $slug][0] {
      _id, nom, slug, photo, grade, disciplines, role, bio, bioEn, competitions
    }`,
    { slug }
  )
}
