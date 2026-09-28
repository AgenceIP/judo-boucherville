// Saison 2026-2027 — source : judoboucherville.com (Inscription, PPCC, Parascolaire, campete, SportEtude)

export type Categorie = 'enfants' | 'adultes' | 'arts-martiaux'

export type Programme = {
  slug: string
  titre: string
  titreEn: string
  categorie: Categorie
  /** One line for cards and lists */
  resume: string
  resumeEn: string
  /** Short schedule for cards */
  horaire: string
  /** Paragraphs separated by a blank line */
  description: string
  descriptionEn?: string
  prealable?: string
  cours?: string
  debut?: string
  inscription?: string
  groupes: { clientele: string; code: string; horaire: string }[]
  /** Price column headers; defaults to the preferential/regular pair */
  colonnes?: string[]
  tarifs: { periode: string; prix: string[] }[]
  notes?: string[]
  instructeurs: { nom: string; grade: string; slug?: string }[]
  formulaire?: string
  qr?: string
  documents?: { titre: string; href: string }[]
  contacts?: { nom: string; role?: string; tel?: string; courriel?: string }[]
}

export const COLONNES_TARIF = ['Avant le 19 août', 'Après le 19 août']

const OLD = 'https://judoboucherville.com/html/Download/'
const jeremie = { nom: 'Jérémie Blain', grade: '1er dan', slug: 'jeremie-blain' }
const adriana = { nom: 'Adriana Portuondo-Isasi', grade: '2e dan', slug: 'adriana-portuondo-isasi' }
const faycal = { nom: 'Fayçal Bousbiat', grade: '7e dan', slug: 'faycal-bousbiat' }
const carteSandalesJudogi = 'Carte d’Accès Boucherville, sandales et judogi (habit de judo), voir à l’inscription.'

