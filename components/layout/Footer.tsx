import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react'

const quickLinks = [
  { href: '/programmes', key: 'programmes' },
  { href: '/equipe', key: 'equipe' },
  { href: '/historique', key: 'historique' },
  { href: '/resultats', key: 'resultats' },
  { href: '/challenge', key: 'challenge' },
  { href: '/inscription', key: 'inscription' },
]

const schedules = [
  { label: 'Parents/enfants', time: 'Sam 9h00–10h00' },
  { label: 'Enfants débutants', time: 'Sam 10h15–12h30' },
  { label: 'Judo adulte', time: 'Lun/Mer 19h00–21h00' },
  { label: 'Aiki Ju-Jitsu', time: 'Mar/Jeu 20h00–21h30' },
  { label: 'BJJ', time: 'Mar/Jeu 19h45–21h00' },
]

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <footer className="bg-bg-surface border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-heading text-2xl tracking-wider">
              JUDO<span className="text-accent-blue">BOUCHERVILLE</span>
            </span>
            <p className="text-muted text-sm mt-4 leading-relaxed">
              Club de Judo Boucherville Inc.<br />
              Fondé en 1970 · Club reconnu AAA<br />
              par Judo Québec
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/clubdejudoboucherville" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent-blue transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/judoboucherville" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent-blue transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@judoboucherville" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent-blue transition-colors" aria-label="TikTok">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.79a8.18 8.18 0 0 0 4.79 1.52V6.84a4.85 4.85 0 0 1-1.02-.15z"/></svg>
              </a>
              <a href="https://www.youtube.com/@judoboucherville" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent-blue transition-colors" aria-label="YouTube">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-sm tracking-widest text-muted uppercase mb-4">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-foreground hover:text-accent-blue transition-colors"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedules */}
          <div>
            <h3 className="font-heading text-sm tracking-widest text-muted uppercase mb-4">
              {t('footer.schedules')}
            </h3>
            <ul className="space-y-2">
              {schedules.map(s => (
                <li key={s.label} className="text-sm">
                  <span className="text-foreground">{s.label}</span>
                  <span className="text-muted block">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm tracking-widest text-muted uppercase mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm">
                <MapPin size={16} className="text-accent-blue shrink-0 mt-0.5" />
                <span className="text-foreground">490 chemin du Lac<br />Boucherville (QC) J4B 6X3</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone size={16} className="text-accent-blue shrink-0" />
                <a href="tel:4506551888" className="text-foreground hover:text-accent-blue transition-colors">
                  (450) 655-1888
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail size={16} className="text-accent-blue shrink-0" />
                <a href="mailto:info@judoboucherville.com" className="text-foreground hover:text-accent-blue transition-colors">
                  info@judoboucherville.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-muted">
          © {new Date().getFullYear()} Club de Judo Boucherville Inc. — {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
