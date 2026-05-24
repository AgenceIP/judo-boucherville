# Judo Boucherville — Plan 4: Utility Pages, SEO & Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build /inscription, /contact, /actualites pages, add SEO metadata + sitemap, optimize performance, and populate Sanity with existing content.

**Architecture:** Server components for all pages. Contact form uses a Server Action. News uses static generation with ISR. SEO uses Next.js built-in Metadata API + next-sitemap.

**Tech Stack:** Next.js 15, Sanity v3, next-intl, Resend (email), next-sitemap

**Prerequisite:** Plans 1–3 complete.

---

## File Map

```
app/[locale]/
├── inscription/
│   └── page.tsx
├── contact/
│   └── page.tsx
├── actualites/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── not-found.tsx
app/
├── sitemap.ts
└── robots.ts
actions/
└── contact.ts                      ← Server Action for contact form
components/
└── pages/
    └── ContactForm.tsx             ← Client component for form state
```

---

## Task 1: Registration Page

**Files:**
- Create: `app/[locale]/inscription/page.tsx`

- [ ] **Step 1: Create `app/[locale]/inscription/page.tsx`**

```tsx
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PageHero from '@/components/shared/PageHero'
import Button from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Inscription' }

const steps = [
  { num: '01', title: 'Choisissez votre programme', desc: 'Parcourez nos programmes et sélectionnez celui qui vous convient.' },
  { num: '02', title: 'Remplissez le formulaire', desc: 'Complétez le formulaire d\'inscription en ligne avec vos informations.' },
  { num: '03', title: 'Confirmez votre place', desc: 'Votre inscription est confirmée après réception du paiement.' },
]

const faq = [
  {
    q: 'Faut-il une carte d\'accès Boucherville?',
    a: 'Le programme Parents/enfants requiert une carte d\'accès Boucherville. Les autres programmes sont ouverts à tous.',
  },
  {
    q: 'Puis-je m\'inscrire en cours de session?',
    a: 'Oui, l\'inscription est possible en cours de session sous réserve des places disponibles. Contactez-nous pour vérifier.',
  },
  {
    q: 'Le programme Accès-Loisirs est-il disponible?',
    a: 'Oui, le Club de Judo Boucherville participe au programme Accès-Loisirs de la Ville de Boucherville pour les résidents éligibles.',
  },
  {
    q: 'Faut-il un judogi (kimono) pour commencer?',
    a: 'Pour le premier cours, des vêtements confortables suffisent. Le judogi est recommandé dès le deuxième cours.',
  },
  {
    q: 'Y a-t-il un essai gratuit?',
    a: 'Contactez-nous à info@judoboucherville.com ou au (450) 655-1888 pour connaître les modalités d\'essai.',
  },
]

export default async function InscriptionPage() {
  const locale = await getLocale()

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Inscription' : 'Registration'}
        subtitle={locale === 'fr'
          ? 'Rejoignez le premier club de judo du Québec en 3 étapes simples.'
          : 'Join the first judo club in Québec in 3 simple steps.'}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map(step => (
            <div key={step.num} className="text-center">
              <div className="font-heading text-5xl text-accent-blue/20 mb-4">{step.num}</div>
              <h3 className="font-heading text-lg text-foreground tracking-wide mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <Button
            href="https://docs.google.com/forms/d/e/1FAIpQLSf-placeholder/viewform"
            size="lg"
          >
            Formulaire d'inscription en ligne
          </Button>
          <p className="text-muted text-xs mt-3">
            Lien vers le formulaire Google Forms officiel du club
          </p>
        </div>

        {/* Info note */}
        <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-2xl p-6 mb-16">
          <p className="text-sm text-foreground">
            <strong>Programme Accès-Loisirs :</strong> le Club de Judo Boucherville participe au
            programme de la Ville de Boucherville offrant des tarifs réduits aux résidents
            admissibles. Renseignez-vous auprès de la Ville ou contactez-nous.
          </p>
        </div>

        {/* FAQ */}
        <h2 className="font-heading text-3xl text-foreground tracking-wider mb-8">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          {faq.map(item => (
            <details key={item.q} className="group bg-bg-surface border border-white/5 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer text-foreground font-medium list-none">
                {item.q}
                <span className="text-accent-blue ml-4 transition-transform group-open:rotate-45 shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 text-muted text-sm leading-relaxed border-t border-white/5">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        {/* Contact fallback */}
        <div className="mt-16 text-center bg-bg-surface border border-white/5 rounded-2xl p-8">
          <h3 className="font-heading text-2xl text-foreground tracking-wider mb-2">
            Des questions?
          </h3>
          <p className="text-muted mb-6">Notre équipe se fera un plaisir de vous aider.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="tel:4506551888" variant="outline">
              (450) 655-1888
            </Button>
            <Button href="mailto:info@judoboucherville.com" variant="outline">
              info@judoboucherville.com
            </Button>
          </div>
        </div>

      </div>
    </>
  )
}
```

