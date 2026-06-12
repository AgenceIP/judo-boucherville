import { notFound } from 'next/navigation'

// Catch-all: routes that match nothing render the localized 404
// (app/[locale]/not-found.tsx) instead of Next's default page.
export default function CatchAll() {
  notFound()
}
