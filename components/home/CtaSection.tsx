'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

export default function CtaSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-32 md:py-44 bg-black relative overflow-hidden">
      {/* Amplified noise */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.06, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,162,39,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative text-center max-w-5xl mx-auto px-6">
        <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-8">Rejoindre le club</p>
        <h2
          className="font-heading text-white leading-[.88] tracking-tight mb-8 text-balance"
          style={{ fontSize: 'clamp(64px, 12vw, 160px)' }}
        >
          {t('cta_title')}
        </h2>
        <p className="text-muted text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          {t('cta_subtitle')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/${locale}/inscription`}
            className="font-heading tracking-widest uppercase text-lg bg-gold text-black px-10 py-4 hover:bg-accent-glow transition-colors"
          >
            {t('cta_button')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="font-heading tracking-widest uppercase text-lg border border-white/20 text-white px-10 py-4 hover:border-gold hover:text-gold transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  )
}
