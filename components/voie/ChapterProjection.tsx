'use client'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_SRC = '/videos/hero.mp4'

const PHASES = [
  { jp: '崩し', name: 'Kuzushi', fr: 'Créer le déséquilibre', en: 'Break the balance' },
  { jp: '作り', name: 'Tsukuri', fr: 'Entrer sous le centre', en: 'Enter under the center' },
  { jp: '掛け', name: 'Kake', fr: 'Projeter', en: 'Throw' },
]

/**
 * Chapter 04 — The throw. The screen pins and the visitor performs a judo
 * throw themselves: scroll (or drag, on desktop) drives the video frame by
 * frame through the three real phases of a technique.
 */
export default function ChapterProjection() {
  const locale = useLocale()
  const en = locale === 'en'
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)
  const target = useRef(0)

  // Lerped scrub — seeks feel like film, not a slideshow
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let current = 0
    const tick = () => {
      if (vid.readyState < 2 || !vid.duration) return
      current += (target.current - current) * (reduced ? 1 : 0.12)
      const desired = current * vid.duration
      if (Math.abs(vid.currentTime - desired) > 0.02) vid.currentTime = desired
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  useGSAP(() => {
    let lastPhase = 0
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=260%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        target.current = self.progress
        if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress })
        const idx = Math.min(PHASES.length - 1, Math.floor(self.progress * PHASES.length))
        if (idx !== lastPhase) {
          lastPhase = idx
          setPhase(idx)
        }
      },
    })

    gsap.from('.projection-intro', {
      opacity: 0,
      y: 24,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef })

  // Desktop drag-to-scrub: pulling the screen drives the scroll within the pin
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let startX = 0
    let startScroll = 0
    let dragging = false

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      startX = e.clientX
      startScroll = window.scrollY
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const lenis = (window as Window & { __lenis?: Lenis }).__lenis
      const k = (window.innerHeight * 2.6) / window.innerWidth
      const dest = startScroll + (e.clientX - startX) * k
      if (lenis) lenis.scrollTo(dest, { immediate: true })
      else window.scrollTo(0, dest)
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      try { el.releasePointerCapture(e.pointerId) } catch { /* already released */ }
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-voie-bg="#0C0C0E"
      data-voie-ink="#FAFAFA"
      data-voie-muted="#8A8A8A"
      data-voie-hairline="rgba(250,250,250,0.10)"
      data-cursor="drag"
      className="relative h-screen overflow-hidden select-none touch-pan-y"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E]/85 via-transparent to-[#0C0C0E]/50 pointer-events-none" />

      {/* Intro line */}
      <div className="projection-intro absolute top-28 left-8 md:left-16 lg:left-20 max-w-md">
        <p className="text-[10px] tracking-[.4em] uppercase mb-4 text-white/40">
          {en ? 'Chapter 04 · The throw' : 'Chapitre 04 · La projection'}
        </p>
        <h2 className="voie-title font-heading text-4xl md:text-5xl text-white tracking-wide leading-none">
          {en ? 'PERFORM IT YOURSELF.' : 'EXÉCUTE-LA TOI-MÊME.'}
        </h2>
        <p className="text-sm mt-3 text-white/50 leading-relaxed">
          {en
            ? 'Scroll — or grab the screen — to drive the throw, frame by frame.'
            : "Défile — ou attrape l'écran — pour dérouler la projection, image par image."}
        </p>
      </div>

      {/* The three phases of a technique */}
      <div className="absolute bottom-16 inset-x-8 md:inset-x-16 lg:inset-x-20">
        <div className="flex gap-8 md:gap-16 mb-6">
          {PHASES.map((p, i) => (
            <div
              key={p.name}
              className="transition-opacity duration-500"
              style={{ opacity: phase === i ? 1 : 0.28 }}
            >
              <p className="font-jp text-2xl md:text-3xl text-white/80 mb-1" aria-hidden="true">{p.jp}</p>
              <p className="font-heading text-2xl md:text-4xl text-white tracking-wider leading-none">
                {p.name}
              </p>
              <p className="text-xs md:text-sm text-white/50 mt-1">{en ? p.en : p.fr}</p>
            </div>
          ))}
        </div>
        <div className="h-px bg-white/15">
          <div ref={progressRef} className="h-px origin-left scale-x-0 bg-royal" />
        </div>
      </div>
    </section>
  )
}
