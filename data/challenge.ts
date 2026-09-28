// Challenge International Judo Boucherville, sources : judoboucherville.com/chall (WordPress),
// 27e-Challenge-Devis-Fra.pdf et Programme2026.docx.pdf
const UPLOADS = 'https://www.judoboucherville.com/chall/wp-content/uploads/'

export const challenge = {
  edition: 27,
  date: '2026-04-11T08:00:00-04:00',
  depuis: 1997,
  pays: ['France', 'Italie', 'Belgique', 'États-Unis', 'Canada', 'Québec'],
  paysEn: ['France', 'Italy', 'Belgium', 'United States', 'Canada', 'Québec'],
  formulaire: 'https://forms.gle/DFAP1jxaVTKtVefr5',
  programme: `${UPLOADS}2026/04/Programme2026.docx.pdf`,
  devis: `${UPLOADS}2026/01/27e-Challenge-Devis-Fra.pdf`,
  video: 'https://www.youtube.com/watch?v=ZU73hq7DpOc',
  president: 'Olivier Bry',
  // [équipe, coût]
  couts: [['4', '200 $'], ['5', '250 $'], ['6', '300 $']] as const,
  // [division, en, bourse]
  bourses: [
    ['Chaque division', 'Each division', '1 000 $'],
    ['Masters', 'Masters', '800 $'],
    ['U21 / Senior', 'U21 / Senior', '1 200 $'],
  ] as const,
  // [pour, en, date, dateEn]
  limites: [
    ['Équipes du Canada et des États-Unis', 'Teams from Canada and the USA', '4 avril 2026', 'April 4, 2026'],
    ['Équipes hors Amérique du Nord', 'Teams from outside North America', '11 mars 2026', 'March 11, 2026'],
  ] as const,
}

// [division, hommes (kg), femmes (kg), né en, en, grades, en, pesée]
export const divisions: [string, string, string, string, string, string, string, string][] = [
  ['U14', '-40, -50, -60', '-40, -52', '2013 et 2014', '2013 & 2014', 'Jaune et +', 'Yellow and up', '8 h 30 – 9 h'],
  ['U16', '-46, -55, -66', '-48, -63', '2011 et 2012', '2011 & 2012', 'Jaune et +', 'Yellow and up', '10 h 30 – 11 h'],
  ['Masters (Ne-Waza)', '4 judokas, max. 330 kg', '·', '30 ans et + (min. 150 ans par équipe)', '30 and over (min. 150 years per team)', 'Bleue à noire', 'Blue to black', '10 h 30 – 11 h'],
  ['U18', '-60, -73, -90', '-57, -70', '2009 et 2010', '2009 & 2010', 'Orange et +', 'Orange and up', '11 h 30 – 12 h'],
  ['U21 / Senior', '-66, -81, +81', '-57, -70, +70', '2008 et avant', '2008 and earlier', 'Verte à noire', 'Green to black', '11 h 30 – 12 h'],
]

// [fichier, nom], page « Commanditaires / Sponsors » de l’ancien site
export const commanditaires: [string, string][] = [
  ['AGF.jpeg', 'Groupe AGF'],
  ['AlainHuot.png', 'Alain Huot'],
  ['canadavie.jpeg', 'Canada Vie'],
  ['canam.png', 'Canam'],
  ['logocat.png', 'C.A.T.'],
  ['EddyFishSans.png', 'Eddyfi Technologies'],
  ['Groupe_Courtois.jpg', 'Groupe Courtois'],
  ['Innovex.jpg', 'Innovex'],
  ['Lafond.png', 'Lafond'],
  ['Langevin.png', 'Langevin'],
  ['Manuvie.png', 'Manuvie'],
  ['MembranesFR.png', 'Membranes F.R. Liners'],
  ['Mercedes_Benz_Saguenay.png', 'Mercedes-Benz Saguenay'],
  ['NOVATECH.png', 'Novatech'],
  ['PolyExpert.png', 'Poly-Expert'],
  ['Previan.png', 'Previan'],
  ['PSYMAN.png', 'Psyman'],
  ['saguenay_volks-2.png', 'Saguenay Volkswagen'],
  ['VieEnRose.jpg', 'La Vie en Rose'],
  ['Roxboro.png', 'Roxboro'],
  ['Youkali-1.png', 'Fondation Youkali'],
]

// [division, or, argent, bronze, meilleur athlète]
type Ligne = [string, string, string, string, string]
export type Edition = { annee: number; coupe: [string, number?][]; divisions?: Ligne[] }

