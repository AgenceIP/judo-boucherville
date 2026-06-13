import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PageHero from '@/components/shared/PageHero'
import RichText from '@/components/shared/PortableText'
import CountdownTimer from '@/components/ui/CountdownTimer'
import Button from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Challenge Judo Boucherville' }

const tournoi = {
  edition: '27e édition',
  date: '2026-04-11T08:00:00-04:00',
  lieu: 'Dojo Marcel Bourelly, Complexe aquatique Laurie-Ève Cormier, 490 chemin du Lac, Boucherville',
  categories: ['U14', 'U16', 'U18', 'U21-Senior', 'Veteran-Ne Waza'],
  prix: [
    { categorie: 'Division (équipes)', montant: '1 000 $' },
    { categorie: 'Masters (Ne-Waza)', montant: '800 $' },
    { categorie: 'Seniors', montant: '1 200 $' },
  ],
  description: undefined as string | undefined,
  descriptionEn: undefined as string | undefined,
  inscriptionUrl: undefined as string | undefined,
}

export default async function ChallengePage() {
  const locale = await getLocale()
  const description = locale === 'fr' ? tournoi.description : (tournoi.descriptionEn || tournoi.description)

  return (
    <>
      <PageHero
        title="Challenge Judo Boucherville"
        subtitle={`${tournoi.edition} · Tournoi invitation par équipes`}
        tag="Tournoi international"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-16">
          <p className="text-muted mb-8 text-lg">
            {new Date(tournoi.date).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              timeZone: 'America/Montreal'
            })}
          </p>
          <CountdownTimer targetDate={tournoi.date} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
            <h3 className="font-heading text-xl text-foreground tracking-wide mb-3">📍 Lieu</h3>
            <p className="text-muted text-sm leading-relaxed">{tournoi.lieu}</p>
          </div>

          <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
            <h3 className="font-heading text-xl text-foreground tracking-wide mb-3">🏷️ Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {tournoi.categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-sm text-accent-blue">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 md:col-span-2">
            <h3 className="font-heading text-xl text-foreground tracking-wide mb-4">🏆 Prix</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {tournoi.prix.map(p => (
                <div key={p.categorie} className="text-center border border-royal/20 rounded-xl p-4">
                  <p className="font-heading text-2xl text-royal">{p.montant}</p>
                  <p className="text-muted text-sm mt-1">{p.categorie}</p>
                </div>
              ))}
            </div>
            <p className="text-muted text-xs mt-4">* Minimum 5 équipes par division. L&apos;équipe gagnante de chaque division remporte le prix.</p>
          </div>
        </div>

        {description && <RichText value={description} />}

        <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 mt-8">
          <h3 className="font-heading text-xl text-foreground tracking-wide mb-3">Contact</h3>
          <p className="text-muted text-sm">
            Directeur du tournoi : <strong className="text-foreground">Olivier Bry</strong>
          </p>
          <a href="mailto:info@judoboucherville.com" className="text-accent-blue text-sm hover:text-accent-glow transition-colors">
            info@judoboucherville.com
          </a>
        </div>

        {tournoi.inscriptionUrl && (
          <div className="text-center mt-10">
            <Button href={tournoi.inscriptionUrl} size="lg">
              S&apos;inscrire au tournoi
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
