'use client'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'
import { getProgrammeBySlug } from '@/data/programmes'
import { club } from '@/data/club'

const quickLinks = [
  { href: '/programmes', labelFr: 'Programmes', labelEn: 'Programs' },
  { href: '/resultats', labelFr: 'Résultats', labelEn: 'Results' },
  { href: '/calendrier', labelFr: 'Calendrier', labelEn: 'Calendar' },
  { href: '/athletes', labelFr: 'Athlètes', labelEn: 'Athletes' },
  { href: '/challenge', labelFr: 'Challenge', labelEn: 'Challenge' },
  { href: '/telechargements', labelFr: 'Téléchargements', labelEn: 'Downloads' },
  { href: '/historique', labelFr: 'Historique', labelEn: 'History' },
  { href: '/conseil', labelFr: "Conseil d'administration", labelEn: 'Board of Directors' },
  { href: '/ceintures-noires', labelFr: 'Ceintures noires', labelEn: 'Black Belts' },
  { href: '/inscription', labelFr: "S'inscrire", labelEn: 'Register' },
]

// Short schedules straight from the programme data
const schedules = ['parents-enfants', 'judo-enfants', 'judo-adultes', 'aiki-jujitsu', 'jiu-jitsu-bresilien']
  .map(slug => getProgrammeBySlug(slug)!)

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <footer className="bg-ink text-panel">
      <div className="h-2 bg-accent" aria-hidden="true" />
      {/* Giant outlined wordmark: fills with tatami yellow on hover, rises back to the top on click */}
      <div className="overflow-hidden pt-12 -mb-2">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          className="footer-mark display block w-full text-center whitespace-nowrap select-none text-[clamp(3rem,11vw,10rem)] leading-[.85]"
          aria-label={locale === 'fr' ? 'Remonter en haut de page' : 'Back to top'}
        >
          Judo Boucherville
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3">
              <span className="grid place-items-center w-14 h-14 rounded-[6px] bg-white">
                <Image src="/images/brand/cjb-mark.png" alt="" width={42} height={43} />
              </span>
              <span className="font-display font-extrabold uppercase text-2xl leading-none">Judo<br />Boucherville</span>
            </Link>
            <p className="text-panel/70 text-sm mt-5 leading-relaxed">
              Club de Judo Boucherville Inc.<br />
              {locale === 'fr' ? 'Fondé en 1970 · Club reconnu AAA par Judo Québec' : 'Founded in 1970 · AAA club recognized by Judo Québec'}
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/clubdejudoboucherville" target="_blank" rel="noopener noreferrer" className="text-panel/70 hover:text-accent transition-colors" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/judoboucherville" target="_blank" rel="noopener noreferrer" className="text-panel/70 hover:text-accent transition-colors" aria-label="Instagram">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={club.tiktok} target="_blank" rel="noopener noreferrer" className="text-panel/70 hover:text-accent transition-colors" aria-label="TikTok">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.79a8.18 8.18 0 0 0 4.79 1.52V6.84a4.85 4.85 0 0 1-1.02-.15z"/></svg>
              </a>
              <a href={club.youtube} target="_blank" rel="noopener noreferrer" className="text-panel/70 hover:text-accent transition-colors" aria-label="YouTube">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="label text-accent mb-4">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-panel hover:text-accent transition-colors"
                  >
                    {locale === 'fr' ? link.labelFr : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedules */}
          <div>
            <h3 className="label text-accent mb-4">
              {t('footer.schedules')}
            </h3>
            <ul className="space-y-2">
              {schedules.map(s => (
                <li key={s.slug} className="text-sm">
                  <Link href={`/${locale}/programmes/${s.slug}`} className="text-panel hover:text-accent transition-colors">
                    {locale === 'fr' ? s.titre : s.titreEn}
                  </Link>
                  <span className="text-panel/60 block tabular-nums text-xs mt-0.5">{s.horaire}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="label text-accent mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm">
                <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                <span className="text-panel">490, chemin du Lac<br />Boucherville (QC) J4B 6X3</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone size={16} className="text-accent shrink-0" />
                <a href="tel:+14506551888" className="text-panel hover:text-accent transition-colors">
                  {club.tel}
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail size={16} className="text-accent shrink-0" />
                <a href="mailto:info@judoboucherville.com" className="text-panel hover:text-accent transition-colors">
                  info@judoboucherville.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-panel/15 flex flex-col items-center gap-3 text-center text-sm text-panel/60">
          <p className="text-panel/80">
            <span className="font-jp mr-3 text-accent" aria-hidden="true">礼</span>
            {locale === 'fr' ? 'À bientôt sur le tatami.' : 'See you on the tatami.'}
          </p>
          <p>© {new Date().getFullYear()} Club de Judo Boucherville Inc. · {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
