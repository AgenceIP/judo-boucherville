import type { Metadata } from 'next'
import { Source_Serif_4 } from 'next/font/google'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import Providers from '@/components/providers/Providers'
import PageTransition from '@/components/providers/PageTransition'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import VelocitySkew from '@/components/providers/VelocitySkew'
import ScrollProgress from '@/components/layout/ScrollProgress'
import '@/styles/globals.css'

const serif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
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
    <html lang={locale} className={`${serif.variable} ${bebas.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <CustomCursor />
            <VelocitySkew />
            <ScrollProgress />
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
