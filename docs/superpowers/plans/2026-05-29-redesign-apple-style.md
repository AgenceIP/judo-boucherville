# Redesign Apple-Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every visible surface of the Judo Boucherville site with a premium Apple-style dark aesthetic, a GSAP-pinned video-scrub hero, and scroll-triggered reveals throughout.

**Architecture:** All home sections are `'use client'` components with GSAP ScrollTrigger or Framer Motion animations. The hero uses a sticky wrapper + scroll event to scrub a locally-hosted video. Inner pages use a shared `useReveal` hook for IntersectionObserver reveals.

**Tech Stack:** Next.js 16 App Router · Tailwind CSS 4 · GSAP 3 + `@gsap/react` · Framer Motion 12 · Bebas Neue (heading font, already loaded)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `public/videos/hero.mp4` | Create | Higgsfield video downloaded locally |
| `styles/globals.css` | Modify | Add `animate-fade-in`, `animate-reveal` keyframes |
| `components/layout/Navigation.tsx` | Modify | Visual polish: taller bar, refined links |
| `components/home/HeroSection.tsx` | Rewrite | Sticky video-scrub hero with 3 chapters |
| `components/home/StatsSection.tsx` | Rewrite | Dark rows, gold numbers, GSAP stagger |
| `components/home/ProgrammesSection.tsx` | Modify | Visual polish, stagger entrance |
| `components/home/ClubSection.tsx` | Modify | Visual polish, keep parallax + timeline |
| `components/home/TeamSection.tsx` | Modify | Stagger entrance, visual polish |
| `components/home/AchievementsSection.tsx` | Modify | Visual polish |
| `components/home/ChallengeSection.tsx` | Rewrite | Atmospheric dark bg, GSAP reveal |
| `components/home/NewsSection.tsx` | Modify | Visual polish (already minimal) |
| `components/home/CtaSection.tsx` | Rewrite | Full-bleed with noise, gold CTA |
| `components/shared/PageHero.tsx` | Rewrite | Parallax + animated entrance |
| `hooks/useReveal.ts` | Create | Shared IntersectionObserver hook |

---

## Task 1: Generate & host hero video

**Files:**
- Create: `public/videos/hero.mp4`

- [ ] **Step 1: Check if Cinema Studio 3.0 is available**

```bash
higgsfield model list --json | grep -i "cinema\|studio" | head -20
```

- [ ] **Step 2: Generate with the best available model**

If `cinema_studio_video_3_0` exists:
```bash
higgsfield generate create cinema_studio_video_3_0 \
  --prompt "Cinematic ultra slow-motion judo match, two judokas in white gis, powerful ippon seoi-nage throw, dramatic arena spotlight from above, deep black background, dark red tatami mat, photorealistic, no CGI, film grain, shot on ARRI Alexa, breathtaking action, high contrast" \
  --duration 12 \
  --aspect_ratio 16:9 \
  --resolution 1080p \
  --wait
```

If not, use Seedance 2.0:
```bash
higgsfield generate create seedance_2_0 \
  --prompt "Cinematic ultra slow-motion judo match, two judokas in white gis, powerful ippon throw, dramatic spotlight lighting from above, deep black background, dark red tatami mat, photorealistic, film grain, shot on ARRI Alexa, breathtaking action, high contrast, no CGI" \
  --duration 12 \
  --aspect_ratio 16:9 \
  --resolution 1080p \
  --genre action \
  --wait
```

