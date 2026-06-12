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
    <div className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
      <InkCanvas color={[0.11, 0.25, 1.0]} maxAlpha={0.55} drops />

      <div className="relative">
        <p className="font-heading text-royal text-2xl md:text-4xl mb-6">404</p>
        <h1
          className="voie-title font-heading text-foreground leading-[.92] mb-6"
          style={{ fontSize: 'clamp(34px, 5.6vw, 84px)' }}
        >
          {en ? 'YOU LEFT THE TATAMI.' : 'TU AS QUITTÉ LE TATAMI.'}
        </h1>
        <p className="text-muted font-medium text-lg mb-10 max-w-md mx-auto leading-snug">
          {en
            ? 'This page does not exist — or it was thrown out of bounds.'
            : "Cette page n'existe pas — ou elle a été projetée hors des limites."}
        </p>
        <Magnetic>
          <Link
            href={`/${locale}`}
            className="btn-wipe inline-flex font-heading text-sm md:text-base bg-royal text-white px-9 py-5 hover:text-white"
            style={{ ['--wipe-bg' as string]: '#0B0B0D' }}
          >
            {en ? 'Back to the dojo' : 'Retour au dojo'}
          </Link>
        </Magnetic>
      </div>
    </div>
  )
}
