import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
  titre: string
  description: string
  horaire: string
  slug: string
  categorie: 'enfants' | 'adultes' | 'arts-martiaux'
  locale: string
}

// A tiny tatami mat in the category's color: yellow for kids, blue for adults, wood for martial arts
const MAT: Record<Props['categorie'], string> = {
  enfants: 'bg-accent',
  adultes: 'bg-blue',
  'arts-martiaux': 'bg-wood',
}

/** One program as a row: name and one line, schedule at a glance, straight to details. */
export default function ProgrammeCard({ titre, description, horaire, slug, categorie, locale }: Props) {
  return (
    <Link
      href={`/${locale}/programmes/${slug}`}
      className="group relative isolate grid grid-cols-[1fr_auto] items-center gap-5 overflow-hidden bg-panel rounded-[3px] px-5 py-5 transition-colors duration-500 hover:text-panel"
    >
      {/* navy fill wipes in from the left on hover */}
      <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)] group-hover:scale-x-100" />
      <div className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1.5">
        <h3 className="display flex items-center gap-3 text-[1.7rem]">
          <span aria-hidden="true" className={`inline-block w-2.5 h-5 rounded-[2px] ${MAT[categorie]}`} />
          {titre}
        </h3>
        <p className="mt-1.5 text-ink-2 leading-snug transition-colors duration-500 group-hover:text-panel/80">{description}</p>
        <p className="mt-2 tabular-nums text-[.85rem] text-blue sm:hidden group-hover:text-accent">{horaire}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:block tabular-nums text-[.9rem] font-semibold text-right">{horaire}</span>
        <ArrowRight size={18} aria-hidden="true" className="text-blue transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:text-accent" />
      </div>
    </Link>
  )
}
