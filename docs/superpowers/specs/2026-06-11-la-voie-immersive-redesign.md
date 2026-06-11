# « La Voie » — Refonte immersive du site du Club de Judo Boucherville

**Date :** 2026-06-11
**Statut :** Approuvé par délégation (« je te fais confiance mais surprends-moi »)

## Le concept

Au judo, tout pratiquant parcourt le même chemin : de la ceinture blanche à la ceinture
noire. La page d'accueil **devient ce chemin**. On entre dans un monde blanc papier
(la ceinture blanche, le premier salut) et chaque chapitre assombrit l'écran — littéralement,
la couleur de fond et de l'encre sont interpolées au scroll — jusqu'au noir profond de la
maîtrise. Le judo n'est pas illustré : il est **joué par le visiteur**.

Trois mécaniques « jamais vues » :

1. **L'arc de luminance** — le site entier passe du blanc au noir au fil du scroll.
   Un conducteur GSAP interpole des variables CSS (`--voie-bg`, `--voie-ink`) sur des
   stops par chapitre. La navigation s'adapte en direct (encre noire sur papier, blanche
   sur noir).
2. **La projection scrubbée** — un chapitre épinglé (300 vh) où le scroll fait avancer
   image par image la vidéo d'une projection de judo, annotée par les trois phases
   réelles d'une technique : *kuzushi* (déséquilibre), *tsukuri* (placement),
   *kake* (projection). Le visiteur exécute la projection avec sa molette.
3. **Le rail de ceinture** — l'indicateur de progression vertical est une ceinture qui
   change de couleur selon le chapitre : blanche → jaune → orange → verte → bleue
   (= le bleu royal du club) → marron → noire. Le scroll est gradé.

Plus le rituel d'entrée : écran noir, le kanji 礼 (*rei*, le salut) s'encre à l'écran
— « Tout commence par un salut. » — puis un iris s'ouvre sur le monde blanc.
Une fois par session, interruptible au clic/scroll, sauté si `prefers-reduced-motion`.

## Les chapitres (page d'accueil)

| # | Chapitre | Fond → encre | Contenu |
|---|----------|--------------|---------|
| 1 | **Blanche** — Tout le monde commence ici | papier `#F6F3EC` / encre `#111` | Titre géant, kanji fantôme 始, CTA inscription |
| 2 | **L'école** | papier chaud | Programmes avec filtres (repris, re-skinnés clair) |
| 3 | **La force** | crépuscule `#343B49` (bascule de l'encre) | Stats animées (174 médailles, 55 ans, 2 olympiens, 245 membres) |
| 4 | **La projection** | quasi-noir | Vidéo épinglée scrubbée + phases kuzushi/tsukuri/kake |
| 5 | **Noire** — L'héritage | noir `#0A0A0A` | 55 ans, chronologie condensée, médailles, lien équipe |
| 6 | **Le tatami** (finale) | noir | CTA « Monte sur le tatami », countdown Challenge |

Les pages internes restent dans le monde sombre (cohérent : on y arrive « en fin de
voie ») et héritent du nouveau corps de texte serif, du curseur et du chrome adaptatif.

## Direction typographique

- **Display :** Bebas Neue (identité conservée, impact maximal)
- **Corps :** Source Serif 4 (remplace Inter — voix éditoriale, papier & encre)
- **Kanji :** pile système CJK (`Hiragino Mincho ProN, Yu Mincho, Noto Serif JP, serif`)
  — deux glyphes décoratifs, zéro octet téléchargé

## Interactions globales

- **Curseur personnalisé** (desktop, `pointer: fine` seulement) : anneau + point,
  suit avec inertie, s'agrandit sur les liens, étiquette « glisser » sur le chapitre scrubbé.
- **Skew de vélocité** : les titres de chapitre s'inclinent subtilement selon la vitesse
  de scroll (la « souplesse » répond à la force du visiteur).
- **Drag-to-scrub** : sur le chapitre épinglé, glisser horizontalement pilote la
  projection (mappé sur la position de scroll Lenis).

## Architecture

```
components/voie/
  EntryRitual.tsx      — overlay rituel (sessionStorage, skippable)
  VoieConductor.tsx    — interpolation des CSS vars au scroll (un seul writer rAF)
  BeltRail.tsx         — rail de progression ceinture (fixed, homepage seulement)
  ChapterBlanc.tsx     — ch.1
  ChapterEcole.tsx     — ch.2 (réutilise les clés i18n home.programmes_*)
  ChapterForce.tsx     — ch.3 (réutilise AnimatedCounter)
  ChapterProjection.tsx— ch.4 (pin + scrub vidéo + captions)
  ChapterNoir.tsx      — ch.5
  ChapterFinale.tsx    — ch.6 (réutilise CountdownTimer)
components/ui/CustomCursor.tsx — monté dans le layout
```

- `app/[locale]/page.tsx` : réécrit pour assembler les chapitres.
- `Navigation.tsx` : couleurs → `var(--chrome-ink)` / `var(--chrome-bg)` ;
  valeurs par défaut = look sombre actuel (pages internes inchangées).
- `components/home/*` : supprimés après vérification des usages
  (le contenu vit désormais dans les chapitres).
- Vidéo : `public/videos/hero.mp4` (12 s), plus de scrub pleine-page — uniquement
  dans le chapitre épinglé.

## Performance & accessibilité

- Aucune dépendance 3D : le WOW vient du concept et de la chorégraphie
  (GSAP + Lenis + Framer Motion déjà en place). Budget JS quasi inchangé.
- `prefers-reduced-motion` : rituel sauté, curseur désactivé, thèmes par chapitre
  appliqués sans interpolation, vidéo non scrubbée (frame statique).
- Mobile : pas de curseur, pin + scrub fonctionnent au scroll natif, arc de
  luminance intégral.
- Seek vidéo throttlé (delta > 0.02 s) comme l'implémentation actuelle.

## Vérification

- Build + tests existants (21) doivent passer.
- Scénario Playwright : rituel d'entrée → monde blanc → interpolation à mi-page →
  chapitre scrubbé (currentTime progresse pendant le pin) → finale noire →
  rail de ceinture visible → page interne intacte (sombre, nav lisible).

## Hors scope (suites possibles)

- Génération d'assets Higgsfield (séquence de projection sur mesure, textures sumi-e)
- Design sonore opt-in
- Re-skin clair des pages internes
