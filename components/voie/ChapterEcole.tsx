'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import RevealText from '@/components/ui/RevealText'
import { useReveal } from '@/hooks/useReveal'

const programmes = [
  { titre: 'Judo enfants', titreEn: "Children's judo", horaire: 'Sam 10h15–12h30', slug: 'judo-enfants', categorie: 'enfants' as const },
  { titre: 'Parents / Enfants', titreEn: 'Parents & children', horaire: 'Sam 9h–10h', slug: 'parents-enfants', categorie: 'enfants' as const },
  { titre: 'Camp de jour', titreEn: 'Day camp', horaire: 'Été', slug: 'camp-de-jour', categorie: 'enfants' as const },
  { titre: 'Judo adultes', titreEn: 'Adult judo', horaire: 'Lun/Mer 19h–21h', slug: 'judo-adultes', categorie: 'adultes' as const },
  { titre: 'Judo compétition', titreEn: 'Competitive judo', horaire: 'Lun–Ven 18h–19h', slug: 'judo-competition', categorie: 'adultes' as const },
  { titre: 'Sport-études', titreEn: 'Sports-studies', horaire: 'Selon école', slug: 'sport-etudes', categorie: 'adultes' as const },
  { titre: 'Aiki Ju-Jitsu', titreEn: 'Aiki Ju-Jitsu', horaire: 'Mar/Jeu 20h–21h30', slug: 'aiki-jujitsu', categorie: 'arts-martiaux' as const },
  { titre: 'Jiu-Jitsu Brésilien', titreEn: 'Brazilian Jiu-Jitsu', horaire: 'Mar/Jeu 19h45–21h', slug: 'jiu-jitsu-bresilien', categorie: 'arts-martiaux' as const },
]

const filters = ['all', 'enfants', 'adultes', 'arts-martiaux'] as const

/** Chapter 02 — The school. The paper world warms; the curriculum unfolds. */
export default function ChapterEcole() {
  const locale = useLocale()
  const en = locale === 'en'
  const [active, setActive] = useState<typeof filters[number]>('all')
  const listRef = useReveal<HTMLDivElement>()

  const filterLabel = (f: typeof filters[number]) =>
    f === 'all' ? (en ? 'All' : 'Tous')
      : f === 'enfants' ? (en ? 'Children' : 'Enfants')
      : f === 'adultes' ? (en ? 'Adults' : 'Adultes')
      : (en ? 'Martial arts' : 'Arts martiaux')

  const filtered = active === 'all' ? programmes : programmes.filter(p => p.categorie === active)

  return (
    <section
      data-voie-bg="#EFE9DD"
      data-voie-ink="#131210"
      data-voie-muted="#6B655C"
      data-voie-hairline="rgba(19,18,16,0.12)"
      className="py-28 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <p className="text-[10px] tracking-[.4em] uppercase mb-6" style={{ color: 'var(--voie-ink-muted)' }}>
          {en ? 'Chapter 02 · The school' : "Chapitre 02 · L'école"}
        </p>

        <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
          <RevealText
            as="h2"
            className="voie-title font-heading text-[clamp(52px,9vw,120px)] leading-[.9] tracking-tight"
            style={{ color: 'var(--voie-ink)' }}
          >
            {en ? 'THE SCHOOL' : "L'ÉCOLE"}
          </RevealText>

          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={cn(
                  'relative px-4 py-1.5 text-[10px] tracking-[.2em] uppercase font-medium transition-colors duration-300',
                  active === f ? 'text-white' : 'hover:opacity-100 opacity-70'
                )}
                style={active === f ? undefined : { color: 'var(--voie-ink)' }}
              >
                {active === f && (
                  <motion.span
                    layoutId="voie-filter"
                    className="absolute inset-0 bg-royal"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{filterLabel(f)}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout ref={listRef}>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map(p => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/${locale}/programmes/${p.slug}`}
                  className="group flex items-center gap-6 py-6 border-t transition-colors duration-300"
                  style={{ borderColor: 'var(--voie-hairline)' }}
                >
                  <h3
                    className="font-heading text-2xl md:text-3xl tracking-wide flex-1 group-hover:text-royal transition-colors duration-200"
                    style={{ color: 'var(--voie-ink)' }}
                  >
                    {en ? p.titreEn : p.titre}
                  </h3>
                  <p className="text-sm tabular-nums hidden sm:block" style={{ color: 'var(--voie-ink-muted)' }}>
                    {p.horaire}
                  </p>
                  <span className="text-lg group-hover:translate-x-1.5 group-hover:text-royal transition-all duration-200" style={{ color: 'var(--voie-ink-muted)' }}>
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="border-t" style={{ borderColor: 'var(--voie-hairline)' }} />
        </motion.div>

        <div className="mt-10">
          <Link
            href={`/${locale}/programmes`}
            className="group text-[11px] tracking-[.25em] uppercase transition-opacity hover:opacity-100 opacity-70"
            style={{ color: 'var(--voie-ink)' }}
          >
            {en ? 'All programs' : 'Tous les programmes'}{' '}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
