'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

const programmes = [
  { href: '/programmes/judo-competition', labelFr: 'Judo compétition', category: 'Judo' },
  { href: '/programmes/judo-enfants', labelFr: 'Judo enfants', category: 'Judo' },
  { href: '/programmes/judo-adultes', labelFr: 'Judo adultes', category: 'Judo' },
  { href: '/programmes/parents-enfants', labelFr: 'Parents/enfants', category: 'Judo' },
  { href: '/programmes/sport-etudes', labelFr: 'Sport-études', category: 'Judo' },
  { href: '/programmes/judo-aines', labelFr: 'Judo aînés', category: 'Judo' },
  { href: '/programmes/aiki-jujitsu', labelFr: 'Aiki Ju-Jitsu', category: 'Arts martiaux' },
  { href: '/programmes/jiu-jitsu-bresilien', labelFr: 'Jiu-Jitsu Brésilien', category: 'Arts martiaux' },
  { href: '/programmes/autodéfense', labelFr: 'Auto-défense', category: 'Arts martiaux' },
  { href: '/programmes/kata', labelFr: 'Kata', category: 'Arts martiaux' },
  { href: '/programmes/camp-de-jour', labelFr: 'Camp de jour', category: 'Autres' },
  { href: '/programmes/judo-scolaire', labelFr: 'Judo scolaire', category: 'Autres' },
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
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const categories = [...new Set(programmes.map(p => p.category))]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-bg-base/95 backdrop-blur-md border-b border-white/5 shadow-lg' : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="font-heading text-2xl text-foreground tracking-wider">
              JUDO<span className="text-accent-blue">BOUCHERVILLE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Programmes mega-menu trigger */}
            <div
              className="relative"
              onMouseEnter={() => setProgrammesOpen(true)}
              onMouseLeave={() => setProgrammesOpen(false)}
            >
              <button className="text-sm text-muted hover:text-foreground transition-colors py-2">
                {t('programmes')} <span className="ml-1">▾</span>
              </button>

              <AnimatePresence>
                {programmesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-bg-surface border border-white/10 rounded-xl shadow-2xl p-6 grid grid-cols-3 gap-4"
                  >
                    {categories.map(cat => (
                      <div key={cat}>
                        <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-3">{cat}</p>
                        {programmes.filter(p => p.category === cat).map(prog => (
                          <Link
                            key={prog.href}
                            href={`/${locale}${prog.href}`}
                            className="block text-sm text-foreground hover:text-accent-blue py-1 transition-colors"
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
                  'text-sm transition-colors',
                  pathname.startsWith(`/${locale}${link.href}`) ? 'text-accent-blue' : 'text-muted hover:text-foreground'
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Right side: locale + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={`/${locale === 'fr' ? 'en' : 'fr'}${pathname.slice(`/${locale}`.length)}`}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </Link>
            <Button href={`/${locale}/inscription`} size="sm">
              {t('inscription')}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="lg:hidden bg-bg-surface border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {programmes.map((prog, i) => (
                <motion.div
                  key={prog.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/${locale}${prog.href}`}
                    className="block text-foreground hover:text-accent-blue py-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {prog.labelFr}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (programmes.length + i) * 0.04 }}
                  >
                    <Link
                      href={`/${locale}${link.href}`}
                      className="block text-foreground hover:text-accent-blue py-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                <Button href={`/${locale}/inscription`} className="w-full mt-4">
                  {t('inscription')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
