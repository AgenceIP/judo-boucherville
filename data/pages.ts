// Conseil, historique and téléchargements content (moved out of the pages for the Sanity migration).

// Source : judoboucherville.com/html/Conseil.php
export const membres: [string, string, string, string][] = [
  ['Président', 'President', 'Frédéric Bourque', 'frederic.bourque@judoboucherville.com'],
  ['Vice-président', 'Vice-president', 'Olivier Bry', 'olivier.bry@videotron.ca'],
  ['Secrétaire', 'Secretary', 'Alain Dessureault', 'alaindessureault@hotmail.com'],
  ['Trésorier', 'Treasurer', 'Maxime Bellemare', 'tresorier@judoboucherville.com'],
  ['Responsable d’éthique', 'Ethics officer', 'Alain Dessureault', 'alaindessureault@hotmail.com'],
  ['Communication', 'Communications', 'Stéphanie Trépanier', 'stepht2018@outlook.com'],
  ['Administrateur', 'Director', 'Alexandre Thomas', 'al3xthomas@gmail.com'],
  ['Directeur technique', 'Technical director', 'Fayçal Bousbiat', 'info@judoboucherville.com'],
]

// Source : judoboucherville.com/html/Presidents.php
export const presidents: [string, string][] = [
  ['1971–1972', 'Jean Tessier'],
  ['1972–1974', 'Pierre Morency'],
  ['1974–1975', 'Marcel Laurin'],
  ['1975–1977', 'Serge Salvetti'],
  ['1977–1979', 'Steven Zoni'],
  ['1979–1981', 'Pierre Langevin'],
  ['1981–1982', 'Yolande Larouche'],
  ['1982–1986', 'Jacques Demers'],
  ['1986–1987', 'Normand DeCarufel'],
  ['1987–1991', 'Pierre Michel'],
  ['1991–1992', 'François Goyette'],
  ['1992–1993', 'Claude Lemay'],
  ['1993–1994', 'Carole Chamberlan'],
  ['1994–1999', 'Daniel Michelin'],
  ['1999–2000', 'René Scotto'],
  ['2000–2001', 'Richard Perrault'],
  ['2001–2003', 'Jacques Mantion'],
  ['2003–2005', 'Pierre Berthiaume'],
  ['2005–2011', 'Éric Derome'],
  ['2011–2012', 'Karl Légaré'],
  ['2012–2016', 'Frédéric Bourque'],
  ['2016–2018', 'Olivier Bry'],
  ['2018–', 'Frédéric Bourque'],
]

// Source : judoboucherville.com/html/Historique.php
export const timeline: [string, string, string, string][] = [
  ['1er mars 1970', 'March 1, 1970', 'Marcel Bourelly fonde le club « Kowakan - Shukokaé », au centre commercial La Seigneurie.', 'Marcel Bourelly founds the “Kowakan - Shukokaé” club at the La Seigneurie shopping centre.'],
  ['1974', '1974', 'Le club quitte La Seigneurie et poursuit ses activités au sein du Service des loisirs de la municipalité, sous le nom de Club de Judo Boucherville.', 'The club leaves La Seigneurie and continues within the town’s recreation department as Club de Judo Boucherville.'],
  ['13 août 1979', 'August 13, 1979', 'Les membres du comité constituent la corporation « Club de Judo Boucherville Inc. », premier club au Québec en nombre de membres et en résultats sportifs.', 'The committee incorporates “Club de Judo Boucherville Inc.”, the leading club in Québec by membership and results.'],
  ['1988', '1988', 'Début du programme parascolaire dans les écoles primaires de Boucherville.', 'The after-school programme starts in Boucherville’s elementary schools.'],
  ['2001', '2001', 'Fayçal Bousbiat devient entraîneur du club.', 'Fayçal Bousbiat becomes the club’s coach.'],
  ['2004', '2004', 'Marcel Bourelly prend sa retraite; Fayçal Bousbiat devient directeur technique.', 'Marcel Bourelly retires; Fayçal Bousbiat becomes technical director.'],
  ['2008', '2008', 'Le club devient centre régional d’entraînement (CRD).', 'The club becomes a regional training centre (CRD).'],
  ['2015', '2015', 'Le club déménage au Centre multifonctionnel pour deux ans, le temps de construire le nouveau dojo.', 'The club moves to the Centre multifonctionnel for two years while the new dojo is built.'],
  ['9 septembre 2017', 'September 9, 2017', 'Inauguration du Dojo Marcel Bourelly, au Complexe aquatique Laurie-Ève-Cormier.', 'The Dojo Marcel Bourelly opens in the Complexe aquatique Laurie-Ève-Cormier.'],
]

