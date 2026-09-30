import { notFound } from 'next/navigation'
import { getProgramme, getProgrammes } from '@/lib/content'
import ProgrammeTemplate from '@/components/pages/ProgrammeTemplate'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const programmes = await getProgrammes()
  return ['fr', 'en'].flatMap(locale => programmes.map(p => ({ locale, slug: p.slug })))
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const programme = await getProgramme(slug)
  if (!programme) return {}
  return {
    title: locale === 'fr' ? programme.titre : programme.titreEn,
    description: locale === 'fr' ? programme.resume : programme.resumeEn,
  }
}

export default async function ProgrammePage({ params }: Props) {
  const { slug, locale } = await params
  const programme = await getProgramme(slug)
  if (!programme) notFound()
  return <ProgrammeTemplate programme={programme} locale={locale} />
}
