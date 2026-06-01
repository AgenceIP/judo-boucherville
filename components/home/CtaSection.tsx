'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

export default function CtaSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-32 md:py-48 bg-transparent border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-end">
          <h2
            className="font-heading text-white leading-[.88] tracking-tight"
            style={{ fontSize: 'clamp(64px, 10vw, 140px)' }}
          >
            {t('cta_title')}
          </h2>
          <div className="lg:pb-4">
            <p className="text-muted text-lg mb-10 leading-relaxed max-w-md">
              {t('cta_subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/inscription`}
                className="font-heading tracking-widest uppercase text-sm bg-royal text-white px-8 py-4 hover:bg-accent-glow transition-colors"
              >
                {t('cta_button')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="font-heading tracking-widest uppercase text-sm border border-white/20 text-white px-8 py-4 hover:border-white/50 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
