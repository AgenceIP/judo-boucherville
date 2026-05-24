import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <span className="font-heading text-[200px] text-accent-blue/10 leading-none block">404</span>
        <h1 className="font-heading text-4xl text-foreground tracking-wider -mt-10 mb-4">
          Page introuvable
        </h1>
        <p className="text-muted mb-8">Cette page n&apos;existe pas ou a été déplacée.</p>
        <Button href="/">Retour à l&apos;accueil</Button>
      </div>
    </div>
  )
}