export const programmes: Programme[] = [
  {
    slug: 'parents-enfants',
    titre: 'Parents / enfants',
    titreEn: 'Parents & children',
    categorie: 'enfants',
    resume: 'Jeux d’opposition partagés entre le parent et l’enfant (2019–2022).',
    resumeEn: 'Opposition games shared by parent and child (born 2019–2022).',
    horaire: 'Sam 09h00–10h00',
    description:
      'Activité unique en Amérique du Nord, donnant aux parents et aux enfants la chance de vivre, de communiquer et de partager une expérience extraordinaire dans l’apprentissage des jeux d’opposition, grâce à une activité sécuritaire, spécifiquement étudiée et adaptée au développement psychomoteur de l’enfant.\n\nDe plus, cette activité permet au parent d’aider son enfant dans sa socialisation avec ses pairs.',
    descriptionEn:
      'A one-of-a-kind activity in North America where parents and children live, communicate and share the learning of opposition games — safe, and designed specifically for the child’s psychomotor development.\n\nIt also lets parents help their child socialise with peers.',
    prealable: 'Carte d’Accès Boucherville, inscription avec un parent (gratuit pour le parent), sandales et judogi (habit de judo), voir à l’inscription.',
    cours: '1 cours par semaine',
    debut: 'Samedi 05 septembre 2026',
    groupes: [{ clientele: 'Parents / enfants nés en 2019, 2020, 2021, 2022', code: 'PES', horaire: 'Samedi 09h00 à 10h00' }],
    tarifs: [
      { periode: '05 sep. au 19 déc. (16 semaines)', prix: ['265 $', '280 $'] },
      { periode: '05 sep. au 29 mai (37 semaines)', prix: ['455 $', '470 $'] },
    ],
    instructeurs: [jeremie],
    formulaire: 'https://forms.gle/vMyBkBuCJj6H8XJc6',
    qr: '/images/qr/parents-enfants.png',
  },
  {
    slug: 'judo-enfants',
    titre: 'Judo enfants — débutant',
    titreEn: 'Kids judo — beginner',
    categorie: 'enfants',
    resume: 'Initiation au judo par les jeux d’opposition, vers la ceinture blanche / jaune.',
    resumeEn: 'Judo basics through opposition games, towards the white / yellow belt.',
    horaire: 'Sam 10h15–14h00',
    description:
      'Cours d’initiation aux principes de base du judo, acquisition et développement des gestes moteurs, socialisation, apprentissage par les jeux d’opposition, programme technique adapté au comportement et aux exigences de cette catégorie d’âge.\n\nPréparation à la ceinture blanche / jaune.',
    descriptionEn:
      'An introduction to the basic principles of judo: motor skills, socialisation and learning through opposition games, with a technical programme adapted to each age group.\n\nPrepares for the white / yellow belt.',
    prealable: carteSandalesJudogi,
    cours: '1 cours par semaine',
    debut: 'Samedi 05 septembre 2026',
    groupes: [
      { clientele: 'Nés en 2020-2021', code: 'U08DS', horaire: 'Samedi 10h15 à 11h15' },
      { clientele: 'Nés en 2018-2019', code: 'U10DS', horaire: 'Samedi 11h30 à 12h30' },
      { clientele: 'Nés en 2016-2017 / 2014-2015', code: 'U12DS / U14DS', horaire: 'Samedi 13h00 à 14h00' },
    ],
    tarifs: [
      { periode: '05 sep. au 19 déc. (16 semaines)', prix: ['260 $', '275 $'] },
      { periode: '05 sep. au 29 mai (37 semaines)', prix: ['440 $', '455 $'] },
    ],
    instructeurs: [jeremie],
    formulaire: 'https://forms.gle/Vq9unTNeEkC5x2u88',
    qr: '/images/qr/judo-enfants.jpg',
  },
  {
    slug: 'judo-enfants-avances',
    titre: 'Judo enfants — avancé',
    titreEn: 'Kids judo — advanced',
    categorie: 'enfants',
    resume: 'Passage de grade et initiation à la compétition, deux cours par semaine.',
    resumeEn: 'Belt grading and a first taste of competition, twice a week.',
    horaire: 'Lun/Ven 18h00–19h00',
    description:
      'Cours adapté aux capacités de chacun, étude et acquisition des principes du judo, préparation au passage de grade et initiation à la compétition.',
    descriptionEn:
      'Classes adapted to each child: studying the principles of judo, preparing for belt gradings and a first introduction to competition.',
    prealable: `Minimum une saison de pratique. ${carteSandalesJudogi}`,
    cours: '2 cours par semaine',
    debut: 'Vendredi 04 septembre 2026',
    groupes: [
      { clientele: 'Nés en 2018-2019', code: 'U10A', horaire: 'Lundi et vendredi 18h00 à 19h00' },
      { clientele: 'Nés en 2016-2017', code: 'U12A', horaire: 'Lundi et vendredi 18h00 à 19h00' },
      { clientele: 'Nés en 2014-2015', code: 'U14A', horaire: 'Lundi et vendredi 18h00 à 19h00' },
    ],
    tarifs: [{ periode: '04 sep. au 29 mai (37 semaines)', prix: ['530 $', '545 $'] }],
    instructeurs: [{ nom: 'Maika Nephtali', grade: '1er dan', slug: 'maika-nephtali' }],
    formulaire: 'https://forms.gle/rpAec4th2PaEjWKi9',
    qr: '/images/qr/judo-enfants-avances.jpg',
  },
  {
    slug: 'judo-enfants-competition',
    titre: 'Judo enfants — compétition',
    titreEn: 'Kids judo — competition',
    categorie: 'enfants',
    resume: 'Pour les jeunes qui compétitionnent aux niveaux régional et provincial.',
    resumeEn: 'For young judoka competing at regional and provincial level.',
    horaire: 'Mar/Jeu 18h00–19h30 · Sam',
    description:
      'Cours spécial pour ceux qui veulent faire du judo comme sport de compétition et participer à des compétitions régionales et provinciales. Pour participer à ce cours, il faut participer aux compétitions.\n\nClub reconnu par Judo Québec AAA.',
    descriptionEn:
      'A special class for children who want to practise judo as a competitive sport at regional and provincial events. Taking part in competitions is required.\n\nClub recognised AAA by Judo Québec.',
    prealable: `Ceinture jaune et plus, minimum 3 compétitions par année. ${carteSandalesJudogi}`,
    cours: '3 cours par semaine',
    debut: 'Jeudi 03 septembre 2026',
    groupes: [
      { clientele: 'Nés en 2018-2019', code: 'U10C', horaire: 'Mardi et jeudi 18h00 à 19h30, samedi 14h30 à 16h30' },
      { clientele: 'Nés en 2016-2017', code: 'U12C', horaire: 'Mardi et jeudi 18h00 à 19h30, samedi 14h30 à 16h30' },
      { clientele: 'Nés en 2014-2015', code: 'U14C', horaire: 'Mardi et jeudi 18h00 à 19h30, samedi 14h30 à 16h30' },
    ],
    tarifs: [{ periode: '03 sep. au 19 juin (40 semaines)', prix: ['595 $', '610 $'] }],
    instructeurs: [adriana],
    formulaire: 'https://forms.gle/RfCoVqRTMwXCNfzh6',
    qr: '/images/qr/judo-enfants-competition.jpg',
  },
  {
    slug: 'judo-competition',
    titre: 'Équipe de compétition',
    titreEn: 'Competition team',
    categorie: 'adultes',
    resume: 'Pour les athlètes qui visent l’excellence provinciale, nationale et internationale.',
    resumeEn: 'For athletes aiming for provincial, national and international excellence.',
    horaire: 'Lun/Mer/Ven + musculation',
    description: 'Aux athlètes qui visent l’excellence de niveau provincial, national et international.',
    descriptionEn: 'For athletes aiming for excellence at the provincial, national and international level.',
    prealable: 'Minimum deux saisons de pratique. Carte d’Accès Boucherville, sandales et judogi.',
    cours: 'De 3 à 5 cours par semaine',
    debut: 'Lundi 03 août 2026',
    groupes: [
      { clientele: 'Nés en 2012-2013', code: 'U16C', horaire: 'Judo : lundi et vendredi 19h00 à 20h30, mercredi 18h00 à 19h30' },
      { clientele: 'Nés en 2010-2011', code: 'U18C', horaire: 'Judo : lundi et vendredi 19h00 à 20h30, mercredi 18h00 à 19h30' },
      { clientele: 'Nés en 2007-2008-2009', code: 'U21C', horaire: 'Judo : lundi et vendredi 19h00 à 20h30, mercredi 18h00 à 19h30' },
      { clientele: 'Nés en 2006 et avant', code: 'SRC', horaire: 'Judo : lundi et vendredi 19h00 à 20h30, mercredi 18h00 à 19h30' },
    ],
    tarifs: [{ periode: '03 août au 18 juin (46 semaines), pratiques libres du 21 juin au 30 août', prix: ['595 $', '610 $'] }],
    notes: ['Musculation : mardi et jeudi 18h00 à 19h30.'],
    instructeurs: [faycal, adriana],
    formulaire: 'https://forms.gle/N8ujjYFQypVbghzFA',
    qr: '/images/qr/judo-competition.jpg',
  },
  {
    slug: 'judo-adultes',
    titre: 'Judo adultes',
    titreEn: 'Adult judo',
    categorie: 'adultes',
    resume: 'Débutants et avancés : forme physique, technique et confiance, dans une atmosphère conviviale.',
    resumeEn: 'Beginners and advanced: fitness, technique and confidence in a friendly atmosphere.',
    horaire: 'Lun 19h00 · Mer 19h30',
    description:
      'Pour les femmes et les hommes qui veulent acquérir une excellente forme physique par l’apprentissage d’un art martial.\n\nUne heure de judo permet de brûler 510 calories. Le cours vous permettra par la même occasion de vous intégrer à un groupe social et dynamique.\n\nPour le plaisir, la confiance en soi et la santé, voilà un sport complet pour tous! Que ce soit pour acquérir des techniques efficaces, pour devenir un compétiteur de haut niveau ou simplement être au meilleur de votre forme, il s’agit du bon choix!\n\nLe judo est une discipline olympique qui bénéficie de la structure d’une fédération internationale sérieuse et reconnue. Un code moral clairement défini permet au judoka d’évoluer dans le respect. Des professeurs certifiés assurent un apprentissage adapté selon votre groupe d’âge et votre condition, dans un environnement sécuritaire.\n\nPour fortifier votre corps et votre esprit, améliorer votre santé, développer au maximum vos aptitudes physiques et votre confiance, venez vous entraîner au Club de Judo Boucherville dans une atmosphère conviviale!',
    descriptionEn:
      'For women and men who want to get in excellent shape by learning a martial art.\n\nAn hour of judo burns about 510 calories, and the class is a great way to join a lively, social group.\n\nJudo is an Olympic discipline backed by a serious international federation. A clear moral code lets every judoka progress with respect, and certified instructors adapt the teaching to your age and condition in a safe environment.\n\nStrengthen body and mind, improve your health and build confidence — come train at Club de Judo Boucherville.',
    prealable: carteSandalesJudogi,
    cours: 'De 2 à 5 cours par semaine',
    debut: 'Mercredi 02 septembre 2026',
    groupes: [
      { clientele: 'Nés en 2007-2008-2009', code: 'U21', horaire: 'Judo : lundi 19h00 à 20h30, mercredi 19h30 à 21h00' },
      { clientele: 'Nés en 2006 et avant', code: 'S1', horaire: 'Judo : lundi 19h00 à 20h30, mercredi 19h30 à 21h00' },
    ],
    tarifs: [
      { periode: '02 sep. au 23 déc.', prix: ['325 $', '340 $'] },
      { periode: '02 sep. au 16 juin, pratiques libres du 21 juin au 30 août', prix: ['550 $', '565 $'] },
    ],
    notes: ['Musculation : mardi et jeudi 18h00 à 19h30.'],
    instructeurs: [
      faycal,
      { nom: 'Daniel De Angelis', grade: '7e dan', slug: 'daniel-de-angelis' },
      { nom: 'Éric De Rome', grade: '5e dan', slug: 'eric-de-rome' },
      { nom: 'Ludovic Durrieu', grade: '3e dan', slug: 'ludovic-durrieu' },
      adriana,
    ],
    formulaire: 'https://forms.gle/ifqvtVDD2V2jmvLx5',
    qr: '/images/qr/judo-adultes.jpg',
  },
  {
    slug: 'aiki-jujitsu',
    titre: 'Aiki Ju-Jitsu',
    titreEn: 'Aiki Ju-Jitsu',
    categorie: 'arts-martiaux',
    resume: 'Un art de défenses complètes et efficaces — une école de vie.',
    resumeEn: 'A complete and effective art of self-defence — a school of life.',
    horaire: 'Mar/Jeu 20h00–21h30',
    description:
      'Pour acquérir une excellente forme physique tout en apprenant à se défendre contre toutes formes d’agression.\n\nLe cours vous permettra par la même occasion de vous intégrer à un groupe social et dynamique.\n\nPour le plaisir, la confiance en soi et la santé, l’Aiki Ju-Jitsu est un art de défenses complètes et efficaces, une école de vie.',
    descriptionEn:
      'Get in excellent shape while learning to defend yourself against every kind of aggression, as part of a lively, social group.\n\nFor fun, confidence and health, Aiki Ju-Jitsu is a complete and effective art of self-defence — a school of life.',
    prealable: 'Carte d’Accès Boucherville, sandales et judogi (habit de judo), voir avec le professeur.',
    cours: '2 cours par semaine',
    debut: 'Mardi 01 septembre 2026',
    groupes: [{ clientele: 'Femmes et hommes nés en 2010 et avant', code: 'AJJ', horaire: 'Mardi et jeudi 20h00 à 21h30' }],
    tarifs: [
      { periode: '01 sep. au 17 déc.', prix: ['355 $', '370 $'] },
      { periode: '01 sep. au 08 avr.', prix: ['570 $', '585 $'] },
      { periode: '01 sep. au 17 juin', prix: ['660 $', '675 $'] },
    ],
    notes: ['Du 22 juin au 26 août : cours libres (à confirmer).'],
    instructeurs: [{ nom: 'Patric Charade', grade: '4e dan Aiki Ju-Jitsu', slug: 'patric-charade' }],
    formulaire: 'https://forms.gle/m2kdRozoinbB3zDy5',
    qr: '/images/qr/aiki-jujitsu.jpg',
    documents: [{ titre: 'Plus d’infos : Nintai', href: 'http://www.nintai.ca/' }],
  },
  {
    slug: 'jiu-jitsu-bresilien',
    titre: 'Jiu-Jitsu brésilien',
    titreEn: 'Brazilian Jiu-Jitsu',
    categorie: 'arts-martiaux',
    resume: 'Clés et étranglements, Gi et No Gi, debout et au sol. Essai gratuit mardi et jeudi.',
    resumeEn: 'Locks and chokes, Gi and No-Gi, standing and on the ground. Free trial Tue & Thu.',
    horaire: 'Mar/Jeu 20h00–21h30',
    description:
      'Le jiu-jitsu brésilien est un art martial adapté de la tradition japonaise. Il vise ultimement à faire abandonner son adversaire à l’aide de clés articulaires et d’étranglements plutôt qu’avec des coups.\n\nL’objectif des cours est que les étudiants maîtrisent l’ensemble des principes de contrôle, projection, immobilisation et soumission du jiu-jitsu brésilien dans un combat se déroulant debout et au sol.\n\nNous pratiquons aussi occasionnellement avec des gants afin que les étudiants se sentent à l’aise de gérer les frappes dans un contexte où elles seraient permises, comme dans une situation d’auto-défense ou dans un combat d’arts martiaux mixtes. Nous alternons entre des cours Gi et No Gi.\n\nLes cours s’adressent aux jeunes de 15 ans et plus et aux adultes, avec ou sans expérience des arts martiaux, qui sont prêts à se dépasser mentalement et physiquement. Les cours sont mixtes, les filles et les garçons sont les bienvenus.\n\nLa sécurité est notre préoccupation première et la meilleure façon de savoir si cet art martial est fait pour vous est de venir essayer un cours gratuit tous les mardis et jeudis à 20h00.',
    descriptionEn:
      'Brazilian Jiu-Jitsu is a martial art adapted from the Japanese tradition. The goal is to make your opponent submit with joint locks and chokes rather than strikes.\n\nStudents learn the principles of control, takedowns, pins and submissions, standing and on the ground. We occasionally train with gloves so students are comfortable handling strikes (self-defence, MMA), and alternate between Gi and No-Gi classes.\n\nClasses are mixed and open to teens 15+ and adults, with or without martial-arts experience.\n\nSafety comes first — the best way to find out if BJJ is for you is a free trial class, every Tuesday and Thursday at 8 pm.',
    prealable: `${carteSandalesJudogi} Le port d’un protège-dents est obligatoire.`,
    cours: '2 cours par semaine',
    debut: 'Mardi 01 septembre 2026',
    groupes: [{ clientele: 'Femmes et hommes nés en 2010 et avant', code: 'BJJ', horaire: 'Mardi et jeudi 20h00 à 21h30' }],
    colonnes: ['Tarif'],
    tarifs: [
      { periode: 'Étudiant ou membre de Judo Boucherville', prix: ['65 $ / mois'] },
      { periode: 'Régulier', prix: ['85 $ / mois'] },
      { periode: 'À la carte', prix: ['20 $ / cours'] },
    ],
    notes: ['Abonnement et/ou essai gratuit disponible en tout temps.'],
    instructeurs: [{ ...jeremie, grade: 'Ceinture noire judo et BJJ' }],
    formulaire: 'https://forms.gle/igPQKKbmiCXYDgxQ7',
    qr: '/images/qr/jiu-jitsu-bresilien.png',
  },
  {
    slug: 'autodefense-femmes',
    titre: 'Auto-défense pour femmes',
    titreEn: 'Women’s self-defence',
    categorie: 'adultes',
    resume: 'Techniques efficaces pour se protéger, dans un environnement sûr et encourageant.',
    resumeEn: 'Effective techniques to protect yourself, in a safe and supportive setting.',
    horaire: 'Lun–Jeu 12h00 · Dim 14h00',
    description:
      'Axé sur l’empowerment des femmes à travers l’auto-défense, notre programme offre un environnement sûr et encourageant où vous pouvez apprendre des techniques efficaces pour vous protéger en situation de danger.\n\nQue vous cherchiez à renforcer votre confiance ou à vous préparer à des situations de risque, ce programme est spécialement conçu pour les femmes désireuses de développer des compétences en auto-défense au quotidien. Rejoignez-nous pour devenir plus forte, plus sûre et indépendante.',
    descriptionEn:
      'Focused on empowering women through self-defence, this programme offers a safe, encouraging space to learn effective techniques for protecting yourself in dangerous situations.\n\nWhether you want more confidence or to be ready for risky situations, it is designed for women who want everyday self-defence skills. Join us to become stronger, safer and more independent.',
    prealable: 'Sandales.',
    cours: '1 cours par semaine',
    debut: 'Lundi 05 octobre 2026',
    inscription: 'En ligne avant le 31 août 2026 pour réserver une place.',
    groupes: [{ clientele: 'Femmes nées en 2010 et avant', code: 'AD', horaire: 'Lundi, mardi, mercredi ou jeudi 12h00 à 13h00, ou dimanche 14h00 à 15h00' }],
    colonnes: ['Avant le 31 août'],
    tarifs: [{ periode: '05 oct. au 10 déc. (10 semaines)', prix: ['270 $'] }],
    instructeurs: [adriana],
    formulaire: 'https://forms.gle/aWdDxBZHGjBiASL16',
    qr: '/images/qr/autodefense-femmes.jpg',
    contacts: [{ nom: 'Adriana Portuondo-Isasi', tel: '450 655-1888', courriel: 'adriana@judoboucherville.com' }],
  },
  {
    slug: 'prevention-chutes',
    titre: 'Prévention des chutes (PPCC)',
    titreEn: 'Fall prevention (PPCC)',
    categorie: 'adultes',
    resume: 'Apprendre à prévenir et contrôler les chutes grâce au judo — 50 ans et plus.',
    resumeEn: 'Learning to prevent and control falls through judo — ages 50+.',
    horaire: 'Lun–Ven 09h00–10h00',
    description:
      'Le programme de prévention et de contrôle des chutes vise principalement à enseigner des techniques de judo pour éviter les blessures liées aux chutes. Il met l’accent sur la prévention en apprenant à abaisser le centre de gravité, à ramener les membres vers l’intérieur du corps et à développer des automatismes de protection, ainsi que sur le contrôle lors d’une chute inévitable grâce à des ukemi sécuritaires qui répartissent l’impact et réduisent les traumatismes.\n\nCe programme cherche à réduire au maximum les blessures en rendant les participants plus confiants face aux chutes du quotidien. Il améliore l’équilibre, la flexibilité et la coordination, et apprend à monter et descendre du sol en toute sécurité. Il s’adresse à tous, même aux personnes sans expérience en judo, et se structure en 10 séances progressives pour automatiser ces réflexes.\n\nDestiné au grand public à risque, surtout aux aînés, ce programme démocratise les savoirs du judo afin de réduire la peur de tomber et les hospitalisations qui peuvent en découler. Il est déployé dans les dojos québécois par Judo Québec et des formateurs certifiés.',
    descriptionEn:
      'The fall prevention and control programme teaches judo techniques that avoid fall-related injuries: lowering the centre of gravity, bringing the limbs in and building protective reflexes — and, when a fall can’t be avoided, safe ukemi that spread the impact.\n\nOver 10 progressive sessions it improves balance, flexibility and coordination, and teaches how to get down to and up from the floor safely. No judo experience needed.\n\nDesigned for the public at risk, especially seniors, and deployed in Quebec dojos by Judo Québec and certified trainers.',
    prealable: 'Carte d’Accès Boucherville, sandales.',
    cours: '1 cours par semaine',
    debut: 'Lundi 05 octobre 2026',
    inscription: 'En ligne avant le 31 août 2026 pour réserver une place.',
    groupes: [{ clientele: 'Femmes et hommes de 50 ans et plus', code: 'PPCC', horaire: 'Lundi, mardi, mercredi, jeudi ou vendredi 09h00 à 10h00' }],
    colonnes: ['Avant le 31 août'],
    tarifs: [{ periode: '05 oct. au 10 déc. (10 semaines)', prix: ['150 $'] }],
    instructeurs: [
      { nom: 'Yves Plourde', grade: '1er dan', slug: 'yves-plourde' },
      { nom: 'Luc Bourque', grade: '1er dan', slug: 'luc-bourque' },
    ],
    formulaire: 'https://forms.gle/i5vbxGe8jct8ogL29',
    qr: '/images/qr/prevention-chutes.png',
  },
  {
    slug: 'parascolaire',
    titre: 'Parascolaire',
    titreEn: 'After-school',
    categorie: 'enfants',
    resume: 'Initiation au judo pour les 3e, 4e et 5e année, transport par minibus depuis l’école.',
    resumeEn: 'Judo for grades 3–5, with minibus pickup from school.',
    horaire: 'Mar/Mer/Jeu 16h00–17h30',
    description:
      'Initiation au judo (mixte) pour les élèves de 3e, 4e et 5e année, accessibilité à la ceinture blanche / jaune (deux sessions).\n\nTransport de l’école par minibus assuré par le club de judo, retour assuré par les parents à 17h30.\n\nJournées disponibles : mardi, mercredi et jeudi (à déterminer pour chaque école après les inscriptions).\n\nLe samedi 19 décembre, tournoi de fin de session.\n\nDepuis 1988 — 39e saison.',
    descriptionEn:
      'A mixed judo introduction for grade 3, 4 and 5 students, leading to the white / yellow belt over two sessions.\n\nThe club’s minibus picks children up at school; parents pick them up at 5:30 pm.\n\nAvailable days: Tuesday, Wednesday and Thursday (set for each school after registration). End-of-session tournament on Saturday, December 19.\n\nSince 1988 — 39th season.',
    prealable: 'Carte d’Accès Boucherville, long pantalon de sport et sandales.',
    cours: '1 cours par semaine',
    debut: 'Semaine du 29 septembre 2026',
    inscription: 'En ligne avant le 25 septembre 2026.',
    groupes: [{ clientele: 'Élèves de 3e, 4e et 5e année', code: 'PS', horaire: 'Mardi, mercredi ou jeudi 16h00 à 17h30' }],
    colonnes: ['Coût'],
    tarifs: [{ periode: '29 sep. au 19 déc. (12 semaines)', prix: ['190 $'] }],
    notes: ['Les horaires sont sujets à changement selon le nombre d’inscriptions; s’il y a changement, un responsable du club vous appellera.'],
    instructeurs: [adriana],
    formulaire: 'https://forms.gle/qBHLtoiyD7XknjLr8',
    qr: '/images/qr/parascolaire.jpg',
    documents: [
      { titre: 'Informations automne 2026', href: `${OLD}ParaScolaire.pdf` },
      { titre: 'Projet présenté aux directions des écoles', href: `${OLD}ProjetsDirectionsEcoles.pdf` },
    ],
  },
  {
    slug: 'camp-de-jour',
    titre: 'Camp de jour',
    titreEn: 'Day camp',
    categorie: 'enfants',
    resume: 'Camps d’été spécialisés en judo pour les 8 à 13 ans, tous niveaux.',
    resumeEn: 'Judo summer camps for ages 8 to 13, all levels.',
    horaire: 'Été · 09h00–16h00',
    description:
      'Le Club de Judo Boucherville offre un camp de jour spécialisé; ce camp permettra aux enfants de découvrir le judo ou de le perfectionner.\n\nLe judo n’est pas qu’un sport, mais une école de vie où l’on apprend des valeurs telles que le respect, le courage et la modestie, en plus de pratiquer un exercice physique et de développer le goût de l’effort.\n\nTu as envie d’essayer une nouvelle activité, tu veux continuer à pratiquer ton sport préféré durant l’été? Les camps de jour du Club de Judo Boucherville sont faits pour toi.\n\nAvec plus de cinquante ans d’expérience, de nouvelles installations et des moniteurs passionnés, le Club offre pour l’été 2026 des camps de jour pour tous les niveaux.',
    descriptionEn:
      'Club de Judo Boucherville runs a judo-focused day camp where children can discover judo or sharpen their skills.\n\nJudo is more than a sport — it is a school of life that teaches respect, courage and modesty, along with physical activity and a taste for effort.\n\nWith more than fifty years of experience, new facilities and passionate counsellors, the club offers day camps for every level in summer 2026.',
    prealable: 'Sandales, judogi (s’il en a un), un dîner, collation, souliers de sport, maillot de bain, crème solaire.',
    inscription: 'À partir du 1er mars 2026.',
    groupes: [
      { clientele: '8 à 13 ans', code: 'CJSEM01', horaire: 'Du 06 au 10 juillet 2026' },
      { clientele: '8 à 13 ans', code: 'CJSEM02', horaire: 'Du 13 au 17 juillet 2026' },
      { clientele: '8 à 13 ans', code: 'CJSEM03', horaire: 'Du 20 au 24 juillet 2026' },
      { clientele: '8 à 13 ans', code: 'CJSEM04', horaire: 'Du 27 au 31 juillet 2026' },
      { clientele: '8 à 13 ans', code: 'CJSEM05', horaire: 'Du 03 au 07 août 2026' },
      { clientele: '8 à 13 ans', code: 'CJSEM06', horaire: 'Du 10 au 14 août 2026' },
      { clientele: '8 à 13 ans', code: 'CJSEM07', horaire: 'Du 17 au 21 août 2026' },
    ],
    colonnes: ['Coût'],
    tarifs: [
      { periode: 'Par semaine, 09h00 à 16h00', prix: ['245 $'] },
      { periode: 'Service de garde 07h30 à 09h00 et 16h00 à 17h30', prix: ['50 $ / semaine'] },
    ],
    notes: [
      'Minimum 10, maximum 18 personnes par semaine.',
      'Service de garde : minimum 4 inscriptions.',
    ],
    instructeurs: [],
    formulaire: 'https://forms.gle/oVhsmA6SCX7NQK1o9',
    qr: '/images/qr/camp-de-jour.png',
    contacts: [{ nom: 'Adriana Portuondo-Isasi', tel: '450 655-1888', courriel: 'info@judoboucherville.com' }],
  },
  {
    slug: 'sport-etudes',
    titre: 'Sport-études',
    titreEn: 'Sport-études',
    categorie: 'enfants',
    resume: 'Judo Sport-Études avec l’École De Mortagne, du primaire au secondaire.',
    resumeEn: 'Judo Sport-Études with École De Mortagne, primary to high school.',
    horaire: 'Selon l’horaire scolaire',
    description:
      'Le programme Judo Sport-Études s’adresse aux judokas de 5e et 6e année du primaire et du secondaire, en partenariat avec l’École secondaire De Mortagne.\n\nPour toute information immédiate sur le programme, contactez Fayçal Bousbiat. Pour l’information académique, contactez la direction du programme Sport-Études de l’École De Mortagne.',
    descriptionEn:
      'The Judo Sport-Études programme is for judoka in grades 5 and 6 and in high school, in partnership with École secondaire De Mortagne.\n\nFor programme information, contact Fayçal Bousbiat. For academic questions, contact the Sport-Études office at École De Mortagne.',
    groupes: [],
    tarifs: [],
    instructeurs: [faycal],
    documents: [
      { titre: 'Aux directeurs techniques et parents (août)', href: `${OLD}SportEtudeAout.pdf` },
      { titre: 'Aux directeurs techniques et parents', href: `${OLD}SportEtude.pdf` },
      { titre: 'Pamphlet Sport-Études 2026-2027', href: `${OLD}PanfleSportEtudes.pdf` },
      { titre: 'Cahier de l’athlète', href: `${OLD}CahierAthlete.pdf` },
      { titre: 'Rapport de compétition', href: `${OLD}RapportdeCompetition.pdf` },
      { titre: 'Observation des adversaires', href: `${OLD}Observationdesadversaires.pdf` },
      { titre: 'Préparation technique', href: `${OLD}PreparationTechnique.pdf` },
      { titre: 'École De Mortagne — Sport-Études', href: 'http://demortagne.csp.qc.ca/VSE.php' },
    ],
    contacts: [
      { nom: 'Fayçal Bousbiat', role: 'Programme Sport-Études', tel: '450 655-1888', courriel: 'info@judoboucherville.com' },
      { nom: 'Heidi Chapados', role: 'Directrice adjointe, 1re à 3e secondaire', tel: '450 655-7311 poste 11729', courriel: 'heidi.chapados@cssp.gouv.qc.ca' },
      { nom: 'Caroline Breton', role: 'Secrétaire, 1re à 3e secondaire', tel: '450 655-7311 poste 11709', courriel: 'caroline.breton@cssp.gouv.qc.ca' },
      { nom: 'Éric Bastien', role: 'Directeur adjoint, 4e et 5e secondaire', tel: '450 655-7311 poste 11727', courriel: 'eric.bastien@cssp.gouv.qc.ca' },
      { nom: 'Pascale Juneau', role: 'Secrétaire, 4e et 5e secondaire', tel: '450 655-7311 poste 11707', courriel: 'pascale.juneau@cssp.gouv.qc.ca' },
    ],
  },
]

export function getAllProgrammes(): Programme[] {
  return programmes
}

export function getProgrammeBySlug(slug: string): Programme | null {
  return programmes.find(p => p.slug === slug) ?? null
}
