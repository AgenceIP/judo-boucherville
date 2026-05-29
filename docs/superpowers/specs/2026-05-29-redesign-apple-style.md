# Redesign Apple-Style — Judo Boucherville

**Date:** 2026-05-29  
**Statut:** Approuvé — prêt pour implémentation

---

## Objectif

Refaire entièrement le visuel du site avec une esthétique premium "Apple-style" : fond noir profond, typographie massive, animations de scroll soignées, vidéo cinématique générée par Higgsfield.

---

## Design System (inchangé sauf ajouts)

| Token | Valeur |
|---|---|
| `--bg` | `#0A0A0A` |
| `--surface` | `#141414` |
| `--gold` | `#C9A227` |
| `--glow` | `#E8B830` |
| `--white` | `#FAFAFA` |
| `--muted` | `#777777` |
| Font heading | Bebas Neue |
| Font body | Inter |

**Ajouts globals.css :**
- Variable `--nav-blur` pour la transition navbar
- Utilitaire `.text-balance` pour les gros titres

---

## Stack d'animation

| Outil | Usage |
|---|---|
| GSAP ScrollTrigger | Hero pin/scrub, section reveals |
| Framer Motion | Page transitions, filter cards, stagger entrances |
| CSS transition | Nav background blur au scroll |
| IntersectionObserver | Fallback reveals inner pages |

---

## Navigation

- `position: fixed`, pleine largeur
- Au load : `background: transparent`
- Au scroll (>80px) : `background: rgba(0,0,0,0.85)` + `backdrop-filter: blur(20px)`
- Framer Motion : fade-in à l'entrée de page (opacity 0→1, y: -8→0)
- Logo : "Judo **Boucherville**" — mot "Boucherville" en gold
- Liens : Programmes · Équipe · Challenge · Actualités · Contact · FR/EN
- CTA bouton "S'inscrire" gold pill à droite
- Mobile : hamburger menu

---

## Page d'accueil — 9 sections

### 1. HeroSection — Scrub vidéo épinglé (Concept B)

**Comportement :**
- Conteneur parent `height: 400vh`
- Enfant `position: sticky; top: 0; height: 100vh`
- Vidéo `<video>` couvre tout l'écran (`object-fit: cover`)
- Overlay gradient `rgba(0,0,0,0.4)` sur la vidéo
- Au scroll : `video.currentTime` = `progress × video.duration`
- 3 chapitres déclenchés par seuils de progression (0–33%, 33–66%, 66–100%)

**Chapitres :**
| # | Eyebrow | Titre | Description |
|---|---|---|---|
| 1 | 01/03 · L'excellence | JUDO BOUCHERVILLE | 55 ans de tradition martiale. La technique parfaite naît de la répétition. |
| 2 | 02/03 · La maîtrise | LA PRISE PARFAITE | Chaque projection — le fruit de milliers d'heures sous la direction de champions 7e dan. |
| 3 | 03/03 · Ta place | REJOINS LE CLUB | Débutant ou compétiteur. Enfant ou adulte. Le judo de Boucherville t'attend. |

**UI :**
- Barre de progression gold 2px en haut de page (width = scroll progress %)
- Indicateur chapitres : 3 dots verticaux à droite (dot actif = gold allongé)
- Titre : Bebas Neue, `clamp(64px, 12vw, 140px)`, line-height 0.88
- Transitions chapitres : `opacity 0→1` sur 0.5s, `transform translateY(10px→0)`
- CTA visible au chapitre 3 uniquement

**Vidéo :**
- Générée avec Higgsfield Cinema Studio 3.0 (ou Seedance 2.0 si CS3 indisponible)
- 12s, 1080p, 16:9, sans audio
- Prompt : voir section Actifs Visuels
- Chargement : `preload="auto"`, `muted`, `playsinline`
- Fallback : image statique `public/images/scraped/Challenge_carou7.jpg`

---

### 2. StatsSection

- 3 stats : **55** Années · **400+** Membres · **6** Disciplines
- Compteurs animés (0 → valeur finale) déclenchés par IntersectionObserver
- Séparateurs verticaux `1px solid rgba(255,255,255,0.06)`
- Reveal : `opacity 0→1` + `translateY(40px→0)` en stagger (0.15s entre chaque)

---

### 3. ProgrammesSection

