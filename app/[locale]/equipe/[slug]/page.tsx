import { notFound } from 'next/navigation'
import { getInstructeur, getInstructeurs } from '@/lib/content'
import InstructeurTemplate from '@/components/pages/InstructeurTemplate'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const instructeurs = await getInstructeurs()
  return ['fr', 'en'].flatMap(locale =>
    instructeurs.map(i => ({ locale, slug: i.slug }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const instructeur = await getInstructeur(slug)
  return instructeur ? { title: instructeur.nom } : {}
}

export default async function InstructeurPage({ params }: Props) {
  const { slug, locale } = await params
  const instructeur = await getInstructeur(slug)
  if (!instructeur) notFound()
  return <InstructeurTemplate instructeur={instructeur} locale={locale} />
}
