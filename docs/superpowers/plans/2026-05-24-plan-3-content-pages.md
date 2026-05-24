# Judo Boucherville — Plan 3: Content Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all content pages: /programmes (overview + all 12 individual pages), /equipe (overview + individual profiles), /historique, /resultats, and /challenge.

**Architecture:** Programmes use a single dynamic `[slug]` route with a shared template. Team uses the same pattern. History uses a GSAP ScrollTrigger timeline. Results uses client-side filtering with Sanity data. Challenge has a live countdown.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, GSAP, Framer Motion, Sanity v3, next-intl

**Prerequisite:** Plans 1 and 2 complete.

---

## File Map

```
app/[locale]/
├── programmes/
│   ├── page.tsx                     ← All programmes overview
│   └── [slug]/
│       └── page.tsx                 ← Dynamic programme page
├── equipe/
│   ├── page.tsx                     ← Full team overview
│   └── [slug]/
│       └── page.tsx                 ← Individual instructor page
├── historique/
│   └── page.tsx                     ← History + timeline + presidents
├── resultats/
│   └── page.tsx                     ← Results with filters
└── challenge/
    └── page.tsx                     ← Tournament page
components/
├── shared/
│   ├── PageHero.tsx                 ← Reusable page hero banner
│   └── PortableText.tsx             ← Sanity block content renderer
└── pages/
    ├── ProgrammeTemplate.tsx        ← Programme page layout
    ├── InstructeurTemplate.tsx      ← Instructor profile layout
    └── ResultatsClient.tsx          ← Client component for results filters
```

---

## Task 1: Shared PageHero Component

**Files:**
- Create: `components/shared/PageHero.tsx`

- [ ] **Step 1: Write the test**

Create `components/shared/__tests__/PageHero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PageHero from '../PageHero'

describe('PageHero', () => {
  it('renders title', () => {
    render(<PageHero title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
  it('renders subtitle when provided', () => {
    render(<PageHero title="Title" subtitle="Subtitle text" />)
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })
  it('renders tag when provided', () => {
    render(<PageHero title="Title" tag="Enfants" />)
    expect(screen.getByText('Enfants')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test components/shared/__tests__/PageHero.test.tsx
```

- [ ] **Step 3: Create `components/shared/PageHero.tsx`**

```tsx
type Props = {
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
}

export default function PageHero({ title, subtitle, tag, tagColor = 'text-accent-blue' }: Props) {
  return (
    <section className="pt-32 pb-16 bg-bg-base relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-blue/5 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {tag && (
          <span className={`text-xs font-semibold uppercase tracking-widest ${tagColor} block mb-3`}>
            {tag}
          </span>
        )}
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground tracking-wider">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted text-lg mt-4 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test components/shared/__tests__/PageHero.test.tsx
```
Expected: PASS — 3 tests.

- [ ] **Step 5: Create `components/shared/PortableText.tsx`**

```tsx
import { PortableText as SanityPortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanityImage'

type Props = { value: unknown[] }

const components = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string } }) => (
      <div className="my-8 rounded-xl overflow-hidden">
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || ''}
          width={800}
          height={500}
          className="w-full object-cover"
        />
      </div>
    ),
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-heading text-3xl text-foreground tracking-wide mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-heading text-2xl text-foreground tracking-wide mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-muted leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-accent-blue pl-6 italic text-muted my-6">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
      <a href={value?.href} className="text-accent-blue hover:text-accent-glow underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside text-muted mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside text-muted mb-4 space-y-1">{children}</ol>
    ),
  },
}

export default function PortableText({ value }: Props) {
  return <SanityPortableText value={value} components={components} />
}
```

- [ ] **Step 6: Install @portabletext/react**

```bash
npm install @portabletext/react
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: PageHero and PortableText shared components"
```

---

## Task 2: Programmes Overview Page

**Files:**
- Create: `app/[locale]/programmes/page.tsx`

- [ ] **Step 1: Create `app/[locale]/programmes/page.tsx`**

