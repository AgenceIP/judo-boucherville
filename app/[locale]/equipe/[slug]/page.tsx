import { notFound } from 'next/navigation'
import { getAllInstructeurs, getInstructeurBySlug } from '@/data/instructeurs'
import InstructeurTemplate from '@/components/pages/InstructeurTemplate'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  const instructeurs = getAllInstructeurs()
  return ['fr', 'en'].flatMap(locale =>
    instructeurs.map(i => ({ locale, slug: i.slug }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const instructeur = getInstructeurBySlug(slug)
  return instructeur ? { title: instructeur.nom } : {}
}

export default async function InstructeurPage({ params }: Props) {
  const { slug, locale } = await params
  const instructeur = getInstructeurBySlug(slug)
  if (!instructeur) notFound()
  return <InstructeurTemplate instructeur={instructeur} locale={locale} />
}
