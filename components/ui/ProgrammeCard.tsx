'use client'
import Link from 'next/link'
import { useLocale } from 'next-intl'

type Props = {
  titre: string
  description: string
  horaire: string
  slug: string
  categorie: 'enfants' | 'adultes' | 'arts-martiaux'
  icon?: string
}

const categoryLabel: Record<string, string> = {
  enfants: 'Enfants',
  adultes: 'Adultes',
  'arts-martiaux': 'Arts martiaux',
}

export default function ProgrammeCard({ titre, description, horaire, slug, categorie }: Props) {
  const locale = useLocale()

  return (
    <Link
      href={`/${locale}/programmes/${slug}`}
      className="group flex items-center gap-6 border-t border-white/[0.06] py-5 hover:border-royal/30 transition-colors duration-300"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-4">
          <h3 className="font-heading text-xl text-white tracking-wide group-hover:text-royal transition-colors duration-200">
            {titre}
          </h3>
          <span className="text-[10px] text-muted tracking-[.2em] uppercase shrink-0">
            {categoryLabel[categorie]}
          </span>
        </div>
        <p className="text-muted text-sm mt-1 leading-relaxed line-clamp-1">{description}</p>
      </div>
      <div className="shrink-0 text-right hidden sm:block">
        <p className="text-sm text-muted tabular-nums">{horaire}</p>
      </div>
      <span className="shrink-0 text-muted group-hover:text-royal group-hover:translate-x-1 transition-all duration-200 text-lg">
        →
      </span>
    </Link>
  )
}
