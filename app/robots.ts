import { MetadataRoute } from 'next'
import { club } from '@/data/club'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/studio'] }],
    sitemap: `${club.site}/sitemap.xml`,
  }
}
