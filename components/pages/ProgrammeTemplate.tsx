import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/shared/PageHero'
import RichText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import { COLONNES_TARIF, type Programme } from '@/data/programmes'
import { club, inscription } from '@/data/club'

type Props = { programme: Programme; locale: string }

const label = 'text-[.78rem] text-muted uppercase tracking-[.25em]'
const th = 'text-left font-normal text-[.78rem] text-muted uppercase tracking-[.2em] py-3 pr-4'
const td = 'py-3 pr-4 align-top'

export default function ProgrammeTemplate({ programme: p, locale }: Props) {
  const fr = locale === 'fr'
  const colonnes = p.colonnes ?? COLONNES_TARIF

  const t = fr
    ? {
        horaires: 'Horaires et groupes', clientele: 'Clientèle', code: 'Code', horaire: 'Horaire',
        tarifs: 'Tarifs', periode: 'Période', debut: 'Début', cours: 'Cours', prealable: 'Préalable',
        instructeurs: 'Professeur(s)', inscrire: 'S’inscrire en ligne', qr: 'Ou scannez pour vous inscrire',
        inscription: 'Inscription', paiement: 'Paiement', lieu: 'Lieu', documents: 'Documents et liens',
        renseignements: 'Renseignements', toutes: 'Toutes les inscriptions',
      }
    : {
        horaires: 'Schedule and groups', clientele: 'Who', code: 'Code', horaire: 'Schedule',
        tarifs: 'Fees', periode: 'Period', debut: 'Starts', cours: 'Classes', prealable: 'Requirements',
        instructeurs: 'Instructor(s)', inscrire: 'Register online', qr: 'Or scan to register',
        inscription: 'Registration', paiement: 'Payment', lieu: 'Location', documents: 'Documents and links',
        renseignements: 'Information', toutes: 'All registrations',
      }

  const contacts = p.contacts ?? [{ nom: club.responsable, tel: club.tel, courriel: club.courriel }]

  return (
    <>
      <PageHero title={fr ? p.titre : p.titreEn} subtitle={fr ? p.resume : p.resumeEn} tag={p.categorie.replace('-', ' ')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-16">

          <div className="lg:col-span-2 space-y-14 min-w-0">
            <RichText value={fr ? p.description : (p.descriptionEn ?? p.description)} />

            {p.groupes.length > 0 && (
              <section>
                <h2 className={`${label} mb-4`}>{t.horaires}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t border-ink/10">
                    <thead>
                      <tr className="border-b border-ink/10">
                        <th className={th}>{t.clientele}</th>
                        <th className={th}>{t.code}</th>
                        <th className={th}>{t.horaire}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.groupes.map(g => (
                        <tr key={g.code} className="border-b border-ink/10">
                          <td className={`${td} text-ink`}>{g.clientele}</td>
                          <td className={`${td} tabular-nums text-[.85rem] text-accent-blue whitespace-nowrap`}>{g.code}</td>
                          <td className={`${td} text-muted`}>{g.horaire}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {p.tarifs.length > 0 && (
              <section>
                <h2 className={`${label} mb-4`}>{t.tarifs}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t border-ink/10">
                    <thead>
                      <tr className="border-b border-ink/10">
                        <th className={th}>{t.periode}</th>
                        {colonnes.map(c => <th key={c} className={`${th} text-right`}>{c}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {p.tarifs.map(row => (
                        <tr key={row.periode} className="border-b border-ink/10">
                          <td className={`${td} text-muted`}>{row.periode}</td>
                          {row.prix.map((x, i) => (
                            <td key={i} className={`${td} text-right font-heading text-lg whitespace-nowrap ${i === 0 ? 'text-ink' : 'text-muted'}`}>{x}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <ul className="space-y-2 text-sm text-muted">
              {p.notes?.map(n => <li key={n}>· {n}</li>)}
              {(fr ? inscription.notes : inscription.notesEn).map(n => <li key={n}>· {n}</li>)}
            </ul>

            {p.documents && (
              <section>
                <h2 className={`${label} mb-4`}>{t.documents}</h2>
                <ul className="border-t border-ink/10">
                  {p.documents.map(d => (
                    <li key={d.href} className="border-b border-ink/10">
                      <a href={d.href} target="_blank" rel="noopener noreferrer" className="flex justify-between gap-4 py-3 text-sm text-ink hover:text-royal transition-colors">
                        {d.titre}<span className="text-muted">{d.href.endsWith('.pdf') ? 'PDF ↗' : '↗'}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className={`${label} mb-4`}>{t.renseignements}</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {contacts.map(c => (
                  <div key={c.nom} className="text-sm">
                    <p className="text-ink">{c.nom}</p>
                    {c.role && <p className="text-muted text-[.85rem] mt-0.5">{c.role}</p>}
                    {c.tel && <a href={`tel:${c.tel.replace(/\D/g, '').slice(0, 10)}`} className="block py-2.5 text-muted hover:text-royal">{c.tel}</a>}
                    {c.courriel && <a href={`mailto:${c.courriel}`} className="block py-2.5 text-muted hover:text-royal break-all">{c.courriel}</a>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="border-t border-ink/10 lg:sticky lg:top-24 self-start">
            {p.formulaire && (
              <div className="py-6 border-b border-ink/10">
                <Button href={p.formulaire} external className="w-full">{t.inscrire} ↗</Button>
                {p.qr && (
                  <div className="hidden lg:flex items-center gap-4 mt-5">
                    <Image src={p.qr} alt={`QR : ${t.inscrire}`} width={88} height={88} className="bg-white p-1.5 shrink-0" />
                    <p className="text-[.85rem] text-muted leading-relaxed">{t.qr}</p>
                  </div>
                )}
              </div>
            )}

            {([
              [t.debut, p.debut],
              [t.cours, p.cours],
              [t.prealable, p.prealable],
            ] as const).map(([k, v]) => v && (
              <div key={k} className="py-5 border-b border-ink/10">
                <h3 className={`${label} mb-2`}>{k}</h3>
                <p className="text-sm text-ink leading-relaxed">{v}</p>
              </div>
            ))}

            {p.instructeurs.length > 0 && (
              <div className="py-5 border-b border-ink/10">
                <h3 className={`${label} mb-4`}>{t.instructeurs}</h3>
                <div className="space-y-3">
                  {p.instructeurs.map(instr => {
                    const body = (
                      <>
                        <div className="w-8 h-8 bg-panel border border-ink/10 flex items-center justify-center shrink-0">
                          <span className="font-heading text-[.85rem] text-muted">
                            {instr.nom.split(/[\s-]/).map(n => n[0] ?? '').join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-ink group-hover:text-royal transition-colors">{instr.nom}</p>
                          <p className="text-[.85rem] text-muted">{instr.grade}</p>
                        </div>
                      </>
                    )
                    return instr.slug
                      ? <Link key={instr.nom} href={`/${locale}/equipe/${instr.slug}`} className="flex items-center gap-3 group">{body}</Link>
                      : <div key={instr.nom} className="flex items-center gap-3">{body}</div>
                  })}
                </div>
              </div>
            )}

            {p.formulaire && (
              <>
                <div className="py-5 border-b border-ink/10">
                  <h3 className={`${label} mb-2`}>{t.inscription}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {p.inscription ?? (fr ? inscription.enLigne : inscription.enLigneEn)}
                  </p>
                  {!p.inscription && <p className="text-sm text-muted leading-relaxed mt-2">{fr ? inscription.surPlace : inscription.surPlaceEn}</p>}
                </div>
                <div className="py-5 border-b border-ink/10">
                  <h3 className={`${label} mb-2`}>{t.paiement}</h3>
                  <p className="text-sm text-muted leading-relaxed">{fr ? inscription.paiement : inscription.paiementEn}</p>
                </div>
              </>
            )}

            <div className="py-5 border-b border-ink/10">
              <h3 className={`${label} mb-2`}>{t.lieu}</h3>
              <p className="text-sm text-ink">{club.dojo}</p>
              <p className="text-sm text-muted">{club.lieu}<br />{club.adresse}</p>
            </div>

            <div className="pt-5">
              <Button href={`/${locale}/inscription`} variant="outline" size="sm" className="w-full">{t.toutes}</Button>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
