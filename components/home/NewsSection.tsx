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
    <section className="py-28 md:py-36 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-14">
          <p className="text-royal text-[11px] tracking-[.4em] uppercase mb-4">Actualités</p>
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('news_title')}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {news.map(item => (
            <Link
              key={item.id}
              href={`/${locale}/actualites/${item.slug}`}
              className="group block border border-white/[0.06] hover:border-royal/30 transition-colors duration-300"
            >
              <div className="relative h-52 overflow-hidden bg-white/[0.02]">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-5xl text-royal/10">JB</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-muted text-[10px] tracking-[.3em] uppercase mb-3">
                  {formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}
                </p>
                <h3 className="font-heading text-xl text-white group-hover:text-royal transition-colors leading-tight">
                  {locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                </h3>
                {(item.extrait || item.extraitEn) && (
                  <p className="text-muted text-sm mt-3 line-clamp-2 leading-relaxed">
                    {locale === 'fr' ? item.extrait : (item.extraitEn || item.extrait)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
