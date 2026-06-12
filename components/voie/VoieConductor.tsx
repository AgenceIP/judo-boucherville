'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type Palette = { bg: string; ink: string; muted: string; hairline: string }

const readPalette = (el: Element): Palette => ({
  bg: el.getAttribute('data-voie-bg') ?? '#F6F5F2',
  ink: el.getAttribute('data-voie-ink') ?? '#0B0B0D',
  muted: el.getAttribute('data-voie-muted') ?? '#5A5A60',
  hairline: el.getAttribute('data-voie-hairline') ?? 'rgba(11,11,13,0.14)',
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
 * The world conductor. Chapters declare their palette via data-voie-*
 * attributes; on every scroll tick the conductor finds the chapter whose
 * top has crossed 55% of the viewport — measured live with
 * getBoundingClientRect, so pin spacers and layout shifts can never
 * desynchronize it — and cross-fades the global CSS variables.
 */
export default function VoieConductor() {
  useGSAP(() => {
    const chapters = gsap.utils.toArray<HTMLElement>('[data-voie-bg]')
    if (!chapters.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = reduced ? 0 : 1.0

    let current = -1
    const check = (duration: number) => {
      const line = window.innerHeight * 0.55
      let idx = 0
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].getBoundingClientRect().top <= line) idx = i
      }
      if (idx !== current) {
        current = idx
        apply(readPalette(chapters[idx]), duration)
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
    // Back to the light defaults when leaving the homepage
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
