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
  const barTopRef = useRef<HTMLDivElement>(null)
  const barBottomRef = useRef<HTMLDivElement>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)
  const [phase, setPhase] = useState(0)
  const target = useRef(0)

  // Lerped scrub — seeks feel like film, not a slideshow
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fmt = (s: number) => {
      const m = Math.floor(s / 60)
      const sec = (s % 60).toFixed(1).padStart(4, '0')
      return `${String(m).padStart(2, '0')}:${sec}`
    }
    let current = 0
    const tick = () => {
      if (vid.readyState < 2 || !vid.duration) return
      current += (target.current - current) * (reduced ? 1 : 0.12)
      const desired = current * vid.duration
      if (Math.abs(vid.currentTime - desired) > 0.02) vid.currentTime = desired
      if (timecodeRef.current) {
        timecodeRef.current.textContent = `${fmt(desired)} / ${fmt(vid.duration)}`
      }
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
        // Cinemascope: the letterbox closes in as the film starts, opens at the end
        const p = self.progress
        const bars = Math.min(1, Math.min(p / 0.07, (1 - p) / 0.07))
        if (barTopRef.current) gsap.set(barTopRef.current, { scaleY: bars })
        if (barBottomRef.current) gsap.set(barBottomRef.current, { scaleY: bars })
        const idx = Math.min(PHASES.length - 1, Math.floor(p * PHASES.length))
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
      data-voie-bg="#0B0B0D"
      data-voie-ink="#FFFFFF"
      data-voie-muted="rgba(255,255,255,0.6)"
      data-voie-hairline="rgba(255,255,255,0.2)"
      data-cursor="drag"
      className="scanlines relative h-screen overflow-hidden select-none touch-pan-y"
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

      {/* Cinemascope letterbox */}
      <div ref={barTopRef} className="absolute top-0 inset-x-0 h-[8vh] bg-[#050505] origin-top scale-y-0 z-10 pointer-events-none" />
      <div ref={barBottomRef} className="absolute bottom-0 inset-x-0 h-[8vh] bg-[#050505] origin-bottom scale-y-0 z-10 pointer-events-none" />

      {/* Timecode HUD */}
      <div className="absolute top-28 right-8 md:right-16 lg:right-20 z-10 text-right">
        <span ref={timecodeRef} className="font-mono text-[11px] tracking-[.15em] text-white/45 tabular-nums">
          00:00.0 / 00:00.0
        </span>
        <p className="text-[9px] tracking-[.3em] uppercase text-white/25 mt-1">
          {en ? 'You are the editor' : 'Tu tiens le montage'}
        </p>
      </div>

      {/* Intro line */}
      <div className="projection-intro absolute top-28 left-8 md:left-16 lg:left-20 max-w-md z-10">
        <p className="font-heading text-sm md:text-base mb-4 text-royal" style={{ color: '#5C77FF' }}>
          04 — {en ? 'The throw' : 'La projection'}
        </p>
        <h2 className="voie-title font-heading text-3xl md:text-4xl text-white leading-none">
          {en ? 'PERFORM IT YOURSELF.' : 'EXÉCUTE-LA TOI-MÊME.'}
        </h2>
        <p className="text-sm mt-3 text-white/50 leading-relaxed">
          {en
            ? 'Scroll — or grab the screen — to drive the throw, frame by frame.'
            : "Défile — ou attrape l'écran — pour dérouler la projection, image par image."}
        </p>
      </div>

      {/* The three phases of a technique — float over the letterbox like subtitles */}
      <div className="absolute bottom-16 inset-x-8 md:inset-x-16 lg:inset-x-20 z-20">
        <div className="flex gap-8 md:gap-16 mb-6">
          {PHASES.map((p, i) => (
            <div
              key={p.name}
              className="transition-opacity duration-500"
              style={{ opacity: phase === i ? 1 : 0.28 }}
            >
              <p className="font-jp text-2xl md:text-3xl text-white/80 mb-1" aria-hidden="true">{p.jp}</p>
              <p className={`font-heading text-xl md:text-3xl leading-none transition-all duration-500 ${phase === i ? 'text-[#5C77FF]' : 'text-white'}`}>
                {p.name}
              </p>
              <p className="text-xs md:text-sm text-white/50 mt-1">{en ? p.en : p.fr}</p>
            </div>
          ))}
        </div>
        <div className="h-px bg-white/15">
          <div
            ref={progressRef}
            className="h-px origin-left scale-x-0 bg-royal"
            style={{ boxShadow: '0 0 12px 1px rgba(65,105,225,0.8)' }}
          />
        </div>
      </div>
    </section>
  )
}
