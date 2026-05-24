import { useTranslations, useLocale } from 'next-intl'
import Button from '@/components/ui/Button'

export default function CtaSection() {
  const t = useTranslations('home')
  const locale = useLocale()

  return (
    <section className="py-32 bg-gradient-to-br from-accent-blue/20 to-bg-base relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent-blue blur-3xl" />
      </div>
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground tracking-wider mb-4">
          {t('cta_title')}
        </h2>
        <p className="text-muted text-lg mb-10">{t('cta_subtitle')}</p>
        <Button href={`/${locale}/inscription`} size="lg">
          {t('cta_button')}
        </Button>
      </div>
    </section>
  )
}
