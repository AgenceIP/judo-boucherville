export type Actualite = {
  id: string
  titre: string
  titreEn?: string
  slug: string
  date: string
  imageSrc?: string
  extrait?: string
  extraitEn?: string
  contenu?: string
  contenuEn?: string
}

export const actualites: Actualite[] = []

export function getLatestActualites(count = 3): Actualite[] {
  return actualites.slice(0, count)
}

export function getAllActualites(): Actualite[] {
  return actualites
}

export function getActualiteBySlug(slug: string): Actualite | null {
  return actualites.find(a => a.slug === slug) ?? null
}
