'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Page-wide scroll life, re-armed on every route: seams draw, photos open,
 * lists cascade, pictures drift a little slower than the page. Content is
 * only hidden once this runs (html.motion-ok), so a page without JS or with
 * reduced motion is simply complete. Loops pause on hidden tabs.
 */
export default function PageLife() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.toggle('motion-ok', !reduced)

    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        el.classList.add('in')
        if (el.classList.contains('cascade')) {
          const n = el.children.length
          setTimeout(() => el.classList.add('done'), 700 + n * 60)
        }
        io.unobserve(el)
      }
    }, { rootMargin: '0px 0px -4% 0px' })
    document.querySelectorAll('[data-reveal-seam], .clip-reveal, .cascade').forEach(el => io.observe(el))

    const tweens = reduced ? [] : gsap.utils.toArray<HTMLElement>('[data-parallax]').map(el =>
      gsap.fromTo(el, { yPercent: -6 }, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    )

    const onVis = () => document.body.classList.toggle('paused', document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      tweens.forEach(t => { t.scrollTrigger?.kill(); t.kill() })
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [pathname])

  return null
}
