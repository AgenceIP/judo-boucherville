// End-to-end: the Studio loads (logged in), and a change published in Sanity shows on the page without a redeploy.
// Needs the site running on base, .env.local, npx sanity login --provider vercel, and for a Vercel preview
// its saved Vercel login (node scripts/studio-shot.mjs --login <base>).
// Run: node --env-file=.env.local scripts/e2e-cms.mjs [base]
import { chromium } from 'playwright'
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const base = process.argv[2] ?? 'http://localhost:3000'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2026-09-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
const ctx = await chromium.launchPersistentContext(fileURLToPath(new URL('./.studio-profile/', import.meta.url)), { channel: 'msedge' })
// The Studio keeps its login in localStorage: reuse the CLI's
const { authToken } = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf8'))
await ctx.addInitScript(([key, value]) => { if (location.pathname.startsWith('/studio')) localStorage.setItem(key, value) },
  [`__studio_auth_token_${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`, JSON.stringify({ token: authToken })])
const page = ctx.pages()[0] ?? await ctx.newPage()

await page.goto(`${base}/studio/structure`)
await page.getByText('Club et inscription').first().waitFor({ timeout: 60_000 })
console.log('ok  le Studio se charge')

// A visible, harmless field, put back as it was whatever happens
const { responsable } = await client.fetch('*[_id == "club"][0]{responsable}')
const marque = `${responsable} (test ${Date.now() % 10000})`
await client.patch('club').set({ responsable: marque }).commit()
try {
  const debut = Date.now()
  for (;;) {
    await page.goto(`${base}/fr/inscription`)
    if ((await page.locator('body').innerText()).includes(marque)) break
    if (Date.now() - debut > 120_000) throw new Error('changement toujours absent après 2 minutes')
    await page.waitForTimeout(5_000)
  }
  console.log(`ok  changement publié visible en ${Math.round((Date.now() - debut) / 1000)} s`)
} finally {
  await client.patch('club').set({ responsable }).commit()
  await ctx.close()
}
