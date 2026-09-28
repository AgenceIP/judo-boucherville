import { MetadataRoute } from 'next'
import { getAllProgrammes } from '@/data/programmes'
import { getAllInstructeurs } from '@/data/instructeurs'
import { actualites, resultats, athletes } from '@/data/archive'

const BASE_URL = 'https://www.judoboucherville.com'
const locales = ['fr', 'en']

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: [string, number][] = [
    ...['', '/programmes', '/inscription', '/calendrier'].map(r => [r, r ? 0.9 : 1] as [string, number]),
    ...['/historique', '/conseil', '/ceintures-noires', '/equipe', '/athletes', '/resultats', '/actualites', '/challenge', '/journaux', '/telechargements', '/contact'].map(r => [r, 0.7] as [string, number]),
    ...getAllProgrammes().map(p => [`/programmes/${p.slug}`, 0.8] as [string, number]),
    ...getAllInstructeurs().map(i => [`/equipe/${i.slug}`, 0.5] as [string, number]),
    ...athletes.map(a => [`/athletes/${a.slug}`, 0.4] as [string, number]),
    ...resultats.map(s => [`/resultats/${s.saison}`, 0.4] as [string, number]),
    ...actualites.map(s => [`/actualites/${s.saison}`, 0.4] as [string, number]),
  ]

  return locales.flatMap(locale =>
    routes.map(([route, priority]) => ({ url: `${BASE_URL}/${locale}${route}`, lastModified: new Date(), priority }))
  )
}