- Titre section + filtres (Tous / Jeunes / Adultes / Arts martiaux)
- Grille de cards : 3 colonnes desktop, 2 tablette, 1 mobile
- Filtre : Framer Motion `AnimatePresence` + `layout` pour transition fluide
- Cards : reveal en stagger au scroll
- Hover card : border gold + légère élévation

---

### 4. ClubSection

- Layout : 2 colonnes — image à gauche (photo du dojo/compétition), texte à droite
- Texte : titre large + paragraphe + liste bullet points (valeurs du club)
- Animation : image slide depuis la gauche, texte slide depuis la droite au scroll

---

### 5. TeamSection

- Grille 4 colonnes : 4 instructeurs (flip cards 3D existantes conservées)
- Stagger reveal au scroll (0.1s entre chaque carte)
- Bouton "Voir toute l'équipe" centré

---

### 6. AchievementsSection

- Titre + grille de médailles/réalisations
- Animation : entrée en stagger, icônes médailles avec scale bounce

---

### 7. ChallengeSection

- Fond : dégradé très subtil `#0a0500 → #0d0d0d` + bordure gold 1px
- Titre "CHALLENGE BOUCHERVILLE" + édition
- Countdown live (composant existant conservé)
- CTA vers page challenge
- Reveal : fade-in depuis le bas

---

### 8. NewsSection

- Retourne `null` si aucune actualité (comportement actuel conservé)
- Quand peuplée : grille 3 cards, reveal stagger

---

### 9. CtaSection

- Pleine largeur, fond noir avec texture noise amplifiée
- Titre massif : "PRÊT À COMMENCER ?" ou équivalent i18n
- Deux boutons : S'inscrire (gold) + Nous contacter (outline)
- Animation : reveal cinématique depuis le bas

---

## Pages intérieures

Toutes les pages intérieures suivent le même pattern :

### PageHero (composant partagé)
- Fond : noir avec image de fond en overlay léger si disponible
- Effet parallax : `background-position` change légèrement au scroll (CSS `background-attachment: fixed` ou GSAP)
- Titre Bebas Neue `clamp(56px, 10vw, 120px)`
- Subtitle + tag optionnels

### Sections de contenu
- Chaque bloc de contenu : `opacity 0 → 1` + `translateY(30px → 0)` via IntersectionObserver
- Seuil : `threshold: 0.15`

### Transitions de page
- Framer Motion existant (`PageTransition`) conservé et bonifié si nécessaire

---

## Actifs visuels — Higgsfield

**Vidéo hero principale :**
```
Modèle : Cinema Studio Video 3.0 (ou Seedance 2.0)
Durée : 12s
Résolution : 1080p
Ratio : 16:9
Prompt : "Cinematic ultra slow-motion judo match, two judokas in white gis, 
powerful ippon throw in dramatic arena lighting, dark background, 
red tatami mat, photorealistic, 4K film grain, no CGI, 
shot on ARRI Alexa, high contrast, breathtaking"
```

La vidéo déjà générée (`hf_20260529_055019`) peut servir de placeholder pendant le dev.

---

## Ordre d'implémentation

1. **Vidéo** — Regénérer avec Cinema Studio 3.0
2. **globals.css** — Utilitaires supplémentaires
3. **Navigation** — Redesign complet
4. **HeroSection** — Scrub vidéo + 3 chapitres (section la plus complexe)
5. **StatsSection** — Compteurs animés
6. **ProgrammesSection** — Redesign cards + animations
7. **ClubSection** — Layout 2 colonnes animé
8. **TeamSection** — Stagger reveal
9. **AchievementsSection** — Redesign + animations
10. **ChallengeSection** — Redesign atmosphérique
11. **NewsSection** — Redesign cards
12. **CtaSection** — Redesign pleine largeur
13. **PageHero** (partagé) — Parallax
14. **Pages intérieures** — Reveals IntersectionObserver

---

## Contraintes techniques

- Next.js 16 App Router — certains composants doivent être `'use client'` pour GSAP/scroll
- `HeroSection` : `'use client'` avec `useEffect` pour ScrollTrigger (pattern existant)
- Éviter `import gsap` dans les Server Components
- `useGSAP` hook de `@gsap/react` pour cleanup automatique
- Video `preload="auto"` pour que le scrub soit fluide dès l'arrivée
