import { MetadataRoute } from 'next'
import { getAthleteSlugs, getClub, getInstructeurs, getProgrammes, getSaisons } from '@/lib/content'

const locales = ['fr', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ club }, programmes, instructeurs, athletes, resultats, actualites] = await Promise.all([
    getClub(), getProgrammes(), getInstructeurs(), getAthleteSlugs(), getSaisons('resultat'), getSaisons('actualite'),
  ])
  const BASE_URL = club.site
  const routes: [string, number][] = [
    ...['', '/programmes', '/inscription', '/calendrier'].map(r => [r, r ? 0.9 : 1] as [string, number]),
    ...['/historique', '/conseil', '/ceintures-noires', '/equipe', '/athletes', '/resultats', '/actualites', '/challenge', '/journaux', '/telechargements', '/contact'].map(r => [r, 0.7] as [string, number]),
    ...programmes.map(p => [`/programmes/${p.slug}`, 0.8] as [string, number]),
    ...instructeurs.map(i => [`/equipe/${i.slug}`, 0.5] as [string, number]),
    ...athletes.map(slug => [`/athletes/${slug}`, 0.4] as [string, number]),
    ...resultats.map(s => [`/resultats/${s}`, 0.4] as [string, number]),
    ...actualites.map(s => [`/actualites/${s}`, 0.4] as [string, number]),
  ]

  return locales.flatMap(locale =>
    routes.map(([route, priority]) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      priority,
      alternates: { languages: Object.fromEntries(locales.map(l => [l, `${BASE_URL}/${l}${route}`])) },
    }))
  )
}
