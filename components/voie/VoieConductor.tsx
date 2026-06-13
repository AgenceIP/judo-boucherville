'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Aurora from '@/components/voie/Aurora'

gsap.registerPlugin(ScrollTrigger)

type Palette = { bg: string; ink: string; muted: string; hairline: string }

const readPalette = (el: Element): Palette => ({
  bg: el.getAttribute('data-voie-bg') ?? '#0A0A0A',
  ink: el.getAttribute('data-voie-ink') ?? '#FAFAFA',
  muted: el.getAttribute('data-voie-muted') ?? '#888888',
  hairline: el.getAttribute('data-voie-hairline') ?? 'rgba(250,250,250,0.08)',
})

const apply = (p: Palette, duration: number) =>
  gsap.to(document.documentElement, {
    '--voie-bg': p.bg,
    '--voie-ink': p.ink,
    '--voie-ink-muted': p.muted,
    '--voie-hairline': p.hairline,
    duration,
    ease: 'power3.inOut',
    overwrite: 'auto',
  })

/**
 * The luminance arc. Chapters declare their palette via data-voie-* attributes;
 * the conductor cross-fades the global CSS variables as each chapter arrives,
 * so the whole world (background, ink, nav chrome) darkens from paper-white
 * to black over the journey. Also drives the scroll-velocity skew on titles.
 */
export default function VoieConductor() {
  const auroraRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const chapters = gsap.utils.toArray<HTMLElement>('[data-voie-bg]')
    if (!chapters.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = reduced ? 0 : 1.2

    const setWorld = (el: HTMLElement, duration: number) => {
      apply(readPalette(el), duration)
      // The aurora breathes only over the dark chapters
      gsap.to(auroraRef.current, {
        opacity: el.hasAttribute('data-voie-aurora') ? 1 : 0,
        duration: Math.max(duration, 0.01),
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    }

    // The current chapter is measured live with getBoundingClientRect on
    // every scroll tick — pin spacers and layout shifts can never
    // desynchronize the palette (trigger-based switching could).
    let current = -1
    const check = (duration: number) => {
      const line = window.innerHeight * 0.55
      let idx = 0
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].getBoundingClientRect().top <= line) idx = i
      }
      if (idx !== current) {
        current = idx
        setWorld(chapters[idx], duration)
        window.dispatchEvent(new Event('voie:chapter'))
      }
    }

    // Land in the right world immediately — no flash
    check(0)

    const onScroll = () => check(d)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  })

  useEffect(() => () => {
    // Back to the dark defaults when leaving the homepage
    const s = document.documentElement.style
    s.removeProperty('--voie-bg')
    s.removeProperty('--voie-ink')
    s.removeProperty('--voie-ink-muted')
    s.removeProperty('--voie-hairline')
  }, [])

  return (
    <div
      className="fixed inset-0 -z-30"
      style={{ background: 'var(--voie-bg)' }}
      aria-hidden="true"
    >
      <div ref={auroraRef} className="absolute inset-0 opacity-0">
        <Aurora />
      </div>
    </div>
  )
}
