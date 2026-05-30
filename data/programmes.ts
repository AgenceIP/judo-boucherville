export type Programme = {
  id: string
  titre: string
  titreEn?: string
  slug: string
  categorie: 'enfants' | 'adultes' | 'arts-martiaux'
  description: string
  descriptionEn?: string
  horaires: { jours: string; heures: string; lieu?: string }[]
  tarif?: string
  instructeurs: { nom: string; grade: string; slug: string }[]
  icon: string
}

export const programmes: Programme[] = [
  {
    id: '1',
    titre: 'Judo compétition',
    titreEn: 'Competition Judo',
    slug: 'judo-competition',
    categorie: 'adultes',
    icon: '🏆',
    description: "Pour les athlètes visant l'excellence aux niveaux provincial, national et international. Un programme exigeant axé sur la performance et le développement technique avancé.",
    descriptionEn: 'For athletes aiming for excellence at provincial, national and international levels. A demanding program focused on performance and advanced technical development.',
    horaires: [{ jours: 'Lun–Ven', heures: '18h00–19h00', lieu: 'Dojo principal' }],
    instructeurs: [
      { nom: 'Fayçal Bousbiat', grade: '7e dan', slug: 'faycal-bousbiat' },
      { nom: 'Daniel De Angelis', grade: '7e dan', slug: 'daniel-de-angelis' },
    ],
  },
  {
    id: '2',
    titre: 'Judo enfants',
    titreEn: "Children's Judo",
    slug: 'judo-enfants',
    categorie: 'enfants',
    icon: '👶',
    description: 'Initiation aux principes du judo, développement moteur et socialisation pour les jeunes. Un environnement sécuritaire et amusant pour découvrir le judo.',
    descriptionEn: 'Introduction to judo principles, motor development and socialization for youth. A safe and fun environment to discover judo.',
    horaires: [{ jours: 'Sam', heures: '10h15–12h30', lieu: 'Dojo principal' }],
    instructeurs: [{ nom: 'Donald Ferland', grade: '6e dan', slug: 'donald-ferland' }],
  },
  {
    id: '3',
    titre: 'Judo adultes',
    titreEn: 'Adult Judo',
    slug: 'judo-adultes',
    categorie: 'adultes',
    icon: '💪',
    description: "Acquérir des techniques efficaces, compétitionner ou simplement être en forme. Un programme adapté à tous les niveaux d'expérience.",
    descriptionEn: 'Develop effective techniques, compete, or simply get fit. A program adapted to all experience levels.',
    horaires: [{ jours: 'Lun/Mer', heures: '19h00–21h00', lieu: 'Dojo principal' }],
    instructeurs: [{ nom: 'Fayçal Bousbiat', grade: '7e dan', slug: 'faycal-bousbiat' }],
  },
  {
    id: '4',
    titre: 'Parents/Enfants',
    titreEn: 'Parents/Children',
    slug: 'parents-enfants',
    categorie: 'enfants',
    icon: '👨‍👧',
    description: "Un cours unique en son genre pour partager le judo en famille. Découvrez les bases du judo ensemble dans un esprit de partage et de plaisir.",
    descriptionEn: 'A unique class to share judo as a family. Discover the basics of judo together in a spirit of sharing and fun.',
    horaires: [{ jours: 'Sam', heures: '9h00–10h00', lieu: 'Dojo principal' }],
    instructeurs: [],
  },
  {
    id: '5',
    titre: 'Aiki Ju-Jitsu',
    titreEn: 'Aiki Ju-Jitsu',
    slug: 'aiki-jujitsu',
    categorie: 'arts-martiaux',
    icon: '⚡',
    description: 'Art martial complet et efficace : projections, contrôles articulaires, percussions. Une discipline qui développe la conscience corporelle et la maîtrise de soi.',
    descriptionEn: 'A complete and effective martial art: throws, joint locks, strikes. A discipline that develops body awareness and self-mastery.',
    horaires: [{ jours: 'Mar/Jeu', heures: '20h00–21h30', lieu: 'Dojo principal' }],
    instructeurs: [{ nom: 'Sylvain Yargeau', grade: '4e dan', slug: 'sylvain-yargeau' }],
  },
  {
    id: '6',
    titre: 'Jiu-Jitsu Brésilien',
    titreEn: 'Brazilian Jiu-Jitsu',
    slug: 'jiu-jitsu-bresilien',
    categorie: 'arts-martiaux',
    icon: '🌀',
    description: 'Maîtriser les principes du BJJ debout et au sol. Pour 15 ans et +. Un art martial axé sur le combat au sol et les soumissions.',
    descriptionEn: 'Master BJJ principles standing and on the ground. For ages 15+. A martial art focused on ground fighting and submissions.',
    horaires: [{ jours: 'Mar/Jeu', heures: '19h45–21h00', lieu: 'Dojo principal' }],
    instructeurs: [],
  },
  {
    id: '7',
    titre: 'Sport-études',
    titreEn: 'Sport-Studies',
    slug: 'sport-etudes',
    categorie: 'adultes',
    icon: '📚',
    description: "Programme élite en partenariat avec l'École secondaire De Mortagne. Concilier études et entraînement de haut niveau.",
    descriptionEn: 'Elite program in partnership with École secondaire De Mortagne. Combining studies and high-level training.',
    horaires: [{ jours: 'Selon école', heures: 'Variable', lieu: 'École De Mortagne / Dojo' }],
    instructeurs: [],
  },
  {
    id: '8',
    titre: 'Judo aînés',
    titreEn: 'Seniors Judo',
    slug: 'judo-aines',
    categorie: 'adultes',
    icon: '🧘',
    description: 'Pratiquer le judo à tout âge dans un environnement adapté et bienveillant. Un programme conçu pour maintenir la forme et le lien social.',
    descriptionEn: 'Practice judo at any age in an adapted and caring environment. A program designed to maintain fitness and social connection.',
    horaires: [{ jours: 'À confirmer', heures: 'À confirmer', lieu: 'Dojo principal' }],
    instructeurs: [],
  },
  {
    id: '9',
    titre: 'Camp de jour',
    titreEn: 'Day Camp',
    slug: 'camp-de-jour',
    categorie: 'enfants',
    icon: '☀️',
    description: 'Découvrez le judo, ses techniques et sa discipline cet été! Un camp amusant et enrichissant pour les jeunes judokas.',
    descriptionEn: 'Discover judo, its techniques and discipline this summer! A fun and enriching camp for young judokas.',
    horaires: [{ jours: 'Été', heures: 'Variable', lieu: 'Dojo principal' }],
    instructeurs: [],
  },
  {
    id: '10',
    titre: 'Parascolaire',
    titreEn: 'After-School Judo',
    slug: 'parascolaire',
    categorie: 'enfants',
    icon: '🏫',
    description: "Programme parascolaire en partenariat avec les écoles de Boucherville, à la 38e saison depuis 1988. Initiation au judo directement à l'école pour les élèves du primaire.",
    descriptionEn: 'After-school judo program in partnership with Boucherville schools, in its 38th season since 1988. Judo introduction directly at school for elementary students.',
    horaires: [{ jours: 'Variable selon école', heures: 'Après les cours', lieu: 'Écoles partenaires de Boucherville' }],
    instructeurs: [],
  },
  {
    id: '11',
    titre: 'Auto-défense pour femmes',
    titreEn: 'Self-Defence for Women',
    slug: 'autodefense-femmes',
    categorie: 'adultes',
    icon: '🛡️',
    description: "Cours d'auto-défense spécialement conçu pour les femmes. Techniques pratiques basées sur le judo et les arts martiaux pour développer confiance et autonomie.",
    descriptionEn: 'Self-defence course specially designed for women. Practical techniques based on judo and martial arts to build confidence and independence.',
    horaires: [{ jours: 'À confirmer', heures: 'À confirmer', lieu: 'Dojo principal' }],
    instructeurs: [],
  },
]

export function getAllProgrammes(): Programme[] {
  return programmes
}

export function getProgrammeBySlug(slug: string): Programme | null {
  return programmes.find(p => p.slug === slug) ?? null
}