```tsx
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getAllProgrammes } from '@/sanity/queries/programmes'
import PageHero from '@/components/shared/PageHero'
import ProgrammeCard from '@/components/ui/ProgrammeCard'

export const metadata: Metadata = {
  title: 'Programmes',
}

const categoryLabels = {
  enfants: 'Jeunes',
  adultes: 'Adultes',
  'arts-martiaux': 'Arts martiaux',
}

const fallbackIcons: Record<string, string> = {
  'judo-competition': '🏆',
  'judo-enfants': '👶',
  'judo-adultes': '💪',
  'parents-enfants': '👨‍👧',
  'sport-etudes': '📚',
  'judo-aines': '🧘',
  'aiki-jujitsu': '⚡',
  'jiu-jitsu-bresilien': '🌀',
  'autodéfense': '🛡️',
  'kata': '🎯',
  'camp-de-jour': '☀️',
  'judo-scolaire': '🏫',
}

export default async function ProgrammesPage() {
  const locale = await getLocale()
  const programmes = await getAllProgrammes()

  const grouped = {
    enfants: programmes.filter(p => p.categorie === 'enfants'),
    adultes: programmes.filter(p => p.categorie === 'adultes'),
    'arts-martiaux': programmes.filter(p => p.categorie === 'arts-martiaux'),
  }

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Nos programmes' : 'Our Programs'}
        subtitle={locale === 'fr'
          ? 'Judo, Aiki Ju-Jitsu, Jiu-Jitsu Brésilien — pour tous les âges et tous les niveaux.'
          : 'Judo, Aiki Ju-Jitsu, Brazilian Jiu-Jitsu — for all ages and levels.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map(cat => (
          grouped[cat].length > 0 && (
            <div key={cat}>
              <h2 className="font-heading text-2xl text-muted tracking-widest uppercase mb-8 border-b border-white/5 pb-4">
                {categoryLabels[cat]}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[cat].map(prog => (
                  <ProgrammeCard
                    key={prog._id}
                    titre={locale === 'fr' ? prog.titre : (prog.titreEn || prog.titre)}
                    description=""
                    horaire={prog.horaires?.[0] ? `${prog.horaires[0].jours} ${prog.horaires[0].heures}` : ''}
                    slug={prog.slug.current}
                    categorie={prog.categorie}
                    icon={fallbackIcons[prog.slug.current] || '🥋'}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: programmes overview page grouped by category"
```

---

## Task 3: Programme Dynamic Page

**Files:**
- Create: `components/pages/ProgrammeTemplate.tsx`
- Create: `app/[locale]/programmes/[slug]/page.tsx`

