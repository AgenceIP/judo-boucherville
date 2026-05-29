'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const leftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lines = leftRef.current?.querySelectorAll('.hero-line')
    if (!lines?.length) return

    const tl = gsap.timeline({ delay: 0.15 })
    gsap.set(lines, { yPercent: 105 })
    tl.to(lines, { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' })
    tl.fromTo('.hero-sub', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
    tl.fromTo('.hero-cta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
  }, [])

  return (
    <section className="flex h-screen min-h-[640px]">
      {/* Left: editorial black panel */}
      <div
        ref={leftRef}
        className="relative flex flex-col justify-end w-full lg:w-[45%] bg-black p-8 md:p-12 lg:p-16 pb-14 lg:pb-20"
      >
        {/* Mobile: photo fills behind text */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/scraped/Challenge_carou7.jpg"
            alt="Compétition de judo"
            fill
            className="object-cover object-[center_30%]"
            priority
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative z-10">
          {/* Giant title — overflow-hidden clips the GSAP slide-up */}
          <div className="overflow-hidden">
            <h1 className="hero-line font-heading text-[22vw] lg:text-[15vw] text-white leading-[0.85] tracking-tight">
              JUDO
            </h1>
          </div>
          <div className="overflow-hidden -mt-1">
            <h1 className="hero-line font-heading text-[8.5vw] lg:text-[5.5vw] text-white leading-none tracking-tight">
              BOUCHERVILLE
            </h1>
          </div>

          <div className="hero-sub mt-6 mb-8 opacity-0">
            <div className="w-12 h-[2px] bg-accent-blue mb-4" />
            <p className="text-muted text-xs uppercase tracking-[0.35em]">
              Fondé en 1970&nbsp;·&nbsp;Club AAA&nbsp;·&nbsp;Boucherville, QC
            </p>
          </div>

          <div className="hero-cta flex flex-col sm:flex-row gap-3 opacity-0">
            <Button href={`/${locale}/programmes`} size="lg">
              {t('hero_cta_primary')}
            </Button>
            <Button href={`/${locale}/inscription`} variant="outline" size="lg">
              {t('hero_cta_secondary')}
            </Button>
          </div>
        </div>
      </div>

      {/* Right: action photo — desktop only */}
      <div className="hidden lg:block lg:flex-1 relative">
        <Image
          src="/images/scraped/Challenge_carou7.jpg"
          alt="Compétition de judo — Club de Judo Boucherville"
          fill
          className="object-cover object-[center_30%]"
          priority
        />
      </div>
    </section>
  )
}
