# CMS Sanity : Fayçal modifie le site lui-même

Date : 2026-09-29 · Statut : validée par Yousif (priorité : la plus grande facilité d'utilisation pour Fayçal)

## But

Fayçal Bousbiat (entraîneur chef, non technique) met à jour tout le contenu du site sans passer par Yousif :
horaires, tarifs, programmes, calendrier, athlètes, résultats, nouvelles, journaux, instructeurs, ceintures noires,
Challenge, conseil, historique, téléchargements et photos.

**Réussi quand :** Fayçal se connecte avec son compte Google ou son courriel, change une fiche dans une interface
en français, clique « Publier », et le site en ligne affiche le changement en moins d'une minute, sans redéploiement
et sans pouvoir casser la mise en page. Prix et horaires restent du texte libre, comme aujourd'hui (« 65 $ / mois », « Sam 09h00–10h00 »).

## Hors périmètre

- Les libellés d'interface (boutons, menus, titres fixes) restent dans le code.
- Le design : motifs, kanji, logos, couleurs, polices.
- Le formulaire de contact, les redirections de l'ancien site (`next.config.ts`), les métadonnées SEO.
- La traduction automatique : Fayçal remplit les champs FR et EN comme aujourd'hui (champs EN optionnels là où ils le sont déjà).

## Architecture

- **Projet Sanity** créé via le Vercel Marketplace (`sanity/project`, plan gratuit : 20 utilisateurs, 10 000 documents,
  100 Go de fichiers). Les variables d'environnement arrivent dans Vercel par l'intégration, puis `vercel env pull`.
  Étape manuelle : Yousif se connecte une fois à Vercel dans le navigateur (`vercel login`, `vercel link`).
- **Studio** intégré au site sur `/studio` (`app/studio/[[...tool]]`, hors de `[locale]`, avec son propre layout,
  `noindex`). `proxy.ts` exclut déjà `studio`. Interface en français (`@sanity/locale-fr-fr`), libellés des champs en français.
- **Accès** : Yousif et Fayçal sont administrateurs (le plan gratuit n'a que les rôles administrateur et lecteur).
  Le dataset est public, ce qui ne change rien : tout le contenu est déjà public sur le site.
- **Lecture** : `next-sanity` avec `defineLive` (Live Content API). Les pages appellent `sanityFetch` ; `<SanityLive />`
  dans le layout revalide les pages dès qu'une fiche est publiée. Pas de webhook à configurer.
  L'aperçu des brouillons (outil Presentation) passe par `draftMode` et un jeton de lecture serveur
  (`SANITY_API_READ_TOKEN`, rôle lecteur), jamais exposé au navigateur.
- **Images** : téléversées dans Sanity, servies par `cdn.sanity.io` (ajouté à `images.remotePatterns`).
  Les requêtes GROQ renvoient la même forme qu'aujourd'hui, `{ src, w, h }`, pour que les composants ne changent pas.

## Modèle de contenu

Chaque type reprend le type TypeScript actuel. Les requêtes renvoient ces types, donc le code des pages change
à l'endroit de l'import, pas dans le rendu. Trois exceptions, choisies pour la simplicité d'édition :
les athlètes, les nouvelles et les résultats (voir sous le tableau).

| Type Sanity | Source actuelle | Forme |
|---|---|---|
| `club` (unique) | `data/club.ts` | infos, réseaux, `inscription` (saison, formulaire, QR, débuts des cours, notes), `palmares` |
| `programme` | `data/programmes.ts` | un document par programme ; groupes, tarifs, colonnes, notes, documents, contacts ; instructeurs = nom + grade + référence optionnelle à `instructeur` |
| `instructeur` | `data/instructeurs.ts` | photo (image), grade, PNCE, disciplines, rôle, bio FR/EN, compétitions |
| `evenement` | `data/evenements.ts` | date de début, date de fin optionnelle, titre, lieu, lien ; regroupés par mois dans la requête. Le lien du répertoire Judo Québec va dans `club` |
| `ceintureNoire` | `data/ceintures-noires.ts` | une fiche par année : année + noms |
| `challenge` (unique) | `data/challenge.ts` | édition, date, pays, formulaire, PDF, coûts, bourses, limites, commanditaires, divisions, palmarès |
| `athlete` | `data/archive/athletes.json` | une fiche par nom (les 93) : nom, **équipes** (cases à cocher parmi les 13), photos, profil détaillé optionnel (personnes, saisons, résultats) |
| `actualite`, `resultat` | `actualites.json`, `resultats.json` | une fiche par nouvelle ou par compétition : saison, date affichée, lieu, titre, contenu (éditeur de texte) |
| `journaux` | `journaux.json` | une fiche par période ; numéros = titre, vignette (image), PDF (lien) |
| `conseil` (unique) | `app/[locale]/conseil/page.tsx` | membres, anciens présidents |
| `historique` (unique) | `app/[locale]/historique/page.tsx` | ligne du temps, participations internationales, photos de l'ancien dojo et de l'inauguration |
| `telechargements` (unique) | `app/[locale]/telechargements/page.tsx` | groupes de documents ; chaque document = titre + fichier téléversé ou lien |
| `photosSite` (unique) | `components/home/*`, `PageHero.tsx` | les photos d'ambiance nommées (mur du club, tatami, Kano, ceintures noires, hauts gradés, entrée, valeurs) |

**Athlètes :** chaque nom devient une fiche, avec ou sans profil. Ajouter un athlète = créer une fiche et cocher
ses équipes. Changer d'équipe = cocher ou décocher. Les listes d'équipe sont triées par ordre alphabétique.
La page de profil n'existe que si la fiche a des photos ou un profil détaillé, comme aujourd'hui les noms sans lien.

**Nouvelles et résultats :** une fiche par entrée, comme un article de blogue (« Ajouter une nouvelle »), au lieu
d'une longue liste par saison. Le contenu utilise l'éditeur de texte de Sanity (Portable Text) : titres, gras,
liens, photos glissées dans le texte, un bouton « Médaille » (or, argent, bronze) qui insère l'icône dans la ligne,
et un bloc « Bilan de médailles ». La migration convertit les blocs actuels (`h`, `p`, `a`, `img`, `m`) et les
jetons ⟨or⟩ ⟨argent⟩ ⟨bronze⟩. `components/archive/Blocks.tsx` devient un rendu Portable Text, et `medailles()`
compte les médailles insérées. La saison proposée par défaut est la saison en cours. Un champ caché `tri` garde
l'ordre actuel ; une nouvelle fiche passe en tête de sa saison.

**Validation** (pour ne pas casser la mise en page) : champs obligatoires là où le type TS n'est pas optionnel,
slugs générés depuis le nom et uniques, photos obligatoires avec texte alternatif sur `photosSite`.
Les horaires et les clientèles des groupes passent par les mêmes fonctions que le site (`lib/schedule.ts`) :
un horaire que la grille de la semaine ne sait pas lire affiche un avertissement avec un exemple
(« Samedi 09h00 à 10h00 »), au lieu de disparaître en silence de l'horaire.

## Expérience d'édition

Objectif : Fayçal trouve et change n'importe quoi sans aide, depuis un ordinateur ou son téléphone.

- **Modifier en cliquant sur le site** : l'outil Presentation de Sanity affiche le site à côté du formulaire.
  Fayçal clique sur un texte ou une photo du site et le bon champ s'ouvre. Il voit ses changements sur la page
  avant de publier (brouillons affichés en mode aperçu, `draftMode` de Next.js).
- **Menu calqué sur le site**, en français, dans l'ordre du site : Club et inscription, Programmes (horaires et
  tarifs), Calendrier, Instructeurs, Athlètes (avec un sous-menu par équipe), Nouvelles, Résultats, Journaux,
  Ceintures noires, Challenge, Conseil, Historique, Téléchargements, Photos du site. Les fiches uniques
  (Club, Challenge, Conseil, etc.) s'ouvrent directement, sans liste, et ne peuvent être ni supprimées ni dupliquées.
- **Aide intégrée** : une page « Comment faire » en tête du menu, en français, avec des captures : modifier un
  horaire ou un tarif, ajouter une nouvelle, ajouter un athlète, changer une photo, annuler une erreur.
- **Chaque champ** a un libellé simple et une ligne d'aide avec un exemple réel tiré du site. Aucun champ
  technique n'est visible : identifiants, slugs (générés automatiquement), ordre de tri.
- **Formulaires longs en onglets** : programme (Présentation, Groupes et horaires, Tarifs, Instructeurs et
  contacts, Documents) et athlète (Équipes et photos, Profil).
- **Listes lisibles** : chaque fiche montre une vignette, son nom et un sous-titre utile (équipes d'un athlète,
  date et lieu d'une nouvelle, horaire court d'un programme). Recherche en haut de chaque liste.
- **Valeurs par défaut** : une nouvelle fiche arrive préremplie (saison en cours, colonnes de tarif habituelles,
  lieu « Boucherville » pour un événement).
- **Photos et PDF** : glisser-déposer, recadrage avec point focal, compression automatique par Sanity.
- **Sans risque** : brouillon enregistré en continu, bouton « Publier » explicite, historique des versions avec
  « Restaurer », confirmation avant toute suppression.

## Flux des données

1. Fayçal publie une fiche dans `/studio`.
2. La Live Content API signale le changement ; `<SanityLive />` revalide les pages concernées.
3. Le visiteur suivant reçoit la page à jour.

**Composants client** (`ClassFinder`, `WeekSchedule`, `Footer`, `Navigation`) : ils importent aujourd'hui `data/`
directement. Ils reçoivent désormais leurs données en props depuis un parent serveur (layout ou page),
qui fait la requête.

**Pages dynamiques** (`programmes/[slug]`, `athletes/[slug]`, `equipe/[slug]`, `actualites/[saison]`,
`resultats/[saison]`) : `generateStaticParams` lit les slugs dans Sanity ; un nouveau slug est rendu à la
première visite (`dynamicParams` par défaut).

## Migration

Un script unique, `scripts/migrate-to-sanity.ts` (exécuté avec Node 24, qui lit le TypeScript nativement) :

1. lit `data/*.ts`, `data/archive/*.json` et les données en ligne des pages conseil, historique et téléchargements ;
2. téléverse chaque image locale référencée dans Sanity (une seule fois par fichier) et remplace le chemin par la référence ;
3. écrit les documents avec des `_id` déterministes (`createOrReplace`), donc le script peut être relancé sans doublons ;
4. utilise un jeton d'écriture `SANITY_API_WRITE_TOKEN` (local seulement, jamais dans Vercel).

Après la bascule : suppression de `data/`, de `scripts/import-legacy.mjs` et `scripts/extract-legacy.mjs`
(l'ancien site est entièrement importé), et des images migrées dans `public/` (on garde `motifs/`, `brand/`, `Logos/`).

## Erreurs

- **Sanity indisponible au moment d'un build** : le build échoue et Vercel garde le déploiement précédent en ligne.
- **Sanity indisponible en production** : les pages déjà en cache restent servies ; aucune page ne s'affiche vide.
- **Fiche incomplète** : la validation du Studio bloque la publication et explique le champ manquant, en français.
- **Erreur de Fayçal** : l'historique des versions de Sanity permet de revenir à une version précédente d'une fiche.

## Vérification

- **Avant la migration** : un script enregistre le texte visible de chaque page FR et EN (toutes les routes, y compris
  chaque slug) depuis le serveur local.
- **Après la migration** : le même script compare ; toute différence de texte est une erreur de migration, sauf
  l'ordre des listes d'équipe (désormais alphabétique), comparé comme un ensemble de noms.
- Les 26 tests vitest passent ; `tsc` passe avec les types générés par `sanity typegen`.
- Playwright (Edge) : `/studio` se charge, une modification publiée apparaît sur la page correspondante.
- Build de production local, puis déploiement de preview sur `redesign-tatami`. La production attend l'accord de Yousif.

## Livraison à Fayçal

- Invitation au projet Sanity comme administrateur.
- La page « Comment faire » du Studio, vérifiée en faisant soi-même chaque tâche décrite.
- Test réel avant d'inviter Fayçal : Yousif fait les cinq tâches de l'aide sur le Studio de preview, sans explication.
