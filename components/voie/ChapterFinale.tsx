'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import CountdownTimer from '@/components/ui/CountdownTimer'
import RevealText from '@/components/ui/RevealText'
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
      data-voie-bg="#050505"
      data-voie-ink="#FAFAFA"
      data-voie-muted="#888888"
      data-voie-hairline="rgba(250,250,250,0.08)"
      className="py-32 md:py-48"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <p className="text-[10px] tracking-[.4em] uppercase mb-6" style={{ color: 'var(--voie-ink-muted)' }}>
          {en ? 'Chapter 06 · The tatami' : 'Chapitre 06 · Le tatami'}
        </p>

        <RevealText
          as="h2"
          className="voie-title font-heading leading-[.88] tracking-tight mb-12"
          style={{ fontSize: 'clamp(64px, 11vw, 150px)', color: 'var(--voie-ink)' }}
        >
          {en ? 'STEP ONTO THE TATAMI.' : 'MONTE SUR LE TATAMI.'}
        </RevealText>

        <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-28">
          <Link
            href={`/${locale}/inscription`}
            className="btn-wipe font-heading tracking-widest uppercase text-sm bg-royal text-white px-8 py-4 hover:text-black"
          >
            {en ? 'Register' : "S'inscrire"}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="btn-wipe font-heading tracking-widest uppercase text-sm border text-white px-8 py-4 hover:text-black hover:border-white"
            style={{ borderColor: 'var(--voie-hairline)' }}
          >
            {en ? 'Contact us' : 'Nous contacter'}
          </Link>
          <p className="basis-full md:basis-auto md:ml-6 text-sm leading-relaxed max-w-xs" style={{ color: 'var(--voie-ink-muted)' }}>
            {en
              ? 'First class is free. Come bow once — the rest follows.'
              : "Le premier cours est gratuit. Viens saluer une fois — le reste suivra."}
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
