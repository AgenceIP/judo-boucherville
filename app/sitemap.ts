import { MetadataRoute } from 'next'
import { getAllProgrammes } from '@/sanity/queries/programmes'
import { getAllInstructeurs } from '@/sanity/queries/instructeurs'

const BASE_URL = 'https://www.judoboucherville.com'
const locales = ['fr', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programmes, instructeurs] = await Promise.all([
    getAllProgrammes().catch(() => []),
    getAllInstructeurs().catch(() => []),
  ])

  const staticRoutes = ['', '/historique', '/equipe', '/programmes', '/inscription', '/resultats', '/challenge', '/actualites', '/contact']

  const staticEntries = locales.flatMap(locale =>
    staticRoutes.map(route => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const programmeEntries = locales.flatMap(locale =>
    programmes.map(p => ({
      url: `${BASE_URL}/${locale}/programmes/${p.slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  const instructeurEntries = locales.flatMap(locale =>
    instructeurs.map(i => ({
      url: `${BASE_URL}/${locale}/equipe/${i.slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  )

  return [...staticEntries, ...programmeEntries, ...instructeurEntries]
}
