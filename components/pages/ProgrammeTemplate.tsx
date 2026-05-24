import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import PortableText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import { urlFor } from '@/lib/sanityImage'
import type { Programme } from '@/sanity/queries/programmes'
import type { PortableTextBlock } from '@portabletext/react'

const categoryTagColors = {
  enfants: 'text-green-400',
  adultes: 'text-accent-blue',
  'arts-martiaux': 'text-gold',
}

type Props = { programme: Programme; locale: string }

export default function ProgrammeTemplate({ programme, locale }: Props) {
  const title = locale === 'fr' ? programme.titre : (programme.titreEn || programme.titre)
  const description = locale === 'fr' ? programme.description : (programme.descriptionEn || programme.description)

  const labels = {
    horaires: locale === 'fr' ? 'Horaires' : 'Schedule',
    tarif: locale === 'fr' ? 'Tarif' : 'Fee',
    instructeurs: locale === 'fr' ? 'Instructeur(s)' : 'Instructor(s)',
    sInscrire: locale === 'fr' ? "S'inscrire à ce cours" : 'Register for this class',
  }

  return (
    <>
      <PageHero
        title={title}
        tag={programme.categorie.replace('-', ' ')}
        tagColor={categoryTagColors[programme.categorie]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2">
            {programme.image && (
              <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
                <Image
                  src={urlFor(programme.image).width(800).height(400).url()}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {description && <PortableText value={description as PortableTextBlock[]} />}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {programme.horaires && programme.horaires.length > 0 && (
              <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-4">{labels.horaires}</h3>
                <div className="space-y-3">
                  {programme.horaires.map((h, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-accent-blue font-medium">{h.jours}</span>
                      <span className="text-foreground ml-2">{h.heures}</span>
                      {h.lieu && <p className="text-muted text-xs mt-0.5">{h.lieu}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {programme.tarif && (
              <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-2">{labels.tarif}</h3>
                <p className="text-accent-blue text-xl font-semibold">{programme.tarif}</p>
              </div>
            )}

            {programme.instructeurs && programme.instructeurs.length > 0 && (
              <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-4">{labels.instructeurs}</h3>
                <div className="space-y-3">
                  {programme.instructeurs.map(instr => (
                    <Link
                      key={instr.slug.current}
                      href={`/${locale}/equipe/${instr.slug.current}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-heading text-sm">
                        {instr.nom.split(' ').map((n: string) => n[0] ?? '').join('')}
                      </div>
                      <div>
                        <p className="text-sm text-foreground group-hover:text-accent-blue transition-colors">{instr.nom}</p>
                        <p className="text-xs text-muted">{instr.grade}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Button href={`/${locale}/inscription`} className="w-full">
              {labels.sInscrire}
            </Button>
          </aside>
        </div>
      </div>
    </>
  )
}
