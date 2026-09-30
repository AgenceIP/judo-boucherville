import { draftMode } from 'next/headers'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { stegaFilter } from './stega'

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })

// Draft mode is only ever on for people logged into the Studio: drafts, click-to-edit markers, no cache.
// The read token stays on the server; visitors never get it.
const apercu = client.withConfig({
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  perspective: 'drafts',
  stega: { enabled: true, studioUrl: '/studio', filter: stegaFilter },
})

// generateStaticParams, the sitemap and robots run outside a request: draftMode() throws there, and there is no preview
const enApercu = async () => { try { return (await draftMode()).isEnabled } catch { return false } }

/** Published content, cached 30 s: a change published in the Studio is online within a minute, with no redeploy. */
export const sanityFetch = async <T>(query: string, params: Record<string, unknown> = {}) =>
  (await enApercu())
    ? apercu.fetch<T>(query, params, { cache: 'no-store' })
    : client.fetch<T>(query, params, { next: { revalidate: 30 } })
