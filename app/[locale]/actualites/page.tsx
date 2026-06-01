import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getAllActualites } from '@/data/actualites'
import PageHero from '@/components/shared/PageHero'
import { formatDate } from '@/lib/utils'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Actualités' : 'News' }
}

export default async function ActualitesPage() {
  const locale = await getLocale()
  const news = getAllActualites()

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Actualités' : 'News'}
        subtitle={locale === 'fr' ? 'Résultats, événements et nouvelles du club.' : 'Club results, events and news.'}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {news.length === 0 ? (
          <p className="text-muted py-12">Aucune actualité pour l&apos;instant.</p>
        ) : (
          <div>
            {news.map(item => (
              <Link
                key={item.id}
                href={`/${locale}/actualites/${item.slug}`}
                className="group flex gap-6 border-t border-white/[0.06] py-6 hover:border-royal/30 transition-colors duration-300 items-start"
              >
                {item.imageSrc && (
                  <div className="relative w-32 h-24 shrink-0 overflow-hidden bg-white/[0.02] hidden sm:block">
                    <Image
                      src={item.imageSrc}
                      alt={locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-muted text-[10px] tracking-[.25em] uppercase mb-2">
                    {formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}
                  </p>
                  <h3 className="font-heading text-xl text-white group-hover:text-royal transition-colors leading-tight mb-2">
                    {locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                  </h3>
                  {(item.extrait || item.extraitEn) && (
                    <p className="text-muted text-sm line-clamp-2 leading-relaxed">
                      {locale === 'fr' ? item.extrait : (item.extraitEn || item.extrait)}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-muted group-hover:text-royal group-hover:translate-x-1 transition-all duration-200 mt-1 hidden sm:block">→</span>
              </Link>
            ))}
            <div className="border-t border-white/[0.06]" />
          </div>
        )}
      </div>
    </>
  )
}
