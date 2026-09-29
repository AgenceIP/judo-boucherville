# CMS Sanity : Fayçal modifie le site lui-même

Date : 2026-09-29 · Statut : à valider

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
- **Images** : téléversées dans Sanity, servies par `cdn.sanity.io` (ajouté à `images.remotePatterns`).
  Les requêtes GROQ renvoient la même forme qu'aujourd'hui, `{ src, w, h }`, pour que les composants ne changent pas.

## Modèle de contenu

Chaque type reprend le type TypeScript actuel, champ pour champ. Les requêtes renvoient exactement ces types,
donc le code des pages change à l'endroit de l'import, pas dans le rendu.

| Type Sanity | Source actuelle | Forme |
|---|---|---|
| `club` (unique) | `data/club.ts` | infos, réseaux, `inscription` (saison, formulaire, QR, débuts des cours, notes), `palmares` |
| `programme` | `data/programmes.ts` | un document par programme ; groupes, tarifs, colonnes, notes, documents, contacts ; instructeurs = nom + grade + référence optionnelle à `instructeur` |
| `instructeur` | `data/instructeurs.ts` | photo (image), grade, PNCE, disciplines, rôle, bio FR/EN, compétitions |
| `evenement` | `data/evenements.ts` | date de début, date de fin optionnelle, titre, lieu, lien ; regroupés par mois dans la requête. Le lien du répertoire Judo Québec va dans `club` |
| `ceintureNoire` | `data/ceintures-noires.ts` | une fiche par année : année + noms |
| `challenge` (unique) | `data/challenge.ts` | édition, date, pays, formulaire, PDF, coûts, bourses, limites, commanditaires, divisions, palmarès |
| `athlete` | `data/archive/athletes.json` | nom, slug, photos, personnes (naissance, grade, faits, objectifs, saisons et résultats) |
| `equipes` (unique) | `athletes.json` → `equipes` | 13 équipes ordonnées ; chaque entrée = nom + référence optionnelle à un `athlete` |
| `saisonActualites`, `saisonResultats` | `actualites.json`, `resultats.json` | une fiche par saison ; entrées ordonnées (date, lieu, titre, blocs) |
| `journaux` | `journaux.json` | une fiche par période ; numéros = titre, vignette (image), PDF (lien) |
| `conseil` (unique) | `app/[locale]/conseil/page.tsx` | membres, anciens présidents |
| `historique` (unique) | `app/[locale]/historique/page.tsx` | ligne du temps, participations internationales, photos de l'ancien dojo et de l'inauguration |
| `telechargements` (unique) | `app/[locale]/telechargements/page.tsx` | groupes de documents ; chaque document = titre + fichier téléversé ou lien |
| `photosSite` (unique) | `components/home/*`, `PageHero.tsx` | les photos d'ambiance nommées (mur du club, tatami, Kano, ceintures noires, hauts gradés, entrée, valeurs) |

**Blocs des actualités et résultats :** on garde les cinq types actuels comme objets Sanity, pour que
`components/archive` ne change pas : « Titre » (`h`), « Paragraphe » (`p`), « Photo » (`img`), « Lien » (`a`),
« Bilan de médailles » (`m`). Dans le Studio, Fayçal ajoute et réordonne ces blocs par glisser-déposer.

**Validation** (pour ne pas casser la mise en page) : champs obligatoires là où le type TS n'est pas optionnel,
slugs générés depuis le nom et uniques, photos obligatoires avec texte alternatif sur `photosSite`.

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
- **Après la migration** : le même script compare ; toute différence de texte est une erreur de migration.
- Les 26 tests vitest passent ; `tsc` passe avec les types générés par `sanity typegen`.
- Playwright (Edge) : `/studio` se charge, une modification publiée apparaît sur la page correspondante.
- Build de production local, puis déploiement de preview sur `redesign-tatami`. La production attend l'accord de Yousif.

## Livraison à Fayçal

- Invitation au projet Sanity comme administrateur.
- Une page d'aide courte en français (captures d'écran) : se connecter, modifier un horaire, ajouter une nouvelle,
  ajouter un athlète, changer une photo.
