'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTranslations, useLocale } from 'next-intl'
import Button from '@/components/ui/Button'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const titleWords = t('hero_title').split(' ')

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })

    const wordSpans = titleRef.current?.querySelectorAll('.hero-word')
    if (wordSpans?.length) {
      gsap.set(wordSpans, { y: '100%' })
      tl.to(wordSpans, { y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' })
    }

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    )
  }, [])

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-fallback.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-bg-base/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-base/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <p className="font-heading text-accent-blue text-sm md:text-base tracking-[0.4em] uppercase mb-4">
          Fondé en 1970 · Club AAA · Judo Québec
        </p>

        <h1
          ref={titleRef}
          className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground leading-none tracking-wider mb-6"
        >
          {titleWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span className="hero-word inline-block">{word}</span>
              {i < titleWords.length - 1 && ' '}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-0"
        >
          {t('hero_subtitle')}
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center opacity-0">
          <Button href={`/${locale}/programmes`} size="lg">
            {t('hero_cta_primary')}
          </Button>
          <Button href={`/${locale}/inscription`} variant="outline" size="lg">
            {t('hero_cta_secondary')}
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted hover:text-accent-blue transition-colors animate-bounce"
        aria-label="Scroll"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  )
}
