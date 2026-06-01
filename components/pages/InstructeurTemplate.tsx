import Image from 'next/image'
import PageHero from '@/components/shared/PageHero'
import RichText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import type { Instructeur } from '@/data/instructeurs'

type Props = { instructeur: Instructeur; locale: string }

export default function InstructeurTemplate({ instructeur, locale }: Props) {
  const bio = locale === 'fr' ? instructeur.bio : (instructeur.bioEn || instructeur.bio)

  const labels = {
    disciplines: 'Disciplines',
    realisations: locale === 'fr' ? 'Réalisations' : 'Achievements',
    retour: locale === 'fr' ? "← Retour à l'équipe" : '← Back to team',
  }

  return (
    <>
      <PageHero title={instructeur.nom} subtitle={instructeur.role} tag={instructeur.grade} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-16">

          {/* Photo + details */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-white/[0.03]">
              {instructeur.photoSrc ? (
                <Image
                  src={instructeur.photoSrc}
                  alt={instructeur.nom}
                  fill
                  className="object-cover object-top grayscale"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-[80px] leading-none text-white/[0.04] select-none">
                    {instructeur.nom.split(' ').map(n => n[0] ?? '').join('')}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.06]">
              {instructeur.disciplines.length > 0 && (
                <div className="py-5 border-b border-white/[0.06]">
                  <h3 className="text-[10px] text-muted uppercase tracking-[.25em] mb-3">{labels.disciplines}</h3>
                  <div className="flex flex-wrap gap-2">
                    {instructeur.disciplines.map(d => (
                      <span key={d} className="text-xs text-muted border border-white/[0.08] px-2 py-1">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {instructeur.competitions.length > 0 && (
                <div className="py-5 border-b border-white/[0.06]">
                  <h3 className="text-[10px] text-muted uppercase tracking-[.25em] mb-3">{labels.realisations}</h3>
                  <ul className="space-y-2">
                    {instructeur.competitions.map((c, i) => (
                      <li key={i} className="text-sm text-muted leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-5">
                <Button href={`/${locale}/equipe`} variant="outline" className="w-full">
                  {labels.retour}
                </Button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <RichText value={bio} />
          </div>
        </div>
      </div>
    </>
  )
}