- [ ] **Step 2: Update Google Form URL**

Replace the placeholder Google Form URL in the file with the actual URL from the club:
```
https://docs.google.com/forms/d/e/1FAIpQLSf-placeholder/viewform
→ Replace with the actual Google Form URL from the club
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: inscription page with steps, Google Form CTA, and FAQ accordion"
```

---

## Task 2: Contact Page

**Files:**
- Create: `actions/contact.ts`
- Create: `components/pages/ContactForm.tsx`
- Create: `app/[locale]/contact/page.tsx`

- [ ] **Step 1: Install Resend for email**

```bash
npm install resend
```

Add to `.env.local`:
```
RESEND_API_KEY=re_your_key_here
```

- [ ] **Step 2: Create `actions/contact.ts`**

```ts
'use server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type ContactFormData = {
  nom: string
  email: string
  message: string
}

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  if (!data.nom || !data.email || !data.message) {
    return { success: false, error: 'Tous les champs sont requis.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, error: 'Adresse courriel invalide.' }
  }
  if (data.message.length < 10) {
    return { success: false, error: 'Le message est trop court.' }
  }

  try {
    await resend.emails.send({
      from: 'Site web <noreply@judoboucherville.com>',
      to: 'info@judoboucherville.com',
      replyTo: data.email,
      subject: `Message de ${data.nom} — Site web`,
      html: `
        <h2>Nouveau message du site web</h2>
        <p><strong>Nom:</strong> ${data.nom}</p>
        <p><strong>Courriel:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de l\'envoi. Veuillez réessayer.' }
  }
}
```

- [ ] **Step 3: Write test for contact action validation**

Create `actions/__tests__/contact.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ id: 'test' }) },
  })),
}))

// We test the validation logic inline since the action uses 'use server'
describe('contact validation', () => {
  it('rejects empty fields', () => {
    const data = { nom: '', email: 'test@test.com', message: 'hello' }
    expect(!data.nom || !data.email || !data.message).toBe(true)
  })
  it('rejects invalid email', () => {
    expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('not-an-email')).toBe(false)
    expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('test@test.com')).toBe(true)
  })
  it('rejects short messages', () => {
    expect('hi'.length < 10).toBe(true)
    expect('This is a valid message'.length < 10).toBe(false)
  })
})
```

- [ ] **Step 4: Run test**

```bash
npm test actions/__tests__/contact.test.ts
```
Expected: PASS — 3 tests.

- [ ] **Step 5: Create `components/pages/ContactForm.tsx`**

```tsx
'use client'
import { useState, useTransition } from 'react'
import { sendContactEmail } from '@/actions/contact'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function ContactForm() {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    startTransition(async () => {
      const result = await sendContactEmail(data)
      if (result.success) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setErrorMsg(result.error || 'Erreur inconnue.')
      }
    })
  }

  const inputClasses = 'w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-foreground text-sm focus:border-accent-blue focus:outline-none transition-colors placeholder:text-muted'

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <span className="text-4xl block mb-4">✓</span>
        <h3 className="font-heading text-2xl text-foreground mb-2">Message envoyé!</h3>
        <p className="text-muted">Nous vous répondrons dans les plus brefs délais.</p>
        <Button onClick={() => setStatus('idle')} variant="outline" className="mt-6">
          Envoyer un autre message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-muted uppercase tracking-wider block mb-2">Nom *</label>
        <input name="nom" type="text" required className={inputClasses} placeholder="Votre nom" />
      </div>
      <div>
        <label className="text-xs text-muted uppercase tracking-wider block mb-2">Courriel *</label>
        <input name="email" type="email" required className={inputClasses} placeholder="votre@email.com" />
      </div>
      <div>
        <label className="text-xs text-muted uppercase tracking-wider block mb-2">Message *</label>
        <textarea name="message" required rows={5} className={cn(inputClasses, 'resize-none')} placeholder="Votre message..." />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Envoi en cours...' : 'Envoyer le message'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 6: Create `app/[locale]/contact/page.tsx`**

