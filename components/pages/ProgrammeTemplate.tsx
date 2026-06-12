import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import RichText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import type { Programme } from '@/data/programmes'

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
      <PageHero title={title} tag={programme.categorie.replace('-', ' ')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-16">

          {/* Main content */}
          <div className="lg:col-span-2">
            <RichText value={description} />
          </div>

          {/* Sidebar */}
          <aside className="border-t border-foreground/15">
            {programme.horaires.length > 0 && (
              <div className="py-6 border-b border-foreground/15">
                <h3 className="text-[10px] text-muted uppercase tracking-[.25em] mb-4">{labels.horaires}</h3>
                <div className="space-y-3">
                  {programme.horaires.map((h, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-foreground font-medium">{h.jours}</span>
                      <span className="text-muted ml-2">{h.heures}</span>
                      {h.lieu && <p className="text-muted text-xs mt-0.5">{h.lieu}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {programme.tarif && (
              <div className="py-6 border-b border-foreground/15">
                <h3 className="text-[10px] text-muted uppercase tracking-[.25em] mb-2">{labels.tarif}</h3>
                <p className="font-heading text-xl text-foreground">{programme.tarif}</p>
              </div>
            )}

            {programme.instructeurs.length > 0 && (
              <div className="py-6 border-b border-foreground/15">
                <h3 className="text-[10px] text-muted uppercase tracking-[.25em] mb-4">{labels.instructeurs}</h3>
                <div className="space-y-3">
                  {programme.instructeurs.map(instr => (
                    <Link
                      key={instr.slug}
                      href={`/${locale}/equipe/${instr.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 bg-foreground/[0.05] border border-foreground/15 flex items-center justify-center shrink-0">
                        <span className="font-heading text-xs text-muted">
                          {instr.nom.split(' ').map((n: string) => n[0] ?? '').join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-foreground group-hover:text-royal transition-colors">{instr.nom}</p>
                        <p className="text-xs text-muted">{instr.grade}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6">
              <Button href={`/${locale}/inscription`} className="w-full">
                {labels.sInscrire}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
