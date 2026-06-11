import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { getLatestActualites } from '@/data/actualites'
import { formatDate } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'

export default async function NewsSection() {
  const [t, locale] = await Promise.all([getTranslations('home'), getLocale()])
  const news = getLatestActualites(3)
  if (!news.length) return null

  const [featured, ...rest] = news

  return (
    <section className="py-28 md:py-36 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <Reveal className="flex items-end justify-between mb-12 gap-6">
          <h2 className="font-heading text-[clamp(48px,8vw,100px)] text-white leading-[.9] tracking-tight">
            {t('news_title')}
          </h2>
          <Link
            href={`/${locale}/actualites`}
            className="group text-[11px] tracking-[.25em] uppercase text-muted hover:text-white transition-colors pb-2 shrink-0"
          >
            Toutes les actualités{' '}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </Reveal>

        <Reveal className="reveal-stagger grid lg:grid-cols-2 gap-px bg-white/[0.04]">
          {/* Featured article */}
          <Link
            href={`/${locale}/actualites/${featured.slug}`}
            className="group bg-bg-surface block"
          >
            <div className="relative h-72 lg:h-96 overflow-hidden bg-white/[0.02]">
              {featured.imageSrc ? (
                <Image
                  src={featured.imageSrc}
                  alt={locale === 'fr' ? featured.titre : (featured.titreEn || featured.titre)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-6xl text-royal/10">JB</span>
                </div>
              )}
            </div>
            <div className="p-6 lg:p-8">
              <p className="text-muted text-[10px] tracking-[.3em] uppercase mb-3">
                {formatDate(featured.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}
              </p>
              <h3 className="font-heading text-2xl lg:text-3xl text-white group-hover:text-royal transition-colors leading-tight">
                {locale === 'fr' ? featured.titre : (featured.titreEn || featured.titre)}
              </h3>
              {(featured.extrait || featured.extraitEn) && (
                <p className="text-muted text-sm mt-3 line-clamp-2 leading-relaxed">
                  {locale === 'fr' ? featured.extrait : (featured.extraitEn || featured.extrait)}
                </p>
              )}
            </div>
          </Link>

          {/* Secondary articles */}
          <div className="flex flex-col gap-px bg-white/[0.04]">
            {rest.map(item => (
              <Link
                key={item.id}
                href={`/${locale}/actualites/${item.slug}`}
                className="group flex gap-5 bg-bg-surface p-6 lg:p-8 flex-1 items-start"
              >
                {item.imageSrc && (
                  <div className="relative w-24 h-20 shrink-0 overflow-hidden bg-white/[0.02]">
                    <Image
                      src={item.imageSrc}
                      alt={locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-muted text-[10px] tracking-[.3em] uppercase mb-2">
                    {formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}
                  </p>
                  <h3 className="font-heading text-lg text-white group-hover:text-royal transition-colors leading-tight line-clamp-2">
                    {locale === 'fr' ? item.titre : (item.titreEn || item.titre)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  )
}
