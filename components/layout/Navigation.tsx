'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const programmes = [
  { href: '/programmes/judo-competition', labelFr: 'Judo compétition', labelEn: 'Competition Judo', category: 'Judo' },
  { href: '/programmes/judo-enfants', labelFr: 'Judo enfants', labelEn: "Children's Judo", category: 'Judo' },
  { href: '/programmes/judo-adultes', labelFr: 'Judo adultes', labelEn: 'Adult Judo', category: 'Judo' },
  { href: '/programmes/parents-enfants', labelFr: 'Parents/enfants', labelEn: 'Parents & Children', category: 'Judo' },
  { href: '/programmes/sport-etudes', labelFr: 'Sport-études', labelEn: 'Sports-Studies', category: 'Judo' },
  { href: '/programmes/judo-aines', labelFr: 'Judo aînés', labelEn: 'Seniors Judo', category: 'Judo' },
  { href: '/programmes/parascolaire', labelFr: 'Parascolaire', labelEn: 'After-School', category: 'Judo' },
  { href: '/programmes/autodefense-femmes', labelFr: 'Auto-défense femmes', labelEn: 'Women Self-Defence', category: 'Judo' },
  { href: '/programmes/aiki-jujitsu', labelFr: 'Aiki Ju-Jitsu', labelEn: 'Aiki Ju-Jitsu', category: 'Arts martiaux' },
  { href: '/programmes/jiu-jitsu-bresilien', labelFr: 'Jiu-Jitsu Brésilien', labelEn: 'Brazilian Jiu-Jitsu', category: 'Arts martiaux' },
  { href: '/programmes/camp-de-jour', labelFr: 'Camp de jour', labelEn: 'Day Camp', category: 'Autres' },
]

const clubLinks = [
  { href: '/historique', labelFr: 'Historique', labelEn: 'History' },
  { href: '/conseil', labelFr: "Conseil d'administration", labelEn: 'Board of Directors' },
  { href: '/ceintures-noires', labelFr: 'Ceintures noires', labelEn: 'Black Belts' },
  { href: '/equipe', labelFr: 'Professeurs & équipe', labelEn: 'Coaches & Team' },
]

const navLinks = [
  { href: '/resultats', key: 'resultats' },
  { href: '/challenge', key: 'challenge' },
  { href: '/actualites', key: 'actualites' },
  { href: '/contact', key: 'contact' },
]

