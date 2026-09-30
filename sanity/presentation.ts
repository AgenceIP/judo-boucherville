import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

const select = { titre: 'titre', nom: 'nom', slug: 'slug.current', saison: 'saison' }
const page = (title: string, href: string) => ({ title, href })
const pages = (...l: { title: string; href: string }[]) => defineLocations({ locations: l })

export const resolve: PresentationPluginOptions['resolve'] = {
  // The « Utilisé sur » box above each form: one click opens the page beside it
  locations: {
    club: pages(page('Accueil', '/fr'), page('Inscription', '/fr/inscription'), page('Contact', '/fr/contact')),
    programme: defineLocations({
      select,
      resolve: d => ({ locations: d?.slug ? [page(d.titre ?? 'Programme', `/fr/programmes/${d.slug}`), page('Inscription', '/fr/inscription'), page('Accueil', '/fr')] : [] }),
    }),
    instructeur: defineLocations({
      select,
      resolve: d => ({ locations: d?.slug ? [page(d.nom ?? 'Instructeur', `/fr/equipe/${d.slug}`), page('Équipe', '/fr/equipe')] : [] }),
    }),
    athlete: defineLocations({
      select,
      resolve: d => ({ locations: [...(d?.slug ? [page(d.nom ?? 'Athlète', `/fr/athletes/${d.slug}`)] : []), page('Athlètes', '/fr/athletes')] }),
    }),
    actualite: defineLocations({ select, resolve: d => ({ locations: d?.saison ? [page(`Nouvelles ${d.saison}`, `/fr/actualites/${d.saison}`)] : [] }) }),
    resultat: defineLocations({ select, resolve: d => ({ locations: d?.saison ? [page(`Résultats ${d.saison}`, `/fr/resultats/${d.saison}`)] : [] }) }),
    evenement: pages(page('Calendrier', '/fr/calendrier')),
    journaux: pages(page('Journaux', '/fr/journaux')),
    ceintureNoire: pages(page('Ceintures noires', '/fr/ceintures-noires')),
    challenge: pages(page('Challenge', '/fr/challenge')),
    conseil: pages(page('Conseil', '/fr/conseil')),
    historique: pages(page('Historique', '/fr/historique')),
    telechargements: pages(page('Téléchargements', '/fr/telechargements')),
    photosSite: pages(page('Accueil', '/fr'), page('Programmes', '/fr/programmes')),
  },
  // Browsing the site inside Presentation opens the matching form on its own
  mainDocuments: defineDocuments([
    { route: '/fr/programmes/:slug', filter: '_type == "programme" && slug.current == $slug' },
    { route: '/fr/equipe/:slug', filter: '_type == "instructeur" && slug.current == $slug' },
    { route: '/fr/athletes/:slug', filter: '_type == "athlete" && slug.current == $slug' },
    { route: '/fr/inscription', filter: '_id == "club"' },
    { route: '/fr/contact', filter: '_id == "club"' },
    { route: '/fr/challenge', filter: '_id == "challenge"' },
    { route: '/fr/conseil', filter: '_id == "conseil"' },
    { route: '/fr/historique', filter: '_id == "historique"' },
    { route: '/fr/telechargements', filter: '_id == "telechargements"' },
  ]),
}
