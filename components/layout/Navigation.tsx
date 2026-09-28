'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, X, Phone, CalendarDays, Tag, PenLine, MapPin, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { club } from '@/data/club'
import Magnetic from '@/components/ui/Magnetic'

const programmes = [
  { href: '/programmes/parents-enfants', labelFr: 'Parents / enfants', labelEn: 'Parents & children', category: 'Judo' },
  { href: '/programmes/judo-enfants', labelFr: 'Enfants débutant', labelEn: 'Kids beginner', category: 'Judo' },
  { href: '/programmes/judo-enfants-avances', labelFr: 'Enfants avancé', labelEn: 'Kids advanced', category: 'Judo' },
  { href: '/programmes/judo-enfants-competition', labelFr: 'Enfants compétition', labelEn: 'Kids competition', category: 'Judo' },
  { href: '/programmes/judo-competition', labelFr: 'Équipe de compétition', labelEn: 'Competition team', category: 'Judo' },
  { href: '/programmes/judo-adultes', labelFr: 'Judo adultes', labelEn: 'Adult judo', category: 'Judo' },
  { href: '/programmes/sport-etudes', labelFr: 'Sport-études', labelEn: 'Sport-études', category: 'Judo' },
  { href: '/programmes/prevention-chutes', labelFr: 'Prévention des chutes', labelEn: 'Fall prevention', category: 'Judo' },
  { href: '/programmes/aiki-jujitsu', labelFr: 'Aiki Ju-Jitsu', labelEn: 'Aiki Ju-Jitsu', category: 'Arts martiaux' },
  { href: '/programmes/jiu-jitsu-bresilien', labelFr: 'Jiu-Jitsu brésilien', labelEn: 'Brazilian Jiu-Jitsu', category: 'Arts martiaux' },
  { href: '/programmes/autodefense-femmes', labelFr: 'Auto-défense femmes', labelEn: 'Women’s self-defence', category: 'Arts martiaux' },
  { href: '/programmes/parascolaire', labelFr: 'Parascolaire', labelEn: 'After-school', category: 'Autres' },
  { href: '/programmes/camp-de-jour', labelFr: 'Camp de jour', labelEn: 'Day camp', category: 'Autres' },
]

const clubLinks = [
  { href: '/historique', labelFr: 'Historique', labelEn: 'History' },
  { href: '/equipe', labelFr: 'Professeurs & équipe', labelEn: 'Coaches & Team' },
  { href: '/ceintures-noires', labelFr: 'Ceintures noires', labelEn: 'Black Belts' },
  { href: '/conseil', labelFr: "Conseil d'administration", labelEn: 'Board of Directors' },
  { href: '/resultats', labelFr: 'Résultats', labelEn: 'Results' },
  { href: '/challenge', labelFr: 'Challenge', labelEn: 'Challenge' },
  { href: '/actualites', labelFr: 'Actualités', labelEn: 'News' },
  { href: '/calendrier', labelFr: 'Calendrier', labelEn: 'Calendar' },
  { href: '/telechargements', labelFr: 'Téléchargements', labelEn: 'Downloads' },
]

const tel = `tel:+1${club.tel.replace(/\D/g, '')}`

/**
 * Info-first header: the four things people come for (schedule, fees,
 * registration, address) are top-level links, the phone number is always
 * visible, and phones get a thumb bar pinned to the bottom of the screen.
 */
