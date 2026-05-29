import { MetadataRoute } from 'next'
import { getAllProgrammes } from '@/data/programmes'
import { getAllInstructeurs } from '@/data/instructeurs'
import { getAllActualites } from '@/data/actualites'

const BASE_URL = 'https://www.judoboucherville.com'
const locales = ['fr', 'en']

export default function sitemap(): MetadataRoute.Sitemap {
  const programmes = getAllProgrammes()
  const instructeurs = getAllInstructeurs()
  const actualites = getAllActualites()

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
      url: `${BASE_URL}/${locale}/programmes/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  const instructeurEntries = locales.flatMap(locale =>
    instructeurs.map(i => ({
      url: `${BASE_URL}/${locale}/equipe/${i.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  )

  const actualiteEntries = locales.flatMap(locale =>
    actualites.map(a => ({
      url: `${BASE_URL}/${locale}/actualites/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'never' as const,
      priority: 0.5,
    }))
  )

  return [...staticEntries, ...programmeEntries, ...instructeurEntries, ...actualiteEntries]
}
