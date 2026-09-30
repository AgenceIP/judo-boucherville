import { getPhotosSite } from '@/lib/content'
import PageHeroView, { type PageHeroProps } from './PageHeroView'

/** Server half: fetches the photos Fayçal sets in the Studio, the view animates them. */
export default async function PageHero(props: PageHeroProps) {
  return <PageHeroView {...props} photos={await getPhotosSite()} />
}