export default function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const fr = locale === 'fr'
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [open, setOpen] = useState<'programmes' | 'club' | null>(null)

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      // Out of the way while reading down, back on the slightest scroll up
      setHidden(y > 480 && y > lastY.current + 2)
      if (Math.abs(y - lastY.current) > 2) lastY.current = y
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Phone menu: freeze the page behind it, close on Escape
  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [mobileOpen])

  // Close menus on navigation (state adjusted during render, not in an effect)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) { setLastPath(pathname); setMobileOpen(false); setOpen(null) }

  const quick = [
    { href: `/${locale}#horaire`, label: fr ? 'Horaire' : 'Schedule', icon: CalendarDays },
    { href: `/${locale}/inscription#tarifs`, label: fr ? 'Tarifs' : 'Fees', icon: Tag },
    { href: `/${locale}/contact`, label: fr ? 'Nous trouver' : 'Find us', icon: MapPin },
  ]
  const categories = [...new Set(programmes.map(p => p.category))]
  const switchHref = `/${fr ? 'en' : 'fr'}${pathname.slice(`/${locale}`.length)}`

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] btn btn-primary">
        {fr ? 'Aller au contenu' : 'Skip to content'}
      </a>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)]',
          hidden && !mobileOpen && '-translate-y-full',
          scrolled || mobileOpen ? 'bg-panel/92 backdrop-blur-md shadow-[0_1px_0_rgba(11,27,56,.1)]' : 'bg-panel/70 backdrop-blur-sm'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center gap-6" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
          <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0" aria-label="Club de Judo Boucherville">
            <span className="grid place-items-center w-10 h-10 rounded-[6px] bg-white shadow-[0_0_0_1px_rgba(11,27,56,.1)]">
              <Image src="/images/brand/cjb-mark.png" alt="" width={30} height={31} priority />
            </span>
            <span className="font-display font-extrabold uppercase text-[1.35rem] leading-none tracking-[.02em] text-ink">
              Judo Boucherville
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 ml-2">
            <Dropdown
              label={t('programmes')}
              isOpen={open === 'programmes'}
              onOpen={o => setOpen(o ? 'programmes' : null)}
              wide
            >
              <div className="grid grid-cols-3 gap-6">
                {categories.map(cat => (
                  <div key={cat}>
                    <p className="label text-blue mb-2">{cat}</p>
                    {programmes.filter(p => p.category === cat).map(p => (
                      <Link key={p.href} href={`/${locale}${p.href}`} className="block py-1.5 text-[.9rem] text-ink-2 hover:text-ink">
                        {fr ? p.labelFr : p.labelEn}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </Dropdown>
            {quick.map(q => (
              <Link key={q.href} href={q.href} className="mx-3 py-2 text-[.9rem] font-semibold text-ink-2 hover:text-ink transition-colors u-line">
                {q.label}
              </Link>
            ))}
            <Dropdown label={t('club')} isOpen={open === 'club'} onOpen={o => setOpen(o ? 'club' : null)}>
              {clubLinks.map(l => (
                <Link key={l.href} href={`/${locale}${l.href}`} className="block py-1.5 text-[.9rem] text-ink-2 hover:text-ink">
                  {fr ? l.labelFr : l.labelEn}
                </Link>
              ))}
            </Dropdown>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:gap-4">
            <a href={tel} className="hidden md:inline-flex items-center gap-2 tabular-nums text-[.9rem] font-semibold text-ink hover:text-blue">
              <Phone size={15} aria-hidden="true" /> {club.tel}
            </a>
            <Link href={switchHref} className="grid place-items-center min-w-11 min-h-11 label text-ink-2 hover:text-ink" hrefLang={fr ? 'en' : 'fr'}>
              {fr ? 'EN' : 'FR'}
            </Link>
            <Magnetic strength={0.25} className="hidden sm:inline-block">
              <Link href={`/${locale}/inscription`} className="btn btn-primary !py-3">
                {t('inscription')}
              </Link>
            </Magnetic>
            <button
              className="lg:hidden grid place-items-center w-11 h-11 text-ink"
              onClick={() => setMobileOpen(o => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

      </header>

      {/* Phone menu, outside the header: its backdrop blur would make it the containing block of this fixed sheet. A full-screen tatami-blue sheet, the essentials first in big type */}
      {mobileOpen && (
        <div id="mobile-menu" className="on-dark lg:hidden fixed z-40 inset-x-0 top-16 bottom-0 overflow-y-auto overscroll-contain bg-blue text-panel px-4 pt-6 pb-32 [animation:sheet_.45s_cubic-bezier(.16,1,.3,1)_both]">
          <ul className="grid">
            {[...quick, { href: `/${locale}/inscription`, label: t('inscription') }, { href: `/${locale}/contact`, label: 'Contact' }].map((q, i) => (
              <li key={q.href} className="rise border-b border-panel/15" style={{ '--i': i } as React.CSSProperties}>
                <Link href={q.href} className="flex items-center justify-between min-h-14 py-2 display text-[2.3rem] leading-none">
                  {q.label} <span aria-hidden="true" className="text-accent text-2xl">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="rise mt-8 mb-2 text-[.95rem] font-semibold text-accent" style={{ '--i': 6 } as React.CSSProperties}>{t('programmes')}</p>
          <div className="rise grid grid-cols-2 gap-x-4" style={{ '--i': 7 } as React.CSSProperties}>
            {programmes.map(p => (
              <Link key={p.href} href={`/${locale}${p.href}`} className="flex items-center min-h-12 py-2 text-[1rem] text-panel/90 border-b border-panel/10">
                {fr ? p.labelFr : p.labelEn}
              </Link>
            ))}
          </div>
          <p className="rise mt-8 mb-2 text-[.95rem] font-semibold text-accent" style={{ '--i': 8 } as React.CSSProperties}>{t('club')}</p>
          <div className="rise grid grid-cols-2 gap-x-4" style={{ '--i': 9 } as React.CSSProperties}>
            {clubLinks.map(l => (
              <Link key={l.href} href={`/${locale}${l.href}`} className="flex items-center min-h-12 py-2 text-[1rem] text-panel/90 border-b border-panel/10">
                {fr ? l.labelFr : l.labelEn}
              </Link>
            ))}
          </div>
          <a href={tel} className="rise mt-10 btn btn-primary w-full" style={{ '--i': 10 } as React.CSSProperties}>
            <Phone size={18} aria-hidden="true" /> {club.tel}
          </a>
        </div>
      )}

      {/* Phones: the essentials under the thumb, on every page */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-panel/95 backdrop-blur-md shadow-[0_-1px_0_rgba(11,27,56,.12)] pb-[env(safe-area-inset-bottom)]"
        aria-label={fr ? 'Accès rapide' : 'Quick access'}
      >
        <div className="grid grid-cols-4">
          <Link href={`/${locale}#horaire`} className="flex flex-col items-center gap-1 py-2.5 text-[.78rem] font-semibold text-ink-2">
            <CalendarDays size={20} aria-hidden="true" /> {fr ? 'Horaire' : 'Schedule'}
          </Link>
          <Link href={`/${locale}/inscription#tarifs`} className="flex flex-col items-center gap-1 py-2.5 text-[.78rem] font-semibold text-ink-2">
            <Tag size={20} aria-hidden="true" /> {fr ? 'Tarifs' : 'Fees'}
          </Link>
          <a href={tel} className="flex flex-col items-center gap-1 py-2.5 text-[.78rem] font-semibold text-ink-2">
            <Phone size={20} aria-hidden="true" /> {fr ? 'Appeler' : 'Call'}
          </a>
          <Link href={`/${locale}/inscription`} className="flex flex-col items-center gap-1 py-2.5 text-[.78rem] font-semibold bg-accent text-ink">
            <PenLine size={20} aria-hidden="true" /> {fr ? 'S’inscrire' : 'Register'}
          </Link>
        </div>
      </nav>
    </>
  )
}

function Dropdown({ label, isOpen, onOpen, wide, children }: {
  label: string
  isOpen: boolean
  onOpen: (open: boolean) => void
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative" onMouseEnter={() => onOpen(true)} onMouseLeave={() => onOpen(false)}>
      <button
        className="flex items-center gap-1 px-3 py-2 text-[.9rem] font-semibold text-ink-2 hover:text-ink transition-colors"
        aria-expanded={isOpen}
        onClick={() => onOpen(!isOpen)}
      >
        {label}
        <ChevronDown size={14} aria-hidden="true" className={cn('transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'absolute top-full left-0 pt-2 transition-[opacity,transform,visibility] duration-200 ease-out',
          isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-1 pointer-events-none'
        )}
      >
        <div className={cn('rounded-[6px] bg-panel p-5 shadow-[0_0_0_1px_rgba(11,27,56,.1),0_18px_40px_-18px_rgba(11,27,56,.35)]', wide ? 'w-[620px]' : 'w-60')}>
          {children}
        </div>
      </div>
    </div>
  )
}
