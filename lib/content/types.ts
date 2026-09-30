export type Photo = { src: string; w: number; h: number; pos?: string }

export type Club = {
  nom: string; site: string; dojo: string; lieu: string; adresse: string; tel: string; courriel: string
  responsable: string; president: string; instagram: string; facebook: string; twitter: string; tiktok: string
  youtube: string; calendrierJudoQuebec?: string
}
export type Inscription = {
  saison: string; formulaire: string; qr?: string
  debutCours: [string, string, string, string][]
  enLigne: string; enLigneEn: string; surPlace: string; surPlaceEn: string; paiement: string; paiementEn: string
  notes: string[]; notesEn: string[]; colonnesTarif: string[]; colonnesTarifEn: string[]
}
export type Palmares = [string, string, number, number, number]

export type Categorie = 'enfants' | 'adultes' | 'arts-martiaux'
export type Programme = {
  slug: string; titre: string; titreEn: string; categorie: Categorie; resume: string; resumeEn: string
  horaire: string; description: string; descriptionEn?: string; prealable?: string; cours?: string; debut?: string
  inscription?: string
  groupes: { clientele: string; code: string; horaire: string }[]
  colonnes: string[]
  tarifs: { periode: string; prix: string[] }[]
  notes?: string[]
  instructeurs: { nom: string; grade?: string; slug?: string | null }[]
  formulaire?: string; qr?: string
  documents?: { titre: string; href: string }[]
  contacts?: { nom: string; role?: string; tel?: string; courriel?: string }[]
}

export type Instructeur = {
  id: string; nom: string; slug: string; photo?: Photo; grade: string; pnce?: string; disciplines: string[]
  role: string; bio?: string; bioEn?: string; competitions: string[]
}

export type Evenement = { jour: string; titre: string; lieu?: string; lien?: string }
export type Mois = { mois: string; moisEn: string; evenements: Evenement[] }

export type Challenge = {
  edition: number; date: string; depuis: number; pays: string[]; paysEn: string[]
  formulaire?: string; programme?: string; devis?: string; video?: string; president: string
  couts: [string, string][]; bourses: [string, string, string][]; limites: [string, string, string, string][]
}
export type Division = [string, string, string, string, string, string, string, string]
export type Ligne = [string, string, string, string, string]
export type Edition = { annee: number; coupe: [string, number?][]; divisions?: Ligne[] }
export type ChallengeData = { challenge: Challenge; divisions: Division[]; commanditaires: [string, string][]; palmaresChallenge: Edition[] }

export type Personne = {
  nom: string; naissance?: string; debut?: string; grade?: string; etudes?: string; judoinside?: string
  faits?: string[]; objCourt?: string[]; objLong?: string[]
  saisons?: { saison: string; victoires?: number; defaites?: number; resultats: string[] }[]
}
export type Athlete = { slug: string; nom: string; photos: Photo[]; personnes: Personne[] }
export type Membre = { nom: string; slug: string | null }
export type Equipes = Record<string, Membre[]>

export type Span = { _type: 'span'; _key: string; text: string; marks?: string[] }
export type MedailleInline = { _type: 'medaille'; _key: string; kind: 'or' | 'argent' | 'bronze' }
export type Bloc =
  | { _type: 'block'; _key: string; style?: 'normal' | 'h4'; children: (Span | MedailleInline)[]; markDefs?: { _key: string; _type: 'link'; href: string }[] }
  | { _type: 'image'; _key: string; src: string; w: number; h: number; petit?: boolean }
  | { _type: 'bilanMedailles'; _key: string; or?: number; argent?: number; bronze?: number }
export type Entree = { date?: string; lieu?: string; titre?: string; contenu: Bloc[] }
export type Saison = { saison: string; entrees: Entree[] }

export type Journal = { titre: string; thumb?: string; pdf: string }
export type Periode = { periode: string; numeros: Journal[] }

export type Conseil = { membres: [string, string, string, string][]; presidents: [string, string][] }
export type Participation = [number, string, string, string?]
export type Historique = {
  timeline: [string, string, string, string][]
  international: [string, string, Participation[]][]
  ancienDojo: string[]; inauguration: string[]
}
export type Telechargement = { titre: [string, string]; docs: { titre: string; href: string }[] }

export const PHOTO_KEYS = ['murCjb', 'murCjbLoin', 'tatamiLong', 'valeursRespect', 'kano', 'ceinturesNoires', 'hautsGrades', 'entree'] as const
export type PhotoKey = (typeof PHOTO_KEYS)[number]
export type PhotosSite = Record<PhotoKey, Photo & { alt: string; altEn: string }>
