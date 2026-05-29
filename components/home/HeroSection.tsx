'use client'
import { useLocale } from 'next-intl'

const VIDEO_SRC = '/videos/hero.mp4'

export default function HeroSection() {
  const locale = useLocale()
  const desc = locale === 'en'
    ? '55 years of martial tradition. Perfect technique is born from repetition.'
    : '55 ans de tradition martiale. La technique parfaite naît de la répétition.'

  return (
    <>
      {/* Fixed video — persists behind all homepage sections as you scroll */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          style={{ opacity: 0.4 }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>
      {/* Dark overlay — keeps text readable across all sections */}
      <div className="fixed inset-0 -z-10 bg-[#0A0A0A]/72" />

      {/* Hero content */}
      <section className="relative h-screen flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-20">
        {/* Club logo will go here */}
        <div className="mb-8" />

        <h1
          className="font-heading leading-[.88] tracking-tight text-white mb-5 animate-fade-in"
          style={{ fontSize: 'clamp(68px, 12vw, 148px)' }}
        >
          JUDO<br />
          <span className="text-gold">BOUCHERVILLE</span>
        </h1>
        <p className="text-[#999] text-base md:text-lg max-w-lg leading-relaxed animate-fade-in">
          {desc}
        </p>
      </section>
    </>
  )
}
