import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export function getPreviewClient() {
  const token = process.env.SANITY_API_READ_TOKEN
  if (!token) throw new Error('Missing env var: SANITY_API_READ_TOKEN')
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token })
}
