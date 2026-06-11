'use client'
import CountdownTimer from '@/components/ui/CountdownTimer'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import RevealText from '@/components/ui/RevealText'
import { useReveal } from '@/hooks/useReveal'

export default function ChallengeSection() {
  const t = useTranslations('challenge')
  const locale = useLocale()
  const leftRef = useReveal<HTMLDivElement>()
  const rightRef = useReveal<HTMLDivElement>()

  return (
    <section className="py-28 md:py-36 bg-transparent border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div>
            <RevealText
              as="h2"
              className="font-heading text-white leading-[.88] tracking-tight mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              {t('title')}
            </RevealText>
            <div ref={leftRef}>
              <p className="text-muted text-base mb-2">{t('edition')}</p>
              <p className="text-muted text-base mb-10">
                Dojo Marcel Bourelly &nbsp;·&nbsp; {t('date')}
              </p>
              <div className="flex flex-wrap gap-2 mb-12">
                {['U14', 'U16', 'U18', 'U21-Senior', 'Veteran / Ne Waza'].map(cat => (
                  <span
                    key={cat}
                    className="px-3 py-1 border border-white/10 text-[11px] text-muted tracking-[.15em] uppercase hover:border-royal/40 hover:text-white transition-colors duration-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <Link
                href={`/${locale}/challenge`}
                className="btn-wipe inline-flex font-heading tracking-widest uppercase text-sm border border-white/20 text-white px-8 py-4 hover:text-black hover:border-white"
              >
                {t('learn_more')}
              </Link>
            </div>
          </div>

          {/* Right — countdown */}
          <div ref={rightRef} className="lg:pt-4">
            <p className="text-muted text-[11px] tracking-[.3em] uppercase mb-8">Compte à rebours</p>
            <CountdownTimer targetDate="2026-04-11T08:00:00-04:00" />
          </div>

        </div>
      </div>
    </section>
  )
}
