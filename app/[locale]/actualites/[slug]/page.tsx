import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { cache } from 'react'
import { client } from '@/sanity/client'
import PageHero from '@/components/shared/PageHero'
import PortableText from '@/components/shared/PortableText'
import Button from '@/components/ui/Button'
import { urlFor } from '@/lib/sanityImage'
import { formatDate } from '@/lib/utils'
import type { Actualite } from '@/sanity/queries/actualites'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string; slug: string }> }

const getActualiteBySlug = cache(async (slug: string): Promise<Actualite | null> => {
  return client.fetch(
    `*[_type == "actualite" && slug.current == $slug][0] {
      _id, titre, titreEn, slug, date, image, extrait, extraitEn, contenu, contenuEn
    }`,
    { slug }
  )
})

export async function generateStaticParams() {
  try {
    const items = await client.fetch<{ slug: { current: string } }[]>(
      `*[_type == "actualite"] { slug }`
    )
    return ['fr', 'en'].flatMap(locale => items.map(n => ({ locale, slug: n.slug.current })))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const item = await getActualiteBySlug(slug)
  if (!item) return {}
  return { title: locale === 'fr' ? item.titre : (item.titreEn || item.titre) }
}

export default async function ActualiteDetailPage({ params }: Props) {
  const { slug, locale } = await params
  const item = await getActualiteBySlug(slug)
  if (!item) notFound()

  const title = locale === 'fr' ? item.titre : (item.titreEn || item.titre)
  const content = locale === 'fr' ? item.contenu : (item.contenuEn || item.contenu)

  return (
    <>
      <PageHero title={title} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted text-sm mb-8">{formatDate(item.date, locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>
        {item.image && (
          <div className="relative h-72 rounded-2xl overflow-hidden mb-10">
            <Image src={urlFor(item.image).width(800).height(500).url()} alt={title} fill className="object-cover" />
          </div>
        )}
        {content && <PortableText value={content} />}
        <div className="mt-12 pt-8 border-t border-white/5">
          <Button href={`/${locale}/actualites`} variant="outline">
            {locale === 'fr' ? '← Toutes les actualités' : '← All news'}
          </Button>
        </div>
      </div>
    </>
  )
}
