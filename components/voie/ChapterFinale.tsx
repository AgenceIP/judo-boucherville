'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import CountdownTimer from '@/components/ui/CountdownTimer'
import RevealText from '@/components/ui/RevealText'
import Magnetic from '@/components/ui/Magnetic'
import InkCanvas from '@/components/voie/InkCanvas'
import { useReveal } from '@/hooks/useReveal'

/** Chapter 06 — The tatami. The way ends where practice begins. */
export default function ChapterFinale() {
  const locale = useLocale()
  const en = locale === 'en'
  const t = useTranslations('challenge')
  const ctaRef = useReveal<HTMLDivElement>()
  const challengeRef = useReveal<HTMLDivElement>()

  return (
    <section
      data-voie-bg="#F6F5F2"
      data-voie-ink="#0B0B0D"
      data-voie-muted="#5A5A60"
      data-voie-hairline="rgba(11,11,13,0.14)"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* The ink returns — the journey's bookend */}
      <InkCanvas color={[0.11, 0.25, 1.0]} maxAlpha={0.5} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <p className="font-heading text-sm md:text-base mb-6 text-royal">
          06 — {en ? 'The tatami' : 'Le tatami'}
        </p>

        <RevealText
          as="h2"
          className="voie-title font-heading leading-[.92] mb-12"
          style={{ fontSize: 'clamp(44px, 7.4vw, 116px)', color: 'var(--voie-ink)' }}
        >
          {en ? 'STEP ONTO THE TATAMI.' : 'MONTE SUR LE TATAMI.'}
        </RevealText>

        <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-28">
          <Magnetic>
            <Link
              href={`/${locale}/inscription`}
              className="btn-wipe inline-flex font-heading text-sm md:text-base bg-royal text-white px-9 py-5 hover:text-white"
              style={{ ['--wipe-bg' as string]: '#0B0B0D' }}
            >
              {en ? 'Register' : "S'inscrire"}
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href={`/${locale}/contact`}
              className="btn-wipe inline-flex font-heading text-sm md:text-base border-[3px] px-9 py-5 hover:text-white"
              style={{ borderColor: 'var(--voie-ink)', color: 'var(--voie-ink)', ['--wipe-bg' as string]: '#0B0B0D' }}
            >
              {en ? 'Contact us' : 'Nous contacter'}
            </Link>
          </Magnetic>
          <p className="basis-full md:basis-auto md:ml-6 text-base md:text-lg font-medium leading-snug max-w-xs" style={{ color: 'var(--voie-ink-muted)' }}>
            {en
              ? 'First class is free. Come bow once — the rest follows.'
              : 'Le premier cours est gratuit. Viens saluer une fois — le reste suivra.'}
          </p>
        </div>

        {/* Challenge */}
        <div
          ref={challengeRef}
          className="grid lg:grid-cols-2 gap-12 items-end border-t pt-14"
          style={{ borderColor: 'var(--voie-hairline)' }}
        >
          <div>
            <p className="text-[10px] tracking-[.4em] uppercase mb-4" style={{ color: 'var(--voie-ink-muted)' }}>
              {en ? 'The club hosts' : 'Le club organise'}
            </p>
            <h3 className="font-heading text-3xl md:text-5xl tracking-wide leading-none mb-3" style={{ color: 'var(--voie-ink)' }}>
              {t('title')}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--voie-ink-muted)' }}>
              {t('edition')} · Dojo Marcel Bourelly · {t('date')}
            </p>
            <Link
              href={`/${locale}/challenge`}
              className="group text-[11px] tracking-[.25em] uppercase transition-opacity opacity-70 hover:opacity-100"
              style={{ color: 'var(--voie-ink)' }}
            >
              {t('learn_more')}{' '}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
          <CountdownTimer targetDate="2026-04-11T08:00:00-04:00" />
        </div>
      </div>
    </section>
  )
}
