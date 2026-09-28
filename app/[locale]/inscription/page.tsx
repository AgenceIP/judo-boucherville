import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/shared/PageHero'
import Button from '@/components/ui/Button'
import { COLONNES_TARIF, programmes } from '@/data/programmes'
import { club, inscription } from '@/data/club'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Inscription' : 'Registration',
    description: locale === 'fr'
      ? `Inscription ${inscription.saison} : tarifs, formulaires en ligne, début des cours et paiement.`
      : `${inscription.saison} registration: fees, online forms, class start dates and payment.`,
  }
}

const label = 'text-[10px] text-muted uppercase tracking-[.25em]'

export default async function InscriptionPage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'
  const payants = programmes.filter(p => p.tarifs.length > 0)

  const t = fr
    ? {
        sub: `Saison ${inscription.saison} — tous les programmes, tarifs et formulaires au même endroit.`,
        comment: 'Comment s’inscrire', enLigne: 'En ligne', surPlace: 'Sur place', paiement: 'Paiement',
        prealable: 'Préalable', carte: 'Carte d’Accès Boucherville, sandales et judogi (habit de judo) pour la plupart des programmes; le préalable exact figure sur la page de chaque programme.',
        form: 'Formulaire d’inscription', qr: 'Ou scannez le code avec votre téléphone',
        tarifs: 'Tarifs par programme', debut: 'Début', inscrire: 'S’inscrire', details: 'Détails',
        debutCours: 'Début des cours', questions: 'Des questions?', contact: `${club.responsable}, directeur technique`,
      }
    : {
        sub: `${inscription.saison} season — every programme, fee and form in one place.`,
        comment: 'How to register', enLigne: 'Online', surPlace: 'In person', paiement: 'Payment',
        prealable: 'Requirements', carte: 'Boucherville Access Card, sandals and judogi (judo uniform) for most programmes; each programme page lists its exact requirements.',
        form: 'Registration form', qr: 'Or scan the code with your phone',
        tarifs: 'Fees by programme', debut: 'Starts', inscrire: 'Register', details: 'Details',
        debutCours: 'Class start dates', questions: 'Questions?', contact: `${club.responsable}, technical director`,
      }
  const colonnesEn: Record<string, string> = { [COLONNES_TARIF[0]]: 'Before Aug 19', [COLONNES_TARIF[1]]: 'After Aug 19', 'Coût': 'Fee' }

  return (
    <>
      <PageHero title={fr ? 'Inscription' : 'Registration'} subtitle={t.sub} tag={inscription.saison} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* How to register + general form */}
        <section className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
          <div>
            <h2 className="font-heading text-3xl text-white tracking-tight mb-8">{t.comment}</h2>
            <dl className="border-t border-white/[0.06]">
              {([
                [t.enLigne, fr ? inscription.enLigne : inscription.enLigneEn],
                [t.surPlace, fr ? inscription.surPlace : inscription.surPlaceEn],
                [t.paiement, fr ? inscription.paiement : inscription.paiementEn],
                [t.prealable, t.carte],
              ] as const).map(([k, v]) => (
                <div key={k} className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-8 py-5 border-b border-white/[0.06]">
                  <dt className={label}>{k}</dt>
                  <dd className="text-sm text-white/80 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-6 space-y-1 text-sm text-muted">
              {(fr ? inscription.notes : inscription.notesEn).map(n => <li key={n}>— {n}</li>)}
            </ul>
          </div>

          <aside className="border border-white/[0.06] p-6 self-start lg:sticky lg:top-24">
            <h2 className={`${label} mb-5`}>{t.form}</h2>
            <Button href={inscription.formulaire} external className="w-full">{t.inscrire} ↗</Button>
            <div className="flex items-center gap-4 mt-6">
              <Image src={inscription.qr} alt={`QR — ${t.form}`} width={96} height={96} className="bg-white p-1.5 shrink-0" />
              <p className="text-xs text-muted leading-relaxed">{t.qr}</p>
            </div>
          </aside>
        </section>

        {/* Every programme with its fees and own form */}
        <section>
          <h2 className="font-heading text-3xl text-white tracking-tight mb-8">{t.tarifs}</h2>
          <div className="border-t border-white/[0.06]">
            {payants.map(p => {
              const colonnes = p.colonnes ?? COLONNES_TARIF
              return (
                <article key={p.slug} className="grid md:grid-cols-[1fr_1.4fr_auto] gap-4 md:gap-10 py-8 border-b border-white/[0.06]">
                  <div>
                    <h3 className="font-heading text-xl text-white leading-tight">
                      <Link href={`/${locale}/programmes/${p.slug}`} className="hover:text-royal transition-colors">
                        {fr ? p.titre : p.titreEn}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted mt-1">{p.horaire}</p>
                    {p.debut && <p className="text-xs text-muted mt-1">{t.debut} : <span className="text-white/80">{p.debut}</span></p>}
                  </div>

                  <table className="w-full text-sm self-start">
                    {colonnes.length > 1 && (
                      <thead>
                        <tr>
                          <th />
                          {colonnes.map(c => (
                            <th key={c} className="text-right font-normal text-[10px] text-muted uppercase tracking-[.15em] pb-2 pl-3 whitespace-nowrap">
                              {fr ? c : colonnesEn[c] ?? c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {p.tarifs.map(row => (
                        <tr key={row.periode} className="align-top">
                          <td className="text-muted py-1.5 pr-3">{row.periode}</td>
                          {row.prix.map((x, i) => (
                            <td key={i} className={`text-right py-1.5 pl-3 font-heading whitespace-nowrap ${i === 0 ? 'text-white' : 'text-muted'}`}>{x}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex md:flex-col gap-3 md:items-end">
                    {p.formulaire && (
                      <a href={p.formulaire} target="_blank" rel="noopener noreferrer" className="text-sm text-white border-b border-royal hover:text-royal transition-colors whitespace-nowrap">
                        {t.inscrire} ↗
                      </a>
                    )}
                    {p.qr && <Image src={p.qr} alt={`QR — ${fr ? p.titre : p.titreEn}`} width={72} height={72} className="hidden md:block bg-white p-1" />}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Class start dates */}
        <section className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16">
          <h2 className="font-heading text-3xl text-white tracking-tight">{t.debutCours}</h2>
          <dl className="border-t border-white/[0.06]">
            {inscription.debutCours.map(([cFr, cEn, dFr, dEn]) => (
              <div key={cFr} className="flex justify-between gap-6 py-3 border-b border-white/[0.06] text-sm">
                <dt className="text-white">{fr ? cFr : cEn}</dt>
                <dd className="text-muted tabular-nums text-right">{fr ? dFr : dEn}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Contact */}
        <section className="border-t border-white/[0.06] pt-12">
          <h2 className="font-heading text-2xl text-white tracking-tight mb-2">{t.questions}</h2>
          <p className="text-muted mb-8 text-sm">{t.contact}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href={`tel:${club.tel.replace(/\D/g, '')}`} variant="outline">{club.tel}</Button>
            <Button href={`mailto:${club.courriel}`} variant="outline">{club.courriel}</Button>
          </div>
        </section>
      </div>
    </>
  )
}
