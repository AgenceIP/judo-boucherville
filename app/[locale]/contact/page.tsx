import { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import ContactForm from '@/components/pages/ContactForm'
import { club } from '@/data/club'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Contact',
    description: locale === 'fr'
      ? `Joindre le ${club.nom} : ${club.dojo}, ${club.adresse}. ${club.tel}.`
      : `Reach ${club.nom}: ${club.dojo}, ${club.adresse}. ${club.tel}.`,
  }
}

const label = 'text-[10px] text-muted uppercase tracking-[.25em]'
const reseaux: [string, string][] = [
  ['Facebook', club.facebook],
  ['Instagram', club.instagram],
  ['YouTube', club.youtube],
  ['TikTok', club.tiktok],
  ['X / Twitter', club.twitter],
]

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'
  const carte = `https://maps.google.com/maps?q=${encodeURIComponent(`${club.lieu}, 490 chemin du Lac, Boucherville, QC J4B 6X3`)}&z=15&output=embed&hl=${locale}`

  return (
    <>
      <PageHero
        title={fr ? 'Nous joindre' : 'Contact us'}
        subtitle={fr ? 'Une question sur un cours, une inscription ou le Challenge? Écrivez-nous.' : 'A question about a class, registration or the Challenge? Get in touch.'}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <dl className="border-t border-ink/10">
            {([
              [fr ? 'Dojo' : 'Dojo', <>
                <p className="text-ink">{club.dojo}</p>
                <p className="text-sm text-ink/80">{club.lieu}</p>
                <p className="text-sm text-ink/80">{club.adresse}</p>
              </>],
              [fr ? 'Téléphone' : 'Phone', <a key="tel" href={`tel:+1${club.tel.replace(/\D/g, '')}`} className="text-ink hover:text-royal transition-colors">{club.tel}</a>],
              [fr ? 'Courriel' : 'Email', <a key="mail" href={`mailto:${club.courriel}`} className="text-ink hover:text-royal transition-colors break-all">{club.courriel}</a>],
              [fr ? 'Responsable' : 'Contact person', <>
                <p className="text-ink">{club.responsable}</p>
                <p className="text-sm text-muted">{fr ? 'Directeur technique' : 'Technical director'}</p>
              </>],
              [fr ? 'Réseaux sociaux' : 'Social media', <ul key="social" className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {reseaux.map(([nom, href]) => (
                  <li key={nom}><a href={href} target="_blank" rel="noopener noreferrer" className="text-ink/80 hover:text-royal transition-colors">{nom} ↗</a></li>
                ))}
              </ul>],
            ] as const).map(([k, v]) => (
              <div key={k} className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-8 py-5 border-b border-ink/10">
                <dt className={`${label} pt-1`}>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h2 className="font-heading text-3xl text-ink tracking-tight mb-8">{fr ? 'Envoyez-nous un message' : 'Send us a message'}</h2>
            <ContactForm />
          </section>
        </div>

        <div className="h-80 border border-ink/10 overflow-hidden">
          <iframe
            src={carte}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={fr ? `Carte : ${club.dojo}` : `Map: ${club.dojo}`}
          />
        </div>
      </div>
    </>
  )
}
