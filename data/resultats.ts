export type Resultat = {
  id: string
  saison: string
  competition: string
  date: string
  athlete: string
  categorie: string
  medaille: 'or' | 'argent' | 'bronze'
}

export const resultats: Resultat[] = []

export function getAllResultats(): Resultat[] {
  return resultats
}

export function getSaisons(): string[] {
  return [...new Set(resultats.map(r => r.saison))].sort().reverse()
}
