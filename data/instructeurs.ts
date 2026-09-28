// Source : judoboucherville.com (Professeurs, Inscription, archives des actualités et résultats)

export type Instructeur = {
  id: string
  nom: string
  slug: string
  photoSrc?: string
  grade: string
  pnce?: string
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
    pnce: 'PNCE niveau 3',
    disciplines: ['judo'],
    role: 'Entraîneur chef et directeur technique',
    bio: 'Entraîneur chef et directeur technique du Club de Judo Boucherville, Fayçal Bousbiat dirige l’équipe de compétition et le programme Sport-Études de l’École secondaire De Mortagne.\n\nIl encadre les athlètes du club sur les scènes provinciale, nationale et internationale, et a lancé au club la célébration de la Journée mondiale du judo.',
    bioEn: 'Head coach and technical director of Club de Judo Boucherville, Fayçal Bousbiat leads the competition team and the Sport-Études programme at École secondaire De Mortagne.\n\nHe coaches the club’s athletes on the provincial, national and international stage, and started the club’s World Judo Day celebration.',
    competitions: [
      'Entraîneur de l’équipe de compétition (U16 à senior)',
      'Entraîneur Sport-Études, École secondaire De Mortagne',
    ],
  },
  {
    id: '2',
    nom: 'Daniel De Angelis',
    slug: 'daniel-de-angelis',
    grade: '7e dan',
    pnce: 'PNCE niveau 3',
    disciplines: ['judo', 'kata'],
    role: 'Professeur',
    bio: 'Ancien président de Judo Québec, Daniel De Angelis enseigne aux adultes du club. Il a obtenu son 6e dan à l’unanimité des juges en 2009 et est aujourd’hui 7e dan.\n\nAvec Donald Ferland, il forme l’une des équipes de kata les plus titrées du pays : nommée Équipe de kata par excellence au Gala de Judo Québec 2010, elle a remporté les trois épreuves de kata au championnat canadien 2011.',
    bioEn: 'A former president of Judo Québec, Daniel De Angelis teaches the club’s adult classes. He was promoted to 6th dan unanimously in 2009 and now holds the 7th dan.\n\nWith Donald Ferland he forms one of Canada’s most decorated kata teams — Judo Québec Kata Team of the Year 2010, and winners of all three kata events at the 2011 Canadian championships.',
    competitions: [
      'Ancien président de Judo Québec',
      'Championnats canadiens 2009 : or Goshin-jutsu et Nage-no-kata, argent Katame-no-kata',
      'Équipe de kata par excellence, Gala Judo Québec 2010',
      'Championnats canadiens 2011 : 3 médailles d’or en kata',
      'Championnats canadiens 2012 : 1 or, 2 argent en kata',
    ],
  },
  {
    id: '3',
    nom: 'Donald Ferland',
    slug: 'donald-ferland',
    grade: '6e dan',
    pnce: 'PNCE niveau 1',
    disciplines: ['judo', 'kata'],
    role: 'Professeur',
    bio: 'Arbitre de judo depuis les années 1970, Donald Ferland a réalisé son rêve olympique à Londres en 2012, où il était l’un des 24 officiels de la compétition.\n\nFinaliste dans la catégorie Officiel au Gala Sports Québec, il forme avec Daniel De Angelis l’équipe de kata multiple championne canadienne du club.',
    bioEn: 'A judo referee since the 1970s, Donald Ferland fulfilled his Olympic dream in London 2012 as one of the competition’s 24 officials.\n\nA Sports Québec Gala finalist in the Official category, he partners Daniel De Angelis in the club’s multiple Canadian champion kata team.',
    competitions: [
      'Officiel aux Jeux olympiques de Londres 2012',
      'Finaliste Officiel de l’année, 39e Gala Sports Québec',
      'Champion canadien de kata avec Daniel De Angelis',
    ],
  },
  {
    id: '4',
    nom: 'Jacques Coté',
    slug: 'jacques-cote',
    grade: '6e dan',
    pnce: 'PNCE niveau 1',
    disciplines: ['judo'],
    role: 'Professeur',
    bio: 'Jacques Coté est professeur au Club de Judo Boucherville. Compétiteur master accompli, il a été sacré champion canadien chez les masters (-100 kg).',
    bioEn: 'Jacques Coté teaches at Club de Judo Boucherville. An accomplished masters competitor, he won the Canadian masters title (-100 kg).',
    competitions: ['Champion canadien master -100 kg (2010)'],
  },
  {
    id: '5',
    nom: 'Éric De Rome',
    slug: 'eric-de-rome',
    grade: '5e dan',
    pnce: 'PNCE niveau 1',
    disciplines: ['judo', 'kata'],
    role: 'Entraîneur',
    bio: 'Éric De Rome enseigne aux adultes du club. Champion canadien master (-81 kg), il forme aujourd’hui avec Ludovic Durrieu une équipe de kata médaillée aux championnats canadiens.',
    bioEn: 'Éric De Rome teaches the club’s adult classes. A Canadian masters champion (-81 kg), he now competes in kata with Ludovic Durrieu, medalling at the Canadian championships.',
    competitions: [
      'Champion canadien master -81 kg (2010)',
      'Championnats canadiens 2025 : bronze Katame-no-kata et Kime-no-kata, avec Ludovic Durrieu',
    ],
  },
  {
    id: '6',
    nom: 'Ludovic Durrieu',
    slug: 'ludovic-durrieu',
    grade: '3e dan',
    disciplines: ['judo', 'kata'],
    role: 'Professeur',
    bio: 'Ludovic Durrieu enseigne aux adultes du club et forme avec Éric De Rome une équipe de kata médaillée aux championnats canadiens.',
    bioEn: 'Ludovic Durrieu teaches the club’s adult classes and competes in kata with Éric De Rome, medalling at the Canadian championships.',
    competitions: ['Championnats canadiens 2025 : bronze Katame-no-kata et Kime-no-kata, avec Éric De Rome'],
  },
  {
    id: '7',
    nom: 'Adriana Portuondo-Isasi',
    slug: 'adriana-portuondo-isasi',
    grade: '2e dan',
    pnce: 'PNCE niveau 3',
    disciplines: ['judo'],
    role: 'Professeure',
    bio: 'Formée au club, Adriana Portuondo-Isasi a été membre des équipes du Québec et du Canada. Médaillée d’or aux Jeux du Canada 2015, où elle a été porte-drapeau de l’équipe du Québec à la cérémonie de clôture, elle a aussi été championne canadienne et vice-championne panaméricaine junior.\n\nCeinture noire 2e dan, certifiée en auto-défense, elle enseigne aujourd’hui aux jeunes compétiteurs, au parascolaire, au camp de jour et en auto-défense pour femmes.',
    bioEn: 'Trained at the club, Adriana Portuondo-Isasi was a member of the Quebec and Canadian teams. Gold medallist at the 2015 Canada Games — where she carried Team Québec’s flag at the closing ceremony — she was also Canadian champion and Pan-American junior silver medallist.\n\nA 2nd-dan black belt certified in self-defence, she now teaches young competitors, the after-school programme, the day camp and women’s self-defence.',
    competitions: [
      'Or aux Jeux du Canada 2015, porte-drapeau du Québec',
      'Championne canadienne Élite -78 kg (2015)',
      'Argent au championnat panaméricain junior 2016 (-70 kg)',
      'Championnats du monde juniors 2017',
      'Ancienne membre des équipes provinciale et nationale',
    ],
  },
  {
    id: '8',
    nom: 'Jérémie Blain',
    slug: 'jeremie-blain',
    grade: '1er dan',
    pnce: 'PNCE niveau 1',
    disciplines: ['judo', 'jiu-jitsu-bresilien'],
    role: 'Professeur',
    bio: 'Ceinture noire de judo et de jiu-jitsu brésilien — 105e ceinture noire du club —, Jérémie Blain possède un parcours compétitif riche sur les scènes nationale et internationale : deux titres de champion national, des podiums en grappling UWW, un titre de vice-champion du monde IBJJF (Master) et un championnat provincial en lutte libre.\n\nCoach de grappling depuis plus de 5 ans, il se distingue par une approche technique rigoureuse et une excellente capacité d’adaptation aux différents profils d’athlètes. Sa double expertise en judo et en BJJ lui permet d’offrir un encadrement structuré, précis et accessible, autant pour les pratiquants récréatifs que pour ceux qui souhaitent se perfectionner ou compétitionner.',
    bioEn: 'A black belt in both judo and Brazilian Jiu-Jitsu — the club’s 105th black belt — Jérémie Blain has a rich competitive record: two national titles, UWW grappling podiums, an IBJJF Masters world silver and a provincial freestyle wrestling title.\n\nA grappling coach for more than five years, he is known for a rigorous technical approach and for adapting to every kind of athlete, from recreational to competitive.',
    competitions: [
      'Deux titres de champion national',
      'Vice-champion du monde IBJJF (Master)',
      'Podiums en grappling UWW',
      'Champion provincial de lutte libre',
    ],
  },
  {
    id: '9',
    nom: 'Maika Nephtali',
    slug: 'maika-nephtali',
    grade: '1er dan',
    disciplines: ['judo'],
    role: 'Professeur',
    bio: 'Ceinture noire formée au club, Maika Nephtali enseigne au groupe enfants avancé. Médaille de bronze aux championnats canadiens U16 (-57 kg) en 2025.',
    bioEn: 'A black belt trained at the club, Maika Nephtali teaches the advanced kids group. Bronze medallist at the 2025 Canadian U16 championships (-57 kg).',
    competitions: ['Bronze, championnats canadiens U16 -57 kg (2025)'],
  },
  {
    id: '10',
    nom: 'Patric Charade',
    slug: 'patric-charade',
    grade: '4e dan Aiki Ju-Jitsu',
    disciplines: ['aiki-jujitsu'],
    role: 'Renshi, professeur d’Aiki Ju-Jitsu',
    bio: 'Renshi Patric Charade, ceinture noire 4e dan d’Aiki Ju-Jitsu, enseigne un art de défenses complètes et efficaces, une école de vie.',
    bioEn: 'Renshi Patric Charade, 4th-dan black belt in Aiki Ju-Jitsu, teaches a complete and effective art of self-defence — a school of life.',
    competitions: [],
  },
  {
    id: '11',
    nom: 'Yves Plourde',
    slug: 'yves-plourde',
    grade: '1er dan',
    disciplines: ['judo'],
    role: 'Professeur — prévention des chutes',
    bio: 'Ceinture noire du club depuis 2000, Yves Plourde enseigne le Programme de prévention et de contrôle des chutes par le judo.',
    bioEn: 'A club black belt since 2000, Yves Plourde teaches the fall prevention and control programme.',
    competitions: [],
  },
  {
    id: '12',
    nom: 'Luc Bourque',
    slug: 'luc-bourque',
    grade: '1er dan',
    disciplines: ['judo'],
    role: 'Professeur — prévention des chutes',
    bio: 'Luc Bourque a obtenu sa ceinture noire à 80 ans, en 2024. Il enseigne aujourd’hui le Programme de prévention et de contrôle des chutes par le judo.',
    bioEn: 'Luc Bourque earned his black belt at 80, in 2024. He now teaches the fall prevention and control programme.',
    competitions: ['Ceinture noire à 80 ans (2024)'],
  },
]

export function getAllInstructeurs(): Instructeur[] {
  return instructeurs
}

export function getInstructeurBySlug(slug: string): Instructeur | null {
  return instructeurs.find(i => i.slug === slug) ?? null
}
