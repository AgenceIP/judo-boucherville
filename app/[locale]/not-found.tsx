'use client'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function NotFound() {
  const pathname = usePathname()
  const locale = pathname?.startsWith('/en') ? 'en' : 'fr'

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <span className="font-heading text-[200px] text-accent-blue/10 leading-none block">404</span>
        <h1 className="font-heading text-4xl text-foreground tracking-wider -mt-10 mb-4">
          {locale === 'fr' ? 'Page introuvable' : 'Page not found'}
        </h1>
        <p className="text-muted mb-8">
          {locale === 'fr'
            ? "Cette page n'existe pas ou a été déplacée."
            : "This page doesn't exist or has been moved."}
        </p>
        <Button href={`/${locale}`}>
          {locale === 'fr' ? "Retour à l'accueil" : 'Back to home'}
        </Button>
      </div>
    </div>
  )
}
