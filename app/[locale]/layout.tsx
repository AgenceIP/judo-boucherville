import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import Providers from '@/components/providers/Providers'
import PageTransition from '@/components/providers/PageTransition'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const bebas = localFont({
  src: '../../public/fonts/BebasNeue-Regular.ttf',
  variable: '--font-bebas',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Club de Judo Boucherville',
    default: 'Club de Judo Boucherville',
  },
  description: 'Club de Judo Boucherville — Fondé en 1970, Club reconnu AAA par Judo Québec. Judo, Aiki Ju-Jitsu, Jiu-Jitsu Brésilien à Boucherville, QC.',
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: 'en_CA',
    siteName: 'Club de Judo Boucherville',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${bebas.variable}`}>
      <body>
        {/* Base dark background — always visible */}
        <div className="fixed inset-0 -z-10 bg-[#0A0A0A]" aria-hidden />
        {/* Subtle noise texture overlay */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -9, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} aria-hidden />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navigation />
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
