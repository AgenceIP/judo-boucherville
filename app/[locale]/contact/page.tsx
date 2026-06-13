import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PageHero from '@/components/shared/PageHero'
import ContactForm from '@/components/pages/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Contact' : 'Contact' }
}

export default async function ContactPage() {
  const locale = await getLocale()
  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Nous contacter' : 'Contact Us'}
        subtitle={locale === 'fr' ? 'Une question? Nous sommes là pour vous aider.' : "A question? We're here to help."}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-heading text-2xl text-foreground tracking-wider mb-8">Informations</h2>
            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <MapPin className="text-accent-blue shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-foreground font-medium">Dojo Marcel Bourelly</p>
                  <p className="text-muted text-sm">Complexe aquatique Laurie-Ève Cormier</p>
                  <p className="text-muted text-sm">490 chemin du Lac</p>
                  <p className="text-muted text-sm">Boucherville (Québec) J4B 6X3</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-accent-blue shrink-0" size={20} />
                <a href="tel:4506551888" className="text-foreground hover:text-accent-blue transition-colors">(450) 655-1888</a>
              </div>
              <div className="flex gap-4">
                <Mail className="text-accent-blue shrink-0" size={20} />
                <a href="mailto:info@judoboucherville.com" className="text-foreground hover:text-accent-blue transition-colors">info@judoboucherville.com</a>
              </div>
              <div className="flex gap-4">
                <Clock className="text-accent-blue shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-foreground font-medium text-sm mb-2">Horaires du bureau</p>
                  <p className="text-muted text-sm">Contactez-nous par courriel pour toute question administrative.</p>
                </div>
              </div>
            </div>
            <div className="overflow-hidden h-64 border border-white/[0.06]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.!2d-73.!3d45.!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc90ba!2s490%20Chemin%20du%20Lac%2C%20Boucherville%2C%20QC!5e0!3m2!1sfr!2sca!4v"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dojo Marcel Bourelly"
              />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-2xl text-foreground tracking-wider mb-8">Envoyez-nous un message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  )
}
