import type { Metadata } from 'next'
import { Big_Shoulders, Public_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import Providers from '@/components/providers/Providers'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/layout/ScrollProgress'
import CustomCursor from '@/components/ui/CustomCursor'
import PageLife from '@/components/home/PageLife'
import { club } from '@/data/club'
import '@/styles/globals.css'

// Big Shoulders: condensed scoreboard capitals. Public Sans: plain, readable text.
// Both are variable fonts, so every weight in use is real, never faked.
const display = Big_Shoulders({
  subsets: ['latin'],
  axes: ['opsz'],
  adjustFontFallback: false, // no metric overrides exist for this family; avoids a build warning
  variable: '--nf-display',
})

const sans = Public_Sans({
  subsets: ['latin'],
  variable: '--nf-sans',
})

// Runs before first paint: reveal animations may hide content only when motion is
// welcome, so titles never flash visible, vanish, then animate back in.
const motionScript = "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')"


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const fr = locale === 'fr'
  return {
    metadataBase: new URL(club.site),
    title: {
      template: '%s | Club de Judo Boucherville',
      default: 'Club de Judo Boucherville',
    },
    description: fr
      ? 'Club de Judo Boucherville, fondé en 1970, club reconnu AAA par Judo Québec. Judo, Aiki Ju-Jitsu et Jiu-Jitsu brésilien pour tous les âges à Boucherville.'
      : 'Club de Judo Boucherville, founded in 1970, an AAA club recognized by Judo Québec. Judo, Aiki Ju-Jitsu and Brazilian Jiu-Jitsu for all ages in Boucherville.',
    openGraph: {
      type: 'website',
      locale: fr ? 'fr_CA' : 'en_CA',
      alternateLocale: fr ? 'en_CA' : 'fr_CA',
      siteName: club.nom,
    },
    twitter: { card: 'summary_large_image' },
  }
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
    <html lang={locale} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <ScrollProgress />
            <CustomCursor />
            <PageLife />
            <Navigation />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
