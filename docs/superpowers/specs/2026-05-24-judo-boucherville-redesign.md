# Judo Boucherville — Redesign Spec
**Date :** 2026-05-24  
**Statut :** Approuvé

---

## 1. Contexte

Refonte complète du site web du Club de Judo Boucherville (https://www.judoboucherville.com/).  
Le site actuel est un site PHP statique vieillissant (conçu par Guillaume Perrault). L'objectif est de créer une version moderne, esthétique, animée, et facile à maintenir pour le club, tout en conservant **tout** le contenu existant.

---

## 2. Stack Technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styles | Tailwind CSS v4 |
| Animations | GSAP + ScrollTrigger, Framer Motion |
| CMS | Sanity v3 (Studio headless) |
| i18n | next-intl (FR/EN bilingue) |
| Hébergement | À décider (Vercel recommandé) |
| Fonts | Bebas Neue (headings) + Inter (body) |

---

## 3. Design System

### Palette de couleurs
```
--bg-base:      #080C18   (bleu nuit très profond — fond principal)
--bg-surface:   #0F1628   (cards, sections)
--accent-blue:  #1E6FFF   (CTA, highlights, liens actifs)
--accent-glow:  #3D8BFF   (hover states, effets lumineux)
--white:        #F0F4FF   (texte principal)
--muted:        #6B7A99   (texte secondaire)
--gold:         #C9A84C   (médailles, réalisations, ceintures)
```
> Palette ajustable — les variables CSS sont centralisées dans `globals.css`.

### Typographie
- **Headings :** Bebas Neue (impact, sport, lisibilité à grande taille)
- **Body :** Inter (lisibilité optimale)

### Effets visuels
- Grain/noise texture subtil sur sections sombres
- Glow bleu électrique sur éléments interactifs
- Gradient overlays sur vidéo hero
- Glassmorphism léger sur cards en hover

---

## 4. Internationalisation

- Bilingue **FR/EN**
- next-intl avec fichiers de traduction JSON par langue
- Switcher FR/EN dans la navigation
- Route structure : `/fr/...` et `/en/...` (ou locale détectée automatiquement)
- Tout le contenu dynamique (Sanity) supporte les deux langues via les champs localisés

---

## 5. CMS — Sanity v3

Le club doit pouvoir mettre à jour le contenu sans toucher au code.

**Schémas Sanity :**
- `programme` — nom, description, horaires, tarif, instructeurs, catégorie
- `instructeur` — nom, photo, grade (dan), bio, disciplines, compétitions notables
- `resultat` — saison, compétition, athlète, catégorie, médaille (or/argent/bronze)
- `actualite` — titre, date, contenu riche, image
- `president` — nom, période, photo, bio
- `tournoi` — nom, date, lieu, catégories, prix, règlements
- `pageContent` — pour les textes des pages statiques (historique, inscription, etc.)

**Studio Sanity :** interface simple, champs bien nommés en français, accessible à l'équipe du club.

---

## 6. Structure des Pages

### Routes

```
/                              Homepage
/historique                    Histoire du club + présidents
/equipe                        Tous les instructeurs
/equipe/[slug]                 Page individuelle instructeur
/programmes                    Vue d'ensemble de tous les programmes
/programmes/judo-competition   Judo compétition (AAA)
/programmes/judo-enfants       Judo enfants débutants
/programmes/judo-adultes       Judo adulte débutant/avancé
/programmes/parents-enfants    Cours parents/enfants
/programmes/sport-etudes       Programme sport-études (De Mortagne)
/programmes/judo-aines         Judo aînés
/programmes/aiki-jujitsu       Aiki Ju-Jitsu
/programmes/jiu-jitsu-bresilien  Jiu-Jitsu Brésilien (BJJ)
/programmes/autodéfense        Auto-défense
/programmes/kata               Cours de kata
/programmes/camp-de-jour       Camp de jour
/programmes/judo-scolaire      Judo scolaire / parascolaire
/inscription                   Informations et inscription
/resultats                     Résultats de compétitions (toutes saisons)
/challenge                     Tournoi Challenge Judo Boucherville
/actualites                    Actualités / nouvelles
/contact                       Contact + carte + formulaire
```

> Toutes les routes sont préfixées par la locale : `/fr/historique`, `/en/history`, etc.

---

## 7. Homepage — Détail des Sections

### 7.1 Hero (fullscreen vidéo)
- Vidéo Higgsfield en loop, fullscreen, muted, autoplay
- Overlay : gradient `#080C18` (40% opacity bas → 80% haut)
- Titre animé lettre par lettre (GSAP SplitText) : **"CLUB DE JUDO BOUCHERVILLE"**
- Sous-titre : *"Fondé en 1970 · Club reconnu AAA · 245 membres"*
- CTAs : "Découvrir nos programmes" (accent-blue) + "S'inscrire" (outline)
- Fallback : image statique si vidéo non chargée
- Scroll indicator : chevron animé (CSS bounce)

### 7.2 Stats animées
- 4 compteurs GSAP déclenchés au scroll :
  - `55+` ans d'histoire
  - `245` membres actifs
  - `37` médailles d'or provinciales
  - `AAA` — niveau Judo Québec

### 7.3 Programmes (grid filtrable)
- 9 cards (icon + titre + description courte + horaire + CTA)
- Filtre : Enfants / Adultes / Arts martiaux
- Hover : glow bleu + slide-up infos supplémentaires
- Animation d'entrée : stagger au scroll

### 7.4 Le Club (split section)
- Gauche : texte historique condensé + timeline interactive (1970 → 2017 → aujourd'hui)
- Droite : photo/vidéo Dojo Marcel Bourelly
- Animation : parallax sur l'image

### 7.5 Équipe
- Cards instructeurs (photo + nom + grade + discipline)
- Hover : flip card → bio courte
- CTA vers `/equipe`

### 7.6 Réalisations
- Fond or/dark
- Compteurs de médailles (37 or, 23 argent, 24 bronze — provinciaux U15-U16)
- Mentions : Kata World Championship, Sport-études, Championnats canadiens

### 7.7 Tournoi Challenge (section promo)
- Countdown live vers l'édition prochaine
- Date, lieu, catégories, montants des prix
- CTA vers `/challenge`

### 7.8 Actualités
- 3 derniers articles depuis Sanity
- Cards avec image, titre, date, extrait

### 7.9 Inscription CTA
- Section plein écran, fort appel à l'action
- Lien vers `/inscription`

### 7.10 Footer
- Adresse : 490 chemin du Lac, Boucherville (Québec) J4B 6X3
- Tél : (450) 655-1888
- Email : info@judoboucherville.com
- Réseaux : Facebook, Instagram (@judoboucherville), TikTok, YouTube, Twitter (@BouchervilleJ)
- Liens rapides, horaires condensés
- Google Maps embedded

---

## 8. Pages Intérieures — Templates

### Template Programme
- Hero : titre + tag catégorie
- Description complète du cours
- Tableau horaires (jours / heures / lieu)
- Card(s) instructeur(s)
- CTA inscription
- Programmes similaires (3 suggestions)

### Template Instructeur (`/equipe/[slug]`)
- Grande photo
- Nom, grade, disciplines
- Bio complète
- Compétitions notables
- Lien retour vers `/equipe`

### Page Historique
- Timeline verticale scrollable (GSAP ScrollTrigger)
- Jalons : 1970 (fondation), 1974 (fermeture Kowakan), 1979 (incorporation), 2001 (Fayçal head coach), 2004 (directeur technique), 2008 (CRD), 2015 (Centre multifonctionnel), 2017 (Dojo Marcel Bourelly), aujourd'hui
- Section Fondateur : Marcel Bourelly (7e dan, Temple de la renommée Judo Québec)
- Section Présidents : liste complète avec photos et périodes

### Page Résultats
- Filtre par saison (dropdown Sanity)
- Filtre par compétition
- Cards médailles (or/argent/bronze avec couleurs)
- Triables par athlète

### Page Challenge
- Hero avec countdown live
- Détails complets (catégories : U14, U16, U18, U21-Senior, Veteran-Ne Waza)
- Prix : 1 000 $ (division), 800 $ (masters), 1 200 $ (seniors)
- Lieu : Dojo Marcel Bourelly, 490 chemin du Lac
- Contact : Olivier Bry — info@judoboucherville.com
- Éditions précédentes

### Page Inscription
- Étapes visuelles : 1. Choisir programme → 2. Infos → 3. Payer
- Tableau des tarifs par programme (depuis Sanity)
- Lien Google Form (existant) ou formulaire intégré futur
- Programme Accès-Loisirs mentionné
- FAQ accordéon (questions fréquentes)

---

## 9. Animations — Spécification

### GSAP + ScrollTrigger
- Compteurs stats (homepage) — `gsap.to()` avec `snap: 1`
- Timeline historique — reveal au scroll progressif
- SplitText sur les grands titres (ligne par ligne)
- Parallax sur images de sections (`gsap.to(y)`)

### Framer Motion
- Transitions entre pages — `AnimatePresence` avec fade + slide
- Hover cards — `whileHover: { scale: 1.03 }` + glow CSS
- Flip cards instructeurs — `rotateY` 180°
- Menu mobile — `staggerChildren` sur les liens

### CSS natif
- Gradient animé sur le hero (keyframes)
- Glow pulse sur les CTAs (`box-shadow` keyframes)
- Noise texture overlay (SVG filter ou pseudo-element)

---

## 10. Données du Club (référence)

### Contact
- Adresse : 490 chemin du Lac, Boucherville (Québec) J4B 6X3
- Téléphone : (450) 655-1888
- Email : info@judoboucherville.com

### Instructeurs Judo
| Nom | Grade | Rôle |
|---|---|---|
| Fayçal Bousbiat | 7e dan | Directeur technique, entraîneur-chef (depuis 2001) |
| Daniel De Angelis | 7e dan | Professeur, kata world championship 2008, 2009 |
| Donald Ferland | 6e dan | Professeur, kata world championship 2009, 2012 |
| Jacques Coté | 6e dan | Professeur |
| Adriana Portuondo Isasi | — | Instructrice (sport-études) |
| Jérôme Lajoie | 1e dan | Instructeur, kata world championship Cancun 2018 (8e) |
| Jacob St-Jean | 1e dan | Instructeur, kata world championship Cancun 2018 (8e) |

### Instructeurs Aiki Ju-Jitsu
| Nom | Grade |
|---|---|
| Sylvain Yargeau | 4e dan |
| Patric Charade | 3e dan |

### Instructeurs Jiu-Jitsu Brésilien
| Nom | Grade |
|---|---|
| Alexandre Stellato | Ceinture violette BJJ |
| Benoit Gagnon | Ceinture bleue BJJ, ceinture noire Ving-Tsun Kung-Fu |

### Horaires (saison en cours)
| Programme | Jours | Heures |
|---|---|---|
| Parents/enfants | Samedi | 9h00–10h00 |
| Enfants débutants (U8/U10/U12) | Samedi | 10h15–11h15 / 11h30–12h30 |
| Judo adulte | Lundi + Mercredi | 19h00–20h30 / 19h30–21h00 |
| Judo compétition (avancé) | Lun–Ven | 18h00–19h00 |
| Aiki Ju-Jitsu | Mardi + Jeudi | 20h00–21h30 |
| Jiu-Jitsu Brésilien | Mardi + Jeudi | 19h45–21h00 |
| Auto-défense | Mar/Mer/Jeu + Sam | 12h00–13h00 / 12h30–13h30 |

---

## 11. Ce qui est amélioré vs. le site actuel

1. **Bilingue FR/EN** — le site actuel est FR uniquement
2. **CMS Sanity** — le club peut tout modifier sans développeur
3. **Page Actualités** — nouvelle section pour partager les résultats et nouvelles
4. **Page Contact** — formulaire intégré + carte interactive
5. **Pages instructeurs individuelles** — profils détaillés pour chaque prof
6. **Page Résultats unifiée** — toutes les saisons sur une seule page avec filtres
7. **Animations et motion graphics** — site moderne et dynamique
8. **Performance** — Next.js + images optimisées (next/image) + lazy loading
9. **SEO** — métadonnées, OG tags, sitemap automatique
10. **Mobile-first** — design responsive soigné (le site actuel est peu mobile-friendly)
