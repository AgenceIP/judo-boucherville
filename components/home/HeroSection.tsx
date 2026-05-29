'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
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
  const t = useTranslations('home')
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
                {t('hero_cta_register')}
              </Link>
              <Link
                href={`/${locale}/programmes`}
                className="font-heading tracking-widest uppercase border border-white/40 text-white px-8 py-4 text-lg hover:border-gold hover:text-gold transition-colors"
              >
                {t('hero_cta_programmes')}
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
            <p className="text-muted text-[9px] tracking-[.4em] uppercase">{t('hero_scroll_hint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
