'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import ProgrammeCard from '@/components/ui/ProgrammeCard'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/useReveal'

const programmesData = [
  { titre: 'Judo compétition', description: "Pour les athlètes visant l'excellence aux niveaux provincial, national et international.", horaire: 'Lun–Ven 18h00–19h00', slug: 'judo-competition', categorie: 'adultes' as const, icon: '🏆' },
  { titre: 'Judo enfants', description: 'Initiation aux principes du judo, développement moteur et socialisation pour les jeunes.', horaire: 'Sam 10h15–12h30', slug: 'judo-enfants', categorie: 'enfants' as const, icon: '👶' },
  { titre: 'Judo adultes', description: 'Acquérir des techniques efficaces, compétitionner ou simplement être en forme.', horaire: 'Lun/Mer 19h00–21h00', slug: 'judo-adultes', categorie: 'adultes' as const, icon: '💪' },
  { titre: 'Parents/Enfants', description: 'Un cours unique pour partager le judo en famille.', horaire: 'Sam 9h00–10h00', slug: 'parents-enfants', categorie: 'enfants' as const, icon: '👨‍👧' },
  { titre: 'Aiki Ju-Jitsu', description: 'Art martial complet : projections, contrôles articulaires, percussions.', horaire: 'Mar/Jeu 20h00–21h30', slug: 'aiki-jujitsu', categorie: 'arts-martiaux' as const, icon: '⚡' },
  { titre: 'Jiu-Jitsu Brésilien', description: 'Maîtriser les principes du BJJ debout et au sol. Pour 15 ans et +.', horaire: 'Mar/Jeu 19h45–21h00', slug: 'jiu-jitsu-bresilien', categorie: 'arts-martiaux' as const, icon: '🌀' },
  { titre: 'Sport-études', description: "Programme élite en partenariat avec l'École secondaire De Mortagne.", horaire: 'Selon école', slug: 'sport-etudes', categorie: 'adultes' as const, icon: '📚' },
  { titre: 'Judo aînés', description: 'Pratiquer le judo à tout âge dans un environnement adapté.', horaire: 'Horaire à confirmer', slug: 'judo-aines', categorie: 'adultes' as const, icon: '🧘' },
  { titre: 'Camp de jour', description: 'Découvrez le judo cet été!', horaire: 'Été', slug: 'camp-de-jour', categorie: 'enfants' as const, icon: '☀️' },
]

const filters = ['all', 'enfants', 'adultes', 'arts-martiaux'] as const

export default function ProgrammesSection() {
  const t = useTranslations('home')
  const [active, setActive] = useState<typeof filters[number]>('all')
  const titleRef = useReveal<HTMLDivElement>()

  const filtered = active === 'all' ? programmesData : programmesData.filter(p => p.categorie === active)

  return (
    <section className="py-28 md:py-36 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={titleRef} className="mb-16">
          <p className="text-gold text-[11px] tracking-[.4em] uppercase mb-4">Disciplines</p>
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('programmes_title')}
          </h2>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-12 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                'px-5 py-2 text-[11px] tracking-[.15em] uppercase font-medium transition-all duration-200',
                active === f
                  ? 'bg-gold text-black'
                  : 'border border-white/10 text-muted hover:border-gold/40 hover:text-gold'
              )}
            >
              {f === 'all' ? t('programmes_filter_all')
                : f === 'enfants' ? t('programmes_filter_children')
                : f === 'adultes' ? t('programmes_filter_adults')
                : t('programmes_filter_martial')}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((prog, i) => (
              <motion.div
                key={prog.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProgrammeCard {...prog} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
