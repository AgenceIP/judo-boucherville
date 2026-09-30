import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })

/** Published content, cached 30 s: a change published in the Studio is online within a minute, with no redeploy. */
export const sanityFetch = <T>(query: string, params: Record<string, unknown> = {}) =>
  client.fetch<T>(query, params, { next: { revalidate: 30 } })
