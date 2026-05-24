# Judo Boucherville — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a Next.js 15 project with Tailwind CSS v4, GSAP, Framer Motion, Sanity v3, and next-intl, ready for page development.

**Architecture:** Monorepo with Next.js App Router, locale-prefixed routes (`/fr`, `/en`), Sanity Studio embedded at `/studio`, and a shared design system via CSS custom properties.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, GSAP 3, Framer Motion 11, Sanity v3, next-intl 3, Vitest, React Testing Library

---

## File Map

```
/
├── app/
│   ├── [locale]/
│   │   └── layout.tsx          ← Root locale layout (fonts, providers)
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx        ← Sanity Studio embedded
├── components/
│   └── providers/
│       └── Providers.tsx       ← GSAP + Framer Motion context
├── sanity/
│   ├── client.ts               ← Sanity client (read-only + preview)
│   ├── env.ts                  ← Sanity env vars validation
│   └── schemas/
│       ├── index.ts            ← Schema registry
│       ├── programme.ts
│       ├── instructeur.ts
│       ├── resultat.ts
│       ├── actualite.ts
│       ├── president.ts
│       ├── tournoi.ts
│       └── pageContent.ts
├── i18n/
│   ├── routing.ts              ← next-intl routing config
│   ├── request.ts              ← next-intl server config
│   └── messages/
│       ├── fr.json
│       └── en.json
├── lib/
│   └── utils.ts                ← cn(), formatDate(), etc.
├── styles/
│   └── globals.css             ← Design system CSS variables + Tailwind
├── middleware.ts               ← next-intl locale detection
├── next.config.ts
├── sanity.config.ts
└── vitest.config.ts
```

---

## Task 1: Initialize Next.js 15 Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`

- [ ] **Step 1: Scaffold the project**

```bash
cd "C:/Users/Yousif Ibrahim/Documents/GitHub Repositories/Judo Boucherville"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --yes
```

Expected: Project created with Next.js 15, TypeScript, Tailwind CSS, App Router.

- [ ] **Step 2: Install all dependencies**

```bash
npm install gsap @gsap/react framer-motion next-intl sanity @sanity/client @sanity/image-url next-sanity @sanity/vision clsx tailwind-merge
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: Update `next.config.ts`**

```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js 15 project with Tailwind, GSAP, Framer Motion, Sanity, next-intl"
```

---

## Task 2: Design System — CSS Variables & Fonts

**Files:**
- Modify: `styles/globals.css`
- Create: `app/[locale]/layout.tsx`

- [ ] **Step 1: Write the test**

Create `lib/__tests__/utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })
  it('deduplicates tailwind classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run lib/__tests__/utils.test.ts
```
Expected: FAIL — `cn` not defined.

- [ ] **Step 3: Create `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string, locale: string = 'fr-CA'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run lib/__tests__/utils.test.ts
```
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Replace `styles/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg-base: #080C18;
  --color-bg-surface: #0F1628;
  --color-accent-blue: #1E6FFF;
  --color-accent-glow: #3D8BFF;
  --color-foreground: #F0F4FF;
  --color-muted: #6B7A99;
  --color-gold: #C9A84C;

  --font-heading: var(--font-bebas);
  --font-body: var(--font-inter);
}

:root {
  --noise-opacity: 0.03;
}

body {
  background-color: var(--color-bg-base);
  color: var(--color-foreground);
  font-family: var(--font-body);
}

/* Noise texture overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: var(--noise-opacity);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Glow pulse animation for CTAs */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px 2px rgba(30, 111, 255, 0.4); }
  50% { box-shadow: 0 0 20px 6px rgba(30, 111, 255, 0.7); }
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

