'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Magnetic from '@/components/ui/Magnetic'
import InkCanvas from '@/components/voie/InkCanvas'

export default function NotFound() {
  const pathname = usePathname()
  const locale = pathname?.startsWith('/en') ? 'en' : 'fr'
  const en = locale === 'en'

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden bg-black">
      {/* Lost — the ideogram for "stray" haunts the page */}
      <span
        className="font-jp absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 leading-none select-none pointer-events-none"
        style={{ fontSize: 'min(60vw, 70vh)', color: '#FAFAFA', opacity: 0.04 }}
        aria-hidden="true"
      >
        迷
      </span>
      <InkCanvas color={[0.34, 0.48, 0.98]} maxAlpha={0.45} />

      <div className="relative">
        <p className="font-heading text-royal text-xl tracking-[.3em] mb-6">404</p>
        <h1
          className="voie-title font-heading text-white tracking-tight leading-[.9] mb-6"
          style={{ fontSize: 'clamp(48px, 9vw, 110px)' }}
        >
          {en ? 'YOU LEFT THE TATAMI.' : 'TU AS QUITTÉ LE TATAMI.'}
        </h1>
        <p className="italic text-muted text-lg mb-10 max-w-md mx-auto leading-relaxed">
          {en
            ? 'This page does not exist — or it was thrown out of bounds.'
            : "Cette page n'existe pas — ou elle a été projetée hors des limites."}
        </p>
        <Magnetic>
          <Link
            href={`/${locale}`}
            className="btn-wipe inline-flex font-heading tracking-widest uppercase text-sm bg-royal text-white px-8 py-4 hover:text-black"
          >
            {en ? 'Back to the dojo' : 'Retour au dojo'}
          </Link>
        </Magnetic>
      </div>
    </div>
  )
}
