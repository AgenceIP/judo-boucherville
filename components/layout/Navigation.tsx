'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const programmes = [
  { href: '/programmes/judo-competition', labelFr: 'Judo compétition', category: 'Judo' },
  { href: '/programmes/judo-enfants', labelFr: 'Judo enfants', category: 'Judo' },
  { href: '/programmes/judo-adultes', labelFr: 'Judo adultes', category: 'Judo' },
  { href: '/programmes/parents-enfants', labelFr: 'Parents/enfants', category: 'Judo' },
  { href: '/programmes/sport-etudes', labelFr: 'Sport-études', category: 'Judo' },
  { href: '/programmes/judo-aines', labelFr: 'Judo aînés', category: 'Judo' },
  { href: '/programmes/aiki-jujitsu', labelFr: 'Aiki Ju-Jitsu', category: 'Arts martiaux' },
  { href: '/programmes/jiu-jitsu-bresilien', labelFr: 'Jiu-Jitsu Brésilien', category: 'Arts martiaux' },
  { href: '/programmes/camp-de-jour', labelFr: 'Camp de jour', category: 'Autres' },
]

const navLinks = [
  { href: '/equipe', key: 'equipe' },
  { href: '/historique', key: 'historique' },
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [programmesOpen, setProgrammesOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const categories = [...new Set(programmes.map(p => p.category))]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled
        ? 'bg-black/90 backdrop-blur-xl border-b border-white/[0.06]'
        : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href={`/${locale}`} className="group flex items-center gap-2">
            <span className="font-heading text-2xl text-white tracking-[.15em]">
              JUDO
            </span>
            <span className="w-[1px] h-5 bg-gold/60 group-hover:bg-gold transition-colors" />
            <span className="font-heading text-2xl text-gold tracking-[.15em]">
              BOUCHERVILLE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setProgrammesOpen(true)}
              onMouseLeave={() => setProgrammesOpen(false)}
            >
              <button className="text-[11px] text-muted hover:text-white transition-colors tracking-[.12em] uppercase font-medium py-2 flex items-center gap-1">
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[560px] bg-black/95 backdrop-blur-xl border border-white/10 p-6 grid grid-cols-3 gap-6"
                  >
                    {categories.map(cat => (
                      <div key={cat}>
                        <p className="text-[10px] text-gold/70 font-semibold uppercase tracking-[.2em] mb-3">{cat}</p>
                        {programmes.filter(p => p.category === cat).map(prog => (
                          <Link
                            key={prog.href}
                            href={`/${locale}${prog.href}`}
                            className="block text-[12px] text-muted hover:text-white py-1.5 transition-colors"
                          >
                            {prog.labelFr}
                          </Link>
                        ))}
                      </div>
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
                    ? 'text-gold'
                    : 'text-muted hover:text-white'
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
              className="text-[11px] text-muted hover:text-white transition-colors tracking-[.12em] uppercase"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </Link>
            <Link
              href={`/${locale}/inscription`}
              className="text-[11px] font-bold tracking-[.1em] uppercase bg-gold text-black px-5 py-2.5 hover:bg-accent-glow transition-colors"
            >
              {t('inscription')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-1"
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
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden"
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
                    className="block text-sm text-muted hover:text-white py-2 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {prog.labelFr}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-5 border-t border-white/[0.06] space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (programmes.length + i) * 0.03 }}
                  >
                    <Link
                      href={`/${locale}${link.href}`}
                      className="block text-sm text-foreground hover:text-gold py-2 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4">
                  <Link
                    href={`/${locale}/inscription`}
                    className="block text-center text-sm font-bold tracking-widest uppercase bg-gold text-black px-6 py-3 mt-2"
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
