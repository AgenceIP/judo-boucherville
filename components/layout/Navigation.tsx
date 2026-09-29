'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, X, Phone, CalendarDays, Tag, PenLine, Mail, MapPin, ArrowRight, ChevronDown } from 'lucide-react'
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

const athletes = { href: '/athletes', labelFr: 'Athlètes', labelEn: 'Athletes' }

const tel = `tel:+1${club.tel.replace(/\D/g, '')}`

/**
 * Computers: a classic wall-white header bar with everything in view; a hairline
 * appears under it once the page moves. (Solid, not see-through: the home tour
 * opens on the blue mats, where dark links would disappear.)
 * Phones and tablets: the logo, a yellow « S'inscrire » pill and a navy « Menu »
 * pill that opens a full-screen tatami-blue menu, plus the thumb bar at the bottom.
 */
export default function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const fr = locale === 'fr'
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState<'programmes' | 'club' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Open menu: freeze the page behind it, focus the first link, Escape closes
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    firstLink.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  // Close on navigation (state adjusted during render, not in an effect)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); setDrop(null) }

  const essentials = [
    { href: `/${locale}#trouver`, label: fr ? 'Trouver mon cours' : 'Find my class' },
    { href: `/${locale}#horaire`, label: fr ? 'Horaire' : 'Schedule' },
    { href: `/${locale}/inscription#tarifs`, label: fr ? 'Tarifs' : 'Fees' },
    { href: `/${locale}/inscription`, label: t('inscription') },
    { href: `/${locale}/contact`, label: fr ? 'Nous trouver' : 'Find us' },
  ]
  const categories = [...new Set(programmes.map(p => p.category))]
  const switchHref = `/${fr ? 'en' : 'fr'}${pathname.slice(`/${locale}`.length)}`
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.adresse)}`
  const current = (href: string) => (pathname.startsWith(`/${locale}${href}`) ? ('page' as const) : undefined)
  const barLinks = [
    { href: `/${locale}#horaire`, label: fr ? 'Horaire' : 'Schedule' },
    { href: `/${locale}/inscription#tarifs`, label: fr ? 'Tarifs' : 'Fees' },
    { href: `/${locale}${athletes.href}`, label: fr ? athletes.labelFr : athletes.labelEn, current: current(athletes.href) },
  ]
  const linkCls = 'block px-3 py-2 text-[.95rem] font-semibold text-ink-2 hover:text-ink transition-colors'

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] btn btn-primary">
        {fr ? 'Aller au contenu' : 'Skip to content'}
      </a>

      {/* Computers */}
      <header
        className={cn(
          'hidden lg:block fixed top-0 inset-x-0 z-50 bg-panel transition-shadow duration-500',
          scrolled && 'shadow-[0_1px_0_rgba(11,27,56,.1)]'
        )}
      >
        <nav className="max-w-7xl mx-auto px-8 h-[4.5rem] flex items-center gap-6" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
          <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0" aria-label="Club de Judo Boucherville">
            <span className="grid place-items-center w-11 h-11 rounded-[8px] bg-white shadow-[0_0_0_1px_rgba(11,27,56,.08),0_4px_12px_-6px_rgba(11,27,56,.45)]">
              <Image src="/images/brand/cjb-mark.png" alt="" width={32} height={33} style={{ height: 'auto' }} priority />
            </span>
            <span className="hidden xl:block font-display font-extrabold uppercase text-[1.45rem] leading-none text-ink">Judo Boucherville</span>
          </Link>

          <ul className="flex items-center">
            <Dropdown label={t('programmes')} isOpen={drop === 'programmes'} onOpen={o => setDrop(o ? 'programmes' : null)} wide>
              <div className="grid grid-cols-3 gap-8">
                {categories.map(cat => (
                  <div key={cat}>
                    <p className="font-display font-extrabold uppercase text-[1.1rem] text-blue mb-2">{cat}</p>
                    {programmes.filter(p => p.category === cat).map(p => (
                      <Link key={p.href} href={`/${locale}${p.href}`} aria-current={current(p.href)} className="block py-1.5 text-[.92rem] text-ink-2 hover:text-blue aria-[current=page]:text-blue aria-[current=page]:font-semibold">
                        {fr ? p.labelFr : p.labelEn}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              <Link href={`/${locale}/programmes`} className="mt-5 pt-4 border-t border-ink/10 flex items-center gap-2 text-[.92rem] font-semibold text-blue hover:text-ink">
                {fr ? 'Tous les programmes' : 'All programs'} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Dropdown>
            {barLinks.map(l => (
              <li key={l.href}>
                <Link href={l.href} aria-current={l.current} className={linkCls}>
                  <span className={cn('u-line', l.current && 'bg-[length:100%_1.5px]')}>{l.label}</span>
                </Link>
              </li>
            ))}
            <Dropdown label={t('club')} isOpen={drop === 'club'} onOpen={o => setDrop(o ? 'club' : null)}>
              {clubLinks.map(l => (
                <Link key={l.href} href={`/${locale}${l.href}`} aria-current={current(l.href)} className="block py-1.5 text-[.92rem] text-ink-2 hover:text-blue aria-[current=page]:text-blue aria-[current=page]:font-semibold">
                  {fr ? l.labelFr : l.labelEn}
                </Link>
              ))}
            </Dropdown>
            <li>
              <Link href={`/${locale}/contact`} aria-current={current('/contact')} className={linkCls}>
                <span className={cn('u-line', current('/contact') && 'bg-[length:100%_1.5px]')}>{t('contact')}</span>
              </Link>
            </li>
          </ul>

          <div className="ml-auto flex items-center gap-2">
            <Link href={switchHref} hrefLang={fr ? 'en' : 'fr'} className="grid place-items-center min-w-11 min-h-11 text-[.85rem] font-semibold text-ink-2 hover:text-ink">
              {fr ? 'EN' : 'FR'}
            </Link>
            <Magnetic strength={0.2}>
              <Link href={`/${locale}/inscription`} className="btn btn-primary !rounded-full !py-3 !px-5">
                {t('inscription')}
              </Link>
            </Magnetic>
          </div>
        </nav>
      </header>

      {/* Phones and tablets: the bar lets clicks through; only its three pieces are interactive */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 pointer-events-none">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 h-[4.5rem] flex items-center justify-between" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
          <Link
            href={`/${locale}`}
            className="pointer-events-auto grid place-items-center w-12 h-12 rounded-[8px] bg-white shadow-[0_0_0_1px_rgba(11,27,56,.08),0_6px_18px_-8px_rgba(11,27,56,.5)] transition-transform duration-300 hover:scale-[1.04]"
            aria-label="Club de Judo Boucherville"
          >
            <Image src="/images/brand/cjb-mark.png" alt="" width={36} height={37} style={{ height: 'auto' }} priority />
          </Link>

          <div className="pointer-events-auto flex items-center gap-2">
            {/* phones already have « S’inscrire » in the thumb bar */}
            <Magnetic strength={0.2} className="hidden sm:inline-block">
              <Link href={`/${locale}/inscription`} className="btn btn-primary !rounded-full !py-3 !px-5 shadow-[0_6px_18px_-8px_rgba(11,27,56,.55)]">
                {t('inscription')}
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button
                ref={menuBtn}
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                aria-controls="site-menu"
                className="btn !rounded-full !py-3 !px-5 bg-ink text-panel [--wipe:#FCFDFE] [&:hover]:text-ink focus-visible:text-ink shadow-[0_6px_18px_-8px_rgba(11,27,56,.55)]"
              >
                {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
                {open ? (fr ? 'Fermer' : 'Close') : 'Menu'}
              </button>
            </Magnetic>
          </div>
        </nav>
      </header>

      {open && (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="on-dark lg:hidden fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-blue text-panel [animation:sheet_.5s_cubic-bezier(.16,1,.3,1)_both]"
          // any link inside closes the menu, including same-page anchors like #horaire
          onClick={e => { if ((e.target as Element).closest('a')) setOpen(false) }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-32 grid gap-12 md:grid-cols-[1.25fr_1fr_1fr] md:gap-10">
            <ul className="grid content-start">
              {essentials.map((q, i) => (
                <li key={q.href} className="rise border-b border-panel/15" style={{ '--i': i } as React.CSSProperties}>
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={q.href}
                    className="group flex items-center justify-between gap-4 min-h-14 py-3 display text-[2.4rem] leading-none transition-colors hover:text-accent"
                  >
                    <span className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2">{q.label}</span>
                    <ArrowRight size={26} aria-hidden="true" className="shrink-0 text-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="rise" style={{ '--i': 5 } as React.CSSProperties}>
              <p className="display text-[1.5rem] text-accent mb-3">{t('programmes')}</p>
              {categories.map(cat => (
                <div key={cat} className="mb-5">
                  <p className="text-[.85rem] font-semibold text-panel/60 mb-1">{cat}</p>
                  <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-4">
                    {programmes.filter(p => p.category === cat).map(p => (
                      <li key={p.href}>
                        <Link href={`/${locale}${p.href}`} className="flex items-center min-h-11 text-[1.02rem] text-panel/90 hover:text-accent transition-colors">
                          {fr ? p.labelFr : p.labelEn}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="rise" style={{ '--i': 6 } as React.CSSProperties}>
              <p className="display text-[1.5rem] text-accent mb-3">{t('club')}</p>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-4">
                {[athletes, ...clubLinks].map(l => (
                  <li key={l.href}>
                    <Link href={`/${locale}${l.href}`} className="flex items-center min-h-11 text-[1.02rem] text-panel/90 hover:text-accent transition-colors">
                      {fr ? l.labelFr : l.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-1 text-[1rem]">
                <a href={tel} className="inline-flex items-center gap-3 min-h-11 font-semibold tabular-nums hover:text-accent"><Phone size={18} aria-hidden="true" /> {club.tel}</a>
                <a href={`mailto:${club.courriel}`} className="inline-flex items-center gap-3 min-h-11 hover:text-accent break-all"><Mail size={18} aria-hidden="true" /> {club.courriel}</a>
                <a href={map} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-3 py-2.5 hover:text-accent"><MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0" /> {club.adresse}</a>
              </div>
              <Link href={switchHref} hrefLang={fr ? 'en' : 'fr'} className="mt-6 btn btn-ghost-light !rounded-full !py-2.5">
                {fr ? 'English' : 'Français'}
              </Link>
            </div>
          </div>
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

/**
 * Header dropdown: opens on hover or click, closes on Escape, when the pointer
 * leaves or when focus moves out. A keyboard press on the button toggles it.
 */
function Dropdown({ label, isOpen, onOpen, wide, children }: {
  label: string
  isOpen: boolean
  onOpen: (open: boolean) => void
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <li
      className="relative"
      onMouseEnter={() => onOpen(true)}
      onMouseLeave={() => onOpen(false)}
      onKeyDown={e => { if (e.key === 'Escape') onOpen(false) }}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) onOpen(false) }}
    >
      <button
        className="flex items-center gap-1 px-3 py-2 text-[.95rem] font-semibold text-ink-2 hover:text-ink transition-colors"
        aria-expanded={isOpen}
        onClick={e => onOpen(e.detail === 0 ? !isOpen : true)}
      >
        {label}
        <ChevronDown size={14} aria-hidden="true" className={cn('transition-transform duration-300', isOpen && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'absolute top-full left-0 pt-3 transition-[opacity,translate,visibility] duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
          isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-1.5'
        )}
      >
        <div className={cn('rounded-[8px] bg-panel p-6 shadow-[0_0_0_1px_rgba(11,27,56,.08),0_8px_8px_-4px_rgba(11,27,56,.12)]', wide ? 'w-[640px]' : 'w-64')}>
          {children}
        </div>
      </div>
    </li>
  )
}