- [ ] **Step 6: Create `app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const bebas = localFont({
  src: '../../public/fonts/BebasNeue-Regular.ttf',
  variable: '--font-bebas',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Club de Judo Boucherville',
    default: 'Club de Judo Boucherville',
  },
  description: 'Club de Judo Boucherville — Fondé en 1970, Club reconnu AAA par Judo Québec. Judo, Aiki Ju-Jitsu, Jiu-Jitsu Brésilien à Boucherville, QC.',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${bebas.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Download Bebas Neue font**

```bash
# Download BebasNeue-Regular.ttf to public/fonts/
# From: https://fonts.google.com/specimen/Bebas+Neue
# Or use Google Fonts variable import instead:
mkdir -p public/fonts
curl -L "https://github.com/google/fonts/raw/main/ofl/bebasneue/BebasNeue-Regular.ttf" -o public/fonts/BebasNeue-Regular.ttf
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: design system CSS variables, fonts, and utility functions"
```

---

## Task 3: Configure Vitest

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 2: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to `package.json`**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Verify tests still pass**

```bash
npm test
```
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: configure Vitest + React Testing Library"
```

---

## Task 4: next-intl Setup

**Files:**
- Create: `middleware.ts`, `i18n/routing.ts`, `i18n/request.ts`, `i18n/messages/fr.json`, `i18n/messages/en.json`

- [ ] **Step 1: Write the test**

Create `i18n/__tests__/routing.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { routing } from '../routing'

describe('routing', () => {
  it('has fr and en locales', () => {
    expect(routing.locales).toContain('fr')
    expect(routing.locales).toContain('en')
  })
  it('defaults to fr', () => {
    expect(routing.defaultLocale).toBe('fr')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test i18n/__tests__/routing.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Create `i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  pathnames: {
    '/': '/',
    '/historique': { fr: '/historique', en: '/history' },
    '/equipe': { fr: '/equipe', en: '/team' },
    '/equipe/[slug]': { fr: '/equipe/[slug]', en: '/team/[slug]' },
    '/programmes': { fr: '/programmes', en: '/programs' },
    '/programmes/[slug]': { fr: '/programmes/[slug]', en: '/programs/[slug]' },
    '/inscription': { fr: '/inscription', en: '/registration' },
    '/resultats': { fr: '/resultats', en: '/results' },
    '/challenge': '/challenge',
    '/actualites': { fr: '/actualites', en: '/news' },
    '/contact': '/contact',
  },
})

export type Locale = (typeof routing.locales)[number]
```

- [ ] **Step 4: Create `i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'fr' | 'en')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 5: Create `middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!_next|studio|.*\\..*).*)'],
}
```

- [ ] **Step 6: Create `i18n/messages/fr.json`**

