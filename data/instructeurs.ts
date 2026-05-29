export type Instructeur = {
  id: string
  nom: string
  slug: string
  photoSrc?: string
  grade: string
  disciplines: string[]
  role: string
  bio?: string
  bioEn?: string
  competitions: string[]
}

export const instructeurs: Instructeur[] = [
  {
    id: '1',
    nom: 'Fayçal Bousbiat',
    slug: 'faycal-bousbiat',
    grade: '7e dan',
    disciplines: ['judo', 'kata'],
    role: 'Directeur technique',
    bio: 'Directeur technique du Club de Judo Boucherville, Fayçal Bousbiat est une figure incontournable du judo québécois. Sa passion et son expertise font de lui un mentor exceptionnel pour les judokas de tous niveaux.',
    bioEn: 'Technical director of Club de Judo Boucherville, Fayçal Bousbiat is a key figure in Quebec judo. His passion and expertise make him an exceptional mentor for judokas of all levels.',
    competitions: [],
  },
  {
    id: '2',
    nom: 'Daniel De Angelis',
    slug: 'daniel-de-angelis',
    grade: '7e dan',
    disciplines: ['judo', 'kata'],
    role: 'Professeur',
    bio: 'Professeur dévoué au Club de Judo Boucherville, Daniel De Angelis transmet sa connaissance approfondie du judo et du kata avec passion.',
    bioEn: 'A dedicated instructor at Club de Judo Boucherville, Daniel De Angelis shares his deep knowledge of judo and kata with passion.',
    competitions: [],
  },
  {
    id: '3',
    nom: 'Donald Ferland',
    slug: 'donald-ferland',
    grade: '6e dan',
    disciplines: ['judo', 'kata'],
    role: 'Professeur',
    bio: "Donald Ferland est professeur de judo au Club de Judo Boucherville. Avec son expérience et sa pédagogie, il guide les athlètes vers l'excellence.",
    bioEn: 'Donald Ferland is a judo instructor at Club de Judo Boucherville. With his experience and teaching skills, he guides athletes toward excellence.',
    competitions: [],
  },
  {
    id: '4',
    nom: 'Sylvain Yargeau',
    slug: 'sylvain-yargeau',
    grade: '4e dan',
    disciplines: ['aiki-jujitsu'],
    role: 'Professeur Aiki Ju-Jitsu',
    bio: "Sylvain Yargeau enseigne l'Aiki Ju-Jitsu au Club de Judo Boucherville. Cet art martial complet combine projections, contrôles articulaires et techniques de percussions.",
    bioEn: 'Sylvain Yargeau teaches Aiki Ju-Jitsu at Club de Judo Boucherville. This comprehensive martial art combines throws, joint locks, and striking techniques.',
    competitions: [],
  },
]

export function getAllInstructeurs(): Instructeur[] {
  return instructeurs
}

export function getInstructeurBySlug(slug: string): Instructeur | null {
  return instructeurs.find(i => i.slug === slug) ?? null
}
