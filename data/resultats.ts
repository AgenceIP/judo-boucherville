export type Resultat = {
  id: string
  saison: string
  competition: string
  date: string
  athlete: string
  categorie: string
  medaille: 'or' | 'argent' | 'bronze'
}

export const resultats: Resultat[] = [
  // ─── 2024-2025 ──────────────────────────────────────────────────────────────

  // Championnats Canadiens 2025 (Calgary, 15-18.05.2025)
  { id: 'r001', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Tristan Bourque', categorie: 'U18 -81kg', medaille: 'or' },
  { id: 'r002', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Mélody Grenier', categorie: 'U18 -52kg', medaille: 'or' },
  { id: 'r003', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Catherine Toshkov', categorie: 'U21 -63kg', medaille: 'or' },
  { id: 'r004', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Charline Bourque', categorie: 'U21 -70kg', medaille: 'or' },
  { id: 'r005', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Mélody Grenier', categorie: 'Senior -52kg', medaille: 'or' },
  { id: 'r006', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Sébastien Fecteau', categorie: 'U18 -60kg', medaille: 'argent' },
  { id: 'r007', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Samuel Roberge-Poitras', categorie: 'U18 -66kg', medaille: 'argent' },
  { id: 'r008', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Olivier Bry', categorie: 'Master -90kg', medaille: 'argent' },
  { id: 'r009', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Maika Nephtali', categorie: 'U16 -57kg', medaille: 'bronze' },
  { id: 'r010', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Vincent Roberge-Poitras', categorie: 'U21 -66kg', medaille: 'bronze' },
  { id: 'r011', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Catherine Toshkov', categorie: 'Senior -63kg', medaille: 'bronze' },
  { id: 'r012', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Charline Bourque', categorie: 'Senior -70kg', medaille: 'bronze' },
  { id: 'r013', saison: '2024-2025', competition: 'Championnats Canadiens', date: '2025-05-15', athlete: 'Éric De Rome / Ludovic Durrieu', categorie: 'Kata', medaille: 'bronze' },

  // Championnats de l'Est 2025 (Edmundston, 19-20.04.2025)
  { id: 'r014', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Benjamin Brodeur', categorie: 'U14', medaille: 'or' },
  { id: 'r015', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Sébastien Fecteau', categorie: 'U18 -60kg', medaille: 'or' },
  { id: 'r016', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Sofiane Bousbiat', categorie: 'Senior -60kg', medaille: 'or' },
  { id: 'r017', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Vincent Roberge-Poitras', categorie: 'Senior -66kg', medaille: 'or' },
  { id: 'r018', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Catherine Toshkov', categorie: 'Senior -63kg', medaille: 'or' },
  { id: 'r019', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Catherine Toshkov', categorie: 'Senior Open', medaille: 'or' },
  { id: 'r020', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Luis Mayer-Cadieux', categorie: 'U14', medaille: 'argent' },
  { id: 'r021', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Edouard Chassé', categorie: 'U18 -66kg', medaille: 'argent' },
  { id: 'r022', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Sébastien Fecteau', categorie: 'Senior -60kg', medaille: 'argent' },
  { id: 'r023', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Loik Paradis', categorie: 'U14', medaille: 'bronze' },
  { id: 'r024', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Émile Nadeau-Denis', categorie: 'U14', medaille: 'bronze' },
  { id: 'r025', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Samuel Roberge-Poitras', categorie: 'U18 -66kg', medaille: 'bronze' },
  { id: 'r026', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Sofiane Bousbiat', categorie: 'U21 -60kg', medaille: 'bronze' },
  { id: 'r027', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Vincent Roberge-Poitras', categorie: 'U21 -66kg', medaille: 'bronze' },
  { id: 'r028', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Michael Phaneuf', categorie: 'Senior -73kg', medaille: 'bronze' },
  { id: 'r029', saison: '2024-2025', competition: "Championnats de l'Est", date: '2025-04-19', athlete: 'Tristan Lapointe', categorie: 'Senior Open', medaille: 'bronze' },

  // ─── 2023-2024 ──────────────────────────────────────────────────────────────

  // Championnats Canadiens 2024 (Montréal, 25.05.2024)
  { id: 'r030', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Tristan Bourque', categorie: 'U18 -81kg', medaille: 'or' },
  { id: 'r031', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Mélody Grenier', categorie: 'U18 -52kg', medaille: 'or' },
  { id: 'r032', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Charline Bourque', categorie: 'U18 -70kg', medaille: 'or' },
  { id: 'r033', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Catherine Toshkov', categorie: 'U21 -57kg', medaille: 'or' },
  { id: 'r034', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Catherine Toshkov', categorie: 'Senior -57kg', medaille: 'or' },
  { id: 'r035', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Charline Bourque', categorie: 'Senior -70kg', medaille: 'argent' },
  { id: 'r036', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Olivier Bry', categorie: 'Vétéran -100kg', medaille: 'argent' },
  { id: 'r037', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Mélody Grenier', categorie: 'Senior -52kg', medaille: 'bronze' },
  { id: 'r038', saison: '2023-2024', competition: 'Championnats Canadiens', date: '2024-05-25', athlete: 'Gerardo Andrade', categorie: 'Vétéran -100kg', medaille: 'bronze' },

  // Championnats de l'Est 2024 (Edmundston, 20-21.04.2024)
  { id: 'r039', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Zander Tselios', categorie: 'U14 -50kg', medaille: 'or' },
  { id: 'r040', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Edouard Chassé', categorie: 'U16 -66kg', medaille: 'or' },
  { id: 'r041', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Tristan Bourque', categorie: 'U18 -81kg', medaille: 'or' },
  { id: 'r042', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Edouard Chassé', categorie: 'U18 -66kg', medaille: 'or' },
  { id: 'r043', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Sofiane Bousbiat', categorie: 'U21 -60kg', medaille: 'or' },
  { id: 'r044', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Vincent Roberge-Poitras', categorie: 'U21 -66kg', medaille: 'or' },
  { id: 'r045', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Vincent Roberge-Poitras', categorie: 'Senior -66kg', medaille: 'or' },
  { id: 'r046', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Maika Nephtali', categorie: 'U16 -48kg', medaille: 'bronze' },
  { id: 'r047', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Tristan Lapointe', categorie: 'U18 -60kg', medaille: 'bronze' },
  { id: 'r048', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Gibril Zouaoui', categorie: 'Senior -66kg', medaille: 'bronze' },
  { id: 'r049', saison: '2023-2024', competition: "Championnats de l'Est", date: '2024-04-20', athlete: 'Sofiane Bousbiat', categorie: 'Senior -60kg', medaille: 'bronze' },

  // ─── 2022-2023 ──────────────────────────────────────────────────────────────

  // Championnats Canadiens 2023 (Montréal, 19.05.2023)
  { id: 'r050', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Mélody Grenier', categorie: 'U16 -48kg', medaille: 'or' },
  { id: 'r051', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Mélody Grenier', categorie: 'U18 -48kg', medaille: 'or' },
  { id: 'r052', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Léanne Dussault', categorie: 'U18 -52kg', medaille: 'or' },
  { id: 'r053', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Charline Bourque', categorie: 'U18 -70kg', medaille: 'or' },
  { id: 'r054', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Catherine Toshkov', categorie: 'U21 -57kg', medaille: 'or' },
  { id: 'r055', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Catherine Toshkov', categorie: 'Senior -57kg', medaille: 'or' },
  { id: 'r056', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Olivier Bry', categorie: 'Vétéran -90kg', medaille: 'or' },
  { id: 'r057', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Edouard Chassé', categorie: 'U16 -60kg', medaille: 'argent' },
  { id: 'r058', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Tristan Bourque', categorie: 'U16 -73kg', medaille: 'argent' },
  { id: 'r059', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Vincent Roberge-Poitras', categorie: 'U18 -66kg', medaille: 'argent' },
  { id: 'r060', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Samuel Brochu', categorie: 'Vétéran -100kg', medaille: 'argent' },
  { id: 'r061', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Ludovic Durrieu / Éric De Rome', categorie: 'Kata', medaille: 'argent' },
  { id: 'r062', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Léanne Dussault', categorie: 'Senior -52kg', medaille: 'bronze' },
  { id: 'r063', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Charline Bourque', categorie: 'Senior -70kg', medaille: 'bronze' },
  { id: 'r064', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Ludovic Durrieu', categorie: 'Vétéran -66kg', medaille: 'bronze' },
  { id: 'r065', saison: '2022-2023', competition: 'Championnats Canadiens', date: '2023-05-19', athlete: 'Frédéric Bourque', categorie: 'Vétéran -90kg', medaille: 'bronze' },

  // Championnats de l'Est 2023 (Edmundston, 23.04.2023)
  { id: 'r066', saison: '2022-2023', competition: "Championnats de l'Est", date: '2023-04-23', athlete: 'Edouard Chassé', categorie: 'U16 -60kg', medaille: 'or' },
  { id: 'r067', saison: '2022-2023', competition: "Championnats de l'Est", date: '2023-04-23', athlete: 'Léanne Dussault', categorie: 'U18 -52kg', medaille: 'or' },
  { id: 'r068', saison: '2022-2023', competition: "Championnats de l'Est", date: '2023-04-23', athlete: 'Méloïze Perkinson', categorie: 'Senior -63kg', medaille: 'or' },
  { id: 'r069', saison: '2022-2023', competition: "Championnats de l'Est", date: '2023-04-23', athlete: 'Léanne Dussault', categorie: 'Senior -52kg', medaille: 'argent' },
  { id: 'r070', saison: '2022-2023', competition: "Championnats de l'Est", date: '2023-04-23', athlete: 'Gerardo Andrade', categorie: 'Vétéran -100kg', medaille: 'argent' },
  { id: 'r071', saison: '2022-2023', competition: "Championnats de l'Est", date: '2023-04-23', athlete: 'Charline Bourque', categorie: 'U18 -70kg', medaille: 'bronze' },
  { id: 'r072', saison: '2022-2023', competition: "Championnats de l'Est", date: '2023-04-23', athlete: 'Méloïze Perkinson', categorie: 'U21 -63kg', medaille: 'bronze' },

  // Championnats Provinciaux 2023 (Laval, 25.03.2023)
  { id: 'r073', saison: '2022-2023', competition: 'Championnats Provinciaux', date: '2023-03-25', athlete: 'Arthur Lamego', categorie: 'U12', medaille: 'or' },
  { id: 'r074', saison: '2022-2023', competition: 'Championnats Provinciaux', date: '2023-03-25', athlete: 'Benjamin Brodeur', categorie: 'U12', medaille: 'argent' },
  { id: 'r075', saison: '2022-2023', competition: 'Championnats Provinciaux', date: '2023-03-25', athlete: 'Mathis Bilodeau', categorie: 'U12', medaille: 'argent' },
  { id: 'r076', saison: '2022-2023', competition: 'Championnats Provinciaux', date: '2023-03-25', athlete: 'Théo Calichon', categorie: 'U12', medaille: 'bronze' },
]

export function getAllResultats(): Resultat[] {
  return resultats
}

export function getSaisons(): string[] {
  return [...new Set(resultats.map(r => r.saison))].sort().reverse()
}
