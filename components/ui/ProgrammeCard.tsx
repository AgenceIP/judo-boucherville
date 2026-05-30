'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

type Props = {
  titre: string
  description: string
  horaire: string
  slug: string
  categorie: 'enfants' | 'adultes' | 'arts-martiaux'
  icon: string
}

const categoryColors = {
  'enfants': 'text-green-400',
  'adultes': 'text-accent-blue',
  'arts-martiaux': 'text-royal',
}

export default function ProgrammeCard({ titre, description, horaire, slug, categorie, icon }: Props) {
  const locale = useLocale()

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-bg-surface border border-white/5 rounded-2xl p-6 overflow-hidden cursor-pointer"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent-blue/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <span className="text-3xl mb-4 block">{icon}</span>
        <span className={cn('text-xs font-semibold uppercase tracking-wider', categoryColors[categorie])}>
          {categorie.replace('-', ' ')}
        </span>
        <h3 className="font-heading text-xl text-foreground mt-2 mb-3 tracking-wide">{titre}</h3>
        <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">{description}</p>
        <p className="text-xs text-accent-blue font-medium">{horaire}</p>

        <Link
          href={`/${locale}/programmes/${slug}`}
          className="mt-4 inline-flex items-center text-sm text-accent-blue hover:gap-2 transition-all group/link"
        >
          En savoir plus <span className="ml-1 group-hover/link:ml-2 transition-all">→</span>
        </Link>
      </div>
    </motion.div>
  )
}
