'use client'
import { useRef, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'

const VIDEO_SRC = '/videos/hero.mp4'

export default function HeroSection() {
  const locale = useLocale()
  const videoRef = useRef<HTMLVideoElement>(null)

  const desc = locale === 'en'
    ? '55 years of martial tradition. Perfect technique is born from repetition.'
    : '55 ans de tradition martiale. La technique parfaite naît de la répétition.'

  const onScroll = useCallback(() => {
    const vid = videoRef.current
    if (!vid || vid.readyState < 2 || !vid.duration) return
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll))
    vid.currentTime = progress * vid.duration
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <>
      {/* Fixed video — scrubbed by scroll, persists behind all homepage sections */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          style={{ opacity: 1 }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>
      {/* Dark overlay — keeps text readable across all sections */}
      <div className="fixed inset-0 -z-10 bg-[#0A0A0A]/10" />

      {/* Hero content */}
      <section className="relative h-screen flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-20">
        {/* Club logo will go here */}
        <div className="mb-8" />

        <h1
          className="font-heading leading-[.88] tracking-tight text-white mb-5 animate-fade-in"
          style={{ fontSize: 'clamp(68px, 12vw, 148px)' }}
        >
          JUDO<br />
          <span className="text-royal">BOUCHERVILLE</span>
        </h1>
        <p className="text-[#999] text-base md:text-lg max-w-lg leading-relaxed animate-fade-in">
          {desc}
        </p>
      </section>
    </>
  )
}