// [année, athlète(s), lieu, résultat]
export type Participation = [number, string, string, string?]
export const international: [string, string, Participation[]][] = [
  ['Jeux olympiques', 'Olympic Games', [
    [1992, 'Pascale Mainville', 'Barcelone'],
    [2012, 'Alexandre Emond', 'Londres'],
    [2012, 'Donald Ferland (arbitre)', 'Londres'],
  ]],
  ['Championnat du monde senior', 'Senior World Championships', [
    [1991, 'Pascale Mainville', 'Barcelone'],
    [1993, 'Dominique Pilon', 'Hamilton'],
    [2009, 'Alexandre Emond', 'Rotterdam'],
    [2010, 'Alexandre Emond', 'Tokyo', '9e'],
    [2010, 'Guillaume Perrault', 'Tokyo'],
    [2011, 'Alexandre Emond', 'Paris'],
    [2011, 'Guillaume Perrault', 'Paris'],
    [2013, 'Alexandre Emond', 'Rio de Janeiro'],
    [2013, 'Patrick Gagné', 'Rio de Janeiro'],
    [2014, 'Patrick Gagné', 'Chelyabinsk'],
    [2017, 'Analaura Portuondo-Isasi', 'Budapest'],
    [2019, 'Jacob Valois', 'Tokyo'],
    [2024, 'Analaura Portuondo-Isasi', 'Abu Dhabi'],
  ]],
  ['Championnat du monde junior', 'Junior World Championships', [
    [1990, 'Pascale Mainville', 'Dijon', '3e'],
    [1994, 'Gabriel Senécal', 'Le Caire'],
    [2000, 'Isabelle Pearson', 'Nabeul'],
    [2006, 'Guillaume Perrault', 'Saint-Domingue', '9e'],
    [2006, 'Jean-Philippe Gagnon', 'Saint-Domingue'],
    [2009, 'Maxime Gagnon', 'Paris'],
    [2010, 'Patrick Gagné', 'Agadir', '5e'],
    [2011, 'Michael Fortin-Demers', 'Afrique du Sud', '5e'],
    [2013, 'Analaura Portuondo-Isasi', 'Ljubljana', '5e'],
    [2014, 'Analaura Portuondo-Isasi', 'Miami', '3e'],
    [2017, 'Gabriel Juteau', 'Zagreb'],
    [2017, 'Jacob Valois', 'Zagreb'],
    [2017, 'Adriana Portuondo-Isasi', 'Zagreb'],
    [2018, 'Jacob Valois', 'Nassau'],
    [2024, 'Catherine Toshkov', 'Douchanbé'],
  ]],
  ['Championnat du monde cadet', 'Cadet World Championships', [
    [2011, 'Josiane Gagné', 'Kiev'],
    [2011, 'Analaura Portuondo-Isasi', 'Kiev'],
    [2013, 'Gabriel Juteau', 'Miami'],
    [2013, 'Analaura Portuondo-Isasi', 'Miami'],
    [2013, 'Adriana Portuondo-Isasi', 'Miami'],
    [2015, 'Jacob Valois', 'Sarajevo'],
    [2023, 'Mélody Grenier', 'Zagreb'],
    [2023, 'Charline Bourque', 'Zagreb'],
    [2023, 'Vincent Roberge-Poitras', 'Zagreb'],
    [2024, 'Mélody Grenier', 'Lima'],
    [2024, 'Charline Bourque', 'Lima'],
    [2024, 'Tristan Bourque', 'Lima'],
  ]],
  ['Championnat du monde universitaire', 'World University Championships', [
    [1991, 'Éric De Rome', 'Bruxelles'],
    [2004, 'Isabelle Pearson', 'Moscou'],
    [2006, 'Isabelle Pearson', 'Suwon'],
  ]],
  ['Championnat du monde vétéran', 'Veterans World Championships', [
    [2018, 'Frédéric Bourque', 'Cancún', '9e'],
    [2019, 'Gerardo Andrade', 'Marrakech', '5e'],
  ]],
  ['Championnat du monde de kata', 'Kata World Championships', [
    [2008, 'Donald Ferland et Daniel De Angelis', 'Paris', '5e'],
    [2008, 'Jacques Mantion et Yves Pearson', 'Paris'],
    [2009, 'Donald Ferland et Daniel De Angelis', 'Malte', '9e'],
    [2012, 'Donald Ferland et Daniel De Angelis', 'Pordenone'],
    [2018, 'Jérôme Lajoie et Jacob St-Jean', 'Cancún', '8e'],
  ]],
]

