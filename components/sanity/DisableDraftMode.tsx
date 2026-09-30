'use client'
import { useIsPresentationTool } from 'next-sanity/hooks'

export default function DisableDraftMode() {
  // Inside the Studio, Presentation controls the preview itself
  if (useIsPresentationTool() !== false) return null
  return (
    // a route handler, not a page: <Link> would prefetch it and quit the preview on hover
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href="/api/draft-mode/disable" className="btn btn-primary fixed bottom-4 right-4 z-50">
      Aperçu des brouillons · Quitter
    </a>
  )
}
