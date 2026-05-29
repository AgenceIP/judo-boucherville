'use client'
import { useTranslations, useLocale } from 'next-intl'
import Button from '@/components/ui/Button'

export default function CtaSection() {
  const t = useTranslations('home')
  const locale = useLocale()

  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="text-center max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-[13vw] sm:text-[10vw] md:text-[8vw] text-white leading-none tracking-tight mb-6">
          {t('cta_title')}
        </h2>
        <p className="text-muted text-base md:text-lg mb-10 max-w-xl mx-auto">
          {t('cta_subtitle')}
        </p>
        <Button href={`/${locale}/inscription`} size="lg">
          {t('cta_button')}
        </Button>
      </div>
    </section>
  )
}