```json
{
  "nav": {
    "programmes": "Programmes",
    "equipe": "Notre équipe",
    "historique": "Historique",
    "resultats": "Résultats",
    "challenge": "Challenge",
    "actualites": "Actualités",
    "contact": "Contact",
    "inscription": "S'inscrire"
  },
  "home": {
    "hero_title": "Club de Judo Boucherville",
    "hero_subtitle": "Fondé en 1970 · Club reconnu AAA · 245 membres",
    "hero_cta_primary": "Découvrir nos programmes",
    "hero_cta_secondary": "S'inscrire",
    "stats_years": "ans d'histoire",
    "stats_members": "membres actifs",
    "stats_gold": "médailles d'or provinciales",
    "stats_level": "Judo Québec",
    "programmes_title": "Nos programmes",
    "programmes_filter_all": "Tous",
    "programmes_filter_children": "Enfants",
    "programmes_filter_adults": "Adultes",
    "programmes_filter_martial": "Arts martiaux",
    "club_title": "Notre club",
    "team_title": "Notre équipe",
    "achievements_title": "Nos réalisations",
    "challenge_title": "Challenge Judo Boucherville",
    "news_title": "Actualités",
    "cta_title": "Prêt à commencer?",
    "cta_subtitle": "Rejoins le premier club de judo du Québec.",
    "cta_button": "S'inscrire maintenant"
  },
  "footer": {
    "address": "490 chemin du Lac, Boucherville (Québec) J4B 6X3",
    "phone": "(450) 655-1888",
    "email": "info@judoboucherville.com",
    "rights": "Tous droits réservés",
    "quick_links": "Liens rapides",
    "schedules": "Horaires",
    "follow_us": "Suivez-nous"
  },
  "programme": {
    "schedule": "Horaires",
    "location": "Lieu",
    "instructor": "Instructeur(s)",
    "register": "S'inscrire à ce cours",
    "similar": "Programmes similaires"
  },
  "inscription": {
    "title": "Inscription",
    "step1": "Choisir votre programme",
    "step2": "Vos informations",
    "step3": "Paiement",
    "form_link": "Formulaire d'inscription en ligne",
    "acces_loisirs": "Programme Accès-Loisirs disponible"
  },
  "contact": {
    "title": "Nous contacter",
    "name": "Nom",
    "email": "Courriel",
    "message": "Message",
    "send": "Envoyer",
    "success": "Message envoyé!",
    "error": "Erreur, veuillez réessayer."
  },
  "challenge": {
    "title": "Challenge Judo Boucherville",
    "edition": "27e édition",
    "date": "11 avril 2026",
    "countdown_days": "jours",
    "countdown_hours": "heures",
    "countdown_minutes": "minutes",
    "countdown_seconds": "secondes",
    "categories": "Catégories",
    "prizes": "Prix",
    "contact_director": "Directeur du tournoi",
    "register": "Inscription au tournoi"
  },
  "results": {
    "title": "Résultats de compétition",
    "filter_season": "Saison",
    "filter_competition": "Compétition",
    "gold": "Or",
    "silver": "Argent",
    "bronze": "Bronze"
  },
  "history": {
    "title": "Historique du club",
    "founded": "Fondé en 1970",
    "presidents": "Présidents du club",
    "founder": "Fondateur"
  }
}
```

- [ ] **Step 7: Create `i18n/messages/en.json`**