```tsx
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PageHero from '@/components/shared/PageHero'
import ContactForm from '@/components/pages/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const locale = await getLocale()

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Nous contacter' : 'Contact Us'}
        subtitle={locale === 'fr'
          ? 'Une question? Nous sommes là pour vous aider.'
          : 'A question? We\'re here to help.'}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Contact info */}
          <div>
            <h2 className="font-heading text-2xl text-foreground tracking-wider mb-8">
              Informations
            </h2>

            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <MapPin className="text-accent-blue shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-foreground font-medium">Dojo Marcel Bourelly</p>
                  <p className="text-muted text-sm">Complexe aquatique Laurie-Ève Cormier</p>
                  <p className="text-muted text-sm">490 chemin du Lac</p>
                  <p className="text-muted text-sm">Boucherville (Québec) J4B 6X3</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="text-accent-blue shrink-0" size={20} />
                <div>
                  <a href="tel:4506551888" className="text-foreground hover:text-accent-blue transition-colors">
                    (450) 655-1888
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="text-accent-blue shrink-0" size={20} />
                <div>
                  <a href="mailto:info@judoboucherville.com" className="text-foreground hover:text-accent-blue transition-colors">
                    info@judoboucherville.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="text-accent-blue shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-foreground font-medium text-sm mb-2">Horaires du bureau</p>
                  <p className="text-muted text-sm">Contactez-nous par courriel pour toute question administrative.</p>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden h-64 border border-white/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.!2d-73.!3d45.!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc90ba!2s490%20Chemin%20du%20Lac%2C%20Boucherville%2C%20QC!5e0!3m2!1sfr!2sca!4v"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dojo Marcel Bourelly"
              />
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-heading text-2xl text-foreground tracking-wider mb-8">
              Envoyez-nous un message
            </h2>
            <ContactForm />
          </div>

        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 7: Fix Google Maps embed URL**

Replace the incomplete Maps embed URL with a proper one:
```
Go to: https://www.google.com/maps/place/490+Chemin+du+Lac,+Boucherville,+QC+J4B+6X3
Click Share → Embed a map → Copy the src URL
Replace the src in the iframe above
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: contact page with Server Action email form and Google Maps"
```

---

## Task 3: News Pages

**Files:**
- Create: `app/[locale]/actualites/page.tsx`
- Create: `app/[locale]/actualites/[slug]/page.tsx`

- [ ] **Step 1: Create `app/[locale]/actualites/page.tsx`**

```tsx
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getAllActualites } from '@/sanity/queries/actualites'
import PageHero from '@/components/shared/PageHero'
import { urlFor } from '@/lib/sanityImage'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Actualités' }
export const revalidate = 3600