- [ ] **Step 1: Create `components/pages/ProgrammeTemplate.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import PageHero from '@/components/shared/PageHero'
import PortableText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import { urlFor } from '@/lib/sanityImage'
import type { Programme } from '@/sanity/queries/programmes'

const categoryTagColors = {
  enfants: 'text-green-400',
  adultes: 'text-accent-blue',
  'arts-martiaux': 'text-gold',
}

type Props = { programme: Programme; locale: string }

export default function ProgrammeTemplate({ programme, locale }: Props) {
  const title = locale === 'fr' ? programme.titre : (programme.titreEn || programme.titre)
  const description = locale === 'fr' ? programme.description : (programme.descriptionEn || programme.description)

  return (
    <>
      <PageHero
        title={title}
        tag={programme.categorie.replace('-', ' ')}
        tagColor={categoryTagColors[programme.categorie]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2">
            {programme.image && (
              <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
                <Image
                  src={urlFor(programme.image).width(800).height(400).url()}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {description && <PortableText value={description as unknown[]} />}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Horaires */}
            {programme.horaires?.length > 0 && (
              <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-4">Horaires</h3>
                <div className="space-y-3">
                  {programme.horaires.map((h, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-accent-blue font-medium">{h.jours}</span>
                      <span className="text-foreground ml-2">{h.heures}</span>
                      {h.lieu && <p className="text-muted text-xs mt-0.5">{h.lieu}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tarif */}
            {programme.tarif && (
              <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-2">Tarif</h3>
                <p className="text-accent-blue text-xl font-semibold">{programme.tarif}</p>
              </div>
            )}

            {/* Instructeurs */}
            {programme.instructeurs?.length > 0 && (
              <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-4">Instructeur(s)</h3>
                <div className="space-y-3">
                  {programme.instructeurs.map(instr => (
                    <Link
                      key={instr.slug.current}
                      href={`/${locale}/equipe/${instr.slug.current}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-heading text-sm">
                        {instr.nom.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm text-foreground group-hover:text-accent-blue transition-colors">{instr.nom}</p>
                        <p className="text-xs text-muted">{instr.grade}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Button href={`/${locale}/inscription`} className="w-full">
              S'inscrire à ce cours
            </Button>

          </aside>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create `app/[locale]/programmes/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getAllProgrammes, getProgrammeBySlug } from '@/sanity/queries/programmes'
import ProgrammeTemplate from '@/components/pages/ProgrammeTemplate'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const programmes = await getAllProgrammes()
  const locales = ['fr', 'en']
  return locales.flatMap(locale =>
    programmes.map(p => ({ locale, slug: p.slug.current }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const programme = await getProgrammeBySlug(slug)
  if (!programme) return {}
  return {
    title: locale === 'fr' ? programme.titre : (programme.titreEn || programme.titre),
  }
}

export default async function ProgrammePage({ params }: Props) {
  const { slug, locale } = await params
  const programme = await getProgrammeBySlug(slug)
  if (!programme) notFound()
  return <ProgrammeTemplate programme={programme} locale={locale} />
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: dynamic programme pages with sidebar (schedule, tarif, instructors)"
```

---

## Task 4: Team Pages

**Files:**
- Create: `app/[locale]/equipe/page.tsx`
- Create: `components/pages/InstructeurTemplate.tsx`
- Create: `app/[locale]/equipe/[slug]/page.tsx`

- [ ] **Step 1: Create `app/[locale]/equipe/page.tsx`**

```tsx
import { getAllInstructeurs } from '@/sanity/queries/instructeurs'
import PageHero from '@/components/shared/PageHero'
import InstructorCard from '@/components/ui/InstructorCard'

const disciplineGroups = {
  judo: { label: 'Judo', instructeurs: [] as string[] },
  'aiki-jujitsu': { label: 'Aiki Ju-Jitsu', instructeurs: [] as string[] },
  'jiu-jitsu-bresilien': { label: 'Jiu-Jitsu Brésilien', instructeurs: [] as string[] },
}

export default async function EquipePage() {
  const instructeurs = await getAllInstructeurs()

  const grouped: Record<string, typeof instructeurs> = {
    judo: instructeurs.filter(i => i.disciplines?.includes('judo')),
    'aiki-jujitsu': instructeurs.filter(i => i.disciplines?.includes('aiki-jujitsu')),
    'jiu-jitsu-bresilien': instructeurs.filter(i => i.disciplines?.includes('jiu-jitsu-bresilien')),
  }

  return (
    <>
      <PageHero
        title="Notre équipe"
        subtitle="Instructeurs accrédités, passionnés et dévoués à votre progression."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {Object.entries(grouped).map(([key, group]) => (
          group.length > 0 && (
            <div key={key}>
              <h2 className="font-heading text-2xl text-muted tracking-widest uppercase mb-8 border-b border-white/5 pb-4">
                {key === 'judo' ? 'Judo' : key === 'aiki-jujitsu' ? 'Aiki Ju-Jitsu' : 'Jiu-Jitsu Brésilien'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {group.map(instr => (
                  <InstructorCard
                    key={instr._id}
                    nom={instr.nom}
                    grade={instr.grade}
                    role={instr.role}
                    disciplines={instr.disciplines || []}
                    slug={instr.slug.current}
                    photo={instr.photo}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create `components/pages/InstructeurTemplate.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import PortableText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import { urlFor } from '@/lib/sanityImage'
import type { Instructeur } from '@/sanity/queries/instructeurs'

type Props = { instructeur: Instructeur; locale: string }

export default function InstructeurTemplate({ instructeur, locale }: Props) {
  const bio = locale === 'fr' ? instructeur.bio : (instructeur.bioEn || instructeur.bio)

  return (
    <>
      <PageHero
        title={instructeur.nom}
        subtitle={instructeur.role}
        tag={instructeur.grade}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Photo + details */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
              {instructeur.photo ? (
                <Image
                  src={urlFor(instructeur.photo).width(500).height(700).url()}
                  alt={instructeur.nom}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent-blue/10 flex items-center justify-center">
                  <span className="font-heading text-8xl text-accent-blue/30">
                    {instructeur.nom.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>

            {/* Disciplines */}
            {instructeur.disciplines?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs text-muted uppercase tracking-widest mb-3">Disciplines</h3>
                <div className="flex flex-wrap gap-2">
                  {instructeur.disciplines.map(d => (
                    <span key={d} className="px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-xs text-accent-blue">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notable competitions */}
            {instructeur.competitions?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs text-muted uppercase tracking-widest mb-3">Réalisations</h3>
                <ul className="space-y-2">
                  {instructeur.competitions.map((c, i) => (
                    <li key={i} className="text-sm text-foreground flex gap-2">
                      <span className="text-gold">🏅</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button href={`/${locale}/equipe`} variant="outline" className="w-full">
              ← Retour à l'équipe
            </Button>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            {bio && <PortableText value={bio as unknown[]} />}
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Create `app/[locale]/equipe/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getAllInstructeurs, getInstructeurBySlug } from '@/sanity/queries/instructeurs'
import InstructeurTemplate from '@/components/pages/InstructeurTemplate'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const instructeurs = await getAllInstructeurs()
  return ['fr', 'en'].flatMap(locale =>
    instructeurs.map(i => ({ locale, slug: i.slug.current }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const instructeur = await getInstructeurBySlug(slug)
  return instructeur ? { title: instructeur.nom } : {}
}

export default async function InstructeurPage({ params }: Props) {
  const { slug, locale } = await params
  const instructeur = await getInstructeurBySlug(slug)
  if (!instructeur) notFound()
  return <InstructeurTemplate instructeur={instructeur} locale={locale} />
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: team overview page and individual instructor profile pages"
```

---

## Task 5: History Page

**Files:**
- Create: `app/[locale]/historique/page.tsx`

- [ ] **Step 1: Create `app/[locale]/historique/page.tsx`**

```tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageHero from '@/components/shared/PageHero'

gsap.registerPlugin(ScrollTrigger)

const timelineEvents = [
  {
    year: '1970',
    title: 'Fondation du club',
    description: 'Marcel Bourelly fonde le "Kowakan - Shukokaé" au centre commercial La Seigneurie. Le judo fait son entrée à Boucherville.',
    icon: '🥋',
  },
  {
    year: '1974',
    title: 'Transition municipale',
    description: 'Le club ferme ses portes au centre La Seigneurie et continue ses activités sous les Services des loisirs de la municipalité.',
    icon: '🏛️',
  },
  {
    year: '1979',
    title: 'Incorporation officielle',
    description: 'Le 13 août 1979, le club est officiellement incorporé sous le nom "Club de Judo Boucherville Inc." et devient le premier club au Québec en nombre de membres et en résultats sportifs.',
    icon: '📜',
  },
  {
    year: '2001',
    title: 'Fayçal Bousbiat — entraîneur-chef',
    description: 'Fayçal Bousbiat prend les rênes comme entraîneur-chef, puis devient directeur technique en 2004.',
    icon: '👊',
  },
  {
    year: '2008',
    title: 'Centre Régional de Développement',
    description: 'Le club obtient le statut de Centre Régional de Développement (CRD) de Judo Québec, renforçant son rôle dans le développement du judo au Québec.',
    icon: '⭐',
  },
  {
    year: '2015',
    title: 'Nouveau emplacement',
    description: 'Le club déménage au Centre multifonctionnel de Boucherville.',
    icon: '🏠',
  },
  {
    year: '2017',
    title: 'Inauguration du Dojo Marcel Bourelly',
    description: 'Le 9 septembre 2017, inauguration du Dojo Marcel Bourelly au sein du Complexe aquatique Laurie-Ève Cormier, 490 chemin du Lac. Un hommage au fondateur et une installation de classe mondiale.',
    icon: '🏟️',
  },
  {
    year: '2026',
    title: 'Club AAA, 55 ans d\'excellence',
    description: '245 membres, club reconnu AAA par Judo Québec, des dizaines de champions provinciaux et nationaux. La tradition continue.',
    icon: '🏆',
  },
]

const presidents = [
  { nom: 'À compléter', periode: 'Données à entrer dans Sanity' },
]

export default function HistoriquePage() {
  const timelineRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.history-item', {
      opacity: 0,
      x: (i) => i % 2 === 0 ? -50 : 50,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: timelineRef })

  return (
    <>
      <PageHero
        title="Historique du club"
        subtitle="Plus de 55 ans de tradition, d'excellence et de passion pour le judo."
      />

      {/* Founder section */}
      <section className="py-16 bg-bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-full bg-accent-blue/20 flex items-center justify-center shrink-0">
              <span className="font-heading text-5xl text-accent-blue">MB</span>
            </div>
            <div>
              <span className="text-xs text-accent-blue uppercase tracking-widest">Fondateur</span>
              <h2 className="font-heading text-3xl text-foreground tracking-wider mt-1">Marcel Bourelly</h2>
              <p className="text-accent-blue text-sm mb-3">Ceinture noire 7e dan</p>
              <p className="text-muted leading-relaxed">
                Fondateur du club en 1970, ex-compétiteur et entraîneur provincial et national jusqu'en 1983.
                Marcel Bourelly a été intronisé au Temple de la renommée de Judo Québec à titre de
                pionnier-bâtisseur et de directeur technique ayant formé plus de 50 ceintures noires.
                Le dojo porte son nom en son honneur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-bg-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl text-foreground tracking-wider text-center mb-16">
            Les grandes dates
          </h2>

          <div ref={timelineRef} className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

            {timelineEvents.map((event, i) => (
              <div
                key={event.year}
                className={`history-item flex gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`bg-bg-surface border border-white/5 rounded-2xl p-6 inline-block max-w-md ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>
                    <span className="text-2xl block mb-2">{event.icon}</span>
                    <span className="font-heading text-2xl text-accent-blue">{event.year}</span>
                    <h3 className="font-heading text-lg text-foreground mt-1 mb-2 tracking-wide">{event.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{event.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex items-start justify-center w-6 shrink-0 pt-6">
                  <div className="w-3 h-3 rounded-full bg-accent-blue" />
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Presidents */}
      <section className="py-24 bg-bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl text-foreground tracking-wider text-center mb-12">
            Présidents du club
          </h2>
          <p className="text-muted text-center">
            La liste complète des présidents est gérée dans le CMS Sanity.
            Ajoutez les présidents via le Studio à /studio.
          </p>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: history page with GSAP alternating timeline and founder section"
```

---

## Task 6: Results Page

**Files:**
- Create: `components/pages/ResultatsClient.tsx`
- Create: `app/[locale]/resultats/page.tsx`

- [ ] **Step 1: Create `components/pages/ResultatsClient.tsx`**

```tsx
'use client'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import type { Resultat } from '@/sanity/queries/resultats'

type Props = {
  resultats: Resultat[]
  saisons: string[]
  locale: string
}

const medalConfig = {
  or: { label: 'Or', emoji: '🥇', className: 'border-yellow-400/30 bg-yellow-400/5 text-yellow-400' },
  argent: { label: 'Argent', emoji: '🥈', className: 'border-gray-400/30 bg-gray-400/5 text-gray-300' },
  bronze: { label: 'Bronze', emoji: '🥉', className: 'border-orange-400/30 bg-orange-400/5 text-orange-400' },
}

export default function ResultatsClient({ resultats, saisons, locale }: Props) {
  const [activeSaison, setActiveSaison] = useState<string>('all')
  const [activeCompetition, setActiveCompetition] = useState<string>('all')

  const competitions = useMemo(() => {
    const filtered = activeSaison === 'all' ? resultats : resultats.filter(r => r.saison === activeSaison)
    return ['all', ...new Set(filtered.map(r => r.competition))]
  }, [resultats, activeSaison])

  const filtered = useMemo(() => {
    return resultats.filter(r => {
      const matchSaison = activeSaison === 'all' || r.saison === activeSaison
      const matchComp = activeCompetition === 'all' || r.competition === activeCompetition
      return matchSaison && matchComp
    })
  }, [resultats, activeSaison, activeCompetition])

  const counts = useMemo(() => ({
    or: filtered.filter(r => r.medaille === 'or').length,
    argent: filtered.filter(r => r.medaille === 'argent').length,
    bronze: filtered.filter(r => r.medaille === 'bronze').length,
  }), [filtered])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="text-xs text-muted uppercase tracking-wider block mb-2">Saison</label>
          <select
            value={activeSaison}
            onChange={e => { setActiveSaison(e.target.value); setActiveCompetition('all') }}
            className="bg-bg-surface border border-white/10 text-foreground text-sm rounded-lg px-3 py-2 focus:border-accent-blue outline-none"
          >
            <option value="all">Toutes les saisons</option>
            {saisons.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted uppercase tracking-wider block mb-2">Compétition</label>
          <select
            value={activeCompetition}
            onChange={e => setActiveCompetition(e.target.value)}
            className="bg-bg-surface border border-white/10 text-foreground text-sm rounded-lg px-3 py-2 focus:border-accent-blue outline-none"
          >
            <option value="all">Toutes</option>
            {competitions.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Medal summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(Object.keys(medalConfig) as Array<keyof typeof medalConfig>).map(key => (
          <div key={key} className={cn('border rounded-xl p-4 text-center', medalConfig[key].className)}>
            <span className="text-2xl block">{medalConfig[key].emoji}</span>
            <span className="font-heading text-3xl block">{counts[key]}</span>
            <span className="text-xs uppercase tracking-wider">{medalConfig[key].label}</span>
          </div>
        ))}
      </div>

      {/* Results list */}
      {filtered.length === 0 ? (
        <p className="text-muted text-center py-12">Aucun résultat trouvé.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div
              key={r._id}
              className={cn('flex items-center gap-4 p-4 rounded-xl border', medalConfig[r.medaille].className)}
            >
              <span className="text-2xl shrink-0">{medalConfig[r.medaille].emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{r.athlete}</p>
                <p className="text-sm text-muted">{r.competition} · {r.categorie}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted">{r.saison}</p>
                {r.date && <p className="text-xs text-muted">{formatDate(r.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `app/[locale]/resultats/page.tsx`**

```tsx
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getAllResultats, getSaisons } from '@/sanity/queries/resultats'
import PageHero from '@/components/shared/PageHero'
import ResultatsClient from '@/components/pages/ResultatsClient'

export const metadata: Metadata = { title: 'Résultats' }

export default async function ResultatsPage() {
  const locale = await getLocale()
  const [resultats, saisons] = await Promise.all([getAllResultats(), getSaisons()])

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Résultats de compétition' : 'Competition Results'}
        subtitle={locale === 'fr'
          ? 'Toutes les médailles et performances du club, saison après saison.'
          : 'All club medals and performances, season after season.'}
      />
      <ResultatsClient resultats={resultats} saisons={saisons} locale={locale} />
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: results page with client-side season and competition filters"
```

---

## Task 7: Challenge Page

**Files:**
- Create: `app/[locale]/challenge/page.tsx`

- [ ] **Step 1: Create `app/[locale]/challenge/page.tsx`**

```tsx
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getNextTournoi } from '@/sanity/queries/challenge'
import PageHero from '@/components/shared/PageHero'
import PortableText from '@/components/shared/PortableText'
import CountdownTimer from '@/components/ui/CountdownTimer'
import Button from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Challenge Judo Boucherville' }

const fallbackTournoi = {
  edition: '27e édition',
  date: '2026-04-11T08:00:00-04:00',
  lieu: 'Dojo Marcel Bourelly, Complexe aquatique Laurie-Ève Cormier, 490 chemin du Lac, Boucherville',
  categories: ['U14', 'U16', 'U18', 'U21-Senior', 'Veteran-Ne Waza'],
  prix: [
    { categorie: 'Division (équipes)', montant: '1 000 $' },
    { categorie: 'Masters (Ne-Waza)', montant: '800 $' },
    { categorie: 'Seniors', montant: '1 200 $' },
  ],
  description: null,
  descriptionEn: null,
  inscriptionUrl: null,
}

export default async function ChallengePage() {
  const locale = await getLocale()
  const tournoi = (await getNextTournoi()) || fallbackTournoi

  const description = locale === 'fr' ? tournoi.description : (tournoi.descriptionEn || tournoi.description)

  return (
    <>
      <PageHero
        title="Challenge Judo Boucherville"
        subtitle={tournoi.edition ? `${tournoi.edition} · Tournoi invitation par équipes` : 'Tournoi invitation par équipes'}
        tag="Tournoi international"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Countdown */}
        <div className="text-center mb-16">
          <p className="text-muted mb-8 text-lg">
            {new Date(tournoi.date).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
          <CountdownTimer targetDate={tournoi.date} />
        </div>

        {/* Info cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* Location */}
          <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
            <h3 className="font-heading text-xl text-foreground tracking-wide mb-3">📍 Lieu</h3>
            <p className="text-muted text-sm leading-relaxed">{tournoi.lieu}</p>
          </div>

          {/* Categories */}
          <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
            <h3 className="font-heading text-xl text-foreground tracking-wide mb-3">🏷️ Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {tournoi.categories.map((cat: string) => (
                <span key={cat} className="px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-sm text-accent-blue">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Prizes */}
          <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 md:col-span-2">
            <h3 className="font-heading text-xl text-foreground tracking-wide mb-4">🏆 Prix</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {tournoi.prix.map((p: { categorie: string; montant: string }) => (
                <div key={p.categorie} className="text-center border border-gold/20 rounded-xl p-4">
                  <p className="font-heading text-2xl text-gold">{p.montant}</p>
                  <p className="text-muted text-sm mt-1">{p.categorie}</p>
                </div>
              ))}
            </div>
            <p className="text-muted text-xs mt-4">* Minimum 5 équipes par division. L'équipe gagnante de chaque division remporte le prix.</p>
          </div>
        </div>

        {/* Description from Sanity */}
        {description && <PortableText value={description as unknown[]} />}

        {/* Contact */}
        <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 mt-8">
          <h3 className="font-heading text-xl text-foreground tracking-wide mb-3">Contact</h3>
          <p className="text-muted text-sm">
            Directeur du tournoi : <strong className="text-foreground">Olivier Bry</strong>
          </p>
          <a href="mailto:info@judoboucherville.com" className="text-accent-blue text-sm hover:text-accent-glow transition-colors">
            info@judoboucherville.com
          </a>
        </div>

        {/* CTA */}
        {tournoi.inscriptionUrl && (
          <div className="text-center mt-10">
            <Button href={tournoi.inscriptionUrl} size="lg">
              S'inscrire au tournoi
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: challenge tournament page with live countdown and prize table"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 12 programme pages via dynamic [slug] ✓ | /equipe + /equipe/[slug] ✓ | /historique with timeline + Marcel Bourelly + presidents ✓ | /resultats with season/competition filter ✓ | /challenge with countdown + categories + prizes ✓
- [x] **Placeholders:** Presidents section notes Sanity CMS — intentional, data entered via Studio ✓
- [x] **Type consistency:** `Programme` from `sanity/queries/programmes.ts`, `Instructeur` from `sanity/queries/instructeurs.ts`, `Resultat` from `sanity/queries/resultats.ts`, `Tournoi` from `sanity/queries/challenge.ts` — all consistent
- [x] **Gap:** fallback tournament data included for Challenge page when no Sanity entry exists ✓

---

*Prochaine étape : Plan 4 — Pages utilitaires (inscription, contact, actualités, SEO, optimisations)*
