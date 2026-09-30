// Uploads the local images, then writes every document (createOrReplace: safe to run again).
// Run: npx tsx --env-file=.env.local scripts/migrate-to-sanity.ts
import { createClient } from '@sanity/client'
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { toDocuments, withAssets } from './migrate/transform'
import { apiVersion, dataset, projectId } from '../sanity/env'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) throw new Error('SANITY_API_WRITE_TOKEN manquant dans .env.local')
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const CACHE = 'scripts/migrate/.assets.json'
const ids: Record<string, string> = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {}
const { docs, images } = toDocuments()

let n = 0
for (const src of images.keys()) {
  n++
  if (ids[src]) continue
  const asset = await client.assets.upload('image', createReadStream(`public${src}`), { filename: basename(src) })
  ids[src] = asset._id
  writeFileSync(CACHE, JSON.stringify(ids, null, 1)) // resume where it stopped if the network drops
  console.log(`image ${n}/${images.size} ${src}`)
}

const map = new Map(Object.entries(ids))
for (let i = 0; i < docs.length; i += 50) {
  const tx = client.transaction()
  for (const d of docs.slice(i, i + 50)) tx.createOrReplace(withAssets(d, map))
  await tx.commit({ visibility: 'async' })
  console.log(`documents ${Math.min(i + 50, docs.length)}/${docs.length}`)
}
console.log('migration terminée')