export const ancienDojo = ['ADojo1', 'ADojo2', 'ADojo3'].map(n => `/images/scraped/Autre_${n}.jpg`)
export const inauguration = [
  'Entrainement_Inauguration8', 'Logo_PlaqueInauguration', 'Entrainement_Inauguration7', 'Entrainement_Inauguration3',
  'Entrainement_Inauguration6', 'Entrainement_Inauguration2', 'Entrainement_Inauguration5', 'Autre_dojo1',
].map(n => `/images/scraped/${n}.jpg`)

// ponytail: PDFs still served by the old site — copy them to /public before the DNS cutover
const OLD = 'https://judoboucherville.com/html/Download/'

export const telechargements: { titre: [string, string]; docs: { titre: string; href: string }[] }[] = [
  {
    titre: ['Programme technique', 'Technical programme'],
    docs: [
      { titre: 'Liste des techniques de judo du Kodokan', href: 'https://rise.articulate.com/share/mgkGB9ClG1C3dXe9_6BgM0jx6euzwGtr#/' },
      { titre: 'Aide-mémoire judo avec vidéos (Judo Québec)', href: 'https://judo-quebec.qc.ca/wp-content/uploads/2021/01/Aide-memoire-judo-avec-videos-v7.pdf' },
      { titre: 'Ceinture blanche', href: `${OLD}ceintureblanche.pdf` },
      { titre: 'Ceinture jaune', href: `${OLD}ceinturejaune.pdf` },
      { titre: 'Ceinture orange', href: `${OLD}ceintureorange.pdf` },
      { titre: 'Ceinture verte', href: `${OLD}ceintureverte.pdf` },
      { titre: 'Ceinture bleue', href: `${OLD}ceinturebleue.pdf` },
    ],
  },
  {
    titre: ['Compétition', 'Competition'],
    docs: [
      { titre: 'Préparation technique', href: `${OLD}PreparationTechnique.pdf` },
      { titre: 'Rapport de compétition', href: `${OLD}RapportdeCompetition.pdf` },
      { titre: 'Observation des adversaires', href: `${OLD}Observationdesadversaires.pdf` },
      { titre: 'Récupération et réchauffement', href: `${OLD}RecupetRechauf.pdf` },
      { titre: 'Calendrier Judo Québec 2026-2027', href: 'https://judo-quebec.qc.ca/files/Pages/repertoire%20des%20activit%C3%A9s/repertoire-activites-2026-2027%20publication%202026-06-26.pdf' },
    ],
  },
  {
    titre: ['Club', 'Club'],
    docs: [
      { titre: 'Règlements généraux du CJB', href: `${OLD}ReglementsGeneraux%20CJB.pdf` },
      { titre: 'Mises à jour des règlements généraux du CJB', href: `${OLD}MjRerglementGnereauxCJBI-2.pdf` },
    ],
  },
]
