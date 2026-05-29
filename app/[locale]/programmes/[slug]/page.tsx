import { notFound } from 'next/navigation'
import { getAllProgrammes, getProgrammeBySlug } from '@/data/programmes'
import ProgrammeTemplate from '@/components/pages/ProgrammeTemplate'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  const programmes = getAllProgrammes()
  return ['fr', 'en'].flatMap(locale =>
    programmes.map(p => ({ locale, slug: p.slug }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const programme = getProgrammeBySlug(slug)
  if (!programme) return {}
  return {
    title: locale === 'fr' ? programme.titre : (programme.titreEn || programme.titre),
  }
}

export default async function ProgrammePage({ params }: Props) {
  const { slug, locale } = await params
  const programme = getProgrammeBySlug(slug)
  if (!programme) notFound()
  return <ProgrammeTemplate programme={programme} locale={locale} />
}