export default function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [programmesOpen, setProgrammesOpen] = useState(false)
  const [clubOpen, setClubOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      // Hide when scrolling down past the hero, reappear on any scroll up
      setHidden(y > 400 && y > lastY.current && !mobileOpen)
      lastY.current = y
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [mobileOpen])

  const categories = [...new Set(programmes.map(p => p.category))]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        hidden && '-translate-y-full',
        scrolled && 'backdrop-blur-xl'
      )}
      style={scrolled ? {
        backgroundColor: 'color-mix(in srgb, var(--voie-bg) 86%, transparent)',
        borderBottom: '1px solid var(--voie-hairline)',
      } : undefined}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href={`/${locale}`} className="group flex items-center gap-3">
            <Image
              src="/images/logo-cjb-improved.png"
              alt="Club de Judo Boucherville"
              width={44}
              height={44}
              className="rounded-full"
            />
            <span
              className="font-heading text-xl tracking-[.12em] group-hover:text-royal transition-colors"
              style={{ color: 'var(--voie-ink)' }}
            >
              JUDO BOUCHERVILLE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setProgrammesOpen(true)}
              onMouseLeave={() => setProgrammesOpen(false)}
            >
              <button className="text-[11px] text-[var(--voie-ink-muted)] hover:text-[var(--voie-ink)] transition-colors tracking-[.12em] uppercase font-medium py-2 flex items-center gap-1">
                {t('programmes')}
                <span className="opacity-60 text-[9px]">▾</span>
              </button>

              <AnimatePresence>
                {programmesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] backdrop-blur-xl border p-6 grid grid-cols-3 gap-6"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--voie-bg) 94%, transparent)', borderColor: 'var(--voie-hairline)' }}
                  >
                    {categories.map(cat => (
                      <div key={cat}>
                        <p className="text-[10px] text-royal/70 font-semibold uppercase tracking-[.2em] mb-3">{cat}</p>
                        {programmes.filter(p => p.category === cat).map(prog => (
                          <Link
                            key={prog.href}
                            href={`/${locale}${prog.href}`}
                            className="block text-[12px] text-[var(--voie-ink-muted)] hover:text-[var(--voie-ink)] py-1.5 transition-colors"
                          >
                            {locale === 'fr' ? prog.labelFr : prog.labelEn}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setClubOpen(true)}
              onMouseLeave={() => setClubOpen(false)}
            >
              <button className="text-[11px] text-[var(--voie-ink-muted)] hover:text-[var(--voie-ink)] transition-colors tracking-[.12em] uppercase font-medium py-2 flex items-center gap-1">
                {t('club')}
                <span className="opacity-60 text-[9px]">▾</span>
              </button>

              <AnimatePresence>
                {clubOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 backdrop-blur-xl border p-4"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--voie-bg) 94%, transparent)', borderColor: 'var(--voie-hairline)' }}
                  >
                    {clubLinks.map(link => (
                      <Link
                        key={link.href}
                        href={`/${locale}${link.href}`}
                        className="block text-[12px] text-muted hover:text-white py-1.5 transition-colors"
                      >
                        {locale === 'fr' ? link.labelFr : link.labelEn}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={cn(
                  'text-[11px] tracking-[.12em] uppercase font-medium transition-colors',
                  pathname.startsWith(`/${locale}${link.href}`)
                    ? 'text-royal'
                    : 'text-[var(--voie-ink-muted)] hover:text-[var(--voie-ink)]'
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              href={`/${locale === 'fr' ? 'en' : 'fr'}${pathname.slice(`/${locale}`.length)}`}
              className="text-[11px] text-[var(--voie-ink-muted)] hover:text-[var(--voie-ink)] transition-colors tracking-[.12em] uppercase"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </Link>
            <Link
              href={`/${locale}/inscription`}
              className="text-[11px] font-bold tracking-[.1em] uppercase bg-royal text-white px-5 py-2.5 hover:bg-accent-glow transition-colors"
            >
              {t('inscription')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1"
            style={{ color: 'var(--voie-ink)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden backdrop-blur-xl border-t overflow-hidden"
            style={{ backgroundColor: 'color-mix(in srgb, var(--voie-bg) 94%, transparent)', borderColor: 'var(--voie-hairline)' }}
          >
            <div className="px-6 py-8 space-y-1">
              {programmes.map((prog, i) => (
                <motion.div
                  key={prog.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/${locale}${prog.href}`}
                    className="block text-sm text-[var(--voie-ink-muted)] hover:text-[var(--voie-ink)] py-2 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {locale === 'fr' ? prog.labelFr : prog.labelEn}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-5 border-t border-white/[0.06] space-y-1">
                <p className="text-[10px] text-royal/70 font-semibold uppercase tracking-[.2em] pt-1 pb-1">{t('club')}</p>
                {clubLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (programmes.length + i) * 0.03 }}
                  >
                    <Link
                      href={`/${locale}${link.href}`}
                      className="block text-sm text-[var(--voie-ink-muted)] hover:text-[var(--voie-ink)] py-1.5 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {locale === 'fr' ? link.labelFr : link.labelEn}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-3 border-t border-white/[0.04]" />
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (programmes.length + clubLinks.length + i) * 0.03 }}
                  >
                    <Link
                      href={`/${locale}${link.href}`}
                      className="block text-sm text-[var(--voie-ink)] hover:text-royal py-2 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4">
                  <Link
                    href={`/${locale}/inscription`}
                    className="block text-center text-sm font-bold tracking-widest uppercase bg-royal text-white px-6 py-3 mt-2"
                  >
                    {t('inscription')}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
