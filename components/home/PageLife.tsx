'use client'
import { useEffect } from 'react'

/** Draws section seams as they enter, and pauses every loop on hidden tabs. */
export default function PageLife() {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }, { rootMargin: '0px 0px -15% 0px' })
    document.querySelectorAll('[data-reveal-seam]').forEach(el => io.observe(el))
    const onVis = () => document.body.classList.toggle('paused', document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [])
  return null
}
