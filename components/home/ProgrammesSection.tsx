'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import ProgrammeCard from '@/components/ui/ProgrammeCard'
import { cn } from '@/lib/utils'

const programmesData = [
  { titre: 'Judo compétition', description: 'Pour les athlètes visant l\'excellence aux niveaux provincial, national et international.', horaire: 'Lun–Ven 18h00–19h00', slug: 'judo-competition', categorie: 'adultes' as const, icon: '🥋' },
  { titre: 'Judo enfants', description: 'Initiation aux principes du judo, développement moteur et socialisation pour les jeunes.', horaire: 'Sam 10h15–12h30', slug: 'judo-enfants', categorie: 'enfants' as const, icon: '👶' },
  { titre: 'Judo adultes', description: 'Acquérir des techniques efficaces, compétitionner ou simplement être en forme.', horaire: 'Lun/Mer 19h00–21h00', slug: 'judo-adultes', categorie: 'adultes' as const, icon: '💪' },
  { titre: 'Parents/Enfants', description: 'Un cours unique en son genre pour partager le judo en famille.', horaire: 'Sam 9h00–10h00', slug: 'parents-enfants', categorie: 'enfants' as const, icon: '👨‍👧' },
  { titre: 'Aiki Ju-Jitsu', description: 'Art martial complet et efficace : projections, contrôles articulaires, percussions.', horaire: 'Mar/Jeu 20h00–21h30', slug: 'aiki-jujitsu', categorie: 'arts-martiaux' as const, icon: '⚡' },
  { titre: 'Jiu-Jitsu Brésilien', description: 'Maîtriser les principes du BJJ debout et au sol. Pour 15 ans et +.', horaire: 'Mar/Jeu 19h45–21h00', slug: 'jiu-jitsu-bresilien', categorie: 'arts-martiaux' as const, icon: '🌀' },
  { titre: 'Sport-études', description: 'Programme élite en partenariat avec l\'École secondaire De Mortagne.', horaire: 'Selon école', slug: 'sport-etudes', categorie: 'adultes' as const, icon: '🏆' },
  { titre: 'Judo aînés', description: 'Pratiquer le judo à tout âge dans un environnement adapté et bienveillant.', horaire: 'Horaire à confirmer', slug: 'judo-aines', categorie: 'adultes' as const, icon: '🧘' },
  { titre: 'Camp de jour', description: 'Découvrez le judo, ses techniques et sa discipline cet été!', horaire: 'Été', slug: 'camp-de-jour', categorie: 'enfants' as const, icon: '☀️' },
]

const filters = ['all', 'enfants', 'adultes', 'arts-martiaux'] as const

export default function ProgrammesSection() {
  const t = useTranslations('home')
  const [active, setActive] = useState<typeof filters[number]>('all')

  const filtered = active === 'all' ? programmesData : programmesData.filter(p => p.categorie === active)

  return (
    <section className="py-24 bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wider">
            {t('programmes_title')}
          </h2>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                active === f
                  ? 'bg-accent-blue text-white'
                  : 'border border-white/10 text-muted hover:border-accent-blue hover:text-accent-blue'
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
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map(prog => (
              <motion.div
                key={prog.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
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
