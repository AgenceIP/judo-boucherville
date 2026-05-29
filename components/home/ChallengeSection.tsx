'use client'
import CountdownTimer from '@/components/ui/CountdownTimer'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useReveal } from '@/hooks/useReveal'

export default function ChallengeSection() {
  const t = useTranslations('challenge')
  const locale = useLocale()
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-36 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0500 0%, #0d0d0d 50%, #080808 100%)' }}
    >
      {/* Subtle gold glow bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201,162,39,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-5">
          {t('edition')}
        </p>
        <h2 className="font-heading text-white leading-[.88] tracking-tight mb-4"
          style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}>
          {t('title')}
        </h2>
        <p className="text-muted text-sm tracking-wider mb-12">
          Dojo Marcel Bourelly &nbsp;·&nbsp; {t('date')}
        </p>

        <div className="mb-12">
          <CountdownTimer targetDate="2026-04-11T08:00:00-04:00" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {['U14', 'U16', 'U18', 'U21-Senior', 'Veteran-Ne Waza'].map(cat => (
            <span
              key={cat}
              className="px-4 py-1.5 border border-gold/20 text-[11px] text-muted tracking-[.15em] uppercase hover:border-gold/50 hover:text-gold transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>

        <Link
          href={`/${locale}/challenge`}
          className="inline-flex font-heading tracking-widest uppercase text-lg bg-gold text-black px-10 py-4 hover:bg-accent-glow transition-colors"
        >
          {t('learn_more')}
        </Link>
      </div>
    </section>
  )
}
