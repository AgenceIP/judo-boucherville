'use client'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Mail } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const quickLinks = [
  { href: '/programmes', labelFr: 'Programmes', labelEn: 'Programs' },
  { href: '/resultats', labelFr: 'Résultats', labelEn: 'Results' },
  { href: '/challenge', labelFr: 'Challenge', labelEn: 'Challenge' },
  { href: '/historique', labelFr: 'Historique', labelEn: 'History' },
  { href: '/conseil', labelFr: "Conseil d'administration", labelEn: 'Board of Directors' },
  { href: '/ceintures-noires', labelFr: 'Ceintures noires', labelEn: 'Black Belts' },
  { href: '/inscription', labelFr: "S'inscrire", labelEn: 'Register' },
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
  const wordmarkRef = useReveal<HTMLDivElement>()

  return (
    <footer className="bg-black/70 border-t border-white/[0.06]">
      {/* Giant outlined wordmark */}
      <div ref={wordmarkRef} className="overflow-hidden pt-14 -mb-4">
        <p
          className="text-stroke font-heading text-center leading-[.85] select-none whitespace-nowrap tracking-tight"
          style={{ fontSize: 'clamp(56px, 10.5vw, 190px)' }}
          aria-hidden="true"
        >
          JUDO BOUCHERVILLE
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-heading text-2xl tracking-widest text-white">
              JUDO<span className="text-accent-blue">·</span>BOUCHERVILLE
            </span>
            <p className="text-muted text-sm mt-4 leading-relaxed">
              Club de Judo Boucherville Inc.<br />
              Fondé en 1970 · Club reconnu AAA<br />
              par Judo Québec
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/clubdejudoboucherville" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-royal transition-colors" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/judoboucherville" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-royal transition-colors" aria-label="Instagram">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@judoboucherville" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-royal transition-colors" aria-label="TikTok">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.79a8.18 8.18 0 0 0 4.79 1.52V6.84a4.85 4.85 0 0 1-1.02-.15z"/></svg>
              </a>
              <a href="https://www.youtube.com/@judoboucherville" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-royal transition-colors" aria-label="YouTube">
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
                    className="text-sm text-foreground hover:text-royal transition-colors"
                  >
                    {locale === 'fr' ? link.labelFr : link.labelEn}
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
                <a href="tel:4506551888" className="text-foreground hover:text-royal transition-colors">
                  (450) 655-1888
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail size={16} className="text-accent-blue shrink-0" />
                <a href="mailto:info@judoboucherville.com" className="text-foreground hover:text-royal transition-colors">
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
