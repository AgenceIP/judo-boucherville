// Counts in Sanity must equal what the migration wrote, and Amira Bousbiat has no photo.
// Run: npx tsx --env-file=.env.local scripts/migrate/check.ts
import { createClient } from '@sanity/client'
import { toDocuments } from './transform'
import { apiVersion, dataset, projectId } from '../../sanity/env'

const client = createClient({ projectId, dataset, apiVersion, token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false })
const attendu: Record<string, number> = {}
for (const d of toDocuments().docs) attendu[d._type] = (attendu[d._type] ?? 0) + 1

// no top-level await: the repo is CommonJS, so tsx compiles this file to cjs
async function main() {
  let ok = true
  for (const [type, n] of Object.entries(attendu)) {
    const vrai = await client.fetch<number>('count(*[_type == $type && !(_id in path("drafts.**"))])', { type })
    if (vrai !== n) ok = false
    console.log(`${vrai === n ? 'ok   ' : 'ÉCART'} ${type}: ${vrai}/${n}`)
  }
  const amira = await client.fetch<number>('count(*[_type == "athlete" && slug.current == "amira-bousbiat"][0].photos)')
  if (amira) ok = false
  console.log(amira ? `ÉCART Amira Bousbiat : ${amira} photo(s)` : 'ok    Amira Bousbiat : aucune photo')
  process.exit(ok ? 0 : 1)
}
main()
