'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

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
    ease: 'power2.inOut',
    overwrite: 'auto',
  })

/**
 * The luminance arc. Chapters declare their palette via data-voie-* attributes;
 * the conductor cross-fades the global CSS variables as each chapter arrives,
 * so the whole world (background, ink, nav chrome) darkens from paper-white
 * to black over the journey. Also drives the scroll-velocity skew on titles.
 */
export default function VoieConductor() {
  useGSAP(() => {
    const chapters = gsap.utils.toArray<HTMLElement>('[data-voie-bg]')
    if (!chapters.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = reduced ? 0 : 0.9

    // Land in the first chapter's world immediately — no flash of dark
    apply(readPalette(chapters[0]), 0)

    chapters.forEach((el, i) => {
      // Palette flips exactly at each chapter's start line, both directions —
      // onEnter going down, onLeaveBack restoring the previous chapter going up.
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        onEnter: () => apply(readPalette(el), d),
        onLeaveBack: i > 0 ? () => apply(readPalette(chapters[i - 1]), d) : undefined,
      })
    })

    // Titles lean with the force of the visitor's scroll — jū, yielding
    if (!reduced) {
      const titles = gsap.utils.toArray<HTMLElement>('.voie-title')
      let lastY = window.scrollY
      let skew = 0
      const tick = () => {
        const y = window.scrollY
        const target = gsap.utils.clamp(-4, 4, (y - lastY) * 0.07)
        lastY = y
        skew += (target - skew) * 0.1
        for (const t of titles) gsap.set(t, { skewY: skew, transformOrigin: 'left center' })
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
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
    />
  )
}
