import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { getActualiteBySlug, getAllActualites } from '@/data/actualites'
import PageHero from '@/components/shared/PageHero'
import RichText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  const items = getAllActualites()
  return ['fr', 'en'].flatMap(locale => items.map(n => ({ locale, slug: n.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const item = getActualiteBySlug(slug)
  if (!item) return {}
  return { title: locale === 'fr' ? item.titre : (item.titreEn || item.titre) }
}

export default async function ActualiteDetailPage({ params }: Props) {
  const { slug, locale } = await params
  const item = getActualiteBySlug(slug)
  if (!item) notFound()

  const title = locale === 'fr' ? item.titre : (item.titreEn || item.titre)
  const content = locale === 'fr' ? item.contenu : (item.contenuEn || item.contenu)

  return (
    <>
      <PageHero title={title} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted text-sm mb-8">{formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>
        {item.imageSrc && (
          <div className="relative h-72 rounded-2xl overflow-hidden mb-10">
            <Image src={item.imageSrc} alt={title} fill className="object-cover" />
          </div>
        )}
        <RichText value={content} />
        <div className="mt-12 pt-8 border-t border-white/5">
          <Button href={`/${locale}/actualites`} variant="outline">
            {locale === 'fr' ? '← Toutes les actualités' : '← All news'}
          </Button>
        </div>
      </div>
    </>
  )
}
