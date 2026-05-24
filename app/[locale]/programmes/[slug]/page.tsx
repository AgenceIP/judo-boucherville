import { notFound } from 'next/navigation'
import { getAllProgrammes, getProgrammeBySlug } from '@/sanity/queries/programmes'
import ProgrammeTemplate from '@/components/pages/ProgrammeTemplate'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const programmes = await getAllProgrammes()
  const locales = ['fr', 'en']
  return locales.flatMap(locale =>
    programmes.map(p => ({ locale, slug: p.slug.current }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const programme = await getProgrammeBySlug(slug)
  if (!programme) return {}
  return {
    title: locale === 'fr' ? programme.titre : (programme.titreEn || programme.titre),
  }
}

export default async function ProgrammePage({ params }: Props) {
  const { slug, locale } = await params
  const programme = await getProgrammeBySlug(slug)
  if (!programme) notFound()
  return <ProgrammeTemplate programme={programme} locale={locale} />
}
