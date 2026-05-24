import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getAllActualites, type Actualite } from '@/sanity/queries/actualites'
import PageHero from '@/components/shared/PageHero'
import { urlFor } from '@/lib/sanityImage'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Actualités' }
export const revalidate = 3600

export default async function ActualitesPage() {
  const locale = await getLocale()
  let news: Actualite[] = []
  try {
    news = await getAllActualites()
  } catch {
    // Sanity unreachable — show empty state
  }

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Actualités' : 'News'}
        subtitle={locale === 'fr' ? 'Résultats, événements et nouvelles du club.' : 'Club results, events and news.'}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {news.length === 0 ? (
          <p className="text-muted text-center py-12">Aucune actualité pour l&apos;instant.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item: Actualite) => (
              <Link
                key={item._id}
                href={`/${locale}/actualites/${item.slug.current}`}
                className="group block bg-bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-accent-blue/30 transition-colors"
              >
                <div className="relative h-52 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={urlFor(item.image).width(600).height(400).url()}
                      alt={locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent-blue/5 flex items-center justify-center">
                      <span className="font-heading text-5xl text-accent-blue/20">JB</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-muted text-xs mb-2">{formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                  <h3 className="font-heading text-lg text-foreground group-hover:text-accent-blue transition-colors leading-tight">
                    {locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                  </h3>
                  {(item.extrait || item.extraitEn) && (
                    <p className="text-muted text-sm mt-2 line-clamp-3">
                      {locale === 'fr' ? item.extrait : (item.extraitEn || item.extrait)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
