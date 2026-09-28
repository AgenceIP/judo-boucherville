// Événements à venir — source : accueil de judoboucherville.com (juillet 2026)

export type Evenement = { jour: string; titre: string; lieu?: string; lien?: string }
export type Mois = { mois: string; moisEn: string; evenements: Evenement[] }

const JQ = 'https://judo-quebec.qc.ca/evenement/'

export const calendrier: Mois[] = [
  {
    mois: 'Août 2026',
    moisEn: 'August 2026',
    evenements: [
      { jour: '04', titre: 'Début des entraînements compétition', lieu: 'Boucherville' },
      { jour: '17-18', titre: 'Inscription saison 2026-2027', lieu: 'Boucherville', lien: '/inscription' },
      { jour: '17-21', titre: 'Camp d’entraînement de l’Académie NextGen', lien: 'https://judocanada.org/fr/events/camp-dentrainement-dete-de-lacademie-nextgen-2026/' },
    ],
  },
  {
    mois: 'Septembre 2026',
    moisEn: 'September 2026',
    evenements: [
      { jour: '02', titre: 'Début des cours adultes', lieu: 'Boucherville' },
      { jour: '03', titre: 'Début des cours du mardi et jeudi', lieu: 'Boucherville' },
      { jour: '04', titre: 'Début des cours du lundi et vendredi', lieu: 'Boucherville' },
      { jour: '05', titre: 'Début des cours du samedi', lieu: 'Boucherville' },
      { jour: '12', titre: 'Entraînement provincial #1', lieu: 'Montréal' },
      { jour: '13', titre: 'Stage Itsutsu-no-kata', lieu: 'Boucherville' },
      { jour: '15', titre: 'Formation pour les organisateurs et directeurs de tournoi' },
      { jour: '19', titre: 'Stage Nage-no-kata', lieu: 'Boucherville' },
      { jour: '20', titre: 'Stage Nage-waza / Katame-waza', lieu: 'Boucherville' },
      { jour: '26-27', titre: 'Camp provincial', lieu: 'Montréal' },
    ],
  },
  {
    mois: 'Octobre 2026',
    moisEn: 'October 2026',
    evenements: [
      { jour: '11', titre: 'Morris Cup', lieu: 'Albany, New York' },
      { jour: '17-18', titre: 'Ontario Open', lieu: 'Toronto' },
      { jour: '24-25', titre: 'Coupe Louis-Page — sélection U19 pour les Jeux du Canada 2027', lieu: 'Jonquière', lien: `${JQ}324/tournoi-developpement-coupe-louis-page-2026-selection-u19-pour-les-jeux-du-canada-2027` },
      { jour: '28', titre: 'Journée mondiale du judo' },
      { jour: '31', titre: 'Stage Goshin-jutsu' },
    ],
  },
  {
    mois: 'Novembre 2026',
    moisEn: 'November 2026',
    evenements: [
      { jour: '01', titre: 'Stage Nage-waza / Katame-waza (nidan et plus)' },
      { jour: '06-08', titre: 'Coupe continentale', lieu: 'Montréal' },
      { jour: '09-11', titre: 'Camp national', lieu: 'Montréal' },
      { jour: '14-15', titre: 'Omnium du Québec (49e édition)', lieu: 'Longueuil', lien: `${JQ}19/omnium-du-quebec-49e-edition-quebec-open-2026-49th-edition` },
      { jour: '22', titre: 'Championnat provincial de kata', lieu: 'Beauport' },
      { jour: '28', titre: 'Entraînement provincial #2 — Mon premier entraînement provincial U12 et U14', lieu: 'Montréal' },
      { jour: '28-29', titre: 'Manitoba Open', lieu: 'Manitoba' },
    ],
  },
  {
    mois: 'Décembre 2026',
    moisEn: 'December 2026',
    evenements: [
      { jour: '05-06', titre: 'Tournoi développement', lieu: 'Repentigny', lien: `${JQ}325/tournoi-developpement-de-repentigny-2026` },
      { jour: '09', titre: 'Formation pour les organisateurs et directeurs de tournoi' },
      { jour: '12-13', titre: 'Examen de grades', lieu: 'Saint-Jean-sur-Richelieu' },
      { jour: '18-20', titre: 'Stage d’hiver de Judo Québec', lieu: 'Montréal' },
    ],
  },
]

export const calendrierJudoQuebec = 'https://judo-quebec.qc.ca/files/Pages/repertoire%20des%20activit%C3%A9s/repertoire-activites-2026-2027%20publication%202026-06-26.pdf'