```json
{
  "nav": {
    "programmes": "Programs",
    "equipe": "Our Team",
    "historique": "History",
    "resultats": "Results",
    "challenge": "Challenge",
    "actualites": "News",
    "contact": "Contact",
    "inscription": "Register"
  },
  "home": {
    "hero_title": "Club de Judo Boucherville",
    "hero_subtitle": "Founded in 1970 · AAA Recognized Club · 245 members",
    "hero_cta_primary": "Explore our programs",
    "hero_cta_secondary": "Register",
    "stats_years": "years of history",
    "stats_members": "active members",
    "stats_gold": "provincial gold medals",
    "stats_level": "Judo Québec",
    "programmes_title": "Our Programs",
    "programmes_filter_all": "All",
    "programmes_filter_children": "Children",
    "programmes_filter_adults": "Adults",
    "programmes_filter_martial": "Martial Arts",
    "club_title": "Our Club",
    "team_title": "Our Team",
    "achievements_title": "Our Achievements",
    "challenge_title": "Challenge Judo Boucherville",
    "news_title": "News",
    "cta_title": "Ready to start?",
    "cta_subtitle": "Join the first judo club in Québec.",
    "cta_button": "Register now"
  },
  "footer": {
    "address": "490 chemin du Lac, Boucherville (Québec) J4B 6X3",
    "phone": "(450) 655-1888",
    "email": "info@judoboucherville.com",
    "rights": "All rights reserved",
    "quick_links": "Quick Links",
    "schedules": "Schedules",
    "follow_us": "Follow Us"
  },
  "programme": {
    "schedule": "Schedule",
    "location": "Location",
    "instructor": "Instructor(s)",
    "register": "Register for this class",
    "similar": "Similar programs"
  },
  "inscription": {
    "title": "Registration",
    "step1": "Choose your program",
    "step2": "Your information",
    "step3": "Payment",
    "form_link": "Online registration form",
    "acces_loisirs": "Accès-Loisirs program available"
  },
  "contact": {
    "title": "Contact us",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "send": "Send",
    "success": "Message sent!",
    "error": "Error, please try again."
  },
  "challenge": {
    "title": "Challenge Judo Boucherville",
    "edition": "27th edition",
    "date": "April 11, 2026",
    "countdown_days": "days",
    "countdown_hours": "hours",
    "countdown_minutes": "minutes",
    "countdown_seconds": "seconds",
    "categories": "Categories",
    "prizes": "Prizes",
    "contact_director": "Tournament Director",
    "register": "Tournament Registration"
  },
  "results": {
    "title": "Competition Results",
    "filter_season": "Season",
    "filter_competition": "Competition",
    "gold": "Gold",
    "silver": "Silver",
    "bronze": "Bronze"
  },
  "history": {
    "title": "Club History",
    "founded": "Founded in 1970",
    "presidents": "Club Presidents",
    "founder": "Founder"
  }
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npm test i18n/__tests__/routing.test.ts
```
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: next-intl routing and FR/EN translations"
```

---

## Task 5: Sanity v3 — Project Setup & Schemas

**Files:**
- Create: `sanity.config.ts`, `sanity/env.ts`, `sanity/client.ts`, `sanity/schemas/index.ts`
- Create: all schema files under `sanity/schemas/`
- Create: `app/studio/[[...tool]]/page.tsx`

- [ ] **Step 1: Create a Sanity project**

Go to https://www.sanity.io/manage and create a new project named "judo-boucherville". Copy the project ID.

Then create `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token_here
```

- [ ] **Step 2: Create `sanity/env.ts`**

```ts
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing NEXT_PUBLIC_SANITY_DATASET'
)
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, msg: string): T {
  if (v === undefined) throw new Error(msg)
  return v
}
```

- [ ] **Step 3: Create `sanity/client.ts`**

```ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})
```

- [ ] **Step 4: Create `sanity/schemas/programme.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const programme = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  fields: [
    defineField({ name: 'titre', title: 'Titre (FR)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titreEn', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug URL', type: 'slug', options: { source: 'titre' }, validation: r => r.required() }),
    defineField({
      name: 'categorie', title: 'Catégorie', type: 'string',
      options: { list: ['enfants', 'adultes', 'arts-martiaux'] },
      validation: r => r.required()
    }),
    defineField({ name: 'description', title: 'Description (FR)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'descriptionEn', title: 'Description (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'horaires', title: 'Horaires', type: 'array',
      of: [{
        type: 'object', fields: [
          { name: 'jours', title: 'Jours', type: 'string' },
          { name: 'heures', title: 'Heures', type: 'string' },
          { name: 'lieu', title: 'Lieu', type: 'string' },
        ]
      }]
    }),
    defineField({ name: 'tarif', title: 'Tarif (ex: 350$/session)', type: 'string' }),
    defineField({
      name: 'instructeurs', title: 'Instructeurs', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'instructeur' }] }]
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'ordre', title: 'Ordre d\'affichage', type: 'number' }),
  ],
  preview: {
    select: { title: 'titre', subtitle: 'categorie' },
  },
})
```

- [ ] **Step 5: Create `sanity/schemas/instructeur.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const instructeur = defineType({
  name: 'instructeur',
  title: 'Instructeur',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom complet', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug URL', type: 'slug', options: { source: 'nom' }, validation: r => r.required() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'grade', title: 'Grade (ex: 7e dan)', type: 'string' }),
    defineField({
      name: 'disciplines', title: 'Disciplines', type: 'array',
      of: [{ type: 'string', options: { list: ['judo', 'aiki-jujitsu', 'jiu-jitsu-bresilien', 'kata'] } }]
    }),
    defineField({ name: 'role', title: 'Rôle (ex: Directeur technique)', type: 'string' }),
    defineField({ name: 'bio', title: 'Biographie (FR)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'bioEn', title: 'Biography (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'competitions', title: 'Compétitions notables', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'ordre', title: 'Ordre d\'affichage', type: 'number' }),
  ],
  preview: {
    select: { title: 'nom', subtitle: 'grade', media: 'photo' },
  },
})
```

- [ ] **Step 6: Create `sanity/schemas/resultat.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const resultat = defineType({
  name: 'resultat',
  title: 'Résultat',
  type: 'document',
  fields: [
    defineField({ name: 'saison', title: 'Saison (ex: 2024-2025)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'competition', title: 'Compétition', type: 'string', validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'athlete', title: 'Athlète', type: 'string' }),
    defineField({ name: 'categorie', title: 'Catégorie (ex: -57kg U18)', type: 'string' }),
    defineField({
      name: 'medaille', title: 'Médaille', type: 'string',
      options: { list: ['or', 'argent', 'bronze'] },
      validation: r => r.required()
    }),
  ],
  preview: {
    select: { title: 'athlete', subtitle: 'competition' },
  },
})
```

- [ ] **Step 7: Create `sanity/schemas/actualite.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const actualite = defineType({
  name: 'actualite',
  title: 'Actualité',
  type: 'document',
  fields: [
    defineField({ name: 'titre', title: 'Titre (FR)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titreEn', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titre' }, validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'image', title: 'Image principale', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'extrait', title: 'Extrait (FR)', type: 'text', rows: 3 }),
    defineField({ name: 'extraitEn', title: 'Excerpt (EN)', type: 'text', rows: 3 }),
    defineField({ name: 'contenu', title: 'Contenu (FR)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'contenuEn', title: 'Content (EN)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
  ],
  orderings: [{ title: 'Date récente', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'titre', subtitle: 'date', media: 'image' },
  },
})
```

- [ ] **Step 8: Create `sanity/schemas/president.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const president = defineType({
  name: 'president',
  title: 'Président',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom', type: 'string', validation: r => r.required() }),
    defineField({ name: 'periode', title: 'Période (ex: 1979–1985)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Biographie courte', type: 'text', rows: 3 }),
    defineField({ name: 'ordre', title: 'Ordre chronologique', type: 'number' }),
  ],
  preview: {
    select: { title: 'nom', subtitle: 'periode', media: 'photo' },
  },
})
```

- [ ] **Step 9: Create `sanity/schemas/tournoi.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const tournoi = defineType({
  name: 'tournoi',
  title: 'Tournoi Challenge',
  type: 'document',
  fields: [
    defineField({ name: 'edition', title: 'Édition (ex: 27e)', type: 'string' }),
    defineField({ name: 'date', title: 'Date du tournoi', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'lieu', title: 'Lieu', type: 'string' }),
    defineField({
      name: 'categories', title: 'Catégories d\'âge', type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'prix', title: 'Prix', type: 'array',
      of: [{
        type: 'object', fields: [
          { name: 'categorie', title: 'Catégorie', type: 'string' },
          { name: 'montant', title: 'Montant (ex: 1 000 $)', type: 'string' },
        ]
      }]
    }),
    defineField({ name: 'description', title: 'Description (FR)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'descriptionEn', title: 'Description (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'inscriptionUrl', title: 'Lien d\'inscription', type: 'url' }),
  ],
  preview: {
    select: { title: 'edition', subtitle: 'date' },
  },
})
```

- [ ] **Step 10: Create `sanity/schemas/pageContent.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const pageContent = defineType({
  name: 'pageContent',
  title: 'Contenu de page',
  type: 'document',
  fields: [
    defineField({
      name: 'page', title: 'Page', type: 'string',
      options: { list: ['historique', 'inscription', 'contact'] },
      validation: r => r.required()
    }),
    defineField({ name: 'contenu', title: 'Contenu (FR)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'contenuEn', title: 'Content (EN)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
  ],
  preview: {
    select: { title: 'page' },
  },
})
```

- [ ] **Step 11: Create `sanity/schemas/index.ts`**

```ts
import { programme } from './programme'
import { instructeur } from './instructeur'
import { resultat } from './resultat'
import { actualite } from './actualite'
import { president } from './president'
import { tournoi } from './tournoi'
import { pageContent } from './pageContent'

export const schemaTypes = [
  programme,
  instructeur,
  resultat,
  actualite,
  president,
  tournoi,
  pageContent,
]
```

- [ ] **Step 12: Create `sanity.config.ts`**

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { projectId, dataset, apiVersion } from './sanity/env'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  title: 'Club Judo Boucherville — CMS',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
```

- [ ] **Step 13: Create `app/studio/[[...tool]]/page.tsx`**

```tsx
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 14: Verify Sanity Studio loads**

```bash
npm run dev
```
Open http://localhost:3000/studio — should see Sanity Studio with all 7 schemas.

- [ ] **Step 15: Commit**

```bash
git add .
git commit -m "feat: Sanity v3 setup with all 7 content schemas"
```

---

## Task 6: Sanity Queries

**Files:**
- Create: `sanity/queries/programmes.ts`, `sanity/queries/instructeurs.ts`, `sanity/queries/resultats.ts`, `sanity/queries/actualites.ts`, `sanity/queries/challenge.ts`

- [ ] **Step 1: Create `sanity/queries/programmes.ts`**

```ts
import { client } from '../client'

export type Programme = {
  _id: string
  titre: string
  titreEn: string
  slug: { current: string }
  categorie: 'enfants' | 'adultes' | 'arts-martiaux'
  description: unknown[]
  descriptionEn: unknown[]
  horaires: { jours: string; heures: string; lieu: string }[]
  tarif: string
  instructeurs: { nom: string; grade: string; slug: { current: string } }[]
  image: { asset: { _ref: string } }
  ordre: number
}

export async function getAllProgrammes(): Promise<Programme[]> {
  return client.fetch(
    `*[_type == "programme"] | order(ordre asc) {
      _id, titre, titreEn, slug, categorie, description, descriptionEn,
      horaires, tarif, ordre, image,
      instructeurs[]->{ nom, grade, slug }
    }`
  )
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  return client.fetch(
    `*[_type == "programme" && slug.current == $slug][0] {
      _id, titre, titreEn, slug, categorie, description, descriptionEn,
      horaires, tarif, image,
      instructeurs[]->{ nom, grade, slug, photo, bio }
    }`,
    { slug }
  )
}
```

- [ ] **Step 2: Create `sanity/queries/instructeurs.ts`**

```ts
import { client } from '../client'

export type Instructeur = {
  _id: string
  nom: string
  slug: { current: string }
  photo: { asset: { _ref: string } }
  grade: string
  disciplines: string[]
  role: string
  bio: unknown[]
  bioEn: unknown[]
  competitions: string[]
  ordre: number
}

export async function getAllInstructeurs(): Promise<Instructeur[]> {
  return client.fetch(
    `*[_type == "instructeur"] | order(ordre asc) {
      _id, nom, slug, photo, grade, disciplines, role, bio, bioEn, competitions, ordre
    }`
  )
}

export async function getInstructeurBySlug(slug: string): Promise<Instructeur | null> {
  return client.fetch(
    `*[_type == "instructeur" && slug.current == $slug][0] {
      _id, nom, slug, photo, grade, disciplines, role, bio, bioEn, competitions
    }`,
    { slug }
  )
}
```

- [ ] **Step 3: Create `sanity/queries/resultats.ts`**

```ts
import { client } from '../client'

export type Resultat = {
  _id: string
  saison: string
  competition: string
  date: string
  athlete: string
  categorie: string
  medaille: 'or' | 'argent' | 'bronze'
}

export async function getAllResultats(): Promise<Resultat[]> {
  return client.fetch(
    `*[_type == "resultat"] | order(date desc) {
      _id, saison, competition, date, athlete, categorie, medaille
    }`
  )
}

export async function getSaisons(): Promise<string[]> {
  const results = await client.fetch<{ saison: string }[]>(
    `*[_type == "resultat"] { saison }`
  )
  return [...new Set(results.map(r => r.saison))].sort().reverse()
}
```

- [ ] **Step 4: Create `sanity/queries/actualites.ts`**

```ts
import { client } from '../client'

export type Actualite = {
  _id: string
  titre: string
  titreEn: string
  slug: { current: string }
  date: string
  image: { asset: { _ref: string } }
  extrait: string
  extraitEn: string
  contenu: unknown[]
  contenuEn: unknown[]
}

export async function getLatestActualites(count: number = 3): Promise<Actualite[]> {
  return client.fetch(
    `*[_type == "actualite"] | order(date desc)[0...$count] {
      _id, titre, titreEn, slug, date, image, extrait, extraitEn
    }`,
    { count: count - 1 }
  )
}

export async function getAllActualites(): Promise<Actualite[]> {
  return client.fetch(
    `*[_type == "actualite"] | order(date desc) {
      _id, titre, titreEn, slug, date, image, extrait, extraitEn
    }`
  )
}
```

- [ ] **Step 5: Create `sanity/queries/challenge.ts`**

```ts
import { client } from '../client'

export type Tournoi = {
  _id: string
  edition: string
  date: string
  lieu: string
  categories: string[]
  prix: { categorie: string; montant: string }[]
  description: unknown[]
  descriptionEn: unknown[]
  inscriptionUrl: string
}

export async function getNextTournoi(): Promise<Tournoi | null> {
  return client.fetch(
    `*[_type == "tournoi" && date > now()] | order(date asc)[0] {
      _id, edition, date, lieu, categories, prix, description, descriptionEn, inscriptionUrl
    }`
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: Sanity GROQ queries for all content types"
```

---

## Task 7: Providers Component

**Files:**
- Create: `components/providers/Providers.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create `components/providers/Providers.tsx`**

```tsx
'use client'
import { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Update `app/[locale]/layout.tsx` to include Providers**

Add the import and wrap children:
```tsx
import Providers from '@/components/providers/Providers'

// Inside the return, wrap {children} with Providers:
<NextIntlClientProvider messages={messages}>
  <Providers>
    {children}
  </Providers>
</NextIntlClientProvider>
```

- [ ] **Step 3: Verify dev server starts without errors**

```bash
npm run dev
```
Expected: Server starts at http://localhost:3000 with no console errors.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: GSAP + Framer Motion providers, ScrollTrigger registered"
```

---

## Task 8: Redirect Root to Locale

**Files:**
- Create: `app/page.tsx` (root redirect)
- Create: `app/[locale]/page.tsx` (placeholder homepage)

- [ ] **Step 1: Create `app/page.tsx`**

```tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/fr')
}
```

- [ ] **Step 2: Create placeholder `app/[locale]/page.tsx`**

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-heading text-6xl text-foreground">
        Club de Judo Boucherville
      </h1>
    </main>
  )
}
```

- [ ] **Step 3: Verify routing works**

```bash
npm run dev
```
- Visit http://localhost:3000 → should redirect to /fr
- Visit http://localhost:3000/fr → should show "Club de Judo Boucherville"
- Visit http://localhost:3000/en → should show same page
- Visit http://localhost:3000/studio → should show Sanity Studio

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: locale routing with root redirect, placeholder homepage"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** Stack (Next.js 15, Tailwind v4, GSAP, Framer Motion, Sanity, next-intl) ✓ | Design system CSS variables ✓ | All 7 Sanity schemas ✓ | FR/EN translations ✓ | All routes defined in routing.ts ✓
- [x] **Placeholders:** None — all steps have actual code
- [x] **Type consistency:** `Programme`, `Instructeur`, `Resultat`, `Actualite`, `Tournoi` types defined in queries and used consistently
- [x] **Gap:** `.env.local` setup documented in Task 5 Step 1

---

*Prochaine étape : Plan 2 — Homepage (Navigation, Hero, toutes les sections)*
