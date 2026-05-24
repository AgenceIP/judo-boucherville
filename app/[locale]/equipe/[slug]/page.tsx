import { notFound } from 'next/navigation'
import { getAllInstructeurs, getInstructeurBySlug } from '@/sanity/queries/instructeurs'
import InstructeurTemplate from '@/components/pages/InstructeurTemplate'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const instructeurs = await getAllInstructeurs()
  return ['fr', 'en'].flatMap(locale =>
    instructeurs.map(i => ({ locale, slug: i.slug.current }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const instructeur = await getInstructeurBySlug(slug)
  return instructeur ? { title: instructeur.nom } : {}
}

export default async function InstructeurPage({ params }: Props) {
  const { slug, locale } = await params
  const instructeur = await getInstructeurBySlug(slug)
  if (!instructeur) notFound()
  return <InstructeurTemplate instructeur={instructeur} locale={locale} />
}
