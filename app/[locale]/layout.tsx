import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Providers from '@/components/providers/Providers'
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
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${bebas.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