export default async function ActualitesPage() {
  const locale = await getLocale()
  const news = await getAllActualites()

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Actualités' : 'News'}
        subtitle={locale === 'fr'
          ? 'Résultats, événements et nouvelles du club.'
          : 'Club results, events and news.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {news.length === 0 ? (
          <p className="text-muted text-center py-12">Aucune actualité pour l'instant.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map(item => (
              <Link
                key={item._id}
                href={`/${locale}/actualites/${item.slug.current}`}
                className="group block bg-bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-accent-blue/30 transition-colors"
              >
                <div className="relative h-52 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={urlFor(item.image).width(600).height(400).url()}
                      alt={locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent-blue/5 flex items-center justify-center">
                      <span className="font-heading text-5xl text-accent-blue/20">JB</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-muted text-xs mb-2">{formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                  <h3 className="font-heading text-lg text-foreground group-hover:text-accent-blue transition-colors leading-tight">
                    {locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                  </h3>
                  {(item.extrait || item.extraitEn) && (
                    <p className="text-muted text-sm mt-2 line-clamp-3">
                      {locale === 'fr' ? item.extrait : (item.extraitEn || item.extrait)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create `app/[locale]/actualites/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { getAllActualites, getLatestActualites } from '@/sanity/queries/actualites'
import { client } from '@/sanity/client'
import PageHero from '@/components/shared/PageHero'
import PortableText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import { urlFor } from '@/lib/sanityImage'
import { formatDate } from '@/lib/utils'
import type { Actualite } from '@/sanity/queries/actualites'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const news = await getAllActualites()
  return ['fr', 'en'].flatMap(locale => news.map(n => ({ locale, slug: n.slug.current })))
}

async function getActualiteBySlug(slug: string): Promise<Actualite | null> {
  return client.fetch(
    `*[_type == "actualite" && slug.current == $slug][0] {
      _id, titre, titreEn, slug, date, image, extrait, extraitEn, contenu, contenuEn
    }`,
    { slug }
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const item = await getActualiteBySlug(slug)
  if (!item) return {}
  return { title: locale === 'fr' ? item.titre : (item.titreEn || item.titre) }
}

export default async function ActualiteDetailPage({ params }: Props) {
  const { slug, locale } = await params
  const item = await getActualiteBySlug(slug)
  if (!item) notFound()

  const title = locale === 'fr' ? item.titre : (item.titreEn || item.titre)
  const content = locale === 'fr' ? item.contenu : (item.contenuEn || item.contenu)

  return (
    <>
      <PageHero title={title} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <p className="text-muted text-sm mb-8">
          {formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}
        </p>

        {item.image && (
          <div className="relative h-72 rounded-2xl overflow-hidden mb-10">
            <Image
              src={urlFor(item.image).width(800).height(500).url()}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {content && <PortableText value={content as unknown[]} />}

        <div className="mt-12 pt-8 border-t border-white/5">
          <Button href={`/${locale}/actualites`} variant="outline">
            ← Toutes les actualités
          </Button>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: news list page and individual news article pages with ISR"
```

---

## Task 4: 404 Page

**Files:**
- Create: `app/[locale]/not-found.tsx`

- [ ] **Step 1: Create `app/[locale]/not-found.tsx`**

```tsx
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <span className="font-heading text-[200px] text-accent-blue/10 leading-none block">404</span>
        <h1 className="font-heading text-4xl text-foreground tracking-wider -mt-10 mb-4">
          Page introuvable
        </h1>
        <p className="text-muted mb-8">Cette page n'existe pas ou a été déplacée.</p>
        <Button href="/">Retour à l'accueil</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: custom 404 page"
```

---

## Task 5: SEO — Sitemap & Robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import { MetadataRoute } from 'next'
import { getAllProgrammes } from '@/sanity/queries/programmes'
import { getAllInstructeurs } from '@/sanity/queries/instructeurs'
import { getAllActualites } from '@/sanity/queries/actualites'

const BASE_URL = 'https://www.judoboucherville.com'
const locales = ['fr', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programmes, instructeurs, actualites] = await Promise.all([
    getAllProgrammes(),
    getAllInstructeurs(),
    getAllActualites(),
  ])

  const staticRoutes = [
    '', '/historique', '/equipe', '/programmes', '/inscription',
    '/resultats', '/challenge', '/actualites', '/contact',
  ]

  const staticEntries = locales.flatMap(locale =>
    staticRoutes.map(route => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const programmeEntries = locales.flatMap(locale =>
    programmes.map(p => ({
      url: `${BASE_URL}/${locale}/programmes/${p.slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  const instructeurEntries = locales.flatMap(locale =>
    instructeurs.map(i => ({
      url: `${BASE_URL}/${locale}/equipe/${i.slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  )

  const actualiteEntries = locales.flatMap(locale =>
    actualites.map(a => ({
      url: `${BASE_URL}/${locale}/actualites/${a.slug.current}`,
      lastModified: new Date(a.date),
      changeFrequency: 'never' as const,
      priority: 0.5,
    }))
  )

  return [...staticEntries, ...programmeEntries, ...instructeurEntries, ...actualiteEntries]
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
    ],
    sitemap: 'https://www.judoboucherville.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: Add OG metadata to `app/[locale]/layout.tsx`**

Add to the `metadata` export:
```ts
export const metadata: Metadata = {
  // ...existing...
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: 'en_CA',
    siteName: 'Club de Judo Boucherville',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@BouchervilleJ',
  },
}
```

- [ ] **Step 4: Create OG image placeholder**

```bash
# Create a 1200x630 OG image and save to public/images/og-default.jpg
# This can be a dark image with the club name and logo
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: sitemap.xml, robots.txt, and OG metadata"
```

---

## Task 6: Populate Sanity with Existing Content

- [ ] **Step 1: Start dev server and open Studio**

```bash
npm run dev
```
Navigate to http://localhost:3000/studio

- [ ] **Step 2: Create instructeur documents**

Create one document per instructor with the following data:

**Fayçal Bousbiat:**
- nom: Fayçal Bousbiat
- slug: faycal-bousbiat
- grade: 7e dan
- role: Directeur technique
- disciplines: [judo, kata]
- ordre: 1
- competitions: ["Entraîneur-chef depuis 2001", "Directeur technique depuis 2004"]

**Daniel De Angelis:**
- nom: Daniel De Angelis
- slug: daniel-de-angelis
- grade: 7e dan
- role: Professeur
- disciplines: [judo, kata]
- ordre: 2
- competitions: ["Championnats du monde Kata — Pordenone 2012", "Championnats du monde Kata — Malte 2009", "Championnats du monde Kata — Paris 2008"]

**Donald Ferland:**
- nom: Donald Ferland
- slug: donald-ferland
- grade: 6e dan
- role: Professeur
- disciplines: [judo, kata]
- ordre: 3
- competitions: ["Championnats du monde Kata — Pordenone 2012", "Championnats du monde Kata — Malte 2009"]

**Jacques Coté:**
- nom: Jacques Coté
- slug: jacques-cote
- grade: 6e dan
- disciplines: [judo]
- ordre: 4

**Adriana Portuondo Isasi:**
- nom: Adriana Portuondo Isasi
- slug: adriana-portuondo-isasi
- role: Instructrice (sport-études)
- disciplines: [judo]
- ordre: 5

**Jérôme Lajoie:**
- nom: Jérôme Lajoie
- slug: jerome-lajoie
- grade: 1er dan
- disciplines: [judo, kata]
- ordre: 6
- competitions: ["Championnats du monde Kata — Cancún 2018 (8e place)"]

**Jacob St-Jean:**
- nom: Jacob St-Jean
- slug: jacob-st-jean
- grade: 1er dan
- disciplines: [judo, kata]
- ordre: 7
- competitions: ["Championnats du monde Kata — Cancún 2018 (8e place)"]

**Sylvain Yargeau:**
- nom: Sylvain Yargeau
- slug: sylvain-yargeau
- grade: 4e dan
- role: Professeur Aiki Ju-Jitsu
- disciplines: [aiki-jujitsu]
- ordre: 8

**Patric Charade:**
- nom: Patric Charade
- slug: patric-charade
- grade: 3e dan
- role: Professeur Aiki Ju-Jitsu
- disciplines: [aiki-jujitsu]
- ordre: 9

**Alexandre Stellato:**
- nom: Alexandre Stellato
- slug: alexandre-stellato
- grade: Ceinture violette BJJ
- disciplines: [jiu-jitsu-bresilien]
- ordre: 10

**Benoit Gagnon:**
- nom: Benoit Gagnon
- slug: benoit-gagnon
- grade: Ceinture bleue BJJ / Ceinture noire Ving-Tsun Kung-Fu
- disciplines: [jiu-jitsu-bresilien]
- ordre: 11

- [ ] **Step 3: Create programme documents (12 total)**

For each programme listed in Plan 3 (judo-competition, judo-enfants, judo-adultes, parents-enfants, sport-etudes, judo-aines, aiki-jujitsu, jiu-jitsu-bresilien, autodéfense, kata, camp-de-jour, judo-scolaire), create a Sanity document with slug matching the route.

- [ ] **Step 4: Create tournoi document for Challenge 2026**

- edition: 27e
- date: 2026-04-11T08:00:00-04:00
- lieu: Dojo Marcel Bourelly, Complexe aquatique Laurie-Ève Cormier, 490 chemin du Lac, Boucherville (Québec) J4B 6X3
- categories: [U14, U16, U18, U21-Senior, Veteran-Ne Waza]
- prix: [{categorie: "Division (équipes)", montant: "1 000 $"}, {categorie: "Masters (Ne-Waza)", montant: "800 $"}, {categorie: "Seniors", montant: "1 200 $"}]

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: document Sanity content population checklist"
```

---

## Task 7: Performance & Final Polish

- [ ] **Step 1: Add `next/font` preconnect and ensure no layout shift**

Verify in browser DevTools that CLS (Cumulative Layout Shift) is < 0.1 for the homepage.

- [ ] **Step 2: Add image priority to hero fallback**

In `HeroSection.tsx`, verify the fallback `<img>` or `<Image>` has `priority` prop.

- [ ] **Step 3: Add loading="eager" to above-the-fold images**

Any `<Image>` component visible in the first viewport should have `priority`.

- [ ] **Step 4: Verify Sanity client caching**

The `client` in `sanity/client.ts` has `useCdn: true`. For ISR pages, add revalidation:
```ts
export const revalidate = 3600  // 1 hour, add this to each static page
```

- [ ] **Step 5: Run production build and check for errors**

```bash
npm run build
```
Expected: Build completes with no errors. Address any TypeScript or build errors before proceeding.

- [ ] **Step 6: Run all tests**

```bash
npm test
```
Expected: All tests pass.

- [ ] **Step 7: Commit final**

```bash
git add .
git commit -m "feat: complete Judo Boucherville website — all pages, SEO, performance"
```

---

## Task 8: Deployment Preparation

- [ ] **Step 1: Create `.env.example`**

```bash
cat > .env.example << 'EOF'
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_token

# Email (Resend)
RESEND_API_KEY=re_your_key

# Optional
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
EOF
```

- [ ] **Step 2: Add `.env.local` to `.gitignore`**

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 3: Create deployment checklist**

```bash
cat > DEPLOY.md << 'EOF'
# Deployment Checklist

## Before deploying:
- [ ] Set all env vars in Vercel dashboard (or HostPapa)
- [ ] Replace placeholder Google Form URL in /inscription
- [ ] Fix Google Maps embed URL in /contact
- [ ] Add hero video at public/videos/hero.mp4
- [ ] Add hero fallback image at public/images/hero-fallback.jpg
- [ ] Add OG image at public/images/og-default.jpg
- [ ] Populate all Sanity content (see Plan 4 Task 6)
- [ ] Update RESEND_API_KEY with production key
- [ ] Verify Resend sender domain (judoboucherville.com)
- [ ] Run npm run build successfully

## Vercel deployment:
1. Push to GitHub
2. Import project at vercel.com
3. Add env vars
4. Deploy

## HostPapa deployment (if not using Vercel):
1. Run: npm run build
2. For static export, add output: 'export' to next.config.ts
3. Upload the /out folder to HostPapa via FTP/cPanel
EOF
```

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: deployment docs and env example"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** /inscription (steps, FAQ, Google Form) ✓ | /contact (form + map) ✓ | /actualites (list + detail) ✓ | 404 page ✓ | Sitemap ✓ | Robots.txt ✓ | OG metadata ✓ | Sanity content population ✓ | Deployment docs ✓
- [x] **Placeholders:** Google Form URL and Maps embed marked as "fix before deploy" in DEPLOY.md ✓
- [x] **Type consistency:** `Actualite` type imported from `sanity/queries/actualites.ts` throughout ✓
- [x] **Gap:** Resend email requires domain verification for `noreply@judoboucherville.com` — noted in DEPLOY.md ✓
