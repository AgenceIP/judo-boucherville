import CountdownTimer from '@/components/ui/CountdownTimer'
import Button from '@/components/ui/Button'
import { useTranslations, useLocale } from 'next-intl'

export default function ChallengeSection() {
  const t = useTranslations('challenge')
  const locale = useLocale()

  return (
    <section className="py-24 bg-bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs text-accent-blue uppercase tracking-widest font-semibold">{t('edition')}</span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wider mt-2 mb-2">
          {t('title')}
        </h2>
        <p className="text-muted mb-10">Dojo Marcel Bourelly · {t('date')}</p>

        <div className="mb-10">
          <CountdownTimer targetDate="2026-04-11T08:00:00-04:00" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['U14', 'U16', 'U18', 'U21-Senior', 'Veteran-Ne Waza'].map(cat => (
            <span key={cat} className="px-4 py-2 border border-white/10 rounded-full text-sm text-muted">
              {cat}
            </span>
          ))}
        </div>

        <Button href={`/${locale}/challenge`} size="lg">
          En savoir plus
        </Button>
      </div>
    </section>
  )
}
