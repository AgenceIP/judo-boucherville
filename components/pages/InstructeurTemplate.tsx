import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import PortableText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import { urlFor } from '@/lib/sanityImage'
import type { Instructeur } from '@/sanity/queries/instructeurs'
import type { PortableTextBlock } from '@portabletext/react'

type Props = { instructeur: Instructeur; locale: string }

export default function InstructeurTemplate({ instructeur, locale }: Props) {
  const bio = locale === 'fr' ? instructeur.bio : (instructeur.bioEn || instructeur.bio)

  const labels = {
    disciplines: locale === 'fr' ? 'Disciplines' : 'Disciplines',
    realisations: locale === 'fr' ? 'Réalisations' : 'Achievements',
    retour: locale === 'fr' ? "← Retour à l'équipe" : '← Back to team',
  }

  return (
    <>
      <PageHero
        title={instructeur.nom}
        subtitle={instructeur.role}
        tag={instructeur.grade}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Photo + details */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
              {instructeur.photo ? (
                <Image
                  src={urlFor(instructeur.photo).width(500).height(700).url()}
                  alt={instructeur.nom}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent-blue/10 flex items-center justify-center">
                  <span className="font-heading text-8xl text-accent-blue/30">
                    {instructeur.nom.split(' ').map(n => n[0] ?? '').join('')}
                  </span>
                </div>
              )}
            </div>

            {instructeur.disciplines && instructeur.disciplines.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs text-muted uppercase tracking-widest mb-3">{labels.disciplines}</h3>
                <div className="flex flex-wrap gap-2">
                  {instructeur.disciplines.map(d => (
                    <span key={d} className="px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-xs text-accent-blue">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {instructeur.competitions && instructeur.competitions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs text-muted uppercase tracking-widest mb-3">{labels.realisations}</h3>
                <ul className="space-y-2">
                  {instructeur.competitions.map((c, i) => (
                    <li key={i} className="text-sm text-foreground flex gap-2">
                      <span className="text-gold">🏅</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button href={`/${locale}/equipe`} variant="outline" className="w-full">
              {labels.retour}
            </Button>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            {bio && <PortableText value={bio as PortableTextBlock[]} />}
          </div>
        </div>
      </div>
    </>
  )
}
