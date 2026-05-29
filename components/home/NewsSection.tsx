import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { getLatestActualites } from '@/data/actualites'
import { formatDate } from '@/lib/utils'

export default async function NewsSection() {
  const [t, locale] = await Promise.all([getTranslations('home'), getLocale()])
  const news = getLatestActualites(3)

  if (!news.length) return null

  return (
    <section className="py-24 bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wider">
            {t('news_title')}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {news.map(item => (
            <Link
              key={item.id}
              href={`/${locale}/actualites/${item.slug}`}
              className="group block bg-bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-accent-blue/30 transition-colors"
            >
              <div className="relative h-48 overflow-hidden">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-accent-blue/10" />
                )}
              </div>
              <div className="p-5">
                <p className="text-muted text-xs mb-2">{formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                <h3 className="font-heading text-lg text-foreground group-hover:text-accent-blue transition-colors">
                  {locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                </h3>
                <p className="text-muted text-sm mt-2 line-clamp-2">
                  {locale === 'fr' ? item.extrait : (item.extraitEn || item.extrait)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