export const palmaresChallenge: Edition[] = [
  { annee: 2018, coupe: [['Shidokan'], ['Boucherville'], ['Olympique']] },
  { annee: 2017, coupe: [['Shidokan'], ['Taifu'], ['Boucherville']] },
  { annee: 2016, coupe: [['Boucherville'], ['Métropolitain'], ['Olympique']] },
  {
    annee: 2015,
    coupe: [['Boucherville', 49], ['Shidokan', 40], ['Jikan (Montréal)', 11]],
    divisions: [
      ['U12', 'Taifo (Ontario)', 'Jikan (Montréal)', 'Shidokan (Montréal)', 'Maksim Rudakov (Taifo)'],
      ['U14', 'Seiko (Lac-St-Jean)', 'Olympique B', 'Jikan A (Montréal)', 'Isaak St-Hilaire (Seiko)'],
      ['U16', 'Shidokan (Montréal)', 'Boucherville', '', 'Socheat Hueng (Shidokan)'],
      ['U18', 'Boucherville', 'Shidokan (Montréal)', 'Beauport (Québec)', 'Philip Dion (Boucherville)'],
      ['U16 / U18 féminin', 'Boucherville', '', '', ''],
      ['U21 / Senior féminin', 'Boucherville', '', '', ''],
      ['U21 / Senior Mudansha', 'Shidokan (Montréal)', 'ITC Budokan (Montréal)', 'Club Montréal', 'Anis Haddad (ITC Budokan)'],
      ['U21 / Senior Yudansha', 'Shidokan (Montréal)', 'Boucherville', 'Anjou (Montréal)', 'Doichi Hiaro (Shidokan)'],
      ['Master', 'Boucherville B', 'Shidokan (Montréal)', 'Boucherville A', 'Alexandre Émond (Boucherville A)'],
    ],
  },
  {
    annee: 2014,
    coupe: [['Boucherville', 57], ['Métropolitain', 28], ['St-Hyacinthe', 10]],
    divisions: [
      ['U12', 'Métropolitain', 'Boucherville B', 'Seiko', 'Samuel Lefebvre (Métropolitain)'],
      ['U14', 'Seiko', 'Longueuil', 'Métropolitain', 'Matis Pastor-Jobin (Métropolitain)'],
      ['U16', 'Boucherville', 'Olympique', 'Métropolitain', 'Colin Mc Clure (Métropolitain)'],
      ['U18', 'St-Hyacinthe', 'Boucherville', 'Judo Jikan', 'Philip Dion (Boucherville)'],
      ['U16 / U18 féminin', 'Boucherville', 'Varennes', '', 'Audrey Dion (Boucherville)'],
      ['U21 / Senior féminin', 'Boucherville', '', '', ''],
      ['U21 / Senior Mudansha', 'Métropolitain', 'Shidokan', 'Boucherville', 'Anthony Karzon (Boucherville)'],
      ['U21 / Senior Yudansha', 'Boucherville', 'Anjou-ITC Budokan', 'Métropolitain', 'Guillaume Perrault (Boucherville)'],
      ['Master', 'Boucherville', 'St-Hyacinthe', '', 'Simon Dufour (St-Hyacinthe)'],
    ],
  },
  {
    annee: 2013,
    coupe: [['Boucherville', 65], ['Judo Trets (France)', 47], ['Beauport', 17]],
    divisions: [
      ['U11 (M-F)', 'Seiko', 'Boucherville A', 'Boucherville B', 'Lucas Martin (Seiko)'],
      ['U13 (M)', 'Judo Trets (France)', 'Métropolitain', 'Longueuil', 'Rudy Villeamaux (Judo Trets)'],
      ['U15 (M)', 'Judo Trets (France)', 'LCSM', 'Boucherville B', 'Theo Giordaengo (Judo Trets)'],
      ['U15 / U17 (F)', 'Boucherville', 'Anjou', '', 'Adriana Portuondo-Isasi (Boucherville)'],
      ['U18 (M)', 'Shidokan', 'St-Hyacinthe', 'Judo Trets (France)', 'Dmytro Samoilenko (Shidokan)'],
      ['U20 / Senior (F)', 'Boucherville B', 'Boucherville A', '', 'Sandra Monette-Roy (Boucherville B)'],
      ['U20 / Senior O/M (M)', 'Boucherville A', 'Boucherville B', '', 'Artur Tchernychev (Boucherville B)'],
      ['U20 / Senior M/N (M)', 'Boucherville', 'Judo AMS', 'Beauport', 'Michael Fortin-Demers (Boucherville)'],
      ['Master', 'Boucherville', 'Beauport', '', 'Didiero Mbuga (Boucherville)'],
    ],
  },
  {
    annee: 2012,
    coupe: [['Shidokan', 49], ['Boucherville', 45], ['Seiko', 19]],
    divisions: [
      ['U11 (M-F)', 'Seiko Lac-St-Jean 1', 'Seiko Lac-St-Jean 2', 'Shidokan', 'Maurice Thibault (Seiko Lac-St-Jean)'],
      ['U13 (M)', 'Varennes', 'Seiko Lac-St-Jean', 'St-Hyacinthe', 'Zachary Comonfour (Varennes)'],
      ['U15 (M)', 'Judo Trets (France)', 'LCSM', 'Boucherville B', 'Theo Giordaengo (Judo Trets)'],
      ['U15 (M)', 'Shidokan', 'St-Hyacinthe', 'Boucherville', 'Youcef Rahal (Shidokan)'],
      ['U15 / U17 (F)', 'Boucherville', '', '', ''],
      ['U17 (M)', 'St-Hyacinthe', 'Shidokan', 'Boucherville', 'Gabriel Juteau (Boucherville)'],
      ['U20 / Senior (F)', 'Shidokan', 'Boucherville A', 'Boucherville B', 'Audrey Francis-M (Shidokan)'],
      ['U20 / Senior O/M (M)', 'Shidokan', 'Boucherville', '', 'Louis Kreber-G (Shidokan)'],
      ['U20 / Senior M/N (M)', 'Shidokan', 'Ottawa', 'Boucherville', 'Hongo Akinori (Shidokan)'],
      ['Master', 'Boucherville', 'Shidokan', '', 'Frédéric Bourque (Boucherville)'],
    ],
  },
  {
    annee: 2011,
    coupe: [['Shidokan', 56], ['Boucherville', 47], ['Seiko Lac-St-Jean', 17]],
    divisions: [
      ['U11 (M-F)', 'Boucherville B', 'Shidokan A', 'Multikyo', 'Olivier Legault (Boucherville B)'],
      ['U13 (M)', 'Seiko Lac-St-Jean', 'Shidokan B', 'Shidokan A', 'Cédric Agounov (Shidokan B)'],
      ['U15 (M)', 'Seiko Lac-St-Jean', 'Shidokan', 'USC Judo (France)', 'François Gauthier-Drapeau (Seiko Lac-St-Jean)'],
      ['U15 (M)', 'Shidokan', 'St-Hyacinthe', 'Boucherville', 'Youcef Rahal (Shidokan)'],
      ['U15 / U17 (F)', 'Boucherville', '', '', ''],
      ['U17 (M)', 'Shidokan', 'Multikyo', 'Boucherville', 'Louis Krieber-Gagnon (Shidokan)'],
      ['U20 / Senior (F)', 'Shidokan', 'Boucherville A', '', 'Stéphanie Tremblay (Shidokan)'],
      ['U20 / Senior O/M (M)', 'Shidokan B', 'Shidokan A', 'Boucherville', 'Evegney Kremerman (Shidokan)'],
      ['U20 / Senior M/N (M)', 'Boucherville', 'Shidokan', 'Multikyo', 'Dominique Coté, Michael Fortin-Demers (Boucherville)'],
      ['Master', 'Boucherville', '', '', ''],
    ],
  },
  {
    annee: 2010,
    coupe: [['Boucherville', 42], ['Shidokan', 39], ['Ste-Thérèse', 30]],
    divisions: [
      ['U11 (M-F)', 'Seiko Lac-St-Jean', 'Varennes', 'St-Hyacinthe', 'Vincent Desgagnés (Seiko Lac-St-Jean)'],
      ['U13 (M)', 'Seiko Lac-St-Jean', 'Ste-Thérèse', 'Boucherville', 'Charles Simard (Seiko Lac-St-Jean)'],
      ['U15 (M)', 'Seiko Lac-St-Jean', 'Shidokan', 'USC Judo (France)', 'François Gauthier-Drapeau (Seiko Lac-St-Jean)'],
      ['U15 (M)', 'Boucherville', 'St-Hyacinthe', 'Ste-Thérèse', 'Christian Pasalic (Boucherville)'],
      ['U15 / U17 (F)', 'Boucherville', 'Anjou', '', 'Alexandra Gauthier (Boucherville)'],
      ['U17 (M)', 'Serai', 'Ste-Thérèse', 'Shidokan', 'Georges Poklitar (Serai)'],
      ['U20 / Senior (F)', 'Shidokan', 'Boucherville A', '', 'Stéphanie Tremblay (Shidokan)'],
      ['U20 / Senior O/M (M)', 'Shidokan 1', 'Shidokan 2', 'Anjou', 'Marc Deschenes (Shidokan 1)'],
      ['U20 / Senior M/N (M)', 'Boucherville', 'Shidokan', 'Ste-Thérèse', 'Guillaume Perrault (Boucherville)'],
      ['Master', 'Shidokan', 'Boucherville', 'Gatineau', 'Fayçal Bousbiat (Boucherville)'],
    ],
  },
]
