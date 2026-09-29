'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function NotFound() {
  const pathname = usePathname()
  const en = pathname?.startsWith('/en')
  const locale = en ? 'en' : 'fr'

  return (
    <div className="min-h-[80vh] grid place-items-center text-center px-4 pt-24 pb-16">
      <div>
        <p className="label text-blue mb-4">404 · Jogai</p>
        <h1 className="font-display font-extrabold uppercase text-ink leading-[.88] text-[clamp(2.2rem,6vw,4.5rem)]">
          {en ? 'You stepped off the mat.' : 'Vous êtes sorti du tatami.'}
        </h1>
        <p className="mt-5 text-ink-2 text-lg max-w-md mx-auto">
          {en ? 'This page does not exist, or it has moved.' : 'Cette page n’existe pas, ou elle a changé d’adresse.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/${locale}`} className="btn btn-primary">{en ? 'Back to the dojo' : 'Retour au dojo'}</Link>
          <Link href={`/${locale}#trouver`} className="btn btn-ghost">{en ? 'Find my class' : 'Trouver mon cours'}</Link>
        </div>
      </div>
    </div>
  )
}
