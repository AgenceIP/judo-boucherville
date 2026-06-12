import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PageHero from '@/components/shared/PageHero'
import Button from '@/components/ui/Button'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Inscription' : 'Registration' }
}

const steps = [
  { num: '01', title: 'Choisissez votre programme', desc: 'Parcourez nos programmes et sélectionnez celui qui vous convient.' },
  { num: '02', title: 'Remplissez le formulaire', desc: "Complétez le formulaire d'inscription en ligne avec vos informations." },
  { num: '03', title: 'Confirmez votre place', desc: 'Votre inscription est confirmée après réception du paiement.' },
]

const faq = [
  { q: "Faut-il une carte d'accès Boucherville?", a: "Le programme Parents/enfants requiert une carte d'accès Boucherville. Les autres programmes sont ouverts à tous." },
  { q: "Puis-je m'inscrire en cours de session?", a: "Oui, l'inscription est possible en cours de session sous réserve des places disponibles. Contactez-nous pour vérifier." },
  { q: 'Le programme Accès-Loisirs est-il disponible?', a: 'Oui, le Club de Judo Boucherville participe au programme Accès-Loisirs de la Ville de Boucherville pour les résidents éligibles.' },
  { q: 'Faut-il un judogi (kimono) pour commencer?', a: 'Pour le premier cours, des vêtements confortables suffisent. Le judogi est recommandé dès le deuxième cours.' },
  { q: "Y a-t-il un essai gratuit?", a: "Contactez-nous à info@judoboucherville.com ou au (450) 655-1888 pour connaître les modalités d'essai." },
]

export default async function InscriptionPage() {
  const locale = await getLocale()
  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Inscription' : 'Registration'}
        subtitle={locale === 'fr'
          ? 'Rejoignez le premier club de judo du Québec en 3 étapes simples.'
          : 'Join the first judo club in Québec in 3 simple steps.'}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Steps */}
        <div className="mb-16">
          {steps.map((step, i) => (
            <div key={step.num} className="border-t border-foreground/15 py-7 flex gap-8 items-start group">
              <span className="font-heading text-royal/40 text-3xl leading-none shrink-0 w-10 text-right">{i + 1}</span>
              <div className="border-l border-foreground/15 pl-8 group-hover:border-royal/20 transition-colors">
                <h3 className="font-heading text-xl text-foreground tracking-wide mb-1">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-foreground/15" />
        </div>

        {/* CTA */}
        <div className="mb-16">
          <Button href="https://docs.google.com/forms/d/e/1FAIpQLSf-placeholder/viewform" size="lg">
            {"Formulaire d'inscription en ligne"}
          </Button>
          <p className="text-muted text-xs mt-3">Lien vers le formulaire Google Forms officiel du club</p>
        </div>

        {/* Accès-Loisirs */}
        <div className="border border-foreground/15 p-6 mb-16">
          <p className="text-sm text-foreground leading-relaxed">
            <strong>Programme Accès-Loisirs</strong> — le Club de Judo Boucherville participe au programme
            de la Ville de Boucherville offrant des tarifs réduits aux résidents admissibles.
            Renseignez-vous auprès de la Ville ou contactez-nous.
          </p>
        </div>

        {/* FAQ */}
        <h2 className="font-heading text-3xl text-foreground tracking-tight mb-2">Questions fréquentes</h2>
        <div className="mt-8">
          {faq.map(item => (
            <details key={item.q} className="group border-t border-foreground/15">
              <summary className="flex items-center justify-between py-5 cursor-pointer text-foreground text-sm font-medium list-none hover:text-royal transition-colors">
                {item.q}
                <span className="text-muted ml-4 transition-transform group-open:rotate-45 shrink-0 text-lg font-light">+</span>
              </summary>
              <div className="pb-5 text-muted text-sm leading-relaxed">{item.a}</div>
            </details>
          ))}
          <div className="border-t border-foreground/15" />
        </div>

        {/* Contact */}
        <div className="mt-16 border-t border-foreground/15 pt-12">
          <h3 className="font-heading text-2xl text-foreground tracking-tight mb-2">Des questions?</h3>
          <p className="text-muted mb-8 text-sm">Notre équipe se fera un plaisir de vous aider.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="tel:4506551888" variant="outline">(450) 655-1888</Button>
            <Button href="mailto:info@judoboucherville.com" variant="outline">info@judoboucherville.com</Button>
          </div>
        </div>

      </div>
    </>
  )
}
