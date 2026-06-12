import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PageHero from '@/components/shared/PageHero'

export const metadata: Metadata = { title: "Conseil d'administration" }

const membres = [
  { role: 'Président', nom: 'Frédéric Bourque' },
  { role: 'Vice-président', nom: 'Olivier Bry' },
  { role: 'Secrétaire', nom: 'Alain Dessureault' },
  { role: 'Trésorier', nom: 'Maxime Bellemare' },
  { role: "Responsable d'éthique", nom: 'Alain Dessureault' },
  { role: 'Communication', nom: 'Stéphanie Trépanier' },
  { role: 'Administrateur', nom: 'Alexandre Thomas' },
  { role: 'Directeur technique', nom: 'Fayçal Bousbiat' },
]

export default async function ConseilPage() {
  const locale = await getLocale()

  return (
    <>
      <PageHero
        title={locale === 'fr' ? "Conseil d'administration" : 'Board of Directors'}
        subtitle={locale === 'fr'
          ? 'Les membres élus qui assurent la gouvernance du Club de Judo Boucherville.'
          : 'The elected members who govern the Club de Judo Boucherville.'}
        tag="Club"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid sm:grid-cols-2 gap-4">
          {membres.map(m => (
            <div key={m.role + m.nom} className="bg-bg-surface border border-foreground/15 p-6 flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-royal/20 flex items-center justify-center shrink-0">
                <span className="font-heading text-royal text-lg">
                  {m.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-royal tracking-[.25em] uppercase font-semibold mb-1">{m.role}</p>
                <p className="font-heading text-xl text-foreground tracking-wide">{m.nom}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-bg-surface border border-foreground/15 p-8 text-center">
          <p className="text-muted text-sm leading-relaxed">
            {locale === 'fr'
              ? 'Pour contacter le conseil d\'administration, écrivez-nous à'
              : 'To contact the board of directors, write to us at'}{' '}
            <a href="mailto:info@judoboucherville.com" className="text-royal hover:text-accent-glow transition-colors">
              info@judoboucherville.com
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
