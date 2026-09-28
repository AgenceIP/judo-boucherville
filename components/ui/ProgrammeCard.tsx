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
      className="group grid grid-cols-[6px_1fr_auto] items-center gap-5 bg-panel rounded-[3px] py-5 pr-5 transition-colors hover:bg-white"
    >
      <span aria-hidden="true" className={`self-stretch rounded-l-[3px] ${MAT[categorie]}`} />
      <div className="min-w-0">
        <h3 className="font-display font-bold uppercase text-[1.6rem] leading-none text-ink">{titre}</h3>
        <p className="mt-1.5 text-ink-2 leading-snug">{description}</p>
        <p className="mt-2 font-mono text-[.8rem] text-blue sm:hidden">{horaire}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:block font-mono text-[.85rem] text-ink text-right">{horaire}</span>
        <ArrowRight size={18} aria-hidden="true" className="text-blue transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