- [ ] **Step 3: Download video to public/videos/**

```bash
mkdir -p "public/videos"
curl -L "<URL_FROM_STEP_2>" -o "public/videos/hero.mp4"
```

- [ ] **Step 4: Verify file exists and has reasonable size**

```bash
ls -lh public/videos/hero.mp4
# Expected: > 5MB
```

- [ ] **Step 5: Commit**

```bash
git add public/videos/hero.mp4
git commit -m "assets: add Higgsfield hero video"
```

---

## Task 2: globals.css — animation utilities

**Files:**
- Modify: `styles/globals.css`

- [ ] **Step 1: Add keyframes and utilities after existing animations**

Open `styles/globals.css` and append after the existing `@keyframes glow-pulse` block:

```css
/* Chapter transition fade-in */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Section scroll reveal (used by useReveal hook) */
.reveal-hidden {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-hidden.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays for reveal children */
.reveal-stagger > *:nth-child(1) { transition-delay: 0ms; }
.reveal-stagger > *:nth-child(2) { transition-delay: 80ms; }
.reveal-stagger > *:nth-child(3) { transition-delay: 160ms; }
.reveal-stagger > *:nth-child(4) { transition-delay: 240ms; }
.reveal-stagger > *:nth-child(5) { transition-delay: 320ms; }
.reveal-stagger > *:nth-child(6) { transition-delay: 400ms; }
```

- [ ] **Step 2: Commit**

```bash
git add styles/globals.css
git commit -m "style: add fade-in and scroll-reveal animation utilities"
```

---

## Task 3: useReveal hook

**Files:**
- Create: `hooks/useReveal.ts`

- [ ] **Step 1: Create the hook**

```typescript
// hooks/useReveal.ts
import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.classList.add('reveal-hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
```

- [ ] **Step 2: Write render test**

Create `hooks/useReveal.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('useReveal', () => {
  it('exports a function', async () => {
    const { useReveal } = await import('./useReveal')
    expect(typeof useReveal).toBe('function')
  })
})
```

- [ ] **Step 3: Run test**

```bash
npm run test -- hooks/useReveal.test.ts
# Expected: PASS
```

- [ ] **Step 4: Commit**

```bash
git add hooks/useReveal.ts hooks/useReveal.test.ts
git commit -m "feat: add useReveal hook for scroll-triggered section reveals"
```

---

## Task 4: Navigation — visual polish

**Files:**
- Modify: `components/layout/Navigation.tsx`

The nav logic is solid. Changes: taller bar on desktop (h-20 always), logo with gold dot replaced by slash, link hover underline instead of color change, CTA button rounded pill with gold bg.

- [ ] **Step 1: Update Navigation.tsx**

Replace the full file content:

```tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const programmes = [
  { href: '/programmes/judo-competition', labelFr: 'Judo compétition', category: 'Judo' },
  { href: '/programmes/judo-enfants', labelFr: 'Judo enfants', category: 'Judo' },
  { href: '/programmes/judo-adultes', labelFr: 'Judo adultes', category: 'Judo' },
  { href: '/programmes/parents-enfants', labelFr: 'Parents/enfants', category: 'Judo' },
  { href: '/programmes/sport-etudes', labelFr: 'Sport-études', category: 'Judo' },
  { href: '/programmes/judo-aines', labelFr: 'Judo aînés', category: 'Judo' },
  { href: '/programmes/aiki-jujitsu', labelFr: 'Aiki Ju-Jitsu', category: 'Arts martiaux' },
  { href: '/programmes/jiu-jitsu-bresilien', labelFr: 'Jiu-Jitsu Brésilien', category: 'Arts martiaux' },
  { href: '/programmes/camp-de-jour', labelFr: 'Camp de jour', category: 'Autres' },
]

const navLinks = [
  { href: '/equipe', key: 'equipe' },
  { href: '/historique', key: 'historique' },
  { href: '/resultats', key: 'resultats' },
  { href: '/challenge', key: 'challenge' },
  { href: '/actualites', key: 'actualites' },
  { href: '/contact', key: 'contact' },
]

export default function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [programmesOpen, setProgrammesOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const categories = [...new Set(programmes.map(p => p.category))]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled
        ? 'bg-black/90 backdrop-blur-xl border-b border-white/[0.06]'
        : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href={`/${locale}`} className="group flex items-center gap-2">
            <span className="font-heading text-2xl text-white tracking-[.15em]">
              JUDO
            </span>
            <span className="w-[1px] h-5 bg-gold/60 group-hover:bg-gold transition-colors" />
            <span className="font-heading text-2xl text-gold tracking-[.15em]">
              BOUCHERVILLE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setProgrammesOpen(true)}
              onMouseLeave={() => setProgrammesOpen(false)}
            >
              <button className="text-[11px] text-muted hover:text-white transition-colors tracking-[.12em] uppercase font-medium py-2 flex items-center gap-1">
                {t('programmes')}
                <span className="opacity-60 text-[9px]">▾</span>
              </button>

              <AnimatePresence>
                {programmesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[560px] bg-black/95 backdrop-blur-xl border border-white/10 p-6 grid grid-cols-3 gap-6"
                  >
                    {categories.map(cat => (
                      <div key={cat}>
                        <p className="text-[10px] text-gold/70 font-semibold uppercase tracking-[.2em] mb-3">{cat}</p>
                        {programmes.filter(p => p.category === cat).map(prog => (
                          <Link
                            key={prog.href}
                            href={`/${locale}${prog.href}`}
                            className="block text-[12px] text-muted hover:text-white py-1.5 transition-colors"
                          >
                            {prog.labelFr}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={cn(
                  'text-[11px] tracking-[.12em] uppercase font-medium transition-colors',
                  pathname.startsWith(`/${locale}${link.href}`)
                    ? 'text-gold'
                    : 'text-muted hover:text-white'
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              href={`/${locale === 'fr' ? 'en' : 'fr'}${pathname.slice(`/${locale}`.length)}`}
              className="text-[11px] text-muted hover:text-white transition-colors tracking-[.12em] uppercase"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </Link>
            <Link
              href={`/${locale}/inscription`}
              className="text-[11px] font-bold tracking-[.1em] uppercase bg-gold text-black px-5 py-2.5 hover:bg-accent-glow transition-colors"
            >
              {t('inscription')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-8 space-y-1">
              {programmes.map((prog, i) => (
                <motion.div
                  key={prog.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/${locale}${prog.href}`}
                    className="block text-sm text-muted hover:text-white py-2 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {prog.labelFr}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-5 border-t border-white/[0.06] space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (programmes.length + i) * 0.03 }}
                  >
                    <Link
                      href={`/${locale}${link.href}`}
                      className="block text-sm text-foreground hover:text-gold py-2 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4">
                  <Link
                    href={`/${locale}/inscription`}
                    className="block text-center text-sm font-bold tracking-widest uppercase bg-gold text-black px-6 py-3 mt-2"
                  >
                    {t('inscription')}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Step 2: Verify it renders**

```bash
npm run dev
# Open http://localhost:3000/fr — nav should be transparent, blur on scroll
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/Navigation.tsx
git commit -m "feat: navigation visual polish — blur, gold CTA, tighter tracking"
```

---

## Task 5: HeroSection — pinned video scrub

**Files:**
- Rewrite: `components/home/HeroSection.tsx`

This is the most complex task. The wrapper is `400vh` tall; the inner div is `position: sticky; top: 0; height: 100vh`. Scroll progress is derived from how far the sticky element has scrolled within its parent. Video `currentTime` is set directly from progress.

- [ ] **Step 1: Write the component**

```tsx
'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

const VIDEO_SRC = '/videos/hero.mp4'

const chapters = [
  {
    num: '01 / 03',
    theme: "L'excellence",
    titleFr: ['JUDO', 'BOUCHERVILLE'],
    titleEn: ['JUDO', 'BOUCHERVILLE'],
    descFr: '55 ans de tradition martiale. La technique parfaite naît de la répétition.',
    descEn: '55 years of martial tradition. Perfect technique is born from repetition.',
    cta: false,
  },
  {
    num: '02 / 03',
    theme: 'La maîtrise',
    titleFr: ['LA PRISE', 'PARFAITE'],
    titleEn: ['THE PERFECT', 'THROW'],
    descFr: "Chaque projection — le fruit de milliers d'heures sous la direction de champions 7e dan.",
    descEn: 'Every throw — thousands of hours under the guidance of 7th dan champions.',
    cta: false,
  },
  {
    num: '03 / 03',
    theme: 'Ta place',
    titleFr: ['REJOINS', 'LE CLUB'],
    titleEn: ['JOIN', 'THE CLUB'],
    descFr: "Débutant ou compétiteur. Enfant ou adulte. Le judo de Boucherville t'attend.",
    descEn: 'Beginner or competitor. Child or adult. Judo Boucherville awaits you.',
    cta: true,
  },
]

export default function HeroSection() {
  const locale = useLocale()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [chapter, setChapter] = useState(0)

  const onScroll = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const scrollable = wrapper.offsetHeight - window.innerHeight
    const scrolled = window.scrollY - wrapper.offsetTop
    const p = Math.max(0, Math.min(1, scrolled / scrollable))

    setProgress(p)
    setChapter(p < 0.34 ? 0 : p < 0.67 ? 1 : 2)

    const vid = videoRef.current
    if (vid && vid.readyState >= 2 && vid.duration) {
      vid.currentTime = p * vid.duration
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const ch = chapters[chapter]
  const title = locale === 'en' ? ch.titleEn : ch.titleFr
  const desc  = locale === 'en' ? ch.descEn  : ch.descFr

  return (
    <div ref={wrapperRef} style={{ position: 'relative', height: '400vh' }}>
      {/* Gold progress bar — fixed to viewport top */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-gold pointer-events-none"
        style={{ width: `${progress * 100}%`, transition: 'width 60ms linear' }}
      />

      {/* Sticky hero panel */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base/30 to-transparent" />

        {/* Text content — changes with chapter */}
        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-20">
          <p
            key={`num-${chapter}`}
            className="text-gold text-[11px] tracking-[.4em] uppercase mb-3 animate-fade-in"
          >
            {ch.num}&nbsp;&nbsp;·&nbsp;&nbsp;{ch.theme}
          </p>
          <h1
            key={`title-${chapter}`}
            className="font-heading leading-[.88] tracking-tight text-white mb-5 animate-fade-in"
            style={{ fontSize: 'clamp(68px, 12vw, 148px)' }}
          >
            {title[0]}<br />
            <span className="text-gold">{title[1]}</span>
          </h1>
          <p
            key={`desc-${chapter}`}
            className="text-muted text-base md:text-lg max-w-lg mb-8 leading-relaxed animate-fade-in"
          >
            {desc}
          </p>
          {ch.cta && (
            <div key="cta" className="flex flex-wrap gap-4 animate-fade-in">
              <Link
                href={`/${locale}/inscription`}
                className="font-heading tracking-widest uppercase bg-gold text-black px-8 py-4 text-lg hover:bg-accent-glow transition-colors"
              >
                S&apos;inscrire
              </Link>
              <Link
                href={`/${locale}/programmes`}
                className="font-heading tracking-widest uppercase border border-white/40 text-white px-8 py-4 text-lg hover:border-gold hover:text-gold transition-colors"
              >
                Programmes
              </Link>
            </div>
          )}
        </div>

        {/* Chapter indicators — right side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
          {chapters.map((_, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full transition-all duration-500"
              style={{
                height: i === chapter ? '24px' : '8px',
                background: i === chapter ? '#C9A227' : 'rgba(201,162,39,0.2)',
              }}
            />
          ))}
        </div>

        {/* Scroll hint — chapter 0 only */}
        {chapter === 0 && (
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in">
            <div className="w-[1px] h-8 bg-gold/40" />
            <p className="text-muted text-[9px] tracking-[.4em] uppercase">Défiler</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write logic test for chapter thresholds**

Create `components/home/HeroSection.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

function getChapter(p: number): number {
  return p < 0.34 ? 0 : p < 0.67 ? 1 : 2
}

describe('HeroSection chapter logic', () => {
  it('returns chapter 0 at 0% progress', () => {
    expect(getChapter(0)).toBe(0)
  })
  it('returns chapter 0 just below 34%', () => {
    expect(getChapter(0.339)).toBe(0)
  })
  it('returns chapter 1 at 34%', () => {
    expect(getChapter(0.34)).toBe(1)
  })
  it('returns chapter 2 at 67%', () => {
    expect(getChapter(0.67)).toBe(2)
  })
  it('returns chapter 2 at 100%', () => {
    expect(getChapter(1)).toBe(2)
  })
})
```

- [ ] **Step 3: Run test**

```bash
npm run test -- components/home/HeroSection.test.ts
# Expected: 5 passing
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
# Open http://localhost:3000/fr
# Scroll slowly — video should scrub, chapters should change, progress bar should advance
```

- [ ] **Step 5: Commit**

```bash
git add components/home/HeroSection.tsx components/home/HeroSection.test.ts
git commit -m "feat: hero section — pinned video scrub with 3 chapters"
```

---

## Task 6: StatsSection redesign

**Files:**
- Rewrite: `components/home/StatsSection.tsx`

Dark background, gold oversized numbers, horizontal rows with stagger animation. Uses existing `AnimatedCounter` component.

- [ ] **Step 1: Rewrite StatsSection.tsx**

```tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 174, suffix: '', label: 'Médailles aux championnats provinciaux & nationaux', desc: '2002–2024' },
  { value: 55,  suffix: '+', label: "Années d'excellence", desc: 'Fondé en 1970 par Marcel Bourelly' },
  { value: 2,   suffix: '', label: 'Olympiens formés au club', desc: 'Jeux olympiques' },
  { value: 245, suffix: '', label: 'Membres actifs en 2026', desc: 'Judokas, ceintures noires et compétiteurs' },
]

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.stat-row', {
      opacity: 0,
      x: -24,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-bg-base">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="stat-row border-t border-white/[0.06] group hover:border-gold/30 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-8 md:py-10 flex items-center gap-8 md:gap-12">
            <span
              className="font-heading text-gold leading-none shrink-0 tabular-nums"
              style={{ fontSize: 'clamp(64px, 8vw, 130px)', width: 'clamp(120px, 18vw, 280px)', textAlign: 'right' }}
            >
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            </span>
            <div className="border-l border-white/[0.08] pl-8 md:pl-12 group-hover:border-gold/20 transition-colors duration-300">
              <p className="font-heading text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-wider leading-tight">
                {stat.label}
              </p>
              <p className="text-muted text-sm mt-1.5">{stat.desc}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="border-t border-white/[0.06]" />
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/StatsSection.tsx
git commit -m "feat: stats section — dark redesign with gold animated counters"
```

---

## Task 7: ProgrammesSection — polish & stagger

**Files:**
- Modify: `components/home/ProgrammesSection.tsx`

Keep existing filter/grid logic. Add scroll-triggered stagger reveal and update card visuals.

- [ ] **Step 1: Update ProgrammesSection.tsx**

```tsx
'use client'
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import ProgrammeCard from '@/components/ui/ProgrammeCard'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/useReveal'

const programmesData = [
  { titre: 'Judo compétition', description: "Pour les athlètes visant l'excellence aux niveaux provincial, national et international.", horaire: 'Lun–Ven 18h00–19h00', slug: 'judo-competition', categorie: 'adultes' as const, icon: '🏆' },
  { titre: 'Judo enfants', description: 'Initiation aux principes du judo, développement moteur et socialisation pour les jeunes.', horaire: 'Sam 10h15–12h30', slug: 'judo-enfants', categorie: 'enfants' as const, icon: '👶' },
  { titre: 'Judo adultes', description: 'Acquérir des techniques efficaces, compétitionner ou simplement être en forme.', horaire: 'Lun/Mer 19h00–21h00', slug: 'judo-adultes', categorie: 'adultes' as const, icon: '💪' },
  { titre: 'Parents/Enfants', description: 'Un cours unique pour partager le judo en famille.', horaire: 'Sam 9h00–10h00', slug: 'parents-enfants', categorie: 'enfants' as const, icon: '👨‍👧' },
  { titre: 'Aiki Ju-Jitsu', description: 'Art martial complet : projections, contrôles articulaires, percussions.', horaire: 'Mar/Jeu 20h00–21h30', slug: 'aiki-jujitsu', categorie: 'arts-martiaux' as const, icon: '⚡' },
  { titre: 'Jiu-Jitsu Brésilien', description: 'Maîtriser les principes du BJJ debout et au sol. Pour 15 ans et +.', horaire: 'Mar/Jeu 19h45–21h00', slug: 'jiu-jitsu-bresilien', categorie: 'arts-martiaux' as const, icon: '🌀' },
  { titre: 'Sport-études', description: "Programme élite en partenariat avec l'École secondaire De Mortagne.", horaire: 'Selon école', slug: 'sport-etudes', categorie: 'adultes' as const, icon: '📚' },
  { titre: 'Judo aînés', description: 'Pratiquer le judo à tout âge dans un environnement adapté.', horaire: 'Horaire à confirmer', slug: 'judo-aines', categorie: 'adultes' as const, icon: '🧘' },
  { titre: 'Camp de jour', description: 'Découvrez le judo cet été!', horaire: 'Été', slug: 'camp-de-jour', categorie: 'enfants' as const, icon: '☀️' },
]

const filters = ['all', 'enfants', 'adultes', 'arts-martiaux'] as const

export default function ProgrammesSection() {
  const t = useTranslations('home')
  const [active, setActive] = useState<typeof filters[number]>('all')
  const titleRef = useReveal<HTMLDivElement>()

  const filtered = active === 'all' ? programmesData : programmesData.filter(p => p.categorie === active)

  return (
    <section className="py-28 md:py-36 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="mb-16">
          <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-4">Disciplines</p>
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('programmes_title')}
          </h2>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-12 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                'px-5 py-2 text-[11px] tracking-[.15em] uppercase font-medium transition-all duration-200',
                active === f
                  ? 'bg-gold text-black'
                  : 'border border-white/10 text-muted hover:border-gold/40 hover:text-gold'
              )}
            >
              {f === 'all' ? t('programmes_filter_all')
                : f === 'enfants' ? t('programmes_filter_children')
                : f === 'adultes' ? t('programmes_filter_adults')
                : t('programmes_filter_martial')}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((prog, i) => (
              <motion.div
                key={prog.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProgrammeCard {...prog} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ProgrammesSection.tsx
git commit -m "feat: programmes section — stagger reveal, gold filter pills"
```

---

## Task 8: ClubSection — visual polish

**Files:**
- Modify: `components/home/ClubSection.tsx`

Keep existing parallax + timeline logic. Update section bg, typography scale, and timeline dot style.

- [ ] **Step 1: Update ClubSection.tsx**

```tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  { year: '1970', label: 'Fondation', desc: 'Marcel Bourelly fonde le club "Kowakan - Shukokaé" au centre La Seigneurie.' },
  { year: '1979', label: 'Incorporation', desc: 'Devient "Club de Judo Boucherville Inc." — 1er club au Québec en membres et résultats.' },
  { year: '2008', label: 'Centre régional', desc: 'Désigné Centre Régional de Développement (CRD) par Judo Québec.' },
  { year: '2017', label: 'Nouveau dojo', desc: 'Inauguration du Dojo Marcel Bourelly au Complexe aquatique Laurie-Ève Cormier.' },
  { year: '2026', label: "Aujourd'hui", desc: '245 membres, club AAA, et une tradition d\'excellence depuis 55 ans.' },
]

export default function ClubSection() {
  const t = useTranslations('home')
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useReveal<HTMLDivElement>()

  useGSAP(() => {
    gsap.to(imageRef.current, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    gsap.from('.timeline-item', {
      opacity: 0,
      x: -20,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.timeline-item',
        start: 'top 85%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-28 md:py-36 bg-bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Left */}
          <div>
            <div ref={titleRef} className="mb-10">
              <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-4">Notre histoire</p>
              <h2 className="font-heading text-[clamp(48px,7vw,90px)] text-white leading-[.9] tracking-tight">
                {t('club_title')}
              </h2>
            </div>
            <p className="text-muted leading-relaxed mb-12 text-base max-w-lg">
              Le Club de Judo Boucherville, fondé en 1970 par Marcel Bourelly, est aujourd&apos;hui le
              premier club de judo au Québec. Reconnu AAA par Judo Québec, il a formé plus de
              50 ceintures noires et des dizaines de champions provinciaux et nationaux.
            </p>

            <div className="relative pl-8 border-l border-white/[0.08]">
              {timeline.map(item => (
                <div key={item.year} className="timeline-item mb-8 last:mb-0 relative">
                  <div className="absolute -left-[37px] w-3 h-3 rounded-full bg-gold border-2 border-bg-surface" />
                  <span className="font-heading text-gold text-2xl">{item.year}</span>
                  <p className="font-semibold text-white text-sm mt-0.5">{item.label}</p>
                  <p className="text-muted text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: dojo photo */}
          <div className="relative h-[520px] overflow-hidden">
            <div ref={imageRef} className="absolute inset-0 scale-110">
              <Image
                src="/images/scraped/Autre_dojo.jpg"
                alt="Dojo Marcel Bourelly — Club de Judo Boucherville"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/40 to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ClubSection.tsx
git commit -m "feat: club section — visual polish, gold timeline dots"
```

---

## Task 9: TeamSection — stagger entrance

**Files:**
- Modify: `components/home/TeamSection.tsx`

Add stagger reveal. Section bg unified with site dark theme.

- [ ] **Step 1: Update TeamSection.tsx**

```tsx
'use client'
import { useTranslations, useLocale } from 'next-intl'
import InstructorCard from '@/components/ui/InstructorCard'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

const instructors = [
  { nom: 'Fayçal Bousbiat', grade: '7e dan', role: 'Directeur technique', disciplines: ['judo', 'kata'], slug: 'faycal-bousbiat' },
  { nom: 'Daniel De Angelis', grade: '7e dan', role: 'Professeur', disciplines: ['judo', 'kata'], slug: 'daniel-de-angelis' },
  { nom: 'Donald Ferland', grade: '6e dan', role: 'Professeur', disciplines: ['judo', 'kata'], slug: 'donald-ferland' },
  { nom: 'Sylvain Yargeau', grade: '4e dan', role: 'Professeur Aiki Ju-Jitsu', disciplines: ['aiki-jujitsu'], slug: 'sylvain-yargeau' },
]

export default function TeamSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const titleRef = useReveal<HTMLDivElement>()
  const gridRef = useReveal<HTMLDivElement>()

  return (
    <section className="py-28 md:py-36 bg-bg-base">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="mb-14">
          <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-4">Corps enseignant</p>
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('team_title')}
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12 reveal-stagger">
          {instructors.map(i => (
            <InstructorCard key={i.slug} {...i} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/equipe`}
            className="inline-flex font-heading tracking-widest uppercase text-[13px] border border-white/20 text-muted px-8 py-3 hover:border-gold hover:text-gold transition-all duration-200"
          >
            Voir toute l&apos;équipe
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/TeamSection.tsx
git commit -m "feat: team section — stagger reveal via useReveal hook"
```

---

## Task 10: AchievementsSection — visual polish

**Files:**
- Modify: `components/home/AchievementsSection.tsx`

Keep existing data and AnimatedCounter. Update bg and typography.

- [ ] **Step 1: Update AchievementsSection.tsx**

```tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { useTranslations } from 'next-intl'
import { useReveal } from '@/hooks/useReveal'

gsap.registerPlugin(ScrollTrigger)

const achievements = [
  { label: 'Or — provinciaux U15-U16', value: 37, emoji: '🥇' },
  { label: 'Argent — provinciaux U15-U16', value: 23, emoji: '🥈' },
  { label: 'Bronze — provinciaux U15-U16', value: 24, emoji: '🥉' },
  { label: 'Médailles — canadiens 2023', value: 16, emoji: '🏅' },
]

const highlights = [
  { title: 'Championnats du monde Kata', desc: 'Jérôme Lajoie & Jacob St-Jean — 8e place à Cancún 2018' },
  { title: 'Premier club sport-études au Canada', desc: "Programme sport-études à l'École secondaire De Mortagne" },
  { title: 'Temple de la renommée', desc: 'Marcel Bourelly intronisé au Temple de la renommée de Judo Québec' },
]

export default function AchievementsSection() {
  const t = useTranslations('home')
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useReveal<HTMLDivElement>()

  useGSAP(() => {
    gsap.from('.achievement-item', {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
    gsap.from('.highlight-item', {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.highlight-item', start: 'top 85%' },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-28 md:py-36 bg-[#070707] border-y border-gold/[0.12]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="mb-16">
          <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-4">Palmarès</p>
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-gold leading-[.9] tracking-tight">
            {t('achievements_title')}
          </h2>
          <p className="text-muted mt-4 text-sm tracking-wider">2002–2024 · Championnats provinciaux et nationaux</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {achievements.map(a => (
            <div key={a.label} className="achievement-item text-center">
              <span className="text-4xl block mb-3">{a.emoji}</span>
              <div className="font-heading text-gold" style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1 }}>
                <AnimatedCounter end={a.value} />
              </div>
              <p className="text-muted text-xs mt-3 leading-relaxed max-w-[140px] mx-auto">{a.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {highlights.map(item => (
            <div key={item.title} className="highlight-item border border-gold/[0.12] bg-gold/[0.03] p-6">
              <h3 className="font-heading text-base text-gold mb-2 tracking-wider">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/AchievementsSection.tsx
git commit -m "feat: achievements section — dark redesign, gold counters"
```

---

## Task 11: ChallengeSection — atmospheric redesign

**Files:**
- Rewrite: `components/home/ChallengeSection.tsx`

- [ ] **Step 1: Rewrite ChallengeSection.tsx**

```tsx
'use client'
import CountdownTimer from '@/components/ui/CountdownTimer'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useReveal } from '@/hooks/useReveal'

export default function ChallengeSection() {
  const t = useTranslations('challenge')
  const locale = useLocale()
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-36 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0500 0%, #0d0d0d 50%, #080808 100%)' }}
    >
      {/* Subtle gold glow bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201,162,39,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-5">
          {t('edition')}
        </p>
        <h2 className="font-heading text-white leading-[.88] tracking-tight mb-4"
          style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}>
          {t('title')}
        </h2>
        <p className="text-muted text-sm tracking-wider mb-12">
          Dojo Marcel Bourelly &nbsp;·&nbsp; {t('date')}
        </p>

        <div className="mb-12">
          <CountdownTimer targetDate="2026-04-11T08:00:00-04:00" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {['U14', 'U16', 'U18', 'U21-Senior', 'Veteran-Ne Waza'].map(cat => (
            <span
              key={cat}
              className="px-4 py-1.5 border border-gold/20 text-[11px] text-muted tracking-[.15em] uppercase hover:border-gold/50 hover:text-gold transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>

        <Link
          href={`/${locale}/challenge`}
          className="inline-flex font-heading tracking-widest uppercase text-lg bg-gold text-black px-10 py-4 hover:bg-accent-glow transition-colors"
        >
          En savoir plus
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ChallengeSection.tsx
git commit -m "feat: challenge section — atmospheric dark redesign"
```

---

## Task 12: NewsSection — visual polish

**Files:**
- Modify: `components/home/NewsSection.tsx`

Returns `null` when no news — no change needed to logic. Only typography/spacing updates.

- [ ] **Step 1: Update NewsSection.tsx**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { getLatestActualites } from '@/data/actualites'
import { formatDate } from '@/lib/utils'

export default async function NewsSection() {
  const [t, locale] = await Promise.all([getTranslations('home'), getLocale()])
  const news = getLatestActualites(3)
  if (!news.length) return null

  return (
    <section className="py-28 md:py-36 bg-bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-14">
          <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-4">Actualités</p>
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('news_title')}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {news.map(item => (
            <Link
              key={item.id}
              href={`/${locale}/actualites/${item.slug}`}
              className="group block border border-white/[0.06] hover:border-gold/30 transition-colors duration-300"
            >
              <div className="relative h-52 overflow-hidden bg-white/[0.02]">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-5xl text-gold/10">JB</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-muted text-[10px] tracking-[.3em] uppercase mb-3">
                  {formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}
                </p>
                <h3 className="font-heading text-xl text-white group-hover:text-gold transition-colors leading-tight">
                  {locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                </h3>
                {(item.extrait || item.extraitEn) && (
                  <p className="text-muted text-sm mt-3 line-clamp-2 leading-relaxed">
                    {locale === 'fr' ? item.extrait : (item.extraitEn || item.extrait)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/NewsSection.tsx
git commit -m "feat: news section — sharp border cards, gold hover"
```

---

## Task 13: CtaSection — full-bleed redesign

**Files:**
- Rewrite: `components/home/CtaSection.tsx`

- [ ] **Step 1: Rewrite CtaSection.tsx**

```tsx
'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

export default function CtaSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-32 md:py-44 bg-black relative overflow-hidden">
      {/* Amplified noise */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.06, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,162,39,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative text-center max-w-5xl mx-auto px-6">
        <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-8">Rejoindre le club</p>
        <h2
          className="font-heading text-white leading-[.88] tracking-tight mb-8 text-balance"
          style={{ fontSize: 'clamp(64px, 12vw, 160px)' }}
        >
          {t('cta_title')}
        </h2>
        <p className="text-muted text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          {t('cta_subtitle')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/${locale}/inscription`}
            className="font-heading tracking-widest uppercase text-lg bg-gold text-black px-10 py-4 hover:bg-accent-glow transition-colors animate-glow-pulse"
          >
            {t('cta_button')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="font-heading tracking-widest uppercase text-lg border border-white/20 text-white px-10 py-4 hover:border-gold hover:text-gold transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/CtaSection.tsx
git commit -m "feat: CTA section — full-bleed noise + gold glow redesign"
```

---

## Task 14: PageHero — parallax + animated entrance

**Files:**
- Rewrite: `components/shared/PageHero.tsx`

- [ ] **Step 1: Rewrite PageHero.tsx**

```tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
}

export default function PageHero({ title, subtitle, tag, tagColor = 'text-gold' }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Entrance animation
    const tl = gsap.timeline({ delay: 0.1 })
    tl.from(contentRef.current!.children, {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    })

    // Parallax on scroll
    gsap.to(contentRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="pt-36 pb-20 bg-black border-b border-white/[0.06] overflow-hidden">
      <div ref={contentRef} className="max-w-7xl mx-auto px-6 lg:px-12">
        {tag && (
          <span className={`text-[11px] tracking-[.4em] uppercase ${tagColor} block mb-5`}>
            {tag}
          </span>
        )}
        <h1
          className="font-heading text-white tracking-tight leading-[.88]"
          style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted text-lg mt-6 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/shared/PageHero.tsx
git commit -m "feat: PageHero — parallax scroll + animated entrance"
```

---

## Task 15: Footer — dark polish

**Files:**
- Modify: `components/layout/Footer.tsx`

Minor changes: sharper border, gold accents on social icons, tighter type.

- [ ] **Step 1: Update footer border and color references**

In `components/layout/Footer.tsx`, make these targeted changes:

Change line 28 (`className` of `<footer>`):
```tsx
// Before
<footer className="bg-bg-surface border-t border-white/5">
// After
<footer className="bg-[#050505] border-t border-white/[0.06]">
```

Change the social icon hover class (4 instances of `hover:text-accent-blue`):
```tsx
// Before
className="text-muted hover:text-accent-blue transition-colors"
// After
className="text-muted hover:text-gold transition-colors"
```

Change quick links hover (line ~67):
```tsx
// Before
className="text-sm text-foreground hover:text-accent-blue transition-colors"
// After
className="text-sm text-muted hover:text-gold transition-colors"
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat: footer — darker bg, gold hover accents"
```

---

## Task 16: Inner pages — scroll reveals

**Files:**
- Modify: `app/[locale]/equipe/page.tsx`
- Modify: `app/[locale]/programmes/page.tsx`
- Modify: `app/[locale]/resultats/page.tsx`
- Modify: `app/[locale]/challenge/page.tsx`

Each inner page content section gets the `reveal-hidden` class. The `useReveal` hook is used in client components; for Server Components we add `reveal-hidden` directly and rely on CSS.

- [ ] **Step 1: Add reveal to equipe page grid**

In `app/[locale]/equipe/page.tsx`, add to the instructor grid container:
```tsx
// Before
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// After
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 reveal-hidden revealed">
```

Note: inner page sections use `revealed` immediately (no scroll trigger needed — they load into view). The effect is just the entrance animation on page load via PageHero GSAP.

- [ ] **Step 2: Verify all inner pages render**

```bash
npm run dev
# Navigate to /fr/equipe, /fr/programmes, /fr/resultats, /fr/challenge
# Each should show PageHero with parallax entrance, content below
```

- [ ] **Step 3: Commit**

```bash
git add app/
git commit -m "feat: inner pages — scroll reveal on content sections"
```

---

## Task 17: Final QA & build check

- [ ] **Step 1: Run TypeScript check**

```bash
npm run build 2>&1 | tail -30
# Expected: no TypeScript errors, successful build
```

- [ ] **Step 2: Run all tests**

```bash
npm run test
# Expected: all tests pass
```

- [ ] **Step 3: Check lighthouse / web vitals in dev**

```bash
npm run dev
# Open http://localhost:3000/fr
# Check: hero video loads and scrubs smoothly
# Check: all 9 sections visible and animated
# Check: nav blur works on scroll
# Check: mobile menu opens/closes
# Check: inner pages all render
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: Apple-style redesign complete — video scrub hero, scroll animations, dark premium aesthetic"
```
