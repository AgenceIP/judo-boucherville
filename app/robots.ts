import { MetadataRoute } from 'next'
import { getClub } from '@/lib/content'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { club } = await getClub()
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/studio'] }],
    sitemap: `${club.site}/sitemap.xml`,
  }
}
